import React, { useState } from "react";
import { useNavigate } from "react-router";

function DashedHRLine({ duration }) {
    return (
        <div className="inline-flex flex-col items-center justify-center relative">
            <hr className="md:w-64 w-32 my-4 border border-dashed rounded dark:bg-gray-700" />
            <div className="absolute px-4 -translate-x-1/2 top-2 bg-white left-1/2 dark:bg-gray-900">
                <svg
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-500 dark:text-gray-300"
                    fill="#6b7280"
                >
                    <path d="M8.4 12H2.8L1 15H0V5h1l1.8 3h5.6L6 0h2l4.8 8H18a2 2 0 1 1 0 4h-5.2L8 20H6l2.4-8z" />
                </svg>
            </div>
            <div className="">{duration}</div>
        </div>
    );
}

function FlightSearchResult({ flights, departure, destination }) {
    const navigate = useNavigate();
    const [visibleFlights, setVisibleFlights] = useState(10);

    const showMoreFlights = () => {
        setVisibleFlights((prev) => prev + 10);
    };

    const handleGetFlightInfo = (flight) => {
        navigate(`/flight/${flight.id}`, {
            state: { flight, departure, destination },
        });
    };

    return (
        <div className="flex flex-col max-w-5xl mx-auto gap-4 py-8">
            {flights.slice(0, visibleFlights).map((flight) => (
                <div
                    key={flight.id}
                    className="border border-blue-100 rounded-2xl cursor-pointer p-4 pt-0 shadow-sm hover:shadow-md transition-all bg-white"
                    onClick={() => handleGetFlightInfo(flight)}
                >
                    {flight.tags && (
                        <div className="flex justify-end mt-4 -mb-2">
                            {flight.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-green-100 text-green-800 text-xs font-medium ms-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    {flight.legs.map((leg, index) => (
                        <div
                            key={leg.id}
                            className="my-2 pt-2 pb-4 border-b border-dashed"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    <div className="flex-col items-center justify-center hidden sm:flex">
                                        <img
                                            src={
                                                leg.carriers.marketing[0]
                                                    ?.logoUrl
                                            }
                                            alt={
                                                leg.carriers.marketing[0]?.name
                                            }
                                            className="h-8 w-8"
                                        />
                                    </div>
                                    <p className="font-medium flex flex-col">
                                        <span className="max-sm:flex max-sm:flex-col text-center">
                                            <span className="max-sm:text-sm max-sm:text-gray-600 max-sm:order-2">
                                                {leg.origin.displayCode}
                                            </span>
                                            <span className="max-sm:hidden"> - </span>
                                            {new Intl.DateTimeFormat("en-US", {
                                                hour: "numeric",
                                                minute: "numeric",
                                                hour12: true,
                                            }).format(new Date(leg.departure))}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {
                                                new Date(leg.departure)
                                                    .toLocaleString()
                                                    .split(",")[0]
                                            }
                                        </span>
                                    </p>
                                </div>
                                <DashedHRLine
                                    duration={`${Math.floor(
                                        leg.durationInMinutes / 60
                                    )}h 
                                    ${leg.durationInMinutes % 60}m`}
                                />
                                <div>
                                    <p className="font-medium flex flex-col text-center sm:flex-row">
                                        <span className="max-sm:text-sm max-sm:order-2 max-sm:text-gray-600 ">
                                            {leg.destination.displayCode}
                                        </span>
                                        <span className="max-sm:hidden">
                                            {" "}
                                            -&nbsp;
                                        </span>
                                        {new Intl.DateTimeFormat("en-US", {
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                        }).format(new Date(leg.arrival))}
                                    </p>
                                    <p className="text-sm text-gray-500 text-end">
                                        {
                                            new Date(leg.arrival)
                                                .toLocaleString()
                                                .split(",")[0]
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 sm:mt-0">
                                <div className="flex items-center justify-center text-gray-400 gap-2 text-sm">
                                    <img
                                        src={leg.carriers.marketing[0]?.logoUrl}
                                        alt={leg.carriers.marketing[0]?.name}
                                        className="h-6 w-6 sm:hidden"
                                    />
                                    {leg.carriers.marketing[0]?.name}
                                </div>
                                <p className="text-sm text-gray-400">
                                    {leg.stopCount > 0
                                        ? leg.stopCount === 1
                                            ? `1 Stop`
                                            : `${leg.stopCount} stops`
                                        : "Non-stop"}
                                </p>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between flex-wrap items-center pt-1">
                        <div className="text-xs text-gray-500 order-2 md:order-1">
                            {flight.farePolicy.isChangeAllowed
                                ? "Changes Allowed"
                                : "Changes Not Allowed"}{" "}
                            |{" "}
                            {flight.farePolicy.isCancellationAllowed
                                ? "Refundable"
                                : "Non-Refundable"}
                        </div>

                        <div className="order-1 md:order-2">
                            <h3 className="text-xl font-semibold">
                                {flight.price.formatted}
                            </h3>
                        </div>
                    </div>
                </div>
            ))}
            {visibleFlights < flights.length && (
                <button
                    onClick={showMoreFlights}
                    className="self-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm mt-4 hover:bg-blue-700 transition-colors"
                >
                    Show More
                </button>
            )}
        </div>
    );
}

export default FlightSearchResult;
