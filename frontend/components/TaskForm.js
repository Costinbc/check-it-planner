import { useState } from 'react';

export default function TaskForm({ onAddTask }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('');
    const [hasNotification, setHasNotification] = useState(false);
    const [notificationTime, setNotificationTime] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringType, setRecurringType] = useState('daily');
    const [customRecurringDays, setCustomRecurringDays] = useState(1);
    const [formVisible, setFormVisible] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const taskData = {
            title,
            description,
            date,
            time: time || null,
            notification: hasNotification ? notificationTime : null,
            recurring: isRecurring,
            recurringType: isRecurring ? recurringType : null,
            customRecurringDays: isRecurring && recurringType === 'custom' ? customRecurringDays : null,
            completed: false
        };

        onAddTask(taskData);

        // Reset form
        setTitle('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setTime('');
        setHasNotification(false);
        setNotificationTime('');
        setIsRecurring(false);
        setRecurringType('daily');
        setCustomRecurringDays(1);
        setFormVisible(false);
    };

    return (
        <div className="mb-6">
            {!formVisible ? (
                <button
                    onClick={() => setFormVisible(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Task
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Add New Task</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            rows="2"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Time (optional)</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="notification"
                                checked={hasNotification}
                                onChange={() => setHasNotification(!hasNotification)}
                                className="mr-2"
                            />
                            <label htmlFor="notification" className="text-sm font-medium">Set reminder</label>
                        </div>

                        {hasNotification && (
                            <div className="mt-2">
                                <input
                                    type="datetime-local"
                                    value={notificationTime}
                                    onChange={(e) => setNotificationTime(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    required={hasNotification}
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="recurring"
                                checked={isRecurring}
                                onChange={() => setIsRecurring(!isRecurring)}
                                className="mr-2"
                            />
                            <label htmlFor="recurring" className="text-sm font-medium">Recurring task</label>
                        </div>

                        {isRecurring && (
                            <div className="mt-2 space-y-2">
                                <div>
                                    <select
                                        value={recurringType}
                                        onChange={(e) => setRecurringType(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>

                                {recurringType === 'custom' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Repeat every</label>
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                min="1"
                                                value={customRecurringDays}
                                                onChange={(e) => setCustomRecurringDays(parseInt(e.target.value))}
                                                className="w-20 p-2 border rounded-md mr-2"
                                            />
                                            <span>days</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        >
                            Add Task
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormVisible(false)}
                            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}