package com.agricredit.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "warehouse_receipts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseReceipt {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;
    
    @Column(nullable = false)
    private String commodityName;
    
    @Column(nullable = false)
    private String variety;
    
    @Column(nullable = false)
    private BigDecimal quantity;
    
    @Column(nullable = false)
    private String unitOfMeasure; // kg, ton, quintal, etc.
    
    @Column(nullable = false)
    private String warehouseLocation;
    
    @Column(nullable = false)
    private String warehouseKeeperName;
    
    @Column(nullable = false)
    private LocalDateTime storedDate;
    
    @Column
    private LocalDateTime expiryDate;
    
    @Column
    private String qualityGrade;
    
    @Column
    private String condition;
    
    @Column(length = 1000)
    private String remarks;
    
    @Column
    private String receiptNumber;
    
    @Column
    private String blockchainTransactionHash;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReceiptStatus status;
    
    public enum ReceiptStatus {
        ACTIVE, RELEASED, EXPIRED, CANCELLED
    }
}