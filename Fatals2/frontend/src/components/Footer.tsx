// src/components/Footer.tsx
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-yellow-500 text-black py-4 mb-0">
            <div className="container mx-auto text-center">
                <p className="text-sm">
                   Copyright  © {new Date().getFullYear()} Fatals Fantasy Sport
                </p>
                
            </div>
        </footer>
    );
};

export default Footer;