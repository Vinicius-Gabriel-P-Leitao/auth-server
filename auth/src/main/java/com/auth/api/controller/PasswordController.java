/*
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Copyright (c) 2025 Vinícius Gabriel Pereira Leitão
 * Licensed under the BSD 3-Clause License.
 * See LICENSE file in the project root for full license information.
 */
package com.auth.api.controller;

import com.auth.api.dto.ChangePasswordRequestDto;
import com.auth.api.dto.FirstChangePasswordRequestDto;
import com.auth.api.dto.ResetPasswordRequestDto;
import com.auth.application.usecase.PasswordUseCase;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/password")
public class PasswordController {

    private final PasswordUseCase passwordUseCase;

    /**
     * Troca de senha voluntária (Usuário logado).
     */
    @PostMapping("/change")
    public ResponseEntity<Map<String, String>> changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequestDto request) {
        passwordUseCase.changePassword(authentication, request);
        return ResponseEntity.ok(Map.of("status", "Senha alterada com sucesso"));
    }

    /**
     * Troca de senha obrigatória (Primeiro acesso após reset).
     */
    @PostMapping("/first-change")
    public ResponseEntity<Map<String, String>> firstChange(Authentication authentication, @Valid @RequestBody FirstChangePasswordRequestDto request) {
        passwordUseCase.changeFirstPassword(authentication, request);
        return ResponseEntity.ok(Map.of("status", "Senha de primeiro acesso atualizada com sucesso"));
    }

    /**
     * Reset de senha (Ação do ADMINISTRADOR).
     */
    @PostMapping("/admin-reset")
    public ResponseEntity<Map<String, String>> resetByAdmin(@Valid @RequestBody ResetPasswordRequestDto request) {
        String tempPass = passwordUseCase.resetByAdmin(request);
        return ResponseEntity.ok(Map.of(
                "status", "Senha resetada pelo administrador",
                "temp_password", tempPass
        ));
    }
}
