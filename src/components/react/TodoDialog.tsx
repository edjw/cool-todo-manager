import {
  type RefObject,
  type FC,
  useState,
  useEffect,
  type FormEvent,
} from "react";
import { formatDistanceToNow, set } from "date-fns";
import { enGB } from "date-fns/locale";
import Markdown from "react-markdown";
import type { Literal, Parent, Node } from "unist";

import { updateTodo, $filterType, transformTitle } from "../../stores/store";
import type { Todo } from "../../types/TodoType";
import {
  HardDeleteSingleDeletedTodoButton,
  MarkAsDoneButton,
  MoveToBacklogButton,
  MoveToTodayButton,
  SoftDeleteTodoButton,
} from "./Buttons";

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

  const [showTitleEditor, setShowTitleEditor] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
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
      document.body.style.overflow = "hidden";
      dialogElement.addEventListener("cancel", handleCancelEvent);
    } else if (!todo && dialogElement) {
      dialogElement.close();
      document.body.style.overflow = "auto";
      dialogElement.removeEventListener("cancel", handleCancelEvent);
    }

    return () => {
      document.body.style.overflowY = "auto";
      dialogElement?.removeEventListener("cancel", handleCancelEvent);
    };
  }, [todo, dialogRef, onClose]);

  const handleTitleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const transformedTitle = transformTitle(todoTitle);
    updateTodo({ ...todo, title: transformedTitle });
    todo.title = transformedTitle;
    setTodoTitle(transformedTitle);
    setShowTitleEditor(false);
  };

  const handleDescriptionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTodo({ ...todo, description: todoDescription });
    todo.description = todoDescription;
    setShowDescriptionEditor(false);
  };

  const createdTimeAgo = formatDistanceToNow(todo.dateCreated, {
    addSuffix: false,
    locale: enGB,
  });

  const deletedTimeAgo = formatDistanceToNow(
    todo.dateDeleted ? todo.dateDeleted : 0,
    {
      addSuffix: false,
      locale: enGB,
    },
  );

  /// Custom rehype plugin to transform newlines to <br/>
  const rehypeNewlineToBr = (tree: Node) => {
    const isParent = (node?: Node): node is Parent =>
      node != null && "children" in node;
    const isLiteral = (node?: Node): node is Literal =>
      node != null && "value" in node;

    function visit(node: Node) {
      if (isLiteral(node)) {
        if (typeof node.value === "string") {
          node.value = node.value.replace(/\n/g, "<br />");
        }
      }

      if (isParent(node)) {
        node.children.forEach(visit);
      }
    }

    visit(tree);
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed z-10 inset-0 bg-white w-2/3 min-w-fit max-w-xl h-full rounded-xl"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-end pt-3 pr-4">
        <button
          onClick={onClose}
          className="border px-3 py-1 rounded hover:bg-gray-200"
          title="Close (Esc)"
        >
          ✕<span className="sr-only">Close (Esc)</span>
        </button>
      </div>
      <div className="flex flex-col px-8 py-4 gap-y-8">
        <div className="flex flex-col gap-y-2 border-b max-w-md">
          {!showTitleEditor && todo.title ? (
            <button
              className="text-2xl text-left"
              onClick={() => setShowTitleEditor(true)}
            >
              {todo.title}
            </button>
          ) : (
            <form
              className="flex flex-col gap-y-2 max-w-md w-full"
              onSubmit={(event) => handleTitleSubmit(event)}
            >
              <label htmlFor="todoTitle" className="sr-only">
                Title
              </label>
              <textarea
                name="todoTitle"
                id="todoTitle"
                className="border rounded"
                value={todoTitle}
                onChange={(event) => setTodoTitle(event.target.value)}
              ></textarea>

              <button
                type="submit"
                className="border rounded px-2 py-1 hover:bg-gray-200 max-w-[200px]"
              >
                Save
              </button>
            </form>
          )}

          {todo.numberOfTimesMarkedAsToBeDoneToday > 0 &&
            filterType === "today" && (
              <p className="text-sm text-gray-700">
                Was in Today{" "}
                <span className="font-semibold">
                  {todo.numberOfTimesMarkedAsToBeDoneToday}
                </span>{" "}
                times
              </p>
            )}

          <p className="text-sm text-gray-700">{createdTimeAgo} old</p>

          {todo.dateDeleted && (
            <p className="text-sm text-gray-700">
              Deleted {deletedTimeAgo} ago
            </p>
          )}

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
                className="cursor-pointer rounded max-w-md text-left"
                id="todoDescription"
              >
                <Markdown
                  rehypePlugins={[rehypeNewlineToBr]}
                  className="prose border px-2 py-2 rounded break-words"
                >
                  {todo.description}
                </Markdown>
              </button>
            </div>
          </>
        ) : (
          <>
            <form
              className="flex flex-col gap-y-2 max-w-md w-full"
              onSubmit={(event) => handleDescriptionSubmit(event)}
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
      </div>
    </dialog>
  );
};
