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
        <div className="relative border border-gray-200 shadow-sm rounded-md w-80 h-32 p-3">
            <MemoryDropDown handleDelete={handleDelete} setIsEditing={setIsEditing}/>
            <div className="flex flex-col h-full justify-center">
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