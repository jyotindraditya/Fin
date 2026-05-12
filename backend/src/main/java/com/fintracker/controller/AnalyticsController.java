package com.fintracker.controller;

import com.fintracker.dto.response.ApiResponse;
import com.fintracker.dto.response.PieChartResponse;
import com.fintracker.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/pie-chart")
    public ResponseEntity<ApiResponse<PieChartResponse>> getPieChart(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(
            ApiResponse.success("Analytics retrieved", analyticsService.getPieChartData(month, year)));
    }
}
