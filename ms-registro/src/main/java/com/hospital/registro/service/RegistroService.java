package com.hospital.registro.service;

import com.hospital.registro.dto.IngresoDto;
import com.hospital.registro.model.LogTransaction;
import com.hospital.registro.model.Registro;
import com.hospital.registro.repository.LogRepository;
import com.hospital.registro.repository.RegistroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RegistroService {

    private final RegistroRepository registroRepo;
    private final LogRepository logRepo;
    private final InventarioClient inventarioClient;

    public RegistroService(RegistroRepository registroRepo,
                           LogRepository logRepo,
                           InventarioClient inventarioClient) {
        this.registroRepo = registroRepo;
        this.logRepo = logRepo;
        this.inventarioClient = inventarioClient;
    }

    public List<Registro> listarTodos() {
        return registroRepo.findAll();
    }

    public List<Registro> registrosPorFecha(LocalDate inicio, LocalDate fin) {
        LocalDateTime inicioDt = inicio.atStartOfDay();
        LocalDateTime finDt = fin.plusDays(1).atStartOfDay().minusSeconds(1);
        return registroRepo.findByFechaHoraIngresoBetween(inicioDt, finDt);
    }

    public List<Registro> registrosVencidos() {
        return registroRepo.findByValidoHastaBeforeAndEstado(
                LocalDateTime.now(), "ACTIVO"
        );
    }

        @Transactional
    public Registro registrarIngreso(IngresoDto req, String bearerToken) {

        Long equipoId = req.getEquipoId();

        if (equipoId == null) {
            Map<String, Object> payload = Map.of(
                    "tipo", req.getTipoEquipo(),
                    "serial", req.getSerial(),
                    "frecuente", req.isFrecuente(),
                    "descripcion", req.getDescripcionEquipo()
            );

            Optional<Map> resp = inventarioClient.createEquipo(payload, bearerToken);

            if (resp.isEmpty() || resp.get().get("id") == null) {
                logRepo.save(new LogTransaction(
                        LocalDateTime.now(),
                        "ms-registro",
                        "CREAR_EQUIPO",
                        "Error al crear equipo en ms-inventario",
                        "ERROR"
                ));
                throw new RuntimeException("No se pudo crear el equipo en inventario");
            }

            Object idObj = resp.get().get("id");
            equipoId = Long.valueOf(idObj.toString());

            logRepo.save(new LogTransaction(
                    LocalDateTime.now(),
                    "ms-registro",
                    "CREAR_EQUIPO",
                    "Equipo creado en inventario con id " + equipoId,
                    "OK"
            ));
        }

        LocalDateTime ahora = LocalDateTime.now();

        Registro r = new Registro();
        r.setEquipoId(equipoId);
        r.setTipoMovimiento("INGRESO");
        r.setPersona(req.getPersona());
        r.setDocumento(req.getDocumento());
        r.setMotivo(req.getMotivo());
        r.setFechaHoraIngreso(ahora);

        // 🆕 Si el usuario envía fecha de vigencia, la usamos (fin del día)
        if (req.getValidoHasta() != null) {
            r.setValidoHasta(req.getValidoHasta().atTime(23, 59));
        } else {
            // fallback: mismo comportamiento de antes (3 días)
            r.setValidoHasta(ahora.plusDays(3));
        }

        r.setEstado("ACTIVO");

        Registro saved = registroRepo.save(r);

        logRepo.save(new LogTransaction(
                LocalDateTime.now(),
                "ms-registro",
                "INGRESO",
                "Registro de ingreso id " + saved.getId(),
                "OK"
        ));

        return saved;
    }


    @Transactional
    public Registro registrarEgreso(Long registroId) {

        Registro r = registroRepo.findById(registroId)
                .orElseThrow(() -> new RuntimeException("Registro no encontrado"));

        if (!"ACTIVO".equals(r.getEstado())) {
            throw new RuntimeException("El registro ya está cerrado");
        }

        r.setTipoMovimiento("EGRESO");
        r.setFechaHoraEgreso(LocalDateTime.now());
        r.setEstado("CERRADO");

        Registro saved = registroRepo.save(r);

        logRepo.save(new LogTransaction(
                LocalDateTime.now(),
                "ms-registro",
                "EGRESO",
                "Registro de egreso id " + saved.getId(),
                "OK"
        ));

        return saved;
    }
}
