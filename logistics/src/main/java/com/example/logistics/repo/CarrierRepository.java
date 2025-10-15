package com.example.logistics.repo;

import com.example.logistics.model.Carrier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarrierRepository extends JpaRepository<Carrier, Long> {
    Optional<Carrier> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
    List<Carrier> findByNameContainingIgnoreCase(String q);
}
