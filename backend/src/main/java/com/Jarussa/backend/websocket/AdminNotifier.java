package com.Jarussa.backend.websocket;

import com.Jarussa.backend.dto.Response.NotificacionResponse;
import com.Jarussa.backend.event.NotificacionesCreadasEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.Map;

// Se ejecuta DESPUES del commit: el aviso solo sale si el pedido realmente se guardo
@Component
public class AdminNotifier {

    private final AdminSocketHandler handler;
    private final ObjectMapper mapper;

    public AdminNotifier(AdminSocketHandler handler, ObjectMapper mapper) {
        this.handler = handler;
        this.mapper = mapper;
    }

    @TransactionalEventListener
    public void alCrearNotificaciones(NotificacionesCreadasEvent evento) {
        for (NotificacionResponse n : evento.notificaciones()) {
            try {
                handler.difundir(mapper.writeValueAsString(Map.of("tipo", "NOTIFICACION", "notificacion", n)));
            } catch (JsonProcessingException e) {
                // un aviso que falla no debe afectar a la compra
            }
        }
    }
}