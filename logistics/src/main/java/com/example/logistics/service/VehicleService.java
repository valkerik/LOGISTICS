package com.example.logistics.service;

import com.example.logistics.exception.NotFoundException;
import com.example.logistics.model.Carrier;
import com.example.logistics.model.Vehicle;
import com.example.logistics.repo.CarrierRepository;
import com.example.logistics.repo.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleService {
    private final VehicleRepository repo;
    private final CarrierRepository carrierRepo;

    public VehicleService(VehicleRepository repo, CarrierRepository carrierRepo) {
        this.repo = repo; this.carrierRepo = carrierRepo;
    }

    @Transactional(readOnly = true)
    public List<Vehicle> list() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Vehicle get(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Vehicle " + id + " not found"));
    }

    @Transactional
    public Vehicle register(Long carrierId, Vehicle v) {
        Carrier carrier = carrierRepo.findById(carrierId)
                .orElseThrow(() -> new NotFoundException("Carrier " + carrierId + " not found"));
        if (repo.existsByPlateNo(v.getPlateNo()))
            throw new IllegalArgumentException("Vehicle plate exists: " + v.getPlateNo());
        v.setCarrier(carrier);
        return repo.save(v);
    }

    @Transactional
    public Vehicle setActive(Long id, boolean active) {
        Vehicle v = get(id);
        v.setActive(active);
        return repo.save(v);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Vehicle " + id + " not found");
        repo.deleteById(id);
    }
}
