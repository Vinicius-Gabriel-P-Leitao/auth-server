/*
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Copyright (c) 2025 Vinícius Gabriel Pereira Leitão
 * Licensed under the BSD 3-Clause License.
 * See LICENSE file in the project root for full license information.
 */
package com.auth.infra.exception.handler;

import com.auth.infra.exception.DataObjectError;
import com.auth.infra.exception.base.AppException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Date;

@RestControllerAdvice
public class HttpExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<DataObjectError> handleAppException(AppException exception) {
        DataObjectError error = DataObjectError.builder()
                .code(exception.getErrorCode().getHttpStatus().value())
                .message(exception.getMessage())
                .timestamp(new Date())
                .build();

        return new ResponseEntity<>(error, exception.getErrorCode().getHttpStatus());
    }
}
