package com.Jarussa.backend.repository;

import com.Jarussa.backend.model.ProductoTono;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductoTonoRepository extends JpaRepository<ProductoTono, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM ProductoTono t WHERE t.id = :id")
    Optional<ProductoTono> bloquearPorId(@Param("id") Long id);
}
