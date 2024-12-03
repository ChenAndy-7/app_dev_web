import React, { useState, useEffect } from 'react';
import styles from './hw.module.css';

interface Homework {
  id: number;
  hwName: string;
  description: string;
  dueDate: string;
  url: string;
}

const HW: React.FC = () => {
  const [flippedCardIds, setFlippedCardIds] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [formData, setFormData] = useState<Omit<Homework, 'id'>>({
    hwName: '',
    description: '',
    dueDate: '',
    url: ''
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);

  // Fetch homework data when component mounts
  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    try {
      const response = await fetch('http://localhost:8000/homework');
      if (!response.ok) throw new Error('Failed to fetch homework');
      const data = await response.json();
      setHomeworks(data);
    } catch (error) {
      console.error('Error fetching homework:', error);
    }
  };

  const handleCardClick = (id: number) => {
    setFlippedCardIds(prevFlippedCardIds => {
      const newFlippedCardIds = new Set(prevFlippedCardIds);
      if (newFlippedCardIds.has(id)) {
        newFlippedCardIds.delete(id);
      } else {
        newFlippedCardIds.add(id);
      }
      return newFlippedCardIds;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/homework', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create homework');
      
      // Fetch updated homework list
      await fetchHomework();
      
      // Reset form and close modal
      setIsModalOpen(false);
      setFormData({
        hwName: '',
        description: '',
        dueDate: '',
        url: ''
      });
    } catch (error) {
      console.error('Error creating homework:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/homework/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete homework');
      
      // Fetch updated homework list
      await fetchHomework();
    } catch (error) {
      console.error('Error deleting homework:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHomework) return;

    try {
      const response = await fetch(`http://localhost:8000/homework/${editingHomework.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingHomework),
      });

      if (!response.ok) throw new Error('Failed to update homework');
      
      await fetchHomework();
      setIsEditModalOpen(false);
      setEditingHomework(null);
    } catch (error) {
      console.error('Error updating homework:', error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.cardContainer}>
        {homeworks.map((homework) => (
          <div key={homework.id} className={styles.card}>
            <div 
              className={`${styles.cardInner} ${flippedCardIds.has(homework.id) ? styles.flipped : ''}`}
              onClick={() => handleCardClick(homework.id)}
            >
              <div className={styles.cardFront}>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(homework.id);
                  }}
                  title="Delete homework"
                >
                  ×
                </button>
                <h2>{homework.hwName}</h2>
                <p className={styles.dueDate}>Due: {homework.dueDate}</p>
                <h3>Click to see details</h3>
              </div>
              <div className={styles.cardBack}>
                <button
                  className={styles.editButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingHomework(homework);
                    setIsEditModalOpen(true);
                  }}
                  title="Edit homework"
                >
                  ✎
                </button>
                <div className={styles.cardDetails}>
                  <p className={styles.description}>{homework.description}</p>
                  <div className={styles.cardActions}>
                    <a 
                      href={homework.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={styles.submitLink}
                    >
                      Submit Homework
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        className={styles.fab}
        onClick={() => setIsModalOpen(true)}
      >
        +
      </button>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add New Homework</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="hwName">Homework Name:</label>
                <input
                  type="text"
                  id="hwName"
                  name="hwName"
                  value={formData.hwName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="dueDate">Due Date:</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="url">Submission URL:</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.modalButtons}>
                <button type="submit">Add Homework</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editingHomework && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Homework</h2>
            <form onSubmit={handleEdit}>
              <div className={styles.formGroup}>
                <label htmlFor="editHwName">Homework Name:</label>
                <input
                  type="text"
                  id="editHwName"
                  name="hwName"
                  value={editingHomework.hwName}
                  onChange={(e) => setEditingHomework({
                    ...editingHomework,
                    hwName: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="editDescription">Description:</label>
                <textarea
                  id="editDescription"
                  name="description"
                  value={editingHomework.description}
                  onChange={(e) => setEditingHomework({
                    ...editingHomework,
                    description: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="editDueDate">Due Date:</label>
                <input
                  type="date"
                  id="editDueDate"
                  name="dueDate"
                  value={editingHomework.dueDate}
                  onChange={(e) => setEditingHomework({
                    ...editingHomework,
                    dueDate: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="editUrl">Submission URL:</label>
                <input
                  type="url"
                  id="editUrl"
                  name="url"
                  value={editingHomework.url}
                  onChange={(e) => setEditingHomework({
                    ...editingHomework,
                    url: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.modalButtons}>
                <button type="submit">Save Changes</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingHomework(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HW;