package org.example.clinic.controller;

import org.example.clinic.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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



 @PostMapping
 public ResponseEntity<Patient> saveOrUpdatePatient(@RequestBody Patient patient) {
  Patient savedPatient = patientService.saveOrUpdatePatient(patient);
  return ResponseEntity.ok(savedPatient);
 }







 @DeleteMapping("/{id}")
 public ResponseEntity<String> deletePatient(@PathVariable Long id) {
  Optional<Patient> patient = patientService.findById(id);
  if (patient.isPresent()) {
   patientService.deleteById(id);return ResponseEntity.ok("Patient deleted successfully.");} else {return ResponseEntity.notFound().build();}}




 @GetMapping("/search")
 public List<Patient> searchPatientByMobile(@RequestParam String mobile) {
  return patientService.searchPatientByMobile(mobile);
 }

 @GetMapping("/{id}")
 public Optional<Patient> getPatientById(@PathVariable Long id) {
  return patientService.getPatientById(id);
 }


}


