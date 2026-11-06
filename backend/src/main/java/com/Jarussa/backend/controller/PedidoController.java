package com.Jarussa.backend.controller;

import com.Jarussa.backend.dto.Request.PedidoRequest;
import com.Jarussa.backend.dto.Response.PedidoResponse;
import com.Jarussa.backend.model.Usuario;
import com.Jarussa.backend.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<PedidoResponse> crear(@AuthenticationPrincipal Usuario usuario,
                                                @Valid @RequestBody PedidoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.crear(usuario, request));
    }

    @GetMapping("/mis-pedidos")
    public List<PedidoResponse> misPedidos(@AuthenticationPrincipal Usuario usuario) {
        return pedidoService.misPedidos(usuario);
    }
}
