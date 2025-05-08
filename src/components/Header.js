import { Link } from 'react-router-dom';
import '../styles/Header.css'

const Header = ({ title }) => {
    return (
        
        <div className="header">
            <div className="rectangleheader">
                <div className="ellipseheader" >
                </div>
                <h1 className="headertitle">{title}</h1>
            </div>
        </div>
    );
};

export default Header;