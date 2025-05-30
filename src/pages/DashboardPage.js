import { useState, useEffect, useCallback } from 'react';
import Task from '../models/task'
import '../styles/Dashboard.css';
import mascot from '../assets/bubble.png';

const dbName = 'ToDoListDB';
const storeName = 'taskStore';


const DashboardPage = () => {
    const [tasks, setTasks] = useState([]);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [todayTasks, setTodayTasks] = useState([]);
    const [reschedulingTaskId, setReschedulingTaskId] = useState(null);
    const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });


    const openDB = useCallback(() => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = () => reject('DB error');
        });
    }, []);

    const loadTasks = useCallback(async () => {
        const db = await openDB();
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
            const rawTasks = request.result;
            const allTasks = rawTasks.map((t) => Object.assign(new Task(), t));
            setTasks(allTasks);

            // getting overdue tasks
            const now = new Date();
            const overdue = allTasks.filter((task) => task.isOverdue(now));
            setOverdueTasks(overdue);

            // getting todays tasks
            const todayStr = new Date().toLocaleDateString('en-CA')
            const todayOnly = allTasks.filter(
                (task) => task.date === todayStr && task.category !== 'unscheduled' && !task.completed
            ).sort((a, b) => a.time.localeCompare(b.time));
            setTodayTasks(todayOnly);

        };

        request.onerror = () => console.error('Failed to load tasks');
    }, [openDB]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);


    // reschedule a task
    const handleRescheduleTask = (task) => {
        setReschedulingTaskId(task.id);
        setRescheduleData({ date: task.date || '', time: task.time || '' });
    }

    // mark task completed
    const handleCompleteTask = async (id) => {
        const task = tasks.find((t) => t.id === id);
        const hydratedTask = Object.setPrototypeOf(task, Task.prototype);
        hydratedTask.markCompleted();
        await updateTaskInDB(task);
    };

    //save task
    const handleSaveReschedule = async () => {
        const taskToUpdate = tasks.find(t => t.id === reschedulingTaskId);
        const updatedTask = { ...taskToUpdate, ...rescheduleData };

        await updateTaskInDB(updatedTask);
        setReschedulingTaskId(null);
        loadTasks();
    };

    //update task backend
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


    return (
        <div className='dashboard-wrapper'>
            {/* daily */}
            <div className='daily-container'>
                <h2>DAILY SCHEDULE</h2>
                <div className="daily-scroll">
                    {todayTasks.length === 0 ? (
                        <p>No tasks for today, to add tasks use the to do list page</p>
                    ) : (
                        todayTasks.map((task) => (
                            < div className='taskD' style={{ backgroundColor: task.colour }} key={task.id} >
                                <h3>{task.title}</h3>
                                <h4>{task.date} | {task.time} | {
                                    (() => {
                                        const value = parseFloat(task.duration);
                                        if (!value) return '';
                                        const hours = Math.floor(value);
                                        const minutes = value % 1 !== 0 ? 30 : 0;
                                        return `${hours > 0 ? `${hours}h` : ''}${minutes > 0 ? ` ${minutes}m` : ''}`.trim();
                                    })()
                                }</h4>
                                <h5>{task.category}</h5>
                                <h4>Sub-tasks:</h4>
                                <p>{task.subtasks}</p>
                                <button className='action-btn' onClick={() => handleCompleteTask(task.id)}>Completed</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* overdue */}
            <div className='overdue-container'>
                <h2>OVERDUE</h2>
                <div className="overdue-scroll">
                    {overdueTasks.length === 0 ? (
                        <p>No overdue tasks</p>
                    ) : (
                        overdueTasks.map((task) => (
                            <div className='taskD' style={{ backgroundColor: task.colour }} key={task.id}>
                                <h3>{task.title}</h3>
                                {reschedulingTaskId === task.id ? (
                                    <div>
                                        <div className='reschedule-form'>
                                            <input
                                                type="date"
                                                value={rescheduleData.date}
                                                onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                            />
                                            <input
                                                type="time"
                                                value={rescheduleData.time}
                                                onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                            />
                                            <h4> | {
                                            (() => {
                                                const value = parseFloat(task.duration);
                                                if (!value) return '';
                                                const hours = Math.floor(value);
                                                const minutes = value % 1 !== 0 ? 30 : 0;
                                                return `${hours > 0 ? `${hours}h` : ''}${minutes > 0 ? ` ${minutes}m` : ''}`.trim();
                                            })()
                                        }</h4>
                                        </div>
                                        <button className='action-btn' onClick={handleSaveReschedule}>Save</button>
                                        <button className='action-btn' onClick={() => setReschedulingTaskId(null)}>Cancel</button>
                                        
                                    </div>
                                ) : (
                                    <h4>
                                        {task.date} | {task.time} | {
                                            (() => {
                                                const value = parseFloat(task.duration);
                                                if (!value) return '';
                                                const hours = Math.floor(value);
                                                const minutes = value % 1 !== 0 ? 30 : 0;
                                                return `${hours > 0 ? `${hours}h` : ''}${minutes > 0 ? ` ${minutes}m` : ''}`.trim();
                                            })()
                                        }
                                    </h4>
                                )}

                                <h5>{task.category}</h5>
                                <h4>Sub-tasks:</h4>
                                <p>{task.subtasks}</p>
                                <button className='action-btn' onClick={() => handleRescheduleTask(task)}>Reschedule</button>
                                {/* {reschedulingTaskId === task.id && (
                                    <div>
                                        <div className='reschedule-form'>
                                            <input
                                                type="date"
                                                value={rescheduleData.date}
                                                onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                            />
                                            <input
                                                type="time"
                                                value={rescheduleData.time}
                                                onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                            />
                                        </div>
                                        <button className='action-btn' onClick={handleSaveReschedule}>Save</button>
                                        <button className='action-btn' onClick={() => setReschedulingTaskId(null)}>Cancel</button>
                                    </div>
                                )} */}
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* mascot and speech bubble section */}
            <div className='mascot-wrapperD'>
                <div className="mascot-speechD">
                    <sub> Reschedule overdue tasks and focus on today!</sub>
                </div>
                <div className="mascot-containerD">
                    <img src={mascot} alt="mascot" />
                </div>

            </div>
        </div >
    );
}
export default DashboardPage;