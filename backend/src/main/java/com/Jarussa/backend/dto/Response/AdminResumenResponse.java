package com.Jarussa.backend.dto.Response;

import java.math.BigDecimal;
import java.util.List;

public record AdminResumenResponse(
        long pedidosTotales,
        long clientesRegistrados,
        long productosActivos,
        BigDecimal ventasHoy,
        List<PedidoResumenResponse> recientes
) {
}
