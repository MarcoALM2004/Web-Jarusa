package com.Jarussa.backend.service;

import com.Jarussa.backend.dto.CategoriaResponse;
import com.Jarussa.backend.dto.ProductoResponse;
import com.Jarussa.backend.repository.CategoriaRepository;
import com.Jarussa.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
}
