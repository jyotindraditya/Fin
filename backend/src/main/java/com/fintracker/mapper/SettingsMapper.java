package com.fintracker.mapper;

import com.fintracker.dto.response.SettingsResponse;
import com.fintracker.entity.Settings;
import org.springframework.stereotype.Component;

@Component
public class SettingsMapper {

    public SettingsResponse toResponse(Settings settings) {
        return new SettingsResponse(
            settings.getId(),
            settings.getMonthlyBudget(),
            settings.getCurrency(),
            settings.getResetDay(),
            settings.getUpdatedAt()
        );
    }
}
