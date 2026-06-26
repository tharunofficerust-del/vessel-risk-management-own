package com.tharun.risk_management.dto;

import org.springframework.stereotype.Component;

import com.tharun.risk_management.entity.VesselEntity;
import com.tharun.risk_management.enums.RiskLevel;

@Component
public class VesselMapper {

    public VesselResponse toResponse(VesselEntity vessel) {

        VesselResponse response = new VesselResponse();

        response.setVesselID(vessel.getVesselID());
        response.setVesselName(vessel.getVesselName());
        response.setCargoType(vessel.getCargoType());
        response.setDelayReason(vessel.getDelayReason());
        response.setRiskLevel(vessel.getRiskLevel());

        response.setEta(vessel.getEta());
        response.setArrivalDate(vessel.getArrivalDate());
        response.setDepartureDate(vessel.getDepartureDate());

        response.setDelayHours(vessel.getDelayHours());
        response.setPortStayHours(vessel.getPortStayHours());
        response.setPriorityLevel(vessel.getPriorityLevel());

        return response;
    }

    public VesselEntity toEntity(
            CreateVesselRequest request,
            long delayHours,
            long portStayHours,
            RiskLevel riskLevel,
            String priorityLevel) {

        VesselEntity vessel = new VesselEntity();

        vessel.setVesselName(request.getVesselName());
        vessel.setCargoType(request.getCargoType());
        vessel.setDelayReason(request.getDelayReason());

        vessel.setEta(request.getEta());
        vessel.setArrivalDate(request.getArrivalDate());
        vessel.setDepartureDate(request.getDepartureDate());

        vessel.setDelayHours(delayHours);
        vessel.setPortStayHours(portStayHours);
        vessel.setRiskLevel(riskLevel);
        vessel.setPriorityLevel(priorityLevel);

        return vessel;
    }
}