export default async function register(formdata, api) {
  console.log(formdata);
  try {
    const { contract, signer } = api;
    const connectedContract = contract.connect(signer);
    console.log(connectedContract);

    await connectedContract.registerProduct(
      formdata.productname,
      formdata.productimage,
      (formdata.productprice * 1000000000000000000).toString()
    );

    const statusUpdatedPromise = new Promise((resolve, reject) => {
      connectedContract.once(
        "StatusUpdated",
        (productId, status, timestamp) => {
          const date = new Date(Number(timestamp));
          resolve({ productId, status, date });
        },
        (error) => {
          reject({ message: error.reason });
        }
      );
    });

    const eventData = await statusUpdatedPromise;
    return eventData;
  } catch (error) {
    console.log(error.reason);
    return { message: error.reason };
  }
}
