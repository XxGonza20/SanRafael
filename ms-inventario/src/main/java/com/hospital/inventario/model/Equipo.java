package com.hospital.inventario.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "equipos")
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // BIOMEDICO | TECNOLOGICO (según el PDF)
    @Column(nullable = false)
    private String tipo;

    @Column(unique = true)
    private String serial;

    // true = frecuente, false = esporádico
    @Column(nullable = false)
    private boolean frecuente;

    // Ruta al archivo PNG del código QR generado
    private String qrCode;

    // Ruta a la foto almacenada en /uploads/equipos
    private String fotoPath;

    @Column(length = 500)
    private String descripcion;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Equipo() {}

    public Long getId() { return id; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getSerial() { return serial; }
    public void setSerial(String serial) { this.serial = serial; }

    public boolean isFrecuente() { return frecuente; }
    public void setFrecuente(boolean frecuente) { this.frecuente = frecuente; }

    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }

    public String getFotoPath() { return fotoPath; }
    public void setFotoPath(String fotoPath) { this.fotoPath = fotoPath; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
