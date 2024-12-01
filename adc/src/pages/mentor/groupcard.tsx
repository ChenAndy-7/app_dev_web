import React from 'react';
import { Group } from './interface';

interface GroupCardProps {
  group: Group;
  onDelete: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onDelete }) => {
  return (
    <div className="group-card">
      <h2>Group #{group.id}</h2>
      <div className="inside-card">
      <div className="mentor-section">
        {group.mentors.map((mentor) => (
          <div className="mentor" key={mentor.id}>
            <img src={mentor.picture} alt={mentor.name} />
            <div className="mentor-name">{mentor.name}</div>
          </div>
        ))}
      </div>
      <div className="student-section">
        <h3>Students:</h3>
        <ul className="student-list">
          {group.students.map((student, index) => (
            <li key={index}>{student}</li>
          ))}
        </ul>
      </div>
      </div>
      <div className="card-actions">
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default GroupCard;
