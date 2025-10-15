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
@Table(name = "client", indexes = {
        @Index(name = "idx_client_name", columnList = "name", unique = true)
})
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String name;
    @Column(length = 12) private String inn;
    @Column(length = 9)  private String kpp;
    private String phone;
    private String email;
    private String address;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

}
