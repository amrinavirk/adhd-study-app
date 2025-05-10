// DEV NOTES:
// page purpose - 

import React, { useState, useEffect, useCallback } from 'react';
import Task from '../models/task'

const dbName = 'ToDoListDB';
const storeName = 'taskStore';

const CalendarPage = () => {
    const [tasks, setTasks] = useState([]);
    const today = new Date();
    const getDayName = (date) => {
        const options = { weekday: 'short' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const getDayNum = (date) => date.getDate();
    const getWeekDates = (date) => {
        const weekDates = [];
        const startOfWeek = date.getDate() - date.getDay() + 1; // Adjust to start from Monday
        for (let i = 0; i < 7; i++) {
            const day = new Date(date.setDate(startOfWeek + i));
            weekDates.push(day);
        }
        return weekDates;
    };
    const weekDates = getWeekDates(new Date(today));
    const getFormattedDate = (date) => date.toISOString().split('T')[0];

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

    const renderRows = () => {
        return Array.from({ length: 24 }, (_, hour) => {
            const hourLabel = hour.toString().padStart(2, '0');

            return (
                <tr key={hour}>
                    <th>{hourLabel}</th>
                    {weekDates.map((date, i) => {
                        const dateStr = getFormattedDate(date);
                        const hourStr = `${hour.toString().padStart(2, '0')}:00`;

                        const tasksAtThisSlot = tasks?.filter(
                            (task) => task.date === dateStr && task.time === hourStr
                        ) || [];

                        return (
                            <td key={i}>
                                {tasksAtThisSlot.map((task) => (
                                    <div key={task.id}>
                                        <strong>{task.title}</strong>
                                        <p>{task.subtasks}</p>
                                    </div>
                                ))}
                            </td>
                        );
                    })}
                </tr>
            );
        });
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>TIME</th>
                        {weekDates.map((date, index) => (
                            <th key={index}>
                                {getDayName(date)} {getDayNum(date)}
                            </th>
                        ))}
                    </tr>
                </thead>
                    <tbody className='scrollcontainer'>
                        {Array.from({ length: 24 }).map((_, index) => (
                            <tr key={index}>
                                <th>{String(index).padStart(2, '0')}</th>
                                {weekDates.map((date, dateIndex) => {
                                    const taskForTime = tasks.filter(
                                        (task) => task.date === date.toLocaleDateString() && task.time === `${String(index).padStart(2, '0')}:00`
                                    );
                                    return (
                                        <td key={dateIndex}>
                                            {taskForTime.map((task) => (
                                                <div key={task.id}>
                                                    <h4>{task.title}</h4>
                                                    <p>{task.subtasks}</p>
                                                </div>
                                            ))}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
            </table>
        </div>
    );
};

export default CalendarPage;