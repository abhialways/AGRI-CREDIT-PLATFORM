package com.agricredit.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LoanRequest {
    private Long farmerId;
    private BigDecimal amount;
    private String purpose;
    private Double interestRate;
    private Integer durationInMonths;
}