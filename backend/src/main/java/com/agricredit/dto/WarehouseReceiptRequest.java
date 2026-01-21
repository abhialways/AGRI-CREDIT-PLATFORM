package com.agricredit.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class WarehouseReceiptRequest {
    private Long farmerId;
    private String commodityName;
    private String variety;
    private BigDecimal quantity;
    private String unitOfMeasure;
    private String warehouseLocation;
    private String warehouseKeeperName;
    private String qualityGrade;
    private String condition;
    private String remarks;
}