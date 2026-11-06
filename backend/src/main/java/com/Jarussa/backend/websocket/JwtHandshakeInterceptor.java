package com.Jarussa.backend.websocket;

import com.Jarussa.backend.model.Rol;
import com.Jarussa.backend.model.Usuario;
import com.Jarussa.backend.repository.UsuarioRepository;
import com.Jarussa.backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;
import java.util.Optional;

// El navegador no puede mandar cabeceras en un WebSocket, asi que el token viaja en ?token=...
// Solo deja pasar a administradores con token valido.
@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtHandshakeInterceptor(JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        if (request instanceof ServletServerHttpRequest servlet) {
            String token = servlet.getServletRequest().getParameter("token");
            if (token != null && !token.isBlank()) {
                try {
                    String email = jwtService.extraerEmail(token);
                    if (jwtService.esTokenValido(token, email)) {
                        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
                        if (usuario.isPresent() && usuario.get().getRol() == Rol.ADMIN) {
                            return true;
                        }
                    }
                } catch (Exception e) {
                    // token malformado o expirado: se rechaza abajo
                }
            }
        }
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
    }
}
