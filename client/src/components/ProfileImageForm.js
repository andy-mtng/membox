import React, { useState, useEffect } from "react";
import { useAuthContext, useAuthcontext } from "../hooks/useAuthContext";

function ProfileImageForm({ onImageUpload, displayInformationBox }) {
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
            console.log("Image response", response);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data.type === "error") {
                throw new Error(data.error);
            }

            if (data.type === "success") { 
                onImageUpload();
                displayInformationBox(data.message, "success");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const handleFileSelect = async (e) => {
        console.log("immediate load");
        const file = e.target.files[0]

        if (file) {
            console.log("set file");
            setSelectedFile(file);
        }
    }

    useEffect(() => {
        handleFileUpload();
    }, [selectedFile]);

    return (
        <div>
            <input className="bg-gray-100" type="file" onChange={handleFileSelect} />
            {/* <button onClick={handleFileUpload}>Upload</button> */}
        </div>
    )
}

export default ProfileImageForm;