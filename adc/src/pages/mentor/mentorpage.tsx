import React, {useState} from 'react';
import GroupCard from './groupcard';
import AddGroupForm from './addgroup';
import { Group } from './interface';
import './mentor.css';

const MentorPage: React.FC = () => {
  // State for groups
  const [groups, setGroups] = useState<Group[]>([]);

  // Add Group Handler
  const handleAddGroup = (mentors: Group['mentors'], students: Group['students']) => {
    const newGroup: Group = {
      id: groups.length + 1, // Unique ID
      groupNumber: groups.length + 1, // Automatically assign group number
      mentors,
      students,
    };
    setGroups([...groups, newGroup]);
  };

  // Delete Group Handler
  const handleDeleteGroup = (id: number) => {
    const updatedGroups = groups.filter((group) => group.id !== id);
    setGroups(updatedGroups);
  };

  return (
    <div className="container">
      {/* Add/Delete Section */}
      <div className="add-delete-section">
        <AddGroupForm onAddGroup={handleAddGroup} />
      </div>

      {/* Group List */}
      <div className="group-list">
        {groups && groups.length > 0 ? (
          groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onDelete={() => handleDeleteGroup(group.id)}
            />
          ))
        ) : (
          <p>No groups available. Add a new group to get started!</p>
        )}
      </div>

    </div>
  );
};

export default MentorPage;
