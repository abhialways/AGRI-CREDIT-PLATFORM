package com.agricredit.controller;

import com.agricredit.dto.LoanRequest;
import com.agricredit.dto.LoanResponse;
import com.agricredit.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "*")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @PostMapping("/apply")
    public ResponseEntity<LoanResponse> applyForLoan(@RequestBody LoanRequest loanRequest) {
        LoanResponse response = loanService.applyForLoan(loanRequest);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{loanId}/approve")
    public ResponseEntity<LoanResponse> approveLoan(@PathVariable Long loanId, @RequestParam Long lenderId) {
        LoanResponse response = loanService.approveLoan(loanId, lenderId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{loanId}/reject")
    public ResponseEntity<LoanResponse> rejectLoan(@PathVariable Long loanId, @RequestParam String remarks) {
        LoanResponse response = loanService.rejectLoan(loanId, remarks);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{loanId}/disburse")
    public ResponseEntity<LoanResponse> disburseLoan(@PathVariable Long loanId) {
        LoanResponse response = loanService.disburseLoan(loanId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<LoanResponse>> getLoansByFarmer(@PathVariable Long farmerId) {
        List<LoanResponse> loans = loanService.getLoansByFarmer(farmerId);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/lender/{lenderId}")
    public ResponseEntity<List<LoanResponse>> getLoansByLender(@PathVariable Long lenderId) {
        List<LoanResponse> loans = loanService.getLoansByLender(lenderId);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/{loanId}")
    public ResponseEntity<LoanResponse> getLoanById(@PathVariable Long loanId) {
        LoanResponse loan = loanService.getLoanById(loanId);
        return ResponseEntity.ok(loan);
    }

    @GetMapping
    public ResponseEntity<List<LoanResponse>> getAllLoans() {
        List<LoanResponse> loans = loanService.getAllLoans();
        return ResponseEntity.ok(loans);
    }
}