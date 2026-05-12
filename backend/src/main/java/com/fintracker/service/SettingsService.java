package com.fintracker.service;

import com.fintracker.dto.request.SettingsRequest;
import com.fintracker.dto.response.SettingsResponse;
import com.fintracker.entity.Settings;
import com.fintracker.entity.User;
import com.fintracker.mapper.SettingsMapper;
import com.fintracker.repository.SettingsRepository;
import com.fintracker.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SettingsService {

    private final SettingsRepository settingsRepository;
    private final SettingsMapper settingsMapper;

    public SettingsService(SettingsRepository settingsRepository, SettingsMapper settingsMapper) {
        this.settingsRepository = settingsRepository;
        this.settingsMapper = settingsMapper;
    }

    @Transactional(readOnly = true)
    public SettingsResponse getSettings() {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = SecurityUtils.getCurrentUser();

        Settings settings = settingsRepository.findByUserId(userId)
            .orElseGet(() -> {
                Settings defaultSettings = new Settings();
                defaultSettings.setUser(user);
                return settingsRepository.save(defaultSettings);
            });
        return settingsMapper.toResponse(settings);
    }

    public SettingsResponse updateSettings(SettingsRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = SecurityUtils.getCurrentUser();

        Settings settings = settingsRepository.findByUserId(userId)
            .orElseGet(() -> {
                Settings s = new Settings();
                s.setUser(user);
                return s;
            });

        settings.setMonthlyBudget(request.monthlyBudget());
        if (request.currency() != null) {
            settings.setCurrency(request.currency());
        }
        if (request.resetDay() != null) {
            settings.setResetDay(request.resetDay());
        }

        return settingsMapper.toResponse(settingsRepository.save(settings));
    }
}
