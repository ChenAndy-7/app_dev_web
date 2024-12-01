import React, { useState } from 'react';
import { Mentor } from './interface';
import { mentors } from './mentor';
import './mentor.css'

interface AddGroupFormProps {
  onAddGroup: (mentors: Mentor[], students: string[]) => void;
}

const AddGroupForm: React.FC<AddGroupFormProps> = ({ onAddGroup }) => {
  const [selectedMentors, setSelectedMentors] = useState<Mentor[]>([]);
  const [students, setStudents] = useState<string[]>([]);
  const [studentName, setStudentName] = useState<string>(''); // Store input field value

  // Handle mentor selection
  const handleMentorSelect = (mentor: Mentor) => {
    if (selectedMentors.length < 2 && !selectedMentors.includes(mentor)) {
      setSelectedMentors([...selectedMentors, mentor]);
    }
  };

  // Handle student input field change
  const handleStudentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentName(e.target.value);
  };

  // Handle adding a student
  const handleAddStudent = () => {
    if (studentName.trim() !== '') {
      setStudents([...students, studentName.trim()]);
      setStudentName(''); // Clear input field
    } else {
      alert('Please enter a valid student name.');
    }
  };

  // Handle removing a student
  const handleRemoveStudent = (student: string) => {
    setStudents(students.filter((s) => s !== student));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMentors.length === 2 && students.length > 0) {
      onAddGroup(selectedMentors, students);
      setSelectedMentors([]);
      setStudents([]);
    } else {
      alert('Please select 2 mentors and add at least 1 student.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="add-group">
        <div className="mentor-section">
          <h3>Select Mentors:</h3>
          <div className="mentor-list">
            {mentors.map((mentor) => (
              <button
                type="button"
                key={mentor.id}
                onClick={() => handleMentorSelect(mentor)}
                disabled={selectedMentors.includes(mentor)}
              >
                {mentor.name}
              </button>
            ))}
          </div>
          <h4>Selected Mentors:</h4>
          <ul>
            {selectedMentors.map((mentor) => (
              <li key={mentor.id}>
                {mentor.name} 
                <button
                  type="button"
                  onClick={() => setSelectedMentors(selectedMentors.filter((m) => m !== mentor))}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="student-section">
          <h3>Add Students:</h3>
          <label>
            <input
              type="text"
              value={studentName}
              onChange={handleStudentInputChange}
              placeholder="Enter student name"
            />
            <button type="button" onClick={handleAddStudent}>
              Add
            </button>
          </label>
          <ul>
            {students.map((student, index) => (
              <li key={index}>
                {student} 
                <button
                  type="button"
                  onClick={() => handleRemoveStudent(student)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button type="submit">Add Group</button>
    </form>
  );
};

export default AddGroupForm;
