package com.fitnesslab.strain.security;

import com.fitnesslab.strain.service.UserDetailsServiceImpl;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@AllArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {
    private JwtUtils jwtUtils;
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        Cookie[] cookies = request.getCookies();
        if (cookies == null || cookies.length == 0) {
            filterChain.doFilter(request, response);
            return;
        }

        Cookie tokenCookie = null;
        for(Cookie cookie : cookies) {
            if(cookie.getName().equals("token")) {
                tokenCookie = cookie;
                break;
            }
        }
        if(tokenCookie == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = tokenCookie.getValue();
            String email = jwtUtils.extractClaim(jwt, Claims::getSubject);

            if (!email.isEmpty() && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                if (jwtUtils.isValidJWT(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request,response);
    }
}
