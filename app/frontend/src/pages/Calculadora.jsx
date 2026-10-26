import { useEffect, useState } from "react";
import { api, brl } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

const emptyLan = { tipo: "aporte", data: "", descricao: "", valor: 0, fornecedor: "", nota_fiscal: "" };

export default function Calculadora() {
  const [termos, setTermos] = useState([]);
  const [termoId, setTermoId] = useState("");
  const [rows, setRows] = useState([]);
  const [resumo, setResumo] = useState({});
  const [saldoBanco, setSaldoBanco] = useState("");
  const [lan, setLan] = useState(emptyLan);

  const loadTermos = () => api.get("/termos").then(r=>setTermos(r.data));
  useEffect(() => { loadTermos(); }, []);

  const load = async (id) => {
    if (!id) { setRows([]); setResumo({}); return; }
    const r1 = await api.get(`/lancamentos?termo_id=${id}`); setRows(r1.data);
    const r2 = await api.get(`/lancamentos/${id}/resumo`); setResumo(r2.data);
  };

  const add = async () => {
    if (!termoId) return toast.error("Selecione um termo primeiro");
    try {
      await api.post("/lancamentos", { ...lan, valor: Number(lan.valor), termo_id: termoId });
      setLan(emptyLan); load(termoId); toast.success("Lançamento adicionado.");
    } catch (e) { toast.error(e.response?.data?.detail || "Erro"); }
  };
  const del = async (id) => { await api.delete(`/lancamentos/${id}`); load(termoId); };

  const diff = Number(saldoBanco || 0) - (resumo.saldo || 0);

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Finanças</div>
        <h2 className="font-serif text-2xl font-bold text-slate-900">Calculadora Financeira — Conciliação Bancária</h2>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-serif text-base">Selecione o Termo</CardTitle></CardHeader>
        <CardContent>
          <Select value={termoId} onValueChange={(v)=>{ setTermoId(v); load(v); }}>
            <SelectTrigger className="w-full lg:w-[500px]" data-testid="calculadora-termo-select"><SelectValue placeholder="Selecione um termo…"/></SelectTrigger>
            <SelectContent>{termos.map(t=><SelectItem key={t.id} value={t.id}>{t.tipo === "obras" ? "[Obras] " : ""}Termo {t.numero} · Exerc. {t.exercicio}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      {termoId && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white border border-slate-200 rounded p-4"><div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Aportes</div><div className="font-serif text-xl font-bold text-slate-900 tabular">{brl(resumo.aportes)}</div></div>
            <div className="bg-white border border-slate-200 rounded p-4"><div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Rendimentos</div><div className="font-serif text-xl font-bold text-emerald-700 tabular">{brl(resumo.rendimentos)}</div></div>
            <div className="bg-white border border-slate-200 rounded p-4"><div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Despesas</div><div className="font-serif text-xl font-bold text-rose-700 tabular">{brl(resumo.despesas)}</div></div>
            <div className="bg-white border border-slate-200 rounded p-4"><div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Devolução</div><div className="font-serif text-xl font-bold text-slate-700 tabular">{brl(resumo.devolucao)}</div></div>
            <div className="bg-sky-50 border border-sky-200 rounded p-4"><div className="text-[11px] uppercase tracking-wider text-sky-800 font-semibold">Saldo Calculado</div><div className="font-serif text-xl font-bold text-sky-900 tabular" data-testid="calculadora-saldo-final">{brl(resumo.saldo)}</div></div>
          </div>

          <Card>
            <CardHeader><CardTitle className="font-serif text-base">Conciliação com Extrato Bancário</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 flex-wrap">
                <div><Label>Saldo Extrato Bancário (R$)</Label><Input type="number" step="0.01" value={saldoBanco} onChange={e=>setSaldoBanco(e.target.value)} className="w-56" data-testid="calculadora-saldo-banco"/></div>
                <div className={`px-4 py-3 rounded font-mono-data ${Math.abs(diff) < 0.01 ? "bg-emerald-50 text-emerald-800 border border-emerald-300" : "bg-amber-50 text-amber-800 border border-amber-300"}`} data-testid="calculadora-diferenca">
                  Diferença: {brl(diff)} {Math.abs(diff) < 0.01 ? "✓ confere" : "⚠ divergente"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="font-serif text-base">Novo Lançamento</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                <Select value={lan.tipo} onValueChange={v=>setLan({...lan, tipo:v})}>
                  <SelectTrigger data-testid="lancamento-tipo-select"><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aporte">Aporte</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                    <SelectItem value="rendimento">Rendimento</SelectItem>
                    <SelectItem value="devolucao">Devolução</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" value={lan.data} onChange={e=>setLan({...lan, data:e.target.value})}/>
                <Input placeholder="Descrição" className="md:col-span-2" value={lan.descricao} onChange={e=>setLan({...lan, descricao:e.target.value})} data-testid="lancamento-descricao-input"/>
                <Input placeholder="Fornecedor / NF" value={lan.fornecedor} onChange={e=>setLan({...lan, fornecedor:e.target.value})}/>
                <div className="flex gap-2">
                  <Input type="number" step="0.01" placeholder="Valor" value={lan.valor} onChange={e=>setLan({...lan, valor:e.target.value})} data-testid="lancamento-valor-input"/>
                  <Button onClick={add} className="bg-sky-700 hover:bg-sky-800" data-testid="lancamento-add-button"><Plus size={15}/></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white rounded-lg border border-slate-200">
            <Table data-testid="lancamentos-table">
              <TableHeader><TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>Data</TableHead><TableHead>Tipo</TableHead><TableHead>Descrição</TableHead>
                <TableHead>Fornecedor</TableHead><TableHead className="text-right">Valor</TableHead><TableHead className="w-16"></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {rows.length===0?<TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-8">Sem lançamentos.</TableCell></TableRow>
                :rows.map(r=>(
                  <TableRow key={r.id} className="row-hover">
                    <TableCell className="font-mono-data text-xs">{r.data}</TableCell>
                    <TableCell><span className="capitalize text-xs">{r.tipo}</span></TableCell>
                    <TableCell className="text-sm">{r.descricao}</TableCell>
                    <TableCell className="text-xs text-slate-600">{r.fornecedor}</TableCell>
                    <TableCell className="text-right font-mono-data text-xs tabular">{brl(r.valor)}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={()=>del(r.id)} className="text-rose-600"><Trash2 size={14}/></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
