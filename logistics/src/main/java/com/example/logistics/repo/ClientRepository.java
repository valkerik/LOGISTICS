package com.example.logistics.repo;

import com.example.logistics.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
    List<Client> findByNameContainingIgnoreCase(String q);
}
