package com.agricredit.service;

import com.agricredit.dto.WarehouseReceiptRequest;
import com.agricredit.dto.WarehouseReceiptResponse;
import com.agricredit.entity.User;
import com.agricredit.entity.WarehouseReceipt;
import com.agricredit.repository.UserRepository;
import com.agricredit.repository.WarehouseReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WarehouseReceiptService {

    @Autowired
    private WarehouseReceiptRepository warehouseReceiptRepository;

    @Autowired
    private UserRepository userRepository;

    public WarehouseReceiptResponse createReceipt(WarehouseReceiptRequest request) {
        User farmer = userRepository.findById(request.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        WarehouseReceipt receipt = new WarehouseReceipt();
        receipt.setFarmer(farmer);
        receipt.setCommodityName(request.getCommodityName());
        receipt.setVariety(request.getVariety());
        receipt.setQuantity(request.getQuantity());
        receipt.setUnitOfMeasure(request.getUnitOfMeasure());
        receipt.setWarehouseLocation(request.getWarehouseLocation());
        receipt.setWarehouseKeeperName(request.getWarehouseKeeperName());
        receipt.setStoredDate(LocalDateTime.now());
        receipt.setStatus(WarehouseReceipt.ReceiptStatus.ACTIVE);
        
        // Set expiry date if provided
        if (request.getExpiryDate() != null) {
            receipt.setExpiryDate(request.getExpiryDate());
        }
        
        receipt.setQualityGrade(request.getQualityGrade());
        receipt.setCondition(request.getCondition());
        receipt.setRemarks(request.getRemarks());
        
        // Generate receipt number
        receipt.setReceiptNumber("WR-" + System.currentTimeMillis());
        
        // Mock blockchain integration
        receipt.setBlockchainTransactionHash(generateBlockchainTransactionHash(receipt));

        WarehouseReceipt savedReceipt = warehouseReceiptRepository.save(receipt);
        return WarehouseReceiptResponse.fromEntity(savedReceipt);
    }

    public WarehouseReceiptResponse updateReceiptStatus(Long receiptId, WarehouseReceipt.ReceiptStatus status) {
        WarehouseReceipt receipt = warehouseReceiptRepository.findById(receiptId)
                .orElseThrow(() -> new RuntimeException("Warehouse receipt not found"));

        receipt.setStatus(status);
        
        if (status == WarehouseReceipt.ReceiptStatus.RELEASED) {
            receipt.setExpiryDate(LocalDateTime.now());
        } else if (status == WarehouseReceipt.ReceiptStatus.CANCELLED) {
            receipt.setExpiryDate(LocalDateTime.now());
        }

        WarehouseReceipt updatedReceipt = warehouseReceiptRepository.save(receipt);
        return WarehouseReceiptResponse.fromEntity(updatedReceipt);
    }

    public List<WarehouseReceiptResponse> getReceiptsByFarmer(Long farmerId) {
        User farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
                
        List<WarehouseReceipt> receipts = warehouseReceiptRepository.findByFarmer(farmer);
        return receipts.stream()
                .map(WarehouseReceiptResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<WarehouseReceiptResponse> getActiveReceipts() {
        List<WarehouseReceipt> receipts = warehouseReceiptRepository.findByStatus(WarehouseReceipt.ReceiptStatus.ACTIVE);
        return receipts.stream()
                .map(WarehouseReceiptResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<WarehouseReceiptResponse> getReceiptsByStatus(WarehouseReceipt.ReceiptStatus status) {
        List<WarehouseReceipt> receipts = warehouseReceiptRepository.findByStatus(status);
        return receipts.stream()
                .map(WarehouseReceiptResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public WarehouseReceiptResponse getReceiptById(Long receiptId) {
        WarehouseReceipt receipt = warehouseReceiptRepository.findById(receiptId)
                .orElseThrow(() -> new RuntimeException("Warehouse receipt not found"));
        
        return WarehouseReceiptResponse.fromEntity(receipt);
    }

    public List<WarehouseReceiptResponse> getAllReceipts() {
        List<WarehouseReceipt> receipts = warehouseReceiptRepository.findAll();
        return receipts.stream()
                .map(WarehouseReceiptResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private String generateBlockchainTransactionHash(WarehouseReceipt receipt) {
        // Mock blockchain transaction hash generation
        String data = receipt.getFarmer().getId() + "_" + 
                     receipt.getCommodityName() + "_" + 
                     receipt.getStoredDate().toString() + "_" +
                     receipt.getQuantity().toString();
        return "0x" + java.util.UUID.nameUUIDFromBytes(data.getBytes()).toString().replace("-", "");
    }
}