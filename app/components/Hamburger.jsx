'use client';

import { useState, useEffect } from "react";

const Hamburger = () => {
    const [isOpen, setIsOpen] = useState(localStorage.getItem('activeSidebar') === 'true' || false);

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    // Add/remove class on <body> when isOpen changes
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('activeSidebar');
        } else {
            document.body.classList.remove('activeSidebar')
        }

        localStorage.setItem('activeSidebar', isOpen);
    }, [isOpen]);

    return (
        <button type="button" className="px-6 py-4 cursor-pointer bg-neutral-700 hover:bg-orange-dark w-max focus:outline-0" onClick={toggleMenu}>
            <span className="sr-only">Open/Close Sidebar</span>
            {/* Icon open(Open sidebar) */}
            <svg width="30" height="18" className="group-[.activeSidebar]:hidden" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF" fillRule="evenodd"><path d="M0 0h30v2H0zM0 8h30v2H0zM0 16h30v2H0z" /></g></svg>
            {/* Icon closed (Close sidebar) */}
            <svg width="24" height="24" className="hidden group-[.activeSidebar]:block size-6" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF" fillRule="evenodd"><path d="M2.1.686 23.315 21.9l-1.415 1.415L.686 2.1z" /><path d="M.686 21.9 21.9.685l1.415 1.415L2.1 23.314z" /></g></svg>
        </button>
    )
}

export default Hamburger;