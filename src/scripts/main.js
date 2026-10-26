import todos from "./data/todos.js";
import Model from "./todoModules/Model.js";
import Controller from "./todoModules/Controller.js";
import View from "./todoModules/View.js";

const model = Model(todos);
const view = View();

Controller(model, view);
