import React from 'react';

export function TodoList({ todos, loading, onToggle, onDelete }) {
  if (loading) {
    return (
      <div className="todo-card todo-list-section">
        <div className="section-header">
          <h1>List of TODOs</h1>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching todos from MongoDB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-card todo-list-section">
      <div className="section-header">
        <h1>List of TODOs</h1>
        <span className="badge badge-count">
          {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {todos.length === 0 ? (
        <div className="empty-state">
          <p>No todos yet! Add your first task in the form below.</p>
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => {
            const id = todo.id || todo._id;
            const title = todo.title || todo.description || 'Untitled Task';
            const isCompleted = Boolean(todo.completed);

            return (
              <li
                key={id}
                className={`todo-item ${isCompleted ? 'completed' : ''}`}
              >
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggle && onToggle(id)}
                    className="todo-checkbox"
                    aria-label={`Mark "${title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
                  />
                  <div className="todo-details">
                    <span className="todo-title">{title}</span>
                    {todo.created_at && (
                      <span className="todo-timestamp">
                        {new Date(todo.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {onDelete && (
                  <button
                    onClick={() => onDelete(id)}
                    className="btn btn-delete"
                    title="Delete todo"
                    aria-label="Delete todo"
                  >
                    ×
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
