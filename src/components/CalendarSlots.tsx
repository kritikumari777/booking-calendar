"use client";

type ConvertedSlot = {
  slot: string;
  ukDateKey: string;
  userZoned: Date;
  displayTime: string;
};

type SelectedSlot = {
  selectedSlot: string;
  displayTime: string;
  specialistTime: string;
};

export default function CalendarSlots({
  convertedDays,
  formatISOWithOffset,
  isWithin24Hours,
  isBooked,
  selected,
  toggleSlot,
}: {
  convertedDays: any[];
  formatISOWithOffset: (d: Date) => string;
  isWithin24Hours: (s: ConvertedSlot) => boolean;
  isBooked: (s: ConvertedSlot) => boolean;
  selected: SelectedSlot[];
  toggleSlot: (s: ConvertedSlot) => void;
}) {
  return (
    <div role="grid" aria-label="Available time slots" className="grid grid-cols-7 gap-2 text-center">
      {convertedDays.map((col: any, idx: number) => (
        <div role="row" key={idx} className="px-1">
          {col.converted.length === 0 ? (
            <div className="text-gray-400 bg-gray-100 py-1 rounded" role="cell">No Slots</div>
          ) : (
            <div className="flex flex-col items-center" role="rowgroup">
              {col.converted.map((slot: ConvertedSlot, j: number) => {
                const key = formatISOWithOffset(slot.userZoned);
                const disabled = isWithin24Hours(slot) || isBooked(slot);
                const isSelected = !!selected.find((s) => s.selectedSlot === key);
                const ariaLabel = `${col.day} ${col.date.getDate()} ${slot.displayTime} — ${slot.slot} UK ${disabled ? " unavailable" : " available"}`;

                return (
                  <button
                    key={j}
                    role="button"
                    aria-label={ariaLabel}
                    aria-pressed={isSelected}
                    aria-disabled={disabled}
                    onClick={() => !disabled && toggleSlot(slot)}
                    onKeyDown={(e) => {
                      if (disabled) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleSlot(slot);
                      }
                    }}
                    tabIndex={0}
                    className={`w-20 cursor-pointer py-1 border text-sm font-medium rounded mb-2 ${
                      disabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isSelected
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                  >
                    {slot.displayTime}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
