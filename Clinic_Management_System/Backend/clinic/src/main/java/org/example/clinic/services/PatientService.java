package org.example.clinic.services;

import org.example.clinic.model.Patient;
import org.example.clinic.repo.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
            // Create new patient - Check if mobile already exists
            if (patientRepository.existsByMobile(patient.getMobile())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "❌ A patient with mobile " + patient.getMobile() + " already exists.");
            }
            return patientRepository.save(patient);
        } else {
            // Update existing patient
            return patientRepository.findById(patient.getId()).map(existingPatient -> {
                if (!existingPatient.getMobile().equals(patient.getMobile()) &&
                        patientRepository.existsByMobile(patient.getMobile())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "❌ A patient with mobile " + patient.getMobile() + " already exists.");
                }
                existingPatient.setName(patient.getName());
                existingPatient.setMobile(patient.getMobile());
                return patientRepository.save(existingPatient);
            }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "❌ Patient not found with ID " + patient.getId()));
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

    public List<Patient> searchPatientByMobile(String mobile) {
        return patientRepository.findByMobileContaining(mobile);
    }
    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }
}