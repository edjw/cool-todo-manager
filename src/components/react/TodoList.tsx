import type { FC } from "react";
import { MarkAsDoneButton, SoftDeleteTodoButton, MoveToBacklogButton, MoveToTodayButton, HardDeleteAllDeletedTodosButton, SoftDeleteAllDoneTodosButton, HardDeleteSingleDeletedTodoButton } from "./Buttons";
import type { Todo } from "./TodoType";
import { useStore } from '@nanostores/react';
import { $backlogTodos, $doneTodos, $todayTodos, $filterType, $allTodos, $deletedTodos } from "../../stores/store";
import { useRef, useState } from "react";
import { TodoDialog } from "./TodoDialog";

export const TodoActionButtons: FC<{ todo: Todo }> = ({ todo }) => {
    const filterType = useStore($filterType);
    const todoId = todo.id;

    const buttonMap = {
        "done": [
            <SoftDeleteTodoButton todoId={todoId} />,
            <MoveToBacklogButton todoId={todoId} />,
            <MoveToTodayButton todoId={todoId} />
        ],
        "deleted": [
            <MoveToBacklogButton todoId={todoId} />,
            <MoveToTodayButton todoId={todoId} />,
            <HardDeleteSingleDeletedTodoButton todoId={todoId} />
        ],
        "backlog": [
            <MarkAsDoneButton todoId={todoId} />,
            <MoveToTodayButton todoId={todoId} />,
            <SoftDeleteTodoButton todoId={todoId} />
        ],
        "today": [
            <MarkAsDoneButton todoId={todoId} />,
            <MoveToBacklogButton todoId={todoId} />,
            <SoftDeleteTodoButton todoId={todoId} />
        ],
        "all": [
            <MarkAsDoneButton todoId={todoId} />,
            <MoveToBacklogButton todoId={todoId} />,
            <MoveToTodayButton todoId={todoId} />,
            <SoftDeleteTodoButton todoId={todoId} />
        ],
    };

    const buttons = buttonMap[filterType] || [];

    return (
        <>
            {buttons.map((button, index) => (
                <span key={index}>
                    {button}
                </span>
            ))}
        </>
    );
};


const TodoItem: FC<{ todo: Todo, openDialogWithTodo: (todo: Todo) => void }> = ({ todo, openDialogWithTodo }) => {

    const todoTitleElement = todo.isDone ? <s>{todo.title}</s> : todo.title;
    return (
        <li key={todo.id} className="flex gap-x-4 items-center justify-between">
            <button onClick={() => openDialogWithTodo(todo)} className={`flex w-full justify-start ${todo.isDone ? "line-through" : ""}`}>
                {todoTitleElement}
            </button>
            <div className="flex gap-x-4">
                <TodoActionButtons todo={todo} />
            </div>
        </li>
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
    }
    else if (filterType === "deleted") {
        todos = deletedTodos;
    }

    console.log(todos);

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

            {
                todos.length === 0 &&
                <p>
                    Nothing here
                </p>

            }

            <ul className="flex flex-col gap-y-8 max-w-xl">
                {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} openDialogWithTodo={openDialogWithTodo} />
                ))}
            </ul>



            {(filterType === "done" || filterType === "all" && doneTodos.length > 0) && <SoftDeleteAllDoneTodosButton />}

            {filterType === "deleted" && deletedTodos.length > 0 &&
                <HardDeleteAllDeletedTodosButton />}
        </>
    );
};