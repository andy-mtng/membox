import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MemoryForm({ displayInformationBox, onMemoryAdded }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [isCoreMemory, setIsCoreMemory] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const { user } = useAuthContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Title:", title, "Description:", description, "Date", date, "isCoreMemory", isCoreMemory);
        addMemory();
        onMemoryAdded();
    }

    const resetFields = () => {
        setTitle("");
        setDescription("");
        setDate(new Date());
        setIsCoreMemory(false);
    }

    const addMemory = () => {
        const newMemory = {
            title: title,
            description: description,
            isCoreMemory: isCoreMemory,
            date: date
        }

        fetch("http://localhost:5000/memories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify(newMemory)
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
        resetFields();
    }

    return (
        <form onSubmit={handleSubmit} className="bg-blue-200 w-96">
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
            <button type="submit">Submit</button>
        </form>
    )
}

export default MemoryForm;