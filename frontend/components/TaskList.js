import TaskItem from './TaskItem';

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No tasks to display</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                />
            ))}
        </div>
    );
}