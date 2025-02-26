package org.example.clinic.controller;

import org.example.clinic.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.example.clinic.model.Patient;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:3000")
// Base URL for this controller
public class PatientController {
 private final PatientService patientService;

 @Autowired
 public PatientController(PatientService patientService) {
  this.patientService = patientService;
 }

 @GetMapping()
 public List<Patient> getAllPatients() {
  return patientService.getAllPatients();
 }
}
