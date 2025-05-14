// package com.crimson.demo;

// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;

// import org.springframework.http.ResponseEntity;

// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.concurrent.ExecutionException;

// @RestController
// @RequestMapping("/api/receivedrequests")
// @CrossOrigin(origins = "*")
// public class ReceivedRequestController {

// public static class UserIdRequest {
// private String userId;

// // Getter and Setter
// public String getUserId() {
// return userId;
// }

// public void setUserId(String userId) {
// this.userId = userId;
// }
// }

// @PostMapping("/get")
// public ResponseEntity<List<Map<String, Object>>>
// getReceivedRequests(@RequestBody UserIdRequest request) {
// try {
// Firestore db = FirestoreClient.getFirestore();

// // Query where donorId == userId
// ApiFuture<QuerySnapshot> future = db.collection("requests")
// .whereEqualTo("donorId", request.getUserId())
// .get();

// QuerySnapshot querySnapshot = future.get();

// List<Map<String, Object>> requesterDetailsList = new ArrayList<>();

// for (QueryDocumentSnapshot document : querySnapshot.getDocuments()) {
// String requesterId = document.getString("requesterId");

// if (requesterId != null) {
// // Fetch requester details from users collection
// DocumentSnapshot requesterDoc =
// db.collection("users").document(requesterId).get().get();

// if (requesterDoc.exists()) {
// Map<String, Object> mergedData = new HashMap<>(requesterDoc.getData());

// // Add status field from request document
// String status = document.getString("status");
// mergedData.put("status", status);

// // Optional: include request document ID or other fields if needed
// mergedData.put("requestId", document.getId());

// requesterDetailsList.add(mergedData);
// } else {
// System.out.println("Requester with ID " + requesterId + " not found.");
// }
// }
// }

// return ResponseEntity.ok(requesterDetailsList);

// } catch (InterruptedException | ExecutionException e) {
// e.printStackTrace();
// return ResponseEntity.status(500).build();
// }
// }

// }
// ye bhi chota sa kaam aik hi code file mein ho jaye ga...