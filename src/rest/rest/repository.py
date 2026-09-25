from datetime import datetime, timezone
from bson import ObjectId
from pymongo.collection import Collection
import logging

logger = logging.getLogger(__name__)


def serialize_todo(doc: dict) -> dict:
    """Helper to convert MongoDB document to JSON-serializable dictionary."""
    if not doc:
        return {}
    return {
        "id": str(doc["_id"]),
        "title": doc.get("title", ""),
        "completed": bool(doc.get("completed", False)),
        "created_at": doc.get("created_at", "")
    }


class TodoRepository:
    """
    Repository layer responsible for all MongoDB data access operations.
    Encapsulates PyMongo queries following the Repository Pattern.
    """

    def __init__(self, collection: Collection):
        self.collection = collection

    def get_all(self) -> list:
        """
        Fetch all todos sorted by creation time descending (newest first).
        """
        try:
            cursor = self.collection.find().sort("_id", -1)
            return [serialize_todo(doc) for doc in cursor]
        except Exception as e:
            logger.error(f"Error fetching todos from MongoDB: {str(e)}", exc_info=True)
            raise

    def create(self, title: str) -> dict:
        """
        Insert a new todo item into the MongoDB collection.
        """
        try:
            now_iso = datetime.now(timezone.utc).isoformat()
            new_doc = {
                "title": title.strip(),
                "completed": False,
                "created_at": now_iso
            }
            result = self.collection.insert_one(new_doc)
            new_doc["_id"] = result.inserted_id
            return serialize_todo(new_doc)
        except Exception as e:
            logger.error(f"Error inserting todo into MongoDB: {str(e)}", exc_info=True)
            raise

    def delete(self, todo_id: str) -> bool:
        """
        Delete a todo item by its string ObjectId.
        """
        try:
            if not ObjectId.is_valid(todo_id):
                return False
            result = self.collection.delete_one({"_id": ObjectId(todo_id)})
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Error deleting todo {todo_id} from MongoDB: {str(e)}", exc_info=True)
            raise

    def toggle(self, todo_id: str) -> dict:
        """
        Toggle the completed status of a todo item.
        """
        try:
            if not ObjectId.is_valid(todo_id):
                return None
            doc = self.collection.find_one({"_id": ObjectId(todo_id)})
            if not doc:
                return None
            new_status = not doc.get("completed", False)
            self.collection.update_one(
                {"_id": ObjectId(todo_id)},
                {"$set": {"completed": new_status}}
            )
            doc["completed"] = new_status
            return serialize_todo(doc)
        except Exception as e:
            logger.error(f"Error toggling todo {todo_id} in MongoDB: {str(e)}", exc_info=True)
            raise
