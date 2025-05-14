// package com.crimson.demo;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Map;
// import java.util.HashMap;
// import java.util.ArrayList;

// @RestController
// @RequestMapping("/api/acceptedrequests")
// @CrossOrigin(origins = "*")
// public class AcceptedRequestController {
// // Accepted Request table.
// @Autowired
// private AcceptedRequestRepository acceptedRequestRepository;

// @PostMapping("/accept")
// public ResponseEntity<String> acceptRequest(@RequestBody AcceptRequestBody
// requestBody) {
// try {
// // Step 1: Find the matching request from the "requests" table
// String sql = "SELECT * FROM requests WHERE donorId = ? AND requesterId = ?";
// Request request = jdbcTemplate.queryForObject(sql, new
// Object[]{requestBody.getDonorId(), requestBody.getRequesterId()}, new
// RequestRowMapper());

// if (request == null) {
// return ResponseEntity.status(404).body("No matching request found");
// }

// // Step 2: Get donor and recipient details from the "users" table
// User donor = getUserById(requestBody.getDonorId());
// User recipient = getUserById(request.getRequesterId());

// // Step 3: Save accepted request to "acceptedrequests" table
// AcceptedRequest acceptedRequest = new AcceptedRequest();
// acceptedRequest.setDonorId(requestBody.getDonorId());
// acceptedRequest.setRecipientId(request.getRequesterId());
// acceptedRequest.setDonorName(donor.getName());
// acceptedRequest.setRecipientName(recipient.getName());
// acceptedRequest.setDonorLocation(donor.getAddress());
// acceptedRequest.setRecipientLocation(recipient.getAddress());
// acceptedRequest.setDonorPhone(donor.getPhone());
// acceptedRequest.setRecipientPhone(recipient.getPhone());

// acceptedRequestRepository.save(acceptedRequest);

// return ResponseEntity.ok("Request accepted and added to acceptedrequests");

// } catch (Exception e) {
// e.printStackTrace();
// return ResponseEntity.status(500).body("Error occurred while accepting the
// request");
// }
// }

// @GetMapping("/matched-users/{userId}")
// public ResponseEntity<?> getMatchedUsers(@PathVariable String userId) {
// try {
// // Query the matched users from SQL Server
// String sql = "SELECT * FROM acceptedrequests WHERE donorId = ? OR recipientId
// = ?";
// List<AcceptedRequest> requests = jdbcTemplate.query(sql, new Object[]{userId,
// userId}, new AcceptedRequestRowMapper());

// // Process matched users
// List<Map<String, Object>> matchedUsers = new ArrayList<>();
// for (AcceptedRequest request : requests) {
// String matchedUserId = request.getDonorId().equals(userId) ?
// request.getRecipientId() : request.getDonorId();
// User matchedUser = getUserById(matchedUserId);

// Map<String, Object> userMap = new HashMap<>();
// userMap.put("name", matchedUser.getName());
// userMap.put("location", matchedUser.getAddress());
// userMap.put("phone", matchedUser.getPhone());
// userMap.put("userId", matchedUserId);
// matchedUsers.add(userMap);
// }

// return ResponseEntity.ok(matchedUsers);

// } catch (Exception e) {
// e.printStackTrace();
// return ResponseEntity.status(500).body("Error fetching matched users");
// }
// }

// @GetMapping("/history/{userId}")
// public ResponseEntity<List<String>> getUserDonationHistory(@PathVariable
// String userId) {
// try {
// // Query the donation history
// String sql = "SELECT * FROM acceptedrequests WHERE donorId = ? OR recipientId
// = ?";
// List<AcceptedRequest> requests = jdbcTemplate.query(sql, new Object[]{userId,
// userId}, new AcceptedRequestRowMapper());

// List<String> history = new ArrayList<>();
// for (AcceptedRequest request : requests) {
// if (request.getDonorId().equals(userId)) {
// history.add(String.format("You donated blood to %s. Their contact number was
// %s.",
// request.getRecipientName(), request.getRecipientPhone()));
// } else if (request.getRecipientId().equals(userId)) {
// history.add(String.format("You received blood from %s. Their contact number
// was %s.",
// request.getDonorName(), request.getDonorPhone()));
// }
// }

// return ResponseEntity.ok(history);

// } catch (Exception e) {
// e.printStackTrace();
// return ResponseEntity.status(500).body(null);
// }
// }

// // Helper method to get User data by ID
// private User getUserById(String userId) {
// String sql = "SELECT * FROM users WHERE userId = ?";
// return jdbcTemplate.queryForObject(sql, new Object[]{userId}, new
// UserRowMapper());
// }

// }
// // AcceptRequestBody class to hold the request body
// let see if this is even required or not.