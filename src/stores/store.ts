import { computed, atom, action } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import { getFilteredTodos } from "../functions/getFilteredTodos";
import type { Todo } from "../components/react/TodoType";

export const $todos = persistentAtom<Todo[]>("todos", [], {
	encode: (todos: Todo[]) => JSON.stringify(todos),
	decode: (todosJSON: string) =>
		JSON.parse(todosJSON).map((todo: Partial<Todo>) => {
			const newTodo = { ...todo };
			if (newTodo.dateMarkedAsToBeDoneToday) {
				newTodo.dateMarkedAsToBeDoneToday = new Date(
					newTodo.dateMarkedAsToBeDoneToday
				);
			}
			if (newTodo.dateCreated) {
				newTodo.dateCreated = new Date(newTodo.dateCreated);
			}
			return newTodo;
		}),
});

export const addTodo = action($todos, "addTodo", (store, newTodo: Todo) => {
	const prevTodos = store.get();
	store.set([...prevTodos, newTodo]);
});

export const updateTodo = action(
	$todos,
	"updateTodo",
	(store, updatedTodo: Todo) => {
		const prevTodos = store.get();
		const updatedTodos = prevTodos.map((todo) => {
			if (todo.id === updatedTodo.id) {
				return updatedTodo;
			}
			return todo;
		});
		store.set(updatedTodos);
	}
);

export const softDeleteTodo = action(
	$todos,
	"softDeleteTodo",
	(store, id: string) => {
		const prevTodos = store.get();
		const updatedTodos = prevTodos.map((todo) => {
			if (todo.id === id) {
				return { ...todo, dateDeleted: new Date() };
			}
			return todo;
		});
		store.set(updatedTodos);
	}
);

export const hardDeleteTodo = action(
	$todos,
	"deleteTodo",
	(store, id: string) => {
		const prevTodos = store.get();
		const updatedTodos = prevTodos.filter((todo) => todo.id !== id);
		store.set(updatedTodos);
	}
);

// export const $inputValue = persistentAtom<string>("inputValue", "", {
// 	encode: String,
// 	decode: String,
// });

// export const setInputValue = action(
// 	$inputValue,
// 	"setInputValue",
// 	(store, value: string) => {
// 		store.set(value);
// 	}
// );

export const $filterType = atom<string>("all");

export const setFilterType = action(
	$filterType,
	"setFilterType",
	(store, value: string) => {
		store.set(value);
	}
);

export const markTodoAsDone = action($todos, "markTodoAsDone", (store, id) => {
	const prevTodos = store.get();
	const updatedTodos = prevTodos.map((todo) => {
		if (todo.id === id) {
			return { ...todo, isDone: true };
		}
		return todo;
	});
	store.set(updatedTodos);
});

export const moveTodoToBacklog = action(
	$todos,
	"moveTodoToBacklog",
	(store, id) => {
		const prevTodos = store.get();
		const updatedTodos = prevTodos.map((todo) => {
			if (todo.id === id) {
				return { ...todo, dateMarkedAsToBeDoneToday: undefined };
			}
			return todo;
		});
		store.set(updatedTodos);
	}
);

export const moveTodoToToday = action(
	$todos,
	"moveTodoToToday",
	(store, id) => {
		const prevTodos = store.get();
		const updatedTodos = prevTodos.map((todo) => {
			if (todo.id === id) {
				return { ...todo, dateMarkedAsToBeDoneToday: new Date() };
			}
			return todo;
		});
		store.set(updatedTodos);
	}
);

export const hardDeleteDoneTodos = action(
	$todos,
	"hardDeleteDoneTodos",
	(store) => {
		const prevTodos = store.get();
		const updatedTodos = prevTodos.filter((todo) => !todo.isDone);
		store.set(updatedTodos);
	}
);

export const $allTodos = computed($todos, (todos) => {
	const sortFunc = (a: Todo, b: Todo): number => {
		if (!a.dateDeleted && b.dateDeleted) return -1;
		if (a.dateDeleted && !b.dateDeleted) return 1;
		return (
			new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
		);
	};

	return todos
		.map((todo) => ({ ...todo, dateCreated: new Date(todo.dateCreated) }))
		.sort(sortFunc);
});

export const $doneTodos = computed($todos, (todos) => {
	return todos.filter((todo) => todo.isDone && !todo.dateDeleted);
});

export const $todayTodos = computed($todos, (todos) => {
	return todos.filter(
		(todo) => todo.dateMarkedAsToBeDoneToday && !todo.dateDeleted
	);
});

export const $backlogTodos = computed($todos, (todos) => {
	return todos.filter(
		(todo) =>
			!todo.isDone && !todo.dateMarkedAsToBeDoneToday && !todo.dateDeleted
	);
});
