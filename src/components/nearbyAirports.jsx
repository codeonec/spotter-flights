import { MapPinIcon } from "@heroicons/react/24/outline";

function NearbyAirports({ airports, onAirportSelect }) {
    return (
        <>
            {airports.length === 0 && !error ? (
                <p className="text-gray-600">No nearby airports found.</p>
            ) : (
                <div className="max-w-5xl mx-auto flex flex-wrap gap-3 pb-10">
                    <h2 className="mb-8 mt-10 text-2xl font-medium text-center flex-fixed w-full">
                        Nearby Destinations
                    </h2>
                    {airports.map((airport, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white border border-blue-200 
                            rounded-xl shadow-sm transition-colors cursor-pointer hover:bg-blue-50 
                            flex flex-fixed gap-2 w-[32%] max-md:w-[49%] max-sm:w-full"
                            onClick={() => {
                                onAirportSelect({
                                    entityId: airport.navigation.entityId,
                                    skyId: airport.navigation
                                        .relevantFlightParams.skyId,
                                    entityType: airport.navigation.entityType,
                                    title: airport.navigation.localizedName,
                                    subTitle: airport.presentation.subtitle,
                                });
                            }}
                        >
                            <div>
                                {airport.navigation.entityType === "AIRPORT" ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20px"
                                        viewBox="0 -960 960 960"
                                        width="20px"
                                        fill="#6b7280"
                                        className="shrink-0 mt-1"
                                    >
                                        <path d="M294.23-100v-80.77l116.92-82.08v-158.61L100-296.54v-99.23l311.15-218.61v-176.77q0-28.39 20.24-48.62Q451.62-860 480-860t48.61 20.23q20.24 20.23 20.24 48.62v176.77L860-395.77v99.23L548.85-421.46v158.61l116.53 82.08V-100L480-156.16 294.23-100Z" />
                                    </svg>
                                ) : (
                                    <MapPinIcon
                                        height={20}
                                        className="text-gray-500 mt-1"
                                    />
                                )}
                            </div>
                            <div className="relative">
                                <h3 className="text-lg font-medium text-gray-700 line-clamp-1 max-w-full">
                                    {airport.navigation.localizedName}
                                    {airport.navigation.entityType ===
                                        "AIRPORT" && " Airport"}
                                </h3>
                                <span className="text-base text-gray-600 mt-1">
                                    {
                                        airport.navigation.relevantFlightParams
                                            .skyId
                                    }
                                </span>
                                <p className="text-gray-600 mt-2 text-sm">
                                    {airport.presentation.subtitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default NearbyAirports;
