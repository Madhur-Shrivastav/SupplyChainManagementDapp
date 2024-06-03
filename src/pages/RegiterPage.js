import { useEffect, useRef, useState, useContext } from "react";
import { apiContext } from "../contexts/apiContext.js";
import handleFileUpload from "../functions/uploadFile.js";
import register from "../functions/regiter.js";
import { RxCross2 } from "react-icons/rx";

const RegiterPage = () => {
  const { api } = useContext(apiContext);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [formdata, setFormdata] = useState({
    productimage: "",
    productname: "",
    productprice: "",
  });
  const [eventData, setEventData] = useState(null);
  const [eventError, setEventError] = useState(false);
  useEffect(() => {
    if (file) {
      uploadFile(file);
    }
  }, [file]);

  const uploadFile = async (file) => {
    try {
      const imageUrl = await handleFileUpload(file);
      setFormdata((previousData) => ({
        ...previousData,
        productimage: imageUrl,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  async function handleChange(event) {
    setFormdata({ ...formdata, [event.target.id]: event.target.value });
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const eventData = await register(formdata, api);
      console.log(eventData);
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
    <main className="min-h-[40rem] flex flex-col p-6 justify-center items-center">
      <div className="bg-custom-black-1 p-6 rounded-lg flex flex-col items-center justify-center">
        <h1 className="text-white text-3xl p-3 mb-6">Register a product</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 border border-yellow-500 p-5 w-[350px] h-[400px] rounded-lg"
        >
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(event) => {
              setFile(event.target.files[0]);
            }}
            id="productimage"
            required
          ></input>
          <img
            className="rounded-full  h-20 w-20 object-cover cursor-pointer self-center mt-2"
            src={
              formdata.productimage
                ? formdata.productimage
                : "https://th.bing.com/th?id=OIP.6Dxwzb1knzh30OK5OMlYTwHaH_&w=240&h=259&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2"
            }
            onClick={() => fileRef.current.click()}
          ></img>
          <label className="relative w-full my-3">
            <input
              type="text"
              id="productname"
              className="block py-3 text-white w-full text-sm rounded-lg bg-transparent border-b-2 border-yellow-500 appearance-none focus:outline-none focus:border-2 focus:border-yellow-500 peer p-1"
              onChange={handleChange}
              required
            />
            <span
              className="absolute text-white text-lg duration-300 left-2 top-2 
    peer-focus:text-sm 
    peer-focus:-translate-y-5 
    peer-focus:px-1
    peer-focus:bg-yellow-500
    peer-focus:text-custom-blue      
    peer-valid:text-sm  
    peer-valid:-translate-y-5
    peer-valid:px-1            
    peer-valid:bg-yellow-500
    peer-valid:text-custom-blue     
    "
            >
              Product Name
            </span>
          </label>
          <label className="relative w-full my-3">
            <input
              type="text"
              id="productprice"
              className="block py-3 text-white w-full text-sm 
rounded-lg bg-transparent border-b-2 border-yellow-500 
appearance-none focus:outline-none focus:border-2 
focus:border-yellow-500 peer p-1"
              onChange={handleChange}
              required
            />
            <span
              className="absolute text-white text-lg duration-300 
left-2 top-2 
    peer-focus:text-sm 
    peer-focus:-translate-y-5 
    peer-focus:px-1
    peer-focus:bg-yellow-500
    peer-focus:text-custom-blue      
    peer-valid:text-sm  
    peer-valid:-translate-y-5
    peer-valid:px-1            
    peer-valid:bg-yellow-500
    peer-valid:text-custom-blue     
    "
            >
              Price
            </span>
          </label>
          <button className="text-white bg-custom-black-4 h-[50px] w-[100px] mx-auto hover:border hover:border-yellow-500 hover:rounded-lg transition-scale hover:scale-[1.2] duration-[300ms] hover:text-yellow-500 ">
            Register
          </button>
        </form>
      </div>
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
              <p>
                Product {eventData.status}{" "}
                {eventData.date ? `at ${eventData.date.toLocaleString()}` : ""}.
              </p>
            </div>
          </>
        )
      ) : (
        ""
      )}
    </main>
  );
};

export default RegiterPage;
