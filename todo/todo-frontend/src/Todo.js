import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000";
    
    const handleSubmit = () => {
        setError("");
        if (title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify({title, description})
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, {title, description}]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully");
                    setTimeout(() => setMessage(""), 3000);
                } else {
                    setError("Unable to create Todo item");
                }
            }).catch(() => setError("Unable to create Todo item"));
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos")
        .then((res) => res.json())
        .then((res) => setTodos(res));
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify({title: editTitle, description: editDescription})
            }).then((res) => {
                if (res.ok) {
                    const updatedTodos = todos.map((item) => {
                        if (item._id === editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    });
                    setTodos(updatedTodos);
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item updated successfully");
                    setTimeout(() => setMessage(""), 3000);
                    setEditId(-1);
                } else {
                    setError("Unable to update Todo item");
                }
            }).catch(() => setError("Unable to update Todo item"));
        }
    };

    const handleEditCancel = () => {
        setEditId(-1);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure want to delete?')) {
            fetch(apiUrl + '/todos/' + id, { method: "DELETE" })
            .then(() => setTodos(todos.filter((item) => item._id !== id)));
        }
    };

    return (
        <div className="container my-5">
            <div className="row p-3 bg-dark text-light text-center mb-4">
                <h1 className="display-5">ToDo Project with MERN Stack</h1>
            </div>

            <div className="row mb-4">
                <div className="col-lg-6 mx-auto">
                    <h3 className="text-primary mb-3">Add New Task</h3>
                    {message && <p className="alert alert-success">{message}</p>}
                    <div className="input-group mb-3">
                        <input 
                            placeholder="Title" 
                            onChange={(e) => setTitle(e.target.value)} 
                            value={title} 
                            className="form-control" 
                            type="text" 
                        />
                    </div>
                    <div className="input-group mb-3">
                        <input 
                            placeholder="Description" 
                            onChange={(e) => setDescription(e.target.value)} 
                            value={description} 
                            className="form-control" 
                            type="text" 
                        />
                    </div>
                    <button className="btn btn-primary w-100" onClick={handleSubmit}>Add Task</button>
                    {error && <p className="text-danger mt-3">{error}</p>}
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8 mx-auto">
                    <h3 className="text-info mb-3">Your Tasks</h3>
                    <ul className="list-group">
                        {todos.map((item) => (
                            <li key={item._id} className="list-group-item bg-light my-2 d-flex justify-content-between align-items-center">
                                <div className="me-2">
                                    {editId === item._id ? (
                                        // <div className="input-group mb-3">
                                        //     <input
                                        //         placeholder="Title"
                                        //         onChange={(e) => setEditTitle(e.target.value)}
                                        //         value={editTitle}
                                        //         className="form-control"
                                        //         type="text"
                                        //     />
                                        //     <input
                                        //         placeholder="Description"
                                        //         onChange={(e) => setEditDescription(e.target.value)}
                                        //         value={editDescription}
                                        //         className="form-control"
                                        //         type="text"
                                        //     />
                                        // </div>
                                        <div className="input-group mb-3">
                                            <textarea
                                                placeholder="Title"
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                value={editTitle}
                                                className="form-control"
                                            />
                                            <textarea
                                                placeholder="Description"
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                value={editDescription}
                                                className="form-control"
                                            />
                                        </div>

                                    ) : (
                                        <>
                                            <h5>{item.title}</h5>
                                            <p>{item.description}</p>
                                        </>
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    {editId === -1 ? (
                                        <>
                                            <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-success" onClick={handleUpdate}>Update</button>
                                            <button className="btn btn-secondary" onClick={handleEditCancel}>Cancel</button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
