package com.Jarussa.backend.dto.Response;

import java.math.BigDecimal;
import java.util.List;

public record ProductoDetalleResponse(
        Long id,
        String nombre,
        BigDecimal precio,
        String descripcion,
        String caracteristicas,
        String imagenUrl,
        Long categoriaId,
        String categoria,
        List<TonoResponse> tonos
) {
}
