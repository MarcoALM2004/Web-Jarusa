package com.Jarussa.backend.exception;

import org.springframework.http.HttpStatus;

public class DosPasosException extends RuntimeException {

    private final HttpStatus estado;
    private final Long reintentarEnSegundos;
    public DosPasosException(HttpStatus estado, String mensaje) {
        this(estado, mensaje, null);
    }

    public DosPasosException(HttpStatus estado, String mensaje, Long reintentarEnSegundos) {
        super(mensaje);
        this.estado = estado;
        this.reintentarEnSegundos = reintentarEnSegundos;
    }

    public HttpStatus getEstado() { return estado; }
    public Long getReintentarEnSegundos() { return reintentarEnSegundos; }
}