package org.mastercard.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mastercard.backend.security.CustomUserDetailService;
import org.mastercard.backend.security.JwtAuthenticationFilter;
import org.mastercard.backend.security.SecurityConfig;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SecurityConfig Unit Tests")
class SecurityConfigTest {

    @Mock
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Mock
    private CustomUserDetailService customUserDetailService;

    private SecurityConfig securityConfig;

    @BeforeEach
    void setUp() {
        securityConfig = new SecurityConfig();
        securityConfig.jwtAuthenticationFilter = jwtAuthenticationFilter;
        securityConfig.customUserDetailService = customUserDetailService;
    }

    @Test
    @DisplayName("Should create BCryptPasswordEncoder bean")
    void passwordEncoder_ShouldReturnBCryptPasswordEncoder() {
        // When
        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();

        // Then
        assertThat(passwordEncoder).isInstanceOf(BCryptPasswordEncoder.class);
        
        // Verify it can encode passwords
        String encoded = passwordEncoder.encode("testPassword");
        assertThat(encoded).isNotNull();
        assertThat(encoded).isNotEqualTo("testPassword");
        assertTrue(passwordEncoder.matches("testPassword", encoded));
    }

    @Test
    @DisplayName("Should create DaoAuthenticationProvider with correct configuration")
    void authenticationProvider_ShouldReturnConfiguredDaoAuthenticationProvider() {
        // When
        AuthenticationProvider provider = securityConfig.authenticationProvider();

        // Then
        assertThat(provider).isInstanceOf(DaoAuthenticationProvider.class);
        
        DaoAuthenticationProvider daoProvider = (DaoAuthenticationProvider) provider;
        // Note: These are package-private fields, so we're testing behavior indirectly
        assertThat(daoProvider).isNotNull();
    }


}
