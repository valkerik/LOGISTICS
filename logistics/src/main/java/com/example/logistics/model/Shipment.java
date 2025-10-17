package com.example.logistics.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "shipment", indexes = {
        @Index(name = "idx_shipment_client", columnList = "client_id"),
        @Index(name = "idx_shipment_carrier", columnList = "carrier_id"),
        @Index(name = "idx_shipment_status", columnList = "status")
})
public class Shipment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "carrier_id", nullable = false)
    private Carrier carrier;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "driver_id")
    private Driver driver;

    @Column(name = "pickup_address", nullable = false)   private String pickupAddress;
    @Column(name = "delivery_address", nullable = false) private String deliveryAddress;

    @Column(name = "cargo_description", nullable = false) private String cargoDescription;

    @Column(name = "cargo_weight", nullable = false, precision = 10, scale = 2)
    private BigDecimal cargoWeight;

    @Column(name = "planned_pickup_at", nullable = false)   private OffsetDateTime plannedPickupAt;
    @Column(name = "planned_delivery_at", nullable = false) private OffsetDateTime plannedDeliveryAt;

    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal price;

    /** В БД TEXT — маппим enum строкой. Можно оставить String. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentStatus status = ShipmentStatus.NEW;

    @Column(name = "created_at", insertable = false, updatable = false, nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false, nullable = false)
    private OffsetDateTime updatedAt;
}
