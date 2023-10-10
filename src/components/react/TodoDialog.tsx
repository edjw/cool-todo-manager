import {
  type RefObject,
  type FC,
  useState,
  useEffect,
  type FormEvent,
} from "react";
import { formatDistanceToNow } from "date-fns";
import { enGB } from "date-fns/locale";
import { updateTodo, $filterType } from "../../stores/store";
import type { Todo } from "../../types/TodoType";
import {
  HardDeleteSingleDeletedTodoButton,
  MarkAsDoneButton,
  MoveToBacklogButton,
  MoveToTodayButton,
  SoftDeleteTodoButton,
} from "./Buttons";
import converter from "number-to-words";
import { titleCase } from "title-case";
import { useStore } from "@nanostores/react";

type TodoDialogProps = {
  todo: Todo | null;
  onClose: () => void;
  dialogRef: RefObject<HTMLDialogElement>;
};

export const TodoDialog: FC<TodoDialogProps> = ({
  todo,
  onClose,
  dialogRef,
}) => {
  if (!todo) return null;

  const [showDescriptionEditor, setShowDescriptionEditor] = useState(false);
  const [todoDescription, setTodoDescription] = useState(todo.description);

  const filterType = useStore($filterType);

  useEffect(() => {
    const dialogElement = dialogRef.current;

    function handleCancelEvent() {
      onClose();
    }

    if (todo && dialogElement) {
      dialogElement.showModal();
      dialogElement.addEventListener("cancel", handleCancelEvent);
    } else if (!todo && dialogElement) {
      dialogElement.close();
      dialogElement.removeEventListener("cancel", handleCancelEvent);
    }

    return () => {
      dialogElement?.removeEventListener("cancel", handleCancelEvent);
    };
  }, [todo, dialogRef, onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTodo({ ...todo, description: todoDescription });
    setShowDescriptionEditor(false);
  };

  const createdTimeAgo = formatDistanceToNow(todo.dateCreated, {
    addSuffix: false,
    locale: enGB,
  });

  const numberOfTimesMarkedAsToBeDoneToday = titleCase(
    converter.toWordsOrdinal(todo.numberOfTimesMarkedAsToBeDoneToday),
  );

  return (
    <dialog
      ref={dialogRef}
      className="fixed z-10 inset-0 overflow-y-auto bg-white w-full h-full"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-end pt-6 pr-4">
        <button
          onClick={onClose}
          className="border px-3 py-2 rounded hover:bg-gray-200"
          title="Close (Esc)"
        >
          ✕<span className="sr-only">Close (Esc)</span>
        </button>
      </div>
      <div className="flex flex-col px-8 py-4 gap-y-8">
        <div className="flex flex-col gap-y-2 border-b max-w-md">
          <p className="text-2xl self-start">{todo.title}</p>
          {todo.numberOfTimesMarkedAsToBeDoneToday > 0 &&
            filterType === "today" && (
              <p className="text-sm text-gray-700">
                <span>{numberOfTimesMarkedAsToBeDoneToday}</span> time in Today
              </p>
            )}

          <p className="text-sm text-gray-700">{createdTimeAgo} old</p>
          <div className="flex space-x-4 py-2">
            <MarkAsDoneButton
              name="MarkAsDoneButton"
              todoId={todo.id}
              onClose={onClose}
            />
            <MoveToBacklogButton todoId={todo.id} onClose={onClose} />
            <MoveToTodayButton todoId={todo.id} onClose={onClose} />

            {!todo.dateDeleted && (
              <SoftDeleteTodoButton todoId={todo.id} onClose={onClose} />
            )}

            {todo.dateDeleted && (
              <HardDeleteSingleDeletedTodoButton
                todoId={todo.id}
                onClose={onClose}
              />
            )}
          </div>
        </div>

        {!showDescriptionEditor && todo.description ? (
          <>
            <div className="flex flex-col gap-y-2">
              <label
                htmlFor="todoDescription"
                className="flex flex-col text-sm text-gray-700"
              >
                Notes
              </label>

              <button
                onClick={() => setShowDescriptionEditor(true)}
                className="flex justify-start cursor-pointer rounded max-w-md"
                id="todoDescription"
              >
                {todo.description}
              </button>
            </div>
          </>
        ) : (
          <>
            <form
              className="flex flex-col gap-y-2 max-w-md w-full"
              onSubmit={(event) => handleSubmit(event)}
            >
              <label
                htmlFor="todoDescription"
                className="flex flex-col text-sm"
              >
                Notes
                <textarea
                  name="todoDescription"
                  id="todoDescription"
                  rows={10}
                  className="border rounded"
                  value={todoDescription}
                  onChange={(event) => setTodoDescription(event.target.value)}
                >
                  {todo.description}
                </textarea>
              </label>
              <button
                type="submit"
                className="border rounded px-2 py-1 hover:bg-gray-200 max-w-[200px]"
              >
                Save
              </button>
            </form>
          </>
        )}

        {todo.dateDeleted && (
          <p>Deleted: {todo.dateDeleted.toLocaleDateString()}</p>
        )}
      </div>
    </dialog>
  );
};
