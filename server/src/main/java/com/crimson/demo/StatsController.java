package com.crimson.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.sql.*;
import java.util.*;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    @GetMapping
    public ResponseEntity<Object> getStats() {
        Map<String, Object> response = new HashMap<>();
        try (Connection conn = InitDB.getConnection()) {
            // 1. Total number of donations
            String totalDonationsSql = "SELECT COUNT(*) FROM donations";
            try (PreparedStatement stmt = conn.prepareStatement(totalDonationsSql)) {
                ResultSet rs = stmt.executeQuery();
                if (rs.next())
                    response.put("totalDonations", rs.getInt(1));
            }
            // 2. Total number of active users (eligibilityStatus == 1)
            String activeUsersSql = "SELECT COUNT(*) FROM users WHERE eligibilityStatus = 1";
            try (PreparedStatement stmt = conn.prepareStatement(activeUsersSql)) {
                ResultSet rs = stmt.executeQuery();
                if (rs.next())
                    response.put("totalActiveUsers", rs.getInt(1));
            }
            // 3. Total pending requests (status == 'pending')
            String pendingRequestsSql = "SELECT COUNT(*) FROM requests WHERE status = 'pending'";
            try (PreparedStatement stmt = conn.prepareStatement(pendingRequestsSql)) {
                ResultSet rs = stmt.executeQuery();
                if (rs.next())
                    response.put("totalPendingRequests", rs.getInt(1));
            }
            // 4. Donations per month
            String monthlyDonationsSql = "SELECT FORMAT(timestamp, 'MMM yyyy') as month, COUNT(*) as count FROM donations GROUP BY FORMAT(timestamp, 'MMM yyyy') ORDER BY MIN(timestamp)";
            Map<String, Integer> monthlyDonations = new LinkedHashMap<>();
            try (PreparedStatement stmt = conn.prepareStatement(monthlyDonationsSql)) {
                ResultSet rs = stmt.executeQuery();
                while (rs.next())
                    monthlyDonations.put(rs.getString("month"), rs.getInt("count"));
            }
            response.put("monthlyDonations", monthlyDonations);
            // 5. Donations by blood group
            String bloodGroupSql = "SELECT bloodgroup, COUNT(*) as count FROM donations GROUP BY bloodgroup";
            Map<String, Integer> bloodGroupStats = new HashMap<>();
            try (PreparedStatement stmt = conn.prepareStatement(bloodGroupSql)) {
                ResultSet rs = stmt.executeQuery();
                while (rs.next())
                    bloodGroupStats.put(rs.getString("bloodgroup"), rs.getInt("count"));
            }
            response.put("bloodGroupStats", bloodGroupStats);
            // 6. User growth per month
            String userGrowthSql = "SELECT FORMAT(createdAt, 'MMM yyyy') as month, COUNT(*) as count FROM users GROUP BY FORMAT(createdAt, 'MMM yyyy') ORDER BY MIN(createdAt)";
            Map<String, Integer> userGrowth = new LinkedHashMap<>();
            try (PreparedStatement stmt = conn.prepareStatement(userGrowthSql)) {
                ResultSet rs = stmt.executeQuery();
                while (rs.next())
                    userGrowth.put(rs.getString("month"), rs.getInt("count"));
            }
            response.put("userGrowth", userGrowth);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Error fetching stats\"}");
        }
    }
}
