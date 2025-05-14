// REPORT REPOSITORY

package com.crimson.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crimson.demo.UserReport;

import java.util.List;

public interface ReportRepository extends JpaRepository<UserReport, Long> {
    boolean existsByReporterIdAndReportedUserId(String reporterId, String reportedUserId);

    List<UserReport> findByReporterId(String reporterId);

    List<UserReport> findByReportedUserId(String reportedUserId);

    List<UserReport> findByReportedUserIdAndStatus(String reportedUserId, String status);

    List<UserReport> findByStatusAndReportedUserId(String status, String reportedUserId);

    List<UserReport> findByStatusAndReporterId(String status, String reporterId);

    boolean exists(long reporterId, long reportedUserId);

    List<UserReport> findByStatus(String status);

}
