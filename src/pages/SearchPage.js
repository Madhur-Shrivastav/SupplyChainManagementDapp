import { useState, useEffect, useContext } from "react";
import { apiContext } from "../contexts/apiContext";
import Card from "../components/card";

const SearchPage = () => {
  const { api } = useContext(apiContext);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const [searchData, setSearchData] = useState({
    searchterm: "",
    date: new Date(),
    maxprice: 15,
  });
  console.log(searchData);

  const [hasContent, setHasContent] = useState(false);
  const handleInputChange = (event) => {
    setHasContent(event.target.value !== "");
  };

  async function handleChange(event) {
    setSearchData({ ...searchData, [event.target.id]: event.target.value });
  }

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const result = await api.contract.getProducts();
        const fetchedProducts = await Promise.all(
          result.map(async (prod) => {
            console.log(prod);
            const product = {
              id: Number(prod[0]),
              name: prod[1],
              owner: prod[2],
              price: Number(prod[3]) / 1000000000000000000,
              bought: prod[4],
              imageURL: prod[5],
              purchaseDate: new Date(Number(prod[6]) * 1000),
            };
            const detailedResult = await api.contract.getProductById(
              product.id
            );
            const statusHistory = detailedResult[7].map((status) => ({
              status: status[0],
              timestamp: new Date(Number(status[1]) * 1000),
            }));
            return { ...product, statusHistory };
          })
        );

        // Filter products based on search criteria
        const filteredProducts = fetchedProducts.filter((product) => {
          const productDate = new Date(product.statusHistory[0].timestamp);
          const searchDate = new Date(searchData.date);
          console.log("Product Date:", productDate);
          console.log("Search Date:", searchDate);
          console.log("Comparison Result:", productDate <= searchDate);

          const productDateOnly = new Date(
            productDate.getFullYear(),
            productDate.getMonth(),
            productDate.getDate()
          );
          const searchDateOnly = new Date(
            searchDate.getFullYear(),
            searchDate.getMonth(),
            searchDate.getDate()
          );

          return (
            product.name.includes(searchData.searchterm) &&
            product.price <= searchData.maxprice &&
            !product.bought &&
            productDateOnly <= searchDateOnly
          );
        });
        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getProducts();
  }, [api, searchData]);

  console.log(products);

  return (
    <main className="min-h-[40rem] flex flex-col p-6 gap-6 items-center">
      <div className="bg-custom-black-1 p-6 my-10 flex flex-col gap-6 items-center rounded-lg w-[350px] h-auto sm:w-[600px]">
        <h1 className="font-semibold text-2xl whitespace-nowrap truncate w-full text-center text-white">
          Search
        </h1>
        <form className="flex flex-col gap-4 p-4 border border-yellow-500 w-full rounded-lg">
          <label className="relative w-full my-3">
            <input
              type="text"
              id="searchterm"
              className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 appearance-none focus:outline-none focus:border-2 focus:border-yellow-500 peer p-1"
              onChange={handleChange}
              onInput={handleInputChange}
            />
            <span
              className={`absolute text-white text-lg duration-300 left-2 top-2 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:px-1 
              peer-focus:bg-yellow-500 
              ${hasContent ? "text-sm -translate-y-5 px-1 bg-yellow-500" : ""}`}
            >
              Search Term
            </span>
          </label>
          <div className="w-full my-3 flex  items-center">
            <input
              //type="datetime-local"
              type="date"
              id="date"
              className="bg-yellow-500 w-full text-sm rounded-md border-2 border-black focus:outline-none appearance-none peer p-1"
              onChange={handleChange}
            />
          </div>
          <div className="w-full my-3 flex flex-col items-center border-2 border-yellow-500 rounded-lg p-2 gap-2">
            <span className="text-white  whitespace-nowrap">
              Max Price:{searchData.maxprice}
              {" ETH"}
            </span>

            <input
              type="range"
              id="maxprice"
              min="0"
              max="15"
              defaultValue="40"
              className=" w-full h-[5px] rounded-lg focus:cursor-pointer appearance-none bg-yellow-500 "
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
      <hr className="border-0 h-[2px] w-full bg-yellow-500" />

      {!loading ? (
        <div className="flex flex-wrap gap-5 w-full">
          {products.length > 0 &&
            products.map((product, index) => (
              <Card key={index} product={product}></Card>
            ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
};

export default SearchPage;
