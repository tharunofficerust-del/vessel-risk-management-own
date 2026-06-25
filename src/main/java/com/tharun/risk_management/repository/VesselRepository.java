package com.tharun.risk_management.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.tharun.risk_management.entity.VesselEntity;
import com.tharun.risk_management.enums.CargoType;
import com.tharun.risk_management.enums.RiskLevel;

public interface VesselRepository extends JpaRepository<VesselEntity, Long> {

    // Custom query methods can be defined here if needed


    //get critical vessels
    List<VesselEntity> findByRiskLevel(RiskLevel riskLevel);

    //get specific cargo type vessels
    List<VesselEntity> findByCargoType(CargoType cargoType);

}
