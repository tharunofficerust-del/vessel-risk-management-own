package com.tharun.risk_management.dto;

import java.time.LocalDateTime;

import com.tharun.risk_management.enums.CargoType;
import com.tharun.risk_management.enums.DelayReason;
import com.tharun.risk_management.enums.RiskLevel;
import com.tharun.risk_management.enums.VesselStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VesselResponse {

    private Long vesselID;

    private String vesselName;

    private CargoType cargoType;

    private DelayReason delayReason;

    private RiskLevel riskLevel;

    private LocalDateTime eta;

    private LocalDateTime arrivalDate;

    private LocalDateTime departureDate;

    private long delayHours;

    private long portStayHours;

    private String priorityLevel;

    private VesselStatus status;
}