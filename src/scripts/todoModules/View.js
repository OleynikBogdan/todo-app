function View() {
  const todoListEl = document.querySelector("[data-todo-list]");
  const createFormEl = document.querySelector("[data-create-form]");
  const searchFormEl = document.querySelector("[data-search-form]");

  const editTodoModal = new bootstrap.Modal(
    document.querySelector("#editTodoModal"),
    { keyboard: false },
  );

  const deleteTodoModal = new bootstrap.Modal(
    document.querySelector("#deleteTodoModal"),
    { keyboard: false, backdrop: "static" },
  );

  const editTodoFormEl = document.querySelector("[data-edit-form]");
  const deleteTodoSubmitEl = document.querySelector("[data-delete-submit]");
  const searchInputEl = searchFormEl.querySelector('[name="search"]');

  const createTodoTemplate = (todo) => {
    const wrapper = document.createElement("div");
    wrapper.className = "list-group-item";
    wrapper.dataset.todoId = todo.id;

    const header = document.createElement("div");
    header.className = "d-flex justify-content-between align-items-start";

    const content = document.createElement("div");
    content.className = "d-flex gap-2 align-items-start";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input mt-1";
    checkbox.checked = todo.completed;
    checkbox.dataset.toggleTodo = "";

    const textContent = document.createElement("div");

    const title = document.createElement("h5");
    title.className = "mb-1";
    title.textContent = todo.title;

    if (todo.completed) {
      title.classList.add("text-decoration-line-through", "text-secondary");
    }

    const description = document.createElement("p");
    description.className = "mb-1";
    description.textContent = todo.description || "No description";

    const updatedAt = document.createElement("small");
    updatedAt.className = "text-secondary";
    updatedAt.textContent = `Updated: ${todo.updatedAt}`;

    textContent.append(title, description, updatedAt);
    content.append(checkbox, textContent);

    const controls = document.createElement("div");
    controls.className = "d-flex gap-2";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "btn btn-sm btn-warning";
    editButton.dataset.edit = "";
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-sm btn-danger";
    deleteButton.dataset.delete = "";
    deleteButton.textContent = "Delete";

    controls.append(editButton, deleteButton);
    header.append(content, controls);
    wrapper.append(header);

    return wrapper;
  };

  const renderTodos = (todos) => {
    todoListEl.replaceChildren();

    if (todos.length === 0) {
      const message = document.createElement("p");
      message.className = "text-secondary text-center p-3";
      message.textContent = "No tasks found";
      todoListEl.append(message);
      return;
    }

    todos.forEach((todo) => {
      todoListEl.append(createTodoTemplate(todo));
    });
  };

  const renderEditTodoModalData = (todo) => {
    editTodoFormEl.elements.id.value = todo.id;
    editTodoFormEl.elements.title.value = todo.title;
    editTodoFormEl.elements.description.value = todo.description;
  };

  const renderDeleteTodoModalData = (todo) => {
    const title = document.querySelector("[data-delete-modal-title]");
    title.textContent = `Delete task: ${todo.title}?`;

    deleteTodoSubmitEl.dataset.todoId = todo.id;
  };

  const setActiveFilter = (status) => {
    document.querySelectorAll("[data-filter]").forEach((button) => {
      const isActive = button.dataset.filter === status;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const resetCreateForm = () => {
    createFormEl.reset();
  };

  return {
    todoListEl,
    createFormEl,
    searchFormEl,
    searchInputEl,
    editTodoModal,
    deleteTodoModal,
    editTodoFormEl,
    deleteTodoSubmitEl,
    renderTodos,
    renderEditTodoModalData,
    renderDeleteTodoModalData,
    setActiveFilter,
    resetCreateForm,
  };
}

export default View;
