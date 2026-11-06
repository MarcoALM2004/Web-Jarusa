package com.Jarussa.backend.dto.Request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record ProductoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre admite hasta 100 caracteres")
        String nombre,
        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
        @Digits(integer = 4, fraction = 2, message = "El precio admite hasta 4 enteros y 2 decimales")
        BigDecimal precio,
        @Size(max = 255, message = "La descripción admite hasta 255 caracteres")
        String descripcion,
        @Size(max = 1000, message = "Las características admiten hasta 1000 caracteres")
        String caracteristicas,
        @NotBlank(message = "La imagen es obligatoria")
        @Size(max = 255, message = "La URL de la imagen es demasiado larga")
        String imagenUrl,
        @NotNull(message = "La categoría es obligatoria")
        Long categoriaId,
        @NotEmpty(message = "Agrega al menos un tono")
        @Valid
        List<TonoRequest> tonos
) {
}