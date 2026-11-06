package com.Jarussa.backend.event;

import com.Jarussa.backend.dto.Response.NotificacionResponse;

import java.util.List;

public record NotificacionesCreadasEvent(List<NotificacionResponse> notificaciones) {
}