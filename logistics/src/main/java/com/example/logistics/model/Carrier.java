package com.example.logistics.model;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
@Table(name = "carrier", indexes = {
        @Index(name = "idx_carrier_name", columnList = "name", unique = true)
})
public class Carrier {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String name;
    @Column(length = 12) private String inn;
    private String phone;
    private String email;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "carrier", fetch = FetchType.LAZY)
    private List<Vehicle> vehicles;

    @OneToMany(mappedBy = "carrier", fetch = FetchType.LAZY)
    private List<Driver> drivers;

    // getters/setters etc.
}
