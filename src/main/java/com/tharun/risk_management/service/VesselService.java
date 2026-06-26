package com.tharun.risk_management.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tharun.risk_management.dto.CreateVesselRequest;
import com.tharun.risk_management.dto.VesselMapper;
import com.tharun.risk_management.dto.VesselResponse;
import com.tharun.risk_management.entity.VesselEntity;
import com.tharun.risk_management.enums.CargoType;
import com.tharun.risk_management.enums.RiskLevel;
import com.tharun.risk_management.exception.ResourceNotFoundException;
import com.tharun.risk_management.repository.VesselRepository;

@Service
public class VesselService {

    private final VesselRepository vesselRepository;
    private final VesselMapper vesselMapper;

    public VesselService(
            VesselRepository vesselRepository,
            VesselMapper vesselMapper) {

        this.vesselRepository = vesselRepository;
        this.vesselMapper = vesselMapper;
    }

    // ==================== Helper Methods ====================

    private long calculateDelayHours(
            LocalDateTime eta,
            LocalDateTime arrivalDate) {

        long delay = Duration.between(eta, arrivalDate).toHours();

        return Math.max(delay, 0);
    }

    private long calculatePortStayHours(
            LocalDateTime arrivalDate,
            LocalDateTime departureDate) {

        return Duration.between(
                arrivalDate,
                departureDate
        ).toHours();
    }

    private String determinePriorityLevel(
            CargoType cargoType) {

        switch (cargoType) {

            case HAZARDOUS:
                return "Urgent";

            case REEFER:
                return "High";

            case FRAGILE:
                return "Medium";

            case GENERAL:
                return "Low";

            default:
                return "Unknown";
        }
    }

    private RiskLevel determineRiskLevel(
            CargoType cargoType,
            long delayHours) {

        switch (cargoType) {

            case HAZARDOUS:

                if (delayHours > 8) {
                    return RiskLevel.CRITICAL;
                } else if (delayHours > 2) {
                    return RiskLevel.HIGH;
                }

                return RiskLevel.MEDIUM;

            case REEFER:

                if (delayHours > 12) {
                    return RiskLevel.CRITICAL;
                } else if (delayHours > 3) {
                    return RiskLevel.HIGH;
                }

                return RiskLevel.LOW;

            case FRAGILE:

                if (delayHours > 12) {
                    return RiskLevel.HIGH;
                } else if (delayHours > 4) {
                    return RiskLevel.MEDIUM;
                }

                return RiskLevel.LOW;

            case GENERAL:

                if (delayHours > 24) {
                    return RiskLevel.HIGH;
                } else if (delayHours > 6) {
                    return RiskLevel.MEDIUM;
                }

                return RiskLevel.LOW;

            default:
                return RiskLevel.LOW;
        }
    }

    // ==================== CREATE ====================

    public VesselResponse createVessel(
            CreateVesselRequest request) {

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

        VesselEntity savedVessel =
                vesselRepository.save(vessel);

        return vesselMapper.toResponse(savedVessel);
    }

    // ==================== GET ALL ====================

    public List<VesselResponse> getAllVessels() {

        return vesselRepository
                .findAll()
                .stream()
                .map(vesselMapper::toResponse)
                .toList();
    }

    // ==================== GET BY ID ====================

    public VesselResponse getVesselById(Long id) {

        VesselEntity vessel =
                vesselRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Vessel not found with id: " + id
                                )
                        );

        return vesselMapper.toResponse(vessel);
    }

    // ==================== UPDATE ====================

    public VesselResponse updateVessel(
            Long id,
            CreateVesselRequest request) {

        VesselEntity vessel =
                vesselRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Vessel not found with id: " + id
                                )
                        );

        vessel.setVesselName(request.getVesselName());
        vessel.setCargoType(request.getCargoType());
        vessel.setDelayReason(request.getDelayReason());

        vessel.setEta(request.getEta());
        vessel.setArrivalDate(request.getArrivalDate());
        vessel.setDepartureDate(request.getDepartureDate());

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

        vessel.setDelayHours(delayHours);
        vessel.setPortStayHours(portStayHours);

        vessel.setRiskLevel(
                determineRiskLevel(
                        request.getCargoType(),
                        delayHours
                )
        );

        vessel.setPriorityLevel(
                determinePriorityLevel(
                        request.getCargoType()
                )
        );

        VesselEntity updatedVessel =
                vesselRepository.save(vessel);

        return vesselMapper.toResponse(updatedVessel);
    }

    // ==================== DELETE ====================

    public void deleteVessel(Long id) {

        if (!vesselRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Vessel not found with id: " + id
            );
        }

        vesselRepository.deleteById(id);
    }

    // ==================== FILTER BY RISK ====================

    public List<VesselResponse> getByRiskLevel(
            RiskLevel riskLevel) {

        return vesselRepository
                .findByRiskLevel(riskLevel)
                .stream()
                .map(vesselMapper::toResponse)
                .toList();
    }

    // ==================== FILTER BY CARGO ====================

    public List<VesselResponse> getByCargoType(
            CargoType cargoType) {

        return vesselRepository
                .findByCargoType(cargoType)
                .stream()
                .map(vesselMapper::toResponse)
                .toList();
    }

}