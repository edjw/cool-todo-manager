import { isToday } from "date-fns";
import type { Todo } from "../components/react/TodoType";

export const getFilteredTodos = (todos: Todo[], filterType: string): Todo[] => {
	const notDeletedTodos = todos.filter((todo) => !todo.dateDeleted);

	if (filterType === "today") {
		return notDeletedTodos.filter((todo) => {
			return (
				!todo.isDone &&
				todo.dateMarkedAsToBeDoneToday !== undefined &&
				isToday(todo.dateMarkedAsToBeDoneToday)
			);
		});
	}

	if (filterType === "all") {
		return notDeletedTodos.filter((todo) => !todo.isDone);
	}

	if (filterType === "backlog") {
		return notDeletedTodos.filter((todo) => {
			return (
				!todo.isDone &&
				(todo.dateMarkedAsToBeDoneToday === undefined ||
					(todo.dateMarkedAsToBeDoneToday &&
						!isToday(todo.dateMarkedAsToBeDoneToday)))
			);
		});
	}

	if (filterType === "done") {
		return notDeletedTodos.filter((todo) => todo.isDone);
	}

	return [];
};
