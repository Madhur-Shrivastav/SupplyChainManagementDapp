import { createContext, useState, useEffect } from "react";

export const connectedAccountContext = createContext();

const ConnectedAccountProvider = ({ children }) => {
  const [connectedAccount, setConnectedAccount] = useState(null);

  useEffect(() => {
    const getAccount = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const walletAccounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setConnectedAccount(walletAccounts[0]);
        } catch (error) {
          console.error("Error fetching accounts:", error);
        }
      } else {
        alert("MetaMask not found");
      }
    };

    getAccount();

    window.ethereum?.on("accountsChanged", (walletAccounts) => {
      setConnectedAccount(walletAccounts[0] || null);
    });

    // return () => {
    //   window.ethereum?.removeListener("accountsChanged", () => {});
    // };
  }, [connectedAccount]);

  return (
    <connectedAccountContext.Provider value={{ connectedAccount }}>
      {children}
    </connectedAccountContext.Provider>
  );
};

export default ConnectedAccountProvider;
