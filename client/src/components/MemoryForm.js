import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MemoryForm({ displayInformationBox }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [validationErrors, setValidationErrors] = useState([]);
    const { user } = useAuthContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Title:", title, "Description:", description, "Date", date);
        addMemory();
    }

    const resetFields = () => {
        setTitle("");
        setDescription("");
        setDate(new Date());
    }

    const addMemory = () => {
        const newMemory = {
            title: title,
            description: description,
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
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => { setTitle(e.target.value) }}
                />
            </div>
            <div>
                <label>Description</label>
                <input 
                    type="text" 
                    value={description} 
                    onChange={(e) => { setDescription(e.target.value) }}
                />
            </div>
            <h1>Date</h1>
            <DatePicker selected={date} onChange={(dateInput) => setDate(dateInput)} />
            <button type="submit">Submit</button>
        </form>
    )
}

export default MemoryForm;