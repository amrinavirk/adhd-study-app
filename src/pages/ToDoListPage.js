import { useState, useEffect, useCallback } from 'react';
import Task from '../models/task';
import '../styles/ToDoList.css';

const dbName = 'ToDoListDB';
const storeName = 'taskStore';

const ToDoListPage = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        subtasks: '',
        category: 'unscheduled',
        date: '',
        time: '',
        duration: '',
        completed: false,
        completedAt: ''
    });

    const [editingIndex, setEditingIndex] = useState(null);
    const [taskError, setTaskError] = useState('');

    const unscheduledTasks = tasks.filter((task) => task.category === 'unscheduled');
    const [filterCategories, setFilterCategories] = useState(['category1', 'category2', 'category3', 'category4', 'category5', 'category6']);
    const filteredTasks = tasks.filter((task) => filterCategories.includes(task.category) && !task.completed)
        .sort((a, b) => {
            const dateTimeA = new Date(`${a.date}T${a.time}`);
            const dateTimeB = new Date(`${b.date}T${b.time}`);
            return dateTimeA - dateTimeB;
        });

    const [schedulingTaskId, setSchedulingTaskId] = useState(null);
    const [scheduleData, setScheduleData] = useState({ date: '', time: '', category: '' });

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [inlineEditData, setInlineEditData] = useState({});


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
        if ((newTask.category !== 'unscheduled' && newTask.title && newTask.subtasks && newTask.date && newTask.time && newTask.duration)
            || (newTask.category === 'unscheduled' && newTask.title && newTask.subtasks)) {
            const taskWithId = new Task(
                null,
                newTask.title,
                newTask.subtasks,
                newTask.category,
                newTask.date,
                newTask.time,
                newTask.duration,
                newTask.completed,
                newTask.completedAt
            );
            addTaskToDB(taskWithId);
            setTasks([...tasks, taskWithId]);
            setNewTask({
                title: '',
                subtasks: '',
                category: 'unscheduled',
                date: '',
                time: '',
                duration: '',
                completed: false,
                completedAt: '',
            });
            setEditingIndex(null);
            setTaskError('')
        }
        else {
            setTaskError('please complete all required fields')

        }
    };

    // mark task completed
    const handleCompleteTask = async (id) => {
        const task = tasks.find((t) => t.id === id);
        const hydratedTask = Object.setPrototypeOf(task, Task.prototype);
        hydratedTask.markCompleted();
        await updateTaskInDB(task);
    };


    //save task 
    const handleInlineSave = async (taskId) => {
        const updatedTask = {
            ...tasks.find(t => t.id === taskId),
            ...inlineEditData
        };
        await updateTaskInDB(updatedTask);
        setEditingTaskId(null);
        setInlineEditData({});
    };




    //delete Task frontend
    const handleDeleteTask = (index) => {
        deleteTaskFromDB(index);
    };


    const handleScheduleTask = (taskId) => {
        setSchedulingTaskId(taskId);
        setScheduleData({ category: '', time: '', date: '', duration: '' });
    };

    const handleSaveSchedule = async () => {
        const taskToUpdate = tasks.find(t => t.id === schedulingTaskId);
        const updatedTask = { ...taskToUpdate, ...scheduleData };

        await updateTaskInDB(updatedTask);
        setSchedulingTaskId(null);
        setScheduleData({ category: '', time: '', date: '', duration: '' });
        loadTasks();
    };



    //cancel adding/editing and clear forms
    const handleCancelTask = () => {
        setNewTask({
            title: '',
            subtasks: '',
            category: 'unscheduled',
            date: '',
            time: '',
            duration: '',
            completed: false,
        });
        setEditingIndex(null);
        setTaskError('')
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

            {/* add task section */}
            <div>
                <label>
                    TITLE
                    <input name="title" value={newTask.title} onChange={handleChange} />
                </label>
                <label htmlFor="category">CATEGORY</label>
                <select name="category" value={newTask.category} onChange={handleChange}>
                    <option value="unscheduled">UNSCHEDULED</option>
                    <option value="category1">CATEGORY1</option>
                    <option value="category2">CATEGORY2</option>
                    <option value="category3">CATEGORY3</option>
                    <option value="category4">CATEGORY4</option>
                    <option value="category5">CATEGORY5</option>
                    <option value="category6">CATEGORY6</option>
                </select>
                <label>
                    SUBTASKS
                    <textarea name="subtasks" value={newTask.subtasks} onChange={handleChange} />
                </label>
                <label>
                    DATE
                    <input name="date" type="date" value={newTask.date} onChange={handleChange} disabled={newTask.category === 'unscheduled'} />
                </label>
                <label>
                    TIME
                    <input name="time" type="time" step="1800" value={newTask.time} onChange={handleChange} disabled={newTask.category === 'unscheduled'} />
                </label>
                <label htmlFor="duration">DURATION</label>
                <select name="duration" value={newTask.duration} onChange={handleChange} disabled={newTask.category === 'unscheduled'}>
                    <option value=""></option>
                    {[...Array(10)].map((_, i) => {
                        const value = (i + 1) * 0.5;
                        const hours = Math.floor(value);
                        const minutes = value % 1 !== 0 ? 30 : 0;
                        const label = `${hours > 0 ? `${hours}h` : ''}${minutes > 0 ? ` ${minutes}m` : ''}`.trim();
                        return (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        );
                    })}
                </select>
                <button onClick={editingIndex === null ? handleAddTask : handleInlineSave}>
                    {editingIndex === null ? 'ADD TASK' : 'SAVE TASK'}
                </button>
                <button onClick={handleCancelTask}>CANCEL</button> { }
                <p>{taskError}</p>
            </div>
            {/* main task filter selection */}
            <div>
                <legend>FILTER</legend>
                {[1, 2, 3, 4, 5, 6].map((num) => {
                    const cat = `category${num}`;
                    return (
                        <label key={cat}>
                            <input
                                type="checkbox"
                                checked={filterCategories.includes(cat)}
                                onChange={() => {
                                    setFilterCategories((prev) =>
                                        prev.includes(cat)
                                            ? prev.filter((c) => c !== cat)
                                            : [...prev, cat]
                                    );
                                }}
                            />
                            {cat}
                        </label>
                    );
                })}
            </div>

            {/* main task section */}
            <div>
                <h2>TASKS</h2>
                <div className="scrollcontainer">
                    {filteredTasks.map((task) => (
                        <div key={task.id}>
                            {editingTaskId === task.id ? (
                                <>
                                    <input
                                        name="title"
                                        value={inlineEditData.title}
                                        onChange={(e) => setInlineEditData({ ...inlineEditData, title: e.target.value })}
                                    />
                                    <textarea
                                        name="subtasks"
                                        value={inlineEditData.subtasks}
                                        onChange={(e) => setInlineEditData({ ...inlineEditData, subtasks: e.target.value })}
                                    />
                                    <input
                                        type="date"
                                        name="date"
                                        value={inlineEditData.date}
                                        onChange={(e) => setInlineEditData({ ...inlineEditData, date: e.target.value })}
                                    />
                                    <input
                                        type="time"
                                        name="time"
                                        value={inlineEditData.time}
                                        onChange={(e) => setInlineEditData({ ...inlineEditData, time: e.target.value })}
                                    />
                                    <select
                                        name="duration"
                                        value={inlineEditData.duration}
                                        onChange={(e) => setInlineEditData({ ...inlineEditData, duration: e.target.value })}
                                    >
                                        <option value=""></option>
                                        {[...Array(10)].map((_, i) => {
                                            const value = (i + 1) * 0.5;
                                            const hours = Math.floor(value);
                                            const minutes = value % 1 !== 0 ? 30 : 0;
                                            const label = `${hours ? `${hours}h` : ''}${minutes ? ` ${minutes}m` : ''}`.trim();
                                            return <option key={value} value={value}>{label}</option>;
                                        })}
                                    </select>
                                    <button onClick={() => handleInlineSave(task.id)}>SAVE</button>
                                    <button onClick={() => setEditingTaskId(null)}>CANCEL</button>
                                </>
                            ) : (
                                <>
                                    <h3>{task.title}</h3>
                                    <h4>CATEGORY: {task.category}</h4>
                                    <p>SUBTASKS: {task.subtasks}</p>
                                    <p>DATE: {task.date}</p>
                                    <p>TIME: {task.time}</p>
                                    <p>DURATION: {
                                        (() => {
                                            const value = parseFloat(task.duration);
                                            if (!value) return '';
                                            const hours = Math.floor(value);
                                            const minutes = value % 1 !== 0 ? 30 : 0;
                                            return `${hours ? `${hours}h` : ''}${minutes ? ` ${minutes}m` : ''}`.trim();
                                        })()
                                    }</p>
                                    <button onClick={() => handleCompleteTask(task.id)}>MARK COMPLETED</button>
                                    <button onClick={() => {
                                        setEditingTaskId(task.id);
                                        setInlineEditData({
                                            title: task.title,
                                            subtasks: task.subtasks,
                                            date: task.date,
                                            time: task.time,
                                            duration: task.duration
                                        });
                                    }}>EDIT</button>
                                    <button onClick={() => handleDeleteTask(task.id)}>DELETE</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>


            {/* unscheduled tasks section */}
            <h2>UNSCHEDULED</h2>
            <div className='scrollcontainer'>
                {unscheduledTasks.map((task) => (
                    <div key={task.id}>
                        {editingTaskId === task.id ? (
                            <>
                                <input
                                    name="title"
                                    value={inlineEditData.title}
                                    onChange={(e) =>
                                        setInlineEditData({ ...inlineEditData, title: e.target.value })
                                    }
                                />
                                <textarea
                                    name="subtasks"
                                    value={inlineEditData.subtasks}
                                    onChange={(e) =>
                                        setInlineEditData({ ...inlineEditData, subtasks: e.target.value })
                                    }
                                />
                                <button onClick={() => handleInlineSave(task.id)}>SAVE</button>
                                <button onClick={() => setEditingTaskId(null)}>CANCEL</button>
                            </>
                        ) : (
                            <>
                                <h3>{task.title}</h3>
                                <p>SUBTASKS: {task.subtasks}</p>

                                {/* schedule button */}
                                <button
                                    onClick={() => {
                                        handleScheduleTask(task.id);
                                        setScheduleData({ category: '', time: '', date: '', duration: '' });
                                    }}
                                    disabled={editingTaskId === task.id}
                                >SCHEDULE</button>

                                {/* form to schedule, appears in schedule mode */}
                                {schedulingTaskId === task.id && (
                                    <div className="schedule-form">
                                        <select
                                            value={scheduleData.category}
                                            onChange={(e) =>
                                                setScheduleData({ ...scheduleData, category: e.target.value })
                                            }
                                        >
                                            <option value="">SELECT CATEGORY</option>
                                            <option value="category1">CATEGORY1</option>
                                            <option value="category2">CATEGORY2</option>
                                            <option value="category3">CATEGORY3</option>
                                            <option value="category4">CATEGORY4</option>
                                            <option value="category5">CATEGORY5</option>
                                            <option value="category6">CATEGORY6</option>
                                        </select>
                                        <input
                                            type="date"
                                            value={scheduleData.date}
                                            onChange={(e) =>
                                                setScheduleData({ ...scheduleData, date: e.target.value })
                                            }
                                        />
                                        <input
                                            type="time"
                                            value={scheduleData.time}
                                            onChange={(e) =>
                                                setScheduleData({ ...scheduleData, time: e.target.value })
                                            }
                                        />
                                        <select
                                            value={scheduleData.duration}
                                            onChange={(e) =>
                                                setScheduleData({ ...scheduleData, duration: e.target.value })
                                            }
                                        >
                                            <option value=""></option>
                                            {[...Array(10)].map((_, i) => {
                                                const value = (i + 1) * 0.5;
                                                const hours = Math.floor(value);
                                                const minutes = value % 1 !== 0 ? 30 : 0;
                                                const label = `${hours ? `${hours}h` : ''}${minutes ? ` ${minutes}m` : ''}`.trim();
                                                return <option key={value} value={value}>{label}</option>;
                                            })}
                                        </select>
                                        <button
                                            onClick={handleSaveSchedule}
                                            disabled={
                                                !scheduleData.date ||
                                                !scheduleData.time ||
                                                !scheduleData.category ||
                                                !scheduleData.duration
                                            }
                                        >SAVE</button>
                                        <button onClick={() => setSchedulingTaskId(null)}>CANCEL</button>
                                    </div>
                                )}

                                {/* edit and delete disappear when in edit mode */}
                                <button
                                    onClick={() => {
                                        setEditingTaskId(task.id);
                                        setInlineEditData({
                                            title: task.title,
                                            subtasks: task.subtasks,
                                            date: task.date,
                                            time: task.time,
                                            duration: task.duration,
                                        });
                                    }}>EDIT</button>
                                <button onClick={() => handleDeleteTask(task.id)} >DELETE</button>
                            </>
                        )}
                    </div>
                ))}

            </div>
        </div>
    )
}

export default ToDoListPage;