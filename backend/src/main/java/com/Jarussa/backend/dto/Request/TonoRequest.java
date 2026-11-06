package com.Jarussa.backend.dto.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record TonoRequest(
        Long id, // null = tono nuevo; con id = se actualiza ese tono
        @NotBlank(message = "El nombre del tono es obligatorio")
        @Size(max = 50, message = "El nombre del tono admite hasta 50 caracteres")
        String nombre,
        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "El color debe tener formato #RRGGBB")
        String colorHex,
        @NotNull(message = "El stock del tono es obligatorio")
        @Min(value = 0, message = "El stock no puede ser negativo")
        Integer stock
) {
}
