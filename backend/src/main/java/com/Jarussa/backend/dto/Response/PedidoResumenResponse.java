package com.Jarussa.backend.dto.Response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PedidoResumenResponse(
        Long id,
        String codigo,
        String cliente,
        LocalDateTime fecha,
        String estado,
        BigDecimal total
) {
}
