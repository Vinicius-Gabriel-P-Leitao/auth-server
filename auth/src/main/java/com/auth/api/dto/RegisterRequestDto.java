/*
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Copyright (c) 2025 Vinícius Gabriel Pereira Leitão
 * Licensed under the BSD 3-Clause License.
 * See LICENSE file in the project root for full license information.
 */
package com.auth.api.dto;

import com.auth.domain.model.Role;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;

@Builder
public record RegisterRequestDto(@JsonProperty("username") String userName, String password, Role role) {
}
