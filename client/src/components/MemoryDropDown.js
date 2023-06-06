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
        <div ref={dropdownRef} className="">
            <div className="flex flex-col gap-2 justify-end">
                <div className="font-semibold text-2xl w-6 rounded-sm flex justify-center items-center h-12 bg-green-100 absolute top-0 right-1" onClick={() => { setIsOpen(!isOpen) }}>...</div>
                {isOpen && (
                    <div className="flex flex-col items-end border border-gray-100 bg-red-100">
                        <button className="" onClick={() => { setIsEditing(true) }}>Edit</button>
                        <button className="" onClick={handleDelete}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MemoryDropDown;