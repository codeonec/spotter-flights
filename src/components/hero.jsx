import { useEffect, useState } from "react";
import FlightSearchForm from "./flightSearch";
import axios from "axios";

function Hero() {
    const [error, setError] = useState("");
    const [currentAirport, setCurrentAirport] = useState({});
    const [nearbyAirports, setNearbyAirports] = useState([]);
    useEffect(() => {
        const fetchNearbyAirports = async (latitude, longitude) => {
            const options = {
                method: "GET",
                url: import.meta.env.VITE_GET_NEARBY_AIRPORTS,
                params: {
                    lat: latitude,
                    lng: longitude,
                    locale: "en-US",
                },
                headers: {
                    "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY,
                    "x-rapidapi-host": import.meta.env.VITE_RAPID_API_HOST,
                },
            };
            try {
                const response = await axios.request(options);
                console.log(response.data);
                setCurrentAirport({
                    entityId: response?.data?.data?.current?.entityId,
                    skyId: response?.data?.data?.current?.skyId,
                    entityType:
                        response?.data?.data?.current?.navigation?.entityType,
                    title: response?.data?.data?.current?.navigation
                        ?.localizedName,
                    subTitle: response?.data?.data?.current?.subtitle,
                });
                setNearbyAirports(response?.data?.data?.nearby);
            } catch (error) {
                console.error(error);
                setError("Error getting nearby airports");
            }
        };

        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log({ latitude, longitude });
                        fetchNearbyAirports(latitude, longitude);
                    },
                    (err) => {
                        setError("Failed to get user location");
                        console.error(err.message);
                    }
                );
            } else {
                setError("Geolocation is not supported by your browser");
            }
        };

        getUserLocation();
    }, []);
    return (
        <>
            <div className="px-5 pb-5 bg-blue-100">
                <div className="relative flex flex-row justify-center bg-center h-[50vh] rounded-3xl max-md:h-[30vh] max-sm:h-[23vh]">
                    <img
                        src="/hero.jpg"
                        alt="flights"
                        className="absolute h-full w-full object-cover object-hero z-[0] rounded-3xl"
                    />
                    <h1 className="text-center mt-10 drop-shadow-3xl text-5xl font-semibold z-10 max-md:text-3xl">
                        Flights
                    </h1>
                </div>
            </div>
            <div className="px-4">
                <FlightSearchForm
                    currentAirport={currentAirport}
                    nearbyAirports={nearbyAirports}
                />
            </div>
        </>
    );
}

export default Hero;
