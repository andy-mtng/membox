import Sidebar from "../components/Sidebar";
import ProfileImageForm from "../components/ProfileImageForm";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import InformationBox from "../components/InformationBox";
import DefaultProfileImage from "../assets/default-profile.png"

function ProfilePage() {
    const [showInformationBox, setShowInformationBox] = useState(false);
    const [informationMessage, setInformationMessage] = useState('');
    const [informationType, setInformationType] = useState('');
    const [profileImageData, setProfileImageData] = useState("");
    const { user } = useAuthContext();

    const onImageUpload = (imageData) => {
        getProfileImage();
    }

    const getProfileImage = () => {
        fetch("http://localhost:5000/user/profile/image", {
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
                if (Object.keys(data.profileImage.data).length === 0) {
                    setProfileImageData(DefaultProfileImage);
                } else {
                    const imageData = data.profileImage.data;
                    const contentType = data.profileImage.contentType;
                    setProfileImageData(`data:${contentType};base64,${imageData}`);
                }
            }
        })
        .catch((error) => {
            console.log(error);
            if (error) {
                displayInformationBox(error.message, "error");
            }
        })
    } 

    useEffect(() => {
        getProfileImage();
    }, []);

    const displayInformationBox = (message, type) => {
        setInformationMessage(message);
        setInformationType(type);
        setShowInformationBox(true);

        setTimeout(() => {
            setShowInformationBox(false);
        }, 5000);
    }

    const removeProfileImage = () => {
        setProfileImageData(DefaultProfileImage);
        fetch("http://localhost:5000/user/profile/image", {
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
        })
        .catch((error) => {
            console.log(error);
            if (error) {
                displayInformationBox(error.message, "error");
            }
        })
    }

    return (
        <div>
            <Sidebar />
            {showInformationBox && <InformationBox message={informationMessage} type={informationType}/>}
            <div className="ml-56">
                <h1 className="pt-8 text-2xl font-bold">Profile</h1>
                <img className="rounded-full h-40 w-40" src={profileImageData} alt="Image" />
                <ProfileImageForm onImageUpload={onImageUpload} displayInformationBox={displayInformationBox}/>
                <button onClick={removeProfileImage} className="bg-gray-400">Remove Profile Image</button>
            </div>
        </div>
    )
}

export default ProfilePage;