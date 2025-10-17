package com.example.logistics.web.controller;

import com.example.logistics.model.Vehicle;
import com.example.logistics.model.VehicleType;
import com.example.logistics.service.VehicleService;
import com.example.logistics.web.dto.VehicleCreateRequestDto;
import com.example.logistics.web.dto.VehicleSetActiveRequestDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    private final VehicleService service;
    public VehicleController(VehicleService service) { this.service = service; }

    @GetMapping
    public List<Vehicle> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public Vehicle get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    public Vehicle create(@RequestBody @Valid VehicleCreateRequestDto req) {
        Vehicle v = new Vehicle();
        v.setPlateNo(req.plateNo()); v.setVin(req.vin());
        v.setMake(req.make()); v.setModel(req.model()); v.setYear(req.year());
        v.setCapacityKg(req.capacityKg()); v.setType(req.type()); v.setActive(true);
        return service.register(req.carrierId(), v);
    }

    @PatchMapping("/{id}/active")
    public Vehicle setActive(@PathVariable Long id, @RequestBody @Valid VehicleSetActiveRequestDto req) {
        return service.setActive(id, req.active());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
