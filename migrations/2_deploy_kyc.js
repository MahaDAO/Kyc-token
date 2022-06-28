const KycContract = artifacts.require("KycContract");
const ERC20Mock = artifacts.require("ERC20Mock");


module.exports = async function (deployer) {
    await deployer.deploy(KycContract);
    const kyc = await KycContract.deployed()

    await deployer.deploy(ERC20Mock, "Euro", "EUR", kyc.address)
    const euro = await ERC20Mock.deployed()

    await deployer.deploy(ERC20Mock, "British Pound", "GBP", kyc.address)
    const pound = await ERC20Mock.deployed()

    await deployer.deploy(ERC20Mock, "Dollor", "USD", kyc.address)
    const dollor = await ERC20Mock.deployed()
};
