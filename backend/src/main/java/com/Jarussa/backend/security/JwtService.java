package com.Jarussa.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationMs;

    private static final long PASE_TEMPORAL_MS = 5 * 60 * 1000;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generarToken(String email, String rol) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + expirationMs);

        return Jwts.builder()
                .subject(email)
                .claim("rol", rol)
                .claim("etapa", "completa") // token final: abre todas las rutas
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(getSigningKey())
                .compact();
    }

    public String generarTokenTemporal(String email) {
        Date ahora = new Date();

        return Jwts.builder()
                .subject(email)
                .claim("etapa", "pendiente-2fa")
                .issuedAt(ahora)
                .expiration(new Date(ahora.getTime() + PASE_TEMPORAL_MS))
                .signWith(getSigningKey())
                .compact();
    }

    public String extraerEtapa(String token) {
        return extraerClaim(token, claims -> claims.get("etapa", String.class));
    }

    public String extraerEmail(String token) {
        return extraerClaim(token, Claims::getSubject);
    }

    public String extraerRol(String token) {
        return extraerClaim(token, claims -> claims.get("rol", String.class));
    }

    public boolean esTokenValido(String token, String emailEsperado) {
        final String email = extraerEmail(token);
        return email.equals(emailEsperado) && !estaExpirado(token);
    }

    private boolean estaExpirado(String token) {
        return extraerClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extraerClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }
}