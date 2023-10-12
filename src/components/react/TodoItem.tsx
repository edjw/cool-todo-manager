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

  const renderTimeInfo = (): JSX.Element => {
    let timesInfo: JSX.Element | string = "";

    if (todoMarkedForToday) {
      return (
        <>
          In Today for{" "}
          <span className="font-semibold">
            {ordinalOfTimesMarkedAsToBeDoneToday}
          </span>{" "}
          time | {createdTimeAgo} old
        </>
      );
    } else {
      const times = todo.numberOfTimesMarkedAsToBeDoneToday;

      if (times === 0) {
        timesInfo = "";
      } else if (times === 1) {
        timesInfo = (
          <>
            Was in Today <span className="font-semibold">1</span> time |{" "}
          </>
        );
      } else {
        timesInfo = (
          <>
            Was in Today <span className="font-semibold">{times}</span> times |{" "}
          </>
        );
      }

      return (
        <>
          {timesInfo}
          {createdTimeAgo} old
        </>
      );
    }
  };

  return (
    <li
      key={todo.id}
      className={`flex gap-x-4 items-center justify-between border-b py-2 ${
        todo.isDone && "opacity-40"
      }`}
    >
      <div className="w-full">
        <button
          onClick={() => openDialogWithTodo(todo)}
          className={`flex flex-col gap-y-4 w-full justify-start text-left select-auto

          `}
        >
          {todo.title}
          {!todo.isDone && (
            <>
              {!todo.isDone && (
                <span className="text-xs text-left select-none">
                  {renderTimeInfo()}
                </span>
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
