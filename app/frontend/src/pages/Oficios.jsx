import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Download, AlertTriangle } from "lucide-react";

const empty = { numero: "", escola_id: "", termo_id: "", tipo: "diligencia", data_emissao: "", prazo_dias: 30, pendencias: [], status: "aberto", nlc: "", observacoes: "" };

function diasRestantes(data_emissao, prazo_dias) {
  if (!data_emissao) return null;
  try {
    const d = new Date(data_emissao);
    const limite = new Date(d.getTime() + (prazo_dias||0) * 86400000);
    const diff = Math.ceil((limite - new Date()) / 86400000);
    return diff;
  } catch { return null; }
}

export default function Oficios() {
  const [rows, setRows] = useState([]);
  const [escolas, setEscolas] = useState([]);
  const [termos, setTermos] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [pend, setPend] = useState("");

  const load = () => api.get("/oficios").then(r=>setRows(r.data));
  useEffect(() => {
    load();
    api.get("/escolas").then(r=>setEscolas(r.data));
    api.get("/termos").then(r=>setTermos(r.data));
  }, []);

  const save = async () => {
    const body = { ...form, prazo_dias: Number(form.prazo_dias)||30 };
    try {
      if (editId) await api.put(`/oficios/${editId}`, body);
      else await api.post("/oficios", body);
      toast.success("Ofício salvo."); setOpen(false); setForm(empty); setEditId(null); load();
    } catch (e) { toast.error(e.response?.data?.detail || "Erro"); }
  };
  const edit = (r) => { setForm({ ...empty, ...r, pendencias: r.pendencias || [] }); setEditId(r.id); setOpen(true); };
  const del = async (id) => { if (!window.confirm("Excluir?")) return; await api.delete(`/oficios/${id}`); load(); };
  const nomeEscola = (id) => escolas.find(e=>e.id===id)?.nome || "—";
  const exportX = () => window.open(`${process.env.REACT_APP_BACKEND_URL}/api/export/oficios`, "_blank");
  const addPend = () => { if (!pend.trim()) return; setForm({ ...form, pendencias: [...(form.pendencias||[]), pend.trim()] }); setPend(""); };
  const rmPend = (i) => setForm({ ...form, pendencias: form.pendencias.filter((_,x)=>x!==i) });

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Controle</div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Ofícios / Diligências</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportX} data-testid="oficios-export-xlsx"><Download size={15} className="mr-1.5"/>Exportar</Button>
          <Dialog open={open} onOpenChange={(v)=>{setOpen(v); if(!v){setForm(empty); setEditId(null);}}}>
            <DialogTrigger asChild>
              <Button className="bg-sky-700 hover:bg-sky-800" data-testid="add-oficio-button"><Plus size={15} className="mr-1.5"/>Novo Ofício</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle className="font-serif">{editId?"Editar":"Novo"} Ofício</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Número</Label><Input value={form.numero} onChange={e=>setForm({...form, numero:e.target.value})} data-testid="oficio-numero-input"/></div>
                <div><Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={v=>setForm({...form, tipo:v})}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diligencia">Diligência</SelectItem>
                      <SelectItem value="reiteracao">Reiteração</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2"><Label>Caixa Escolar</Label>
                  <Select value={form.escola_id} onValueChange={v=>setForm({...form, escola_id:v})}>
                    <SelectTrigger data-testid="oficio-escola-select"><SelectValue placeholder="Selecione…"/></SelectTrigger>
                    <SelectContent>{escolas.map(e=><SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Data Emissão</Label><Input type="date" value={form.data_emissao} onChange={e=>setForm({...form, data_emissao:e.target.value})}/></div>
                <div><Label>Prazo (dias)</Label><Input type="number" value={form.prazo_dias} onChange={e=>setForm({...form, prazo_dias:e.target.value})}/></div>
                <div><Label>Status</Label>
                  <Select value={form.status} onValueChange={v=>setForm({...form, status:v})}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="respondido">Respondido</SelectItem>
                      <SelectItem value="vencido">Vencido</SelectItem>
                      <SelectItem value="arquivado">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>NLC</Label><Input value={form.nlc} onChange={e=>setForm({...form, nlc:e.target.value})}/></div>
                <div className="col-span-2">
                  <Label>Pendências</Label>
                  <div className="flex gap-2 mt-1"><Input value={pend} onChange={e=>setPend(e.target.value)} placeholder="Adicionar pendência…" /><Button type="button" onClick={addPend} variant="outline">Adicionar</Button></div>
                  <ul className="mt-2 space-y-1">
                    {(form.pendencias||[]).map((p,i)=>(
                      <li key={i} className="text-sm bg-slate-50 border border-slate-200 rounded px-2 py-1 flex justify-between items-center">
                        <span>• {p}</span><button type="button" onClick={()=>rmPend(i)} className="text-rose-600 text-xs">remover</button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2"><Label>Observações</Label><Textarea value={form.observacoes} onChange={e=>setForm({...form, observacoes:e.target.value})}/></div>
              </div>
              <DialogFooter><Button onClick={save} className="bg-sky-700 hover:bg-sky-800" data-testid="oficio-save-button">Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <Table data-testid="oficios-table">
          <TableHeader><TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Nº</TableHead><TableHead>Caixa Escolar</TableHead><TableHead>Tipo</TableHead>
            <TableHead>Emissão</TableHead><TableHead>Prazo</TableHead><TableHead>Status</TableHead>
            <TableHead>NLC</TableHead><TableHead className="text-right">Ações</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {rows.length===0?<TableRow><TableCell colSpan={8} className="text-center text-slate-500 py-8">Nenhum ofício emitido.</TableCell></TableRow>
            :rows.map(r=>{
              const dias = diasRestantes(r.data_emissao, r.prazo_dias);
              const critico = r.status === "aberto" && dias !== null && dias <= 5;
              return (
                <TableRow key={r.id} className="row-hover">
                  <TableCell className="font-mono-data text-xs">{r.numero}</TableCell>
                  <TableCell>{nomeEscola(r.escola_id)}</TableCell>
                  <TableCell className="text-xs capitalize">{r.tipo}</TableCell>
                  <TableCell className="text-xs">{r.data_emissao}</TableCell>
                  <TableCell>
                    {r.status === "aberto" ? (
                      <Badge variant="outline" className={critico ? "bg-rose-50 text-rose-700 border-rose-300" : "bg-amber-50 text-amber-700 border-amber-300"}>
                        {critico && <AlertTriangle size={11} className="mr-1 inline"/>}
                        {dias >= 0 ? `${dias}d restantes` : `${Math.abs(dias)}d vencido`}
                      </Badge>
                    ) : <span className="text-xs text-slate-500">—</span>}
                  </TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{r.status}</Badge></TableCell>
                  <TableCell className="font-mono-data text-xs">{r.nlc || "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={()=>edit(r)}><Pencil size={15}/></Button>
                    <Button variant="ghost" size="icon" onClick={()=>del(r.id)} className="text-rose-600"><Trash2 size={15}/></Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
