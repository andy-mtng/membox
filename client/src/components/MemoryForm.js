import { useState, useRef, useEffect, useContext } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MemoryChangeContext from "../context/MemoryChangeContext";
import { useForm, Controller } from 'react-hook-form';

function MemoryForm({ memoryToEdit, isEditing, displayInformationBox, setIsEditing, setIsAdding }) {
    const [title, setTitle] = useState(isEditing ? memoryToEdit.title : "");
    const [description, setDescription] = useState(isEditing ? memoryToEdit.description : "");
    const [date, setDate] = useState(isEditing ? new Date(memoryToEdit.date) : new Date());
    const [isCoreMemory, setIsCoreMemory] = useState(isEditing ? memoryToEdit.isCoreMemory : false);
    const [selectedFile, setSelectedFile] = useState(null);
    const { user } = useAuthContext();
    const formRef = useRef(null);
    const { validationErrors, setValidationErrors } = useState([]);
    const { register, control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
          title: title,
          description: description,
          date: date,
          coreMemory: isCoreMemory
        }
    });

    const handleMemoryChange = useContext(MemoryChangeContext);
 
    const onSubmit = (data) => {
        console.log("data", data)

        const formData = new FormData();
        formData.append("title", data["title"]);
        formData.append("description", data["description"]);
        formData.append("date", data["date"]);
        formData.append("isCoreMemory", data["coreMemory"]);
        formData.append("image", data["image"][0]);

        fetch(isEditing ? `http://localhost:5000/memories?editId=${memoryToEdit.id}` : "http://localhost:5000/memories", {
            method: isEditing ? "PUT" : "POST",
            headers: {
                "Authorization": `Bearer ${user.token}`,
            },
            body: formData
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.type === "error") {
                throw new Error(data.error);
            }

            if (data.validationErrors) {
                setValidationErrors(data.validationErrors);
            }

            if (data.type === "success") {
                displayInformationBox(data.message, "success");
            }

            handleMemoryChange();
        })
        .catch((error) => {
            if (error) {
                displayInformationBox(error.message, "error");
            }
        });
        if (isEditing) {
            // Close the form when the user finishes editing
            setIsEditing(false);
        } else {
            // Reset the fields of the form for the user to continue adding new memories
            resetFields();
        }
    }

    const resetFields = () => {
        setTitle("");
        setDescription("");
        setDate(new Date());
        setIsCoreMemory(false);
        setSelectedFile(null);
    }

    const handleClickOutside = (event) => {
        if (formRef.current && !formRef.current.contains(event.target)) {
            setIsAdding(false);
            setIsEditing(false);
        }
    }
    
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    return (
        <div ref={formRef} className="h-auto w-96 border-2 shadow-lg border-gray-100 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 z-50">
            <h1 className="font-xl font-bold mb-3">{isEditing ? "Edit Memory" : "Add a New Memory"}</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
                >

                {/* Title field */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor="title-input">Title</label>
                    <input
                        className={`${errors.title ? "border-red-500" : ""} bg-gray-50 rounded-sm border border-gray-300 p-1`}
                        defaultvalue={title}
                        id="title-input"
                        type="text"
                        {...register("title", {
                            required: "Title is required",
                            maxLength: { value: 20, message: "Title cannot be longer than 20 characters" }
                        })} />
                    <p className="text-sm text-red-600">{errors.title?.message}</p>
                </div>

                {/* Description field */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor="desc-input">Description</label>
                    <textarea
                    className={`${errors.description ? "border-red-500" : ""} bg-gray-50 rounded-sm border border-gray-300`}
                        id="desc-input"
                        type="text"
                        rows={6}
                        style={{ resize: 'none' }} // Set the resize property to none
                        {...register("description", {
                            maxLength: { value: 80, message: "Description cannot be longer than 80 characters" }
                        })} />
                    <p className="text-sm text-red-600">{errors.description?.message}</p>
                </div>

                {/* Image field */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor="image-input">Image</label>
                    <input 
                        id="image-input" 
                        className={`${errors.image ? "border-red-500" : ""} text-sm bg-gray-50 border border-gray-300 rounded-sm`}
                        type="file" 
                        {...register("image", {
                            required: "Image is required",
                            validate: {
                                fileType: (value) => {
                                  const allowedFileTypes = ['image/jpeg', 'image/png'];
                                  if (value && allowedFileTypes.includes(value[0]?.type)) {
                                    return true;
                                  }
                                  return 'Invalid file type';
                                }
                            }
                        })} />
                    <p className="text-sm text-red-600">{errors.image?.message}</p>
                </div>

                {/* Date field */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm">Date</h1>
                    <Controller 
                        name="date"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => 
                        <DatePicker className={`${errors.date ? "border-red-500" : ""} rounded-sm text-sm bg-gray-50 w-full border border-gray-300 p-1`}
                            selected={field.value} 
                            onChange={(ev) => {
                                field.onChange(ev);
                            }} />
                    }
                    />
                    <p className="text-sm text-red-600">{errors.date?.message}</p>
                </div>
                <div className="flex gap-2 items-center">
                    <label className="text-sm" htmlFor="coreMemoryInput">Core Memory</label>
                    <input
                        id="coreMemoryInput"
                        type="checkbox"
                        className="w-5 h-5"
                        {...register("coreMemory")}
                    />
                </div>
                {validationErrors.map((validationError, index) => {
                    return <p className="text-sm text-red-600" key={index}>{validationError.message}</p>
                })}
                <button className="bg-blue-600 py-2 rounded-sm text-white text-sm" type="submit">{isEditing ? "Save" : "Submit"}</button>
            </form>
        </div>
    )
}

export default MemoryForm;