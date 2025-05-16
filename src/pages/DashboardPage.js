// DEV NOTES:
// page purpose - 

import React, { useState, useEffect, useCallback } from 'react';
import Task from '../models/task'

const dbName = 'ToDoListDB';
const storeName = 'taskStore';

const DashboardPage = () => {

    const [tasks, setTasks] = useState([]);
    const [overdueTasks, setOverdueTasks] = useState([]);

    const openDB = useCallback(() => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = () => reject('DB error');
        });
    }, []);

    const handleRescheduleTask = (id) => {
        console.log('test');
    }

    const loadTasks = useCallback(async () => {
        const db = await openDB();
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
            const rawTasks = request.result;
            const allTasks = rawTasks.map((t) => Object.assign(new Task(), t));
            setTasks(allTasks);

            // Filter overdue
            const now = new Date();
            const overdue = allTasks.filter((task) => task.isOverdue(now));
            setOverdueTasks(overdue);
        };

        request.onerror = () => console.error('Failed to load tasks');
    }, [openDB]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    return (
        <div>
            {/* daily */}
            <div>
                <h2>DAILY SCHEDULE</h2>
                <div className="scrollcontainer">
                    
                </div>
            </div>
            {/* overdue */}
            <div>
                <h2>OVERDUE</h2>
                <div className="scrollcontainer">
                {overdueTasks.length === 0 ? (
                        <p>No overdue tasks</p>
                    ) : (
                        overdueTasks.map((task) => (
                            <div key={task.id}>
                                <h3>{task.title}</h3>
                            <h4>CATEGORY:{task.category}</h4>
                            <p>SUBTASKS:{task.subtasks}</p>
                            <p>DATE:{task.date}</p>
                            <p>TIME:{task.time}</p>
                            <p>DURATION: {
                                (() => {
                                    const value = parseFloat(task.duration);
                                    if (!value) return '';
                                    const hours = Math.floor(value);
                                    const minutes = value % 1 !== 0 ? 30 : 0;
                                    return `${hours > 0 ? `${hours}h` : ''}${minutes > 0 ? ` ${minutes}m` : ''}`.trim();
                                })()
                            }
                            </p>
                            <button onClick={() => handleRescheduleTask(task.id)}>RESCHEDULE</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* mascot and speech bubble section */}
            <div>
                {/* insert mascot/animation */}
                <sub> Reschedule overdue tasks and focus on today!</sub>
            </div>
        </div>
    );
}
export default DashboardPage;