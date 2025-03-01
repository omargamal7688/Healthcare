package org.example.clinic.repo;


import org.example.clinic.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByMobileContaining(String mobile);
    boolean existsByMobile(String mobile);

}