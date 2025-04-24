package cit.edu.capstone.CourtVision.security;


import cit.edu.capstone.CourtVision.entity.Admin;
import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.entity.Player;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private final long EXPIRATION_TIME = 86400000L; // 24 hours

    public String generateToken(Player player) {
        return Jwts.builder()
                .setSubject("PLAYER_" + player.getPlayerId())
                .claim("email", player.getEmail())
                .claim("role", "PLAYER")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateToken(Coach coach) {
        return Jwts.builder()
                .setSubject("COACH_" + coach.getCoachId())
                .claim("email", coach.getEmail())
                .claim("role", "COACH")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateToken(Admin admin) {
        return Jwts.builder()
                .setSubject("ADMIN_" + admin.getAdminId())
                .claim("email", admin.getEmail())
                .claim("role", "ADMIN")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }
}
