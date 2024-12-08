import React, { useEffect, useState } from "react";
import axios from "axios";
import AirportSearch from "./airportSearch";
import FlightSearchResult from "./flightSearchResult";
import {
    ArrowRightIcon,
    ArrowsRightLeftIcon,
    CalendarDateRangeIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import NearbyAirports from "./nearbyAirports";

function FlightSearchForm({ currentAirport, nearbyAirports }) {
    const [tripType, setTripType] = useState("round-trip");
    const [passengers, setPassengers] = useState(1);
    const [flightClass, setFlightClass] = useState("economy");
    const [departure, setDeparture] = useState(currentAirport || {});
    const [destination, setDestination] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [flights, setFlights] = useState({});

    useEffect(() => {
        setDeparture(currentAirport || {});
    }, [currentAirport]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        const options = {
            method: "GET",
            url: import.meta.env.VITE_SEARCH_FLIGHT,
            params: {
                originSkyId: departure?.skyId,
                destinationSkyId: destination?.skyId,
                originEntityId: departure?.entityId,
                destinationEntityId: destination?.entityId,
                date: data?.departureDate,
                returnDate: data?.returnDate,
                cabinClass: data?.flightClass,
                adults: data?.passengers,
                sortBy: "best",
                currency: "USD",
                market: "en-US",
                countryCode: "US",
            },
            headers: {
                "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY,
                "x-rapidapi-host": import.meta.env.VITE_RAPID_API_HOST,
            },
        };
        console.log("Search Data:", options);

        try {
            const response = await axios.request(options);
            console.log(response);
            setFlights(response.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch flights. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="max-w-5xl mx-auto p-6 bg-blue-50 
                mt-[-7%] max-lg:-mt-[10%] max-md:mt-0 z-50 
                max-md:bg-blue-100
                max-md:-mx-4 max-md:rounded-none max-md:px-4
                relative rounded-2xl my-4"
            >
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="bg-white flex-fixed w-full sm:w-1/2 md:w-1/2 lg:w-1/3 rounded-full border border-blue-200 p-1">
                        <div className="flex items-stretch justify-stretch h-full">
                            <label
                                className="py-1 px-3 w-full has-[:checked]:bg-blue-100 rounded-l-full flex items-center justify-center transition-all leading-0"
                                htmlFor="tripTypeRound"
                            >
                                <input
                                    type="radio"
                                    name="tripType"
                                    id="tripTypeRound"
                                    value="round-trip"
                                    checked={tripType === "round-trip"}
                                    onChange={() => setTripType("round-trip")}
                                    className="appearance-none"
                                />
                                <ArrowsRightLeftIcon
                                    height={16}
                                    className="inline-block mr-2"
                                />
                                <span className="inline-block">Round Trip</span>
                            </label>
                            <label
                                className="p-1 w-full has-[:checked]:bg-blue-100 py-1 px-3 flex items-center justify-center transition-all rounded-r-full"
                                htmlFor="tripTypeOW"
                            >
                                <input
                                    type="radio"
                                    name="tripType"
                                    id="tripTypeOW"
                                    value="one-way"
                                    checked={tripType === "one-way"}
                                    onChange={() => setTripType("one-way")}
                                    className="appearance-none"
                                />
                                <ArrowRightIcon
                                    height={16}
                                    className="inline-block mr-2"
                                />
                                <span className="inline-block">One Way</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center border border-blue-200 leading-none bg-white rounded-full overflow-hidden">
                        <label
                            htmlFor="passengers"
                            className="bg-blue-100 rounded-full ml-1 my-1 h-8 w-8 flex items-center justify-center"
                        >
                            <UserIcon height={18} />
                        </label>
                        <input
                            type="number"
                            name="passengers"
                            id="passengers"
                            min="1"
                            value={passengers}
                            onChange={(e) => setPassengers(e.target.value)}
                            required
                            className="bg-inherit border-gray-300 grow-1 w-12 rounded-md p-2 focus:outline-none"
                        />
                    </div>

                    <div className="border border-blue-200 rounded-full flex-remain md:flex-fixed">
                        <select
                            name="flightClass"
                            id="flightClass"
                            value={flightClass}
                            onChange={(e) => setFlightClass(e.target.value)}
                            required
                            className="block md:w-fit py-2 w-full px-4 h-full focus:outline-none border-r-8 border-transparent rounded-full"
                        >
                            <option value="economy">Economy</option>
                            <option value="premium_economy">
                                Premium Economy
                            </option>
                            <option value="business">Business</option>
                            <option value="first">First Class</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 relative justify-between">
                    <div className="flex flex-fixed w-full md:w-[60%] rounded-full divide-x">
                        <AirportSearch
                            onItemClick={(item) => setDeparture(item)}
                            label="Departure"
                            itemId="departureLocation"
                            inputClassName="rounded-l-full border-r-transparent"
                            currentAirort={currentAirport}
                        />
                        <AirportSearch
                            onItemClick={(item) => setDestination(item)}
                            label="Destination"
                            itemId="destinationLocation"
                            inputClassName="rounded-r-full border-l-transparent"
                            currentAirort={destination}
                        />
                    </div>
                    <div className="border rounded-full relative border-blue-200 divide-x flex-remain flex overflow-hidden">
                        <CalendarDateRangeIcon
                            height={20}
                            className="text-gray-500 absolute top-[11px] left-3"
                        />
                        <input
                            name="departureDate"
                            id="departureDate"
                            type="text"
                            onFocus={(e) => {
                                e.target.type = "date";
                                e.target.showPicker();
                            }}
                            onBlur={(e) => (e.target.type = "text")}
                            min={new Date().toISOString().split("T")[0]}
                            required
                            placeholder="Departure"
                            className={`h-[41.6px] grow-1 shrink-0 basis-[auto] w-1/2 py-2 pl-10 pr-4 text-inherit transition-all focus:outline-none ${
                                tripType === "round-trip" ? "w-1/2" : "w-full"
                            }`}
                        />
                        {tripType === "round-trip" && (
                            <input
                                name="returnDate"
                                id="returnDate"
                                type="text"
                                onFocus={(e) => {
                                    e.target.type = "date";
                                    e.target.showPicker();
                                }}
                                placeholder="Return"
                                onBlur={(e) => (e.target.type = "text")}
                                min={new Date().toISOString().split("T")[0]}
                                required={tripType === "round-trip"}
                                className="flex-fixed w-1/2 py-2 px-4 focus:outline-none"
                            />
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className="px-5 mx-auto flex bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
                    >
                        {loading ? (
                            <div
                                role="status"
                                className="flex justify-center items-center px-[42.5px] py-1"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : (
                            "Search Flights"
                        )}
                    </button>
                </div>
            </form>
            <div className="mt-4">
                {flights?.data?.itineraries?.length > 0 ? (
                    <FlightSearchResult
                        flights={flights?.data?.itineraries}
                        sessionId={flights?.sessionId}
                        departure={departure}
                        destination={destination}
                    />
                ) : error ? (
                    <div
                        className="p-4 mb-4 max-w-5xl mx-auto text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                        role="alert"
                    >
                        {error}
                    </div>
                ) : nearbyAirports?.length > 0 ? (
                    <NearbyAirports
                        airports={nearbyAirports}
                        onAirportSelect={(airport) => setDestination(airport)}
                    />
                ) : (
                    <p className="text-gray-500 max-w-5xl mx-auto mt-8 text-center">
                        Search flights to get started.
                    </p>
                )}
            </div>
        </>
    );
}

export default FlightSearchForm;
