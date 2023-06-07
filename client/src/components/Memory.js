import moment from 'moment';
import MemoryDropDown from "./MemoryDropDown";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";

function Memory({ 
            setIsEditing, 
            onMemoryChange, 
            id, 
            title, 
            description, 
            date, 
            isCoreMemory, 
            memoryToEdit,
            setMemoryToEdit,
            displayInformationBox }) {
    const momentDate = moment(date);
    const formattedDate = momentDate.format('MMMM DD, YYYY');
    const { user } = useAuthContext();

    const handleDelete = () => {
        fetch(`http://localhost:5000/memories?delId=${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.type === "error") {
                throw new Error(data.error);
            }

            if (data.type === "success") {
                displayInformationBox(data.message, "success");
            }
            console.log(data);
            onMemoryChange();

        })
        .catch((error) => {
            if (error) {
                displayInformationBox(error.message, "error");
            }
        });
    }

    const handleEdit = (e) => {
        e.preventDefault();
        setIsEditing(true);
        // Used to pre-populate the memory form for edits (raises the state to the parent)
        setMemoryToEdit({
            title: title,
            description: description,
            id: id,
            date: date,
            isCoreMemory: isCoreMemory,
        });
    }
 
    return (
        <div className="relative border border-gray-200 shadow-sm rounded-md w-80 p-3">
            <MemoryDropDown handleDelete={handleDelete} handleEdit={handleEdit} setIsEditing={setIsEditing}/>
            <div className="flex h-40 flex-col justify-between">
                <div>
                    <h1 className="font-bold text-xl">{title}</h1>
                    <p className="font-normal text-sm text-gray-600">{description}</p>
                </div>
                <h2 className="font-normal text-sm text-gray-600">{formattedDate}</h2>
            </div>
        </div>
    )
}

export default Memory;