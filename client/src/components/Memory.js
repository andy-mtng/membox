import { format } from "date-fns";
import moment from 'moment';
import MemoryDropDown from "./MemoryDropDown";

function Memory({ title, description, date, isCoreMemory }) {
    const momentDate = moment(date);
    const formattedDate = momentDate.format('MMMM DD, YYYY');

    return (
        <div className="flex flex-col border border-black w-96">
            <MemoryDropDown />
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