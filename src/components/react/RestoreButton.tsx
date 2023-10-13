import { useState, useRef } from "react";
import { TodosSchema } from "../../types/TodoType";
import type { Todo } from "../../types/TodoType";
import { $todos } from "../../stores/store";

export const RestoreButton = () => {
  const [importOption, setImportOption] = useState<"overwrite" | "merge">(
    "overwrite",
  );

  const parseTodoData = (data: any): Todo[] | null => {
    let preProcessedData = data.map((item: Todo) => ({
      ...item,
      dateCreated: new Date(item.dateCreated),
      dateDeleted: item.dateDeleted ? new Date(item.dateDeleted) : undefined,
      dateMarkedAsToBeDoneToday: item.dateMarkedAsToBeDoneToday
        ? new Date(item.dateMarkedAsToBeDoneToday)
        : undefined,
    }));

    const parsed = TodosSchema.safeParse(preProcessedData);

    if (parsed.success) {
      return parsed.data;
    }

    console.error("Invalid data:", parsed.error);
    return null;
  };

  const mergeTodoData = (existing: Todo[], newData: Todo[]): Todo[] => {
    const existingIdSet = new Set(existing.map((item) => item.id));
    const newItems = newData.filter((item) => !existingIdSet.has(item.id));
    return [...existing, ...newItems];
  };

  const validateAndStore = (data: any) => {
    const parsedData = parseTodoData(data);
    if (!parsedData) return;

    let finalData: Todo[];

    if (importOption === "merge") {
      const existingDataJSON = localStorage.getItem("todos");
      const existingData = existingDataJSON ? JSON.parse(existingDataJSON) : [];
      finalData = mergeTodoData(existingData, parsedData);
    } else {
      finalData = parsedData;
    }

    localStorage.setItem("todos", JSON.stringify(finalData));
    $todos.set(finalData); // refreshes the UI basically
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          validateAndStore(jsonData);
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      };

      reader.readAsText(file);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const initiateRestore = () => {
    // Programmatically trigger the file input
    inputRef.current?.click();
  };

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <input
          ref={inputRef}
          type="file"
          accept=".json"
          onChange={handleFileInput}
          className="hidden"
        />

        <button
          onClick={initiateRestore}
          className="border rounded px-4 py-2 flex items-center text-left"
        >
          Restore todos
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
        </button>

        <div className="flex flex-col gap-y-2">
          <label className="flex gap-x-2 items-center text-sm cursor-pointer">
            <input
              name="importOption"
              type="radio"
              value="overwrite"
              checked={importOption === "overwrite"}
              onChange={() => setImportOption("overwrite")}
            />
            Overwrite
          </label>
          <label className="flex gap-x-2 items-center text-sm cursor-pointer">
            <input
              name="importOption"
              type="radio"
              value="merge"
              checked={importOption === "merge"}
              onChange={() => setImportOption("merge")}
            />
            Merge
          </label>
        </div>
      </div>
    </>
  );
};
