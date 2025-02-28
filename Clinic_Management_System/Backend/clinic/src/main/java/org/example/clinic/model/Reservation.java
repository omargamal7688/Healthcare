package org.example.clinic.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@Entity
@Table(name = "reservation",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"patient_id", "date"}), // Prevent same patient from reserving on same date
                @UniqueConstraint(columnNames = {"date", "turn"})  // Prevent two patients from having same turn on same date
        })

public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int turn;

    private LocalDate date;

    private String clinicName;

    private String type; // Added the type field of type String
    private String dayOfWeek;  // Add this field for the day of the week

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private Patient patient;


}
