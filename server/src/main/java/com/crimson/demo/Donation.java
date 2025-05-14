package com.crimson.demo;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false) // NULL not allowed.
    @Min(value = 1, message = "Donation ID must be a positive number")
    private Long donationId; // database Long hi generate krta... 64 bit signed integer rep

    @NotBlank(message = "Full name is required")
    private String fullname;

    @Min(value = 1, message = "Age must be greater than 18")
    @Max(value = 100, message = "Age must be less than or equal to 40")
    private int age;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(Male|Female|Transgender)$", message = "Not a valid gender")
    private String gender;

    @NotBlank(message = "Blood group is required")
    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Invalid blood group format")
    // Enum could be made but we have already checked for the format. So NO need.
    private String bloodgroup;

    @NotBlank(message = "Location is required")
    private String location;

    @Min(value = 1, message = "At least 1 unit must be donated")
    private int unitsToDonate;

    @NotBlank(message = "User ID is required")
    private long userId;

    @Pattern(regexp = "^[0-9]{11}$", message = "Phone must be a 11-digit number")
    private String phone;

    private boolean requested;

    @Column(name = "timestamp", updatable = false)
    private LocalDateTime timestamp;

    public Donation() {
    }

    public Donation(long donationId, String fullname, int age, String gender, String bloodgroup,
            String location, int unitsToDonate, long userId, String phone,
            boolean requested, LocalDateTime timestamp) {
        this.donationId = donationId;
        this.fullname = fullname;
        this.age = age;
        this.gender = gender;
        this.bloodgroup = bloodgroup;
        this.location = location;
        this.unitsToDonate = unitsToDonate;
        this.userId = userId;
        this.phone = phone;
        this.requested = requested;
        this.timestamp = timestamp;
    }

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now(); // set on creation
    }

    // Getters and setters...

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
