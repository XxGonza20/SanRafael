package com.hospital.registro.dto;

import jakarta.validation.constraints.NotNull;

public class EgresoDto {

    @NotNull
    private Long registroId;

    public EgresoDto() {}

    public Long getRegistroId() {
        return registroId;
    }

    public void setRegistroId(Long registroId) {
        this.registroId = registroId;
    }
}
