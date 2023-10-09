
import type { Todo } from "./TodoType";
import { useStore } from '@nanostores/react';

import { $todos, addTodo, updateTodo, softDeleteTodo, hardDeleteTodo, setFilterType, $filterType } from "../../stores/store";

export const ListSwitcher = () => {

    const todos = useStore($todos);
    const filterType = useStore($filterType);
    return (
        <>
            <div className="flex gap-x-8">
                <button
                    onClick={() => setFilterType("today")}
                    className={`rounded px-8 py-2 ${filterType === "today" ? "bg-black text-white" : "bg-white text-black border-2 border-black"}`}
                >
                    Today
                </button>

                <button
                    onClick={() => setFilterType("backlog")}
                    className={`rounded px-8 py-2 ${filterType === "backlog" ? "bg-black text-white" : "bg-white text-black border-2 border-black"}`}
                >
                    Backlog
                </button>

                {todos.some(todo => todo.isDone) &&
                    <button
                        onClick={() => setFilterType("done")}
                        className={`rounded px-8 py-2 ${filterType === "done" ? "bg-black text-white" : "bg-white text-black border-2 border-black"}`}
                    >
                        Done
                    </button>
                }

                <button
                    onClick={() => setFilterType("all")}
                    className={`rounded px-8 py-2 ${filterType === "all" ? "bg-black text-white" : "bg-white text-black border-2 border-black"}`}
                >
                    All
                </button>

            </div>
        </>
    );
};