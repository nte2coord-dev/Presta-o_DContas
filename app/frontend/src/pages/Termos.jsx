import { useEffect, useState } from "react";
import { api, brl, STATUS_OPTIONS, statusMeta } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Download } from "lucide-react";

export default function Termos({ tipo }) {
  const empty = {
    tipo, numero: "", escola_id: "", exercicio: new Date().getFullYear(),
    vigencia_inicio: "", vigencia_fim: "", valor_recebido: 0,
    plano_trabalho: "", analista_id: "", status: "EM_EXECUCAO", observacoes: ""
  };
  const [rows, setRows] = useState([]);
  const [escolas, setEscolas] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  const load = () => api.get(`/termos?tipo=${tipo}`).then(r => setRows(r.data));
  useEffect(() => {
    load();
    api.get("/escolas").then(r => setEscolas(r.data));
    api.get("/users").then(r => setUsers(r.data)).catch(()=>setUsers([]));
    setForm({ ...empty });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);

  const save = async () => {
    const body = { ...form, valor_recebido: Number(form.valor_recebido) || 0, exercicio: Number(form.exercicio) || new Date().getFullYear() };
    try {
      if (editId) await api.put(`/termos/${editId}`, body);
      else await api.post("/termos", body);
      toast.success("Termo salvo."); setOpen(false); setForm(empty); setEditId(null); load();
    } catch (e) { toast.error(e.response?.data?.detail || "Erro ao salvar"); }
  };
  const del = async (id) => { if (!window.confirm("Excluir termo?")) return; await api.delete(`/termos/${id}`); toast.success("Excluído."); load(); };
  const edit = (r) => { setForm({ ...empty, ...r }); setEditId(r.id); setOpen(true); };
  const changeStatus = async (id, status) => { await api.patch(`/termos/${id}/status`, { status, observacoes: "" }); toast.success("Status atualizado."); load(); };
  const exportX = () => window.open(`${process.env.REACT_APP_BACKEND_URL}/api/export/termos`, "_blank");

  const nomeEscola = (eid) => escolas.find(e => e.id === eid)?.nome || "—";
  const nomeUser = (uid) => users.find(u => u.id === uid)?.name || "—";
  const filtered = filtroStatus === "TODOS" ? rows : rows.filter(r => r.status === filtroStatus);

  const titulo = tipo === "obras" ? "Termos de Obras" : "Termos de Compromisso";

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Processos</div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">{titulo}</h2>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-56" data-testid="termos-filter-status"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos os status</SelectItem>
              {STATUS_OPTIONS.map(s => <SelectItem key={s.code} value={s.code}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportX} data-testid="termos-export-xlsx"><Download size={15} className="mr-1.5"/>Exportar</Button>
          <Dialog open={open} onOpenChange={(v)=>{ setOpen(v); if(!v){ setForm(empty); setEditId(null); } }}>
            <DialogTrigger asChild>
              <Button className="bg-sky-700 hover:bg-sky-800" data-testid="add-termo-button"><Plus size={15} className="mr-1.5"/>Novo {tipo === "obras" ? "Termo de Obras" : "Termo"}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader><DialogTitle className="font-serif">{editId ? "Editar" : "Novo"} {titulo}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Número do Termo</Label><Input value={form.numero} onChange={e=>setForm({...form, numero:e.target.value})} data-testid="termo-numero-input"/></div>
                <div><Label>Exercício</Label><Input type="number" value={form.exercicio} onChange={e=>setForm({...form, exercicio:e.target.value})}/></div>
                <div className="col-span-2">
                  <Label>Caixa Escolar</Label>
                  <Select value={form.escola_id} onValueChange={v=>setForm({...form, escola_id:v})}>
                    <SelectTrigger data-testid="termo-escola-select"><SelectValue placeholder="Selecione…"/></SelectTrigger>
                    <SelectContent>{escolas.map(e=><SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Vigência Início</Label><Input type="date" value={form.vigencia_inicio} onChange={e=>setForm({...form, vigencia_inicio:e.target.value})}/></div>
                <div><Label>Vigência Fim</Label><Input type="date" value={form.vigencia_fim} onChange={e=>setForm({...form, vigencia_fim:e.target.value})}/></div>
                <div><Label>Valor Recebido (R$)</Label><Input type="number" step="0.01" value={form.valor_recebido} onChange={e=>setForm({...form, valor_recebido:e.target.value})}/></div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v=>setForm({...form, status:v})}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>{STATUS_OPTIONS.map(s=><SelectItem key={s.code} value={s.code}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Analista Responsável</Label>
                  <Select value={form.analista_id || ""} onValueChange={v=>setForm({...form, analista_id:v})}>
                    <SelectTrigger><SelectValue placeholder="Selecione…"/></SelectTrigger>
                    <SelectContent>{users.filter(u=>u.role==="analista"||u.role==="admin").map(u=><SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="col-span-2"><Label>Plano de Trabalho</Label><Textarea value={form.plano_trabalho} onChange={e=>setForm({...form, plano_trabalho:e.target.value})}/></div>
                <div className="col-span-2"><Label>Observações</Label><Textarea value={form.observacoes} onChange={e=>setForm({...form, observacoes:e.target.value})}/></div>
              </div>
              <DialogFooter><Button onClick={save} className="bg-sky-700 hover:bg-sky-800" data-testid="termo-save-button">Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <Table data-testid="termos-table">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Termo</TableHead><TableHead>Caixa Escolar</TableHead>
              <TableHead>Exercício</TableHead><TableHead>Vigência</TableHead>
              <TableHead>Valor</TableHead><TableHead>Analista</TableHead>
              <TableHead>Status</TableHead><TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center text-slate-500 py-8">Nenhum termo cadastrado.</TableCell></TableRow>
            ) : filtered.map(r => {
              const m = statusMeta(r.status);
              return (
                <TableRow key={r.id} className="row-hover">
                  <TableCell className="font-mono-data text-xs">{r.numero}</TableCell>
                  <TableCell>{nomeEscola(r.escola_id)}</TableCell>
                  <TableCell className="tabular">{r.exercicio}</TableCell>
                  <TableCell className="text-xs text-slate-600">{r.vigencia_inicio}<br/>→ {r.vigencia_fim}</TableCell>
                  <TableCell className="tabular font-mono-data text-xs">{brl(r.valor_recebido)}</TableCell>
                  <TableCell className="text-xs">{nomeUser(r.analista_id)}</TableCell>
                  <TableCell>
                    <Select value={r.status} onValueChange={(v)=>changeStatus(r.id, v)}>
                      <SelectTrigger className={`h-7 text-xs ${m.cls}`}><SelectValue/></SelectTrigger>
                      <SelectContent>{STATUS_OPTIONS.map(s=><SelectItem key={s.code} value={s.code}>{s.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
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
