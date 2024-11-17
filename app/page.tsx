"use client";

import { useEffect, useState } from "react";

interface Todo {
  id: string;
  title: string;
  isComplete: boolean;
}

export default function Home() {
  function generateRandomId(length: number = 8): string {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${timestamp.toString(16)}${randomNum.toString(16).padStart(length - 8, '0')}`;
  }

  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([
    { id: generateRandomId(8), title: "Start Adding Todos", isComplete: false },
  ]);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todo-data');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  function sortTodos(todoList: Todo[]): Todo[] {
    const sortedTodos: Todo[] = [];
    for (let t of todoList) {
      if (!t.isComplete) sortedTodos.push(t);
    }
    for (let t of todoList) {
      if (t.isComplete) sortedTodos.push(t);
    }
    return sortedTodos;
  }

  function handleAddTodo(): void {
    if (todo.trim()) {
      const newTodo = { id: generateRandomId(8), title: todo, isComplete: false };
      const updatedTodos = sortTodos([...todos, newTodo]);
      setTodos(updatedTodos);
      localStorage.setItem('todo-data', JSON.stringify(updatedTodos));
      setTodo('');
    }
  }

  function handleDeleteTodo(id: string): void {
    const newTodos = todos.filter((todo) => todo.id !== id);
    const sortedTodos = sortTodos(newTodos);
    setTodos(sortedTodos);
    localStorage.setItem('todo-data', JSON.stringify(sortedTodos));
  }

  function handleToggleTodo(id: string): void {
    const todoList = todos.map((t) =>
      t.id === id ? { ...t, isComplete: !t.isComplete } : t
    );
    const sortedTodos = sortTodos(todoList);
    setTodos(sortedTodos);
    localStorage.setItem('todo-data', JSON.stringify(sortedTodos));
  }

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1 className="text-5xl font-bold mt-6">TODO APP</h1>
        <label htmlFor="todo-input" className="sr-only">Add a new todo</label>
        <input
          id="todo-input"
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
              <span className="text-2xl">
                <span style={k.isComplete ? { textDecorationLine: "line-through" } : {}}>{k.title}</span>
              </span>
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
