/*
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Copyright (c) 2025 Vinícius Gabriel Pereira Leitão
 * Licensed under the BSD 3-Clause License.
 * See LICENSE file in the project root for full license information.
 */
package com.auth.application.usecase;

import com.auth.api.dto.AuthenticationRequestDto;
import com.auth.api.dto.AuthenticationResponseDto;
import com.auth.api.dto.MetadataUserResponseDto;
import com.auth.application.service.RefreshTokenService;
import com.auth.application.service.UserService;
import com.auth.domain.model.RefreshToken;
import com.auth.domain.model.User;
import com.auth.infra.exception.ErrorCode;
import com.auth.infra.exception.custom.BadRequestException;
import com.auth.infra.security.service.JwtGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginUseCase {
    private final AuthenticationManager authManager;
    private final JwtGeneratorService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserService userService;

    public AuthenticationResponseDto execute(AuthenticationRequestDto loginRequest) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.userName(), loginRequest.password())
        );

        if (!(auth.getPrincipal() instanceof User user)) {
            throw new BadRequestException(ErrorCode.INTERNAL_SERVER_ERROR, "Erro ao recuperar dados do usuário autenticado");
        }

        // Invalida tokens antigos
        userService.incrementTokenVersion(user);

        String jwt = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        MetadataUserResponseDto metadata = MetadataUserResponseDto.builder()
                .username(user.getUsername())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .active(user.getActive() != null && user.getActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();

        return AuthenticationResponseDto.builder()
                .token(jwt)
                .refreshToken(refreshToken.getToken())
                .passwordResetRequired(user.isPasswordResetRequired())
                .metadata(metadata)
                .build();
    }
}
