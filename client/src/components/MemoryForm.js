import { useState, useRef, useEffect, useContext } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MemoryChangeContext from "../context/MemoryChangeContext";

function MemoryForm({ memoryToEdit, isEditing, displayInformationBox, setIsEditing, setIsAdding }) {
    const [title, setTitle] = useState(isEditing ? memoryToEdit.title : "");
    const [description, setDescription] = useState(isEditing ? memoryToEdit.description : "");
    const [date, setDate] = useState(isEditing ? new Date(memoryToEdit.date) : new Date());
    const [isCoreMemory, setIsCoreMemory] = useState(isEditing ? memoryToEdit.isCoreMemory : false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const { user } = useAuthContext();
    const formRef = useRef(null);
    const handleMemoryChange = useContext(MemoryChangeContext);
 
    const handleSubmit =  (e) => {
        e.preventDefault();
        console.log("Title:", title, "Description:", description, "Date", date, "isCoreMemory", isCoreMemory);
        apiCall();
    }

    const resetFields = () => {
        setTitle("");
        setDescription("");
        setDate(new Date());
        setIsCoreMemory(false);
        setSelectedFile(null);
    }

    const apiCall = () => {
        const newMemory = new FormData();
        newMemory.append("title", title);
        newMemory.append("description", description);
        newMemory.append("date", date);
        newMemory.append("isCoreMemory", isCoreMemory);
        newMemory.append("image", selectedFile);

        fetch(isEditing ? `http://localhost:5000/memories?editId=${memoryToEdit.id}` : "http://localhost:5000/memories", {
            method: isEditing ? "PUT" : "POST",
            headers: {
                "Authorization": `Bearer ${user.token}`
            },
            body: newMemory
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
            handleMemoryChange();
        })
        .catch((error) => {
            if (error) {
                displayInformationBox(error.message, "error");
            }
        });
        if (isEditing) {
            // Close the form when the user finishes editing
            setIsEditing(false);
        } else {
            // Reset the fields of the form for the user to continue adding new memories
            resetFields();
        }
    }

    const handleClickOutside = (event) => {
        if (formRef.current && !formRef.current.contains(event.target)) {
            setIsAdding(false);
            setIsEditing(false);
        }
    }

    const handleFileSelect = async (e) => {
        const file = e.target.files[0]

        if (file) {
            setSelectedFile(file);
        }
    }
    
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    return (
        <div ref={formRef} className="h-auto w-96 border-2 shadow-lg border-gray-100 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 z-50">
            <h1 className="font-xl font-bold mb-3">{isEditing ? "Edit Memory" : "Add a New Memory"}</h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                >

                {/* Title field */}
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

                {/* Description field */}
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

                {/* Image field */}
                <div className="flex flex-col gap-1">
                    <label className="" htmlFor="image-input">Image</label>
                    <input id="image-input" className="bg-gray-100 border border-gray-400" type="file" onChange={handleFileSelect} />
                </div>

                {/* Date field */}
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
                <button className="bg-blue-600 py-2 rounded-sm text-white text-sm" type="submit">{isEditing ? "Save" : "Submit"}</button>
            </form>
        </div>
    )
}

export default MemoryForm;