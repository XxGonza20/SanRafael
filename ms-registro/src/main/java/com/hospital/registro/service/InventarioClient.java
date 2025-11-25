package com.hospital.registro.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.Optional;

@Service
public class InventarioClient {

    private final WebClient webClient;

    public InventarioClient(WebClient inventarioWebClient) {
        this.webClient = inventarioWebClient;
    }

    @CircuitBreaker(name = "inventario", fallbackMethod = "fallbackCreateEquipo")
    public Optional<Map> createEquipo(Map<String, Object> payload, String bearerToken) {

        return webClient.post()
                .uri("/api/equipos")
                .header(HttpHeaders.AUTHORIZATION, bearerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(Map.class)
                .map(Optional::of)
                .onErrorReturn(Optional.empty())
                .block();
    }

    private Optional<Map> fallbackCreateEquipo(Map<String, Object> payload,
                                               String bearerToken,
                                               Throwable t) {
        return Optional.empty();
    }
}
