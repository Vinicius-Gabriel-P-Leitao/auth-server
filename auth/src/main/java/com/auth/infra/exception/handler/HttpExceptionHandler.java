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

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Manipulador global de exceções da API.
 * Centraliza o tratamento de erros e garante que as respostas sigam o padrão {@link DataObjectError}.
 */
@RestControllerAdvice
public class HttpExceptionHandler {

    /**
     * Trata exceções personalizadas da aplicação que estendem {@link AppException}.
     *
     * @param appException A exceção lançada
     * @return Resposta com a mensagem e status definidos no ErrorCode
     */
    @ExceptionHandler(AppException.class)
    public ResponseEntity<DataObjectError> handleAppException(AppException appException) {
        return buildErrorResponse(appException.getMessage(), appException.getErrorCode().getHttpStatus());
    }

    /**
     * Trata erros de validação de campos enviados nas requisições (Bean Validation).
     *
     * @param exception Exceção contendo a lista de erros de validação
     * @return Resposta 400 (Bad Request) com detalhes de cada campo inválido
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<DataObjectError> handleValidationExceptions(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        DataObjectError error = DataObjectError.builder().message("Erro de validação nos campos informados").code(HttpStatus.BAD_REQUEST.value()).timestamp(new Date()).details(errors).build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Trata falhas de autenticação, como usuário ou senha incorretos durante o login.
     *
     * @param exception Exceção de credenciais inválidas
     * @return Resposta 401 (Unauthorized)
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<DataObjectError> handleBadCredentials(BadCredentialsException exception) {
        return buildErrorResponse("Usuário ou senha inválidos", HttpStatus.UNAUTHORIZED);
    }

    /**
     * Trata falhas genéricas de autenticação no nível de Controller.
     *
     * @param exception Exceção de autenticação
     * @return Resposta 401 (Unauthorized)
     */
    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<DataObjectError> handleAuthenticationException(org.springframework.security.core.AuthenticationException exception) {
        return buildErrorResponse("Falha na autenticação: " + exception.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    /**
     * Trata requisições para rotas que não existem.
     *
     * @param exception Exceção de handler não encontrado
     * @return Resposta 404 (Not Found)
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<DataObjectError> handleNotFound(NoHandlerFoundException exception) {
        return buildErrorResponse("O recurso solicitado não foi encontrado", HttpStatus.NOT_FOUND);
    }

    /**
     * Trata o uso de métodos HTTP incorretos em uma rota existente.
     *
     * @param exception Exceção de método não suportado
     * @return Resposta 405 (Method Not Allowed)
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<DataObjectError> handleMethodNotSupported(HttpRequestMethodNotSupportedException exception) {
        return buildErrorResponse("Método HTTP não suportado para esta rota", HttpStatus.METHOD_NOT_ALLOWED);
    }

    /**
     * Trata violações de integridade no banco de dados, como duplicidade de chaves.
     *
     * @param exception Exceção de violação de integridade
     * @return Resposta 409 (Conflict)
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<DataObjectError> handleDataIntegrity(DataIntegrityViolationException exception) {
        return buildErrorResponse("Erro de integridade de dados ou duplicidade", HttpStatus.CONFLICT);
    }

    /**
     * Fallback para qualquer exceção não tratada especificamente pelos outros métodos.
     *
     * @param exception A exceção genérica
     * @return Resposta 500 (Internal Server Error)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<DataObjectError> handleGenericException(Exception exception) {
        return buildErrorResponse("Ocorreu um erro interno no servidor", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Método utilitário para construir o objeto de resposta de erro padrão.
     *
     * @param message Mensagem amigável para o usuário
     * @param status  Status HTTP da resposta
     * @return Entidade de resposta configurada
     */
    private ResponseEntity<DataObjectError> buildErrorResponse(String message, HttpStatus status) {
        DataObjectError error = DataObjectError.builder().message(message).code(status.value()).timestamp(new Date()).build();
        return new ResponseEntity<>(error, status);
    }
}
