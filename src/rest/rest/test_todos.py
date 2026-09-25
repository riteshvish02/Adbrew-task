import unittest
from unittest.mock import MagicMock
from bson import ObjectId

from .repository import TodoRepository, serialize_todo
from .services import TodoService


class TestTodoSerialization(unittest.TestCase):
    def test_serialize_todo_formats_object_id(self):
        fake_id = ObjectId("507f1f77bcf86cd799439011")
        doc = {
            "_id": fake_id,
            "title": "Test Task",
            "completed": False,
            "created_at": "2026-09-25T12:00:00Z"
        }
        serialized = serialize_todo(doc)
        self.assertEqual(serialized["id"], "507f1f77bcf86cd799439011")
        self.assertEqual(serialized["title"], "Test Task")
        self.assertFalse(serialized["completed"])
        self.assertEqual(serialized["created_at"], "2026-09-25T12:00:00Z")


class TestTodoService(unittest.TestCase):
    def setUp(self):
        self.mock_repo = MagicMock(spec=TodoRepository)
        self.service = TodoService(self.mock_repo)

    def test_add_todo_success(self):
        self.mock_repo.create.return_value = {
            "id": "507f1f77bcf86cd799439011",
            "title": "Complete Adbrew task",
            "completed": False,
            "created_at": "2026-09-25T12:00:00Z"
        }
        result = self.service.add_todo("  Complete Adbrew task  ")
        self.mock_repo.create.assert_called_once_with("Complete Adbrew task")
        self.assertEqual(result["title"], "Complete Adbrew task")
        self.assertEqual(result["id"], "507f1f77bcf86cd799439011")

    def test_add_todo_empty_title_raises_value_error(self):
        with self.assertRaises(ValueError):
            self.service.add_todo("   ")

    def test_add_todo_none_title_raises_value_error(self):
        with self.assertRaises(ValueError):
            self.service.add_todo(None)

    def test_add_todo_non_string_raises_value_error(self):
        with self.assertRaises(ValueError):
            self.service.add_todo(12345)

    def test_list_todos_success(self):
        expected_todos = [
            {"id": "1", "title": "First", "completed": False},
            {"id": "2", "title": "Second", "completed": True}
        ]
        self.mock_repo.get_all.return_value = expected_todos
        result = self.service.list_todos()
        self.assertEqual(len(result), 2)
        self.mock_repo.get_all.assert_called_once()


if __name__ == "__main__":
    unittest.main()
