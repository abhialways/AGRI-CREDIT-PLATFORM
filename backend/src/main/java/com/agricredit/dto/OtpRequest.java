package com.agricredit.dto;

import lombok.Data;

@Data
public class OtpRequest {
    private String username;
    private String otp;
}