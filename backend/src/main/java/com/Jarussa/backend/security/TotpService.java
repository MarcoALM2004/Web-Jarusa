package com.Jarussa.backend.security;

import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;

@Service 
public class TotpService {
    private static final long PASO_SEGUNDOS = 30; 
    private static final int VENTANA = 1; 
    private static final String ALFABETO_BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

    public long verificar(String secretoBase32, String codigo, Long ultimoPaso) {
        byte[] clave= decodificarBase32(secretoBase32);
        long actual = System.currentTimeMillis() / 1000 / PASO_SEGUNDOS;

        for (long paso = actual - VENTANA; paso <= actual + VENTANA; paso++) {
            if (ultimoPaso != null && paso <= ultimoPaso) continue;
            if (sonIguales(generar(clave, paso), codigo)) return paso;
        }
        return -1;
    }

    static String generar(byte[] clave, long contador) {
        try {
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(new SecretKeySpec(clave, "HmacSHA1"));
            byte[] h = mac.doFinal(ByteBuffer.allocate(8).putLong(contador).array());

            int offset = h[h.length - 1] & 0x0F; 
            int binario = ((h[offset] & 0x7F) << 24)
                    | ((h[offset + 1] & 0xFF) << 16)
                    | ((h[offset + 2] & 0xFF) << 8)
                    | (h[offset + 3] & 0xFF);
            return String.format("%06d", binario % 1_000_000);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("No se pudo generar el codigo TOTP", e);
        }
    }

    static byte[] decodificarBase32(String texto) {
        String limpio = texto.replace(" ", "").replace("=", "").toUpperCase();
        ByteArrayOutputStream salida = new ByteArrayOutputStream();
        int buffer = 0;
        int bits = 0;

        for (char c : limpio.toCharArray()) {
            int valor = ALFABETO_BASE32.indexOf(c);
            if (valor < 0) throw new IllegalArgumentException("Secreto Base32 invalido");
            buffer = (buffer << 5) | valor;
            bits += 5;
            if (bits >= 8) {
                salida.write((buffer >> (bits - 8)) & 0xFF);
                bits -= 8;
                buffer &= (1 << bits) - 1;
            }
        }
        return salida.toByteArray();
    }

    private static boolean sonIguales(String a, String b) {
        return MessageDigest.isEqual(a.getBytes(StandardCharsets.UTF_8), b.getBytes(StandardCharsets.UTF_8));
    }
}