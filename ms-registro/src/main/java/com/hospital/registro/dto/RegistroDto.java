package com.hospital.registro.dto;

import java.time.LocalDateTime;

public class RegistroDto {

    private Long id;
    private Long equipoId;
    private String tipoMovimiento;
    private String persona;
    private String documento;
    private String motivo;
    private LocalDateTime fechaHoraIngreso;
    private LocalDateTime fechaHoraEgreso;
    private LocalDateTime validoHasta;
    private String estado;

    public RegistroDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEquipoId() {
        return equipoId;
    }

    public void setEquipoId(Long equipoId) {
        this.equipoId = equipoId;
    }

    public String getTipoMovimiento() {
        return tipoMovimiento;
    }

    public void setTipoMovimiento(String tipoMovimiento) {
        this.tipoMovimiento = tipoMovimiento;
    }

    public String getPersona() {
        return persona;
    }

    public void setPersona(String persona) {
        this.persona = persona;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public LocalDateTime getFechaHoraIngreso() {
        return fechaHoraIngreso;
    }

    public void setFechaHoraIngreso(LocalDateTime fechaHoraIngreso) {
        this.fechaHoraIngreso = fechaHoraIngreso;
    }

    public LocalDateTime getFechaHoraEgreso() {
        return fechaHoraEgreso;
    }

    public void setFechaHoraEgreso(LocalDateTime fechaHoraEgreso) {
        this.fechaHoraEgreso = fechaHoraEgreso;
    }

    public LocalDateTime getValidoHasta() {
        return validoHasta;
    }

    public void setValidoHasta(LocalDateTime validoHasta) {
        this.validoHasta = validoHasta;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
