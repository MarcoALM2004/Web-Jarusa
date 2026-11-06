package com.Jarussa.backend.service;

import com.Jarussa.backend.dto.Request.ItemPedidoRequest;
import com.Jarussa.backend.dto.Response.NotificacionResponse;
import com.Jarussa.backend.dto.Request.PedidoRequest;
import com.Jarussa.backend.dto.Response.PedidoResponse;
import com.Jarussa.backend.dto.Response.PedidoResumenResponse;
import com.Jarussa.backend.event.NotificacionesCreadasEvent;
import com.Jarussa.backend.exception.SolicitudInvalidaException;
import com.Jarussa.backend.model.Pedido;
import com.Jarussa.backend.model.PedidoDetalle;
import com.Jarussa.backend.model.Producto;
import com.Jarussa.backend.model.ProductoTono;
import com.Jarussa.backend.model.Usuario;
import com.Jarussa.backend.repository.PedidoRepository;
import com.Jarussa.backend.repository.ProductoTonoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoTonoRepository tonoRepository;
    private final NotificacionService notificacionService;
    private final ApplicationEventPublisher eventos;
    private final BigDecimal envio;
    private final int stockBajo;

    public PedidoService(PedidoRepository pedidoRepository,
                            ProductoTonoRepository tonoRepository,
                            NotificacionService notificacionService,
                            ApplicationEventPublisher eventos,
                            @Value("${app.envio}") BigDecimal envio,
                            @Value("${app.stock-bajo}") int stockBajo) {
        this.pedidoRepository = pedidoRepository;
        this.tonoRepository = tonoRepository;
        this.notificacionService = notificacionService;
        this.eventos = eventos;
        this.envio = envio;
        this.stockBajo = stockBajo;
    }

    @Transactional
    public PedidoResponse crear(Usuario usuario, PedidoRequest request) {
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);

        BigDecimal subtotal = BigDecimal.ZERO;
        List<String> alertas = new ArrayList<>();

        for (ItemPedidoRequest item : request.items()) {
            ProductoTono tono = tonoRepository.bloquearPorId(item.tonoId())
                    .orElseThrow(() -> new SolicitudInvalidaException("Uno de los tonos ya no está disponible"));
            Producto producto = tono.getProducto();

            if (!producto.isActivo() || !producto.getId().equals(item.productoId())) {
                throw new SolicitudInvalidaException("El producto " + producto.getNombre() + " ya no está disponible");
            }
            if (tono.getStock() < item.cantidad()) {
                throw new SolicitudInvalidaException("Stock insuficiente de " + producto.getNombre()
                        + " (" + tono.getNombreTono() + "): quedan " + tono.getStock());
            }

            tono.setStock(tono.getStock() - item.cantidad());
            if (tono.getStock() <= stockBajo) {
                alertas.add("Stock bajo: " + producto.getNombre() + " (" + tono.getNombreTono()
                        + "), quedan " + tono.getStock());
            }

            PedidoDetalle detalle = new PedidoDetalle();
            detalle.setProducto(producto);
            detalle.setNombreProducto(producto.getNombre());
            detalle.setNombreTono(tono.getNombreTono());
            detalle.setCantidad(item.cantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            pedido.agregarDetalle(detalle);

            subtotal = subtotal.add(producto.getPrecio().multiply(BigDecimal.valueOf(item.cantidad())));
        }

        pedido.setSubtotal(subtotal);
        pedido.setEnvio(envio);
        pedido.setTotal(subtotal.add(envio));
        pedidoRepository.save(pedido);

        List<NotificacionResponse> notificaciones = new ArrayList<>();
        notificaciones.add(notificacionService.crear("PEDIDO_NUEVO",
                "Nuevo pedido " + codigo(pedido.getId()) + " de " + usuario.getNombre()
                        + " por S/ " + pedido.getTotal().setScale(2, RoundingMode.HALF_UP).toPlainString()));
        for (String alerta : alertas) {
            notificaciones.add(notificacionService.crear("STOCK_BAJO", alerta));
        }
        eventos.publishEvent(new NotificacionesCreadasEvent(notificaciones));

        return aRespuesta(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> misPedidos(Usuario usuario) {
        return pedidoRepository.findByUsuarioOrderByFechaDesc(usuario).stream()
                .map(PedidoService::aRespuesta)
                .toList();
    }

    static String codigo(Long id) {
        return "#JAR-" + String.format("%03d", id);
    }

    static PedidoResumenResponse aResumen(Pedido p) {
        return new PedidoResumenResponse(
                p.getId(), codigo(p.getId()), p.getUsuario().getNombre(),
                p.getFecha(), p.getEstado().name(), p.getTotal());
    }

    static PedidoResponse aRespuesta(Pedido p) {
        List<PedidoResponse.Item> items = p.getDetalles().stream()
                .map(d -> new PedidoResponse.Item(d.getNombreProducto(), d.getNombreTono(),
                        d.getCantidad(), d.getPrecioUnitario()))
                .toList();
        return new PedidoResponse(p.getId(), codigo(p.getId()), p.getFecha(), p.getEstado().name(),
                p.getSubtotal(), p.getEnvio(), p.getTotal(), items);
    }
}