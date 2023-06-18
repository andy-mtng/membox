import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function ProfileImageForm({ onImageUpload, removeProfileImage, displayInformationBox }) {
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
            <div className="mb-2">
                <label className="bg-black" htmlFor="image-input">
                    <div className="text-white bg-purple-600 border border-purple-700 rounded-md px-2 py-1 cursor-pointer">
                        Change Picture
                    </div>
                </label>
                <input id="image-input" className="hidden bg-gray-100 border border-gray-400" type="file" onChange={handleFileSelect} />
            </div>
            <button onClick={removeProfileImage} className="text-black border border-gray-400 rounded-md px-2 py-1">Remove Picture</button>
        </div>
    )
}

export default ProfileImageForm;