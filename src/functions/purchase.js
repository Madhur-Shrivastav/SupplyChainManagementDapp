export default async function purchase(product, api) {
  console.log(product);
  try {
    const { contract, signer, ethers } = api;
    const connectedContract = contract.connect(signer);

    const tx = await connectedContract.purchaseProduct(product.id.toString(), {
      value: (product.price * 1000000000000000000).toString(),
    });
    console.log(tx);
    const ProductPurchasedPromise = new Promise((resolve, reject) => {
      connectedContract.once(
        "ProductPurchased",
        (productId, buyer, price) => {
          resolve({ productId, buyer, price });
        },
        (error) => {
          reject({ message: error.reason });
        }
      );
    });
    const eventData = await ProductPurchasedPromise;
    return eventData;
  } catch (error) {
    console.log(error);
    return { message: error.reason };
  }
}
