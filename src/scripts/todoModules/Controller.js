function Controller(model, view) {
  let currentStatus = "all";

  const getSearchParam = (param) => {
    const url = new URL(window.location.href);
    return url.searchParams.get(param);
  };

  const removeSearchParam = (name) => {
    const url = new URL(window.location.href);
    url.searchParams.delete(name);
    window.history.replaceState({}, "", url);
  };

  const cleanModalUrl = () => {
    removeSearchParam("todoId");
    removeSearchParam("action");
  };

  const getTodoId = (target) => {
    const todoElement = target.closest("[data-todo-id]");

    return todoElement ? Number(todoElement.dataset.todoId) : null;
  };

  const renderTodos = () => {
    const query = view.searchInputEl.value.trim();
    let todos = model.searchTodos(query);

    if (currentStatus === "active") {
      todos = todos.filter((todo) => !todo.completed);
    } else if (currentStatus === "completed") {
      todos = todos.filter((todo) => todo.completed);
    }

    view.renderTodos(todos);
    view.setActiveFilter(currentStatus);
  };

  const restoreUrlState = () => {
    const status = getSearchParam("filter");

    currentStatus = ["all", "active", "completed"].includes(status)
      ? status
      : "all";

    view.searchInputEl.value = getSearchParam("search") || "";
    renderTodos();

    const action = getSearchParam("action");
    const todoId = Number(getSearchParam("todoId"));
    const todo = model.getTodoById(todoId);

    if (!todo || !["edit", "delete"].includes(action)) {
      if (action || getSearchParam("todoId")) {
        cleanModalUrl();
      }
      return;
    }

    if (action === "edit") {
      view.renderEditTodoModalData(todo);
      view.editTodoModal.show();
    } else if (action === "delete") {
      view.renderDeleteTodoModalData(todo);
      view.deleteTodoModal.show();
    }
  };

  view.createFormEl.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    const title = form.elements.title.value.trim();
    const description = form.elements.description.value.trim();

    if (!title) return;

    model.addTodo({ title, description });

    view.resetCreateForm();
    renderTodos();
  });

  view.todoListEl.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-toggle-todo]");

    if (!checkbox) return;

    const todoId = getTodoId(checkbox);

    if (todoId === null) return;

    model.toggleTodoById(todoId);
    renderTodos();
  });

  view.todoListEl.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit]");
    const deleteButton = event.target.closest("[data-delete]");

    if (!editButton && !deleteButton) return;

    const button = editButton || deleteButton;
    const todoId = getTodoId(button);
    const todo = model.getTodoById(todoId);

    if (!todo) return;

    const setModalUrl = (action, todoId) => {
      const url = new URL(window.location.href);
      url.searchParams.set("todoId", todoId);
      url.searchParams.set("action", action);

      window.history.pushState({}, "", url);
    };

    if (editButton) {
      view.renderEditTodoModalData(todo);
      setModalUrl("edit", todoId);
      view.editTodoModal.show();
    }

    if (deleteButton) {
      view.renderDeleteTodoModalData(todo);
      setModalUrl("delete", todoId);
      view.deleteTodoModal.show();
    }
  });

  view.editTodoFormEl.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    const id = Number(form.elements.id.value);
    const title = form.elements.title.value.trim();
    const description = form.elements.description.value.trim();

    if (!title) return;

    model.updateTodoById({ id, title, description });

    view.editTodoModal.hide();
    renderTodos();
  });

  view.editTodoModal._element.addEventListener(
    "hidden.bs.modal",
    cleanModalUrl,
  );
  view.deleteTodoSubmitEl.addEventListener("click", () => {
    const todoId = Number(view.deleteTodoSubmitEl.dataset.todoId);

    if (!todoId) return;

    model.removeTodoById(todoId);

    view.deleteTodoModal.hide();
    renderTodos();
  });

  view.deleteTodoModal._element.addEventListener(
    "hidden.bs.modal",
    cleanModalUrl,
  );

  view.searchFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    renderTodos();
  });

  view.searchInputEl.addEventListener("input", () => {
    const url = new URL(window.location.href);
    const query = view.searchInputEl.value.trim();

    if (query) {
      url.searchParams.set("search", query);
    } else {
      url.searchParams.delete("search");
    }

    window.history.replaceState({}, "", url);
    renderTodos();
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      currentStatus = button.dataset.filter;

      const url = new URL(window.location.href);

      if (currentStatus === "all") {
        url.searchParams.delete("filter");
      } else {
        url.searchParams.set("filter", currentStatus);
      }

      window.history.pushState({}, "", url);
      renderTodos();
    });
  });

  document.addEventListener("DOMContentLoaded", restoreUrlState, {
    once: true,
  });
  window.addEventListener("popstate", restoreUrlState);
}

export default Controller;
