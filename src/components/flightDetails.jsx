import {
    ArrowRightIcon,
    ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

function FlightDetails() {
    const location = useLocation();
    const { flight, departure, destination } = location.state || {};

    const [error, setError] = useState(null);

    function calculateLayover(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        const diffMs = Math.abs(end - start);

        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;

        const formattedHours = hours.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");

        return `${formattedHours}h ${formattedMinutes}min`;
    }

    return (
        <>
            <div className="md:p-6 p-4 mt-6 mb-6 max-w-4xl mx-auto">
                <div className="text-xl md:text-2xl font-semibold mb-4">
                    {flight.legs[0].origin.city} (
                    {flight.legs[0].origin.displayCode})
                    {flight?.legs[0]?.destination.displayCode ===
                    flight?.legs[1]?.origin.displayCode ? (
                        <ArrowsRightLeftIcon
                            height={20}
                            className="inline-block mx-2 text-gray-500"
                        />
                    ) : (
                        <ArrowRightIcon
                            height={20}
                            className="inline-block mx-2 text-gray-500"
                        />
                    )}{" "}
                    {flight.legs[0].destination.city} (
                    {flight.legs[0].destination.displayCode})
                    <span className="block text-sm font-normal text-gray-600">
                        {flight?.legs[0]?.destination.displayCode ===
                        flight?.legs[1]?.origin.displayCode
                            ? "Round Trip"
                            : "One Way"}
                        &nbsp;&middot;{" "}
                        {flight.farePolicy.isChangeAllowed
                            ? "Changes Allowed"
                            : "Changes Not Allowed"}
                        &nbsp;&middot;{" "}
                        {flight.farePolicy.isCancellationAllowed
                            ? "Refundable"
                            : "Non-Refundable"}
                    </span>
                </div>

                <div className="flex flex-wrap justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gray-800 mb-2">
                        {flight.price.formatted}
                    </span>
                    <div className="flex gap-2 mb-2">
                        {flight?.tags?.map((tag, i) => (
                            <span
                                className="bg-green-100 text-green-600 px-3 py-1 rounded-md text-sm"
                                key={i}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    {flight.legs.map((leg) => (
                        <div
                            key={leg.id}
                            className="py-6 px-6 md:px-9 border bg-white border-gray-200 rounded-2xl"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="">
                                    <div>
                                        <span className="font-medium">
                                            {leg.origin.city}
                                        </span>{" "}
                                        ({leg.origin.displayCode}) →{" "}
                                        <span className="font-medium">
                                            {leg.destination.city}
                                        </span>{" "}
                                        ({leg.destination.displayCode})
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {Math.floor(leg.durationInMinutes / 60)}
                                        h {leg.durationInMinutes % 60}m
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                {leg.carriers.marketing.map((carrier) => (
                                    <img
                                        key={carrier.id}
                                        src={carrier.logoUrl}
                                        alt={carrier.name}
                                        className="w-10 h-10 rounded-full"
                                        title={carrier.name}
                                    />
                                ))}
                            </div>
                            <div className="text-sm text-gray-600 mb-4">
                                {leg.stopCount > 0
                                    ? leg.stopCount === 1
                                        ? `1 Stop`
                                        : `${leg.stopCount} stops`
                                    : "Non-stop"}
                            </div>

                            <div className="space-y-4">
                                {leg.segments.map((segment, index) => (
                                    <div key={segment.id}>
                                        <div
                                            key={segment.id}
                                            className="border-s-2 border-dashed border-blue-200 relative pl-4 py-2"
                                        >
                                            <div className="absolute w-3 h-3 bg-blue-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                            <div className="font-medium">
                                                {new Intl.DateTimeFormat(
                                                    "en-US",
                                                    {
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        hour12: true,
                                                    }
                                                ).format(
                                                    new Date(segment.departure)
                                                )}{" "}
                                                &middot; {segment.origin.name}{" "}
                                                Airport (
                                                {segment.origin.displayCode})
                                            </div>
                                            <div className="text-sm text-gray-600 mb-3">
                                                {
                                                    new Date(segment.departure)
                                                        .toLocaleString()
                                                        .split(",")[0]
                                                }
                                            </div>
                                            <div className="absolute w-3 h-3 bg-blue-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                            <div className="font-medium">
                                                {new Intl.DateTimeFormat(
                                                    "en-US",
                                                    {
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        hour12: true,
                                                    }
                                                ).format(
                                                    new Date(segment.arrival)
                                                )}{" "}
                                                &middot;{" "}
                                                {segment.destination.name}{" "}
                                                Airport (
                                                {
                                                    segment.destination
                                                        .displayCode
                                                }
                                                )
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {
                                                    new Date(segment.arrival)
                                                        .toLocaleString()
                                                        .split(",")[0]
                                                }
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-600 pl-4 my-3">
                                            Flight: {segment.flightNumber} by{" "}
                                            {segment.marketingCarrier.name}
                                        </div>
                                        {leg.segments[index + 1] && (
                                            <div className="border-y py-4 my-4">
                                                {calculateLayover(
                                                    segment.arrival,
                                                    leg.segments[index + 1]
                                                        ?.departure
                                                )}{" "}
                                                layover
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
export default FlightDetails;
