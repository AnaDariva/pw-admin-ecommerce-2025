package br.edu.utfpr.pb.pw44s.server.security;

import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.security.dto.AuthenticationResponse;
import br.edu.utfpr.pb.pw44s.server.security.dto.UserResponseDTO;
import br.edu.utfpr.pb.pw44s.server.service.AuthService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Date;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final AuthService authService;

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager, AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.authService = authService;

        setFilterProcessesUrl("/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response) {

        try {
            var creds = new ObjectMapper().readTree(request.getInputStream());
            String username = creds.get("username").asText();
            String password = creds.get("password").asText();

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(username, password);

            return authenticationManager.authenticate(authToken);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao ler credenciais", e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authResult)
            throws IOException {

        String username = authResult.getName();


        User user = (User) authService.loadUserByUsername(username);


        String role = user.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");


        String token = JWT.create()
                .withSubject(username)
                .withClaim("role", role)
                .withClaim("id", user.getId())
                .withExpiresAt(new Date(
                        System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME
                ))
                .sign(Algorithm.HMAC512(SecurityConstants.SECRET));

        response.addHeader(SecurityConstants.HEADER_STRING, SecurityConstants.TOKEN_PREFIX + token);
        response.setContentType("application/json");

        var result = new AuthenticationResponse(token, new UserResponseDTO(user));

        response.getWriter().write(new ObjectMapper().writeValueAsString(result));
    }
}
