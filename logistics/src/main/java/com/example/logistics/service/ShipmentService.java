package com.example.logistics.service;

import com.example.logistics.exception.NotFoundException;
import com.example.logistics.model.*;
import com.example.logistics.repo.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Service
public class ShipmentService {
    private final ShipmentRepository repo;
    private final ClientRepository clientRepo;
    private final CarrierRepository carrierRepo;
    private final VehicleRepository vehicleRepo;
    private final DriverRepository driverRepo;
    private final ShipmentStatusHistoryRepository historyRepo;

    public ShipmentService(ShipmentRepository repo,
                           ClientRepository clientRepo,
                           CarrierRepository carrierRepo,
                           VehicleRepository vehicleRepo,
                           DriverRepository driverRepo,
                           ShipmentStatusHistoryRepository historyRepo) {
        this.repo = repo;
        this.clientRepo = clientRepo;
        this.carrierRepo = carrierRepo;
        this.vehicleRepo = vehicleRepo;
        this.driverRepo = driverRepo;
        this.historyRepo = historyRepo;
    }

    @Transactional(readOnly = true)
    public Page<Shipment> list(Long clientId, Long carrierId, List<ShipmentStatus> statuses, Pageable pageable) {
        if (clientId != null) return new org.springframework.data.domain.PageImpl<>(repo.findByClient_Id(clientId));
        if (carrierId != null) return new org.springframework.data.domain.PageImpl<>(repo.findByCarrier_Id(carrierId));
        if (statuses != null && !statuses.isEmpty()) return new org.springframework.data.domain.PageImpl<>(repo.findByStatusIn(statuses));
        return repo.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Shipment get(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Shipment " + id + " not found"));
    }

    @Transactional
    public Shipment create(Long clientId, Long carrierId,
                           String pickupAddr, String deliveryAddr,
                           String cargoDesc, BigDecimal cargoWeight,
                           OffsetDateTime pickupAt, OffsetDateTime deliveryAt,
                           BigDecimal price) {
        Client client = clientRepo.findById(clientId).orElseThrow(() -> new NotFoundException("Client " + clientId + " not found"));
        Carrier carrier = carrierRepo.findById(carrierId).orElseThrow(() -> new NotFoundException("Carrier " + carrierId + " not found"));

        if (deliveryAt.isBefore(pickupAt)) throw new IllegalArgumentException("planned_delivery_at must be after planned_pickup_at");
        if (cargoWeight.signum() <= 0)     throw new IllegalArgumentException("cargo_weight must be positive");

        Shipment s = new Shipment();
        s.setClient(client);
        s.setCarrier(carrier);
        s.setPickupAddress(pickupAddr);
        s.setDeliveryAddress(deliveryAddr);
        s.setCargoDescription(cargoDesc);
        s.setCargoWeight(cargoWeight);
        s.setPlannedPickupAt(pickupAt);
        s.setPlannedDeliveryAt(deliveryAt);
        s.setPrice(price != null ? price : BigDecimal.ZERO);
        s.setStatus(ShipmentStatus.NEW);

        Shipment saved = repo.save(s);

        // первая запись в историю — на случай, если триггера нет/отключён
        ShipmentStatusHistory h = new ShipmentStatusHistory();
        h.setShipment(saved);
        h.setStatus(saved.getStatus());
        h.setNote("created");
        historyRepo.save(h);

        return saved;
    }

    @Transactional
    public Shipment assign(Long shipmentId, Long vehicleId, Long driverId) {
        Shipment s = get(shipmentId);
        if (vehicleId != null) {
            Vehicle v = vehicleRepo.findById(vehicleId).orElseThrow(() -> new NotFoundException("Vehicle " + vehicleId + " not found"));
            s.setVehicle(v);
        }
        if (driverId != null) {
            Driver d = driverRepo.findById(driverId).orElseThrow(() -> new NotFoundException("Driver " + driverId + " not found"));
            s.setDriver(d);
        }
        // при назначении переводим в ASSIGNED (если был NEW)
        if (s.getStatus() == ShipmentStatus.NEW) {
            s.setStatus(ShipmentStatus.ASSIGNED);
            logHistory(s, "assigned");
        }
        return repo.save(s);
    }

    @Transactional
    public Shipment changeStatus(Long shipmentId, ShipmentStatus newStatus, Long changedByUserId, String note) {
        Shipment s = get(shipmentId);
        if (s.getStatus() == newStatus) return s;
        s.setStatus(newStatus);
        Shipment saved = repo.save(s);

        ShipmentStatusHistory h = new ShipmentStatusHistory();
        h.setShipment(saved);
        h.setStatus(newStatus);
        h.setNote(note);
        if (changedByUserId != null) {
            AppUser u = new AppUser(); // лениво, без загрузки; можно загрузить из репо при необходимости
            u.setId(changedByUserId);
            h.setChangedBy(u);
        }
        historyRepo.save(h);
        return saved;
    }

    @Transactional
    public Shipment setVehicle(Long shipmentId, Long vehicleId) {
        Shipment s = get(shipmentId);
        Vehicle v = vehicleRepo.findById(vehicleId).orElseThrow(() -> new NotFoundException("Vehicle " + vehicleId + " not found"));
        s.setVehicle(v);
        return repo.save(s);
    }

    @Transactional
    public Shipment setDriver(Long shipmentId, Long driverId) {
        Shipment s = get(shipmentId);
        Driver d = driverRepo.findById(driverId).orElseThrow(() -> new NotFoundException("Driver " + driverId + " not found"));
        s.setDriver(d);
        return repo.save(s);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Shipment " + id + " not found");
        repo.deleteById(id);
    }

    private void logHistory(Shipment s, String note) {
        ShipmentStatusHistory h = new ShipmentStatusHistory();
        h.setShipment(s);
        h.setStatus(s.getStatus());
        h.setNote(note);
        historyRepo.save(h);
    }
}
