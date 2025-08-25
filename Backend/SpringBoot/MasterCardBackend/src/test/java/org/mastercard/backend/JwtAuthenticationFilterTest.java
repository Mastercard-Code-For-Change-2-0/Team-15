package org.mastercard.backend;

import jakarta.servlet.ServletException;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mastercard.backend.security.JwtAuthenticationFilter;
import org.mastercard.backend.security.JwtService;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JwtAuthenticationFilter unit tests")
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private jakarta.servlet.FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter filter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void init() {
        request  = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    /* --------------------------------------------------------------------- */
    /*  Happy path                                                            */
    /* --------------------------------------------------------------------- */

    @Test
    @DisplayName("Valid token → authentication stored, chain continues")
    void validToken_setsAuthenticationAndProceeds() throws Exception {
        // Arrange
        request.setServletPath("/api/data");
        request.addHeader("Authorization", "Bearer GOOD");
        when(jwtService.validateToken("GOOD")).thenReturn(true);
        when(jwtService.getEmailFromToken("GOOD")).thenReturn("john@example.com");

        // Act
        filter.doFilter(request, response, filterChain);

        // Assert
        verify(filterChain).doFilter(request, response);
        var auth = SecurityContextHolder.getContext().getAuthentication();
        assertThat(auth).isNotNull();
        assertThat(auth.getPrincipal()).isEqualTo("john@example.com");
        assertThat(auth.getAuthorities()).anyMatch(a -> a.getAuthority().equals("ROLE_USER"));
    }

    /* --------------------------------------------------------------------- */
    /*  Early-exit paths                                                      */
    /* --------------------------------------------------------------------- */

    @Test
    @DisplayName("Public endpoints bypass authentication")
    void publicEndpoint_skipsFilterLogic() throws Exception {
        request.setServletPath("/auth/user/register");

        filter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    @DisplayName("Missing or malformed header → chain continues unmodified")
    void missingHeader_proceedsWithoutAuth() throws Exception {
        request.setServletPath("/api/other");               // not public
        // no Authorization header

        filter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    /* --------------------------------------------------------------------- */
    /*  Error paths                                                           */
    /* --------------------------------------------------------------------- */

    @Test
    @DisplayName("Invalid token → 401 without calling downstream chain")
    void invalidToken_sends401() throws Exception {
        request.setServletPath("/api/secure");
        request.addHeader("Authorization", "Bearer BAD");
        when(jwtService.validateToken("BAD")).thenReturn(false);

        filter.doFilter(request, response, filterChain);

        verify(filterChain, never()).doFilter(any(), any());
        assertThat(response.getStatus()).isEqualTo(401);
    }

    @Test
    @DisplayName("Exception in JwtService → 401 without calling downstream chain")
    void jwtServiceThrows_sends401() throws Exception {
        request.setServletPath("/api/secure");
        request.addHeader("Authorization", "Bearer OOPS");
        when(jwtService.validateToken("OOPS"))
                .thenThrow(new RuntimeException("Unexpected parsing error"));

        filter.doFilter(request, response, filterChain);

        verify(filterChain, never()).doFilter(any(), any());
        assertThat(response.getStatus()).isEqualTo(401);
    }
}
