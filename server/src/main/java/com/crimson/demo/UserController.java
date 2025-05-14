package com.crimson.demo;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Map;
import java.util.UUID;
import java.util.List;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    // Login Route
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody UserLoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        System.out.println("Email: " + email);
        System.out.println("Password: " + password);

        String sql = "SELECT userId, name, email, phone, address, eligibilityStatus, password FROM users WHERE email = ?";
        try (Connection conn = InitDB.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                String dbPassword = rs.getString("password");
                if (dbPassword != null && dbPassword.equals(password)) {
                    String responseJson = String.format(
                            "{\"userId\": \"%s\", \"name\": \"%s\", \"email\": \"%s\", \"phone\": \"%s\", \"address\": \"%s\", \"eligibilityStatus\": %b}",
                            rs.getString("userId"),
                            rs.getString("name"),
                            rs.getString("email"),
                            rs.getString("phone"),
                            rs.getString("address"),
                            rs.getBoolean("eligibilityStatus"));
                    return ResponseEntity.ok(responseJson);
                } else {
                    return ResponseEntity.status(401).body("{\"message\": \"Incorrect password\"}");
                }
            } else {
                return ResponseEntity.status(404).body("{\"message\": \"User not found\"}");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Error during login\"}");
        }
    }

    // Register Route
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User registerRequest) {
        System.out.println("Name: " + registerRequest.getName());
        System.out.println("Email: " + registerRequest.getEmail());
        System.out.println("Password: " + registerRequest.getPassword());
        System.out.println("Phone: " + registerRequest.getPhone());
        System.out.println("Address: " + registerRequest.getAddress());
        System.out.println("Eligibility Status: " + registerRequest.getEligibilityStatus());

        String sql = "INSERT INTO users (userId, name, email, password, phone, address, eligibilityStatus, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, GETDATE())";
        try (Connection conn = InitDB.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {
            String userId = UUID.randomUUID().toString();
            stmt.setString(1, userId);
            stmt.setString(2, registerRequest.getName());
            stmt.setString(3, registerRequest.getEmail());
            stmt.setString(4, registerRequest.getPassword());
            stmt.setString(5, registerRequest.getPhone());
            stmt.setString(6, registerRequest.getAddress());
            stmt.setBoolean(7, registerRequest.getEligibilityStatus());
            stmt.executeUpdate();
            System.out.println("User registered: " + userId);
            return ResponseEntity.ok("{\"message\": \"User registered successfully\"}");
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Error during registration\"}");
        }
    }

    // Get User Info by userId
    @GetMapping("/{userId}")
    public ResponseEntity<String> getUserById(@PathVariable String userId) {
        String sql = "SELECT userId, name, email, phone, address, eligibilityStatus FROM users WHERE userId = ?";
        try (Connection conn = InitDB.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, userId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                String responseJson = String.format(
                        "{\"userId\": \"%s\", \"name\": \"%s\", \"email\": \"%s\", \"phone\": \"%s\", \"address\": \"%s\", \"eligibilityStatus\": %b}",
                        rs.getString("userId"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("phone"),
                        rs.getString("address"),
                        rs.getBoolean("eligibilityStatus"));
                return ResponseEntity.ok(responseJson);
            } else {
                return ResponseEntity.status(404).body("{\"message\": \"User not found\"}");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Error fetching user\"}");
        }
    }

    @PostMapping("/report")
    public ResponseEntity<String> reportUser(@RequestBody UserReport reportRequest) {
        long reporterId = reportRequest.getReporterId();
        long reportedUserId = reportRequest.getReportedUserId();
        String reason = reportRequest.getReason();
        String description = reportRequest.getDescription();

        // Check for duplicate report
        String checkSql = "SELECT COUNT(*) FROM reports WHERE reporterId = ? AND reportedUserId = ?";
        String insertSql = "INSERT INTO reports (reporterId, reportedUserId, reportReason, description, timestamp) VALUES (?, ?, ?, ?, GETDATE())";
        try (Connection conn = InitDB.getConnection();
                PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
            checkStmt.setLong(1, reporterId);
            checkStmt.setLong(2, reportedUserId);
            ResultSet rs = checkStmt.executeQuery();
            if (rs.next() && rs.getInt(1) > 0) {
                return ResponseEntity.status(400).body("{\"message\": \"You have already reported this user.\"}");
            }
            try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
                insertStmt.setLong(1, reporterId);
                insertStmt.setLong(2, reportedUserId);
                insertStmt.setString(3, reason);
                insertStmt.setString(4, description != null ? description : "");
                insertStmt.executeUpdate();
            }
            return ResponseEntity.ok("{\"message\": \"Report submitted successfully\"}");
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Error submitting report\"}");
        }
    }

    @PostMapping("/reportedUsers")
    public ResponseEntity<Object> getReportedUsers(@RequestBody Map<String, String> request) {
        String reporterId = request.get("reporterId");
        String sql = "SELECT reportedUserId FROM reports WHERE reporterId = ?";
        List<Map<String, String>> reportedUsers = new ArrayList<>();
        try (Connection conn = InitDB.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, reporterId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Map<String, String> reported = new java.util.HashMap<>();
                reported.put("reportedUserId", rs.getString("reportedUserId"));
                reportedUsers.add(reported);
            }
            return ResponseEntity.ok(reportedUsers);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Error fetching reported users\"}");
        }
    }

}
