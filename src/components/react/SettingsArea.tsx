import { BackupButton } from "./BackupButton";
import { RestoreButton } from "./RestoreButton";

export const SettingsArea = () => {
  return (
    <section className="flex flex-col gap-y-4 max-w-[150px]">
      <details className="[&_svg]:open:-rotate-180">
        <summary className="flex items-center list-none">
          <div>
            <svg
              className="-rotate-90 transform text-gray-500 transition-all duration-300"
              fill="none"
              height="20"
              width="20"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <span className="text-gray-500 rounded py-2 px-1">Manage data</span>
        </summary>
        <div className="flex flex-col gap-y-8 pt-4">
          <BackupButton />
          <RestoreButton />
        </div>
      </details>
    </section>
  );
};
