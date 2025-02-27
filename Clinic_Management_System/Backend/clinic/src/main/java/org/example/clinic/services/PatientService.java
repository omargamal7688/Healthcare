package org.example.clinic.services;

import org.example.clinic.model.Patient;
import org.example.clinic.repo.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class PatientService {



    private final PatientRepository patientRepository;

    @Autowired
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }





    public Patient saveOrUpdatePatient(Patient patient) {
        if (patient.getId() == null || patient.getId() == 0) {
            // Create a new patient
            return patientRepository.save(patient);
        } else {
            // Update an existing patient
            return patientRepository.findById(patient.getId()).map(existingPatient -> {
                existingPatient.setName(patient.getName());
                existingPatient.setMobile(patient.getMobile());
                return patientRepository.save(existingPatient);
            }).orElseGet(() -> {
                // If ID is not found, treat it as a new patient
                return patientRepository.save(patient);
            });
        }
    }


    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
    public Optional<Patient> findById(Long id) {
        return patientRepository.findById(id);
    }

    // Method to delete a patient by ID
    public void deleteById(Long id) {
        patientRepository.deleteById(id);
    }


}