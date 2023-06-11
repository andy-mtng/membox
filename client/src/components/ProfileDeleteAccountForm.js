function ProfileDeleteAccountForm({ displayInformationBox }) {
    const deleteAccount = () => {
        displayInformationBox("Deleted account", "success");
    }

    return (
        <div>
            <h1>Deleting your account is permanent. This action cannot be undone.</h1>
            <button onClick={deleteAccount} className="bg-red-200 border border-red-600 text-red-800 px-3 py-1 rounded-sm">Delete Account</button>
        </div>
    )
}

export default ProfileDeleteAccountForm;