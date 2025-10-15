package com.example.logistics.web.controller;

import com.example.logistics.model.AppUser;
import com.example.logistics.service.AppUserService;
import com.example.logistics.web.dto.UserCreateRequestDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class AppUserController {
    private final AppUserService service;
    public AppUserController(AppUserService service) { this.service = service; }

    @GetMapping("/{username}")
    public AppUser getByUsername(@PathVariable String username) {
        return service.loadByUsername(username);
    }

    @PostMapping
    public AppUser create(@RequestBody @Valid UserCreateRequestDto req) {
        AppUser u = new AppUser();
        u.setUsername(req.username());
        u.setPassHash(req.passHash());
        u.setRole(req.role());
        u.setActive(true);
        return service.create(u);
    }

    @DeleteMapping("/{id}/deactivate")
    public void deactivate(@PathVariable Long id) {
        service.deactivate(id);
    }
}
