package com.Jarussa.backend.dto.Response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        String codigo,
        LocalDateTime fecha,
        String estado,
        BigDecimal subtotal,
        BigDecimal envio,
        BigDecimal total,
        List<Item> items
) {
    public record Item(String producto, String tono, int cantidad, BigDecimal precioUnitario) {
    }
}
