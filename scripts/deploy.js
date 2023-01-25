const path = require("path");
const {ethers, artifacts} = require("hardhat");
const fs = require("fs");

async function init(contract){
    
}
async function main() {
    const [deployer] = await ethers.getSigners();
    let owner = await deployer.getAddress();
    const RestaurantReservations = await ethers.getContractFactory("RestaurantReservations");
    const contract = await RestaurantReservations.deploy();
    await contract.deployed();

    await init(contract);

    saveFrontendFiles(contract);
}

function saveFrontendFiles(token) {
    const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

    if (!fs.existsSync(contractsDir))
        fs.mkdirSync(contractsDir);

    fs.writeFileSync(
        path.join(contractsDir, "contract-address.ts"),
        "export const ADDRESS = " + JSON.stringify(token.address)
    );

    const TokenArtifact = artifacts.readArtifactSync("RestaurantReservations");

    fs.writeFileSync(
        path.join(contractsDir, "contract-abi.ts"),
        "export const ABI = " + JSON.stringify(TokenArtifact.abi)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
