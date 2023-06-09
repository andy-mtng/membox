import MemoryForm from "../components/MemoryForm";
import Memory from "../components/Memory";
import InformationBox from "../components/InformationBox";
import Sidebar from "../components/Sidebar";
import loadingIcon from "../assets/loading-icon.gif"
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import React from 'react';
import MemoryChangeContext from "../context/MemoryChangeContext";

function MemoriesPage() {
    const [showInformationBox, setShowInformationBox] = useState(false);
    const [informationMessage, setInformationMessage] = useState('');
    const [informationType, setInformationType] = useState('');
    const [memories, setMemories] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [memoryToEdit, setMemoryToEdit] = useState({});
    const [memoriesAreLoading, setMemoriesAreLoading] = useState(false);
    // Used to re-render MemoriesPage when a memory is changed. Not to keep track of number of memories.
    const [memoryCount, setMemoryCount] = useState(0);
    const { user } = useAuthContext();

    const getMemories = () => {
        setMemoriesAreLoading(true);
        fetch("http://localhost:5000/memories", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.type === "error") {
                throw new Error(data.error);
            }

            if (data.type === "success") {
                setMemories(data.memories);
            }
        })
        .catch((error) => {
            if (error) {
                displayInformationBox(error.message, "error");
            }
        })
        .finally(() => {
            setMemoriesAreLoading(false);
        })
    }

    const displayInformationBox = (message, type) => {
        setInformationMessage(message);
        setInformationType(type);
        setShowInformationBox(true);

        setTimeout(() => {
            setShowInformationBox(false);
        }, 5000);
    }

    const handleMemoryChange = () => {
        setMemoryCount((prevCount) => prevCount + 1);
    };

    useEffect(() => {
        getMemories();
    }, [memoryCount]);

    return (
        <div className="grid grid-cols-6 gap-4">
            {showInformationBox && <InformationBox message={informationMessage} type={informationType}/>}
            <div className="col-span-1">
                <Sidebar />
            </div>
            {memoriesAreLoading ? 
            <img className="w-40 h-auto mx-auto mt-4 col-span-5" src={loadingIcon} />
            : 
            <div className="col-span-5">
                <button className="fixed bottom-6 right-6 rounded-full px-4 py-4 bg-green-800 z-50" onClick={() => { setIsAdding(true) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 font-bold text-green-300">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                </button>
                <MemoryChangeContext.Provider value={handleMemoryChange}>
                    <div className="grid grid-cols-3 gap-8 p-6">
                        {memories.map(memory => {
                            return <Memory
                                        key={memory._id}
                                        id={memory._id}
                                        title={memory.title}
                                        description={memory.description}
                                        date={memory.date}
                                        isCoreMemory={memory.isCoreMemory}
                                        memoryImage={memory.memoryImage}
                                        setIsEditing={setIsEditing}
                                        displayInformationBox={displayInformationBox}
                                        memoryToEdit={memoryToEdit}
                                        setMemoryToEdit={setMemoryToEdit}
                                    />
                        })}
                    </div>
                    {(isAdding || isEditing) &&
                    <MemoryForm
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        setIsAdding={setIsAdding}
                        displayInformationBox={displayInformationBox}
                        memoryToEdit={memoryToEdit}
                    />}
                </MemoryChangeContext.Provider>
            </div>
            }
        </div>
    );
}

export default MemoriesPage;