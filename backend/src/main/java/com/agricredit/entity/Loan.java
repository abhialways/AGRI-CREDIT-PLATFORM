package com.agricredit.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lender_id")
    private User lender;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(nullable = false)
    private String purpose;
    
    @Column(nullable = false)
    private Double interestRate;
    
    @Column(nullable = false)
    private Integer durationInMonths;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanStatus status;
    
    @Column(nullable = false)
    private LocalDateTime appliedDate;
    
    @Column
    private LocalDateTime approvedDate;
    
    @Column
    private LocalDateTime disbursementDate;
    
    @Column
    private LocalDateTime dueDate;
    
    @Column
    private LocalDateTime closedDate;
    
    @Column(length = 1000)
    private String remarks;
    
    @Column
    private String blockchainTransactionHash;
    
    public enum LoanStatus {
        PENDING, APPROVED, REJECTED, DISBURSED, CLOSED, DEFAULTED
    }
}