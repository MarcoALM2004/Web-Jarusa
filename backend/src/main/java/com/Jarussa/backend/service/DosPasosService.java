package com.Jarussa.backend.service;

import com.Jarussa.backend.dto.Response.AuthResponse;
import com.Jarussa.backend.exception.DosPasosException;
import com.Jarussa.backend.model.Usuario;
import com.Jarussa.backend.repository.UsuarioRepository;
import com.Jarussa.backend.security.JwtService;
import com.Jarussa.backend.security.TotpService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DosPasosService {

    private static final int MAX_INTENTOS = 5;
    private static final long BLOQUEO_MS = 60_000;

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final TotpService totpService;

    public DosPasosService(UsuarioRepository usuarioRepository, JwtService jwtService, TotpService totpService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.totpService = totpService;
    }

    @Transactional(noRollbackFor = DosPasosException.class)
    public AuthResponse verificar(String tokenTemporal, String codigo) {
        String email = emailDelPase(tokenTemporal);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .filter(u -> u.isDosPasosActivo() && u.getTotpSecreto() != null)
                .orElseThrow(() -> new DosPasosException(HttpStatus.UNAUTHORIZED,
                        "El pase temporal no es válido. Inicia sesión de nuevo."));

        long ahora = System.currentTimeMillis();

        if (usuario.getBloqueadoHasta() != null && usuario.getBloqueadoHasta() > ahora) {
            long segundos = (usuario.getBloqueadoHasta() - ahora + 999) / 1000;
            throw new DosPasosException(HttpStatus.TOO_MANY_REQUESTS,
                    "Demasiados intentos. Intenta de nuevo en " + segundos + " segundos.", segundos);
        }

        long paso = totpService.verificar(usuario.getTotpSecreto(), codigo, usuario.getUltimoPaso());

        if (paso < 0) {
            int intentos = usuario.getIntentos2fa() + 1;

            if (intentos >= MAX_INTENTOS) {
                usuario.setIntentos2fa(0);
                usuario.setBloqueadoHasta(ahora + BLOQUEO_MS);
                usuarioRepository.save(usuario);
                throw new DosPasosException(HttpStatus.TOO_MANY_REQUESTS,
                        "Demasiados intentos. Intenta de nuevo en 60 segundos.", BLOQUEO_MS / 1000);
            }

            usuario.setIntentos2fa(intentos);
            usuarioRepository.save(usuario);
            throw new DosPasosException(HttpStatus.UNAUTHORIZED,
                    "Código incorrecto o ya utilizado. Intentos restantes: " + (MAX_INTENTOS - intentos));
        }

        usuario.setUltimoPaso(paso);
        usuario.setIntentos2fa(0);
        usuario.setBloqueadoHasta(null);
        usuarioRepository.save(usuario);

        String token = jwtService.generarToken(usuario.getEmail(), usuario.getRol().name());
        return new AuthResponse(
                token,
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getCelular(),
                usuario.getDireccion(),
                usuario.getRol().name()
        );
    }

    private String emailDelPase(String tokenTemporal) {
        try {
            String email = jwtService.extraerEmail(tokenTemporal);
            boolean esPase = "pendiente-2fa".equals(jwtService.extraerEtapa(tokenTemporal));
            if (esPase && jwtService.esTokenValido(tokenTemporal, email)) {
                return email;
            }
        } catch (Exception e) {
        }
        throw new DosPasosException(HttpStatus.UNAUTHORIZED,
                "El pase temporal venció o no es válido. Inicia sesión de nuevo.");
    }
}