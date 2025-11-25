package com.hospital.registro.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "registros")
public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long equipoId;

    @Column(nullable = false)
    private String tipoMovimiento; // INGRESO / EGRESO

    private String persona;
    private String documento;
    private String motivo;

    private LocalDateTime fechaHoraIngreso;
    private LocalDateTime fechaHoraEgreso;

    private LocalDateTime validoHasta;  // vigencia del “token” de permanencia
    @Column(nullable = false)
    private String estado;              // ACTIVO / CERRADO

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

    public Registro() {}

    public Long getId() { return id; }

    public Long getEquipoId() { return equipoId; }
    public void setEquipoId(Long equipoId) { this.equipoId = equipoId; }

    public String getTipoMovimiento() { return tipoMovimiento; }
    public void setTipoMovimiento(String tipoMovimiento) { this.tipoMovimiento = tipoMovimiento; }

    public String getPersona() { return persona; }
    public void setPersona(String persona) { this.persona = persona; }

    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public LocalDateTime getFechaHoraIngreso() { return fechaHoraIngreso; }
    public void setFechaHoraIngreso(LocalDateTime fechaHoraIngreso) { this.fechaHoraIngreso = fechaHoraIngreso; }

    public LocalDateTime getFechaHoraEgreso() { return fechaHoraEgreso; }
    public void setFechaHoraEgreso(LocalDateTime fechaHoraEgreso) { this.fechaHoraEgreso = fechaHoraEgreso; }

    public LocalDateTime getValidoHasta() { return validoHasta; }
    public void setValidoHasta(LocalDateTime validoHasta) { this.validoHasta = validoHasta; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
