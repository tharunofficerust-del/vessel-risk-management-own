package com.tharun.risk_management.dto;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.tharun.risk_management.enums.CargoType;
import com.tharun.risk_management.enums.DelayReason;
import com.tharun.risk_management.exception.ErrorResponse;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

// DTO - layer also should have validation annotations to ensure 
// that the data being passed from the client is valid before 
// it reaches the service layer. 

@Getter
@Setter
public class CreateVesselRequest {

    @NotBlank(message = "Vessel name cannot be empty")
    private String vesselName;

    @NotNull
    private CargoType cargoType;

    @NotNull
    private DelayReason delayReason;

    @NotNull
    private LocalDateTime eta;

    @NotNull
    private LocalDateTime arrivalDate;

    @NotNull
    private LocalDateTime departureDate;

    @ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse>
handleValidation(MethodArgumentNotValidException ex) {

    String message =
        ex.getBindingResult()
          .getFieldError()
          .getDefaultMessage();

    ErrorResponse errorResponse =
        new ErrorResponse(
            message,
            HttpStatus.BAD_REQUEST.value(),
            LocalDateTime.now()
        );

    return new ResponseEntity<>(
        errorResponse,
        HttpStatus.BAD_REQUEST
    );
}
}