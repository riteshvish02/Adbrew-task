import React from 'react';
import './App.css';
import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';

export function App() {
  const {
    todos,
    loading,
    submitting,
    error,
    clearError,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-badge">Adbrew Full-Stack Task</div>
        <h1 className="main-title">Task Management</h1>
        <p className="subtitle">
          Real-time persistence with React Hooks, Django REST, and MongoDB
        </p>
      </header>

      {error && (
        <div className="error-banner" role="alert">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button onClick={fetchTodos} className="btn-retry">
            Retry Connection
          </button>
          <button onClick={clearError} className="btn-dismiss">
            ×
          </button>
        </div>
      )}

      <main className="app-container">
        {/* Create a ToDo section */}
        <TodoForm onAddTodo={addTodo} submitting={submitting} />

        {/* List of TODOs section */}
        <TodoList
          todos={todos}
          loading={loading}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </main>

      <footer className="app-footer">
        <span>Django 3.x + PyMongo</span>
        <span className="separator">•</span>
        <span>React 17 Hooks</span>
        <span className="separator">•</span>
        <span>Docker Compose</span>
      </footer>
    </div>
  );
}

export default App;
