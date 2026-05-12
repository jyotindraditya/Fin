package com.fintracker.security;

import com.fintracker.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Utility to extract the authenticated user from Spring Security context.
 */
public final class SecurityUtils {

    private SecurityUtils() {}

    public static User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user;
        }
        throw new IllegalStateException("No authenticated user found");
    }

    public static Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
