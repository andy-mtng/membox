import { Link } from "react-router-dom";
import { ReactComponent as Logo } from '../assets/membox-logo2.svg';

function Navbar() {
    return (
        <nav className="flex justify-between px-16 py-6 bg-green-100">
            <Link to="/" className="flex gap-2 items-center relative">
                <Logo className="w-8 h-8 stroke-5" style={{ fill: '#eab308' }}/>
                <h1 className="font-semibold text-2xl relative bottom-0.5">Membox</h1>
            </Link>
            <Link className="flex gap-5 font-medium text-lg" to="/login">Login</Link>
        </nav>
    )
}

export default Navbar;