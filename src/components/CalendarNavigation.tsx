"use client";

interface CalendarNavigationProps {
  page: number;
  MAX_WEEKS: number;
  prevPage: () => void;
  nextPage: () => void;
  userTimeZone: string;
}

export default function CalendarNavigation({
  page,
  MAX_WEEKS,
  prevPage,
  nextPage,
  userTimeZone,
}: CalendarNavigationProps) {
  const isPrevDisabled = page === 0;
  const isNextDisabled = page === MAX_WEEKS - 1;

  const baseBtnClasses =
    "px-3 py-1 border rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <button
          onClick={prevPage}
          disabled={isPrevDisabled}
          aria-label="Previous week"
          className={`${baseBtnClasses} ${
            isPrevDisabled
              ? "cursor-not-allowed opacity-50 bg-gray-100 text-gray-400 border-gray-300"
              : "bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700 border-gray-400"
          }`}
        >
          ◀
        </button>
        <button
          onClick={nextPage}
          disabled={isNextDisabled}
          aria-label="Next week"
          className={`${baseBtnClasses} ${
            isNextDisabled
              ? "cursor-not-allowed opacity-50 bg-gray-100 text-gray-400 border-gray-300"
              : "bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700 border-gray-400"
          }`}
        >
          ▶
        </button>
        <div className="text-sm text-gray-600 ml-3">
          Week {page + 1} of {MAX_WEEKS}
        </div>
      </div>
      <div className="text-sm text-gray-600">
        Timezone: <span className="font-medium">{userTimeZone}</span>
      </div>
    </div>
  );
}
