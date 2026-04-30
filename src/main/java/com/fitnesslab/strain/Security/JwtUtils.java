package com.fitnesslab.strain.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtUtils {
    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private int jwtExpirationDate;
    private SecretKey key;

    @PostConstruct
    public void init(){
        key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email){
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + jwtExpirationDate))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsFunction){
        Claims claims = extractAllClaims(token);
        return claimsFunction.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isExpired(String token){
        return extractClaim(token,Claims::getExpiration).before(new Date());
    }

    public boolean isValidJWT(String token, UserDetails userDetails){
        try {
            String jwtEmail = extractClaim(token,Claims::getSubject);
            return jwtEmail.equals(userDetails.getUsername()) && !isExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isJWT(String jwt){
        String[] jwtSplitted = jwt.split("\\.");
        if(jwtSplitted.length != 3){
            return false;
        }
        try {
            String jsonFirstPart = new String(Base64.getDecoder().decode(jwtSplitted[0]));
            JSONObject firstPart = new JSONObject(jsonFirstPart);
            if(!firstPart.has("alg")){
                return false;
            }
            String jsonSecondPart = new String(Base64.getDecoder().decode(jwtSplitted[1]));
            JSONObject secondPart = new JSONObject(jsonSecondPart);
        } catch(JSONException e){
            return false;
        }
        return true;
    }
}
