import axios from "axios";
const API = process.env.NEXT_PUBLIC_API || "http://localhost:4000";
export const getCurrent = () => axios.get(`${API}/api/rounds/current`).then(r => r.data);
export const getRoundSummary = (id: number) => axios.get(`${API}/api/rounds/${id}/summary`).then(r => r.data);
export const getRoundDeposits = (id: number) => axios.get(`${API}/api/rounds/${id}/deposits`).then(r => r.data);
export const getRoundBonuses = (id: number) => axios.get(`${API}/api/rounds/${id}/bonuses`).then(r => r.data);
