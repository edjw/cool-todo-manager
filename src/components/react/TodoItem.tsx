import { formatDistanceToNow, isToday } from "date-fns";
import { enGB } from "date-fns/locale";
import converter from "number-to-words";
import type { FC } from "react";
import { titleCase } from "title-case";
import type { Todo } from "../../types/TodoType";
import { TodoActionButtons } from "./TodoList";

export const TodoItem: FC<{
  todo: Todo;
  openDialogWithTodo: (todo: Todo) => void;
}> = ({ todo, openDialogWithTodo }) => {
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

  const ordinalOfTimesMarkedAsToBeDoneToday = titleCase(
    converter.toOrdinal(todo.numberOfTimesMarkedAsToBeDoneToday),
  );

  const todoMarkedForToday: boolean = todo.dateMarkedAsToBeDoneToday
    ? isToday(todo.dateMarkedAsToBeDoneToday)
    : false;

  const renderTimeInfo = () => {
    if (todoMarkedForToday) {
      return `In Today for ${ordinalOfTimesMarkedAsToBeDoneToday} time | ${createdTimeAgo} old`;
    } else {
      const times = todo.numberOfTimesMarkedAsToBeDoneToday;
      let timesInfo = "";

      if (times === 0) {
        timesInfo = "";
      } else if (times === 1) {
        timesInfo = "Was in Today 1 time | ";
      } else {
        timesInfo = `Was in Today ${times} times | `;
      }
      return `${timesInfo}${createdTimeAgo} old`;
    }
  };

  return (
    <li
      key={todo.id}
      className="flex gap-x-4 items-center justify-between border-b pb-2"
    >
      <div className="w-full">
        <button
          onClick={() => openDialogWithTodo(todo)}
          className={`flex flex-col gap-y-4 w-full justify-start text-left

          `}
        >
          {todoTitleElement}

          {!todo.isDone && (
            <>
              {!todo.isDone && (
                <span className="text-xs text-left">{renderTimeInfo()}</span>
              )}
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
