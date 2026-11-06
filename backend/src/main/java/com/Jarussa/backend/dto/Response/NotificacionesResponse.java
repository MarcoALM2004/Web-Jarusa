package com.Jarussa.backend.dto.Response;

import java.util.List;

public record NotificacionesResponse(long noLeidas, List<NotificacionResponse> items) {
}