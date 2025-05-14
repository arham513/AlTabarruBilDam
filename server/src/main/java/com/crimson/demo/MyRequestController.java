package com.crimson.demo;

import com.crimson.demo.repository.DonationRepository;

import com.crimson.demo.repository.BloodRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/myrequests")
@CrossOrigin(origins = "*")
public class MyRequestController {

    @Autowired
    private BloodRequestRepository requestRepo;

    @Autowired
    private DonationRepository donationRepo;

    public static class UserIdRequest {
        private String userId;

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }
    }

    // FIND MATCHING DONORS
    @RequestMapping("/api/find-donors")
    @PostMapping("/search")
    public ResponseEntity<?> findDonors(@RequestBody BloodRequest request) {
        // String city = request.getCity();
        // List<Donation> matchingDonors = new ArrayList<>();
        List<Donation> matchingdonors = donationRepo.findByBloodgroup(request.getBloodGroup());
        return ResponseEntity.ok(matchingdonors);
    }

    @PostMapping("/get")
    public ResponseEntity<List<BloodRequest>> getMyRequests(@RequestBody BloodRequest request) {
        List<BloodRequest> requests = requestRepo.findByDonorId(request.getDonorId());
        return ResponseEntity.ok(requests);
    }
    // @PostMapping("/accept")

    // Hr Donor view krey requests ko....
    // RECIPIENT kay liye... recipientid == donorid
    @PostMapping("/cancel")
    // It handles POST requests at the /cancel endpoint.
    // It expects a JSON body representing a BloodRequest object, which is
    // deserialized into request.
    public ResponseEntity<String> cancelRequest(@RequestBody BloodRequest request) {
        // Donor cancels their participation, but the request remains available to
        // others
        Optional<Donation> donationOpt = donationRepo.findByUserId(request.getDonorId());
        if (donationOpt.isPresent()) {
            Donation donation = donationOpt.get();
            donation.setRequested(false); // Donor ka کھاتا clear...
            donationRepo.save(donation);
        }
        return ResponseEntity.ok("You have successfully opted out of this request.");
    } // baaqi can still view the blood request.

    // RECIPIENT WALA WORK...
    @PostMapping("/create")
    public ResponseEntity<String> createRequest(@RequestBody BloodRequest request) {
        request.setRequestId(request.getRequestId());
        request.setDonorId(0); // ISS KO BHI DEKHNA FIND DONOR saay...
        // Donor ID ko 0 set karna hai kyunki abhi tak kisi ne accept nahi kiya
        request.setStatus("Pending"); // Status ko "Pending" set karna hai
        // request.setRecipientId(); // RecipientID recipient saay....
        requestRepo.save(request);
        // donorID aaye gi FINDBYDONOR wali class, controller saay....
        // Optional<Donation> donationOpt =
        // donationRepo.findByUserId(request.getDonorId());
        // if (donationOpt.isPresent()) {
        // Donation donation = donationOpt.get();
        // donation.setRequested(true);
        // donationRepo.save(donation);
        // }
        return ResponseEntity.ok("{\"message\": \"Request created for the donorS to view successfully\"}");
    }

    @RequestMapping("/api/acceptedrequests")
    @PostMapping("/accept")
    // It handles POST requests at the /accept endpoint.
    public ResponseEntity<String> acceptRequest(@RequestBody BloodRequest requestBody) {
        try {
            Long requestId = requestBody.getRequestId();

            // Step 1: Fetch the blood request
            Optional<BloodRequest> requestOpt = requestRepo.findById(requestId);
            if (requestOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Blood request not found.");
            }

            BloodRequest request = requestOpt.get();
            String requiredBloodGroup = request.getBloodGroup();

            // Step 2: Find matching donors
            List<Donation> matchingDonors = donationRepo.findByBloodgroup(requiredBloodGroup);
            if (matchingDonors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No matching donor found for this blood group.");
            }
            Donation donor = matchingDonors.get(0);

            request.setStatus("ACCEPTED");

            requestRepo.save(request);

            return ResponseEntity.ok("Request accepted by donor: " + donor.getUserId() + donor.getFullname()
                    + " with blood group: " + donor.getBloodgroup() + " and location: " + donor.getLocation());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
    // @PostMapping("/accept")
    // public ResponseEntity<String> acceptRequest(@RequestBody AcceptRequestBody
    // requestBody) {
    // try {
    // Long requestId = requestBody.getRequestId();
    // Long donorId = requestBody.getDonorId();

    // // 1. Fetch blood request
    // Optional<BloodRequest> requestOpt = requestRepo.findById(requestId);
    // if (requestOpt.isEmpty()) {
    // return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Blood request not
    // found.");
    // }

    // // 2. Fetch donor
    // Optional<Donation> donorOpt = donationRepo.findById(donorId);
    // if (donorOpt.isEmpty()) {
    // return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Donor not found.");
    // }

    // BloodRequest request = requestOpt.get();
    // Donation donor = donorOpt.get();

    // // 3. Check blood group compatibility
    // if (!request.getBloodGroup().equalsIgnoreCase(donor.getBloodGroup())) {
    // return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Donor blood group
    // does not match request.");
    // }

    // // 4. Accept the donor
    // request.setAcceptedBy(donor); // assume @ManyToOne Donation acceptedBy
    // request.setStatus("ACCEPTED");

    // requestRepo.save(request);

    // return ResponseEntity.ok("Donor assigned successfully.");
    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: "
    // + e.getMessage());
    // }
}

/*
 * package com.crimson.demo;
 * import org.springframework.web.bind.annotation.RestController;
 * import org.springframework.web.bind.annotation.CrossOrigin;
 * import org.springframework.web.bind.annotation.PostMapping;
 * import org.springframework.web.bind.annotation.RequestBody;
 * import org.springframework.web.bind.annotation.RequestMapping;
 * 
 * import org.springframework.http.ResponseEntity;
 * 
 * import java.util.UUID;
 * import java.sql.Connection;
 * import java.sql.PreparedStatement;
 * 
 * @RestController
 * 
 * @RequestMapping("/api/requests")
 * 
 * @CrossOrigin(origins = "*")
 * public class RequestBloodController {
 * 
 * @PostMapping("/create")
 * public ResponseEntity<String> createRequest(@RequestBody RequestBlood
 * requestBlood) {
 * String requestId = UUID.randomUUID().toString();
 * String insertRequestSql =
 * "INSERT INTO requests (requestId, requesterId, donorId, bloodGroup, name, gender, status, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, GETDATE())"
 * ;
 * String updateDonationSql =
 * "UPDATE donations SET requested = 1 WHERE userId = ?";
 * try (Connection conn = InitDB.getConnection();
 * PreparedStatement insertStmt = conn.prepareStatement(insertRequestSql);
 * PreparedStatement updateStmt = conn.prepareStatement(updateDonationSql)) {
 * // Insert the request
 * insertStmt.setString(1, requestId);
 * insertStmt.setString(2, requestBlood.getRequesterId());
 * insertStmt.setString(3, requestBlood.getDonorId());
 * insertStmt.setString(4, requestBlood.getBloodGroup());
 * insertStmt.setString(5, requestBlood.getName());
 * insertStmt.setString(6, requestBlood.getGender());
 * insertStmt.setString(7, requestBlood.getStatus());
 * insertStmt.executeUpdate();
 * // Update the donation's requested field
 * updateStmt.setString(1, requestBlood.getDonorId());
 * updateStmt.executeUpdate();
 * System.out.println("Request created with ID: " + requestId + "  ->donorid" +
 * requestBlood.getDonorId());
 * return ResponseEntity.
 * ok("{\"message\": \"Request created and donation updated successfully\"}");
 * } catch (Exception e) {
 * e.printStackTrace();
 * return
 * ResponseEntity.status(500).body("{\"message\": \"Error processing request\"}"
 * );
 * }
 * }
 * };
 */
