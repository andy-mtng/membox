import AddMemoryForm from "../components/AddMemoryForm";
import Memory from "../components/Memory";
import InformationBox from "../components/InformationBox";
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
        <div>
            {showInformationBox && <InformationBox message={informationMessage} type={informationType}/>}
            <div className="grid grid-cols-3 gap-4">
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
            <button onClick={() => { setIsAdding(true) }}>+</button>
            {isAdding &&
            <AddMemoryForm 
                setIsAdding={setIsAdding}
                onMemoryChange={handleMemoryChange} 
                displayInformationBox={displayInformationBox} 
            />}
        </div>
    );
}

export default MemoriesPage;