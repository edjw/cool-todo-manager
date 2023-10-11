import { useState, useRef } from "react";
import { TodosSchema } from "../../types/TodoType";
import type { Todo } from "../../types/TodoType";

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
    <div className="flex flex-col items-start">
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        onChange={handleFileInput}
        className="hidden"
      />

      <button
        onClick={initiateRestore}
        className="border-2 border-black rounded py-2 px-4 hover:bg-black hover:text-white"
      >
        Restore
      </button>

      <div className="flex">
        <label className="mr-4">
          <input
            type="radio"
            value="overwrite"
            checked={importOption === "overwrite"}
            onChange={() => setImportOption("overwrite")}
          />
          Overwrite
        </label>
        <label>
          <input
            type="radio"
            value="merge"
            checked={importOption === "merge"}
            onChange={() => setImportOption("merge")}
          />
          Merge
        </label>
      </div>
    </div>
  );
};
