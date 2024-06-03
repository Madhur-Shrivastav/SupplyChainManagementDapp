import { Link } from "react-router-dom";
import { TfiAlignJustify } from "react-icons/tfi";
import { useContext, useState } from "react";
import { connectedAccountContext } from "../contexts/connectedaccountContext";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { connectedAccount } = useContext(connectedAccountContext);

  function handleClick() {
    setIsVisible(!isVisible);
  }

  return (
    <header className="bg-custom-black-1 opacity-[80%] hover:opacity-[100%] duration-[150ms]">
      <nav className="relative flex justify-between items-center gap-6 p-6 h-[80px]">
        <h1 className="text-yellow-500 truncate whitespace-nowrap w-[300px] hover:border hover:border-yellow-500 duration-[150ms] hover:rounded-lg sm:w-[600px] p-2">
          {connectedAccount === null ? (
            "Not Connected!"
          ) : (
            <>
              <span className="hidden sm:inline">
                Connected Account: {connectedAccount}
              </span>
              <span className="sm:hidden">{connectedAccount}</span>
            </>
          )}
        </h1>

        <div
          className={`menu absolute top-[80px] left-0 ${
            isVisible ? `flex flex-col` : `hidden`
          }  gap-6 p-6 items-center bg-custom-black-1 w-full sm:static sm:top-0 sm:justify-end sm:flex sm:flex-row sm:h-[80px] text-yellow-500`}
        >
          <Link
            className=" transition-scale duration-[300ms] hover:scale-[1.2] hover:border hover:border-yellow-500 hover:rounded-lg p-2"
            to="/"
          >
            Home
          </Link>
          <Link
            className=" transition-scale duration-[300ms] hover:scale-[1.2] hover:border  hover:border-yellow-500 hover:rounded-lg p-2"
            to="/register"
          >
            Regiter
          </Link>
          <Link
            className=" transition-scale duration-[300ms] hover:scale-[1.2] hover:border  hover:border-yellow-500 hover:rounded-lg p-2"
            to="/search"
          >
            Products
          </Link>
        </div>
        <button
          className="hover:scale-[1.2] translate-scale duration-[200ms] p-4 "
          onClick={handleClick}
        >
          <TfiAlignJustify className="bg-yellow-500 sm:hidden" />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
