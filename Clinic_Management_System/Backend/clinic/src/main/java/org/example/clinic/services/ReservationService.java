package org.example.clinic.services;

import org.example.clinic.model.Reservation;
import org.example.clinic.repo.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {


    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
    public List<Reservation> getReservationsByPatientId(Long patientId) {
        return reservationRepository.findByPatientId(patientId);
    }



}
