package com.crimson.demo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class InitDB {
    private static final String DB_URL = "jdbc:sqlserver://localhost:1433;databaseName=crimsondb;encrypt=true;trustServerCertificate=true";
    private static final String USER = "your_username";
    private static final String PASS = "your_password";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, USER, PASS);
    }

    public static void initialize() {
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            // Users table
            String usersTable = "IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' and xtype='U') " +
                    "CREATE TABLE users (" +
                    "userId VARCHAR(255) PRIMARY KEY," +
                    "name VARCHAR(255)," +
                    "email VARCHAR(255)," +
                    "password VARCHAR(255)," +
                    "phone VARCHAR(50)," +
                    "address VARCHAR(255)," +
                    "eligibilityStatus BIT," +
                    "createdAt DATETIME DEFAULT GETDATE()" +
                    ")";
            stmt.execute(usersTable);

            // Donations table
            String donationsTable = "IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='donations' and xtype='U') " +
                    "CREATE TABLE donations (" +
                    "donationId VARCHAR(255) PRIMARY KEY," +
                    "fullname VARCHAR(255)," +
                    "age INT," +
                    "gender VARCHAR(20)," +
                    "bloodgroup VARCHAR(10)," +
                    "location VARCHAR(255)," +
                    "unitsToDonate INT," +
                    "userId VARCHAR(255)," +
                    "phone VARCHAR(50)," +
                    "requested BIT," +
                    "timestamp DATETIME DEFAULT GETDATE()" +
                    ")";
            stmt.execute(donationsTable);

            // Requests table
            String requestsTable = "IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='requests' and xtype='U') " +
                    "CREATE TABLE requests (" +
                    "requestId VARCHAR(255) PRIMARY KEY," +
                    "requesterId VARCHAR(255)," +
                    "donorId VARCHAR(255)," +
                    "bloodGroup VARCHAR(10)," +
                    "name VARCHAR(255)," +
                    "gender VARCHAR(20)," +
                    "status VARCHAR(50)," +
                    "timestamp DATETIME DEFAULT GETDATE()" +
                    ")";
            stmt.execute(requestsTable);

            // Reports table
            String reportsTable = "IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='reports' and xtype='U') " +
                    "CREATE TABLE reports (" +
                    "reportId INT IDENTITY(1,1) PRIMARY KEY," +
                    "reporterId VARCHAR(255)," +
                    "reportedUserId VARCHAR(255)," +
                    "reportReason VARCHAR(255)," +
                    "description VARCHAR(1000)," +
                    "timestamp DATETIME DEFAULT GETDATE()" +
                    ")";
            stmt.execute(reportsTable);

            // Blacklisted users table
            String blacklistTable = "IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='blacklisted_users' and xtype='U') " +
                    "CREATE TABLE blacklisted_users (" +
                    "userId VARCHAR(255) PRIMARY KEY," +
                    "email VARCHAR(255)," +
                    "reason VARCHAR(255)," +
                    "timestamp DATETIME DEFAULT GETDATE()" +
                    ")";
            stmt.execute(blacklistTable);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
