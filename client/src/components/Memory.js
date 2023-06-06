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
        <div className="">
            <div className="flex flex-col border border-gray-300 p-4 shadow-sm rounded-lg w-96 h-auto">
                <MemoryDropDown handleDelete={handleDelete} setIsEditing={setIsEditing}/>
                <div>
                    <h1>{title}</h1>
                    <p>{description}</p>
                    <p>{isCoreMemory ? "true" : "false"}</p>
                    <h2>{formattedDate}</h2>
                </div>
            </div>
            <div className="">
                {isEditing && <EditMemoryForm
                                    memory={{ title: title, description: description, isCoreMemory: isCoreMemory, date: date, id: id }}
                                    onMemoryChange={onMemoryChange}
                                    displayInformationBox={displayInformationBox}
                                    setIsEditing={setIsEditing}
                                />}
            </div>
        </div>
    )
}

export default Memory;