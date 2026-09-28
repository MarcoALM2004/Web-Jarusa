package com.Jarussa.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "producto_tono")
public class ProductoTono {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(name = "nombre_tono", nullable = false, length = 50)
    private String nombreTono;

    @Column(name = "color_hex", length = 7)
    private String colorHex;

    @Column(nullable = false)
    private int stock = 0;

    public ProductoTono() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public String getNombreTono() { return nombreTono; }
    public void setNombreTono(String nombreTono) { this.nombreTono = nombreTono; }

    public String getColorHex() { return colorHex; }
    public void setColorHex(String colorHex) { this.colorHex = colorHex; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}
