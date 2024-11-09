"use client"

import { useEffect, useState } from "react";

export default function Home() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([
    { id: generateRandomId(8), title: "Start Adding Todos", isComplete: false },
  ]);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todo-data');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  function handleAddTodo() {
    if (todo.trim()) {
      const newTodo = { id: generateRandomId(8), title: todo, isComplete: false };
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      localStorage.setItem('todo-data', JSON.stringify(updatedTodos));
      setTodo('');
    }
  }

  function handleDeleteTodo(id: string) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem('todo-data', JSON.stringify(newTodos));
  }

  function handleToggleTodo(id: string) {
    const todoList = todos.map((t) =>
      t.id === id ? { ...t, isComplete: !t.isComplete } : t
    );
    setTodos(todoList);
    localStorage.setItem('todo-data', JSON.stringify(todoList));
  }

  function generateRandomId(length:number = 8) {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${timestamp.toString(16)}${randomNum.toString(16).padStart(length - 8, '0')}`;
  }

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1 className="text-4xl font-bold mt-6">TODO APP</h1>
        <input
          className="text-black my-5 p-1"
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button className="bg-green-600 mx-5 rounded p-1" onClick={handleAddTodo}>ADD</button>
      </div>
      <div style={{ textAlign: "center" }}>
        {todos.map((k) => (
          <div key={k.id}>
            <p>
              <input
                type="checkbox"
                className="mx-5 w-xl h-md"
                checked={k.isComplete}
                onChange={() => handleToggleTodo(k.id)}
              />
              <span className="text-2xl"><span style={k.isComplete?{textDecorationLine:"line-through"}:{}}>{k.title}</span></span>
              <button
                className="bg-red-700 text-white mt-3 p-0.5 rounded mx-5"
                onClick={() => handleDeleteTodo(k.id)}
              >
                Delete
              </button>
            </p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          className="bg-red-700 rounded p-1 mt-5 text-white"
          onClick={() => {
            const confirmed = window.confirm("Do you really want to reset the Todo List?");
            if (confirmed) {
              setTodos([]);
              localStorage.removeItem('todo-data');
            }
          }}
        >
          Reset Todo List
        </button>
      </div>

    </>
  );
}
