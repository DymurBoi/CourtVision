package cit.edu.capstone.CourtVision.security;

import cit.edu.capstone.CourtVision.entity.Admin;
import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.entity.Player;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private final long EXPIRATION_TIME = 86400000L;

    public String generateToken(Object user) {
        String subject = "";
        String role = "";
        String email = "";

        if (user instanceof Player player) {
            subject = "PLAYER_" + player.getPlayerId();
            email = player.getEmail();
            role = "ROLE_PLAYER";
        } else if (user instanceof Coach coach) {
            subject = "COACH_" + coach.getCoachId();
            email = coach.getEmail();
            role = "ROLE_COACH";
        } else if (user instanceof Admin admin) {
            subject = "ADMIN_" + admin.getAdminId();
            email = admin.getEmail();
            role = "ROLE_ADMIN";
        }

        return Jwts.builder()
                .setSubject(subject)
                .claim("email", email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey)
                .compact();
    }

    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
