package com.example.supportsystem.controller;
import com.example.supportsystem.mapper.SupportSystemMapper;
import com.example.supportsystem.dto.DashboardDTO;
import com.example.supportsystem.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/estatisticas")
    public ResponseEntity<DashboardDTO> getEstatisticas() {
        return ResponseEntity.ok(dashboardService.getEstatisticas());
    }
}