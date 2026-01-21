package com.agricredit.dto;

import com.agricredit.entity.WarehouseReceipt;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseReceiptResponse {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private String commodityName;
    private String variety;
    private BigDecimal quantity;
    private String unitOfMeasure;
    private String warehouseLocation;
    private String warehouseKeeperName;
    private LocalDateTime storedDate;
    private LocalDateTime expiryDate;
    private String qualityGrade;
    private String condition;
    private String remarks;
    private String receiptNumber;
    private String blockchainTransactionHash;
    private String status;

    public static WarehouseReceiptResponse fromEntity(WarehouseReceipt receipt) {
        WarehouseReceiptResponse response = new WarehouseReceiptResponse();
        response.setId(receipt.getId());
        response.setFarmerId(receipt.getFarmer().getId());
        response.setFarmerName(receipt.getFarmer().getFullName());
        response.setCommodityName(receipt.getCommodityName());
        response.setVariety(receipt.getVariety());
        response.setQuantity(receipt.getQuantity());
        response.setUnitOfMeasure(receipt.getUnitOfMeasure());
        response.setWarehouseLocation(receipt.getWarehouseLocation());
        response.setWarehouseKeeperName(receipt.getWarehouseKeeperName());
        response.setStoredDate(receipt.getStoredDate());
        response.setExpiryDate(receipt.getExpiryDate());
        response.setQualityGrade(receipt.getQualityGrade());
        response.setCondition(receipt.getCondition());
        response.setRemarks(receipt.getRemarks());
        response.setReceiptNumber(receipt.getReceiptNumber());
        response.setBlockchainTransactionHash(receipt.getBlockchainTransactionHash());
        response.setStatus(receipt.getStatus().toString());
        return response;
    }
}