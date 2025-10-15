package com.example.logistics.web.controller;

import com.example.logistics.model.Client;
import com.example.logistics.service.ClientService;
import com.example.logistics.web.dto.ClientCreateRequestDto;
import com.example.logistics.web.dto.ClientUpdateRequestDto;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService service;
    public ClientController(ClientService service) { this.service = service; }

    @GetMapping
    public Page<Client> list(@RequestParam(required = false) String q, Pageable pageable) {
        return service.list(q, pageable);
    }

    @GetMapping("/{id}")
    public Client get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    public Client create(@RequestBody @Valid ClientCreateRequestDto req) {
        Client c = new Client();
        c.setName(req.name()); c.setInn(req.inn()); c.setKpp(req.kpp());
        c.setPhone(req.phone()); c.setEmail(req.email()); c.setAddress(req.address());
        return service.create(c);
    }

    @PutMapping("/{id}")
    public Client update(@PathVariable Long id, @RequestBody @Valid ClientUpdateRequestDto req) {
        Client c = new Client();
        c.setName(req.name()); c.setInn(req.inn()); c.setKpp(req.kpp());
        c.setPhone(req.phone()); c.setEmail(req.email()); c.setAddress(req.address());
        return service.update(id, c);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
