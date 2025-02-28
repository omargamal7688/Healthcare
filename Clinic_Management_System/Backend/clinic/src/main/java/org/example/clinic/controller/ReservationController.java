package org.example.clinic.controller;
import org.example.clinic.model.Reservation;
import org.example.clinic.services.PatientService;
import org.example.clinic.services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.format.DateTimeFormatter;
import java.util.List;

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
    public List<Reservation> getReservations(@RequestParam(value = "patientId", required = false) Long patientId) {
        List<Reservation> reservations;
        if (patientId != null) {
            reservations = reservationService.getReservationsByPatientId(patientId);}
        else {reservations = reservationService.getAllReservations();}
        // Format the day of the week for each reservation
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEEE");
        for (Reservation reservation : reservations)
        {if (reservation.getDate() != null)
        {reservation.setDayOfWeek(reservation.getDate().format(dayFormatter));}else {reservation.setDayOfWeek("غير محدد");}}
        return reservations;}


}
