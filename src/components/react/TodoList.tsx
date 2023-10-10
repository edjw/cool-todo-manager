import { useRef, useState } from "react";
import type { FC } from "react";
import { titleCase } from "title-case";
import { useStore } from "@nanostores/react";
import { formatDistanceToNow, isToday } from "date-fns";
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
  const filterType = useStore($filterType);

  const todoTitleElement = todo.isDone ? (
    <>
      <s>{todo.title}</s>
    </>
  ) : (
    todo.title
  );

  const createdTimeAgo = formatDistanceToNow(todo.dateCreated, {
    addSuffix: false,
    locale: enGB,
  });

  // const addedToTodayTimeAgo = todo.dateMarkedAsToBeDoneToday
  //   ? formatDistanceToNow(todo.dateMarkedAsToBeDoneToday, {
  //       addSuffix: false,
  //       locale: enGB,
  //     })
  //   : "Not set";

  const numberOfTimesMarkedAsToBeDoneToday = titleCase(
    converter.toWordsOrdinal(todo.numberOfTimesMarkedAsToBeDoneToday),
  );

  const todoMarkedForToday: boolean = todo.dateMarkedAsToBeDoneToday
    ? isToday(todo.dateMarkedAsToBeDoneToday)
    : false;

  return (
    <li
      key={todo.id}
      className="flex gap-x-4 items-center justify-between border-b pb-2"
    >
      <div className="w-full">
        <button
          onClick={() => openDialogWithTodo(todo)}
          className={`flex flex-col gap-y-4 w-full justify-start

          `}
        >
          {todoTitleElement}

          {!todo.isDone && (
            <>
              {todoMarkedForToday ? (
                <>
                  <span className="text-xs text-left">
                    {numberOfTimesMarkedAsToBeDoneToday} time in Today |{" "}
                    {createdTimeAgo} old
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs text-left">{createdTimeAgo} old</span>
                </>
              )}

              {/* {filterType === "today" && (
                <span className="text-xs text-left">
                  {addedToTodayTimeAgo} since added to Today
                </span>
              )} */}
            </>
          )}
        </button>
      </div>
      <div className="flex">
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
