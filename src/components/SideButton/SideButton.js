import React from 'react';
import './SideButton.css';
import home from '../../assets/home.png';

const SideButton = ({ text = "Button", image = home, link = "https://google.com/" }) => {
    return (
        <div className="nav-item">
            {link ? (
                <a href={link} className="nav-link">
                    <img src={image} alt="icon" />
                    <span>{text}</span>
                </a>
            ) : (
                <div className="nav-link">
                    <img src={image} alt="icon" />
                    <span>{text}</span>
                </div>
            )}
        </div>
    );
};

export default SideButton;