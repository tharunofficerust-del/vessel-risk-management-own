package com.tharun.risk_management.service;

import com.tharun.risk_management.entity.VesselEntity;
import com.tharun.risk_management.enums.RiskLevel;
import com.tharun.risk_management.repository.VesselRepository;
import lombok.RequiredArgsConstructor;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfExportService {

    private final VesselRepository vesselRepository;

    public byte[] generatePdfReport() {

        List<VesselEntity> vessels = vesselRepository.findAll();

        try (
                PDDocument document = new PDDocument();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            PDPage page = new PDPage(PDRectangle.A4);

            document.addPage(page);

            PDPageContentStream content = new PDPageContentStream(document, page);

            float y = 780;

            // =====================================
            // TITLE
            // =====================================

            content.setFont(
                new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD),
                22
            );

            content.beginText();
            content.newLineAtOffset(50, y);
            content.showText("VESSEL RISK MANAGEMENT REPORT");
            content.endText();

            y -= 30;

            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);

            content.beginText();
            content.newLineAtOffset(50, y);
            content.showText("Maritime Operations Dashboard");
            content.endText();

            y -= 20;

            content.beginText();
            content.newLineAtOffset(50, y);
            content.showText(
                    "Generated On: "
                            + LocalDateTime.now());
            content.endText();

            y -= 40;

            // =====================================
            // SUMMARY
            // =====================================

            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 16);

            content.beginText();
            content.newLineAtOffset(50, y);
            content.showText("SUMMARY");
            content.endText();

            y -= 25;

            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);

            content.beginText();
            content.newLineAtOffset(60, y);
            content.showText(
                    "Total Vessels : "
                            + vessels.size());
            content.endText();

            y -= 20;

            long criticalCount = vessels.stream()
                    .filter(v -> v.getRiskLevel() == RiskLevel.CRITICAL)
                    .count();

            content.beginText();
            content.newLineAtOffset(60, y);
            content.showText(
                    "Critical Vessels : "
                            + criticalCount);
            content.endText();

            y -= 40;

            // =====================================
            // TABLE HEADER
            // =====================================

            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);

            content.beginText();
            content.newLineAtOffset(50, y);
            content.showText("VESSEL DETAILS");
            content.endText();

            y -= 25;

            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 10);

            content.beginText();
            content.newLineAtOffset(50, y);
            content.showText(
                    "ID     NAME                 STATUS          RISK");
            content.endText();

            y -= 20;

            // =====================================
            // TABLE DATA
            // =====================================

            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);

            for (VesselEntity vessel : vessels) {

                String row = String.format(
                        "%-6s %-20s %-15s %-10s",
                        vessel.getVesselID(),
                        vessel.getVesselName(),
                        vessel.getStatus(),
                        vessel.getRiskLevel());

                content.beginText();

                content.newLineAtOffset(50, y);

                content.showText(row);

                content.endText();

                y -= 18;

                if (y < 100) {
                    break;
                }
            }

            // =====================================
            // FOOTER
            // =====================================

            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE) , 10);

            content.beginText();

            content.newLineAtOffset(50, 40);

            content.showText(
                    "Generated by Vessel Risk Management System | Tharun Vijay");

            content.endText();

            content.close();

            document.save(outputStream);

            return outputStream.toByteArray();

        } catch (Exception ex) {

            throw new RuntimeException(
                    "Failed to generate PDF",
                    ex);
        }
    }
}