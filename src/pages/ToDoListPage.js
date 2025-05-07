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

const dbName = 'ToDoListDB';
const storeName = 'taskStore';

const ToDoListPage = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        subtasks: '',
        category: '',
        date: '',
        time: '',
        duration: '',
        completed: false,
    });

    const [editingIndex, setEditingIndex] = useState(null);

    const openDB = useCallback(() => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject('error');
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
        const { name, value } = e.target;
        setNewTask((prev) => ({ ...prev, [name]: value }));
    };

    // add task frontend
    const handleAddTask = () => {
        const taskWithId = new Task(
            null,
            newTask.title,
            newTask.subtasks,
            newTask.category,
            newTask.date,
            newTask.time,
            newTask.duration,
            newTask.completed
        );
        addTaskToDB(taskWithId);
        setTasks([...tasks, taskWithId]);
        setNewTask({
            title: '',
            subtasks: '',
            category: '',
            date: '',
            time: '',
            duration: '',
            completed: false,
        });
        setEditingIndex(null);
    };

    // edit task frontend
    const handleEditTask = (id) => {
        const task = tasks.find((t) => t.id === id);
        setNewTask({ ...task });
        setEditingIndex(id);
    };

    //save task frontend
    const handleSaveTask = () => {
        updateTaskInDB({ ...newTask, id: editingIndex });
        setNewTask({
            title: '',
            subtasks: '',
            category: '',
            date: '',
            time: '',
            duration: '',
            completed: false,
        });
        setEditingIndex(null);
    };


    //delete Task frontend
    const handleDeleteTask = (index) => {
        deleteTaskFromDB(index);
    };


    //cancel adding/editing and clear forms
    const handleCancelTask = () => {
        setNewTask({
            title: '',
            subtasks: '',
            category: '',
            date: '',
            time: '',
            duration: '',
            completed: false,
        });
        setEditingIndex(null);
    };

    //add task backend
    const addTaskToDB = async (task) => {
        const db = await openDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const request = transaction.objectStore(storeName).add(task);

        request.onsuccess = () => {
            loadTasks();
        };

        request.onerror = () => {
            console.error('error');
        };
    };

    //edit task backend
    const updateTaskInDB = async (task) => {
        const db = await openDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const request = transaction.objectStore(storeName).put(task);

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
        const request = transaction.objectStore(storeName).delete(index);

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

            {/* add task section */}
            <div>
                <label>
                    TITLE
                    <input name="title" value={newTask.title} onChange={handleChange} />
                </label>
                <label>
                    CATEGORY
                    <input name="category" value={newTask.category} onChange={handleChange} />
                </label><label>
                    SUBTASKS
                    <textarea name="subtasks" value={newTask.subtasks} onChange={handleChange} />
                </label>
                <label>
                    DATE
                    <input name="date" type="date" value={newTask.date} onChange={handleChange} />
                </label>
                <label>
                    TIME
                    <input name="time" type="time" value={newTask.time} onChange={handleChange} />
                </label>
                <label>
                    DURATION
                    <input name="duration" value={newTask.duration} onChange={handleChange} />
                </label>
                <button onClick={editingIndex === null ? handleAddTask : handleSaveTask}>
                    {editingIndex === null ? 'Add Note' : 'Save Note'}</button>
                <button onClick={handleCancelTask}>Cancel</button> { }
            </div>


            {/* main task section */}
            <div>
                <h2>TASKS</h2>
                {tasks.map((task) => (
                    <div key={task.id} style={{ marginBottom: '10px' }}>
                        <h3>{task.title}</h3>
                        <h4>CATEGORY:{task.category}</h4>
                        <p>SUBTASKS:{task.subtasks}</p>
                        <p>DATE:{task.date}</p>
                        <p>TIME:{task.time}</p>
                        <p>DURATION:{task.duration} hours </p>
                        <button onClick={() => handleEditTask(task.id)}>Edit</button>
                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </div>
                ))}
            </div>
            {/* main task filter selection */}


            {/* unscheduled tasks section */}


        </div>
    )
}

export default ToDoListPage;