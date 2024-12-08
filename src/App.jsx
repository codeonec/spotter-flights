import { Navigate, Route, Routes } from "react-router";
import Hero from "./components/hero";
import Navigation from "./components/navigation";
import FlightDetails from "./components/flightDetails";
import Footer from "./components/footer";

function App() {
    return (
        <>
            <Navigation />
            <Routes>
                <Route path="/" index element={<Hero />} />
                <Route path="/flight/:id" element={<FlightDetails />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
