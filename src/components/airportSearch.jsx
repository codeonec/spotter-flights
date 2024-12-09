import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowTurnDownLeftIcon, MapPinIcon } from "@heroicons/react/24/outline";

function useOutsideAlerter(callBack) {
    const ref = useRef();
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callBack(ref);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
    return ref;
}
function IconType({ entityType }) {
    return (
        <>
            {entityType === "AIRPORT" ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#6b7280"
                    className="shrink-0"
                >
                    <path d="M294.23-100v-80.77l116.92-82.08v-158.61L100-296.54v-99.23l311.15-218.61v-176.77q0-28.39 20.24-48.62Q451.62-860 480-860t48.61 20.23q20.24 20.23 20.24 48.62v176.77L860-395.77v99.23L548.85-421.46v158.61l116.53 82.08V-100L480-156.16 294.23-100Z" />
                </svg>
            ) : (
                <MapPinIcon height={20} className="text-gray-500" />
            )}
        </>
    );
}

function AirportSearch({
    onItemClick,
    label,
    itemId,
    inputClassName,
    currentAirort,
}) {
    const clickOutRef = useOutsideAlerter((ref) => {
        const element = ref.current;
        element.classList.add("hidden");
    });

    const [airPort, setAirPort] = useState([]);
    const [loading, setLoading] = useState(false);
    const [entityType, setEntityType] = useState(
        currentAirort?.entityType || ""
    );
    const [error, setError] = useState("");
    const [query, setQuery] = useState(currentAirort?.title || "");

    useEffect(() => {
        setEntityType(currentAirort?.entityType || "");
        setQuery(currentAirort?.title || "");
    }, [currentAirort]);
    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setAirPort([]);
            setLoading(true);
            console.log(e.target.value);
            const options = {
                method: "GET",
                url: import.meta.env.VITE_SEARCH_AIRPORT,
                params: {
                    query: query,
                    locale: "en-US",
                },
                headers: {
                    "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY,
                    "x-rapidapi-host": import.meta.env.VITE_RAPID_API_HOST,
                },
            };

            try {
                const response = await axios.request(options);
                console.log(response);
                setLoading(false);
                if (response.data.status && response.data.data.length > 0) {
                    setAirPort(
                        response.data.data.map((ele) => {
                            return {
                                entityId: ele.entityId,
                                skyId: ele.skyId,
                                entityType: ele.navigation.entityType,
                                title: ele.navigation.localizedName,
                                subTitle: ele.presentation.subtitle,
                            };
                        })
                    );
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
                setError("Failed to fetch airports. Please try again.");
            }
        }
    };
    return (
        <>
            <div className="relative w-full">
                <div className="absolute top-[11px] left-3">
                    <IconType entityType={entityType ? entityType : "Other"} />
                </div>
                <input
                    type="text"
                    name={itemId}
                    id={itemId}
                    required
                    className={
                        "w-full py-2 pl-9 pr-4 focus:outline-none border border-blue-200 " +
                        inputClassName
                    }
                    placeholder={label}
                    onKeyDown={handleKeyDown}
                    onSubmit={(e) => e.preventDefault()}
                    onFocus={() => {
                        clickOutRef.current.classList.remove("hidden");
                    }}
                    value={query}
                    onChange={(e) => {
                        setAirPort([]);
                        setEntityType("");
                        setQuery(e.target.value);
                    }}
                />
                <ul
                    className="absolute z-10 mt-1 max-h-56 w-full divide-y overflow-auto rounded-md bg-white py-1 hidden text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    tabIndex="-1"
                    role="listbox"
                    ref={clickOutRef}
                >
                    {!loading && airPort.length === 0 && (
                        <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900">
                            <span className="ml-3 block font-normal text-sm text-gray-600">
                                Live search is currenlty unavailable due to
                                request limits. <br/><span className="mt-2">Press <ArrowTurnDownLeftIcon height={14} className="inline-block" /> Enter to search.</span>
                            </span>
                        </li>
                    )}
                    {airPort.length > 0 &&
                        airPort.map((item) => (
                            <li
                                className="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-50  transition-all text-gray-900"
                                role="option"
                                key={item.entityId}
                                onClick={() => {
                                    clickOutRef.current.classList.add("hidden");
                                    setQuery(item.title);
                                    onItemClick(item);
                                    setEntityType(item.entityType);
                                }}
                            >
                                <div className="flex items-center">
                                    <IconType entityType={item.entityType} />
                                    <span className="block pl-3 truncate font-normal">
                                        {item.title}
                                        {item.entityType !== "AIRPORT"
                                            ? " (Any)"
                                            : " Airport"}

                                        <span className="text-gray-500 truncate block text-sm">
                                            {item.subTitle}
                                        </span>
                                    </span>
                                </div>
                            </li>
                        ))}
                    {loading && (
                        <div
                            role="status"
                            className="flex justify-center items-center p-2"
                        >
                            <svg
                                aria-hidden="true"
                                className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                    )}
                </ul>
            </div>
        </>
    );
}
export default AirportSearch;
