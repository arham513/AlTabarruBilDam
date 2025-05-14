package com.crimson.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportsController {

    @GetMapping("/all")
    public ResponseEntity<List<UserReport>> getAllReports() {
        String sql = "SELECT * FROM reports";
        List<UserReport> reportList = new ArrayList<>();
        try (Connection conn = InitDB.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                UserReport report = new UserReport();
                report.setFeedbackID(rs.getLong("feedbackID"));
                report.setReporterId(rs.getLong("reporterId"));
                report.setReporterName(rs.getString("reporterName"));
                report.setReporterEmail(rs.getString("reporterEmail"));
                report.setReportedUserId(rs.getLong("reportedUserId"));
                report.setReportedUserName(rs.getString("reportedUserName"));
                report.setReportedUserEmail(rs.getString("reportedUserEmail"));
                report.setReason(rs.getString("reportReason"));
                report.setDescription(rs.getString("description"));
                reportList.add(report);
            }
            return ResponseEntity.ok(reportList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}
