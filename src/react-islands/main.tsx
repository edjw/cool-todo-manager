import { TodoInput } from '../components/react/TodoInput';
import { TodoList } from '../components/react/TodoList';
import { differenceInDays } from 'date-fns';
import { ListSwitcher } from '../components/react/ListSwitcher';


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
            <div className="grid gap-y-8">
                <TodoInput />
                <ListSwitcher />
                <TodoList />

            </div>
        </>
    );
}

export default Main;