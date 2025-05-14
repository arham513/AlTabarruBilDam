// package com.crimson.demo;

// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;

// import java.util.List;

// import org.springframework.http.ResponseEntity;

// import com.crimson.demo.repository.DonationRepository;

// import org.springframework.beans.factory.annotation.Autowired;

// @RestController
// @RequestMapping("/api/find-donors")
// @CrossOrigin(origins = "*")

// public class FindDonorController {
// @Autowired
// private DonationRepository donationRepo;
// @PostMapping("/search")
// public ResponseEntity<?> findDonors(@RequestBody BloodRequest request) {
// // String city = request.getCity();
// // List<Donation> matchingDonors = new ArrayList<>();
// List<Donation> matchingdonors =
// donationRepo.findByBloodgroup(request.getBloodGroup());
// return ResponseEntity.ok(matchingdonors);

// }
// // public ResponseEntity<String> cancelRequest(@RequestBody BloodRequest
// // request) {
// // // Donor cancels their participation, but the request remains available to
// // // others
// // Optional<Donation> donationOpt =
// // donationRepo.findByUserId(request.getDonorId());
// // if (donationOpt.isPresent()) {
// // Donation donation = donationOpt.get();
// // donation.setRequested(false); // Donor ka کھاتا clear...
// // donationRepo.save(donation);
// // }
// // return ResponseEntity.ok("You have successfully opted out of this
// request.");
// // } // baaqi can still view the blood request.

// // New endpoint: Get donation by specific userId... DonorHistory kay liye tha
// // feature
// // @PostMapping("/user-details")
// // public ResponseEntity<?> findUserDonation(@RequestBody FindDonorRequest
// // request) {

// // return ResponseEntity.ok("{\"message\": \"User donation fetched
// // successfully\"}");

// // }
// // }
// }
