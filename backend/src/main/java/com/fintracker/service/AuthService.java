package com.fintracker.service;

import com.fintracker.dto.request.LoginRequest;
import com.fintracker.dto.request.RefreshTokenRequest;
import com.fintracker.dto.request.RegisterRequest;
import com.fintracker.dto.response.AuthResponse;
import com.fintracker.entity.Category;
import com.fintracker.entity.RefreshToken;
import com.fintracker.entity.Settings;
import com.fintracker.entity.User;
import com.fintracker.exception.BadRequestException;
import com.fintracker.repository.CategoryRepository;
import com.fintracker.repository.RefreshTokenRepository;
import com.fintracker.repository.SettingsRepository;
import com.fintracker.repository.UserRepository;
import com.fintracker.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final CategoryRepository categoryRepository;
    private final SettingsRepository settingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpirationMs;

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       CategoryRepository categoryRepository,
                       SettingsRepository settingsRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.categoryRepository = categoryRepository;
        this.settingsRepository = settingsRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new BadRequestException("Username '" + request.username() + "' is already taken");
        }

        User user = new User(request.username(), passwordEncoder.encode(request.password()));
        user = userRepository.save(user);

        // Seed default categories for new user
        seedDefaultCategories(user);

        // Create default settings for new user
        Settings settings = new Settings();
        settings.setUser(user);
        settingsRepository.save(settings);

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
            .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        return buildAuthResponse(user);
    }

    public AuthResponse refresh(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.refreshToken())
            .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new BadRequestException("Refresh token has expired. Please log in again.");
        }

        User user = userRepository.findById(refreshToken.getUserId())
            .orElseThrow(() -> new BadRequestException("User not found"));

        // Delete old refresh token and issue a new pair
        refreshTokenRepository.delete(refreshToken);

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user);

        // Create new refresh token
        String refreshTokenStr = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusNanos(refreshExpirationMs * 1_000_000);
        RefreshToken refreshToken = new RefreshToken(refreshTokenStr, user.getId(), expiresAt);
        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(accessToken, refreshTokenStr, user.getUsername());
    }

    private void seedDefaultCategories(User user) {
        List.of(
            new Category("Food & Dining",     "#ef4444", "utensils"),
            new Category("Transportation",    "#f59e0b", "car"),
            new Category("Shopping",          "#8b5cf6", "shopping-bag"),
            new Category("Entertainment",     "#ec4899", "film"),
            new Category("Bills & Utilities", "#3b82f6", "zap"),
            new Category("Healthcare",        "#10b981", "heart"),
            new Category("Other",             "#6b7280", "more-horizontal")
        ).forEach(cat -> {
            cat.setUser(user);
            categoryRepository.save(cat);
        });
    }
}
