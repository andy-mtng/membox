import { Link } from "react-router-dom";

function EmailConfirmationPage() {
    return (
        <div className="bg-gray-200 w-screen h-screen flex justify-center items-center">
            <div className="bg-white w-1/2 h-1/3 rounded-sm">
                <h1>You have succesfully verified your email!</h1>
                <p>Please <Link to="/login">login</Link> to continue using Membox.</p>
            </div>
        </div>
    )
}

export default EmailConfirmationPage;