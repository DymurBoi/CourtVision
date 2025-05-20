package cit.edu.capstone.CourtVision.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenProvider tokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        logger.debug("Processing request for path: {}", path);

        String authHeader = request.getHeader("Authorization");
        logger.debug("Authorization header: {}", authHeader != null ? 
                     authHeader.substring(0, Math.min(20, authHeader.length())) + "..." : "null");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            logger.debug("JWT token extracted (first 10 chars): {}...", 
                         token.substring(0, Math.min(10, token.length())));

            try {
                Claims claims = tokenProvider.validateToken(token);
                String email = claims.get("email", String.class);
                String role = claims.get("role", String.class);
                String subject = claims.getSubject();

                logger.debug("Token validated successfully. Subject: {}, Email: {}, Role: {}", 
                             subject, email, role);

                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);
                
                // Use the subject as the principal rather than email - this keeps the PLAYER_X format
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        subject, null, List.of(authority)
                );

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
                logger.debug("Authentication set in SecurityContext with principal: {}", subject);

            } catch (Exception e) {
                logger.error("Token validation failed: {}", e.getMessage());
                if (logger.isDebugEnabled()) {
                    logger.debug("Token validation stack trace:", e);
                }
                
                // Don't set authentication - this will result in 401/403 response
                SecurityContextHolder.clearContext();
            }
        } else {
            logger.debug("No valid Authorization header found");
        }

        filterChain.doFilter(request, response);
    }
}
