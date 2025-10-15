package com.example.logistics.repo;

import com.example.logistics.model.AppUser;
import com.example.logistics.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);
    boolean existsByUsername(String username);
    List<AppUser> findByRole(UserRole role);
    List<AppUser> findByActiveTrue();
}
