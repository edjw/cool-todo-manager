function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-M${month}-D${day}_H${hours}-M${minutes}-S${seconds}`;
}

const downloadBackup = () => {
  const storedData = localStorage.getItem("todos");
  if (storedData) {
    const blob = new Blob([storedData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = formatDate(new Date());
    a.href = url;
    a.download = `cool-todo-manager-backup_${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

export const BackupButton = () => {
  return (
    <>
      <div>
        <button
          onClick={downloadBackup}
          className="border rounded px-4 py-2 max-w-[150px]"
        >
          Backup Todos
        </button>
      </div>
    </>
  );
};
