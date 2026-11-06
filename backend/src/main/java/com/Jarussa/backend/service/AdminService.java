package com.Jarussa.backend.service;

import com.Jarussa.backend.dto.Response.AdminResumenResponse;
import com.Jarussa.backend.dto.Response.PedidoResumenResponse;
import com.Jarussa.backend.model.Rol;
import com.Jarussa.backend.repository.PedidoRepository;
import com.Jarussa.backend.repository.ProductoRepository;
import com.Jarussa.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AdminService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public AdminService(PedidoRepository pedidoRepository,
                        UsuarioRepository usuarioRepository,
                        ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional(readOnly = true)
    public AdminResumenResponse resumen() {
        List<PedidoResumenResponse> recientes = pedidoRepository.findTop5ByOrderByFechaDesc().stream()
                .map(PedidoService::aResumen)
                .toList();

        return new AdminResumenResponse(
                pedidoRepository.count(),
                usuarioRepository.countByRol(Rol.CLIENTE),
                productoRepository.countByActivoTrue(),
                pedidoRepository.totalDesde(LocalDate.now().atStartOfDay()),
                recientes);
    }
}
