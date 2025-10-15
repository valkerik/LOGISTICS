package com.example.logistics.service;

import com.example.logistics.exception.NotFoundException;
import com.example.logistics.model.Carrier;
import com.example.logistics.repo.CarrierRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CarrierService {
    private final CarrierRepository repo;

    public CarrierService(CarrierRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public Page<Carrier> list(String q, Pageable pageable) {
        if (q == null || q.isBlank()) {
            return repo.findAll(pageable);
        }
        List<Carrier> carriers = repo.findByNameContainingIgnoreCase(q);
        return new PageImpl<>(carriers, pageable, carriers.size());
    }


    @Transactional(readOnly = true)
    public Carrier get(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Carrier " + id + " not found"));
    }

    @Transactional
    public Carrier create(Carrier c) {
        if (repo.existsByNameIgnoreCase(c.getName()))
            throw new IllegalArgumentException("Carrier with name already exists: " + c.getName());
        return repo.save(c);
    }

    @Transactional
    public Carrier update(Long id, Carrier patch) {
        Carrier c = get(id);
        c.setName(patch.getName());
        c.setInn(patch.getInn());
        c.setPhone(patch.getPhone());
        c.setEmail(patch.getEmail());
        return repo.save(c);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Carrier " + id + " not found");
        repo.deleteById(id);
    }
}
