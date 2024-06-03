import { Link } from "react-router-dom";
import purchase from "../functions/purchase";
import { apiContext } from "../contexts/apiContext.js";
import { useContext, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const Card = ({ product }) => {
  const { api } = useContext(apiContext);
  const [eventData, setEventData] = useState(null);
  const [eventError, setEventError] = useState(false);

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

  return (
    <>
      <div
        className={`${
          product.bought
            ? ` bg-yellow-500 w-full overflow-hidden rounded-lg sm:w-[330px]`
            : `bg-yellow-500 w-full overflow-hidden  rounded-lg sm:w-[330px]`
        }`}
      >
        <Link to={`/product/${product.id}`}>
          <img
            src={product.imageURL}
            alt="https://expertphotography.b-cdn.net/wp-content/uploads/2020/11/product-photography-tips-14-1.jpg"
            className="w-full h-[320px] object-cover hover:scale-[1.05] transition-scale duration-[300ms]"
          ></img>
        </Link>
        <div className=" p-4 flex flex-col gap-2 w-full">
          <h1 className="font-semibold whitespace-nowrap truncate w-full">
            Owner: {product.owner}
          </h1>
          <h1 className="font-semibold whitespace-nowrap  truncate w-full">
            Product Name: {product.name}
          </h1>
          <h1 className=" font-semibold whitespace-nowrap truncate w-full">
            Price: {product.price} ETH
          </h1>
          {product.bought ? (
            <h1 className="text-red-600 font-bold whitespace-nowrap truncate w-full">
              Already Purchased
            </h1>
          ) : (
            <h1 className="text-green-600 font-bold whitespace-nowrap truncate w-full">
              Available
            </h1>
          )}

          <div className="flex">
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
          </div>
        </div>
        {eventData ? (
          eventData.message ? (
            <>
              <div className=" bg-red-300 text-black p-6 mt-6" role="alert">
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
                className="flex flex-col bg-green-300 text-black p-6 mt-6"
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
                <p className="font-bold truncate whitespace-nowrap">
                  Buyer:{eventData.buyer}
                </p>
                <p className="font-bold">
                  Price: {Number(eventData.price) / 1000000000000000000} ETH
                </p>
              </div>
            </>
          )
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Card;
