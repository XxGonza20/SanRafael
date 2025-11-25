package com.hospital.inventario.repository;

import com.hospital.inventario.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EquipoRepository extends JpaRepository<Equipo, Long> {
    Optional<Equipo> findByQrCode(String qrCode);
    Optional<Equipo> findBySerial(String serial);
    List<Equipo> findByFrecuente(boolean frecuente);
}
