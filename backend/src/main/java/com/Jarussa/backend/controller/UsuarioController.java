
package com.Jarussa.backend.controller;

import com.Jarussa.backend.dto.ActualizarPerfilRequest;
import com.Jarussa.backend.dto.Response.AuthResponse;
import com.Jarussa.backend.model.Usuario;
import com.Jarussa.backend.repository.UsuarioRepository;
import com.Jarussa.backend.security.JwtService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public UsuarioController(
            UsuarioRepository usuarioRepository,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody ActualizarPerfilRequest request
    ) {

        // Comprobar que el correo no pertenezca a otro usuario
        if (usuarioRepository.existsByEmailAndIdNot(
                request.getEmail(),
                usuario.getId()
        )) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "mensaje",
                            "El correo ya está registrado por otro usuario"
                    ));
        }

        // Actualizar información personal
        usuario.setNombre(request.getNombre().trim());
        usuario.setApellido(
                request.getApellido() == null
                        ? null
                        : request.getApellido().trim()
        );
        usuario.setEmail(request.getEmail().trim());
        usuario.setCelular(
                request.getCelular() == null
                        ? null
                        : request.getCelular().trim()
        );
        usuario.setDireccion(
                request.getDireccion() == null
                        ? null
                        : request.getDireccion().trim()
        );

        // Guardar en MySQL
        Usuario actualizado = usuarioRepository.save(usuario);

        // Generar otro JWT por si cambió el correo
        String nuevoToken = jwtService.generarToken(
                actualizado.getEmail(),
                actualizado.getRol().name()
        );

        AuthResponse response = new AuthResponse(
                nuevoToken,
                actualizado.getNombre(),
                actualizado.getApellido(),
                actualizado.getEmail(),
                actualizado.getCelular(),
                actualizado.getDireccion(),
                actualizado.getRol().name()
        );

        return ResponseEntity.ok(response);
    }
}
