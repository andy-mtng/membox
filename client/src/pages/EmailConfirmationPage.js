import { Link } from "react-router-dom";

function EmailConfirmationPage() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="bg-white w-1/2 h-1/3 rounded-sm shadow-md flex justify-center items-center flex-col">
                <h1 className="font-bold text-2xl">You have succesfully verified your email!</h1>
                <p>Please <Link to="/login" className="text-blue-500">login</Link> to continue using Membox.</p>
            </div>
        </div>
    )
}

export default EmailConfirmationPage;