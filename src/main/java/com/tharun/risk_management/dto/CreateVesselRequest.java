package com.tharun.risk_management.dto;

import java.time.LocalDateTime;
import com.tharun.risk_management.enums.CargoType;
import com.tharun.risk_management.enums.DelayReason;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

// DTO - layer also should have validation annotations to ensure 
// that the data being passed from the client is valid before 
// it reaches the service layer. 

@Getter
@Setter
public class CreateVesselRequest {

    @NotBlank
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
}