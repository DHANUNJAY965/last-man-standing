import { JsonRpcProvider, Contract } from "ethers";
import * as dotenv from "dotenv";
import abiJson from "./abi/LastManStanding.json" assert { type: "json" };
dotenv.config();

export const provider = new JsonRpcProvider(process.env.RPC_URL!);
export const contract = new Contract(process.env.CONTRACT_ADDRESS!, abiJson.abi, provider);
