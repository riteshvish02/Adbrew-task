import React, { useState } from 'react';

export function TodoForm({ onAddTodo, submitting }) {
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setValidationError('Please enter a description for the todo.');
      return;
    }

    setValidationError('');

    try {
      await onAddTodo(description);
      setDescription(''); // Clear input on successful creation
    } catch (err) {
      // Error handled by parent hook
    }
  };

  return (
    <div className="todo-card todo-form-section">
      <div className="section-header">
        <h1>Create a ToDo</h1>
        <span className="badge">New Task</span>
      </div>

      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-group">
          <label htmlFor="todo">ToDo: </label>
          <input
            id="todo"
            type="text"
            className="todo-input"
            placeholder="What needs to be done?"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (validationError) setValidationError('');
            }}
            disabled={submitting}
            autoComplete="off"
          />
        </div>

        {validationError && (
          <div className="validation-message" role="alert">
            {validationError}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || !description.trim()}
          >
            {submitting ? 'Adding...' : 'Add ToDo!'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TodoForm;
