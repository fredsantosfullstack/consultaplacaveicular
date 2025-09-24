import React from 'react';

export const GoldenVeicularLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <style>
            {`.title { font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; fill: #B58F4E; }`}
            {`.car-main { fill: #0f43aa; }`}
            {`.car-window { fill: #B58F4E; }`}
        </style>
        <path className="car-main" d="M20,55 C25,45 40,40 60,40 L260,40 C280,40 295,45 300,55 L290,60 L30,60 Z" />
        <path className="car-window" d="M80,38 L140,38 L150,25 L210,25 L220,38 L240,38 L230,48 L90,48 Z" />
        <text x="160" y="85" textAnchor="middle" className="title">GOLDEN VEICULAR</text>
    </svg>
);

export const GoldenVeicularLogoWhite: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <style>
            {`.title-white { font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; fill: white; }`}
            {`.car-main-white { fill: white; }`}
            {`.car-window-white { fill: #374151; }`}
        </style>
        <path className="car-main-white" d="M20,55 C25,45 40,40 60,40 L260,40 C280,40 295,45 300,55 L290,60 L30,60 Z" />
        <path className="car-window-white" d="M80,38 L140,38 L150,25 L210,25 L220,38 L240,38 L230,48 L90,48 Z" />
        <text x="160" y="85" textAnchor="middle" className="title-white">GOLDEN VEICULAR</text>
    </svg>
);