/*
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Copyright (c) 2025 Vinícius Gabriel Pereira Leitão
 * Licensed under the BSD 3-Clause License.
 * See LICENSE file in the project root for full license information.
 */
package com.auth.application.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PasswordGeneratorServiceTest {

    private final PasswordGeneratorService passwordGeneratorService = new PasswordGeneratorService();

    @Test
    @DisplayName("Deve gerar senha com comprimento especificado")
    void shouldGeneratePasswordWithSpecifiedLength() {
        int length = 15;
        String password = passwordGeneratorService.generate(length);
        assertEquals(length, password.length());
    }

    @Test
    @DisplayName("Deve gerar senha temporária padrão com 12 caracteres")
    void shouldGenerateDefaultTemporaryPassword() {
        String password = passwordGeneratorService.generateTemporaryPassword();
        assertEquals(12, password.length());
    }

    @Test
    @DisplayName("Deve conter diferentes tipos de caracteres na senha gerada")
    void shouldContainDifferentCharacterTypes() {
        String password = passwordGeneratorService.generate(15);
        
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLower = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        boolean hasSpecial = password.chars().anyMatch(c -> "!@#$%&*()_+-=[]?".indexOf(c) != -1);

        assertTrue(hasUpper, "Deve conter ao menos uma letra maiúscula");
        assertTrue(hasLower, "Deve conter ao menos uma letra minúscula");
        assertTrue(hasDigit, "Deve conter ao menos um número");
        assertTrue(hasSpecial, "Deve conter ao menos um caractere especial");
    }

    @Test
    @DisplayName("Deve lançar exceção para comprimento insuficiente")
    void shouldThrowForInsufficientLength() {
        assertThrows(IllegalArgumentException.class, () -> passwordGeneratorService.generate(3));
    }

    @Test
    @DisplayName("Deve gerar senhas diferentes em chamadas consecutivas")
    void shouldGenerateDifferentPasswords() {
        String pass1 = passwordGeneratorService.generateTemporaryPassword();
        String pass2 = passwordGeneratorService.generateTemporaryPassword();
        assertNotEquals(pass1, pass2);
    }
}
