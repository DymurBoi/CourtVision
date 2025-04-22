package cit.edu.capstone.CourtVision.security;


import cit.edu.capstone.CourtVision.entity.Player;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512); // Secure and correct size
    private final long EXPIRATION_TIME = 86400000L; // 24 hours

    public String generateToken(Player player) {
        return Jwts.builder()
                .setSubject(String.valueOf(player.getPlayerId()))
                .claim("email", player.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }
}
