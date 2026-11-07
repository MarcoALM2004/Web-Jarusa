package com.Jarussa.backend.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.http.HttpHeaders;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ResponseEntity<Map<String, String>> responder(HttpStatus status, String mensaje) {
        return ResponseEntity.status(status).body(Map.of("mensaje", mensaje));
    }

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Map<String, String>> noEncontrado(RecursoNoEncontradoException e) {
        return responder(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(SolicitudInvalidaException.class)
    public ResponseEntity<Map<String, String>> invalida(SolicitudInvalidaException e) {
        return responder(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> validacion(MethodArgumentNotValidException e) {
        String mensaje = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(f -> f.getDefaultMessage())
                .orElse("Datos inválidos");
        return responder(HttpStatus.BAD_REQUEST, mensaje);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> jsonInvalido(HttpMessageNotReadableException e) {
        return responder(HttpStatus.BAD_REQUEST, "El cuerpo de la petición no es válido");
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> archivoGrande(MaxUploadSizeExceededException e) {
        return responder(HttpStatus.PAYLOAD_TOO_LARGE, "La imagen supera el máximo de 5 MB");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> integridad(DataIntegrityViolationException e) {
        return responder(HttpStatus.CONFLICT, "No se pudo guardar: los datos chocan con otro registro");
    }
    
    @ExceptionHandler(DosPasosException.class)
    public ResponseEntity<Map<String, String>> dosPasos(DosPasosException e) {
        ResponseEntity.BodyBuilder respuesta = ResponseEntity.status(e.getEstado());
        if (e.getReintentarEnSegundos() != null) {
            respuesta.header(HttpHeaders.RETRY_AFTER, String.valueOf(e.getReintentarEnSegundos()));
        }
        return respuesta.body(Map.of("mensaje", e.getMessage()));
    }
}
