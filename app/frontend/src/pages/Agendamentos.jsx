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
import { Plus, Trash2, Download } from "lucide-react";

const empty = { escola_id: "", termo_id: "", data: "", tipo_processo: "compromisso", analista_id: "", observacoes: "" };

export default function Agendamentos() {
  const [rows, setRows] = useState([]);
  const [escolas, setEscolas] = useState([]);
  const [termos, setTermos] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);

  const load = () => api.get("/agendamentos").then(r=>setRows(r.data));
  useEffect(() => {
    load();
    api.get("/escolas").then(r=>setEscolas(r.data));
    api.get("/termos").then(r=>setTermos(r.data));
    api.get("/users").then(r=>setUsers(r.data)).catch(()=>setUsers([]));
  }, []);

  const save = async () => {
    try { await api.post("/agendamentos", form); toast.success("Agendamento criado."); setOpen(false); setForm(empty); load(); }
    catch (e) { toast.error(e.response?.data?.detail || "Erro"); }
  };
  const del = async (id) => { if (!window.confirm("Excluir?")) return; await api.delete(`/agendamentos/${id}`); load(); };
  const nomeEscola = (id) => escolas.find(e=>e.id===id)?.nome || "—";
  const nomeUser = (id) => users.find(u=>u.id===id)?.name || "—";
  const exportX = () => window.open(`${process.env.REACT_APP_BACKEND_URL}/api/export/agendamentos`, "_blank");

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Fluxo</div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Agendamentos de Prestação de Contas</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportX}><Download size={15} className="mr-1.5"/>Exportar</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sky-700 hover:bg-sky-800" data-testid="add-agendamento-button"><Plus size={15} className="mr-1.5"/>Novo Agendamento</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader><DialogTitle className="font-serif">Novo Agendamento</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Caixa Escolar</Label>
                  <Select value={form.escola_id} onValueChange={v=>setForm({...form, escola_id:v})}>
                    <SelectTrigger data-testid="agendamento-escola-select"><SelectValue placeholder="Selecione…"/></SelectTrigger>
                    <SelectContent>{escolas.map(e=><SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Tipo</Label>
                  <Select value={form.tipo_processo} onValueChange={v=>setForm({...form, tipo_processo:v})}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compromisso">Termo de Compromisso</SelectItem>
                      <SelectItem value="obras">Termo de Obras</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Data e Hora</Label><Input type="datetime-local" value={form.data} onChange={e=>setForm({...form, data:e.target.value})} data-testid="agendamento-data-input"/></div>
                <div><Label>Analista</Label>
                  <Select value={form.analista_id} onValueChange={v=>setForm({...form, analista_id:v})}>
                    <SelectTrigger><SelectValue placeholder="Selecione…"/></SelectTrigger>
                    <SelectContent>{users.map(u=><SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Observações</Label><Textarea value={form.observacoes} onChange={e=>setForm({...form, observacoes:e.target.value})}/></div>
              </div>
              <DialogFooter><Button onClick={save} className="bg-sky-700 hover:bg-sky-800" data-testid="agendamento-save-button">Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <Table data-testid="agendamentos-table">
          <TableHeader><TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Data</TableHead><TableHead>Caixa Escolar</TableHead><TableHead>Tipo</TableHead>
            <TableHead>Analista</TableHead><TableHead>Observações</TableHead><TableHead className="text-right">Ações</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {rows.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-8">Nenhum agendamento.</TableCell></TableRow>
            : rows.map(r => (
              <TableRow key={r.id} className="row-hover">
                <TableCell className="font-mono-data text-xs">{r.data?.replace("T"," ")}</TableCell>
                <TableCell>{nomeEscola(r.escola_id)}</TableCell>
                <TableCell className="text-xs capitalize">{r.tipo_processo}</TableCell>
                <TableCell className="text-xs">{nomeUser(r.analista_id)}</TableCell>
                <TableCell className="text-xs text-slate-600 truncate max-w-xs">{r.observacoes}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={()=>del(r.id)} className="text-rose-600"><Trash2 size={15}/></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
