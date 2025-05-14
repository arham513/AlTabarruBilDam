package com.crimson.demo;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "UserDonation")
public class UserDonation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 50)
    private String name;

    @NotBlank
    @Size(min = 3, max = 50)
    private String location;

    @Column(name = "timestamp", updatable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    @Min(0)
    private int totalDonated;

    // Default constructor
    public UserDonation() {
    }

    // Constructor with all fields
    public UserDonation(String name, String location, LocalDateTime timestamp, int totalDonated) {
        this.name = name;
        this.location = location;
        this.timestamp = timestamp;
        this.totalDonated = totalDonated;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getTotalDonated() {
        return totalDonated;
    }

    public void setTotalDonated(int totalDonated) {
        this.totalDonated = totalDonated;
    }
}
