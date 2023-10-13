import { BackupButton } from "./BackupButton";
import { RestoreButton } from "./RestoreButton";

export const SettingsArea = () => {
  return (
    <section className="flex flex-col gap-y-4 max-w-[150px]">
      <details className="[&_svg#manage-data-chevron]:-rotate-90 [&_svg#manage-data-chevron]:open:rotate-180 [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex items-center list-none">
          <span className="text-gray-500 rounded py-2 px-1  motion:safe:animate-bounce">
            Manage data
          </span>
          <svg
            id="manage-data-chevron"
            className="transform text-gray-500 transition-all duration-300"
            fill="none"
            height="20"
            width="20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </summary>
        <div className="flex flex-col gap-y-8 py-4">
          <a
            href="/supereditor"
            className="border rounded py-2 pl-4 pr-4 w-full flex items-center"
          >
            <span className="text-left">Super Editor</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 ml-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          </a>
          <BackupButton />
          <RestoreButton />
        </div>
      </details>
    </section>
  );
};
