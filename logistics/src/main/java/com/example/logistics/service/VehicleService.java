package com.example.logistics.service;

import com.example.logistics.exception.NotFoundException;
import com.example.logistics.model.Carrier;
import com.example.logistics.model.Vehicle;
import com.example.logistics.repo.CarrierRepository;
import com.example.logistics.repo.VehicleRepository;
import com.example.logistics.web.dto.VehicleUpdateRequestDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    private final CarrierRepository carrierRepo;

    public VehicleService(VehicleRepository repo, CarrierRepository carrierRepo) {
        this.vehicleRepository = repo; this.carrierRepo = carrierRepo;
    }

    @Transactional(readOnly = true)
    public List<Vehicle> list() {
        return vehicleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Vehicle get(Long id) {
        return vehicleRepository.findById(id).orElseThrow(() -> new NotFoundException("Vehicle " + id + " not found"));
    }

    @Transactional
    public Vehicle register(Long carrierId, Vehicle v) {
        Carrier carrier = carrierRepo.findById(carrierId)
                .orElseThrow(() -> new NotFoundException("Carrier " + carrierId + " not found"));
        if (vehicleRepository.existsByPlateNo(v.getPlateNo()))
            throw new IllegalArgumentException("Vehicle plate exists: " + v.getPlateNo());
        v.setCarrier(carrier);
        return vehicleRepository.save(v);
    }

    @Transactional
    public Vehicle setActive(Long id, boolean active) {
        Vehicle v = get(id);
        v.setActive(active);
        return vehicleRepository.save(v);
    }

    // VehicleService.java
    @Transactional
    public Vehicle update(Long id, VehicleUpdateRequestDto req) {
        Vehicle v = get(id);

        // plate уникален
        if (!v.getPlateNo().equals(req.plateNo()) && vehicleRepository.existsByPlateNo(req.plateNo())) {
            throw new IllegalArgumentException("Vehicle plate exists: " + req.plateNo());
        }
        // vin уникален (если заполнен)
        if (req.vin() != null && !req.vin().isBlank()) {
            if (v.getVin() == null || !v.getVin().equals(req.vin())) {
                if (vehicleRepository.existsByVin(req.vin())) {
                    throw new IllegalArgumentException("VIN exists: " + req.vin());
                }
            }
        }

        // смена перевозчика
        if (!v.getCarrier().getId().equals(req.carrierId())) {
            Carrier c = carrierRepo.findById(req.carrierId())
                    .orElseThrow(() -> new NotFoundException("Carrier " + req.carrierId() + " not found"));
            v.setCarrier(c);
        }

        v.setPlateNo(req.plateNo());
        v.setVin(req.vin());
        v.setMake(req.make());
        v.setModel(req.model());
        v.setYear(req.year());
        v.setCapacityKg(req.capacityKg());
        v.setType(req.type());
        if (req.active() != null) v.setActive(req.active());

        return vehicleRepository.save(v);
    }


    @Transactional
    public void delete(Long id) {
        if (!vehicleRepository.existsById(id)) throw new NotFoundException("Vehicle " + id + " not found");
        vehicleRepository.deleteById(id);
    }
}
