package com.crimson.demo;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "FeedBack")
public class UserReport {

    @NotBlank(message = "Report description must not be blank")
    @Size(max = 1000, message = "Report description must be at most 100 characters")
    @Column(nullable = false, length = 100)
    private String reportDescription;

    @NotBlank(message = "Report reason must not be blank")
    @Size(max = 30, message = "Report reason must be at most 30 characters")
    @Column(nullable = false, length = 30)
    private String reportReason;

    // Reported user details
    @NotBlank(message = "Reported user email must not be blank")
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.com$", message = "Reported user email must be alphanumeric, contain '@', and end with .com")
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String reportedUserEmail;

    @Positive(message = "Reported user ID must be positive")
    @Column(nullable = false)
    private long reportedUserId;

    @NotBlank(message = "Reported user name must not be blank")
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String reportedUserName;

    @NotBlank(message = "Reporter email must not be blank")
    @Email(message = "Reporter email must be valid")
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String reporterEmail;

    @Positive(message = "Reporter ID must be positive")
    @Column(nullable = false)
    private long reporterId;

    @NotBlank(message = "Reporter name must not be blank")
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String reporterName;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long feedbackID; // Feedback ID

    // Getters and Setters
    public long getFeedbackID() {
        return feedbackID;
    }

    public void setFeedbackID(long feedbackID) {
        this.feedbackID = feedbackID;
    }

    public String getDescription() {
        return reportDescription;
    }

    public void setDescription(String reportDescription) {
        this.reportDescription = reportDescription;
    }

    public String getReason() {
        return reportReason;
    }

    public void setReason(String reportReason) {
        this.reportReason = reportReason;
    }

    public String getReportedUserEmail() {
        return reportedUserEmail;
    }

    public void setReportedUserEmail(String reportedUserEmail) {
        this.reportedUserEmail = reportedUserEmail;
    }

    public long getReportedUserId() {
        return reportedUserId;
    }

    public void setReportedUserId(long reportedUserId) {
        this.reportedUserId = reportedUserId;
    }

    public String getReportedUserName() {
        return reportedUserName;
    }

    public void setReportedUserName(String reportedUserName) {
        this.reportedUserName = reportedUserName;
    }

    public String getReporterEmail() {
        return reporterEmail;
    }

    public void setReporterEmail(String reporterEmail) {
        this.reporterEmail = reporterEmail;
    }

    public long getReporterId() {
        return reporterId;
    }

    public void setReporterId(long reporterId) {
        this.reporterId = reporterId;
    }

    public String getReporterName() {
        return reporterName;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
    }
}
