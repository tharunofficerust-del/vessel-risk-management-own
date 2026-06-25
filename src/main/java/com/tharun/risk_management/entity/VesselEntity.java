package com.tharun.risk_management.entity;

// NOTE :
// worked by tharun vijay , understanding of creating a proper vessel 
// with proper annotations and enums for cargo type, delay reason, and risk level

import java.time.LocalDateTime;
import com.tharun.risk_management.enums.CargoType;
import com.tharun.risk_management.enums.DelayReason;
import com.tharun.risk_management.enums.RiskLevel;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "vessels")
@Getter
@Setter

public class VesselEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vesselID;

    @Column(nullable = false)
    private String vesselName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CargoType cargoType;

    @Enumerated(EnumType.STRING)        //convert enums to string for database storage
    @Column(nullable = false)
    private DelayReason delayReason;

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    @Column(nullable = false)
    private LocalDateTime eta;      //localdatetime is modern and avoids indexing issues with timezones

    @Column(nullable = false)
    private LocalDateTime arrivalDate;

    @Column(nullable = false)
    private LocalDateTime departureDate;

    private long delayHours;

    private long portStayHours;

    private String priorityLevel;



}
