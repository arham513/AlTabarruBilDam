package com.crimson.demo;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "RequestBlood")
/**
 * Entity class mapped to the 'RequestBlood' table in the database.
 * Includes validation constraints and automatic timestamp setting.
 */
public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestid;
    @Column(nullable = false) // NULL not allowed.
    @Min(value = 1, message = "Recipient ID must be a positive number")
    private long RecipientId;
    @Min(value = 1, message = "Donor ID must be a positive number")
    private long donorId;
    @NotBlank(message = "Blood group is required")
    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Invalid blood group format")
    private String bloodGroup;
    @NotBlank(message = "Full name is required")
    @Size(min = 5, max = 30, message = "Full name must be between 5 and 30 characters")
    private String name;
    @Pattern(regexp = "^(Male|Female|Other)$", message = "Only Male/Female/Transgenders Allowed")
    private String gender;
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(Pending|Accepted|Rejected)$", message = "Status must be either Pending, Accepted, or Rejected")
    private String status;

    @Column(name = "timestamp", updatable = false)
    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    private LocalDateTime timestamp;
    // or FOR INTERNATIONAL TIME ZONE:
    // this.timestamp = LocalDateTime.now(ZoneId.of("UTC"));

    public BloodRequest() {
    }

    // Constructor with all fields
    // consider String.....
    public BloodRequest(long RecipientId, long donorId, String bloodGroup, String name, String gender,
            String status, LocalDateTime timestamp) {
        // requestID set Automatically from the database.
        this.RecipientId = RecipientId;
        this.donorId = donorId;
        this.bloodGroup = bloodGroup;
        this.name = name;
        this.gender = gender;
        this.status = status;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public long getRecipientId() {
        return RecipientId;
    }

    public void setRecipientId(long RecipientId) {
        this.RecipientId = RecipientId;
    }

    public void setRequestId(long ReqId) {
        this.requestid = ReqId;
    }

    public Long getRequestId() {
        return requestid;
    }

    public long getDonorId() {
        return donorId;
    }

    public void setDonorId(long donorId) {
        this.donorId = donorId;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
