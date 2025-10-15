package com.example.logistics.service;

import com.example.logistics.exception.NotFoundException;
import com.example.logistics.model.Carrier;
import com.example.logistics.model.Driver;
import com.example.logistics.repo.CarrierRepository;
import com.example.logistics.repo.DriverRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DriverService {
    private final DriverRepository repo;
    private final CarrierRepository carrierRepo;

    public DriverService(DriverRepository repo, CarrierRepository carrierRepo) {
        this.repo = repo; this.carrierRepo = carrierRepo;
    }

    @Transactional(readOnly = true)
    public Driver get(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Driver " + id + " not found"));
    }

    @Transactional(readOnly = true)
    public List<Driver> listActive() { return repo.findByActiveTrue(); }

    @Transactional
    public Driver register(Long carrierId, Driver d) {
        if (repo.existsByLicenseNumber(d.getLicenseNumber()))
            throw new IllegalArgumentException("License already exists: " + d.getLicenseNumber());
        Carrier c = carrierRepo.findById(carrierId)
                .orElseThrow(() -> new NotFoundException("Carrier " + carrierId + " not found"));
        d.setCarrier(c);
        return repo.save(d);
    }

    @Transactional(readOnly = true)
    public List<Driver> expiringLicenses(LocalDate before) {
        return repo.findByLicenseValidUntilBefore(before);
    }

    @Transactional
    public Driver setActive(Long id, boolean active) {
        Driver d = get(id);
        d.setActive(active);
        return repo.save(d);
    }
}
