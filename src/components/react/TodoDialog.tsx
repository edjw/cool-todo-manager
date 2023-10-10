import { type RefObject, type FC, useState, useEffect, type FormEvent } from "react";
import { updateTodo } from "../../stores/store";
import type { Todo } from "./TodoType";
import { HardDeleteSingleDeletedTodoButton, MarkAsDoneButton, MoveToBacklogButton, MoveToTodayButton, SoftDeleteTodoButton } from "./Buttons";

type TodoDialogProps = {
    todo: Todo | null;
    onClose: () => void;
    dialogRef: RefObject<HTMLDialogElement>;
};


export const TodoDialog: FC<TodoDialogProps> = ({ todo, onClose, dialogRef }) => {
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


            <div className="flex items-center justify-end pt-6 pr-4">
                <button
                    onClick={onClose}
                    className="border px-3 py-2 rounded hover:bg-gray-200"
                    title="Close (Esc)"
                >
                    ✕
                </button>
            </div>
            <div className="flex flex-col px-8 py-4 gap-y-8">
                <p className="text-2xl self-start">
                    {todo.title}
                </p>
                <form
                    className="flex flex-col gap-y-4 max-w-md w-full"
                    onSubmit={
                        (event) => handleSubmit(event)
                    }
                >
                    <label htmlFor="todoDescription" className="flex flex-col text-sm">
                        Notes
                        <textarea
                            name="todoDescription"
                            id="todoDescription"
                            rows={10}
                            className="border"
                            value={todoDescription}
                            onChange={(event) => setTodoDescription(event.target.value)}

                        >
                            {todo.description}
                        </textarea>
                    </label>
                    <button type="submit" className="border rounded px-2 py-1 hover:bg-gray-200 max-w-[200px]">
                        Save
                    </button>
                </form>

                <div className="flex">
                    <MarkAsDoneButton todoId={todo.id} onClose={onClose} />
                    <MoveToBacklogButton todoId={todo.id} onClose={onClose} />
                    <MoveToTodayButton todoId={todo.id} onClose={onClose} />

                    {
                        !todo.dateDeleted &&
                        <SoftDeleteTodoButton todoId={todo.id} onClose={onClose} />
                    }

                    {
                        todo.dateDeleted &&
                        <HardDeleteSingleDeletedTodoButton todoId={todo.id} onClose={onClose} />
                    }
                </div>

                <p>
                    Created: {todo.dateCreated?.toLocaleDateString()}
                </p>

                {
                    todo.dateDeleted && (
                        <p>
                            Deleted: {todo.dateDeleted.toLocaleDateString()}
                        </p>
                    )
                }

            </div>

        </dialog>
    )
};
