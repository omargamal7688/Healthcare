package org.example.clinic.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.example.clinic.model.Patient;

import java.time.LocalDate;

@ToString // Add this
@Getter
@Setter
@Entity
@Table(name = "reservation",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"patient_id", "date"}),
                @UniqueConstraint(columnNames = {"date", "turn"})
        })
public class Reservation {
    public Reservation() {}  // Add this

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int turn;
    private LocalDate date;
    private String clinicName;
    private String type;
    private String dayOfWeek;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties(value = {"reservations"})
    private Patient patient;
}
