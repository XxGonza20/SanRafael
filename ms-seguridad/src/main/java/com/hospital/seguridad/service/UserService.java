package com.hospital.seguridad.service;

import com.hospital.seguridad.model.Role;
import com.hospital.seguridad.model.User;
import com.hospital.seguridad.repository.RoleRepository;
import com.hospital.seguridad.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder encoder;

    public UserService(
            UserRepository userRepo,
            RoleRepository roleRepo,
            PasswordEncoder encoder
    ) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.encoder = encoder;
    }

    @Transactional
    public User register(String username, String password, String roleName) {

        if (userRepo.existsByUsername(username)) {
            throw new RuntimeException("El usuario ya existe");
        }

        Role role = roleRepo.findByName(roleName)
                .orElseGet(() -> roleRepo.save(new Role(roleName)));

        User user = new User();
        user.setUsername(username);
        user.setPassword(encoder.encode(password));
        user.getRoles().add(role);

        return userRepo.save(user);
    }
}
