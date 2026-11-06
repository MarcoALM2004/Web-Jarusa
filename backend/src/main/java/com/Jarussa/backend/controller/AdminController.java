package com.Jarussa.backend.controller;

import com.Jarussa.backend.dto.Response.AdminResumenResponse;
import com.Jarussa.backend.dto.Response.ImagenResponse;
import com.Jarussa.backend.dto.Response.NotificacionesResponse;
import com.Jarussa.backend.dto.Response.ProductoDetalleResponse;
import com.Jarussa.backend.dto.Request.ProductoRequest;
import com.Jarussa.backend.service.AdminService;
import com.Jarussa.backend.service.ImagenService;
import com.Jarussa.backend.service.NotificacionService;
import com.Jarussa.backend.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProductoService productoService;
    private final AdminService adminService;
    private final ImagenService imagenService;
    private final NotificacionService notificacionService;

    public AdminController(ProductoService productoService,
                           AdminService adminService,
                           ImagenService imagenService,
                           NotificacionService notificacionService) {
        this.productoService = productoService;
        this.adminService = adminService;
        this.imagenService = imagenService;
        this.notificacionService = notificacionService;
    }

    @GetMapping("/resumen")
    public AdminResumenResponse resumen() {
        return adminService.resumen();
    }

    @GetMapping("/productos")
    public List<ProductoDetalleResponse> listar() {
        return productoService.listarAdmin();
    }

    @PostMapping("/productos")
    public ResponseEntity<ProductoDetalleResponse> crear(@Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crear(request));
    }

    @PutMapping("/productos/{id}")
    public ProductoDetalleResponse actualizar(@PathVariable Long id,
                                              @Valid @RequestBody ProductoRequest request) {
        return productoService.actualizar(id, request);
    }

    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/imagenes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImagenResponse> subirImagen(@RequestParam("archivo") MultipartFile archivo) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ImagenResponse(imagenService.guardar(archivo)));
    }

    @GetMapping("/notificaciones")
    public NotificacionesResponse notificaciones() {
        return notificacionService.listar();
    }

    @PutMapping("/notificaciones/leidas")
    public ResponseEntity<Void> marcarLeidas() {
        notificacionService.marcarTodasLeidas();
        return ResponseEntity.noContent().build();
    }
}