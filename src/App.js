import { useContext, useEffect, useState } from "react";
import { apiContext } from "./contexts/apiContext.js";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import RegiterPage from "./pages/RegiterPage.js";
import SearchPage from "./pages/SearchPage.js";
import Navbar from "./components/navbar.js";
import Product from "./pages/Product.js";

function App() {
  const { api } = useContext(apiContext);
  console.log(api);

  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegiterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>
    </>
  );
}

export default App;
