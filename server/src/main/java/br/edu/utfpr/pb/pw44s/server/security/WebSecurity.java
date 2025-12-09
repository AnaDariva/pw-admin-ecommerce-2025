package br.edu.utfpr.pb.pw44s.server.security;

import br.edu.utfpr.pb.pw44s.server.service.AuthService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@EnableWebSecurity
@Configuration
public class WebSecurity {

    private final AuthService authService;
    private final AuthenticationEntryPoint authenticationEntryPoint;

    public WebSecurity(AuthService authService, AuthenticationEntryPoint authenticationEntryPoint) {
        this.authService = authService;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // Configura o AuthenticationManager
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);

        authenticationManagerBuilder.userDetailsService(authService).passwordEncoder(passwordEncoder());

        AuthenticationManager authenticationManager = authenticationManagerBuilder.build();

        // Configurações padrão
        http.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(cors -> corsConfigurationSource());
        http.exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(authenticationEntryPoint));


        http.authorizeHttpRequests(authorize -> authorize


                .requestMatchers(antMatcher(HttpMethod.POST, "/users")).permitAll()


                .requestMatchers(antMatcher(HttpMethod.POST, "/login")).permitAll()


                .requestMatchers(antMatcher(HttpMethod.GET, "/products/**")).permitAll().requestMatchers(antMatcher(HttpMethod.GET, "/categories/**")).permitAll()


                .requestMatchers(antMatcher(HttpMethod.GET, "/images/**")).permitAll()


                .requestMatchers(antMatcher("/h2-console/**")).permitAll()

                .requestMatchers("/admin/orders/documents/**").permitAll()

                .requestMatchers("/admin/**").hasRole("ADMIN")


                .anyRequest().authenticated());


        JWTAuthenticationFilter authFilter = new JWTAuthenticationFilter(authenticationManager, authService);


        authFilter.setFilterProcessesUrl("/login");

        http.authenticationManager(authenticationManager).addFilter(authFilter).addFilter(new JWTAuthorizationFilter(authenticationManager, authService)).sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public JwtTokenUtil jwtTokenUtil() {
        return new JwtTokenUtil();
    }
}
