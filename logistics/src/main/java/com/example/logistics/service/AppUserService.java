package com.example.logistics.service;

import com.example.logistics.exception.NotFoundException;
import com.example.logistics.model.AppUser;
import com.example.logistics.repo.AppUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppUserService {
    private final AppUserRepository repo;

    public AppUserService(AppUserRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public AppUser loadByUsername(String username) {
        return repo.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found: " + username));
    }

    @Transactional
    public AppUser create(AppUser u) {
        if (repo.existsByUsername(u.getUsername()))
            throw new IllegalArgumentException("Username already exists: " + u.getUsername());
        return repo.save(u);
    }

    @Transactional
    public void deactivate(Long id) {
        AppUser u = repo.findById(id).orElseThrow(() -> new NotFoundException("User " + id + " not found"));
        u.setActive(false);
        repo.save(u);
    }
}
