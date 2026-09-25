import logging
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient

from .repository import TodoRepository
from .services import TodoService

logger = logging.getLogger(__name__)

# Connect to MongoDB instance using environment variables with robust fallbacks
mongo_host = os.environ.get("MONGO_HOST", "mongo")
mongo_port = os.environ.get("MONGO_PORT", "27017")
mongo_uri = f"mongodb://{mongo_host}:{mongo_port}"

# Maintain 'db' instance as expected by assignment instructions
db = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)['test_db']

# Initialize repository and service layers (Dependency Injection)
todo_repository = TodoRepository(db['todos'])
todo_service = TodoService(todo_repository)


class TodoListView(APIView):
    """
    API endpoint for listing all todos (GET) and creating a new todo (POST).
    """

    def get(self, request):
        """
        Fetch all todos from MongoDB.
        """
        try:
            todos = todo_service.list_todos()
            return Response(todos, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error handling GET /todos: {str(e)}", exc_info=True)
            return Response(
                {"error": "Failed to fetch todos from database.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        """
        Accept a todo item from request data and persist it into MongoDB.
        Supports 'title', 'description', or 'task' fields for flexibility.
        """
        try:
            payload = request.data or {}
            # Support title, description, or task to be resilient to client variations
            title = payload.get("title") or payload.get("description") or payload.get("task")

            created_todo = todo_service.add_todo(title)
            return Response(created_todo, status=status.HTTP_201_CREATED)
        except ValueError as ve:
            logger.warning(f"Validation error in POST /todos: {str(ve)}")
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error handling POST /todos: {str(e)}", exc_info=True)
            return Response(
                {"error": "Failed to create todo item in database.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TodoDetailView(APIView):
    """
    API endpoint for deleting (DELETE) and toggling completed status (PATCH) of a single todo.
    """

    def delete(self, request, todo_id):
        """
        Delete a todo by ID.
        """
        try:
            success = todo_service.remove_todo(todo_id)
            if not success:
                return Response({"error": "Todo not found or invalid ID."}, status=status.HTTP_404_NOT_FOUND)
            return Response({"message": "Todo deleted successfully.", "id": todo_id}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error handling DELETE /todos/{todo_id}: {str(e)}", exc_info=True)
            return Response(
                {"error": "Failed to delete todo.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request, todo_id):
        """
        Toggle completed status of a todo by ID.
        """
        try:
            updated_todo = todo_service.toggle_todo(todo_id)
            if not updated_todo:
                return Response({"error": "Todo not found or invalid ID."}, status=status.HTTP_404_NOT_FOUND)
            return Response(updated_todo, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error handling PATCH /todos/{todo_id}: {str(e)}", exc_info=True)
            return Response(
                {"error": "Failed to update todo status.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
