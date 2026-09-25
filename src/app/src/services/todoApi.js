const API_BASE_URL =
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  'http://localhost:8000';

/**
 * Service to handle all HTTP communications with the Django REST backend.
 */
export const todoApi = {
  /**
   * Fetch all todos from the backend.
   * @returns {Promise<Array>} Array of todo objects
   */
  async getTodos() {
    const response = await fetch(`${API_BASE_URL}/todos/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch todos: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Create a new todo in MongoDB.
   * @param {string} description - The task description/title
   * @returns {Promise<Object>} Created todo object
   */
  async createTodo(description) {
    const response = await fetch(`${API_BASE_URL}/todos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        title: description.trim(),
        description: description.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to create todo: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Toggle completed status of a todo.
   * @param {string} id - Todo ObjectId
   */
  async toggleTodo(id) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to toggle todo: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Delete a todo item.
   * @param {string} id - Todo ObjectId
   */
  async deleteTodo(id) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete todo: ${response.statusText}`);
    }

    return response.json();
  },
};
