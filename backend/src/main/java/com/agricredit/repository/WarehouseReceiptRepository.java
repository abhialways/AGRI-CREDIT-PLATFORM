package com.agricredit.repository;

import com.agricredit.entity.WarehouseReceipt;
import com.agricredit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarehouseReceiptRepository extends JpaRepository<WarehouseReceipt, Long> {
    List<WarehouseReceipt> findByFarmer(User farmer);
    List<WarehouseReceipt> findByStatus(WarehouseReceipt.ReceiptStatus status);
    List<WarehouseReceipt> findByFarmerAndStatus(User farmer, WarehouseReceipt.ReceiptStatus status);
    List<WarehouseReceipt> findByWarehouseLocation(String warehouseLocation);
}