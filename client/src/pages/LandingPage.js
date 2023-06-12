import Navbar from "../components/Navbar";
import PersonStockImage from "../assets/person-stock-image.jpg";

function LandingPage() {

    const handleClick = () => {
        fetch("http://localhost:5000/user/signup/confirmation", {
            method: "POST"
        })
        .catch(() => {
            console.log("Button clicked!");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return (
        <div>
            <Navbar />
            <div className="px-16 mt-16 w-1/2">
                <h1 className="text-5xl font-extrabold">Your Memory Hub, Your Story</h1>
                <p className="text-md mt-4">Membox is the go-to web app for storing and organizing your cherished memories, making them easily accessible whenever you want to relive those special moments.</p>
                <hr className="w-20 mt-4 border-2"></hr>
                <div className="mt-4 flex items-center">
                    <img src={PersonStockImage} className="w-12 h-12 object-cover rounded-full"></img>
                    <div className="ml-2">
                        <h2 className="font-medium text-lg text-gray-500">"Changed the way I store memories."</h2>
                        <h3 className="text-gray-500 text-md">John Doe</h3>
                    </div>
                </div>
                <button onClick={handleClick} className="bg-gray-100 px-2 py-1">Test Email Button</button>
            </div>
        </div>
    )
}

export default LandingPage;