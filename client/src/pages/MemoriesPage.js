import MemoryForm from "../components/MemoryForm";
import InformationBox from "../components/InformationBox";
import { useState } from "react";

function MemoriesPage() {
    const [showInformationBox, setShowInformationBox] = useState(false);
    const [informationMessage, setInformationMessage] = useState('');
    const [informationType, setInformationType] = useState('');

    const displayInformationBox = (message, type) => {
        setInformationMessage(message);
        setInformationType(type);
        setShowInformationBox(true);

        setTimeout(() => {
            setShowInformationBox(false);
        }, 5000);
    }

    return (
        <div>
            {showInformationBox && <InformationBox message={informationMessage} type={informationType}/>}
            <h1 className="text-center mt-8 text-4xl font-bold">Memories</h1>
            <MemoryForm 
                displayInformationBox={displayInformationBox}
            />
        </div>
    );
}

export default MemoriesPage;