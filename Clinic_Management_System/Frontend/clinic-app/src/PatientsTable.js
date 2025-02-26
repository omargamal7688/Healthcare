import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientsTable = () => {
  const [patients, setPatients] = useState([]); // State to store patients data

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/patients") // Change this if your backend URL is different
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
      });
  }, []);

  return (
    <div>
      <h2>Patient List</h2>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Mobile</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.mobile}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsTable;
