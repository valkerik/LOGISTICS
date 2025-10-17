package com.example.logistics.service;

import com.example.logistics.exception.NotFoundException;
import com.example.logistics.model.Carrier;
import com.example.logistics.model.Driver;
import com.example.logistics.repo.CarrierRepository;
import com.example.logistics.repo.DriverRepository;
import com.example.logistics.web.dto.DriverUpdateRequestDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DriverService {
    private final DriverRepository driverRepository;
    private final CarrierRepository carrierRepo;

    public DriverService(DriverRepository repo, CarrierRepository carrierRepo) {
        this.driverRepository = repo; this.carrierRepo = carrierRepo;
    }

    @Transactional(readOnly = true)
    public Driver get(Long id) {
        return driverRepository.findById(id).orElseThrow(() -> new NotFoundException("Driver " + id + " not found"));
    }

    @Transactional(readOnly = true)
    public List<Driver> listActive() { return driverRepository.findByActiveTrue(); }

    @Transactional
    public Driver register(Long carrierId, Driver d) {
        if (driverRepository.existsByLicenseNumber(d.getLicenseNumber()))
            throw new IllegalArgumentException("License already exists: " + d.getLicenseNumber());
        Carrier c = carrierRepo.findById(carrierId)
                .orElseThrow(() -> new NotFoundException("Carrier " + carrierId + " not found"));
        d.setCarrier(c);
        return driverRepository.save(d);
    }

    @Transactional(readOnly = true)
    public List<Driver> expiringLicenses(LocalDate before) {
        return driverRepository.findByLicenseValidUntilBefore(before);
    }

    @Transactional
    public Driver setActive(Long id, boolean active) {
        Driver d = get(id);
        d.setActive(active);
        return driverRepository.save(d);
    }

    @Transactional
    public Driver update(Long id, DriverUpdateRequestDto req) {
        Driver d = get(id);

        // уникальность номера прав
        if (!d.getLicenseNumber().equals(req.licenseNumber())
                && driverRepository.existsByLicenseNumber(req.licenseNumber())) {
            throw new IllegalArgumentException("License already exists: " + req.licenseNumber());
        }

        // смена перевозчика при необходимости
        if (!d.getCarrier().getId().equals(req.carrierId())) {
            Carrier c = carrierRepo.findById(req.carrierId())
                    .orElseThrow(() -> new NotFoundException("Carrier " + req.carrierId() + " not found"));
            d.setCarrier(c);
        }

        d.setFullName(req.fullName());
        d.setLicenseNumber(req.licenseNumber());
        d.setLicenseValidUntil(req.licenseValidUntil());
        d.setPhone(req.phone());
        if (req.active() != null) d.setActive(req.active());

        return driverRepository.save(d);
    }

}
