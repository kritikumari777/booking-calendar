"use client";
interface SelectedSlot {
  selectedSlot: string;
  displayTime: string;
  specialistTime: string;
}

interface CalendarFooterProps {
  selected: SelectedSlot[];
  handleBookNow: () => void;
  userTimeZone: string;
}

export default function CalendarFooter({
  selected,
  handleBookNow,
  userTimeZone,
}: CalendarFooterProps) {
  return (
    <div>
      <div className="flex items-center justify-between mt-4 border-t pt-3">
        <div className="text-sm text-gray-700 w-90">
          {selected.length > 0 ? (
            <div>
              Selected ({selected.length}):
              <span className="font-medium"> {selected.map((s) => `${s.displayTime} (${s.specialistTime})`).join(", ")}</span>
            </div>
          ) : (
            <span>No slot selected</span>
          )}
        </div>

        <button
          onClick={handleBookNow}
          className="bg-blue-700 cursor-pointer text-white px-4 py-2 rounded text-sm font-semibold disabled:opacity-60"
          disabled={selected.length === 0}
          aria-disabled={selected.length === 0}
        >
          Book Now
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Timezone: <span className="font-medium">{userTimeZone}</span>. Slots within 24 hours or already booked are disabled.
      </div>
    </div>
  );
}
