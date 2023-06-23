import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';

function ProfileHandleForm({ displayInformationBox }) {
    const { user } = useAuthContext();
    const [handleData, setHandleData] = useState("");
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    // Validation errors from the server side
    const [validationErrors, setValidationErrors] = useState([]);

    const getUserHandle = () => {
        setLoading(true);
        fetch("http://localhost:5000/user/profile/handle", {
            method: "GET",
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
                setHandleData(data.data);
            }
        })
        .catch((error) => {
            console.log(error);
            displayInformationBox(error.message, "error");
        })
        .finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        getUserHandle();
    }, [])

    const onSubmit = (formData) => {
        setLoading(true);
        fetch(`http://localhost:5000/user/profile/handle?newHandle=${formData.handle}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.validationErrors) {
                setValidationErrors(data.validationErrors);
            }

            if (data.type === "error") {
                throw new Error(data.error);
            }

            if (data.type === "success") { 
                displayInformationBox(data.message, "success");
                // Get updated user handle to update input
                getUserHandle();
            }
        })
        .catch((error) => {
            displayInformationBox(error.message, "error");
        })
        .finally(() => {
            setLoading(false);
        })
    }

    return (
        <div>
            <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor="handle">Handle</label>
                    <input 
                        className={`${errors.handle ? "border-red-500" : ""} w-1/3 px-2 py-1 bg-gray-50 border border-gray-400 rounded-sm`}
                        id="handle" 
                        disabled={loading}
                        type="text" 
                        defaultValue={handleData}
                        {...register("handle", { 
                            required: "Handle is required.",  
                            minLength: { value: 5, message: "Handle must be longer than 5 characters." },
                            maxLength: { value: 31, message: "Handle cannot be longer than 30 characters." }
                        })} />
                    <p className="text-sm text-red-600">{errors.handle?.message}</p> 
                </div> 
                {validationErrors.map((validationError, index) => {
                    return <p className="text-sm text-red-600" key={index}>{validationError.message}</p>
                })}
                <button type="submit" className="mt-5 bg-purple-600 px-4 py-1 rounded-md border border-purple-800 text-white">Submit</button>
            </form>
        </div>
    )
}

export default ProfileHandleForm;