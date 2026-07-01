package com.tharun.risk_management.controller;

import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tharun.risk_management.dto.CreateVesselRequest;
import com.tharun.risk_management.dto.VesselResponse;
import com.tharun.risk_management.enums.CargoType;
import com.tharun.risk_management.enums.RiskLevel;
import com.tharun.risk_management.service.PdfExportService;
import com.tharun.risk_management.service.VesselService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/vessels")
public class VesselController {

    private final VesselService vesselService;
    private final PdfExportService pdfExportService;

    
    @PostMapping
    public VesselResponse createVessel(
            @Valid @RequestBody CreateVesselRequest request) {

        return vesselService.createVessel(request);
    }

    @GetMapping
    public List<VesselResponse> getAllVessels() {
        return vesselService.getAllVessels();
    }

    @GetMapping("/{id}")
    public VesselResponse getVesselById(
            @PathVariable Long id) {

        return vesselService.getVesselById(id);
    }

    @PutMapping("/{id}")
    public VesselResponse updateVessel(
            @PathVariable Long id,
            @Valid @RequestBody CreateVesselRequest request) {

        return vesselService.updateVessel(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteVessel(
            @PathVariable Long id) {

        vesselService.deleteVessel(id);

        return "Vessel deleted successfully";
    }

    @GetMapping("/risk/{riskLevel}")
    public List<VesselResponse> getByRiskLevel(
            @PathVariable RiskLevel riskLevel) {

        return vesselService.getByRiskLevel(riskLevel);
    }

    @GetMapping("/cargo/{cargoType}")
    public List<VesselResponse> getByCargoType(
            @PathVariable CargoType cargoType) {

        return vesselService.getByCargoType(cargoType);
    }

    @GetMapping("/export/pdf")
        public ResponseEntity<byte[]> exportPdf() {

            byte[] pdfBytes = pdfExportService.generatePdfReport();

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=vessel-report.pdf"
                    )
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        }
}