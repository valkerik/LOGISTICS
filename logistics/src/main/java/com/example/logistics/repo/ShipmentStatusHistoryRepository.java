package com.example.logistics.repo;

import com.example.logistics.model.ShipmentStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShipmentStatusHistoryRepository extends JpaRepository<ShipmentStatusHistory, Long> {
    List<ShipmentStatusHistory> findByShipment_IdOrderByChangedAtDesc(Long shipmentId);
    Optional<ShipmentStatusHistory> findFirstByShipment_IdOrderByChangedAtDesc(Long shipmentId);
}
