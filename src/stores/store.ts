import { computed, atom, action } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import type { Todo } from "../types/TodoType";
import type { filterTypes } from "../types/filterTypes";
import { isToday } from "date-fns";

export const $todos = persistentAtom<Todo[]>("todos", [], {
  encode: (todos: Todo[]) => JSON.stringify(todos),
  decode: (todosJSON: string) =>
    JSON.parse(todosJSON).map((todo: Partial<Todo>) => {
      const newTodo = { ...todo };
      if (newTodo.dateMarkedAsToBeDoneToday) {
        newTodo.dateMarkedAsToBeDoneToday = new Date(
          newTodo.dateMarkedAsToBeDoneToday,
        );
      }
      if (newTodo.dateCreated) {
        newTodo.dateCreated = new Date(newTodo.dateCreated);
      }
      if (newTodo.dateDeleted) {
        newTodo.dateDeleted = new Date(newTodo.dateDeleted);
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
  },
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
  },
);

export const SoftDeleteAllDoneTodos = action(
  $todos,
  "softDeleteDoneTodos",
  (store) => {
    const prevTodos = store.get();
    const updatedTodos = prevTodos.map((todo) => {
      if (todo.isDone) {
        return { ...todo, dateDeleted: new Date() };
      }
      return todo;
    });
    store.set(updatedTodos);
  },
);

export const hardDeleteTodo = action(
  $todos,
  "deleteTodo",
  (store, id: string) => {
    const prevTodos = store.get();
    const updatedTodos = prevTodos.filter((todo) => todo.id !== id);
    store.set(updatedTodos);
  },
);

export const $filterType = atom<filterTypes>("today");

export const setFilterType = action(
  $filterType,
  "setFilterType",
  (store, value: filterTypes) => {
    store.set(value);
  },
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

export const unmarkTodoAsDone = action(
  $todos,
  "markTodoAsDone",
  (store, id) => {
    const prevTodos = store.get();
    const updatedTodos = prevTodos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: false };
      }
      return todo;
    });
    store.set(updatedTodos);
  },
);

export const moveTodoToBacklog = action(
  $todos,
  "moveTodoToBacklog",
  (store, id) => {
    const prevTodos = store.get();
    const updatedTodos = prevTodos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isDone: false,
          dateDeleted: undefined,
          dateMarkedAsToBeDoneToday: undefined,
        };
      }
      return todo;
    });
    store.set(updatedTodos);
  },
);

export const moveTodoToToday = action(
  $todos,
  "moveTodoToToday",
  (store, id) => {
    const prevTodos = store.get();
    const updatedTodos = prevTodos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isDone: false,
          dateDeleted: undefined,
          dateMarkedAsToBeDoneToday: new Date(),
          numberOfTimesMarkedAsToBeDoneToday:
            (todo.numberOfTimesMarkedAsToBeDoneToday || 0) + 1,
        };
      }
      return todo;
    });
    store.set(updatedTodos);
  },
);

export const hardDeleteAllDeletedTodos = action(
  $todos,
  "hardDeleteDoneTodos",
  (store) => {
    const prevTodos = store.get();
    const updatedTodos = prevTodos.filter((todo) => !todo.dateDeleted);
    store.set(updatedTodos);
  },
);

export const hardDeleteSingleDeletedTodo = action(
  $todos,
  "hardDeleteSingleDeletedTodo",
  (store, id) => {
    const prevTodos = store.get();
    const updatedTodos = prevTodos.filter((todo) => {
      return !(todo.id === id && todo.dateDeleted !== undefined);
    });
    store.set(updatedTodos);
  },
);

const sortTodosByDateCreated = (a: Todo, b: Todo): number => {
  if (!a.dateDeleted && b.dateDeleted) return -1;
  if (a.dateDeleted && !b.dateDeleted) return 1;

  return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
};

const sortTodosByDoneStatus = (a: Todo, b: Todo): number => {
  if (a.isDone && !b.isDone) return 1;
  if (!a.isDone && b.isDone) return -1;

  return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
};

export const $allTodos = computed($todos, (todos) => {
  const sortedTodos = todos
    .filter((todo) => !todo.dateDeleted)
    .map((todo) => ({ ...todo, dateCreated: new Date(todo.dateCreated) }))
    .sort(sortTodosByDateCreated);
  return sortedTodos;
});

export const $doneTodos = computed($todos, (todos) => {
  const sortedTodos = todos
    .filter((todo) => todo.isDone && !todo.dateDeleted)
    .map((todo) => ({ ...todo, dateCreated: new Date(todo.dateCreated) }))
    .sort(sortTodosByDateCreated);

  return sortedTodos;
});

export const $todayTodos = computed($todos, (todos) => {
  const sortedTodos = todos
    .filter(
      (todo) =>
        todo.dateMarkedAsToBeDoneToday &&
        isToday(todo.dateMarkedAsToBeDoneToday) &&
        !todo.dateDeleted,
    )
    .map((todo) => ({ ...todo, dateCreated: new Date(todo.dateCreated) }))
    .sort(sortTodosByDoneStatus);

  return sortedTodos;
});

export const $backlogTodos = computed($todos, (todos) => {
  const sortedTodos = todos
    .filter(
      (todo) =>
        !todo.isDone &&
        (!todo.dateMarkedAsToBeDoneToday ||
          !isToday(todo.dateMarkedAsToBeDoneToday)) &&
        !todo.dateDeleted,
    )
    .map((todo) => ({ ...todo, dateCreated: new Date(todo.dateCreated) }))
    .sort(sortTodosByDateCreated);

  return sortedTodos;
});

export const $deletedTodos = computed($todos, (todos) => {
  const sortedTodos = todos
    .filter((todo) => todo.dateDeleted)
    .map((todo) => ({ ...todo, dateCreated: new Date(todo.dateCreated) }))
    .sort(sortTodosByDateCreated);
  return sortedTodos;
});
