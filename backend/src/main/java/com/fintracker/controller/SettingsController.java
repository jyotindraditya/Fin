package com.fintracker.controller;

import com.fintracker.dto.request.SettingsRequest;
import com.fintracker.dto.response.ApiResponse;
import com.fintracker.dto.response.SettingsResponse;
import com.fintracker.service.SettingsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SettingsResponse>> getSettings() {
        return ResponseEntity.ok(
            ApiResponse.success("Settings retrieved", settingsService.getSettings()));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<SettingsResponse>> updateSettings(
            @Valid @RequestBody SettingsRequest request) {
        return ResponseEntity.ok(
            ApiResponse.success("Settings updated", settingsService.updateSettings(request)));
    }
}
