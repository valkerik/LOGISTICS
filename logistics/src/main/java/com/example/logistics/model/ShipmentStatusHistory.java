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
@Table(name = "shipment_status_history", indexes = {
        @Index(name = "idx_hist_shipment", columnList = "shipment_id"),
        @Index(name = "idx_hist_changed_at", columnList = "changed_at")
})
public class ShipmentStatusHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "shipment_id", nullable = false)
    private Shipment shipment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentStatus status;

    @Column(name = "changed_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime changedAt;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "changed_by")
    private AppUser changedBy; // может быть null (триггер/система)

    private String note;

    // getters/setters etc.
}
