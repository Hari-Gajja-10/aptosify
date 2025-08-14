const { AptosClient, AptosAccount, TxnBuilderTypes, BCS } = require("aptos");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
const MODULE_ADDRESS = process.env.MODULE_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function deployContract() {
    console.log("🚀 Starting contract deployment...");
    
    const client = new AptosClient(NODE_URL);
    
    if (!PRIVATE_KEY) {
        throw new Error("Please set PRIVATE_KEY in your .env file");
    }
    
    const account = new AptosAccount(Buffer.from(PRIVATE_KEY, "hex"));
    console.log(`📝 Deploying from account: ${account.address()}`);
    
    // Read the compiled module
    const modulePath = path.join(__dirname, "../build/music_players/bytecode_modules/players.mv");
    
    if (!fs.existsSync(modulePath)) {
        console.log("📦 Building contract first...");
        await buildContract();
    }
    
    const moduleData = fs.readFileSync(modulePath);
    
    // Create the transaction payload
    const payload = new TxnBuilderTypes.TransactionPayloadModuleBundle(
        new TxnBuilderTypes.ModuleBundle([
            new TxnBuilderTypes.Module(moduleData)
        ])
    );
    
    // Submit the transaction
    const rawTxn = await client.generateTransaction(account.address(), payload);
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const transactionRes = await client.submitTransaction(bcsTxn);
    
    console.log(`✅ Transaction submitted: ${transactionRes.hash}`);
    
    // Wait for transaction to be confirmed
    await client.waitForTransaction(transactionRes.hash);
    console.log("🎉 Contract deployed successfully!");
    
    // Initialize the platform
    await initializePlatform(client, account);
}

async function buildContract() {
    const { execSync } = require("child_process");
    const contractPath = path.join(__dirname, "../../contracts");
    
    console.log("🔨 Building Move contract...");
    execSync("aptos move compile", { 
        cwd: contractPath, 
        stdio: "inherit" 
    });
    console.log("✅ Contract built successfully!");
}

async function initializePlatform(client, account) {
    console.log("🔧 Initializing music platform...");
    
    const payload = {
        function: `${account.address()}::players::initialize`,
        type_arguments: [],
        arguments: []
    };
    
    const rawTxn = await client.generateTransaction(account.address(), payload);
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const transactionRes = await client.submitTransaction(bcsTxn);
    
    console.log(`✅ Platform initialized: ${transactionRes.hash}`);
    await client.waitForTransaction(transactionRes.hash);
    
    console.log(`🎵 Music platform is ready at address: ${account.address()}`);
    console.log("📝 Update your .env file with:");
    console.log(`MODULE_ADDRESS=${account.address()}`);
}

if (require.main === module) {
    deployContract().catch(console.error);
}

module.exports = { deployContract };