import { BackupButton } from "./BackupButton";
import { RestoreButton } from "./RestoreButton";

export const SettingsArea = () => {
  return (
    <details>
      <summary className="text-gray-500">Settings</summary>
      <div className="flex flex-col gap-y-4 pt-4">
        <BackupButton />
        <RestoreButton />
      </div>
    </details>
  );
};
