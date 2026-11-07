package com.Jarussa.backend.dto.Response;

public class AuthResponse {

    private String token;
    private String nombre;
    private String email;
    private String rol;

    private boolean requiere2fa;
    private String tokenTemporal;

    public AuthResponse(String token, String nombre, String email, String rol) {
        this.token = token;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
    }

    private AuthResponse(String tokenTemporal) {
        this.requiere2fa = true;
        this.tokenTemporal = tokenTemporal;
    }

    public static AuthResponse pendiente(String tokenTemporal) {
        return new AuthResponse(tokenTemporal);
    }

    public String getToken() { return token; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getRol() { return rol; }
    public boolean isRequiere2fa() { return requiere2fa; }
    public String getTokenTemporal() { return tokenTemporal; }
}