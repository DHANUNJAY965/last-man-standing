"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getCurrent, getRoundSummary, getRoundDeposits, getRoundBonuses } from "../lib/api";

function Countdown({ deadline }: { deadline: number }) {
  const [left, setLeft] = useState(Math.max(0, deadline*1000 - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, deadline*1000 - Date.now())), 1000);
    return () => clearInterval(id);
  }, [deadline]);
  const hh = Math.floor(left/3600000);
  const mm = Math.floor((left%3600000)/60000);
  const ss = Math.floor((left%60000)/1000);
  return <div style={{ fontSize:18, fontWeight:700 }}>
    Round ends in {`${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`}
  </div>;
}

export default function Home() {
  const [current, setCurrent] = useState<any>(null);
  const [roundPick, setRoundPick] = useState<number>(0);
  const [summary, setSummary] = useState<any>(null);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [bonuses, setBonuses] = useState<any[]>([]);

  useEffect(() => { getCurrent().then(setCurrent); }, []);
  useEffect(() => {
    if (roundPick>0) {
      getRoundSummary(roundPick).then(setSummary);
      getRoundDeposits(roundPick).then(r => setDeposits(r));
      getRoundBonuses(roundPick).then(r => setBonuses(r));
    } else {
      setSummary(null); setDeposits([]); setBonuses([]);
    }
  }, [roundPick]);

  const canShowTimer = current && current.deadline > 0;

  // for deposit / endRound buttons in local testing without wallet:
  const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT as `0x${string}`;
  const RPC = process.env.NEXT_PUBLIC_RPC || "http://127.0.0.1:8545";

  async function deposit() {
    // LOCAL DEMO WITHOUT WALLET: use anvil default account 0 to send tx
    // In real UI, you would use wagmi + signer. Here we keep it super simple.
    const value = BigInt(current.currentRequiredAmount).toString();
    await axios.post("/api/send", { // we will proxy through backend optional route OR skip this in local (see note)
      // this is a placeholder – simplest is to run deposit via cast (see CLI section below)
    });
  }

  return (
    <div>
      <div style={{ padding:"12px 16px", borderBottom:"1px solid #eee", display:"flex", justifyContent:"space-between" }}>
        <div style={{ fontWeight:800 }}>Last Man Standing</div>
        <div style={{ display:"flex", gap:12 }}>
          <a href="https://faucets.chain.link/base-sepolia" target="_blank">Get Testnet ETH</a>
        </div>
      </div>

      <main style={{ padding:24, display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        <div>
          <h1 style={{ fontSize:28, fontWeight:800 }}>
            The only way you lose is when you stop playing.
          </h1>
          <div style={{ height:220, border:"1px dashed #ccc", borderRadius:12, display:"grid", placeItems:"center" }}>
            (Put your vault video here)
          </div>
          <div style={{ marginTop:16 }}>
            <div>Vault: <b>{current ? (Number(current.vaultBalance)/1e18).toFixed(6) : "..." } ETH</b></div>
            <div>Deposit required: <b>{current ? (Number(current.currentRequiredAmount)/1e18).toFixed(6) : "..." } ETH</b></div>
            <div style={{ marginTop:8 }}>
              {/* In real prod, replace with wagmi button; for local just use CLI (see below) */}
              <i>Use the CLI commands below to simulate deposits locally.</i>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>{canShowTimer ? <Countdown deadline={current.deadline}/> : <b>Timer starts after first deposit</b>}</div>
            <div>
              <label>Rounds: </label>
              <select value={roundPick} onChange={e => setRoundPick(Number(e.target.value))}>
                <option value={0}>Current</option>
                {Array.from({length:10}, (_,i) => i+1).map(id => <option key={id} value={id}>Round {id}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop:16, padding:12, border:"1px solid #eee", borderRadius:8 }}>
            <div style={{ fontWeight:700, marginBottom:6 }}>Last 50th bonus</div>
            {current?.lastBonus?.winner
              ? <div>
                  Winner: <b>{current.lastBonus.winner}</b><br/>
                  Amount: <b>{(Number(current.lastBonus.amount)/1e18).toFixed(6)} ETH</b><br/>
                  Percentage: <b>{current.lastBonus.percentage}%</b><br/>
                  At deposit #: <b>{current.lastBonus.depositNum}</b>
                </div>
              : <div>No bonus yet.</div>}
          </div>

          {roundPick>0 && (
            <div style={{ marginTop:16, padding:12, border:"1px solid #eee", borderRadius:8 }}>
              <div style={{ fontWeight:700, marginBottom:6 }}>Round {roundPick} Summary</div>
              {summary ? (
                <>
                  Winner: <b>{summary.winner}</b><br/>
                  Final Vault: <b>{(Number(summary.finalVault)/1e18).toFixed(6)} ETH</b><br/>
                  Deposits: <b>{summary.totalDeposits}</b><br/>
                  Ended: <b>{new Date(summary.endedAt*1000).toLocaleString()}</b><br/>
                </>
              ) : "Loading..."}
              <div style={{ marginTop:10, fontWeight:700 }}>Deposits</div>
              <ul style={{ maxHeight:200, overflow:"auto" }}>
                {deposits.map((d) => (
                  <li key={d.tx}>#{d.depositNumber} — {d.depositor} — {(Number(d.amount)/1e18).toFixed(6)} ETH</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
