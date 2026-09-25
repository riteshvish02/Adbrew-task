import { useState, useEffect, useCallback } from 'react';
import { todoApi } from '../services/todoApi';

/**
 * Custom React Hook to manage TODO state, API interactions, and error handling.
 */
export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all todos from the backend
  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      const data = await todoApi.getTodos();
      // Ensure we have an array even if backend returns empty or wrapped
      const list = Array.isArray(data) ? data : (data.data || []);
      setTodos(list);
    } catch (err) {
      console.error('Failed to load todos:', err);
      setError(err.message || 'Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Create a new todo and refresh the list
  const addTodo = async (description) => {
    if (!description || !description.trim()) {
      throw new Error('Please enter a valid todo description.');
    }

    setSubmitting(true);
    setError(null);

    try {
      const created = await todoApi.createTodo(description);
      // Immediately refresh list from backend as per requirement #3
      await fetchTodos();
      return created;
    } catch (err) {
      setError(err.message || 'Failed to add todo.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle todo completed state
  const toggleTodo = async (id) => {
    try {
      setError(null);
      await todoApi.toggleTodo(id);
      await fetchTodos();
    } catch (err) {
      setError(err.message || 'Failed to update todo status.');
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      setError(null);
      await todoApi.deleteTodo(id);
      await fetchTodos();
    } catch (err) {
      setError(err.message || 'Failed to delete todo.');
    }
  };

  return {
    todos,
    loading,
    submitting,
    error,
    clearError: () => setError(null),
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
