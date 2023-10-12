import { useRef, useEffect } from "react";
import type { FC, FormEvent, Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
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
  todo: Todo;
  setSelectedTodo: Dispatch<SetStateAction<Todo | null>>;
};

export const TodoDialog: FC<TodoDialogProps> = ({ todo, setSelectedTodo }) => {
  if (!todo) return null;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTitleEditor, setShowTitleEditor] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [showDescriptionEditor, setShowDescriptionEditor] = useState(false);
  const [todoDescription, setTodoDescription] = useState(todo.description);

  const filterType = useStore($filterType);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (todo) {
      showDialog();
    }
  }, [todo]);

  const showDialog = (): void => {
    if (dialogRef.current) {
      setSelectedTodo(todo);
      setIsDialogOpen(true);
      dialogRef.current.showModal();
      document.body.style.overflow = "hidden";
      dialogRef.current.addEventListener("cancel", handleCancelEvent);
    }
  };

  const closeDialog = (): void => {
    if (dialogRef.current) {
      setSelectedTodo(null);
      setIsDialogOpen(false);
      dialogRef.current.close();
      document.body.style.overflow = "auto";
      dialogRef.current.removeEventListener("cancel", handleCancelEvent);
    }
  };

  const handleCancelEvent = (): void => {
    closeDialog();
  };

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
      className={`fixed inset-0 flex items-center justify-center bg-white rounded w-full h-full ${
        isDialogOpen ? "block" : "hidden"
      }`}
      ref={dialogRef}
      onClick={closeDialog}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white p-4 rounded-lg h-full w-full sm:w-1/2 sm:h-5/6 relative"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 rounded border px-4 py-3"
          aria-label="Close"
          onClick={closeDialog}
        >
          ✕
        </button>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-2 border-b max-w-md">
            {!showTitleEditor && todo.title ? (
              <button
                className="text-2xl text-left select-auto"
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
                <p className="text-sm text-gray-700 select-none">
                  Was in Today{" "}
                  <span className="font-semibold">
                    {todo.numberOfTimesMarkedAsToBeDoneToday}
                  </span>{" "}
                  times
                </p>
              )}

            <p className="text-sm text-gray-700 select-none">
              {createdTimeAgo} old
            </p>

            {todo.dateDeleted && (
              <p className="text-sm text-gray-700 select-none">
                Deleted {deletedTimeAgo} ago
              </p>
            )}

            <div className="flex space-x-4 py-2">
              {!todo.isDone && (
                <MarkAsDoneButton
                  name="MarkAsDoneButton"
                  todoId={todo.id}
                  onClose={closeDialog}
                />
              )}

              {filterType !== "backlog" && (
                <MoveToBacklogButton
                  name="Move To Backlog Button"
                  todoId={todo.id}
                  onClose={closeDialog}
                />
              )}

              {filterType !== "today" && (
                <MoveToTodayButton
                  name="Move to Today Button"
                  todoId={todo.id}
                  onClose={closeDialog}
                />
              )}

              {!todo.dateDeleted && (
                <SoftDeleteTodoButton todoId={todo.id} onClose={closeDialog} />
              )}

              {todo.dateDeleted && (
                <HardDeleteSingleDeletedTodoButton
                  todoId={todo.id}
                  onClose={closeDialog}
                />
              )}
            </div>
          </div>

          {!showDescriptionEditor && todo.description ? (
            <>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="todoDescription"
                  className="flex flex-col text-sm text-gray-700 select-none"
                >
                  Notes
                </label>

                <button
                  onClick={() => setShowDescriptionEditor(true)}
                  className="cursor-pointer rounded max-w-md text-left select-auto"
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
                className="flex flex-col gap-y-4 max-w-md w-full"
                onSubmit={(event) => handleDescriptionSubmit(event)}
              >
                <label
                  htmlFor="todoDescription"
                  className="flex flex-col text-sm max-h-60 sm:max-h-96 select-none"
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
      </div>
    </dialog>
  );
};
