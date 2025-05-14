package com.crimson.demo;

// import jakarta.persistence.*; A table may not be created in the database.
// So we are commenting out this line and NOT annotating with @Entity.
import jakarta.validation.constraints.*;

public class FindDonorRequest {
    @Min(value = 1, message = "User ID must be a positive number")
    @NotBlank(message = "User ID is required")
    private int userId;

    // Constructors
    public FindDonorRequest() {
    }

    public FindDonorRequest(int userId) {
        this.userId = userId;
    }

    // Getter and Setter
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
