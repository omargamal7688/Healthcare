package org.example.clinic.controller;

import org.example.clinic.model.Patient;
import org.example.clinic.model.Reservation;
import org.example.clinic.services.PatientService;
import org.example.clinic.services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {
    private final ReservationService reservationService;
    private final PatientService patientService;

    @Autowired
    public ReservationController(ReservationService reservationService, PatientService patientService) {
        this.reservationService = reservationService;
        this.patientService = patientService;
    }

    @GetMapping("/")
    public ResponseEntity<?> getReservations(@RequestParam(value = "patientId", required = false) Long patientId) {
        List<Reservation> reservations;
        if (patientId != null) {
            reservations = reservationService.getReservationsByPatientId(patientId);
        } else {
            reservations = reservationService.getAllReservations();
        }

        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEEE");
        for (Reservation reservation : reservations) {
            if (reservation.getDate() != null) {
                reservation.setDayOfWeek(reservation.getDate().format(dayFormatter));
            } else {
                reservation.setDayOfWeek("غير محدد");
            }
        }
        return ResponseEntity.ok(reservations);
    }


    @PostMapping("/")
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
        try {
            // Check if patient is null
            if (reservation.getPatient() == null || reservation.getPatient().getId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Patient ID is required.");
            }

            // Fetch the actual patient from DB
            Optional<Patient> patient = patientService.getPatientById(reservation.getPatient().getId());
            if (patient.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient not found.");
            }

            // Set the real patient before saving
            reservation.setPatient(patient.get());

            reservationService.createReservation(reservation);
            return ResponseEntity.status(HttpStatus.CREATED).body("تم الحجز بنجاح");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/reserved-turns")
    public ResponseEntity<List<Integer>> getReservedTurns(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Integer> reservedTurns = reservationService.getReservedTurnsByDate(date);
        return ResponseEntity.ok(reservedTurns);
    }



}
