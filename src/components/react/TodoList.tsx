import type { FC, RefObject, FormEvent } from "react";
import { DeleteAllDoneTodosButton, MarkAsDoneButton, MoveToTodayOrBacklogButton, SoftDeleteTodoButton } from "./Buttons";
import type { Todo } from "./TodoType";
import { useStore } from '@nanostores/react';
import { $backlogTodos, $doneTodos, $todayTodos, $filterType, updateTodo, $allTodos } from "../../stores/store";
import { useEffect, useRef, useState } from "react";

const TodoItem: FC<{ todo: Todo, openDialogWithTodo: (todo: Todo) => void }> = ({ todo, openDialogWithTodo }) => {
    return (
        <li key={todo.id} className="flex gap-x-4 items-center justify-between">
            {todo.isDone ? (
                <>
                    <s>{todo.title}</s>
                    <SoftDeleteTodoButton todoId={todo.id} />
                </>
            ) : (
                <>
                    <button onClick={() => openDialogWithTodo(todo)} className="flex border w-full justify-start">
                        {todo.title}
                    </button>
                    <div className="flex gap-x-4">
                        <SoftDeleteTodoButton todoId={todo.id} />
                        <MarkAsDoneButton todoId={todo.id} />
                        {/* <MoveToTodayOrBacklogButton todoId={todo.id} /> */}
                    </div>
                </>
            )}
        </li>
    );
};

type TodoDialogProps = {
    todo: Todo | null;
    onClose: () => void;
    dialogRef: RefObject<HTMLDialogElement>;
};


const TodoDialog: FC<TodoDialogProps> = ({ todo, onClose, dialogRef }) => {
    if (!todo) return null;

    const [todoDescription, setTodoDescription] = useState(todo.description);



    useEffect(() => {
        if (todo && dialogRef.current) {
            dialogRef.current.showModal();
        } else if (!todo && dialogRef.current) {
            dialogRef.current.close();
        }
    }, [todo]);


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateTodo({ ...todo, description: todoDescription });
        onClose();
    };

    return (
        <dialog
            ref={dialogRef}
            className="fixed z-10 inset-0 overflow-y-auto bg-white w-full h-full"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true">


            <div className="flex items-center justify-end">
                <button
                    onClick={onClose}
                    className="border px-2 py-1 hover:bg-gray-200"
                >
                    ✕
                </button>
            </div>
            <div className="flex flex-col border px-8 py-4">
                <p className="text-2xl">
                    {todo.title}
                </p>
                <form
                    onSubmit={
                        (event) => handleSubmit(event)
                    }
                >
                    <textarea
                        name="todoDescription"
                        id="todoDescription"
                        cols={30}
                        rows={10}
                        className="border"
                        value={todoDescription}
                        onChange={(event) => setTodoDescription(event.target.value)}

                    >
                        {todo.description}
                    </textarea>
                    <button type="submit" className="border px-2 py-1 hover:bg-gray-200">
                        Save
                    </button>
                </form>
                <p>
                    {todo.dateCreated?.toLocaleDateString()}
                </p>
            </div>

        </dialog>
    )
};

export const TodoList: FC = () => {
    const filterType = useStore($filterType);
    const allTodos = useStore($allTodos);
    const todayTodos = useStore($todayTodos);
    const backlogTodos = useStore($backlogTodos);
    const doneTodos = useStore($doneTodos);

    let todos: Todo[] = [];

    if (filterType === "today") {
        todos = todayTodos;
    } else if (filterType === "all") {
        todos = allTodos;
    } else if (filterType === "backlog") {
        todos = backlogTodos;
    } else if (filterType === "done") {
        todos = doneTodos;
    }

    console.log(todos)


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
            {selectedTodo &&

                <TodoDialog todo={selectedTodo} onClose={closeDialog} dialogRef={dialogRef} />

            }

            <ul className="flex flex-col gap-y-8">
                {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} openDialogWithTodo={openDialogWithTodo} />
                ))}
            </ul>

            {(filterType === "done" || filterType === "all" && doneTodos.length > 0) && <DeleteAllDoneTodosButton />}
        </>
    );
};