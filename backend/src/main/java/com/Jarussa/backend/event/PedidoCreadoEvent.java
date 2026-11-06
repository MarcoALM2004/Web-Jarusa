package com.Jarussa.backend.event;

import com.Jarussa.backend.dto.AlertaStock;
import com.Jarussa.backend.dto.Response.PedidoResumenResponse;

import java.util.List;

public record PedidoCreadoEvent(PedidoResumenResponse pedido, List<AlertaStock> alertas) {
}
