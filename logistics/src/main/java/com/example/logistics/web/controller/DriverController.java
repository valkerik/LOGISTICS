package com.example.logistics.web.controller;

import com.example.logistics.model.Driver;
import com.example.logistics.service.DriverService;
import com.example.logistics.web.dto.DriverCreateRequestDto;
import com.example.logistics.web.dto.DriverSetActiveRequestDto;
import com.example.logistics.web.dto.DriverUpdateRequestDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {
    private final DriverService driverService;
    public DriverController(DriverService service) { this.driverService = service; }

    @GetMapping("/{id}")
    public Driver get(@PathVariable Long id) { return driverService.get(id); }

    @GetMapping
    public List<Driver> listActive() { return driverService.listActive(); }

    @GetMapping("/expiring")
    public List<Driver> expiring(@RequestParam("before") LocalDate before) {
        return driverService.expiringLicenses(before);
    }

    @PostMapping
    public Driver create(@RequestBody @Valid DriverCreateRequestDto req) {
        Driver d = new Driver();
        d.setFullName(req.fullName()); d.setLicenseNumber(req.licenseNumber());
        d.setLicenseValidUntil(req.licenseValidUntil()); d.setPhone(req.phone()); d.setActive(true);
        return driverService.register(req.carrierId(), d);
    }
    @PutMapping("/{id}")
    public Driver update(@PathVariable Long id, @RequestBody @Valid DriverUpdateRequestDto req) {
        return driverService.update(id, req);
    }

    @PatchMapping("/{id}/active")
    public Driver setActive(@PathVariable Long id, @RequestBody @Valid DriverSetActiveRequestDto req) {
        return driverService.setActive(id, req.active());
    }
}
