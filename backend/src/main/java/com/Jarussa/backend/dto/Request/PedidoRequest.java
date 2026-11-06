package com.Jarussa.backend.dto.Request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record PedidoRequest(
        @NotEmpty(message = "El carrito está vacío")
        @Valid
        List<ItemPedidoRequest> items
) {
}
