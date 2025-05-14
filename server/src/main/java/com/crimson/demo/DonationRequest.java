package com.crimson.demo;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Entity class mapped to the 'BloodRequest' table in the database.
 * Includes validation constraints and automatic timestamp setting.
 */
@Entity
@Table(name = "BloodRequest")
public class DonationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false) // NULL not allowed.
    private long donationId;

    @NotBlank(message = "Full name is required")
    @Size(min = 5, max = 100, message = "Full name must be between 5 and 100 characters")
    private String fullname;

    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 50, message = "Age must not exceed 40")
    private int age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Blood group is required")
    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Invalid blood group format")
    // ^ yaani NOT WALA SIGN.
    private String bloodgroup;

    @NotBlank(message = "Location is required")
    private String location;

    @Min(value = 1, message = "Units to donate must be at least 1")
    private int unitsToDonate;

    @NotBlank(message = "User ID is required")
    private long userId;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{11}$", message = "Phone number must be 11 digits")
    private String phone;

    private boolean requested;

    @Column(name = "timestamp", updatable = false)
    private LocalDateTime timestamp;

    // Auto-set timestamp before persisting
    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
        // or FOR INTERNATIONAL TIME ZONE:
        // this.timestamp = LocalDateTime.now(ZoneId.of("UTC"));
        // or FOR PAKISTAN TIME ZONE:
        // this.timestamp = LocalDateTime.now(ZoneId.of("Asia/Karachi")):
    } // jaisay hi request ho automatically timestamp set ho jaye ga.

    // ----- Getters and Setters -----

    public long getDonationId() {
        return donationId;
    }

    public void setDonationId(long donationId) {
        this.donationId = donationId;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBloodgroup() {
        return bloodgroup;
    }

    public void setBloodgroup(String bloodgroup) {
        this.bloodgroup = bloodgroup;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getUnitsToDonate() {
        return unitsToDonate;
    }

    public void setUnitsToDonate(int unitsToDonate) {
        this.unitsToDonate = unitsToDonate;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{11}$", message = "Phone number must be 11 digits")
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isRequested() {
        return requested;
    }

    public void setRequested(boolean requested) {
        this.requested = requested;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
