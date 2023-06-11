import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useEffect } from "react";

function ProfileHandleForm({ displayInformationBox }) {
    const { user } = useAuthContext();
    const [handleData, setHandleData] = useState("");

    const getUserHandle = () => {
        fetch("http://localhost:5000/user/profile/handle", {
            method: "GET",
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
                setHandleData(data.data);
            }
        })
        .catch((error) => {
            console.log(error);
            displayInformationBox(error.message, "error");
        })
    }

    useEffect(() => {
        getUserHandle();
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:5000/user/profile/handle?newHandle=${handleData}`, {
            method: "PUT",
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
                // Get updated user handle to update input
                getUserHandle();
            }
        })
        .catch((error) => {
            displayInformationBox(error.message, "error");
        })
    }

    return (
        <div>
            <h1>Account Information</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="handle">Handle</label>
                <input className="bg-gray-50 border border-gray-400 rounded-sm" id="handle" type="text" value={handleData} onChange={(e) => { setHandleData(e.target.value) }} />
                <button type="submit" className="bg-blue-600 text-white">Submit</button>
            </form>
        </div>
    )
}

export default ProfileHandleForm;