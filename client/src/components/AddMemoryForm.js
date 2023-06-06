import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddMemoryForm({ displayInformationBox, onMemoryChange, setIsAdding }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [isCoreMemory, setIsCoreMemory] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const { user } = useAuthContext();
    const addFormRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Title:", title, "Description:", description, "Date", date, "isCoreMemory", isCoreMemory);
        addMemory();
        onMemoryChange();
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

    const handleClickOutside = (event) => {
        if (addFormRef.current && !addFormRef.current.contains(event.target)) {
            setIsAdding(false);
        }
    }
    
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    return (
        <div ref={addFormRef} className="h-auto w-96 border-2 shadow-lg border-gray-100 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8">
            <h1 className="font-xl font-bold mb-3">Add a New Memory</h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                >
                <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor="titleInput">Title</label>
                    <input
                        className="bg-gray-50 rounded-sm border border-gray-300 p-1"
                        id="titleInput"
                        type="text"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value) }}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor="descInput">Description</label>
                    <textarea
                    className="bg-gray-50 rounded-sm border border-gray-300"
                        id="descInput"
                        type="text"
                        rows={6}
                        value={description}
                        style={{ resize: 'none' }} // Set the resize property to none
                        onChange={(e) => { setDescription(e.target.value) }}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm">Date</h1>
                    <DatePicker className="rounded-sm text-sm bg-gray-50 w-full border border-gray-300 p-1" selected={date} onChange={(dateInput) => setDate(dateInput)} />
                </div>
                <div className="flex gap-2 items-center">
                    <label className="text-sm" htmlFor="coreMemoryInput">Core Memory</label>
                    <input
                        id="coreMemoryInput"
                        type="checkbox"
                        className="w-5 h-5"
                        checked={isCoreMemory}
                        onChange={() => setIsCoreMemory(!isCoreMemory)}
                    />
                </div>
                <button className="bg-blue-600 py-2 rounded-sm text-white text-sm" type="submit">Submit</button>
            </form>
        </div>
    )
}

export default AddMemoryForm;