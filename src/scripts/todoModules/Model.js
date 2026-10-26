import { lsDataKey } from "../constants.js";

function Model(defaultData = [], dataKey = lsDataKey) {
  const getData = () => {
    return JSON.parse(localStorage.getItem(dataKey));
  };

  const setData = (data) => {
    localStorage.setItem(dataKey, JSON.stringify(data));
  };

  if (localStorage.getItem(dataKey) === null) {
    setData(defaultData);
  }

  const getTodoById = (id) => {
    return getData().find((todo) => todo.id === Number(id));
  };

  const addTodo = ({ title, description = "" }) => {
    const todos = getData();
    const today = new Date().toISOString().split("T")[0];

    const nextId = todos.length
      ? Math.max(...todos.map((todo) => todo.id)) + 1
      : 1;

    const newTodo = {
      id: nextId,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: today,
      updatedAt: today,
    };

    todos.push(newTodo);
    setData(todos);

    return newTodo;
  };

  const updateTodoById = (nextTodo) => {
    const todos = getData();
    const todoIndex = todos.findIndex(
      (todo) => todo.id === Number(nextTodo.id),
    );

    if (todoIndex === -1) {
      throw new Error("Could not find todo");
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...nextTodo,
      id: todos[todoIndex].id,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setData(todos);
  };

  const toggleTodoById = (id) => {
    const todos = getData();
    const todo = todos.find((todo) => todo.id === Number(id));

    if (!todo) {
      throw new Error("Could not find todo");
    }

    todo.completed = !todo.completed;
    todo.updatedAt = new Date().toISOString().split("T")[0];

    setData(todos);
  };

  const removeTodoById = (id) => {
    const todos = getData();
    const filteredTodos = todos.filter((todo) => todo.id !== Number(id));

    if (filteredTodos.length === todos.length) {
      throw new Error("Could not find todo");
    }

    setData(filteredTodos);
  };

  const searchTodos = (query) => {
    const normalizedQuery = query.trim().toLowerCase();

    return getData().filter((todo) =>
      todo.title.toLowerCase().includes(normalizedQuery),
    );
  };

  const filterTodos = (status) => {
    const todos = getData();

    if (status === "active") {
      return todos.filter((todo) => !todo.completed);
    }

    if (status === "completed") {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  };

  return {
    getData,
    getTodoById,
    addTodo,
    updateTodoById,
    toggleTodoById,
    removeTodoById,
    searchTodos,
    filterTodos,
  };
}

export default Model;
