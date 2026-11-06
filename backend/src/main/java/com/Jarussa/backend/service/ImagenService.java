package com.Jarussa.backend.service;

import com.Jarussa.backend.exception.SolicitudInvalidaException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImagenService {

    private final Path carpeta;

    public ImagenService(@Value("${app.upload-dir}") String uploadDir) throws IOException {
        this.carpeta = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(carpeta);
    }

    public String guardar(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new SolicitudInvalidaException("Selecciona una imagen");
        }

        String extension;
        try (InputStream in = archivo.getInputStream()) {
            extension = detectarExtension(in.readNBytes(12));
        } catch (IOException e) {
            throw new SolicitudInvalidaException("No se pudo leer la imagen");
        }
        if (extension == null) {
            throw new SolicitudInvalidaException("Solo se permiten imágenes PNG, JPG o WEBP");
        }

        String nombre = UUID.randomUUID() + "." + extension; 
        try (InputStream in = archivo.getInputStream()) {
            Files.copy(in, carpeta.resolve(nombre));
        } catch (IOException e) {
            throw new SolicitudInvalidaException("No se pudo guardar la imagen");
        }

        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/").path(nombre).toUriString();
    }

    private static String detectarExtension(byte[] b) {
        if (b.length >= 8 && (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G') return "png";
        if (b.length >= 3 && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) return "jpg";
        if (b.length >= 12 && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P') return "webp";
        return null;
    }
}
