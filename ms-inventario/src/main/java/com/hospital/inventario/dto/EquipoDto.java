package com.hospital.inventario.dto;

import jakarta.validation.constraints.NotBlank;

public class EquipoDto {

    @NotBlank
    private String tipo;

    private String serial;

    private boolean frecuente;

    private String descripcion;

    public EquipoDto() {}

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getSerial() { return serial; }
    public void setSerial(String serial) { this.serial = serial; }

    public boolean isFrecuente() { return frecuente; }
    public void setFrecuente(boolean frecuente) { this.frecuente = frecuente; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
