const downloadBackup = () => {
  const storedData = localStorage.getItem("todos");
  if (storedData) {
    const blob = new Blob([storedData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup.json";
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
