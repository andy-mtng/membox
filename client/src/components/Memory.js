import { format } from "date-fns";

function Memory({ title, description, date }) {
    const formattedDate = format(date, 'MMMM dd, yyyy');

    return (
        <div>
            <h1>Title: {title}</h1>
            <p>Description: {description}</p>
            <h2>Date: {formattedDate}</h2>
        </div>
    )
}

export default Memory;