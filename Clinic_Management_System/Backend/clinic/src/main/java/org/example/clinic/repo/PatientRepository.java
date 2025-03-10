package org.example.clinic.repo;


import org.example.clinic.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByMobileContaining(String mobile);
    boolean existsByMobile(String mobile);

}