package com.Jarussa.backend.controller;

import com.Jarussa.backend.dto.CategoriaResponse;
import com.Jarussa.backend.dto.ProductoResponse;
import com.Jarussa.backend.service.ProductoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping("/productos")
    public List<ProductoResponse> listar(
            @RequestParam(required = false, defaultValue = "") String nombre,
            @RequestParam(required = false) List<Long> categorias) {
        return productoService.buscar(nombre, categorias);
    }

    @GetMapping("/categorias")
    public List<CategoriaResponse> categorias() {
        return productoService.listarCategorias();
    }
}
