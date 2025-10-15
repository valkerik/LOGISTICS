package com.example.logistics.model;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
@Table(name = "app_user", indexes = {
        @Index(name = "idx_user_username", columnList = "username", unique = true)
})
public class AppUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "pass_hash", nullable = false)
    private String passHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.VIEWER;

    @Column(nullable = false) private boolean active = true;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    // getters/setters etc.
}
