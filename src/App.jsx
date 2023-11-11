import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import "./index.css";
import CityList from "./components/CityList";
import { useEffect, useState } from "react";

export default function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = "http://localhost:9000";

  useEffect(function(){
    async function fetchCities (){
      try{
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`)
        const data = await res.json();
        setCities(data);
      }catch{
        alert("error on loading data")
      }finally{
        setIsLoading(false);
      }
    }
    fetchCities();
  },[])
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="app" element={<AppLayout />}>
          <Route index element={<CityList cities={cities} isLoading={isLoading} />} />
          <Route path="cites" element={<CityList cities={cities} isLoading={isLoading}  />} />
          <Route path="countries" element={<p>List of countries</p>} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="product" element={<Product />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
