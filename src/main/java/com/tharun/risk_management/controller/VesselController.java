package com.tharun.risk_management.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.tharun.risk_management.dto.CreateVesselRequest;
import com.tharun.risk_management.entity.VesselEntity;
import com.tharun.risk_management.service.VesselService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/vessels")
public class VesselController {

    private final VesselService vesselService; //reference to the service layer
    //constructor injection for the service layer
    public VesselController(VesselService vesselService) {
        this.vesselService = vesselService;
    }

    @PostMapping
    public VesselEntity createVessel(
            @Valid @RequestBody CreateVesselRequest request) {

        return vesselService.createVessel(request);
    }

    @GetMapping
    public List<VesselEntity> getAllVessels() {
        return vesselService.getAllVessels();
    }
    
    @GetMapping("/{id}")
    public VesselEntity getVesselById(@PathVariable Long id) {
        return vesselService.getVesselById(id);
    }

}
