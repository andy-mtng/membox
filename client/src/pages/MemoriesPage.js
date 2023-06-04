import MemoryForm from "../components/MemoryForm";
import Memory from "../components/Memory";
import InformationBox from "../components/InformationBox";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function MemoriesPage() {
    const [showInformationBox, setShowInformationBox] = useState(false);
    const [informationMessage, setInformationMessage] = useState('');
    const [informationType, setInformationType] = useState('');
    const [memories, setMemories] = useState([]);
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

    useEffect(() => {
        getMemories();
    }, []);

    return (
        <div>
            {showInformationBox && <InformationBox message={informationMessage} type={informationType}/>}
            <h1 className="text-center mt-8 text-4xl font-bold">Memories</h1>
            {memories.map(memory => {
                return <Memory 
                            key={memory._id} 
                            title={memory.title} 
                            description={memory.description} 
                            date={memory.date}
                        />
            })}
            <MemoryForm 
                displayInformationBox={displayInformationBox}
            />
        </div>
    );
}

export default MemoriesPage;