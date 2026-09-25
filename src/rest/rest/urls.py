from django.urls import path, re_path
from .views import TodoListView, TodoDetailView

urlpatterns = [
    re_path(r'^todos/?$', TodoListView.as_view(), name='todos'),
    re_path(r'^todos/(?P<todo_id>[a-f0-9]{24})/?$', TodoDetailView.as_view(), name='todo_detail'),
]
