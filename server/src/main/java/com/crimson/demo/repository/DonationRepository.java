package com.crimson.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import com.crimson.demo.Donation;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    Optional<Donation> findByUserId(long userId);

    Optional<Donation> findByDonationId(long donationId);

    List<Donation> findByBloodgroup(String bloodGroup);

    Optional<Donation> findByEmail(String email);

    // Request walay mein city daalni hai...
    Optional<Donation> findByCity(String city);

    Optional<Donation> findByPhone(String phone);

    Optional<Donation> findByFullname(String fullname);

    Optional<Donation> findByLocation(String location);

    Optional<Donation> viewAll();
}
