import React, { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = "http://localhost:3000";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/todos`);
        setTodos(response.data);
      } catch (error) {
        console.error("Vazifalarni olishda xato:", error);
      }
    };

    fetchData();
  }, []);

  const addTodo = async (todo) => {
    try {
      const response = await axios.post(`${baseUrl}/todos`, todo);
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error("Vazifa qo'shishda xato:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${baseUrl}/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Vazifani o'chirishda xato:", error);
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const response = await axios.patch(`${baseUrl}/todos/${id}`, updates);
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error("Vazifani yangilashda xato:", error);
    }
  };

  return (
    <div className="container">
      <h1>Todo App</h1>
      <TodoList todos={todos} deleteTodo={deleteTodo} updateTodo={updateTodo} />
      <TodoForm addTodo={addTodo} />
    </div>
  );
};

const TodoList = ({ todos, deleteTodo, updateTodo }) => {
  return (
    <ul className="list-group">
      {todos.map((todo) => (
        <li key={todo.id} className="list-group-item">
          <span
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.text}
          </span>
          <button className="btn btn-danger ml-2" onClick={() => deleteTodo(todo.id)}>O'chirish</button>
          <button className="btn btn-success ml-2" onClick={() => updateTodo(todo.id, { completed: !todo.completed })}>
            {todo.completed ? "Bekor qilish" : "Tugatish"}
          </button>
        </li>
      ))}
    </ul>
  );
};

const TodoForm = ({ addTodo }) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await addTodo({ text, completed: false });
      setText("");
    } catch (error) {
      console.error("Vazifa qo'shishda xato:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="form-control"
      />
      <button type="submit" className="btn btn-primary mt-2">Qo'shish</button>
    </form>
  );
};

export default TodoApp;
