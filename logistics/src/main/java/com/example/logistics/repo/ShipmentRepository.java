package com.example.logistics.repo;

import com.example.logistics.model.Shipment;
import com.example.logistics.model.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.OffsetDateTime;
import java.util.List;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByClient_Id(Long clientId);
    List<Shipment> findByCarrier_Id(Long carrierId);
    List<Shipment> findByStatus(ShipmentStatus status);
    List<Shipment> findByStatusIn(List<ShipmentStatus> statuses);

    List<Shipment> findByPlannedPickupAtBetween(OffsetDateTime from, OffsetDateTime to);

    // пример лёгкого «овервью»: подтянуть сразу имена связей (JPQL, без DTO)
    @Query("""
           select s from Shipment s
             left join fetch s.vehicle
             left join fetch s.driver
             join fetch s.client
             join fetch s.carrier
           where s.id = :id
           """)
    Shipment fetchGraphById(Long id);
}
