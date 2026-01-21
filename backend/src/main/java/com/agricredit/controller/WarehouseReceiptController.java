package com.agricredit.controller;

import com.agricredit.dto.WarehouseReceiptRequest;
import com.agricredit.dto.WarehouseReceiptResponse;
import com.agricredit.entity.WarehouseReceipt;
import com.agricredit.service.WarehouseReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouse")
@CrossOrigin(origins = "*")
public class WarehouseReceiptController {

    @Autowired
    private WarehouseReceiptService warehouseReceiptService;

    @PostMapping("/receipts")
    public ResponseEntity<WarehouseReceiptResponse> createReceipt(@RequestBody WarehouseReceiptRequest request) {
        WarehouseReceiptResponse response = warehouseReceiptService.createReceipt(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/receipts/{receiptId}/status")
    public ResponseEntity<WarehouseReceiptResponse> updateReceiptStatus(
            @PathVariable Long receiptId, 
            @RequestParam WarehouseReceipt.ReceiptStatus status) {
        WarehouseReceiptResponse response = warehouseReceiptService.updateReceiptStatus(receiptId, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/receipts/farmer/{farmerId}")
    public ResponseEntity<List<WarehouseReceiptResponse>> getReceiptsByFarmer(@PathVariable Long farmerId) {
        List<WarehouseReceiptResponse> receipts = warehouseReceiptService.getReceiptsByFarmer(farmerId);
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/receipts/active")
    public ResponseEntity<List<WarehouseReceiptResponse>> getActiveReceipts() {
        List<WarehouseReceiptResponse> receipts = warehouseReceiptService.getActiveReceipts();
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/receipts/status/{status}")
    public ResponseEntity<List<WarehouseReceiptResponse>> getReceiptsByStatus(@PathVariable WarehouseReceipt.ReceiptStatus status) {
        List<WarehouseReceiptResponse> receipts = warehouseReceiptService.getReceiptsByStatus(status);
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/receipts/{receiptId}")
    public ResponseEntity<WarehouseReceiptResponse> getReceiptById(@PathVariable Long receiptId) {
        WarehouseReceiptResponse receipt = warehouseReceiptService.getReceiptById(receiptId);
        return ResponseEntity.ok(receipt);
    }

    @GetMapping("/receipts")
    public ResponseEntity<List<WarehouseReceiptResponse>> getAllReceipts() {
        List<WarehouseReceiptResponse> receipts = warehouseReceiptService.getAllReceipts();
        return ResponseEntity.ok(receipts);
    }
}