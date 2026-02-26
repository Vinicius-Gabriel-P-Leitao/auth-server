/*
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Copyright (c) 2025 Vinícius Gabriel Pereira Leitão
 * Licensed under the BSD 3-Clause License.
 * See LICENSE file in the project root for full license information.
 */
package com.auth.application.service;

import com.auth.api.dto.RegisterRequestDto;
import com.auth.domain.model.Role;
import com.auth.domain.model.User;
import com.auth.domain.repository.UserRepository;
import com.auth.infra.exception.ErrorCode;
import com.auth.infra.exception.custom.BadRequestException;
import com.auth.infra.exception.custom.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registra um novo usuário no banco de dados. 
     * O ID (UUIDv7) é gerado automaticamente pelo Hibernate através da anotação @GeneratedUuidV7.
     */
    public User userRegister(RegisterRequestDto request, Role role) {
        if (userRepository.findByUserName(request.userName()).isPresent()) {
            throw new BadRequestException(ErrorCode.BAD_REQUEST, "Este nome de usuário já está em uso!");
        }

        User user = new User();
        user.setUserName(request.userName());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(role);

        return userRepository.save(user);
    }

    /**
     * Incrementa a versão do token para invalidar JWTs antigos.
     * Trata o valor nulo para compatibilidade com registros antigos.
     */
    public void incrementTokenVersion(User user) {
        Integer currentVersion = user.getTokenVersion(); // O getter agora garante não nulo
        user.setTokenVersion(currentVersion + 1);
        userRepository.save(user);
    }

    /**
     * Busca um usuário pelo nome e lança exceção se não encontrar.
     */
    public User userIsPresent(String userName) {
        return userRepository.findByUserName(userName).orElseThrow(
                () -> new NotFoundException(ErrorCode.NOT_FOUND, "Usuário não encontrado!"));
    }
}
