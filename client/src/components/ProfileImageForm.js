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
            return response.json();
        })
        .then((data) => {
            if (data.type === "error") {
                throw new Error(data.error);
            }

            if (data.type === "success") { 
                onImageUpload();
                setSelectedFile(null);
                displayInformationBox(data.message, "success");
            }
        })
        .catch((error) => {
            displayInformationBox(error.message, "error");
        });
    }

    const handleFileSelect = async (e) => {
        const file = e.target.files[0]

        if (file) {
            setSelectedFile(file);
        }
    }

    useEffect(() => {
        // Ensures handleFileUpload() only runs when there is a file selected (i.e. user wants to upload a photo)
        // Without this handleFileUpload() runs everytime on page refresh incorrectly
        if (selectedFile) {
            handleFileUpload();
        }
    }, [selectedFile]);

    return (
        <div>
            <input className="bg-gray-100" type="file" onChange={handleFileSelect} />
        </div>
    )
}

export default ProfileImageForm;