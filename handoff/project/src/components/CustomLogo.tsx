import React from 'react';

interface CustomLogoProps {
    type: 'menu' | 'login';
    className?: string;
}

const CustomLogo: React.FC<CustomLogoProps> = ({ type, className = '' }) => {
    const logoPath = type === 'login' 
        ? '/logo-golden-veicular-login.png'
        : '/logo-golden-veicular-menu.png';

    return (
        <img 
            src={logoPath} 
            alt="Golden Veicular Logo" 
            className={`object-contain ${className}`}
        />
    );
};

export default CustomLogo;
