import Sidebar from "../components/Sidebar";
import ProfileImageForm from "../components/ProfileImageForm";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import InformationBox from "../components/InformationBox";

function ProfilePage() {
    const [showInformationBox, setShowInformationBox] = useState(false);
    const [informationMessage, setInformationMessage] = useState('');
    const [informationType, setInformationType] = useState('');
    const [profileImageData, setProfileImageData] = useState("");
    const { user } = useAuthContext();

    useEffect(() => {
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
            const imageData = data.profileImage.data;
            const contentType = data.profileImage.contentType;
            setProfileImageData(`data:${contentType};base64,${imageData}`);
        })
        .catch((error) => {
            console.log(error);
            if (error) {
                displayInformationBox(error.message, "error");
            }
        })
    }, []);

    const displayInformationBox = (message, type) => {
        setInformationMessage(message);
        setInformationType(type);
        setShowInformationBox(true);

        setTimeout(() => {
            setShowInformationBox(false);
        }, 5000);
    }

    return (
        <div>
            <Sidebar />
            {showInformationBox && <InformationBox message={informationMessage} type={informationType}/>}
            <div className="ml-56">
                <h1 className="px-5 py-8 text-2xl font-bold">Profile</h1>
                <img src={profileImageData} alt="User Image" />
                <ProfileImageForm />
            </div>
        </div>
    )
}

export default ProfilePage;