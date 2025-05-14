package com.crimson.demo.repository;

import com.crimson.demo.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByRecipientId(long RecipientId);

    List<BloodRequest> findByRequestId(long requestId);

    List<BloodRequest> findByDonorId(long donorId);

}
