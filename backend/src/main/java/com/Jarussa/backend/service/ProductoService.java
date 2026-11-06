package com.Jarussa.backend.service;

import com.Jarussa.backend.dto.Response.CategoriaResponse;
import com.Jarussa.backend.dto.Response.ProductoDetalleResponse;
import com.Jarussa.backend.dto.Request.ProductoRequest;
import com.Jarussa.backend.dto.Response.ProductoResponse;
import com.Jarussa.backend.dto.Request.TonoRequest;
import com.Jarussa.backend.dto.Response.TonoResponse;
import com.Jarussa.backend.exception.RecursoNoEncontradoException;
import com.Jarussa.backend.exception.SolicitudInvalidaException;
import com.Jarussa.backend.model.Categoria;
import com.Jarussa.backend.model.Producto;
import com.Jarussa.backend.model.ProductoTono;
import com.Jarussa.backend.repository.CategoriaRepository;
import com.Jarussa.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(ProductoRepository productoRepository,
                           CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }


    @Transactional(readOnly = true)
    public List<ProductoResponse> buscar(String nombre, List<Long> categorias) {
        String texto = nombre == null ? "" : nombre.trim();
        boolean filtrar = categorias != null && !categorias.isEmpty();
        List<Long> ids = filtrar ? categorias : List.of(-1L);

        return productoRepository.buscar(texto, filtrar, ids).stream()
                .map(p -> new ProductoResponse(
                        p.getId(),
                        p.getNombre(),
                        p.getPrecio(),
                        p.getDescripcion(),
                        p.getImagenUrl(),
                        p.getCategoria().getId(),
                        p.getCategoria().getNombre(),
                        p.getTonos().size()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarCategorias() {
        return categoriaRepository.findAllByOrderByNombreAsc().stream()
                .map(c -> new CategoriaResponse(c.getId(), c.getNombre()))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoDetalleResponse obtener(Long id) {
        return aDetalle(buscarActivo(id));
    }


    @Transactional(readOnly = true)
    public List<ProductoDetalleResponse> listarAdmin() {
        return productoRepository.findByActivoTrueOrderByIdDesc().stream()
                .map(ProductoService::aDetalle)
                .toList();
    }

    @Transactional
    public ProductoDetalleResponse crear(ProductoRequest r) {
        Producto p = new Producto();
        aplicar(p, r);
        return aDetalle(productoRepository.saveAndFlush(p));
    }

    @Transactional
    public ProductoDetalleResponse actualizar(Long id, ProductoRequest r) {
        Producto p = buscarActivo(id);
        aplicar(p, r);
        return aDetalle(productoRepository.saveAndFlush(p));
    }

    @Transactional
    public void eliminar(Long id) {
        buscarActivo(id).setActivo(false);
    }


    private Producto buscarActivo(Long id) {
        return productoRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado"));
    }

    private void aplicar(Producto p, ProductoRequest r) {
        Categoria categoria = categoriaRepository.findById(r.categoriaId())
                .orElseThrow(() -> new SolicitudInvalidaException("La categoría no existe"));

        p.setNombre(r.nombre().trim());
        p.setPrecio(r.precio());
        p.setDescripcion(vacioANulo(r.descripcion()));
        p.setCaracteristicas(vacioANulo(r.caracteristicas()));
        p.setImagenUrl(r.imagenUrl().trim());
        p.setCategoria(categoria);

        Map<Long, ProductoTono> actuales = new HashMap<>();
        for (ProductoTono t : p.getTonos()) actuales.put(t.getId(), t);

        List<ProductoTono> resultado = new ArrayList<>();
        for (TonoRequest tr : r.tonos()) {
            ProductoTono t = tr.id() == null ? null : actuales.remove(tr.id());
            if (t == null) {
                t = new ProductoTono();
                t.setProducto(p);
            }
            t.setNombreTono(tr.nombre().trim());
            t.setColorHex(vacioANulo(tr.colorHex()));
            t.setStock(tr.stock());
            resultado.add(t);
        }
        p.getTonos().clear();
        p.getTonos().addAll(resultado);
    }

    private static String vacioANulo(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }

    private static ProductoDetalleResponse aDetalle(Producto p) {
        List<TonoResponse> tonos = p.getTonos().stream()
                .sorted(Comparator.comparing(ProductoTono::getId, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(t -> new TonoResponse(t.getId(), t.getNombreTono(), t.getColorHex(), t.getStock()))
                .toList();
        return new ProductoDetalleResponse(
                p.getId(), p.getNombre(), p.getPrecio(), p.getDescripcion(), p.getCaracteristicas(),
                p.getImagenUrl(), p.getCategoria().getId(), p.getCategoria().getNombre(), tonos);
    }
}
