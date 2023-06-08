import Sidebar from "../components/Sidebar";
import ProfileImageForm from "../components/ProfileImageForm";

function ProfilePage() {
    return (
        <div>
            <Sidebar />
            <div className="ml-56">
                <h1 className="px-5 py-8 text-2xl font-bold">Profile</h1>
                <ProfileImageForm />
            </div>
        </div>
    )
}

export default ProfilePage;