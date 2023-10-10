import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import type { FC, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";

import { $filterType, addTodo } from "../../stores/store";

export const TodoInput: FC = () => {
  const [toBeDoneToday, setToBeDoneToday] = useState(false);
  const filterType = useStore($filterType);

  useEffect(() => {
    if (filterType === "today") {
      setToBeDoneToday(true);
    } else {
      setToBeDoneToday(false);
    }
  }, [filterType]);

  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!inputValue) {
      return;
    }
    addTodo({
      id: uuidv4(),
      title: inputValue,
      description: "",
      dateCreated: new Date(),
      isDone: false,
      dateDeleted: undefined,
      dateMarkedAsToBeDoneToday: toBeDoneToday ? new Date() : undefined,
      numberOfTimesMarkedAsToBeDoneToday: toBeDoneToday ? 1 : 0,
    });

    setInputValue("");
    setToBeDoneToday(false);
  };

  return (
    <div>
      <form className="flex gap-x-8 items-start" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-x-4 gap-y-4">
          <input
            type="text"
            value={inputValue}
            placeholder="Add a todo"
            onChange={(event) => setInputValue(event.target.value)}
            className="border px-4 py-2 rounded-lg min-w-[200px]"
          />
          <div className="flex items-center gap-x-4 relative group">
            <label
              htmlFor="today"
              title="Add to today's todos"
              className={`
                        select-none cursor-pointer px-2 py-0.5 outline outline-bg-gray-800 rounded-lg flex justify-center gap-x-1 items-center group-focus:ring group-focus:ring-blue-400 min-w-[100px]

                        ${
                          toBeDoneToday &&
                          "bg-gray-800 outline outline-gray-900 text-white"
                        }

                    `}
            >
              Today
              {!toBeDoneToday ? <span>?</span> : <span>✓</span>}
              <input
                type="checkbox"
                name="today"
                id="today"
                className="opacity-0 absolute"
                checked={toBeDoneToday}
                onChange={() => setToBeDoneToday(!toBeDoneToday)}
              />
            </label>
          </div>
        </div>
        <button
          type="submit"
          title="Add a todo"
          className="
          border-2 border-black rounded py-2 px-4 -mt-px hover:bg-black hover:text-white
          "
        >
          Add
        </button>
      </form>
    </div>
  );
};
