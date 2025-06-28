"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Todo {
  _id: string;
  text: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchTodos() {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      setText("");
      fetchTodos();
    }
    setLoading(false);
  }

  async function deleteTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo List</h1>
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <Input
          value={text}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          placeholder="Add a new todo..."
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !text.trim()}>
          Add
        </Button>
      </form>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo._id} className="flex items-center justify-between bg-gray-100 rounded px-3 py-2">
            <span>{todo.text}</span>
            <Button variant="destructive" size="sm" onClick={() => deleteTodo(todo._id)}>
              Delete
            </Button>
          </li>
        ))}
        {todos.length === 0 && <li className="text-center text-gray-400">No todos yet.</li>}
      </ul>
    </div>
  );
}
