package com.Jarussa.backend.dto.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record Verificar2faRequest(
        @NotBlank(message = "Falta el pase temporal")
        String tokenTemporal,
        @NotBlank(message = "Ingresa el código de 6 dígitos")
        @Pattern(regexp = "\\d{6}", message = "El código debe tener 6 dígitos")
        String codigo
) {
}