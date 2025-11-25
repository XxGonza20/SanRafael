package com.hospital.registro.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "log_transactions")
public class LogTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fechaHora;
    private String servicioOrigen;
    private String operacion;

    @Column(length = 1000)
    private String detalle;

    private String estado; // OK / ERROR

    public LogTransaction() {}

    public LogTransaction(LocalDateTime fechaHora, String servicioOrigen,
                          String operacion, String detalle, String estado) {
        this.fechaHora = fechaHora;
        this.servicioOrigen = servicioOrigen;
        this.operacion = operacion;
        this.detalle = detalle;
        this.estado = estado;
    }

    public Long getId() { return id; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public String getServicioOrigen() { return servicioOrigen; }
    public void setServicioOrigen(String servicioOrigen) { this.servicioOrigen = servicioOrigen; }

    public String getOperacion() { return operacion; }
    public void setOperacion(String operacion) { this.operacion = operacion; }

    public String getDetalle() { return detalle; }
    public void setDetalle(String detalle) { this.detalle = detalle; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
