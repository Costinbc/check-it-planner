import { useState } from 'react';

export default function TaskItem({ task, onUpdate, onDelete }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDateTime = () => {
        const dateObj = new Date(task.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        if (task.time) {
            const timeStr = task.time.split(':');
            dateObj.setHours(parseInt(timeStr[0]), parseInt(timeStr[1]));
            const formattedTime = dateObj.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
            });
            return `${formattedDate} at ${formattedTime}`;
        }

        return formattedDate;
    };

    const getRecurringText = () => {
        if (!task.recurring) return '';

        switch (task.recurringType) {
            case 'daily':
                return 'Repeats daily';
            case 'weekly':
                return 'Repeats weekly';
            case 'custom':
                return `Repeats every ${task.customRecurringDays} day${task.customRecurringDays > 1 ? 's' : ''}`;
            default:
                return '';
        }
    };

    const handleToggleComplete = () => {
        onUpdate(task._id, { completed: !task.completed });
    };

    return (
        <div className={`p-4 rounded-lg shadow-sm border-l-4 ${task.completed ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-white'}`}>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleToggleComplete}
                    className="h-5 w-5 text-blue-600 rounded mr-3"
                />

                <div className="flex-grow">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                    </h3>
                    <p className="text-sm text-gray-600">{formatDateTime()}</p>
                    {task.recurring && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {getRecurringText()}
            </span>
                    )}
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        {isExpanded ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-3 pl-8">
                    {task.description && (
                        <p className="text-gray-700 mb-2">{task.description}</p>
                    )}

                    {task.notification && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                            Reminder set for: {new Date(task.notification).toLocaleString()}
                        </div>
                    )}

                    <div className="flex mt-3 space-x-2">
                        <button
                            onClick={() => {
                                // Open edit form (implement this functionality)
                                console.log('Edit task:', task);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Edit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}