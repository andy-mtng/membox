import { format } from "date-fns";
import moment from 'moment';
import MemoryDropDown from "./MemoryDropDown";
import { useAuthContext } from "../hooks/useAuthContext";

function Memory({ onMemoryChange, id, title, description, date, isCoreMemory, displayInformationBox }) {
    const momentDate = moment(date);
    const formattedDate = momentDate.format('MMMM DD, YYYY');
    const { user } = useAuthContext();

    const handleDelete = () => {
        fetch(`http://localhost:5000/memories?delId=${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.type === "error") {
                throw new Error(data.error);
            }

            if (data.type === "success") {
                displayInformationBox(data.message, "success");
            }

            console.log(data);
        })
        .catch((error) => {
            if (error) {
                displayInformationBox(error.message, "error");
            }
        });
        onMemoryChange();
    }

    return (
        <div className="flex flex-col border border-black w-96">
            <MemoryDropDown handleDelete={handleDelete}/>
            <div>
                <h1>Title: {title}</h1>
                <p>Description: {description}</p>
                <p>isCoreMemory: {isCoreMemory ? "true" : "false"}</p>
                <h2>Date: {formattedDate}</h2>
            </div>
        </div>
    )
}

export default Memory;