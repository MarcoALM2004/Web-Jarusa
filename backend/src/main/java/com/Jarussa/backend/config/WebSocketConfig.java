package com.Jarussa.backend.config;

import com.Jarussa.backend.websocket.AdminSocketHandler;
import com.Jarussa.backend.websocket.JwtHandshakeInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final AdminSocketHandler handler;
    private final JwtHandshakeInterceptor interceptor;
    private final String[] origenes;

    public WebSocketConfig(AdminSocketHandler handler,
                           JwtHandshakeInterceptor interceptor,
                           @Value("${app.cors-origin}") String[] origenes) {
        this.handler = handler;
        this.interceptor = interceptor;
        this.origenes = origenes;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/ws/admin")
                .addInterceptors(interceptor)
                .setAllowedOrigins(origenes);
    }
}
