// ShipmentRepository.java
package com.example.logistics.repo;

import com.example.logistics.model.Shipment;
import com.example.logistics.model.ShipmentStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    @EntityGraph(attributePaths = {"client","carrier","vehicle","driver"})
    List<Shipment> findAll();

    @EntityGraph(attributePaths = {"client"})
    Optional<Shipment> findById(Long id);

    @EntityGraph(attributePaths = {"client"})
    List<Shipment> findByClient_Id(Long clientId);

    @EntityGraph(attributePaths = {"client","carrier","vehicle","driver"})
    List<Shipment> findByCarrier_Id(Long carrierId);

    @EntityGraph(attributePaths = {"client","carrier","vehicle","driver"})
    List<Shipment> findByStatusIn(List<ShipmentStatus> statuses);

    List<Shipment> findByPlannedPickupAtBetween(OffsetDateTime from, OffsetDateTime to);
}
