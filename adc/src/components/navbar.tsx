import './navbar.css'
import { Link, useMatch, useResolvedPath } from "react-router-dom"

const Navbar = () => {
    return ( 
      <nav className="nav">
      <Link to="/" className="site-title">
        App Dev
      </Link>
      <ul>
        <CustomLink to="/attendance">Attendance</CustomLink>
        <CustomLink to="/hw">HW</CustomLink>
        <CustomLink to="/lecture">Lecture</CustomLink>
        <CustomLink to="/mentor">Mentor</CustomLink>
        <CustomLink to="/slack">Slack</CustomLink>
      </ul>
    </nav>
    )
  }

  interface CustomLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
    to: string;
    children: React.ReactNode;
  }
  
  const CustomLink: React.FC<CustomLinkProps> = ({ to, children, ...props }) => {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  
    return (
      <li className={isActive ? "active" : ""}>
        <Link to={to} {...props}>
          {children}
        </Link>
      </li>
    );
  };
  

  export default Navbar
  