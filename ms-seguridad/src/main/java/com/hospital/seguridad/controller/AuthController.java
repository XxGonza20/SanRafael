package com.hospital.seguridad.controller;

import com.hospital.seguridad.config.JwtUtil;
import com.hospital.seguridad.dto.AuthRequest;
import com.hospital.seguridad.dto.AuthResponse;
import com.hospital.seguridad.dto.RegisterRequest;
import com.hospital.seguridad.model.User;
import com.hospital.seguridad.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            UserService userService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(token));

        } catch (BadCredentialsException ex) {
            Map<String, String> body = new HashMap<>();
            body.put("message", "Credenciales inválidas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);

        } catch (Exception ex) {
            ex.printStackTrace();
            Map<String, String> body = new HashMap<>();
            body.put("message", "Error interno en el login: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest req) {
        User user = userService.register(
                req.getUsername(),
                req.getPassword(),
                req.getRole()
        );
        return ResponseEntity.ok("Usuario creado con id: " + user.getId());
    }
}
