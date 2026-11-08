package com.Jarussa.backend.dto.Response;

public class AuthResponse {

    private String token;
    private String nombre;
    private String apellido;
    private String email;
    private String celular;
    private String direccion;
    private String rol;

    // Autenticación en dos pasos
    private boolean requiere2fa;
    private String tokenTemporal;

    // Respuesta normal de autenticación
    public AuthResponse(
            String token,
            String nombre,
            String apellido,
            String email,
            String celular,
            String direccion,
            String rol
    ) {
        this.token = token;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.celular = celular;
        this.direccion = direccion;
        this.rol = rol;
        this.requiere2fa = false;
    }

    // Respuesta pendiente de verificación 2FA
    private AuthResponse(String tokenTemporal) {
        this.requiere2fa = true;
        this.tokenTemporal = tokenTemporal;
    }

    public static AuthResponse pendiente(String tokenTemporal) {
        return new AuthResponse(tokenTemporal);
    }

    public String getToken() {
        return token;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getEmail() {
        return email;
    }

    public String getCelular() {
        return celular;
    }

    public String getDireccion() {
        return direccion;
    }

    public String getRol() {
        return rol;
    }

    public boolean isRequiere2fa() {
        return requiere2fa;
    }

    public String getTokenTemporal() {
        return tokenTemporal;
    }
}
