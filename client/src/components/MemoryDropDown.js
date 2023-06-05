import { useState, useEffect, useRef } from "react";

function MemoryDropDown({ handleDelete, setIsEditing }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="ml-auto">
            <button onClick={() => { setIsOpen(!isOpen) }}>...</button>
            {isOpen && (
                <div className="flex flex-col items-end">
                    <button onClick={() => { setIsEditing(true) }}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    )
}

export default MemoryDropDown;