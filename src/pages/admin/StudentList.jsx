// src/pages/admin/StudentList.jsx
import React from 'react';
import { FaUserCircle, FaExclamationTriangle, FaEnvelope } from 'react-icons/fa';

const generateDummyStudents = () => {
  const names = ['Aarav', 'Ishita', 'Kabir', 'Saanvi', 'Rohan', 'Ananya', 'Vedant', 'Myra', 'Aryan', 'Diya'];
  const complaints = [
    'Wi-Fi not working in hostel',
    'Library books outdated',
    'Faculty not responding',
    'Labs need maintenance',
    'Water shortage in canteen',
    'Broken fans in classroom',
    'Poor lighting in corridors',
    'Issue with online portal',
    'Dirty washrooms',
    'Projector not working',
  ];

  const students = [];
  for (let i = 1; i <= 60; i++) {
    students.push({
      id: i,
      name: `${names[i % names.length]} ${i}`,
      email: `student${i}@college.edu`,
      complaint: complaints[i % complaints.length],
    });
  }
  return students;
};

const StudentList = () => {
  const students = generateDummyStudents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-purple-800 mb-10 text-center">
          Student Complaints Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-3xl shadow-lg border-t-4 border-purple-500 p-6 transform transition hover:scale-105 duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <FaUserCircle className="text-5xl text-purple-600" />
                <div>
                  <h2 className="text-xl font-bold text-purple-800">{student.name}</h2>
                  <p className="text-gray-600 flex items-center gap-1 text-sm">
                    <FaEnvelope /> {student.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FaExclamationTriangle className="text-red-500 mt-1" />
                <p className="text-gray-700 font-medium">{student.complaint}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentList;
