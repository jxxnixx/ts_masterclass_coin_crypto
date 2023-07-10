import { BrowserRouter, Routes, Route } from "react-router-dom";
import Coins from "./routes/Coins";
import Coin from "./routes/Coin";
import Price from "./routes/Price";
import Chart from "./routes/Chart";
import { useOutletContext, useParams } from "react-router-dom";

interface IRouterProps {}

function Router({} : IRouterProps) {
    const coinID = useOutletContext<string>();

    return (
        <BrowserRouter>
             <Routes>
                <Route path="/:coinID/" element={<Coin />} />
                <Route path="price" element={<Price />} />
                <Route path="chart" element={<Chart coinID={coinID}/>} />
                <Route path="/" element={<Coins />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;