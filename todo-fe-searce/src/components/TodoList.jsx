import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TodoList({ setIsAuthenticated }) {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const fetchTodos = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/todos', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTodos(data);
            }
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, description })
            });

            if (response.ok) {
                setTitle('');
                setDescription('');
                fetchTodos();
            }
        } catch (error) {
            console.error('Error creating todo:', error);
        }
    };

    const handleToggleComplete = async (id, completed) => {
        try {
            const todo = todos.find(t => t.id === id);
            const response = await fetch(`http://localhost:3001/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...todo,
                    completed: !completed
                })
            });

            if (response.ok) {
                fetchTodos();
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                fetchTodos();
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Todo List</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="mb-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Todo title"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Todo
                </button>
            </form>

            <div className="space-y-4">
                {todos.map(todo => (
                    <div
                        key={todo.id}
                        className="flex items-center justify-between p-4 bg-white rounded shadow"
                    >
                        <div className="flex items-center space-x-4">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleToggleComplete(todo.id, todo.completed)}
                                className="h-4 w-4 text-blue-600"
                            />
                            <div>
                                <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                                    {todo.title}
                                </h3>
                                {todo.description && (
                                    <p className="text-gray-600 text-sm">{todo.description}</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(todo.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TodoList;