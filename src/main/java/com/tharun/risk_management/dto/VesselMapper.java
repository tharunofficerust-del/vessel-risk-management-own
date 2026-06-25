package com.tharun.risk_management.dto;

import org.springframework.stereotype.Component;
import com.tharun.risk_management.entity.VesselEntity;
import com.tharun.risk_management.enums.RiskLevel;

@Component
public class VesselMapper {

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