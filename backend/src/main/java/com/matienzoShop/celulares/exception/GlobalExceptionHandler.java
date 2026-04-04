package com.matienzoShop.celulares.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {

        logger.error(
                "Unexpected error at [{} {}]: {}",
                request.getMethod(),
                request.getRequestURI(),
                ex.getMessage(),
                ex
        );

        ApiErrorResponse error = new ApiErrorResponse(
                "INTERNAL_ERROR",
                "Ocurrio algo inesperado",
                null
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }

    // Este Handler capta el error especifico de validación al validar la lista de objetos recibidas en el postMapping
    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<Map<String, Object>> handleListValidation(HandlerMethodValidationException ex) {
        Map<String, Object> response = new HashMap<>();
        List<String> detalles = new ArrayList<>();

        // Iteramos directamente sobre los errores unificados
        ex.getAllErrors().forEach(error -> {
            String mensaje = error.getDefaultMessage();

            // Intentamos detectar si el error pertenece a un campo específico (ej: "precio")
            // Para eso verificamos si es una instancia de FieldError
            if (error instanceof FieldError fieldError) {
                mensaje = fieldError.getField() + ": " + mensaje;
            }

            detalles.add(mensaje);
        });

        response.put("error", "Error de Validación en la Lista");
        response.put("fallos_encontrados", detalles);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions (MethodArgumentNotValidException ex){
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName =((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleJsonErrors(HttpMessageNotReadableException ex) {
        Map<String, Object> response = new HashMap<>();

        response.put("error", "Error de Formato JSON");

        // Obtenemos el mensaje técnico (ej: "Cannot deserialize instance of ArrayList...")
        // Usamos getRootCause() para ir al detalle específico si existe
        Throwable mostSpecificCause = ex.getMostSpecificCause();
        String mensajeDetallado = mostSpecificCause != null ? mostSpecificCause.getMessage() : ex.getMessage();
        response.put("detalle", mensajeDetallado);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleEmailExists(EmailAlreadyExistsException ex) {

        logger.warn("Business exception: {}", ex.getMessage());

        ApiErrorResponse error = new ApiErrorResponse(
                "EMAIL_ALREADY_EXISTS",
                "El email ya está registrado",
                "email"
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(error);
    }

    @ExceptionHandler(NotEqualsPasswordsException.class)
    public ResponseEntity<ApiErrorResponse> handlePasswordMismatch() {

        ApiErrorResponse error = new ApiErrorResponse(
                "PASSWORD_MISMATCH",
                "Las contrasñas no coinciden",
                "password"
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error);
    }
 }
