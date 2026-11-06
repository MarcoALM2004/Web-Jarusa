package com.Jarussa.backend.dto.Response;

import java.time.LocalDateTime;

public record NotificacionResponse(Long id, String tipo, String mensaje, LocalDateTime fecha, boolean leida) {
}