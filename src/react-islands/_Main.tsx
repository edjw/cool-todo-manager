import { ListSwitcher } from "../components/react/ListSwitcher";
import { TodoInput } from "../components/react/TodoInput";
import { TodoList } from "../components/react/TodoList";

const Main = () => {
  return (
    <>
      <main
        className={`grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-20 gap-y-8 relative`}
      >
        <aside className="flex flex-col gap-y-8">
          <ListSwitcher />
        </aside>

        <div className="grid grid-cols-1 grid-rows-[auto_1fr] gap-y-12">
          <TodoInput />
          <TodoList />
        </div>
      </main>
    </>
  );
};

export default Main;
