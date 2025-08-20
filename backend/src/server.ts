import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { getDb } from "./db.js";
import { contract } from "./contract.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

async function main() {
  const db = await getDb();
  const deposits = db.collection("deposits");
  const bonuses = db.collection("bonuses");
  const rounds  = db.collection("rounds");

  // index events
  contract.on("DepositMade", async (roundId, depositor, amount, depositNumber, nextReq, deadline, evt) => {
    await deposits.updateOne(
      { tx: evt.log.transactionHash },
      {
        $set: {
          tx: evt.log.transactionHash,
          roundId: Number(roundId),
          depositor,
          amount: amount.toString(),
          depositNumber: Number(depositNumber),
          nextRequired: nextReq.toString(),
          deadline: Number(deadline),
          blockNumber: evt.log.blockNumber,
          ts: Date.now()
        }
      },
      { upsert: true }
    );
  });

  contract.on("BonusPaid", async (roundId, depositor, percentage, amount, depositNum, evt) => {
    await bonuses.updateOne(
      { tx: evt.log.transactionHash },
      {
        $set: {
          tx: evt.log.transactionHash,
          roundId: Number(roundId),
          depositor,
          percentage: Number(percentage),
          amount: amount.toString(),
          depositNumber: Number(depositNum),
          blockNumber: evt.log.blockNumber,
          ts: Date.now()
        }
      },
      { upsert: true }
    );
  });

  contract.on("RoundEnded", async (roundId, winner, finalVault, totalDeposits, endedAt, evt) => {
    await rounds.updateOne(
      { roundId: Number(roundId) },
      {
        $set: {
          roundId: Number(roundId),
          winner,
          finalVault: finalVault.toString(),
          totalDeposits: Number(totalDeposits),
          endedAt: Number(endedAt),
          tx: evt.log.transactionHash
        }
      },
      { upsert: true }
    );
  });

  // REST APIs
  app.get("/api/rounds/current", async (_req, res) => {
    const c = await contract.getCurrentRoundInfo();
    res.json({
      roundId: Number(c[0]),
      vaultBalance: c[1].toString(),
      currentRequiredAmount: c[2].toString(),
      lastDepositor: c[3],
      lastDepositTime: Number(c[4]),
      deadline: Number(c[5]),
      depositCount: Number(c[6]),
      lastBonus: {
        winner: c[7].winner,
        amount: c[7].amount.toString(),
        percentage: Number(c[7].percentage),
        depositNum: Number(c[7].depositNum)
      }
    });
  });

  app.get("/api/rounds/:id/summary", async (req, res) => {
    const id = Number(req.params.id);
    const s = await contract.roundSummaries(id);
    res.json({
      roundId: id,
      winner: s.winner,
      finalVault: s.finalVault.toString(),
      totalDeposits: Number(s.totalDeposits),
      endedAt: Number(s.endedAt),
      lastBonus: {
        winner: s.lastBonus.winner,
        amount: s.lastBonus.amount.toString(),
        percentage: Number(s.lastBonus.percentage),
        depositNum: Number(s.lastBonus.depositNum)
      }
    });
  });

  app.get("/api/rounds/:id/deposits", async (req, res) => {
    const id = Number(req.params.id);
    const docs = await deposits.find({ roundId: id }).sort({ depositNumber: 1 }).toArray();
    res.json(docs);
  });

  app.get("/api/rounds/:id/bonuses", async (req, res) => {
    const id = Number(req.params.id);
    const docs = await bonuses.find({ roundId: id }).sort({ depositNumber: 1 }).toArray();
    res.json(docs);
  });

  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => console.log(`Backend API on :${port}`));
}

main();
