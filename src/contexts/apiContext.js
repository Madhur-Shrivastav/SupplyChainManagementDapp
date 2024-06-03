import { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import SupplyChain from "../contract/SupplyChain.json";
import deployed_addresses from "../contract/deployed_addresses.json";

export const apiContext = createContext();

const ApiProvider = ({ children }) => {
  const [api, setApi] = useState({
    provider: null,
    signer: null,
    contract: null,
    ethers: null,
  });
  useEffect(() => {
    const initiate = async () => {
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then(() => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = provider
              .getSigner()
              .then((signer) => {
                const contract = new ethers.Contract(
                  deployed_addresses.SupplyChainAddress,
                  SupplyChain.abi,
                  signer
                );
                setApi({ provider, signer, contract, ethers });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        alert("MetaMask not found");
      }
    };
    initiate();
  }, []);

  return <apiContext.Provider value={{ api }}>{children}</apiContext.Provider>;
};

export default ApiProvider;
