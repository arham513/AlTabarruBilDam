package com.crimson.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Map;

@RestController
@RequestMapping("/api/blacklist")
@CrossOrigin(origins = "*")
public class BlacklistController {

    @PostMapping("/removeUser")
    public ResponseEntity<String> removeAndBlacklistUser(@RequestBody Map<String, String> request) {
        String userEmail = request.get("email");
        if (userEmail == null || userEmail.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\": \"Email is required\"}");
        }
        try (Connection conn = InitDB.getConnection()) {
            // Step 1: Find user by email
            String selectUserSql = "SELECT userId FROM users WHERE email = ?";
            // String selectUserDataSql = "SELECT * FROM users WHERE email = ?";
            String insertBlacklistSql = "INSERT INTO blacklisted_users (userId, email, reason, timestamp) VALUES (?, ?, ?, GETDATE())";
            String insertReportSql = "INSERT INTO reports (reporterId, reportedUserId, reportReason, description, timestamp) VALUES (?, ?, ?, ?, GETDATE())";
            String deleteUserSql = "DELETE FROM users WHERE userId = ?";
            String userId = null;
            try (PreparedStatement stmt = conn.prepareStatement(selectUserSql)) {
                stmt.setString(1, userEmail);
                ResultSet rs = stmt.executeQuery();
                if (rs.next()) {
                    userId = rs.getString("userId");
                } else {
                    return ResponseEntity.status(404).body("{\"message\": \"User not found\"}");
                }
            }
            // Step 2: Add to blacklisted_users
            try (PreparedStatement stmt = conn.prepareStatement(insertBlacklistSql)) {
                stmt.setString(1, userId);
                stmt.setString(2, userEmail);
                stmt.setString(3, "User blacklisted and removed.");
                stmt.executeUpdate();
            }
            // Step 3: Add to reports (as a report log)
            try (PreparedStatement stmt = conn.prepareStatement(insertReportSql)) {
                stmt.setString(1, userId); // reporterId
                stmt.setString(2, userId); // reportedUserId
                stmt.setString(3, "User blacklisted and removed.");
                stmt.setString(4, "Blacklisted by admin");
                stmt.executeUpdate();
            }
            // Step 4: Delete user from users
            try (PreparedStatement stmt = conn.prepareStatement(deleteUserSql)) {
                stmt.setString(1, userId);
                stmt.executeUpdate();
            }
            return ResponseEntity.ok("{\"message\": \"User successfully blacklisted and removed.\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }
}
