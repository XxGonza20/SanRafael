package com.hospital.inventario.controller;

import com.hospital.inventario.dto.EquipoDto;
import com.hospital.inventario.model.Equipo;
import com.hospital.inventario.service.EquipoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

    private final EquipoService service;

    public EquipoController(EquipoService service) {
        this.service = service;
    }

    // ===== CRUD =====

    @GetMapping
    public ResponseEntity<List<Equipo>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipo> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/frecuentes")
    public ResponseEntity<List<Equipo>> findByFrecuente(
            @RequestParam(defaultValue = "true") boolean frecuente) {
        return ResponseEntity.ok(service.findByFrecuente(frecuente));
    }

    @PostMapping
    public ResponseEntity<Equipo> create(@Valid @RequestBody EquipoDto dto) {
        Equipo e = new Equipo();
        e.setTipo(dto.getTipo());
        e.setSerial(dto.getSerial());
        e.setFrecuente(dto.isFrecuente());
        e.setDescripcion(dto.getDescripcion());

        Equipo saved = service.create(e);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipo> update(
            @PathVariable Long id,
            @Valid @RequestBody EquipoDto dto) {

        Equipo updated = new Equipo();
        updated.setTipo(dto.getTipo());
        updated.setSerial(dto.getSerial());
        updated.setFrecuente(dto.isFrecuente());
        updated.setDescripcion(dto.getDescripcion());

        Equipo saved = service.update(id, updated);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ===== FOTO DEL EQUIPO =====

    // ⬇️ IMPORTANTE: sin @PreAuthorize aquí
    @PostMapping("/{id}/foto")
    public ResponseEntity<?> uploadPhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        String path = service.storePhoto(id, file);
        return ResponseEntity.ok().body(java.util.Map.of("path", path));
    }

    // Servir la imagen
    @GetMapping("/{id}/foto")
    public ResponseEntity<?> getPhoto(@PathVariable Long id) throws IOException {

        Equipo e = service.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        if (e.getFotoPath() == null) {
            return ResponseEntity.notFound().build();
        }

        Path path = Paths.get(e.getFotoPath());

        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }

        byte[] bytes = Files.readAllBytes(path);
        String contentType = Files.probeContentType(path);

        return ResponseEntity
                .ok()
                .header("Content-Type",
                        contentType != null ? contentType : "application/octet-stream")
                .body(bytes);
    }
}
