import { useState, useEffect, } from 'react';
import type { FC, SetStateAction, FormEvent, Dispatch } from 'react';
import { isToday, getDate } from 'date-fns'


type Todo = {
    id: number;
    title: string;
    isDone: boolean;
    isDeleted: boolean;
    dateMarkedAsToBeDoneToday?: Date;
};

const TodoInput: FC<{
    todos: Todo[];
    setTodos: Dispatch<SetStateAction<Todo[]>>;
    inputValue: string;
    setInputValue: Dispatch<SetStateAction<string>>;
}> = ({ todos, setTodos, inputValue, setInputValue }) => {
    const [toBeDoneToday, setToBeDoneToday] = useState<boolean>(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setTodos([...todos,
        {
            id: todos.length + 1,
            title: inputValue,
            isDone: false,
            isDeleted: false,
            dateMarkedAsToBeDoneToday: toBeDoneToday ? new Date() : undefined,
        }]);
        setInputValue("");
        setToBeDoneToday(false);
    };

    return (
        <form className="flex gap-x-8 items-start" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-y-4">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="flex items-center gap-x-4 relative">
                    <label htmlFor="today" className={
                        `
                        select-none cursor-pointer px-4 py-1 outline outline-bg-gray-800 rounded-lg flex justify-center gap-x-1 min-w-[100px]
                        ${toBeDoneToday && "bg-gray-800 outline outline-gray-900 text-white"}

                    `}>
                        Today
                        {
                            !toBeDoneToday ? (
                                <span>
                                    ?
                                </span>)
                                : (
                                    <span>
                                        ✓
                                    </span>
                                )
                        }
                    </label>
                    <input
                        type="checkbox"
                        name="today"
                        id="today"
                        className="opacity-0 absolute"
                        checked={toBeDoneToday}
                        onChange={() => setToBeDoneToday(!toBeDoneToday)}
                    />
                </div>
            </div>
            <button type="submit" className="border-2 border-black rounded py-2 px-4">+</button>
        </form >
    );
};

const MarkTodoAsDoneButton: FC<{
    todos: Todo[];
    setTodos: Dispatch<SetStateAction<Todo[]>>;
    todoId: number;
}> = ({ todos, setTodos, todoId }) => {

    const markAsDone = () => {
        const updatedTodos = todos.map(todo =>
            todo.id === todoId ? { ...todo, isDone: true } : todo
        );
        setTodos(updatedTodos);
    };

    const CheckmarkSVG = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

        );
    };

    return (
        <button
            onClick={markAsDone}
            title="Mark as Done"
        >
            <CheckmarkSVG />
        </button>
    );
}

const MarkTodoAsForTodayButton: FC<{
    todos: Todo[];
    setTodos: Dispatch<SetStateAction<Todo[]>>;
    todoId: number;
}> = ({
    todos,
    setTodos,
    todoId,
}) => {
        const todo = todos.find(todo => todo.id === todoId);
        if (!todo) return null;

        const toggleToBeDoneToday = (todoId: number) => {
            const updatedTodos = todos.map(todo =>
                todo.id === todoId ? { ...todo, dateMarkedAsToBeDoneToday: todo.dateMarkedAsToBeDoneToday ? undefined : new Date() } : todo
            );
            setTodos(updatedTodos);
        };

        const MoveToTodaySVG = () => {
            const todayDate = getDate(new Date());

            return (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">

                        <text x="10" y="12" textAnchor="middle" dominantBaseline="central" fontSize="9">

                            {todayDate}
                        </text>
                        <g>
                            <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                        </g>
                    </svg>
                </>
            );
        };

        const MoveToBacklogSVG = () => {
            return (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                    </svg>

                </>
            )
        }

        return (
            <button
                onClick={() => toggleToBeDoneToday(todo.id)}
                className="border border-black rounded hover:bg-gray-100 px-1 py-0.5"
                title={
                    todo.dateMarkedAsToBeDoneToday && isToday(todo.dateMarkedAsToBeDoneToday)
                        ? 'Move to Backlog'
                        : 'Move to Today'
                }
            >
                {todo.dateMarkedAsToBeDoneToday && isToday(todo.dateMarkedAsToBeDoneToday) ? <MoveToBacklogSVG /> : <MoveToTodaySVG />}
            </button>
        );
    };


const DeleteTodoButton: FC<{
    todos: Todo[];
    setTodos: Dispatch<SetStateAction<Todo[]>>;
    todoId: number;
}> = ({ todos, setTodos, todoId }) => {

    const deleteTodo = () => {
        const updatedTodos = todos.map(todo =>
            todo.id === todoId ? { ...todo, isDeleted: true } : todo
        );
        setTodos(updatedTodos);
    };

    const TrashSVG = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>

        );
    };

    return (
        <button onClick={deleteTodo}>
            <TrashSVG />
        </button>
    );
};


interface TodoListProps {
    todos: Todo[];
    setTodos: Dispatch<SetStateAction<Todo[]>>;
    filterType?: string;
}

const TodoList: FC<TodoListProps> = ({
    todos,
    setTodos,
    filterType = "today",
}) => {

    let filteredTodos = todos.filter((todo) => !todo.isDeleted);

    if (filterType === "today") {
        filteredTodos = todos.filter((todo) => {
            return !todo.isDone &&
                todo.dateMarkedAsToBeDoneToday !== undefined &&
                isToday(todo.dateMarkedAsToBeDoneToday);
        });
    }


    if (filterType === "backlog") {
        filteredTodos = todos.filter((todo) => {
            return !todo.isDone && (todo.dateMarkedAsToBeDoneToday === undefined ||
                (todo.dateMarkedAsToBeDoneToday && !isToday(todo.dateMarkedAsToBeDoneToday)));
        });

    }


    if (filterType === "done") {
        filteredTodos = todos.filter((todo) => todo.isDone);
    }


    return (
        <>
            <ul className="flex flex-col gap-y-8">
                {filteredTodos.map((todo) => (
                    <li key={todo.id} className="flex gap-x-4 items-center justify-between">

                        {todo.isDone ?
                            (<>
                                <s>{todo.title}</s>
                                <DeleteTodoButton todos={todos} setTodos={setTodos} todoId={todo.id} />
                            </>)
                            :
                            (
                                <>
                                    <span>{todo.title}</span>
                                    <div className="flex gap-x-4">
                                        {/* <span>
                                            {todo.dateMarkedAsToBeDoneToday &&
                                                todo.dateMarkedAsToBeDoneToday.toLocaleDateString()}
                                        </span> */}
                                        <DeleteTodoButton todos={todos} setTodos={setTodos} todoId={todo.id} />
                                        <MarkTodoAsDoneButton todos={todos} setTodos={setTodos} todoId={todo.id} />
                                        <MarkTodoAsForTodayButton todos={todos} setTodos={setTodos} todoId={todo.id} />
                                    </div>
                                </>
                            )
                        }
                    </li>
                ))}


            </ul>
        </>
    );
}




const Main = () => {

    const [filterType, setFilterType] = useState<string>("all");

    const [todos, setTodos] = useState<Todo[]>(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos
            ? JSON.parse(savedTodos).map((todo: any) => {
                if (todo.dateMarkedAsToBeDoneToday) {
                    todo.dateMarkedAsToBeDoneToday = new Date(todo.dateMarkedAsToBeDoneToday);
                }
                return todo;
            })
            : [];
    });

    const [inputValue, setInputValue] = useState<string>(() => {
        const savedInputValue = localStorage.getItem('inputValue');
        return savedInputValue ? savedInputValue : '';
    });

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    useEffect(() => {
        localStorage.setItem('inputValue', inputValue);
    }, [inputValue]);
    return (
        <>
            <div className="grid gap-y-8">
                <TodoInput
                    todos={todos}
                    setTodos={setTodos}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                />

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

                    <button
                        onClick={() => setFilterType("all")}
                        className={`rounded px-8 py-2 ${filterType === "all" ? "bg-black text-white" : "bg-white text-black border-2 border-black"}`}
                    >
                        All
                    </button>

                    <button
                        onClick={() => setFilterType("done")}
                        className={`rounded px-8 py-2 ${filterType === "done" ? "bg-black text-white" : "bg-white text-black border-2 border-black"}`}
                    >
                        Done
                    </button>





                </div>

                <TodoList todos={todos} setTodos={setTodos} filterType={filterType} />

            </div>
        </>
    );
}

export default Main;