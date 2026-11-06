package com.Jarussa.backend.dto.Request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ItemPedidoRequest(
        @NotNull(message = "Falta el producto") Long productoId,
        @NotNull(message = "Falta el tono") Long tonoId,
        @NotNull(message = "Falta la cantidad")
        @Min(value = 1, message = "La cantidad mínima es 1")
        @Max(value = 20, message = "La cantidad máxima por producto es 20")
        Integer cantidad
) {
}
