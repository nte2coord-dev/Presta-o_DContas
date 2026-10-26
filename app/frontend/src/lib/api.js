import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Ocorreu um erro. Tente novamente.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export function brl(v) {
  const n = Number(v || 0);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const STATUS_OPTIONS = [
  { code: "EM_EXECUCAO", label: "Em Execução", cls: "bg-blue-100 text-blue-800 border-blue-300" },
  { code: "PRESTACAO_DEVIDA", label: "Prestação Devida", cls: "bg-amber-100 text-amber-800 border-amber-300" },
  { code: "AGENDADO", label: "Agendado", cls: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { code: "EM_ANALISE", label: "Em Análise", cls: "bg-sky-100 text-sky-800 border-sky-300" },
  { code: "DILIGENCIA_EMITIDA", label: "Diligência Emitida", cls: "bg-purple-100 text-purple-800 border-purple-300" },
  { code: "APROVADO_SEM_RESSALVA", label: "Aprovado sem Ressalva", cls: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { code: "APROVADO_COM_RESSALVA", label: "Aprovado com Ressalva", cls: "bg-teal-100 text-teal-800 border-teal-300" },
  { code: "BLOQUEADO_SIAFI", label: "Bloqueado SIAFI", cls: "bg-rose-100 text-rose-800 border-rose-300 font-bold" },
  { code: "ASSINADO", label: "Assinado", cls: "bg-slate-100 text-slate-800 border-slate-300" },
  { code: "ARQUIVADO", label: "Arquivado", cls: "bg-gray-100 text-gray-600 border-gray-300" },
];

export function statusMeta(code) {
  return STATUS_OPTIONS.find((s) => s.code === code) || { code, label: code, cls: "bg-slate-100 text-slate-800 border-slate-300" };
}
