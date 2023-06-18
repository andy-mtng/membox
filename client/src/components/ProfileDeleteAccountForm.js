import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

function ProfileDeleteAccountForm({ displayInformationBox }) {
    const { user } = useAuthContext();
    const { logout } = useLogout();
    
    const deleteAccount = () => {
        fetch("http://localhost:5000/user", {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
        .then((response) =>{
            if (response.ok) {
                logout();
                return response.json();
            }
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
            displayInformationBox(error.error, "error");
        })
    }

    return (
        <div>
            <h1 className="mb-2">Deleting your account is permanent. This action cannot be undone.</h1>
            <button onClick={deleteAccount} className="bg-red-700 border border-red-600 text-white px-3 py-1 rounded-md">Delete Account</button>
        </div>
    )
}

export default ProfileDeleteAccountForm;