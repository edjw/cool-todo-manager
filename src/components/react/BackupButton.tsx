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
          className="border rounded px-4 py-2 flex items-center text-left"
        >
          Backup todos
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
        </button>
      </div>
    </>
  );
};
