package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = new BCryptPasswordEncoder();


        if (!existsAdmin()) {
            User admin = new User();
            admin.setDisplayName("Administrador");
            admin.setUsername("admin@teste.com");
            admin.setPassword(bCryptPasswordEncoder.encode("Senha123"));
            admin.setRole("ROLE_ADMIN");
            admin.setEnabled(true);

            userRepository.save(admin);
            System.out.println(">>> ADMIN INICIAL CRIADO: admin@teste.com / Senha123");
        }
    }


    public boolean existsAdmin() {
        return userRepository.existsByRole("ROLE_ADMIN");
    }


    public User save(User user) {

        if (user.getId() == null) {

            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            user.setEnabled(false);

            if (user.getRole() == null || user.getRole().isBlank()) {
                user.setRole("ROLE_CUSTOMER");
            }
        } else {

        }

        return userRepository.save(user);
    }


    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
