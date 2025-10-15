package com.example.logistics.model;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
@Table(name = "vehicle", indexes = {
        @Index(name = "idx_vehicle_plate", columnList = "plate_no", unique = true),
        @Index(name = "idx_vehicle_vin", columnList = "vin")
})
public class Vehicle {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "carrier_id", nullable = false)
    private Carrier carrier;

    @Column(name = "plate_no", nullable = false, unique = true)
    private String plateNo;

    @Column(unique = true)
    private String vin;

    private String make;
    private String model;
    private Integer year;

    @Column(name = "capacity_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal capacityKg;

    /** В БД TEXT — удобно мапить enum строкой. Можно оставить String, если не хочешь enum. */
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private VehicleType type = VehicleType.TRUCK;

    @Column(nullable = false) private boolean active = true;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    // getters/setters etc.
}
