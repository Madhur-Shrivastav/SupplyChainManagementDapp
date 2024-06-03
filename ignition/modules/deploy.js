const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SupplyChain", (m) => {
  const supplychain = m.contract("SupplyChain", []);

  return { supplychain };
});
