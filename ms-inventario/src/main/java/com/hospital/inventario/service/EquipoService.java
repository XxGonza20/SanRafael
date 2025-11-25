package com.hospital.inventario.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import com.hospital.inventario.model.Equipo;
import com.hospital.inventario.repository.EquipoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;

@Service
public class EquipoService {

    private final EquipoRepository repo;
    private final String uploadsBase;

    public EquipoService(EquipoRepository repo,
                         @Value("${uploads.base-path}") String uploadsBase) {
        this.repo = repo;
        this.uploadsBase = uploadsBase;
    }

    public List<Equipo> findAll() {
        return repo.findAll();
    }

    public Optional<Equipo> findById(Long id) {
        return repo.findById(id);
    }

    public List<Equipo> findByFrecuente(boolean frecuente) {
        return repo.findByFrecuente(frecuente);
    }

    public Equipo create(Equipo e) {
        // Si serial viene informado, se podría validar unicidad
        if (e.getSerial() != null && !e.getSerial().isBlank()) {
            repo.findBySerial(e.getSerial()).ifPresent(existing -> {
                throw new RuntimeException("Ya existe un equipo con ese serial");
            });
        }

        Equipo saved = repo.save(e);

        // Generar código QR para este equipo
        try {
            String qrPath = generateQrForEquipo(saved);
            saved.setQrCode(qrPath);
            saved = repo.save(saved);
        } catch (Exception ex) {
            // En un sistema real se loguearía; aquí no rompemos el flujo
        }

        return saved;
    }

    public Equipo update(Long id, Equipo updated) {
        Equipo original = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        original.setTipo(updated.getTipo());
        original.setSerial(updated.getSerial());
        original.setFrecuente(updated.isFrecuente());
        original.setDescripcion(updated.getDescripcion());

        // Opción: regenerar QR si cambia el serial
        return repo.save(original);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Equipo no encontrado");
        }
        repo.deleteById(id);
    }

    public String storePhoto(Long id, MultipartFile file) throws IOException {
        Equipo e = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no existe"));

        Path dir = Paths.get(uploadsBase, "equipos");
        Files.createDirectories(dir);

        String filename = "equipo_" + id + "_" + System.currentTimeMillis() + ".jpg";
        Path dest = dir.resolve(filename);

        try (InputStream is = file.getInputStream()) {
            Files.copy(is, dest, StandardCopyOption.REPLACE_EXISTING);
        }

        e.setFotoPath(dest.toString());
        repo.save(e);

        return dest.toString();
    }

    private String generateQrForEquipo(Equipo equipo)
            throws IOException, WriterException {

        Path dir = Paths.get(uploadsBase, "qr");
        Files.createDirectories(dir);

        String content = "EQUIPO:" + equipo.getId()
                + "|SERIAL:" + (equipo.getSerial() == null ? "" : equipo.getSerial());

        String filename = "equipo_" + equipo.getId() + ".png";
        Path qrPath = dir.resolve(filename);

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        var bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, 300, 300);

        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", qrPath);

        return qrPath.toString();
    }
}
