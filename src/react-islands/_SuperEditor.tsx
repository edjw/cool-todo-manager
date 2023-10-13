import { $todos, updateTodo } from "../stores/store";
import { useStore } from "@nanostores/react";
import type { Todo } from "../types/TodoType";

const TodoSuperEditor = () => {
  const allTodos = useStore($todos);

  return (
    <>
      <main className={`grid grid-cols-1 h-full gap-x-20 gap-y-8 relative`}>
        <h2 className="font-semibold">A super editor for all todos</h2>
        <a
          href="/"
          className="underline
          "
        >
          ← Back to main interface
        </a>
        <div className="flex flex-col max-w-2xl gap-y-8">
          {allTodos.map((todo: Todo) => {
            return (
              <div
                className="flex flex-col gap-y-2 border-b pb-4"
                key={todo.id}
              >
                <p className="font-bold">{todo.title}</p>
                <form className="flex flex-col gap-y-4">
                  <label
                    htmlFor="title"
                    className="flex flex-col gap-y-1 text-sm"
                  >
                    Title
                    <textarea
                      name="title"
                      rows={2}
                      defaultValue={todo.title}
                      onChange={(event) => {
                        updateTodo({
                          ...todo,
                          title: event.target.value,
                        });
                      }}
                    />
                  </label>

                  {/* Todo: make this so it uses markdown like the dialog */}
                  {/* <label
                    htmlFor="description"
                    className="flex flex-col gap-y-1 text-sm"
                  >
                    Description
                    <textarea
                      name="description"
                      rows={5}
                      defaultValue={todo.description}
                      onChange={(event) => {
                        updateTodo({
                          ...todo,
                          description: event.target.value,
                        });
                      }}
                    />
                  </label> */}

                  <label
                    htmlFor="dateCreated"
                    className="flex flex-col gap-y-1 text-sm"
                  >
                    Date created
                    <input
                      type="date"
                      name="dateCreated"
                      max={new Date().toISOString().split("T")[0]}
                      value={todo.dateCreated.toISOString().split("T")[0]}
                      onChange={(event) => {
                        const newDate = new Date(event.target.value);
                        updateTodo({
                          ...todo,
                          dateCreated: newDate,
                        });
                      }}
                    />
                  </label>

                  <label
                    htmlFor="numberOfTimesMarkedAsToBeDoneToday"
                    className="flex flex-col gap-y-1 text-sm"
                  >
                    Number of times marked as to be done today
                    <input
                      type="number"
                      name="numberOfTimesMarkedAsToBeDoneToday"
                      min="0"
                      defaultValue={todo.numberOfTimesMarkedAsToBeDoneToday}
                      onChange={(event) => {
                        updateTodo({
                          ...todo,
                          numberOfTimesMarkedAsToBeDoneToday: Number(
                            event.target.value,
                          ),
                        });
                      }}
                    />
                  </label>

                  <label
                    htmlFor="dateLastMarkedAsToBeDoneToday"
                    className="flex flex-col gap-y-1 text-sm"
                  >
                    Date last marked as to be done today
                    <input
                      type="date"
                      name="dateLastMarkedAsToBeDoneToday"
                      max={new Date().toISOString().split("T")[0]}
                      value={
                        todo.dateMarkedAsToBeDoneToday
                          ?.toISOString()
                          .split("T")[0]
                      }
                      onChange={(event) => {
                        const newDate = new Date(event.target.value);
                        updateTodo({
                          ...todo,
                          dateMarkedAsToBeDoneToday: newDate,
                        });
                      }}
                    />
                  </label>

                  <label
                    htmlFor="done"
                    className="flex flex-col text-sm gap-y-1"
                  >
                    Done?
                    <div className="flex gap-x-4 items-center">
                      <p className="text-base">
                        {todo.isDone ? "Done" : "Not done"}
                      </p>
                      <button
                        type="button"
                        className="border rounded px-4 py-2 max-w-[150px]"
                        onClick={() => {
                          updateTodo({
                            ...todo,
                            isDone: !todo.isDone,
                          });
                        }}
                      >
                        {todo.isDone ? "Mark as Not Done" : "Mark as Done"}
                      </button>
                    </div>
                  </label>

                  <p className="text-sm">Deleted?</p>
                  <div className="flex gap-x-4 items-center">
                    <p className="text-base">
                      {todo.dateDeleted ? "Deleted" : "Not deleted"}
                    </p>
                    <button
                      type="button"
                      className="border rounded px-4 py-2 max-w-[150px]"
                      onClick={() => {
                        updateTodo({
                          ...todo,
                          dateDeleted: todo.dateDeleted
                            ? undefined
                            : new Date(),
                        });
                      }}
                    >
                      {todo.dateDeleted ? "Undelete" : "Delete"}
                    </button>
                  </div>

                  {todo.dateDeleted && (
                    <label
                      htmlFor="dateDeleted"
                      className="flex flex-col gap-y-1 text-sm"
                    >
                      Date deleted
                      <input
                        type="date"
                        name="dateDeleted"
                        max={new Date().toISOString().split("T")[0]}
                        value={
                          todo.dateDeleted
                            ? todo.dateDeleted.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(event) => {
                          const newDate = new Date(event.target.value);
                          updateTodo({
                            ...todo,
                            dateDeleted: newDate,
                          });
                        }}
                      />
                    </label>
                  )}
                </form>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default TodoSuperEditor;
