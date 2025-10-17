package com.example.logistics.service;

import com.example.logistics.exception.NotFoundException;
import com.example.logistics.model.Client;
import com.example.logistics.repo.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClientService {
    private final ClientRepository clientRepository;

    public ClientService(ClientRepository repo) { this.clientRepository = repo; }

    @Transactional(readOnly = true)
    public List<Client> list() {
            return clientRepository.findAll();
    }


    @Transactional(readOnly = true)
    public Client get(Long id) {
        return clientRepository.findById(id).orElseThrow(() -> new NotFoundException("Client " + id + " not found"));
    }

    @Transactional
    public Client create(Client c) {
        if (clientRepository.existsByNameIgnoreCase(c.getName()))
            throw new IllegalArgumentException("Client with name already exists: " + c.getName());
        return clientRepository.save(c);
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
        return clientRepository.save(c);
    }

    @Transactional
    public void delete(Long id) {
        if (!clientRepository.existsById(id)) throw new NotFoundException("Client " + id + " not found");
        clientRepository.deleteById(id);
    }
}
