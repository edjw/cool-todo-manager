import { useRef, useState } from "react";
import type { FC } from "react";
import { titleCase } from "title-case";
import { useStore } from "@nanostores/react";
import { formatDistanceToNow } from "date-fns";
import { enGB } from "date-fns/locale";
import converter from "number-to-words";

import {
  MarkAsDoneButton,
  SoftDeleteTodoButton,
  MoveToBacklogButton,
  MoveToTodayButton,
  HardDeleteAllDeletedTodosButton,
  SoftDeleteAllDoneTodosButton,
  HardDeleteSingleDeletedTodoButton,
  UnmarkAsDoneButton,
} from "./Buttons";
import type { Todo } from "../../types/TodoType";
import {
  $backlogTodos,
  $doneTodos,
  $todayTodos,
  $filterType,
  $allTodos,
  $deletedTodos,
} from "../../stores/store";
import { TodoDialog } from "./TodoDialog";

export const TodoActionButtons: FC<{ todo: Todo }> = ({ todo }) => {
  const filterType = useStore($filterType);
  const todoId = todo.id;

  const buttonMap = {
    done: [
      <SoftDeleteTodoButton todoId={todoId} />,
      <MoveToBacklogButton todoId={todoId} />,
      <MoveToTodayButton todoId={todoId} />,
    ],
    deleted: [
      <MoveToBacklogButton todoId={todoId} />,
      <MoveToTodayButton todoId={todoId} />,
      <HardDeleteSingleDeletedTodoButton todoId={todoId} />,
    ],
    backlog: [
      <MarkAsDoneButton name="MarkAsDoneButton" todoId={todoId} />,
      <MoveToTodayButton todoId={todoId} />,
      <SoftDeleteTodoButton todoId={todoId} />,
    ],
    today: [
      <UnmarkAsDoneButton name="UnmarkAsDoneButton" todoId={todoId} />,
      <MarkAsDoneButton name="MarkAsDoneButton" todoId={todoId} />,
      <MoveToBacklogButton todoId={todoId} />,
      <SoftDeleteTodoButton todoId={todoId} />,
    ],
    all: [
      <UnmarkAsDoneButton name="UnmarkAsDoneButton" todoId={todoId} />,
      <MarkAsDoneButton name="MarkAsDoneButton" todoId={todoId} />,
      <MoveToBacklogButton todoId={todoId} />,
      <MoveToTodayButton todoId={todoId} />,
      <SoftDeleteTodoButton todoId={todoId} />,
    ],
  };

  const buttons = buttonMap[filterType] || [];

  return (
    <>
      {buttons.map((button, index) => {
        if (button.props.name === "MarkAsDoneButton" && todo.isDone) {
          return null;
        }

        if (button.props.name === "UnmarkAsDoneButton" && !todo.isDone) {
          return null;
        }

        return <span key={index}>{button}</span>;
      })}
    </>
  );
};

const TodoItem: FC<{
  todo: Todo;
  openDialogWithTodo: (todo: Todo) => void;
}> = ({ todo, openDialogWithTodo }) => {
  const todoTitleElement = todo.isDone ? <s>{todo.title}</s> : todo.title;

  const timeAgo = formatDistanceToNow(todo.dateCreated, {
    addSuffix: false,
    locale: enGB,
  });

  const numberOfTimesMarkedAsToBeDoneToday = titleCase(
    converter.toWordsOrdinal(todo.numberOfTimesMarkedAsToBeDoneToday),
  );

  return (
    <li key={todo.id} className="flex gap-x-4 items-center justify-between">
      <div className="w-full border">
        <button
          onClick={() => openDialogWithTodo(todo)}
          className={`flex flex-col gap-y-4 w-full justify-start ${
            todo.isDone ? "line-through" : ""
          }`}
        >
          {todoTitleElement}

          {todo.numberOfTimesMarkedAsToBeDoneToday > 0 && (
            <span className="text-xs">
              {numberOfTimesMarkedAsToBeDoneToday} time in Today
            </span>
          )}

          {!todo.isDone && <span className="text-xs">{timeAgo} old</span>}
        </button>
      </div>
      <div className="flex gap-x-4">
        <TodoActionButtons todo={todo} />
      </div>
    </li>
  );
};

export const TodoList: FC = () => {
  const filterType = useStore($filterType);
  const allTodos = useStore($allTodos);
  const todayTodos = useStore($todayTodos);
  const backlogTodos = useStore($backlogTodos);
  const doneTodos = useStore($doneTodos);
  const deletedTodos = useStore($deletedTodos);

  let todos: Todo[] = [];

  if (filterType === "today") {
    todos = todayTodos;
  } else if (filterType === "all") {
    todos = allTodos;
  } else if (filterType === "backlog") {
    todos = backlogTodos;
  } else if (filterType === "done") {
    todos = doneTodos;
  } else if (filterType === "deleted") {
    todos = deletedTodos;
  }

  // Logging out the current filter"s todos
  console.log(todos);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const openDialogWithTodo = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setSelectedTodo(null);
  };

  return (
    <>
      {selectedTodo && (
        <TodoDialog
          todo={selectedTodo}
          onClose={closeDialog}
          dialogRef={dialogRef}
        />
      )}

      <div className="flex flex-col gap-y-8">
        <h2 className="text-2xl font-semibold pb-1 border-b max-w-xs">
          {titleCase(filterType)}
        </h2>

        {todos.length === 0 && <p>Nothing here</p>}

        <ul className="flex flex-col gap-y-12 max-w-3xl">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              openDialogWithTodo={openDialogWithTodo}
            />
          ))}
        </ul>

        {(filterType === "done" ||
          (filterType === "all" && doneTodos.length > 0)) && (
          <SoftDeleteAllDoneTodosButton />
        )}

        {filterType === "deleted" && deletedTodos.length > 0 && (
          <HardDeleteAllDeletedTodosButton />
        )}
      </div>
    </>
  );
};
