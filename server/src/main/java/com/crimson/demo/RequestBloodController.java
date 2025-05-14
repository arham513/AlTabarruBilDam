// package com.crimson.demo;

// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;

// import org.springframework.http.ResponseEntity;

// import java.util.UUID;
// import java.sql.Connection;
// import java.sql.PreparedStatement;

// @RestController
// @RequestMapping("/api/requests")
// @CrossOrigin(origins = "*")
// public class RequestBloodController {

// @PostMapping("/create")
// public ResponseEntity<String> createRequest(@RequestBody BloodRequest
// requestBlood) {
// String requestId = UUID.randomUUID().toString();
// String insertRequestSql = "INSERT INTO requests (requestId, requesterId,
// donorId, bloodGroup, name, gender, status, timestamp) VALUES (?, ?, ?, ?, ?,
// ?, ?, GETDATE())";
// String updateDonationSql = "UPDATE donations SET requested = 1 WHERE userId =
// ?";
// try (Connection conn = InitDB.getConnection();
// PreparedStatement insertStmt = conn.prepareStatement(insertRequestSql);
// PreparedStatement updateStmt = conn.prepareStatement(updateDonationSql)) {
// // Insert the request
// insertStmt.setString(1, requestId);
// insertStmt.setString(2, requestBlood.getRequesterId());
// insertStmt.setString(3, requestBlood.getDonorId());
// insertStmt.setString(4, requestBlood.getBloodGroup());
// insertStmt.setString(5, requestBlood.getName());
// insertStmt.setString(6, requestBlood.getGender());
// insertStmt.setString(7, requestBlood.getStatus());
// insertStmt.executeUpdate();
// // Update the donation's requested field
// updateStmt.setString(1, requestBlood.getDonorId());
// updateStmt.executeUpdate();
// System.out.println("Request created with ID: " + requestId + " ->donorid" +
// requestBlood.getDonorId());
// return ResponseEntity.ok("{\"message\": \"Request created and donation
// updated successfully\"}");
// } catch (Exception e) {
// e.printStackTrace();
// return ResponseEntity.status(500).body("{\"message\": \"Error processing
// request\"}");
// }
// }
// }
