package com.example.logistics.repo;

import com.example.logistics.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    List<Driver> findByCarrier_Id(Long carrierId);
    List<Driver> findByActiveTrue();
    List<Driver> findByLicenseValidUntilBefore(LocalDate date);
    boolean existsByLicenseNumber(String licenseNumber);
}
