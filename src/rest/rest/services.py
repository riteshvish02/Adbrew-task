import logging
from .repository import TodoRepository

logger = logging.getLogger(__name__)


class TodoService:
    """
    Service layer implementing business logic, input validation,
    and coordinating between controller and repository.
    """

    def __init__(self, repository: TodoRepository):
        self.repository = repository

    def list_todos(self) -> list:
        """
        Retrieve all todos.
        """
        return self.repository.get_all()

    def add_todo(self, title: str) -> dict:
        """
        Validate input and persist a new todo.
        Raises ValueError if validation fails.
        """
        if title is None:
            raise ValueError("The 'title' field is required.")

        if not isinstance(title, str):
            raise ValueError("The 'title' field must be a string.")

        clean_title = title.strip()
        if not clean_title:
            raise ValueError("The 'title' cannot be empty or contain only whitespace.")

        if len(clean_title) > 500:
            raise ValueError("The 'title' cannot exceed 500 characters.")

        return self.repository.create(clean_title)

    def remove_todo(self, todo_id: str) -> bool:
        """
        Delete a todo item by ID.
        """
        if not todo_id:
            raise ValueError("Todo ID is required.")
        return self.repository.delete(todo_id)

    def toggle_todo(self, todo_id: str) -> dict:
        """
        Toggle completed status of a todo item.
        """
        if not todo_id:
            raise ValueError("Todo ID is required.")
        return self.repository.toggle(todo_id)
