package com.hospital.registro.controller;

import com.hospital.registro.dto.IngresoDto;
import com.hospital.registro.model.Registro;
import com.hospital.registro.service.RegistroService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/registros")
public class RegistroController {

    private final RegistroService service;

    public RegistroController(RegistroService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('TI','VIGILANTE')")
    public ResponseEntity<List<Registro>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PostMapping("/ingreso")
    @PreAuthorize("hasAnyAuthority('TI','VIGILANTE')")
    public ResponseEntity<Registro> ingreso(
            @Valid @RequestBody IngresoDto dto,
            @RequestHeader("Authorization") String bearerToken) {

        Registro r = service.registrarIngreso(dto, bearerToken);
        return ResponseEntity.ok(r);
    }

    @PostMapping("/egreso/{id}")
    @PreAuthorize("hasAnyAuthority('TI','VIGILANTE')")
    public ResponseEntity<Registro> egreso(@PathVariable Long id) {
        Registro r = service.registrarEgreso(id);
        return ResponseEntity.ok(r);
    }

    @GetMapping("/por-fecha")
    @PreAuthorize("hasAuthority('TI')")
    public ResponseEntity<List<Registro>> porFecha(
            @RequestParam("inicio")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam("fin")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {

        return ResponseEntity.ok(service.registrosPorFecha(inicio, fin));
    }

    @GetMapping("/vencidos")
    @PreAuthorize("hasAuthority('TI')")
    public ResponseEntity<List<Registro>> vencidos() {
        return ResponseEntity.ok(service.registrosVencidos());
    }
}
