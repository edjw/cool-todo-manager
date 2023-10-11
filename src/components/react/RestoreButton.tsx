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
          className="border rounded py-2 px-4 max-w-[140px]"
        >
          Restore Todos
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
