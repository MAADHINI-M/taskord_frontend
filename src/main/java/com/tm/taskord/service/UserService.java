package com.tm.taskord.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tm.taskord.entity.User;
import com.tm.taskord.repository.UserRepository;

@Service
public class UserService {

    private static final List<String> VALID_ROLES = Arrays.asList(
        "ROLE_SUPER", "ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TEAMMEMBER", "ROLE_USER"
    );

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void createUser(String username, String password, String role) {
        if (!VALID_ROLES.contains(role)) {
            throw new IllegalArgumentException("Invalid role: " + role);
        }
        if (userRepository.findByUsername(username) != null) {
            throw new IllegalArgumentException("User already exists: " + username);
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        userRepository.save(user);
    }
}
