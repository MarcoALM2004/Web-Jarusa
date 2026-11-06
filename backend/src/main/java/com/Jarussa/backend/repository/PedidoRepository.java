package com.Jarussa.backend.repository;

import com.Jarussa.backend.model.Pedido;
import com.Jarussa.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByUsuarioOrderByFechaDesc(Usuario usuario);

    List<Pedido> findTop5ByOrderByFechaDesc();

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.fecha >= :desde")
    BigDecimal totalDesde(@Param("desde") LocalDateTime desde);
}
