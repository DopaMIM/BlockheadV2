const flashLiquidate = artifacts.require("flashLiquidate");

module.exports = function (deployer) {
  deployer.deploy(flashLiquidate);
};
