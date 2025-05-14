// USER REPOSITORY
package com.crimson.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crimson.demo.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findById(long userID);

    Optional<User> findByPhone(String phone);

    Optional<User> findByName(String name);
}
