import React from 'react';
import './home.css';
// import { useNavigate } from 'react-router-dom';

function Home() {
    // const {navigation} = useNavigate();
    const handleStudentLogin = () => {
        alert('Redirecting to Student Login');
        // Add navigation or login logic here
    };

    const handleTeacherLogin = () => {
        alert('Redirecting to Teacher Login');
        // Add navigation or login logic here
        // navigation.navigate()
        const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "email": "amelvin@terpmail.umd.edu"
});

fetch("http://127.0.0.1:8000/generate-jwt/", {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  })
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
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