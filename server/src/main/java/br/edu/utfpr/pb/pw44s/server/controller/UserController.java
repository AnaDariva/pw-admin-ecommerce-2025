package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.UserDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.UserService;
import br.edu.utfpr.pb.pw44s.server.shared.GenericResponse;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("users")
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    public UserController(UserService userService,
                          ModelMapper modelMapper) {
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @PostMapping
    public GenericResponse createUser(@RequestBody @Valid UserDTO userDto) {

        User user = modelMapper.map(userDto, User.class);


        if (!userService.existsAdmin()) {
            user.setRole("ROLE_ADMIN");
            user.setEnabled(true);
        } else {

            user.setRole("ROLE_CUSTOMER");
            user.setEnabled(false);
        }

        userService.save(user);

        GenericResponse response = new GenericResponse();
        response.setMessage("User created");
        return response;
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminUserResponse> findAll() {
        return userService.findAll()
                .stream()
                .map(AdminUserResponse::fromEntity)
                .collect(Collectors.toList());
    }


    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public GenericResponse activateUser(@PathVariable Long id) {
        User user = userService.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setEnabled(true);
        userService.save(user);

        GenericResponse response = new GenericResponse();
        response.setMessage("User activated");
        return response;
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public GenericResponse changeRole(@PathVariable Long id,
                                      @RequestBody ChangeRoleRequest request) {

        User user = userService.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String requestedRole = request.getRole();

        String dbRole;
        if ("ADMIN".equalsIgnoreCase(requestedRole)) {
            dbRole = "ROLE_ADMIN";
        } else {

            dbRole = "ROLE_CUSTOMER";
        }

        user.setRole(dbRole);
        userService.save(user);

        GenericResponse response = new GenericResponse();
        response.setMessage("User role updated");
        return response;
    }



    public static class AdminUserResponse {
        private Long id;
        private String name;
        private String email;
        private boolean active;
        private String role; // "ADMIN" ou "USER"



        public AdminUserResponse(Long id, String name, String email, boolean active, String role) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.active = active;
            this.role = role;
        }

        public static AdminUserResponse fromEntity(User user) {
            String storedRole = user.getRole();
            String roleForFront = normalizeRoleForFront(storedRole);

            return new AdminUserResponse(
                    user.getId(),
                    user.getDisplayName(),
                    user.getUsername(),
                    user.isEnabled(),
                    roleForFront
            );
        }

        private static String normalizeRoleForFront(String role) {
            if (role == null) {
                return "USER";
            }
            if (role.startsWith("ROLE_")) {
                role = role.substring(5);
            }
            // ROLE_CUSTOMER -> USER
            if ("CUSTOMER".equalsIgnoreCase(role)) {
                return "USER";
            }
            return role.toUpperCase();
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }

        public boolean isActive() {
            return active;
        }

        public String getRole() {
            return role;
        }
    }


    public static class ChangeRoleRequest {
        private String role;

        public ChangeRoleRequest() {}

        public ChangeRoleRequest(String role) {
            this.role = role;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}
