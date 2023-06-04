import { Link } from "react-router-dom";
import { ReactComponent as Logo } from '../assets/membox-logo2.svg';
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

function Navbar() {
    const { user } = useAuthContext();
    const { logout } = useLogout();

    const handleClick = () => {
        logout();
    }

    return (
        <nav className="flex justify-between px-16 py-6 bg-green-100">
            <Link to="/" className="flex gap-2 items-center relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                </svg>
                <h1 className="font-semibold text-2xl relative bottom-0.5">Membox</h1>
            </Link>
            { !user ? <Link to="/login" className="font-medium">Login</Link> : <button className="font-medium" onClick={handleClick}>Logout</button> }
        </nav>
    )
}

export default Navbar;