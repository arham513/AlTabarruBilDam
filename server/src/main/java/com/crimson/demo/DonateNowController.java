package com.crimson.demo;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

// Import statements
import com.crimson.demo.repository.DonationRepository;
// import com.crimson.demo.Donation;
// import com.crimson.demo.UserDonation;
// import com.crimson.demo.DonationRequest;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonateNowController {

    private final DonationRepository donationRepository;

    public DonateNowController(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createDonation(@RequestBody DonationRequest donationRequest) {
        Optional<Donation> existingOpt = donationRepository.findByUserId(donationRequest.getUserId());

        if (existingOpt.isPresent()) {
            Donation existing = existingOpt.get();

            if (existing.getBloodgroup().equalsIgnoreCase(donationRequest.getBloodgroup())) {
                // Update units and mark as not requested
                existing.setUnitsToDonate(existing.getUnitsToDonate() + donationRequest.getUnitsToDonate());
                existing.setRequested(false);
                donationRepository.save(existing);

                return ResponseEntity.ok("{\"message\": \"Donation updated successfully\"}");
            } else {
                return ResponseEntity.status(400)
                        .body("{\"message\": \"Blood group mismatch for existing donation\"}");
            }
        } else {
            // Create new donation
            Donation donation = new Donation();
            // donation.setDonationId(UUID.randomUUID().toString().hashCode());
            donation.setDonationId(donationRequest.getDonationId());
            // Auto gen from database.
            donation.setFullname(donationRequest.getFullname());
            donation.setAge(donationRequest.getAge());
            donation.setGender(donationRequest.getGender());
            donation.setBloodgroup(donationRequest.getBloodgroup());
            donation.setLocation(donationRequest.getLocation());
            donation.setUnitsToDonate(donationRequest.getUnitsToDonate());
            donation.setUserId(donationRequest.getUserId());
            donation.setPhone(donationRequest.getPhone());
            donation.setRequested(donationRequest.isRequested());
            donation.setTimestamp(donationRequest.getTimestamp());

            donationRepository.save(donation); // save to the database.
            return ResponseEntity.ok("{\"message\": \"Donation created successfully\"}");
        }
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserDonation>> getLeaderboard() {
        List<Donation> allDonations = donationRepository.findAll();

        Map<String, UserDonation> leaderboard = new HashMap<>();

        for (Donation donation : allDonations) {
            long userId = donation.getUserId();

            int units = donation.getUnitsToDonate();
            String userid = String.valueOf(userId);
            // msla hal... good ho gya...
            // Leaderboard ji bann rahay...
            leaderboard.compute(userid, (k, v) -> {
                if (v == null) {
                    return new UserDonation(donation.getFullname(), donation.getLocation(),
                            donation.getTimestamp(), units);
                } else {
                    v.setTotalDonated(v.getTotalDonated() + units);
                    return v;
                }
            });
        }

        List<UserDonation> leaderboardList = new ArrayList<>(leaderboard.values());
        leaderboardList.sort((d1, d2) -> Integer.compare(d2.getTotalDonated(), d1.getTotalDonated()));

        return ResponseEntity.ok(leaderboardList);
    }
}
// ALT TARIQAA...
// import org.springframework.http.ResponseEntity;

// import java.util.UUID;
// import java.util.List;
// import java.util.ArrayList;
// import java.sql.Connection;
// import java.sql.PreparedStatement;
// import java.sql.ResultSet;
// import java.sql.SQLException;

// @RestController
// @RequestMapping("/api/donations")
// @CrossOrigin(origins = "*")
// public class DonateNowController {

// @PostMapping("/create")
// public ResponseEntity<String> createDonation(@RequestBody DonationRequest
// donationRequest) {
// try (Connection conn = InitDB.getConnection()) {
// // Check if a donation already exists with this userId
// String selectSql = "SELECT donationId, bloodgroup, unitsToDonate FROM
// donations WHERE userId = ?";
// try (PreparedStatement selectStmt = conn.prepareStatement(selectSql)) {
// selectStmt.setString(1, donationRequest.getUserId());
// ResultSet rs = selectStmt.executeQuery();
// if (rs.next()) {
// String dbBloodGroup = rs.getString("bloodgroup");
// if (dbBloodGroup != null &&
// dbBloodGroup.equalsIgnoreCase(donationRequest.getBloodgroup())) {
// int updatedUnits = rs.getInt("unitsToDonate") +
// donationRequest.getUnitsToDonate();
// String updateSql = "UPDATE donations SET unitsToDonate = ?, requested = 0
// WHERE donationId = ?";
// try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
// updateStmt.setInt(1, updatedUnits);
// updateStmt.setString(2, rs.getString("donationId"));
// updateStmt.executeUpdate();
// }
// System.out.println("Donation updated for userId: " +
// donationRequest.getUserId());
// return ResponseEntity.ok("{\"message\": \"Donation updated successfully\"}");
// } else {
// return ResponseEntity.status(400)
// .body("{\"message\": \"Blood group mismatch for existing donation\"}");
// }
// } else {
// // No existing donation, create a new one
// String donationId = UUID.randomUUID().toString();
// String insertSql = "INSERT INTO donations (donationId, fullname, age, gender,
// bloodgroup, location, unitsToDonate, userId, phone, requested, timestamp)
// VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE())";
// try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
// insertStmt.setString(1, donationId);
// insertStmt.setString(2, donationRequest.getFullname());
// insertStmt.setInt(3, donationRequest.getAge());
// insertStmt.setString(4, donationRequest.getGender());
// insertStmt.setString(5, donationRequest.getBloodgroup());
// insertStmt.setString(6, donationRequest.getLocation());
// insertStmt.setInt(7, donationRequest.getUnitsToDonate());
// insertStmt.setString(8, donationRequest.getUserId());
// insertStmt.setString(9, donationRequest.getPhone());
// insertStmt.setBoolean(10, donationRequest.isRequested());
// insertStmt.executeUpdate();
// }
// System.out.println("Donation created: " + donationId);
// return ResponseEntity.ok("{\"message\": \"Donation created successfully\"}");
// }
// }
// } catch (SQLException e) {
// e.printStackTrace();
// return ResponseEntity.status(500).body("{\"message\": \"Error during donation
// creation\"}");
// }
// }

// @GetMapping("/leaderboard")
// public ResponseEntity<List<UserDonation>> getLeaderboard() {
// String sql = "SELECT fullname, location, timestamp, SUM(unitsToDonate) as
// totalDonated FROM donations GROUP BY fullname, location, timestamp ORDER BY
// totalDonated DESC";
// List<UserDonation> leaderboardList = new ArrayList<>();
// try (Connection conn = InitDB.getConnection();
// PreparedStatement stmt = conn.prepareStatement(sql)) {
// ResultSet rs = stmt.executeQuery();
// while (rs.next()) {
// UserDonation userDonation = new UserDonation(
// rs.getString("fullname"),
// rs.getString("location"),
// rs.getString("timestamp"),
// rs.getInt("totalDonated")
// );
// leaderboardList.add(userDonation);
// }
// return ResponseEntity.ok(leaderboardList);
// } catch (SQLException e) {
// e.printStackTrace();
// return ResponseEntity.status(500).body(null);
// }
// }
// }
