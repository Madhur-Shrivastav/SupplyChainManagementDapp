import { useEffect, useState, useContext } from "react";
import Card from "../components/card";
import { apiContext } from "../contexts/apiContext.js";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { api } = useContext(apiContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getproducts = async () => {
      try {
        await api.contract
          .getProducts()
          .then((Proxy) => {
            const products = Proxy.map((product) => ({
              id: Number(product.id),
              name: product.name,
              owner: product.owner,
              price: Number(product.price) / 1000000000000000000,
              bought: product.bought,
              imageURL: product.imageURL,
              purchaseTime: new Date(Number(product.purchaseTime) * 1000),
              statusHistory: product.statusHistory.map((status) => ({
                status: status.status,
                timestamp: new Date(Number(status.timestamp) * 1000),
              })),
            }));

            setProducts(products);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.log(error);
      }
    };
    getproducts();
  }, [api]);
  console.log(products);
  return (
    <main className="min-h-[40rem] flex flex-col p-6 gap-6 items-center">
      <div className="w-full flex flex-col sm:flex-row sm:w-[1100px]">
        <h1 className="text-white text-2xl text-center font-bold m-4 truncate whitespace-nowrap w-full sm:text-3xl sm:text-justify">
          View some of the listed products....
        </h1>
        <Link
          to={"/search"}
          className="text-white text-2xl text-center font-bold m-4 truncate whitespace-nowrap  w-full  underline hover:text-blue-500 hover:font-serif sm:text-3xl sm:text-justify"
        >
          {" "}
          Or search according to your needs....
        </Link>
      </div>
      <div className="flex flex-wrap gap-5 w-full">
        {products.length > 0 &&
          products.map((product, index) => (
            <Card key={index} product={product}></Card>
          ))}
      </div>
    </main>
  );
};

export default HomePage;
