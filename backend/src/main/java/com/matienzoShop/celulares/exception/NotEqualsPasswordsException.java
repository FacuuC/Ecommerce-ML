package com.matienzoShop.celulares.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class NotEqualsPasswordsException extends RuntimeException {
    public NotEqualsPasswordsException() {
        super("Las contraseñas no coinciden");
    }
}
