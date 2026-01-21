package com.agricredit.dto;

import com.agricredit.entity.Loan;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanResponse {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private Long lenderId;
    private String lenderName;
    private BigDecimal amount;
    private String purpose;
    private Double interestRate;
    private Integer durationInMonths;
    private String status;
    private LocalDateTime appliedDate;
    private LocalDateTime approvedDate;
    private LocalDateTime disbursementDate;
    private LocalDateTime dueDate;
    private LocalDateTime closedDate;
    private String remarks;
    private String blockchainTransactionHash;

    public static LoanResponse fromEntity(Loan loan) {
        LoanResponse response = new LoanResponse();
        response.setId(loan.getId());
        response.setFarmerId(loan.getFarmer().getId());
        response.setFarmerName(loan.getFarmer().getFullName());
        if (loan.getLender() != null) {
            response.setLenderId(loan.getLender().getId());
            response.setLenderName(loan.getLender().getFullName());
        }
        response.setAmount(loan.getAmount());
        response.setPurpose(loan.getPurpose());
        response.setInterestRate(loan.getInterestRate());
        response.setDurationInMonths(loan.getDurationInMonths());
        response.setStatus(loan.getStatus().toString());
        response.setAppliedDate(loan.getAppliedDate());
        response.setApprovedDate(loan.getApprovedDate());
        response.setDisbursementDate(loan.getDisbursementDate());
        response.setDueDate(loan.getDueDate());
        response.setClosedDate(loan.getClosedDate());
        response.setRemarks(loan.getRemarks());
        response.setBlockchainTransactionHash(loan.getBlockchainTransactionHash());
        return response;
    }
}