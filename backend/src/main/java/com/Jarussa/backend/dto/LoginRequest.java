package com.Jarussa.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no es valido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    private String contrasena;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
}