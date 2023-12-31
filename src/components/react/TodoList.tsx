import { useState } from "react";
import type { FC } from "react";
import { titleCase } from "title-case";
import { useStore } from "@nanostores/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
import { TodoItem } from "./TodoItem";
import { isToday } from "date-fns";

export const TodoActionButtons: FC<{ todo: Todo }> = ({ todo }) => {
  const filterType = useStore($filterType);
  const todoId = todo.id;

  const buttonMap = {
    done: [
      <SoftDeleteTodoButton todoId={todoId} />,
      <MoveToBacklogButton name="MoveToBacklogButton" todoId={todoId} />,
      <MoveToTodayButton name="MoveToTodayButton" todoId={todoId} />,
    ],
    deleted: [
      <MoveToBacklogButton name="MoveToBacklogButton" todoId={todoId} />,
      <MoveToTodayButton name="MoveToTodayButton" todoId={todoId} />,
      <HardDeleteSingleDeletedTodoButton todoId={todoId} />,
    ],
    backlog: [
      <MoveToTodayButton name="MoveToTodayButton" todoId={todoId} />,
      <MarkAsDoneButton name="MarkAsDoneButton" todoId={todoId} />,
      <SoftDeleteTodoButton todoId={todoId} />,
    ],
    today: [
      <UnmarkAsDoneButton name="UnmarkAsDoneButton" todoId={todoId} />,
      <MarkAsDoneButton name="MarkAsDoneButton" todoId={todoId} />,
      <MoveToBacklogButton name="MoveToBacklogButton" todoId={todoId} />,
      <SoftDeleteTodoButton todoId={todoId} />,
    ],
    all: [
      <UnmarkAsDoneButton name="UnmarkAsDoneButton" todoId={todoId} />,
      <MarkAsDoneButton name="MarkAsDoneButton" todoId={todoId} />,
      <MoveToBacklogButton name="MoveToBacklogButton" todoId={todoId} />,
      <MoveToTodayButton name="MoveToTodayButton" todoId={todoId} />,
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

        if (
          button.props.name === "MoveToTodayButton" &&
          todo.dateMarkedAsToBeDoneToday &&
          isToday(todo.dateMarkedAsToBeDoneToday)
        ) {
          return null;
        }

        if (
          button.props.name === "MoveToBacklogButton" &&
          todo.dateMarkedAsToBeDoneToday &&
          !isToday(todo.dateMarkedAsToBeDoneToday)
        ) {
          return null;
        }

        if (
          button.props.name === "MoveToBacklogButton" &&
          filterType === "all" &&
          (todo.dateMarkedAsToBeDoneToday === undefined ||
            !isToday(todo.dateMarkedAsToBeDoneToday))
        ) {
          return null;
        }

        return <span key={index}>{button}</span>;
      })}
    </>
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

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const openDialogWithTodo = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const [parent, _enableAnimations] = useAutoAnimate();

  return (
    <>
      {selectedTodo && (
        <TodoDialog todo={selectedTodo} setSelectedTodo={setSelectedTodo} />
      )}

      <div className="flex flex-col gap-y-8">
        <h2 className="text-2xl font-semibold pb-1 border-b max-w-xs select-none">
          {titleCase(filterType)}
        </h2>

        {todos.length === 0 && <p className="select-none">Nothing here</p>}

        <ul ref={parent} className="flex flex-col gap-y-12 max-w-3xl">
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
