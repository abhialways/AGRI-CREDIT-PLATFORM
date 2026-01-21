package com.agricredit.controller;

import com.agricredit.dto.AuthRequest;
import com.agricredit.dto.AuthResponse;
import com.agricredit.dto.OtpRequest;
import com.agricredit.entity.User;
import com.agricredit.service.UserService;
import com.agricredit.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Random random = new SecureRandom();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(),
                            authRequest.getPassword()
                    )
            );

            // Generate OTP for additional security
            String otp = generateOTP();
            
            User user = (User) authentication.getPrincipal();
            user.setOtp(otp);
            user.setOtpExpiryTime(Instant.now().plusSeconds(300).toEpochMilli()); // 5 minutes expiry
            userService.saveUser(user);

            // Return user info with OTP requirement
            Map<String, Object> response = new HashMap<>();
            response.put("message", "OTP sent to user. Please verify.");
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("role", user.getRole().name());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest otpRequest) {
        User user = userService.findByUsername(otpRequest.getUsername())
                .orElse(null);

        if (user == null || user.getOtp() == null) {
            return ResponseEntity.badRequest().body("Invalid user or OTP not generated");
        }

        if (!user.getOtp().equals(otpRequest.getOtp())) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        if (Instant.now().toEpochMilli() > user.getOtpExpiryTime()) {
            return ResponseEntity.badRequest().body("OTP has expired");
        }

        // Clear OTP after successful verification
        user.setOtp(null);
        user.setOtpExpiryTime(null);
        userService.saveUser(user);

        // Generate JWT tokens
        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateToken(user); // In a real app, you'd store refresh tokens securely

        AuthResponse authResponse = new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                user.getId(),
                user.getUsername(),
                user.getRole().name()
        );

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Check if username or email already exists
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set default active status
        user.setIsActive(true);

        User savedUser = userService.saveUser(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("userId", savedUser.getId());
        response.put("username", savedUser.getUsername());
        response.put("role", savedUser.getRole().name());

        return ResponseEntity.ok(response);
    }

    private String generateOTP() {
        int otp = random.nextInt(900000) + 100000; // Generate 6-digit OTP
        return String.valueOf(otp);
    }
}