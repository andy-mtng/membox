import Navbar from "../components/Navbar";
import PersonStockImage from "../assets/person-stock-image.jpg";
import MemboxSnapshot from "../images/membox_snapshot.PNG";

function LandingPage() {
    return (
        <div>
            <Navbar />
            <div className="px-16 flex overflow-hidden gap-8 items-center">
                <div className="w-1/3 flex-none">
                    <h1 className="text-5xl font-extrabold">Your Memory Hub, Your Story</h1>
                    <p className="text-md mt-4">Membox is the go-to web app for storing and organizing your cherished memories, making them easily accessible whenever you want to relive those special moments.</p>
                    <hr className="w-20 mt-4 border-2"></hr>
                    <div className="mt-4 flex items-center">
                        <img src={PersonStockImage} className="w-12 h-12 object-cover rounded-full"></img>
                        <div className="ml-2">
                            <h2 className="font-medium text-md text-gray-500">"Changed the way I store memories."</h2>
                            <h3 className="text-gray-500 text-sm">John Doe</h3>
                        </div>
                    </div>
                </div>
                <img className="w-full h-auto border-2 border-gray-200 rounded-sm" src={MemboxSnapshot} alt="Product snapshot"/>
            </div>
        </div>
    )
}

export default LandingPage;