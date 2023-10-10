import { useStore } from '@nanostores/react';

import { $todos, setFilterType, $filterType, $backlogTodos, $allTodos, $todayTodos, $doneTodos, $deletedTodos } from "../../stores/store";
import { $isMenuOpen, toggleMenu } from '../../stores/uiStateStore';
import { is } from 'date-fns/locale';


export const ListSwitcher = () => {

    const todos = useStore($todos);
    const backlogTodos = useStore($backlogTodos);
    const allTodos = useStore($allTodos);
    const todayTodos = useStore($todayTodos);
    const doneTodos = useStore($doneTodos);
    const deletedTodos = useStore($deletedTodos);

    const filterType = useStore($filterType);
    const isMenuOpen = useStore($isMenuOpen);


    return (
        <>
            <button className="
            sm:hidden
            hover:bg-gray-200
            "
                onClick={() => toggleMenu()}

            >
                {
                    isMenuOpen ?
                        // <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                        //     viewBox="0 0 24 24" stroke="currentColor"
                        //     onClick={() => toggleMenu()}
                        // >
                        //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        //         d="M6 18L18 6M6 6l12 12" />
                        // </svg>

                        <>
                            Close
                        </>

                        :
                        <>
                            Open
                        </>
                    // <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                    //     viewBox="0 0 24 24" stroke="currentColor"
                    //     onClick={() => toggleMenu()}
                    // >
                    //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    //         d="M4 6h16M4 12h16M4 18h16" />
                    // </svg>
                }
            </button>

            <div className={`flex-col gap-y-4 ${isMenuOpen ? "flex" : "hidden sm:flex"}`}>
                <button
                    onClick={() => setFilterType("today")}
                    className={`rounded px-8 py-2 ${filterType === "today" ? "bg-black text-white" : "bg-white text-black border-2 border-black"}`}
                >
                    Today <span className="text-sm">({todayTodos.length})</span>
                </button>

                <button
                    onClick={() => setFilterType("backlog")}
                    className={`rounded px-8 py-2 ${filterType === "backlog" ? "bg-black text-white" : "bg-white text-black border-2 border-black"}`}
                >
                    Backlog <span className="text-sm">({backlogTodos.length})</span>
                </button >



                <button
                    onClick={() => setFilterType("all")}
                    className={`rounded px-8 py-2 ${filterType === "all" ? "bg-black text-white" : "bg-white text-black border-2 border-black"}`}
                >
                    All <span className="text-sm">({allTodos.length})</span>
                </button >

                {
                    todos.some(todo => todo.isDone) &&
                    <button
                        onClick={() => setFilterType("done")}
                        className={`rounded px-8 py-2 ${filterType === "done" ? "bg-black text-white" : "bg-white text-black border-2 border-black"}`}
                    >
                        Done <span className="text-sm">({doneTodos.length})</span>
                    </button>
                }
                {
                    todos.some(todo => todo.dateDeleted) &&
                    <button
                        onClick={() => setFilterType("deleted")}
                        className={`rounded px-8 py-2 ${filterType === "deleted" ? "bg-black text-white" : "bg-white text-black border-2 border-black"}`}
                    >
                        Deleted <span className="text-sm">({deletedTodos.length})</span>
                    </button >
                }


            </div >
        </>
    );
};