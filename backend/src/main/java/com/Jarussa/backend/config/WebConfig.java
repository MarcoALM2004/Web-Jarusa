package com.Jarussa.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final Path carpeta;

    public WebConfig(@Value("${app.upload-dir}") String uploadDir) throws IOException {
        this.carpeta = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.carpeta);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(carpeta.toUri().toString());
    }
}
