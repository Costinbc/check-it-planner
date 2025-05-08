const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchTasks() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tasks`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }

    return await response.json();
}

export async function createTask(taskData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
    });

    if (!response.ok) {
        throw new Error('Failed to create task');
    }

    return await response.json();
}

export async function updateTask(taskId, updates) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
    });

    if (!response.ok) {
        throw new Error('Failed to update task');
    }

    return await response.json();
}

export async function deleteTask(taskId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete task');
    }

    return await response.json();
}