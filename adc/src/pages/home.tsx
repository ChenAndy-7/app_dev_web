import React from 'react';
import './home.css';

function Home() {
    const handleStudentLogin = () => {
        alert('Redirecting to Student Login');
        // Add navigation or login logic here
    };

    const handleTeacherLogin = () => {
        alert('Redirecting to Teacher Login');
        // Add navigation or login logic here
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 id="title">C: USER\APPDEVCLUB\LOGIN: </h1>
            <div style={{ marginTop: '20px' }}>
                <button id="studentbut"
                    onClick={handleStudentLogin} 
                >
                    Student Login
                </button>
                <button id="teacherbut"
                    onClick={handleTeacherLogin} 
                >
                    Teacher Login
                </button>
            </div>
        </div>
    );
}

export default Home;