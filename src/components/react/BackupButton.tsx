function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-M${month}-D${day}_H${hours}-M${minutes}-S${seconds}`;
}

const downloadBackupAsJSON = ({
  key = "todos",
  outputFilename = "cool-todo-manager-backup",
  useDate = true,
}: {
  key?: string;
  outputFilename?: string;
  useDate?: boolean;
} = {}) => {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    const blob = new Blob([storedData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = formatDate(new Date());
    a.href = url;
    a.download = `${outputFilename}${useDate ? `_${date}` : ""}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Free up blob memory
  } else {
    console.error(`No data found in the ${key} key localStorage for backup.`);
  }
};

export const BackupButton = () => {
  return (
    <>
      <div>
        <button
          onClick={() => downloadBackupAsJSON()}
          className="border rounded px-4 py-2 max-w-[150px]"
        >
          Backup Todos
        </button>
      </div>
    </>
  );
};
