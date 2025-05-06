// DEV NOTES:
// page purpose - add detailed tasks to list, tasks automatically appear in calendar
// each task has: title, subtasks, category selection, date, time, duration, submit button
// tasks with unscheduled category have empty date, time, and duration
// tasks are used in other pages: calendar, progress tracker needs completion statistics
// tasks need multiple states: overdue, upcoming, completed
// tasks can be: deleted, edited, marked as completed (disappear from list, not deleted tho, moved to completed db for progress tracking purposed)
// upon completion -> animate + confirm to delete

// designated pop up - one task selected to pop out: show sub-tasks, category, time + duration
// in settings - adjust category names, use default for now
// tasks where the allotted time has passed flash/visual cue to prompt rescheduling/marking as complete


import React, { useState, useEffect, useCallback } from 'react';
import Task from '../models/task';

const ToDoListPage = () => {
    const dbName = 'ToDoListDB';
    const storeName = 'taskStore';
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', subTask: '' });
    const [editingIndex, setEditingIndex] = useState(null);

    const openDB = useCallback(() => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject('error');
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    }, []);

    // fetch tasks from the db
    const loadTasks = useCallback(async () => {
        const db = await openDB();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = (event) => {
            setTasks(event.target.result);
        };

        request.onerror = () => {
            console.error('error');
        };
    }, [openDB]);

    // load tasks when component is mounted
    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    // updates live changes to forms
    const handleChange = (e) => {
        const { title, value } = e.target;
        setNewTask({ ...newTask, [title]: value });
    };

    // add task frontend
    const handleAddTask = () => {
        if (newTask.title && newTask.subTask) {
            const taskWithId = {
                id: Date.now(),
                ...newTask
            };
            addTaskToDB(taskWithId);
            setTasks([...tasks, taskWithId]);
            setNewTask({ title: '', subTask: '' });
        }
    };
    // edit task frontend
    const handleEditTask = (id) => {
        const taskToEdit = tasks.find((task) => task.id === id);
        setNewTask(taskToEdit);
        setEditingIndex(id);
    };

    //save task frontend
    const handleSaveTask = () => {
        updateTaskInDB({ ...newTask, id: editingIndex });
        setNewTask({ title: '', subTask: '' });
        setEditingIndex(null);
    };


    //delete Task frontend
    const handleDeleteTask = (index) => {
        deleteTaskFromDB(index);
    };


    //cancel adding/editing and clear forms
    const handleCancel = () => {
        setNewTask({ title: '', subTask: '' });
        setEditingIndex(null);
    };

    //add task backend
    const addTaskToDB = async (task) => {
        const db = await openDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(task);

        request.onsuccess = () => {
            loadTasks();
        };

        request.onerror = () => {
            console.error('error');
        };
    };

    //edit task backend
    const updateTaskInDB = async (updatedTask) => {
        const db = await openDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(updatedTask);

        request.onsuccess = () => {
            loadTasks();
        };

        request.onerror = () => {
            console.error('error');
        };
    };


    //delete task backend
    const deleteTaskFromDB = async (index) => {
        const db = await openDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(index);

        request.onsuccess = () => {
            loadTasks();
        };

        request.onerror = () => {
            console.error('error');
        };
    };

    return (
        <div>
            <h1>TO DO LIST</h1>
            {/* main task filter selection */}

            {/* main task section */}

            {/* unscheduled tasks section */}

            {/* new task section */}
            <div>
                <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleChange}
                    placeholder="Title"
                />
                <textarea
                    name="subTask"
                    value={newTask.subTask}
                    onChange={handleChange}
                    placeholder="sub tasks"
                ></textarea>
                <button onClick={editingIndex === null ? handleAddTask : handleSaveTask}>
                    {editingIndex === null ? 'Add Task' : 'Save Task'}
                </button>
                <button onClick={handleCancel}>Cancel</button> { }
            </div>
            {/* filter colour checkboxes, main tasks section with scrollbar, unscheduled tasks with scrollbar, 
        add tasks: title, subtasks, category selection, date, time, duration, submit */}
        </div>
    )
}

export default ToDoListPage;