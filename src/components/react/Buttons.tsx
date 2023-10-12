import { getDate } from "date-fns";
import type { FC } from "react";
import {
  markTodoAsDone,
  softDeleteTodo,
  moveTodoToBacklog,
  moveTodoToToday,
  hardDeleteAllDeletedTodos,
  SoftDeleteAllDoneTodos,
  hardDeleteSingleDeletedTodo,
  unmarkTodoAsDone,
} from "../../stores/store";

export const HardDeleteAllDeletedTodosButton: FC = () => {
  const doubleCheck = () => {
    const confirmation = confirm(
      "Are you sure you want to delete all deleted todos? This action cannot be undone.",
    );
    return confirmation;
  };

  return (
    <button
      onClick={() => {
        if (doubleCheck()) {
          hardDeleteAllDeletedTodos();
        }
      }}
      title="Destroy All Deleted Todos"
      className="hover:bg-red-600 hover:text-gray-200 border border-gray-200 rounded max-w-[300px]"
    >
      Destroy All Deleted Todos
    </button>
  );
};

export const SoftDeleteAllDoneTodosButton: FC = () => {
  return (
    <button
      onClick={SoftDeleteAllDoneTodos}
      className="hover:bg-red-200 hover:text-gray-700  border border-gray-200 rounded max-w-[200px]"
      title="Delete All Done Todos"
    >
      Delete All Done Todos
    </button>
  );
};

export const SoftDeleteTodoButton: FC<{
  todoId: string;
  onClose?: () => void;
}> = ({ todoId, onClose }) => {
  const TrashSVG: FC = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );

  const handleSoftDelete = () => {
    if (onClose) onClose();
    softDeleteTodo(todoId);
  };

  return (
    <button
      onClick={() => handleSoftDelete()}
      title="Delete"
      className="hover:bg-red-200 hover:text-gray-700 rounded-full flex flex-col items-center p-2"
    >
      <TrashSVG />
      <span className="sr-only">Delete</span>
    </button>
  );
};

export const HardDeleteSingleDeletedTodoButton: FC<{
  todoId: string;
  onClose?: () => void;
}> = ({ todoId, onClose }) => {
  const doubleCheck = () => {
    const confirmation = confirm(
      "Are you sure you want to delete this todo? This action cannot be undone.",
    );
    return confirmation;
  };

  const handleHardDelete = () => {
    if (onClose) onClose();

    hardDeleteSingleDeletedTodo(todoId);
  };

  const TrashSVG: FC = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );

  return (
    <button
      onClick={() => {
        if (doubleCheck()) {
          handleHardDelete();
        }
      }}
      title="Destroy this todo"
      className="hover:bg-red-600 hover:text-gray-200 rounded-full p-2"
    >
      <TrashSVG />
      <span className="sr-only">Destroy</span>
    </button>
  );
};

export const MarkAsDoneButton: FC<{
  todoId: string;
  onClose?: () => void;
  name: string;
}> = ({ todoId, onClose, name }) => {
  const handleMarkAsDone = () => {
    if (onClose) onClose();
    markTodoAsDone(todoId);
  };

  const CheckmarkSVG: FC = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  return (
    <button
      onClick={() => handleMarkAsDone()}
      className="hover:bg-gray-200 rounded-full flex flex-col items-center p-2"
      title="Mark as Done"
    >
      <CheckmarkSVG />
      <span className="sr-only">Done</span>
    </button>
  );
};

export const UnmarkAsDoneButton: FC<{
  todoId: string;
  onClose?: () => void;
  name: string;
}> = ({ todoId, onClose, name }) => {
  const handleUnmarkAsDone = () => {
    if (onClose) onClose();
    unmarkTodoAsDone(todoId);
  };

  const BackArrowSVG: FC = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
      />
    </svg>
  );

  return (
    <button
      onClick={() => handleUnmarkAsDone()}
      className="hover:bg-gray-200 rounded-full flex flex-col items-center p-2"
      title="Mark as not done"
    >
      <BackArrowSVG />
      <span className="sr-only">Not Done</span>
    </button>
  );
};

export const MoveToTodayButton: FC<{
  todoId: string;
  onClose?: () => void;
  name: string;
}> = ({ todoId, onClose, name }) => {
  const MoveToTodaySVG = () => {
    const todayDate = getDate(new Date());

    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-6 h-6"
        >
          <text
            x="10"
            y="12"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="9"
          >
            {todayDate}
          </text>
          <g>
            <path
              fillRule="evenodd"
              d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
              clipRule="evenodd"
            />
          </g>
        </svg>
      </>
    );
  };

  const handleMoveToToday = () => {
    if (onClose) onClose();
    moveTodoToToday(todoId);
  };

  return (
    <button
      onClick={() => handleMoveToToday()}
      className="hover:bg-gray-200 rounded-full flex flex-col items-center p-2"
      title="Move to Today"
    >
      <MoveToTodaySVG />
      <span className="sr-only">Today</span>
    </button>
  );
};

export const MoveToBacklogButton: FC<{
  todoId: string;
  onClose?: () => void;
  name: string;
}> = ({ todoId, onClose, name }) => {
  const MoveToBacklogSVG = () => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
            clipRule="evenodd"
          />
        </svg>
      </>
    );
  };

  const handleMoveToBacklog = () => {
    if (onClose) onClose();
    moveTodoToBacklog(todoId);
  };

  return (
    <button
      onClick={() => handleMoveToBacklog()}
      className="hover:bg-gray-200 rounded-full flex flex-col items-center p-2"
      title="Move to Backlog"
    >
      <MoveToBacklogSVG />
      <span className="sr-only">Backlog</span>
    </button>
  );
};
