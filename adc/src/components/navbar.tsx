import './Navbar.css'

const Navbar = () => {
    return ( 
      <nav>
        <div className="left">
          <a href="/">App Dev</a>
        </div>
        <div className="right">
          <a href="/attendance" target="_blank" rel="noopener 
          no-referrer">
            <span>Attendance</span>
          </a>
          <a href="/attendance" target="_blank" rel="noopener 
          no-referrer">
            <span>Lecture</span>
          </a>
          <a href="/attendance" target="_blank" rel="noopener 
          no-referrer">
            <span>HW</span>
          </a>
          <a href="/attendance" target="_blank" rel="noopener 
          no-referrer">
            <span>Slack</span>
          </a>
          <a href="/attendance" target="_blank" rel="noopener 
          no-referrer">
            <span>Mentor</span>
          </a>
        </div>
  </nav>
    )
  }
  
  export default Navbar
  