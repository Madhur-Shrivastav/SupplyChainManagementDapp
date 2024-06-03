import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { apiContext } from "../contexts/apiContext";
import purchase from "../functions/purchase";
import { RxCross2 } from "react-icons/rx";

const Product = () => {
  const { api } = useContext(apiContext);
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [eventError, setEventError] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);

  useEffect(() => {
    async function getProduct() {
      try {
        setLoading(true);
        const { contract } = api;
        const productId = params.id;
        await contract
          .getProductById(productId)
          .then((Result) => {
            console.log(Result);
            const product = {
              id: Number(Result[0]),
              name: Result[1],
              owner: Result[2],
              price: Number(Result[3]) / 1000000000000000000,
              bought: Result[4],
              imageURL: Result[5],
              purchaseDate: new Date(Number(Result[6])),
            };
            const statusHistory = [];
            for (let i in Result[7]) {
              let result = Result[7][i];
              statusHistory.push({
                status: result[0],
                timestamp: new Date(Number(result[1])),
              });
            }

            setProduct({ ...product, statusHistory });
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    getProduct();
  }, [params.id, api]);

  console.log(product);

  async function handleClick() {
    try {
      const eventData = await purchase(product, api);
      console.log(typeof eventData.price);
      setEventData(eventData);
    } catch (error) {
      console.log(error.reason);
      setEventError(true);
      setEventData({ message: error.reason });
    }
  }

  async function clearAlert() {
    setEventData(null);
    setEventError(false);
  }

  if (!product) {
    return <div>No product found</div>;
  }
  return (
    <main className="min-h-[40rem] flex flex-col p-6 gap-6 items-center">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="m-10 flex flex-col gap-2 bg-yellow-500 overflow-hidden w-[90%] sm:w-[60%] rounded-lg">
          <img
            src={product.imageURL}
            alt="https://expertphotography.b-cdn.net/wp-content/uploads/2020/11/product-photography-tips-14-1.jpg"
            className="w-full h-[320px] object-fit hover:scale-[1.05] transition-scale duration-[300ms]"
          ></img>
          <div className="flex flex-col gap-2 p-4">
            <h1 className="font-semibold whitespace-nowrap truncate w-full">
              Product Owner: {product.owner}
            </h1>
            <h1 className="font-semibold whitespace-nowrap truncate w-full">
              Product Name: {product.name}
            </h1>
            <h1 className="font-semibold whitespace-nowrap truncate w-full">
              Price: {product.price}
            </h1>
            {product.bought ? (
              <h1 className="font-semibold whitespace-nowrap truncate w-full text-red-600">
                Already Purchased
              </h1>
            ) : (
              <h1 className="font-semibold whitespace-nowrap truncate w-full text-green-600">
                Available
              </h1>
            )}

            <div className="flex sm:w-[50%] mx-auto gap-4">
              <button
                className={`text-white bg-custom-black-4 h-[50px] w-[100px] rounded-lg ${
                  !product.bought
                    ? `hover:border-yellow-500   hover:border  transition-scale hover:scale-[1.1] duration-[300ms] hover:text-yellow-500`
                    : `opacity-[80%] hover:text-yellow-500`
                } mx-auto`}
                onClick={handleClick}
                disabled={product.bought}
              >
                Purchase
              </button>
              <button
                className={`text-white bg-custom-black-4 h-[50px] w-[200px] rounded-lg ${`hover:border-yellow-500   hover:border  transition-scale hover:scale-[1.1] duration-[300ms] hover:text-yellow-500`} mx-auto`}
                onClick={() => setViewHistory(!viewHistory)}
              >
                View Product History
              </button>
            </div>
          </div>
        </div>
      )}

      {viewHistory && (
        <div className="bg-yellow-500 mx-auto flex flex-col items-center rounded-lg w-[90%] sm:w-[30%] p-2">
          <h2 className="text-2xl font-bold w-full truncate whitespace-nowrap">
            Product History:
          </h2>
          {product.statusHistory.map((status, index) => (
            <div
              key={index}
              className={`my-3 border ${
                status.status === "Registered"
                  ? "text-blue-600 border-blue-600"
                  : status.status === "Purchase pending..."
                  ? "text-red-600 border-red-600"
                  : status.status === "Purchased"
                  ? "text-green-600 border-green-600"
                  : ""
              }  rounded-lg p-2 w-full `}
            >
              <p className="font-semibold whitespace-nowrap truncate w-full">
                Status: {status.status}
              </p>
              <p className="font-semibold whitespace-nowrap truncate w-full">
                Time: {status.timestamp.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
      {eventData ? (
        eventData.message ? (
          <>
            <div
              className=" bg-red-300 border-l-4 border-red-700 text-black p-6 mt-6"
              role="alert"
            >
              <div className="flex justify-between gap-2">
                <button onClick={clearAlert}>
                  <RxCross2 />
                </button>
                <p>{eventData.message}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className="flex flex-col bg-green-300 border-l-4 border-green-700 text-black p-6 mt-6"
              role="alert"
            >
              <div className="flex justify-between">
                <p className="font-bold">
                  Product Id: {Number(eventData.productId)}
                </p>
                <button onClick={clearAlert}>
                  <RxCross2 />
                </button>
              </div>
              <p>Buyer: {eventData.buyer}</p>
              <p> Price: {Number(eventData.price) / 1000000000000000000} ETH</p>
            </div>
          </>
        )
      ) : (
        ""
      )}
    </main>
  );
};

export default Product;
