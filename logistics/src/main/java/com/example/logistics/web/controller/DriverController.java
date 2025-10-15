package com.example.logistics.web.controller;

import com.example.logistics.model.Driver;
import com.example.logistics.service.DriverService;
import com.example.logistics.web.dto.DriverCreateRequestDto;
import com.example.logistics.web.dto.DriverSetActiveRequestDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {
    private final DriverService service;
    public DriverController(DriverService service) { this.service = service; }

    @GetMapping("/{id}")
    public Driver get(@PathVariable Long id) { return service.get(id); }

    @GetMapping
    public List<Driver> listActive() { return service.listActive(); }

    @GetMapping("/expiring")
    public List<Driver> expiring(@RequestParam("before") LocalDate before) {
        return service.expiringLicenses(before);
    }

    @PostMapping
    public Driver create(@RequestBody @Valid DriverCreateRequestDto req) {
        Driver d = new Driver();
        d.setFullName(req.fullName()); d.setLicenseNumber(req.licenseNumber());
        d.setLicenseValidUntil(req.licenseValidUntil()); d.setPhone(req.phone()); d.setActive(true);
        return service.register(req.carrierId(), d);
    }

    @PatchMapping("/{id}/active")
    public Driver setActive(@PathVariable Long id, @RequestBody @Valid DriverSetActiveRequestDto req) {
        return service.setActive(id, req.active());
    }
}
