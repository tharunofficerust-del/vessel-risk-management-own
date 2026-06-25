package com.tharun.risk_management.service;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.tharun.risk_management.dto.CreateVesselRequest;
import com.tharun.risk_management.dto.VesselMapper;
import com.tharun.risk_management.entity.VesselEntity;
import com.tharun.risk_management.enums.CargoType;
import com.tharun.risk_management.enums.RiskLevel;
import com.tharun.risk_management.repository.VesselRepository;

@Service
public class VesselService {
    // repo reference
    private final VesselRepository vesselRepository;
    private final VesselMapper vesselMapper;

    // constructor injection - @autowired - getting mapper and repo reference
    public VesselService(VesselRepository vesselRepository, VesselMapper vesselMapper) {
        this.vesselRepository = vesselRepository;
        this.vesselMapper = vesselMapper;
    }

    //Helper Methods

    private long calculateDelayHours(LocalDateTime eta, LocalDateTime arrivalDate) {
        long delay =  Duration.between(eta, arrivalDate).toHours();
        return Math.max(delay, 0); // Ensure delay is not negative
    }

    private long calculatePortStayHours(LocalDateTime arrivalDate, LocalDateTime departureDate) {
        return  Duration.between(arrivalDate, departureDate).toHours();
    }

    private String determinePriorityLevel(CargoType cargoType) {
    
        switch(cargoType)
        {
            case HAZARDOUS:
                return "Urgent";
            case GENERAL:
                return "Low";
            case REEFER:
                return "High";
            case FRAGILE:
                return "Medium";
            default:
                return "Unknown";
        }

    }

    //calculate risk level based on the given descriptions
    private RiskLevel determineRiskLevel(CargoType cargoType, long delayHours) {

        switch(cargoType)
        {
            case HAZARDOUS:
                if (delayHours > 8) {
                    return RiskLevel.CRITICAL;
                } else if (delayHours > 2) {
                    return RiskLevel.HIGH;
                } else {
                    return RiskLevel.MEDIUM;
                }
            case REEFER:
                if (delayHours > 12) {
                    return RiskLevel.CRITICAL;
                } else if (delayHours > 3) {
                    return RiskLevel.HIGH;
                } else {
                    return RiskLevel.LOW;
                }
            case FRAGILE:
                if (delayHours > 12) {
                    return RiskLevel.HIGH;
                } else if (delayHours > 4) {
                    return RiskLevel.MEDIUM;
                } else {
                    return RiskLevel.LOW;
                }
            case GENERAL:
                if (delayHours > 24) {
                    return RiskLevel.HIGH;
                } else if (delayHours > 6) {
                    return RiskLevel.MEDIUM;
                } else {
                    return RiskLevel.LOW;
                }
            default:
                return RiskLevel.LOW;
        }
    }

//--------------------------------------------------------------------------------------------
//          Main service - Orchestrator Method
//          passing data from dto and processing through helper methods.

    public VesselEntity createVessel(CreateVesselRequest request) {

        long delayHours =
                calculateDelayHours(
                        request.getEta(),
                        request.getArrivalDate()
                );

        long portStayHours =
                calculatePortStayHours(
                        request.getArrivalDate(),
                        request.getDepartureDate()
                );

        RiskLevel riskLevel =
                determineRiskLevel(
                        request.getCargoType(),
                        delayHours
                );

        String priorityLevel =
                determinePriorityLevel(
                        request.getCargoType()
                );

        VesselEntity vessel =
                vesselMapper.toEntity(
                        request,
                        delayHours,
                        portStayHours,
                        riskLevel,
                        priorityLevel
                );

        return vesselRepository.save(vessel);
    }


}