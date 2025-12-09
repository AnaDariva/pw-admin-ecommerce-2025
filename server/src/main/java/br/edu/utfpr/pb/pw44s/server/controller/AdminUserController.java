package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.UserDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//novo
@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public AdminUserController(UserRepository userRepository, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/pending")
    public List<UserDTO> getPendingUsers() {
        return userRepository.findByEnabledFalse().stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .toList();
    }

    public record ActivateUserRequest(String role) {
    }

    @PutMapping("/{id}/activate")
    public UserDTO activateUser(@PathVariable Long id,
                                @RequestBody ActivateUserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        user.setEnabled(true);

        if (request != null && request.role() != null && !request.role().isBlank()) {
            user.setRole(request.role());
        }

        User saved = userRepository.save(user);
        return modelMapper.map(saved, UserDTO.class);
    }
}
