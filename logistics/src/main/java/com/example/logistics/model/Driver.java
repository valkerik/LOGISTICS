package com.example.logistics.model;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
@Table(name = "driver", indexes = {
        @Index(name = "idx_driver_license", columnList = "license_number", unique = true)
})
public class Driver {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "carrier_id", nullable = false)
    private Carrier carrier;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "license_number", nullable = false, unique = true)
    private String licenseNumber;

    @Column(name = "license_valid_until", nullable = false)
    private LocalDate licenseValidUntil;

    private String phone;

    @Column(nullable = false) private boolean active = true;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    // getters/setters etc.
}
