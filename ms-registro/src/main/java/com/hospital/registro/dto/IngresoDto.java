package com.hospital.registro.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class IngresoDto {

    private Long equipoId;          // opcional: si viene null se crea en inventario

    @NotBlank
    private String tipoEquipo;      // BIOMEDICO / TECNOLOGICO

    private String serial;
    private boolean frecuente;
    private String descripcionEquipo;

    @NotBlank
    private String persona;

    @NotBlank
    private String documento;

    @NotBlank
    private String motivo;

    // Nueva: fecha de vigencia hasta la cual el equipo puede permanecer
    // Se envía desde el frontend como "yyyy-MM-dd"
    private LocalDate validoHasta;

    public IngresoDto() {
    }

    public Long getEquipoId() {
        return equipoId;
    }

    public void setEquipoId(Long equipoId) {
        this.equipoId = equipoId;
    }

    public String getTipoEquipo() {
        return tipoEquipo;
    }

    public void setTipoEquipo(String tipoEquipo) {
        this.tipoEquipo = tipoEquipo;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public boolean isFrecuente() {
        return frecuente;
    }

    public void setFrecuente(boolean frecuente) {
        this.frecuente = frecuente;
    }

    public String getDescripcionEquipo() {
        return descripcionEquipo;
    }

    public void setDescripcionEquipo(String descripcionEquipo) {
        this.descripcionEquipo = descripcionEquipo;
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

    public LocalDate getValidoHasta() {
        return validoHasta;
    }

    public void setValidoHasta(LocalDate validoHasta) {
        this.validoHasta = validoHasta;
    }
}
