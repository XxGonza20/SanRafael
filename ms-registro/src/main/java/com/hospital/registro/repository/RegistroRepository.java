package com.hospital.registro.repository;

import com.hospital.registro.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RegistroRepository extends JpaRepository<Registro, Long> {

    List<Registro> findByFechaHoraIngresoBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Registro> findByValidoHastaBeforeAndEstado(LocalDateTime fecha, String estado);
}
