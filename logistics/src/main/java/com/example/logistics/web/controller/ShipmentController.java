package com.example.logistics.web.controller;

import com.example.logistics.model.Shipment;
import com.example.logistics.model.ShipmentStatus;
import com.example.logistics.service.ShipmentService;
import com.example.logistics.web.dto.ShipmentAssignRequestDto;
import com.example.logistics.web.dto.ShipmentChangeStatusRequestDto;
import com.example.logistics.web.dto.ShipmentCreateRequestDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {
    private final ShipmentService service;

    public ShipmentController(ShipmentService service) {
        this.service = service;
    }
    @GetMapping
    public List<Shipment> list(
            @RequestParam(required = false) Long clientId,
            @RequestParam(required = false) Long carrierId,
            @RequestParam(required = false, name = "statuses") List<ShipmentStatus> statuses
    ) {
        return service.list(clientId, carrierId, statuses);
    }


    @GetMapping("/{id}")
    public Shipment get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public Shipment create(@RequestBody @Valid ShipmentCreateRequestDto req) {
        return service.create(
                req.clientId(), req.carrierId(),
                req.pickupAddress(), req.deliveryAddress(),
                req.cargoDescription(), req.cargoWeight(),
                req.plannedPickupAt(), req.plannedDeliveryAt(),
                req.price()
        );
    }

    @PatchMapping("/{id}/assign")
    public Shipment assign(@PathVariable Long id, @RequestBody @Valid ShipmentAssignRequestDto req) {
        return service.assign(id, req.vehicleId(), req.driverId());
    }

    @PatchMapping("/{id}/status")
    public Shipment changeStatus(@PathVariable Long id, @RequestBody @Valid ShipmentChangeStatusRequestDto req) {
        return service.changeStatus(id, req.status(), req.changedByUserId(), req.note());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
