package org.example.clinic.controller;

import jakarta.validation.Valid;
import org.example.clinic.dto.PatientDTO;
import org.example.clinic.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.example.clinic.model.Patient;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {


//Dependency Injection
private final PatientService patientService;
 @Autowired
 public PatientController(PatientService patientService) {
  this.patientService = patientService;
 }
//******************************************************************************************************

//Method to return list of all patients
 @GetMapping("/")
 public List<PatientDTO> getAllPatients() {return patientService.getAllPatients();}
//******************************************************************************************************

 //Method to save new patient or update current patient using id
 @PostMapping
 public ResponseEntity<?> saveOrUpdatePatient(@Valid @RequestBody Patient patient, BindingResult result) {
  if (result.hasErrors()) {Map<String, String> errors = new HashMap<>();
   for (FieldError error : result.getFieldErrors()) {
    errors.put(error.getField(), error.getDefaultMessage());}
   return ResponseEntity.badRequest().body(errors);}
  try {Patient savedPatient = patientService.saveOrUpdatePatient(patient);
   return ResponseEntity.ok(savedPatient);}
  catch (ResponseStatusException e) {
   Map<String, String> response = new HashMap<>();
   response.put("message", e.getReason());
   return ResponseEntity.status(e.getStatusCode()).body(response);}}
 //*********************************************************************************************************************

 //Method to delete patient by id
 @DeleteMapping("/{id}")
 public ResponseEntity<String> deletePatient(@PathVariable Long id) {
  Optional<Patient> patient = patientService.findById(id);
  if (patient.isPresent()) {
   patientService.deleteById(id);
   return ResponseEntity.ok("Patient deleted successfully.");} else {return ResponseEntity.notFound().build();}}
//*****************************************************************************************************************



 @GetMapping("/search")
 public List<Patient> searchPatientByMobile(@RequestParam String mobile) {
  return patientService.searchPatientByMobile(mobile);}

 @GetMapping("/{id}")
 public Optional<Patient> getPatientById(@PathVariable Long id) {
  return patientService.getPatientById(id);}


}


