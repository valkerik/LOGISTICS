package com.example.logistics.service;

import com.example.logistics.exception.NotFoundException;
import com.example.logistics.model.Client;
import com.example.logistics.repo.ClientRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClientService {
    private final ClientRepository repo;

    public ClientService(ClientRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public Page<Client> list(String q, Pageable pageable) {
        if (q == null || q.isBlank()) {
            return repo.findAll(pageable);
        }
        List<Client> clients = repo.findByNameContainingIgnoreCase(q);
        return new PageImpl<>(clients, pageable, clients.size());
    }


    @Transactional(readOnly = true)
    public Client get(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Client " + id + " not found"));
    }

    @Transactional
    public Client create(Client c) {
        if (repo.existsByNameIgnoreCase(c.getName()))
            throw new IllegalArgumentException("Client with name already exists: " + c.getName());
        return repo.save(c);
    }

    @Transactional
    public Client update(Long id, Client patch) {
        Client c = get(id);
        c.setName(patch.getName());
        c.setInn(patch.getInn());
        c.setKpp(patch.getKpp());
        c.setPhone(patch.getPhone());
        c.setEmail(patch.getEmail());
        c.setAddress(patch.getAddress());
        return repo.save(c);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Client " + id + " not found");
        repo.deleteById(id);
    }
}
