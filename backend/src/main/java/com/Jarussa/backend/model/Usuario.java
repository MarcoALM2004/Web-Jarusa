package com.Jarussa.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "contrasena", nullable = false)
    private String contrasena;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol = Rol.CLIENTE;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "totp_secreto", length = 64)
    private String totpSecreto;

    @Column(name = "dos_pasos_activo", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean dosPasosActivo = false;

    @Column(name = "ultimo_paso")
    private Long ultimoPaso; 
    @Column(name = "intentos_2fa", columnDefinition = "INT DEFAULT 0")
    private int intentos2fa = 0;

    @Column(name = "bloqueado_hasta")
    private Long bloqueadoHasta; 

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }

    public Usuario() {
    }

    public Usuario(String nombre, String email, String contrasena, Rol rol) {
        this.nombre = nombre;
        this.email = email;
        this.contrasena = contrasena;
        this.rol = rol;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public String getTotpSecreto() { return totpSecreto; }
    public void setTotpSecreto(String totpSecreto) { this.totpSecreto = totpSecreto; }

    public boolean isDosPasosActivo() { return dosPasosActivo; }
    public void setDosPasosActivo(boolean dosPasosActivo) { this.dosPasosActivo = dosPasosActivo; }

    public Long getUltimoPaso() { return ultimoPaso; }
    public void setUltimoPaso(Long ultimoPaso) { this.ultimoPaso = ultimoPaso; }

    public int getIntentos2fa() { return intentos2fa; }
    public void setIntentos2fa(int intentos2fa) { this.intentos2fa = intentos2fa; }

    public Long getBloqueadoHasta() { return bloqueadoHasta; }
    public void setBloqueadoHasta(Long bloqueadoHasta) { this.bloqueadoHasta = bloqueadoHasta; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
}
