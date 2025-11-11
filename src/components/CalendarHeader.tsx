"use client";
export default function CalendarHeader({ convertedDays }: { convertedDays: any[] }) {
  return (
    <div role="row" className="grid grid-cols-7 gap-2 pb-3 border-b mb-4 text-center">
      {convertedDays.map((col, idx) => (
        <div role="columnheader" key={idx} className="px-2">
          <div className="font-semibold text-black">{col.day}</div>
          <div className="font-semibold text-black">{col.date.getDate()}</div>
        </div>
      ))}
    </div>
  );
}
