package com.auth.application.dto;

import com.auth.api.dto.auth.AuthenticationResponseDto;

/**
 * Wrapper interno da camada de aplicação para transportar a resposta da API
 * juntamente com o Refresh Token puro, de forma que o Controller possa embuti-lo
 * em um Cookie HttpOnly sem vazá-lo no JSON do DTO.
 */
public record AuthenticationResult(
        AuthenticationResponseDto responseDto,
        String refreshToken
) {
}
