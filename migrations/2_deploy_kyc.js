const KycContract = artifacts.require("KycContract");
const ERC20Mock = artifacts.require("ERC20Mock");


module.exports = async function (deployer) {
    await deployer.deploy(KycContract);
    const kyc = await KycContract.deployed()

    await deployer.deploy(ERC20Mock, "Scallop", "SCLP", kyc.address)
    const mock = await ERC20Mock.deployed()
};
