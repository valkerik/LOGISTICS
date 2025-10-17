package com.example.logistics.repo;

import com.example.logistics.model.Vehicle;
import com.example.logistics.model.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByPlateNo(String plateNo);
    boolean existsByPlateNo(String plateNo);

    boolean existsByVin(String vin);

    Optional<Vehicle> findByVin(String vin);

    List<Vehicle> findByCarrier_Id(Long carrierId);
    List<Vehicle> findByActiveTrue();
    List<Vehicle> findByType(VehicleType type);
}
