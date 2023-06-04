import { useState, useEffect, useRef } from "react";

function MemoryDropDown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef}>
            <button onClick={() => { setIsOpen(!isOpen) }}>...</button>
            {isOpen && (
                <div>
                    <h1>Edit</h1>
                    <h1>Delete</h1>
                </div>
            )}
        </div>
    )
}

export default MemoryDropDown;