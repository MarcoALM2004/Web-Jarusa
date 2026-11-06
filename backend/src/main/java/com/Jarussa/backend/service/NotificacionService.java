package com.Jarussa.backend.service;

import com.Jarussa.backend.dto.Response.NotificacionResponse;
import com.Jarussa.backend.dto.Response.NotificacionesResponse;
import com.Jarussa.backend.model.Notificacion;
import com.Jarussa.backend.repository.NotificacionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificacionService {

    private final NotificacionRepository repository;

    public NotificacionService(NotificacionRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public NotificacionResponse crear(String tipo, String mensaje) {
        Notificacion n = new Notificacion();
        n.setTipo(tipo);
        n.setMensaje(mensaje);
        return aRespuesta(repository.save(n));
    }

    @Transactional(readOnly = true)
    public NotificacionesResponse listar() {
        return new NotificacionesResponse(
                repository.countByLeidaFalse(),
                repository.findTop50ByOrderByFechaDescIdDesc().stream()
                        .map(NotificacionService::aRespuesta)
                        .toList());
    }

    @Transactional
    public void marcarTodasLeidas() {
        repository.marcarTodasLeidas();
    }

    private static NotificacionResponse aRespuesta(Notificacion n) {
        return new NotificacionResponse(n.getId(), n.getTipo(), n.getMensaje(), n.getFecha(), n.isLeida());
    }
}