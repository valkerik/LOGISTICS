package com.example.logistics.web.controller;

import com.example.logistics.model.Carrier;
import com.example.logistics.service.CarrierService;
import com.example.logistics.web.dto.CarrierCreateRequestDto;

import com.example.logistics.web.dto.CarrierUpdateRequestDto;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carriers")
public class CarrierController {
    private final CarrierService service;
    public CarrierController(CarrierService service) { this.service = service; }

    @GetMapping
    public Page<Carrier> list(@RequestParam(required = false) String q, Pageable pageable) {
        return service.list(q, pageable);
    }

    @GetMapping("/{id}")
    public Carrier get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    public Carrier create(@RequestBody @Valid CarrierCreateRequestDto req) {
        Carrier c = new Carrier();
        c.setName(req.name()); c.setInn(req.inn()); c.setPhone(req.phone()); c.setEmail(req.email());
        return service.create(c);
    }

    @PutMapping("/{id}")
    public Carrier update(@PathVariable Long id, @RequestBody @Valid CarrierUpdateRequestDto req) {
        Carrier c = new Carrier();
        c.setName(req.name()); c.setInn(req.inn()); c.setPhone(req.phone()); c.setEmail(req.email());
        return service.update(id, c);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
