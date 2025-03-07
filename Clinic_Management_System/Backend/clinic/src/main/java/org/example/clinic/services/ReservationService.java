package org.example.clinic.services;

import org.example.clinic.model.Reservation;
import org.example.clinic.repo.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

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

    public Reservation createReservation(Reservation reservation) throws Exception {
        if (hasReservationOnSameDate(reservation.getPatient().getId(), reservation.getDate())) {
            throw new Exception("المريض لديه حجز في هذا التاريخ بالفعل.");
        }

        if (isTurnTaken(reservation.getTurn(), reservation.getDate())) {
            throw new Exception("الوقت المحدد محجوز بالفعل.");
        }

        return reservationRepository.save(reservation);
    }
    public boolean hasReservationOnSameDate(Long patientId, LocalDate date) {
        return reservationRepository.existsByPatientIdAndDate(patientId, date);
    }

    // Check if the turn is already taken on a specific date
    public boolean isTurnTaken(int turn, LocalDate date) {
        return reservationRepository.existsByTurnAndDate(turn, date);
    }
    public List<Integer> getReservedTurnsByDate(LocalDate date) {
        return reservationRepository.findReservedTurnsByDate(date);
    }
    public Optional<Reservation> findById(Long id) {
        return reservationRepository.findById(id);
    }

    public void deleteById(Long id) {
        reservationRepository.deleteById(id);
    }

    public Reservation cancelReservation(Long id) throws Exception {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new Exception("Reservation not found"));

        reservation.setCancelled(true);
        reservation.setTurn(0); // Ensure turn is reset to 0
        return reservationRepository.save(reservation);
    }
    public Reservation successReservation(Long id) throws Exception {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new Exception("Reservation not found"));

        reservation.setSuccess(true);
        return reservationRepository.save(reservation);
    }

    public Reservation activeReservation(Long id) throws Exception {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new Exception("Reservation not found"));

        reservation.setCancelled(false);
        reservation.setTurn(0); // Ensure turn is reset to 0
        return reservationRepository.save(reservation);
    }
    public List<Reservation> getActiveReservations() {
        return reservationRepository.findByCancelledFalse();
    }


    public List<Reservation> getCancelReservations() {
        return reservationRepository.findByCancelledTrue();
    }
}
