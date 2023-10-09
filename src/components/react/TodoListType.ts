import type { Dispatch, SetStateAction } from "react";
import type { Todo } from "./TodoType";

export type TodoListProps = {
	todos: Todo[];
	setTodos: Dispatch<SetStateAction<Todo[]>>;
	filterType: string;
};
