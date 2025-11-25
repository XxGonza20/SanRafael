package com.hospital.registro.repository;

import com.hospital.registro.model.LogTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<LogTransaction, Long> {
}
