"use client";
import React, { useCallback, useMemo, useState } from "react";
import { fromZonedTime, toZonedTime, format as tzFormat } from "date-fns-tz";
import CalendarHeader from "./CalendarHeader";
import CalendarSlots from "./CalendarSlots";
import CalendarFooter from "./CalendarFooter";
import CalendarNavigation from "./CalendarNavigation";

type InputSlots = Record<string, { slots: string[] }>;
type BookedSlots = Record<string, Record<string, "booked">>;

interface ConvertedSlot {
    slot: string;
    ukDateKey: string;
    userZoned: Date;
    displayTime: string;
}

interface SelectedSlot {
    selectedSlot: string;
    displayTime: string;
    specialistTime: string;
}

interface BookingCalendarProps {
    inputSlots?: InputSlots;
    bookedSlots?: BookedSlots;
}

export default function BookingCalendar({
    inputSlots = {
        Sat: { slots: ["10:00", "10:30", "11:00"] },
        Sun: { slots: ["14:00", "14:30", "15:00"] },
        Mon: { slots: ["18:00", "18:30", "19:00"] },
    },
    bookedSlots = {
        "2025-09-27": { "10:00": "booked" },
        "2025-09-29": { "14:00": "booked", "14:30": "booked" },
    },
}: BookingCalendarProps) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const ukTimeZone = "Europe/London";

    const MAX_WEEKS = 8;
    const [page, setPage] = useState<number>(0);

    const startDate = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const days = useMemo(() => {
        const arr: Date[] = [];
        const base = new Date(startDate);
        base.setDate(base.getDate() + page * 7);
        for (let i = 0; i < 7; i++) {
            const d = new Date(base);
            d.setDate(base.getDate() + i);
            arr.push(d);
        }
        return arr;
    }, [startDate, page]);

    const ukSlotToLocal = useCallback(
        (date: Date, slot: string) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            const naive = `${yyyy}-${mm}-${dd} ${slot}:00`;
            const utcDate = fromZonedTime(naive, ukTimeZone);
            const userZoned = toZonedTime(utcDate, userTimeZone);
            return { utcDate, userZoned };
        },
        [userTimeZone]
    );

    const formatDisplay12h = useCallback(
        (d: Date) => tzFormat(d, "hh:mm a", { timeZone: userTimeZone }),
        [userTimeZone]
    );

    const formatISOWithOffset = useCallback(
        (d: Date) => tzFormat(d, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone }),
        [userTimeZone]
    );

    const weekdayShorts = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const convertedDays = useMemo(() => {
        return days.map((d) => {
            const weekday = weekdayShorts[d.getDay()];
            const ukSlots = inputSlots[weekday]?.slots || [];

            const converted: ConvertedSlot[] = ukSlots
                .map((s) => {
                    const { userZoned } = ukSlotToLocal(d, s);
                    const displayTime = formatDisplay12h(userZoned);
                    const ukDateKey = tzFormat(d, "yyyy-MM-dd", { timeZone: ukTimeZone });
                    return { slot: s, ukDateKey, userZoned, displayTime };
                })
                .sort((a, b) => a.userZoned.getTime() - b.userZoned.getTime());

            return { day: weekday, date: d, converted };
        });
    }, [days, inputSlots, ukSlotToLocal, formatDisplay12h]);

    const [selected, setSelected] = useState<SelectedSlot[]>([]);

    const toggleSlot = useCallback(
        (slotObj: ConvertedSlot) => {
            const key = formatISOWithOffset(slotObj.userZoned);
            const exists = selected.find((s) => s.selectedSlot === key);
            if (exists) {
                setSelected((s) => s.filter((x) => x.selectedSlot !== key));
                return;
            }
            if (selected.length >= 15) {
                return;
            }
            setSelected((s) => [
                ...s,
                {
                    selectedSlot: key,
                    displayTime: tzFormat(slotObj.userZoned, "HH:mm", { timeZone: userTimeZone }),
                    specialistTime: `${slotObj.slot} UK`,
                },
            ]);
        },
        [selected, formatISOWithOffset, userTimeZone]
    );

    const isWithin24Hours = useCallback((slotObj: ConvertedSlot) => {
        const now = new Date();
        return slotObj.userZoned.getTime() - now.getTime() < 24 * 60 * 60 * 1000;
    }, []);

    const isBooked = useCallback(
        (slotObj: ConvertedSlot) => {
            const ukKey = slotObj.ukDateKey;
            return bookedSlots[ukKey]?.[slotObj.slot] === "booked";
        },
        [bookedSlots]
    );

    const handleBookNow = useCallback(() => {
        if (selected.length === 0) {
            alert("Select at least 1 slot");
            return;
        }

        console.log(selected);
        alert("Booked payload logged in console");
    }, [selected]);

    const prevPage = () => setPage((p) => Math.max(0, p - 1));
    const nextPage = () => setPage((p) => Math.min(MAX_WEEKS - 1, p + 1));

    return (
        <div className="max-w-6xl mx-auto p-4 bg-white border border-gray-700 rounded">
            <CalendarNavigation
                page={page}
                MAX_WEEKS={MAX_WEEKS}
                prevPage={prevPage}
                nextPage={nextPage}
                userTimeZone={userTimeZone}
            />

            <div className="overflow-x-auto">
                <div className="min-w-max">
                    <CalendarHeader convertedDays={convertedDays} />
                    <CalendarSlots
                        convertedDays={convertedDays}
                        formatISOWithOffset={formatISOWithOffset}
                        isWithin24Hours={isWithin24Hours}
                        isBooked={isBooked}
                        selected={selected}
                        toggleSlot={toggleSlot}
                    />
                </div>
            </div>

            <CalendarFooter selected={selected} handleBookNow={handleBookNow} userTimeZone={userTimeZone} />
        </div>
    );
}
