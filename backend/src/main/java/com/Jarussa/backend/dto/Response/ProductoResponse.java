package com.Jarussa.backend.dto.Response;

import java.math.BigDecimal;

public record ProductoResponse(
        Long id,
        String nombre,
        BigDecimal precio,
        String descripcion,
        String imagenUrl,
        Long categoriaId,
        String categoria,
        int cantidadTonos
) {
}
