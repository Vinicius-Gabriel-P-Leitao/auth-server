/*
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Copyright (c) 2025 Vinícius Gabriel Pereira Leitão
 * Licensed under the BSD 3-Clause License.
 * See LICENSE file in the project root for full license information.
 */
package com.auth.application.service;

import com.auth.api.dto.AuthenticationRequestDto;
import com.auth.api.dto.AuthenticationResponseDto;
import com.auth.api.dto.RegisterRequestDto;
import com.auth.domain.model.User;
import com.auth.domain.repository.UserRepository;
import com.auth.infra.exception.ErrorCode;
import com.auth.infra.exception.custom.NotFoundException;
import com.auth.infra.security.service.JwtGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtGeneratorService jwtGeneratorService;
    private final AuthenticationManager authenticationManager;

    public void userRegister(RegisterRequestDto request) {
        User user = new User();
        user.setUserName(request.userName());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());

        userRepository.save(user);
        var jwtToken = jwtGeneratorService.generateToken(user);

        AuthenticationResponseDto.builder().token(jwtToken).build();
    }

    public AuthenticationResponseDto authenticate(AuthenticationRequestDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.userName(),
                        request.password()
                )
        );

        var user = this.userIsPresent(request.userName());
        var jwtToken = jwtGeneratorService.generateToken(user);

        return AuthenticationResponseDto.builder().token(jwtToken).build();
    }

    public User userIsPresent(String userName) {
        return userRepository.findByUserName(userName).orElseThrow(
                () -> new NotFoundException(ErrorCode.NOT_FOUND, "Usuário inserido não foi encontrado!"));
    }
}
