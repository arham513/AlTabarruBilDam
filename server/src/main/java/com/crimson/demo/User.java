package com.crimson.demo;

import java.util.Date;

import jakarta.persistence.*;

import jakarta.validation.constraints.*;

@Entity
@Table(name = "User")
public class User {

    @Id
    @NotBlank
    @Min(1)
    private Long userId;

    @NotBlank(message = "Name must not be blank")
    @Size(max = 100, message = "Name must be at most 100 characters")
    private String name;

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must be at most 255 characters")
    private String email;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 8, max = 24, message = "Password must be between 8 and 24 characters")
    private String password;

    @NotBlank(message = "Phone number must not be blank")
    @Pattern(regexp = "^[0-9]{11}$", message = "Phone number must be exactly 11 digits. Dont include hyphen")
    private String phone;

    @NotBlank(message = "Address must not be blank")
    @Size(max = 255, message = "Address must be at most 255 characters")
    private String address;

    // @AssertTrue(message = "Eligibility status must be true") WRONG ASSERTION
    // added... anyways.
    private boolean eligibilityStatus;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public boolean getEligibilityStatus() {
        return eligibilityStatus;
    }

    public void setEligibilityStatus(boolean eligibilityStatus) {
        this.eligibilityStatus = eligibilityStatus;
    }

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public void setUserId(long userId2) {
        userId = userId2;
    }

    public long getUserId() {
        return userId;
    }

}
