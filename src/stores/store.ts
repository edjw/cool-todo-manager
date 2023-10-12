import { computed, atom, action } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import type { Todo } from "../types/TodoType";
import { TodoSchemaForJSON } from "../types/TodoType";
import type { filterTypes } from "../types/filterTypes";
import { isToday } from "date-fns";
import { z } from "zod";

const TodosSchemaForJSON = z.array(TodoSchemaForJSON);

// Basic atoms

export const $todos = persistentAtom<Todo[]>("todos", [], {
  encode: (todos: Todo[]) => {
    const todosAsStrings = todos.map((todo) => {
      return {
        ...todo,
        title: transformTitle(todo.title),
        description: transformDescription(todo.description),
        dateCreated: todo.dateCreated.toISOString(),
        dateDeleted: todo.dateDeleted?.toISOString(),
        dateMarkedAsToBeDoneToday:
          todo.dateMarkedAsToBeDoneToday?.toISOString(),
      };
    });

    const result = TodosSchemaForJSON.safeParse(todosAsStrings);
    if (result.success) {
      return JSON.stringify(result.data);
    } else {
      console.error("Encoding error:", result.error);
      return JSON.stringify([]);
    }
  },
  decode: (todosJSON: string) => {
    const parsedData = TodosSchemaForJSON.safeParse(JSON.parse(todosJSON));
    if (parsedData.success) {
      return parsedData.data.map((todo) => ({
        ...todo,
        dateCreated: new Date(todo.dateCreated),
        dateDeleted: todo.dateDeleted ? new Date(todo.dateDeleted) : undefined,
        dateMarkedAsToBeDoneToday: todo.dateMarkedAsToBeDoneToday
          ? new Date(todo.dateMarkedAsToBeDoneToday)
          : undefined,
      }));
    } else {
      console.error("Decoding error:", parsedData.error);
      return [];
    }
  },
});

export const $filterType = atom<filterTypes>("today");

// Computed atoms

export const $allTodos = computed($todos, (todos) => {
  const sortedTodos = todos
    .filter((todo) => !todo.dateDeleted)
    .map((todo) => ({ ...todo, dateCreated: new Date(todo.dateCreated) }))
    .sort(sortTodosByStatusAndPriority);
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
    .sort(sortTodosByDoneStatusAndTimesAdded);

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
    .sort(sortTodosByFrequencyAndDateCreated);

  return sortedTodos;
});

export const $deletedTodos = computed($todos, (todos) => {
  const sortedTodos = todos
    .filter((todo) => todo.dateDeleted)
    .map((todo) => ({ ...todo, dateCreated: new Date(todo.dateCreated) }))
    .sort(sortTodosByDateCreated);
  return sortedTodos;
});

// Actions

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
        const updatedTodo: Todo = {
          ...todo,
          dateDeleted: new Date(),
        };
        return updatedTodo;
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
        const updatedTodo: Todo = {
          ...todo,
          dateDeleted: new Date(),
        };
        return updatedTodo;
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
    const updatedTodos = prevTodos.filter((todo: Todo) => todo.id !== id);
    store.set(updatedTodos);
  },
);

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
      const updatedTodo: Todo = {
        ...todo,
        isDone: true,
      };
      return updatedTodo;
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
        const updatedTodo: Todo = {
          ...todo,
          isDone: false,
        };
        return updatedTodo;
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
        const updatedTodo: Todo = {
          ...todo,
          isDone: false,
          dateDeleted: undefined,
          dateMarkedAsToBeDoneToday: undefined,
        };
        return updatedTodo;
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
    const updatedTodos: Todo[] = prevTodos.map((todo: Todo) => {
      if (todo.id === id) {
        const updatedTodo: Todo = {
          ...todo,
          isDone: false,
          dateDeleted: undefined,
          dateCreated: todo.dateCreated,
          dateMarkedAsToBeDoneToday: new Date(),
          numberOfTimesMarkedAsToBeDoneToday:
            (todo.numberOfTimesMarkedAsToBeDoneToday || 0) + 1,
        };
        return updatedTodo;
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
    const prevTodos: Todo[] = store.get();
    const updatedTodos: Todo[] = prevTodos.filter(
      (todo: Todo) => !todo.dateDeleted,
    );
    store.set(updatedTodos);
  },
);

export const hardDeleteSingleDeletedTodo = action(
  $todos,
  "hardDeleteSingleDeletedTodo",
  (store, id) => {
    const prevTodos = store.get();
    const updatedTodos = prevTodos.filter((todo: Todo) => {
      return !(todo.id === id && todo.dateDeleted !== undefined);
    });
    store.set(updatedTodos);
  },
);

// Helper functions

const sortTodosByDateCreated = (a: Todo, b: Todo): number => {
  if (!a.dateDeleted && b.dateDeleted) return -1;
  if (a.dateDeleted && !b.dateDeleted) return 1;

  return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
};

const sortTodosByStatusAndPriority = (a: Todo, b: Todo): number => {
  const aIsToday = a.dateMarkedAsToBeDoneToday
    ? isToday(a.dateMarkedAsToBeDoneToday)
    : false;
  const bIsToday = b.dateMarkedAsToBeDoneToday
    ? isToday(b.dateMarkedAsToBeDoneToday)
    : false;

  if (a.isDone && b.isDone) {
    if (aIsToday && !bIsToday) return -1;
    if (!aIsToday && bIsToday) return 1;
  } else {
    if (a.isDone && !b.isDone) return 1;
    if (!a.isDone && b.isDone) return -1;
  }

  if (aIsToday && !bIsToday) return -1;
  if (!aIsToday && bIsToday) return 1;

  if (
    a.numberOfTimesMarkedAsToBeDoneToday > b.numberOfTimesMarkedAsToBeDoneToday
  )
    return -1;
  if (
    a.numberOfTimesMarkedAsToBeDoneToday < b.numberOfTimesMarkedAsToBeDoneToday
  )
    return 1;

  return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
};

const sortTodosByFrequencyAndDateCreated = (a: Todo, b: Todo): number => {
  if (!a.dateDeleted && b.dateDeleted) return -1;
  if (a.dateDeleted && !b.dateDeleted) return 1;

  if (
    a.numberOfTimesMarkedAsToBeDoneToday > b.numberOfTimesMarkedAsToBeDoneToday
  )
    return -1;
  if (
    a.numberOfTimesMarkedAsToBeDoneToday < b.numberOfTimesMarkedAsToBeDoneToday
  )
    return 1;

  return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
};

const sortTodosByDoneStatusAndTimesAdded = (a: Todo, b: Todo): number => {
  if (a.isDone && !b.isDone) return 1;
  if (!a.isDone && b.isDone) return -1;

  if (
    a.numberOfTimesMarkedAsToBeDoneToday > b.numberOfTimesMarkedAsToBeDoneToday
  )
    return -1;
  if (
    a.numberOfTimesMarkedAsToBeDoneToday < b.numberOfTimesMarkedAsToBeDoneToday
  )
    return 1;

  return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
};

export const transformTitle = (title: string) => {
  const removeMultipleSpaces = (str: string) => str.replace(/\s+/g, " ");
  const removeMultipleNewLines = (str: string) => str.replace(/\n+/g, "\n");
  const removeLeadingTrailingSpacesEachLine = (str: string) =>
    str.replace(/^\s+|\s+$/gm, "");
  const trim = (str: string) => str.trim();
  const capitaliseFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const transformers = [
    removeMultipleSpaces,
    removeMultipleNewLines,
    removeLeadingTrailingSpacesEachLine,
    trim,
    capitaliseFirstLetter,
  ];
  return transformers.reduce((acc, transformer) => transformer(acc), title);
};

export const transformDescription = (desc: string) => {
  const removeMultipleIntraLineSpaces = (str: string) =>
    str
      .split("\n")
      .map((line) => line.replace(/\s+/g, " "))
      .join("\n"); // remove multiple spaces in each line
  const removeLeadingTrailingSpacesEachLine = (str: string) =>
    str.replace(/^\s+|\s+$/gm, ""); // Removes spaces around the ends of each line.
  const trim = (str: string) => str.trim(); // Removes spaces around the ends of the entire string.
  const addMarkdownLineBreaks = (str: string) => str.replace(/\n/g, "  \n"); // Add line breaks to single line breaks for Markdown

  const transformers = [
    removeMultipleIntraLineSpaces,
    removeLeadingTrailingSpacesEachLine,
    addMarkdownLineBreaks,
    trim,
  ];
  return transformers.reduce((acc, transformer) => transformer(acc), desc);
};
