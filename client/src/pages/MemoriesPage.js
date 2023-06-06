import AddMemoryForm from "../components/AddMemoryForm";
import Memory from "../components/Memory";
import InformationBox from "../components/InformationBox";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function MemoriesPage() {
    const [showInformationBox, setShowInformationBox] = useState(false);
    const [informationMessage, setInformationMessage] = useState('');
    const [informationType, setInformationType] = useState('');
    const [memories, setMemories] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    // Used to re-render MemoriesPage when a memory is changed. Not to keep track of number of memories.
    const [memoryCount, setMemoryCount] = useState(0);
    const { user } = useAuthContext();
    
    const getMemories = () => {
        fetch("http://localhost:5000/memories", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.memories);
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
        });
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
        console.log("memoryCount", memoryCount);
    }, [memoryCount]);

    return (
        <div className="flex h-screen">
            <Sidebar />
            {showInformationBox && <InformationBox message={informationMessage} type={informationType}/>}
            {/* <h1 className="font-bold text-2xl">Welcome back, Bob!</h1> */}
            <button className="fixed bottom-6 right-6 rounded-full px-4 py-4 bg-green-800" onClick={() => { setIsAdding(true) }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 font-bold text-green-300">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
            </button>
            <div className="grid grid-cols-3 flex-none">
                {memories.map(memory => {
                    return <Memory
                                key={memory._id}
                                id={memory._id}
                                title={memory.title}
                                description={memory.description}
                                date={memory.date}
                                isCoreMemory={memory.isCoreMemory}
                                displayInformationBox={displayInformationBox}
                                onMemoryChange={handleMemoryChange}
                            />
                })}
            </div>
            {isAdding &&
            <AddMemoryForm 
                setIsAdding={setIsAdding}
                onMemoryChange={handleMemoryChange} 
                displayInformationBox={displayInformationBox} 
            />}
            {/* <div className="">
                {isEditing && <EditMemoryForm
                                    memory={{ title: title, description: description, isCoreMemory: isCoreMemory, date: date, id: id }}
                                    onMemoryChange={onMemoryChange}
                                    displayInformationBox={displayInformationBox}
                                    setIsEditing={setIsEditing}
                                />}
            </div> */}
        </div>
    );
}

export default MemoriesPage;