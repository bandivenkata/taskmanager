package com.taskmanager.service;

import com.taskmanager.dto.Dtos.UserSummary;
import com.taskmanager.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserSummary> getAllUsers() {
        return userRepository.findAllActive().stream().map(UserSummary::from).toList();
    }
}
