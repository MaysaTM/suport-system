package com.example.supportsystem.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import com.example.supportsystem.mapper.SupportSystemMapper;
@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<String> home() {
        String welcome = """
            Support System API - Bem-vindo!
            Endpoints disponíveis:
            - GET    /api/clientes
            - POST   /api/clientes
            - GET    /api/tickets
            - POST   /api/tickets
            """;
        return ResponseEntity.ok(welcome);
    }
}