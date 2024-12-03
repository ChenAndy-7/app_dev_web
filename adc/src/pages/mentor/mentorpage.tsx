import React, { useState, useEffect } from 'react';
import { Mentor } from './interface'; // Assuming 'interface' is where your Mentor interface is defined.
import './mentor.css';

// AddGroupForm Component (inside the same file)
interface AddGroupFormProps {
  onAddGroup: (mentors: Mentor[], students: string[]) => void;
  mentors: Mentor[]; 
}

const AddGroupForm: React.FC<AddGroupFormProps> = ({ onAddGroup, mentors }) => {
  const [selectedMentors, setSelectedMentors] = useState<Mentor[]>([]);
  const [students, setStudents] = useState<string[]>([]);
  const [studentName, setStudentName] = useState<string>('');

  const handleMentorSelect = (mentor: Mentor) => {
    if (selectedMentors.length < 2 && !selectedMentors.includes(mentor)) {
      setSelectedMentors([...selectedMentors, mentor]);
    }
  };

  const handleStudentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentName(e.target.value);
  };

  const handleAddStudent = () => {
    if (studentName.trim() !== '') {
      setStudents([...students, studentName.trim()]);
      setStudentName('');
    } else {
      alert('Please enter a valid student name.');
    }
  };

  const handleRemoveStudent = (student: string) => {
    setStudents(students.filter((s) => s !== student));
  };

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
          <div className="mentor-select">
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
          </div>
          <div className="selected-mentors">
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
        </div>
        
        <div className="student-section">
          <div className="student-input">
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
          </div>
          <div className="student-list-section">
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
      </div>
      <button type="submit" className="addgroupbut">Add Group</button>
    </form>
  );
};

// GroupCard Component (inside the same file)
interface GroupCardProps {
  mentors: Mentor[];
  students: string[];
  onDeleteGroup: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ mentors, students, onDeleteGroup }) => {
  return (
    <div className="group-card">
      <div className="mentor-student">
        <div className="mentor-section">
          <h4>Mentors:</h4>
          <div className="mentor-container">
            {mentors.map((mentor) => (
              <div className="mentor-item" key={mentor.id}>
                <img src={mentor.picture} alt={mentor.name} />
                <p>{mentor.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="student-section">
          <h4>Students:</h4>
          <ul>
            {students.map((student, index) => (
              <li key={index}>{student}</li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={onDeleteGroup}>Delete Group</button>
    </div>
  );
};

// MentorPage Component (parent component)
const MentorPage: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [groups, setGroups] = useState<{ mentors: Mentor[], students: string[] }[]>([]);

  useEffect(() => {
    // Mock fetching mentors from an API
    const fetchedMentors: Mentor[] = [
      { id: 1, name: 'Spencer', picture: './spencer.png' },
      { id: 2, name: 'Phoebe', picture: './phoebe.png' },
      { id: 3, name: 'Phillip', picture: './phillip.png' },
      { id: 4, name: 'Aaquib', picture: './aaquib.png' },
      { id: 5, name: 'Akshaj', picture: './akshaj.png' },
      { id: 6, name: 'Aidan', picture: './aidan.png' },
    ];
    setMentors(fetchedMentors);
  }, []);

  const handleAddGroup = (selectedMentors: Mentor[], students: string[]) => {
    setGroups([...groups, { mentors: selectedMentors, students }]);
  };

  const handleDeleteGroup = (index: number) => {
    const updatedGroups = groups.filter((_, i) => i !== index);
    setGroups(updatedGroups);
  };

  return (
    <div>
      <AddGroupForm mentors={mentors} onAddGroup={handleAddGroup} />
      {groups.map((group, index) => (
        <GroupCard
          key={index}
          mentors={group.mentors}
          students={group.students}
          onDeleteGroup={() => handleDeleteGroup(index)}
        />
      ))}
    </div>
  );
};

export default MentorPage;
