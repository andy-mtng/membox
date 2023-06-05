import { format } from "date-fns";
import moment from 'moment';
import MemoryDropDown from "./MemoryDropDown";
import EditMemoryForm from "./EditMemoryForm";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";

function Memory({ onMemoryChange, id, title, description, date, isCoreMemory, displayInformationBox }) {
    const [isEditing, setIsEditing] = useState(false);
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
        })
        .catch((error) => {
            if (error) {
                displayInformationBox(error.message, "error");
            }
        });
        onMemoryChange();
    }
 
    return (
        <div className="flex flex-col border border-black w-96">
            <MemoryDropDown handleDelete={handleDelete} setIsEditing={setIsEditing}/>
            <div>
                <h1>Title: {title}</h1>
                <p>Description: {description}</p>
                <p>isCoreMemory: {isCoreMemory ? "true" : "false"}</p>
                <h2>Date: {formattedDate}</h2>
            </div>
            {isEditing && <EditMemoryForm 
                                memory={{ title: title, description: description, isCoreMemory: isCoreMemory, date: date, id: id }}
                                onMemoryChange={onMemoryChange} 
                                displayInformationBox={displayInformationBox} 
                                setIsEditing={setIsEditing}
                            />}
        </div>
    )
}

export default Memory;