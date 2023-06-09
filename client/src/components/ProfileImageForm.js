import React, { useState } from "react";
import { useAuthContext, useAuthcontext } from "../hooks/useAuthContext";

function ProfileImageForm() {
    const [selectedFile, setSelectedFile] = useState(null);
    const { user } = useAuthContext();

    const handleFileUpload = () => {
        const formData = new FormData();
        formData.append('image', selectedFile);

        fetch("http://localhost:5000/user/profile/image", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${user.token}`
            },
            body: formData
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        <div>
            <input type="file" onChange={(e) => { setSelectedFile(e.target.files[0]) }} />
            <button onClick={handleFileUpload}>Upload</button>
        </div>
    )
}

export default ProfileImageForm;