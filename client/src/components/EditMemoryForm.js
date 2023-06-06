import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function EditMemoryForm({ onMemoryChange, memory, displayInformationBox, setIsEditing }) {
    const [title, setTitle] = useState(memory.title);
    const [description, setDescription] = useState(memory.description);
    const [date, setDate] = useState(new Date(memory.date));
    const [isCoreMemory, setIsCoreMemory] = useState(memory.isCoreMemory);
    const [validationErrors, setValidationErrors] = useState([]);
    const { user } = useAuthContext();

    console.log(memory.date);

    const handleSubmit = (e) => {
        e.preventDefault();
        const editedMemory = {
            title: title,
            description: description,
            date: date,
            isCoreMemory: isCoreMemory,
        }
        fetch(`http://localhost:5000/memories?editId=${memory.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify(editedMemory)
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.type === "error") {
                throw new Error(data.error);
            }
            
            if (data.validationErrors) {
                setValidationErrors(data.validationErrors)
            }

            if (data.type === "success") {
                displayInformationBox(data.message, "success");
            }

            console.log(data);
        })
        .catch((error) => {
            if (error) {
                displayInformationBox(error.message, "error");
            }
        });
        setIsEditing(false);
        onMemoryChange();
    }

    return (
        <form onSubmit={handleSubmit} className="bg-orange-200 w-96 absolute top-0 left-0">
        <div>
            <label htmlFor="titleInput">Title</label>
            <input 
                id="titleInput"
                type="text" 
                value={title} 
                onChange={(e) => { setTitle(e.target.value) }}
            />
        </div>
        <div>
            <label htmlFor="descInput">Description</label>
            <input 
                id="descInput"
                type="text" 
                value={description}
                onChange={(e) => { setDescription(e.target.value) }}
            />
        </div>
        <div>
            <h1>Date</h1>
            <DatePicker selected={date} onChange={(dateInput) => setDate(dateInput)} />
        </div>
        <div>
            <label htmlFor="coreMemoryInput">Core Memory</label>
            <input
                id="coreMemoryInput"
                type="checkbox"
                checked={isCoreMemory}
                onChange={() => setIsCoreMemory(!isCoreMemory)}
            />
        </div>
        <button type="submit">Save</button>
    </form>
    );
}

export default EditMemoryForm;