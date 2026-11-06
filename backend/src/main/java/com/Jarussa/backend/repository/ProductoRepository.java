package com.Jarussa.backend.repository;

import com.Jarussa.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Query("""
            SELECT p FROM Producto p
            WHERE p.activo = true
                AND LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))
                AND (:filtrarCategorias = false OR p.categoria.id IN :categorias)
            ORDER BY p.id
            """)
    List<Producto> buscar(@Param("nombre") String nombre,
                            @Param("filtrarCategorias") boolean filtrarCategorias,
                            @Param("categorias") Collection<Long> categorias);

    Optional<Producto> findByIdAndActivoTrue(Long id);

    List<Producto> findByActivoTrueOrderByIdDesc();

    long countByActivoTrue();
}
