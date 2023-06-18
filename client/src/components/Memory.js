import moment from 'moment';
import MemoryDropDown from "./MemoryDropDown";
import { useAuthContext } from "../hooks/useAuthContext";
import { useContext } from "react";
import MemoryChangeContext from '../context/MemoryChangeContext';

function Memory({ 
            setIsEditing, 
            id, 
            title, 
            description, 
            date, 
            isCoreMemory, 
            setMemoryToEdit,
            memoryImage,
            displayInformationBox }) {
    const momentDate = moment(date);
    const formattedDate = momentDate.format('MMMM DD, YYYY');
    const { user } = useAuthContext();
    const handleMemoryChange = useContext(MemoryChangeContext);

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
            handleMemoryChange();
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
        <div className={`box-border relative shadow-md w-80 h-60 ${isCoreMemory ? "border-2 border-yellow-400" : "border border-gray-200"}`}>
            <MemoryDropDown handleDelete={handleDelete} handleEdit={handleEdit} setIsEditing={setIsEditing}/>
            <div className="relative h-2/3 overflow-hidden">
                <img className="w-full h-auto object-cover absolute left-0 top-0" src={`data:${memoryImage.contentType};base64,${memoryImage.data}`}/>
                <div className='z-40 absolute top-3 left-3'>
                    <h1 className="font-bold text-xl flex gap-2 text-white items-center">
                        {isCoreMemory ?
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
                            <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                        </svg> :
                        ""}
                        {title}
                    </h1>
                    <h2 className="font-normal text-sm text-gray-300">{formattedDate}</h2>
                </div>
                <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>
            <p className="px-3 py-3 font-normal text-sm text-black mt-auto">{description}</p>
        </div>
    )
}

export default Memory;