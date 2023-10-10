import { useStore } from "@nanostores/react";

import { $todos, setFilterType, $filterType, $backlogTodos, $allTodos, $todayTodos, $doneTodos, $deletedTodos } from "../../stores/store";
import type { filterTypes } from "../../types/filterTypes";
import { $isMenuOpen, toggleMenu } from "../../stores/uiStateStore";


type MenuButtonProps = {
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
};

const MenuButton: FC<MenuButtonProps> = ({ label, count, active, onClick }) => (
    <button
        onClick={onClick}
        className={`rounded px-8 py-2 ${active ? "bg-black text-white" : "bg-white text-black border-2 border-black"}`}
    >
        {label} <span className="text-sm">({count})</span>
    </button>
);



export const ListSwitcher = () => {

    const todos = useStore($todos);
    const backlogTodos = useStore($backlogTodos);
    const allTodos = useStore($allTodos);
    const todayTodos = useStore($todayTodos);
    const doneTodos = useStore($doneTodos);
    const deletedTodos = useStore($deletedTodos);

    const filterType = useStore($filterType);
    const isMenuOpen = useStore($isMenuOpen);

    const handleMenuButtonClick = (
        filterType: filterTypes
    ) => {
        toggleMenu();
        setFilterType(filterType);
    }


    return (
        <>
            <div className={`
            flex flex-col-reverse sm:flex-col gap-y-4 fixed sm:relative bottom-4 left-2 right-2
            ${isMenuOpen && "bg-white min-h-[100vh] z-10"}
            `}>
                <button className="flex sm:hidden self-end items-center justify-center hover:bg-gray-200 border rounded py-2 px-2 max-w-[50px] w-full"
                    onClick={() => toggleMenu()}
                    title={isMenuOpen ? "Close Menu" : "Open Menu"}
                >
                    {
                        isMenuOpen ?
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>

                                <span className="sr-only">Close Menu</span>
                            </>
                            :
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <span className="sr-only">Open Menu</span>
                            </>

                    }
                </button>

                <div className={`flex-col gap-y-4 ${isMenuOpen ? "flex" : "hidden sm:flex"}`}>

                    <MenuButton
                        label="Today"
                        count={todayTodos.length}
                        active={filterType === "today"}
                        onClick={() => handleMenuButtonClick("today")}
                    />

                    <MenuButton
                        label="Backlog"
                        count={backlogTodos.length}
                        active={filterType === "backlog"}
                        onClick={() => handleMenuButtonClick("backlog")}
                    />


                    <MenuButton
                        label="All"
                        count={allTodos.length}
                        active={filterType === "all"}
                        onClick={() => handleMenuButtonClick("all")}
                    />

                    {
                        todos.some(todo => todo.isDone) &&

                        <MenuButton
                            label="Done"
                            count={doneTodos.length}
                            active={filterType === "done"}
                            onClick={() => handleMenuButtonClick("done")}
                        />
                    }

                    {
                        todos.some(todo => todo.dateDeleted) &&

                        <MenuButton
                            label="Deleted"
                            count={deletedTodos.length}
                            active={filterType === "deleted"}
                            onClick={() => handleMenuButtonClick("deleted")}
                        />
                    }

                </div>
            </div >
        </>
    );
};