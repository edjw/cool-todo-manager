import { ListSwitcher } from '../components/react/ListSwitcher';
import { TodoInput } from '../components/react/TodoInput';
import { TodoList } from '../components/react/TodoList';
// import { differenceInDays } from 'date-fns';

const Main = () => {

    // useEffect(() => {
    //     // Logic to clean up todos. Remove todos that were deleted more than 7 days ago
    //     const cleanedTodos = todos.filter((todo) => {
    //         if (todo.dateDeleted) {
    //             const dateDeleted = new Date(todo.dateDeleted);
    //             const diffInDays = differenceInDays(new Date(), dateDeleted);
    //             return diffInDays <= 7;
    //         }
    //         return true;
    //     });

    //     if (cleanedTodos.length !== todos.length) {
    //         setTodos(cleanedTodos);
    //     }
    // }, [todos]);


    return (
        <>
            <main className={`grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-20`}>
                <aside>
                    <ListSwitcher />
                </aside>
                <div className="grid grid-cols-1 grid-rows-[auto_1fr] gap-y-12">
                    <TodoInput />
                    <TodoList />
                </div>
            </main>

        </>
    );
}

export default Main;