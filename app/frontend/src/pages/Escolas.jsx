import { useEffect, useState } from "react";
import { api, brl } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Download, Upload } from "lucide-react";

const empty = { nome: "", cnpj: "", sre: "Metropolitana A", diretor: "", telefone: "", email: "", endereco: "", observacoes: "" };

export default function Escolas() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [q, setQ] = useState("");

  const load = () => api.get("/escolas").then(r => setRows(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editId) await api.put(`/escolas/${editId}`, form);
      else await api.post("/escolas", form);
      toast.success(editId ? "Caixa escolar atualizada." : "Caixa escolar criada.");
      setOpen(false); setForm(empty); setEditId(null); load();
    } catch (e) { toast.error(e.response?.data?.detail || "Erro ao salvar"); }
  };
  const del = async (id) => {
    if (!window.confirm("Excluir esta caixa escolar?")) return;
    await api.delete(`/escolas/${id}`); toast.success("Excluída."); load();
  };
  const edit = (r) => { setForm({ ...empty, ...r }); setEditId(r.id); setOpen(true); };
  const exportX = () => { window.open(`${process.env.REACT_APP_BACKEND_URL}/api/export/escolas`, "_blank"); };

  const importX = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const fd = new FormData(); fd.append("file", f);
    try {
      const { data } = await api.post("/import/escolas", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(`${data.inserted} registros importados.`); load();
    } catch (err) { toast.error(err.response?.data?.detail || "Falha ao importar"); }
    e.target.value = "";
  };

  const filtered = rows.filter(r => (r.nome + r.cnpj + (r.diretor||"")).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Cadastros</div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Caixas Escolares</h2>
        </div>
        <div className="flex gap-2">
          <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por nome, CNPJ, direção…" className="w-64" data-testid="escolas-search" />
          <Button variant="outline" onClick={exportX} data-testid="escolas-export-xlsx"><Download size={15} className="mr-1.5"/>Exportar</Button>
          <label className="inline-flex items-center gap-1.5 border border-slate-300 rounded-md px-3 py-1.5 text-sm cursor-pointer hover:bg-slate-50">
            <Upload size={15}/> Importar
            <input type="file" accept=".xlsx" className="hidden" onChange={importX} data-testid="escolas-import-xlsx" />
          </label>
          <Dialog open={open} onOpenChange={(v)=>{ setOpen(v); if(!v){ setForm(empty); setEditId(null); } }}>
            <DialogTrigger asChild>
              <Button className="bg-sky-700 hover:bg-sky-800" data-testid="add-escola-button"><Plus size={15} className="mr-1.5"/>Nova Caixa Escolar</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle className="font-serif">{editId ? "Editar" : "Nova"} Caixa Escolar</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>Nome</Label><Input value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} data-testid="escola-nome-input"/></div>
                <div><Label>CNPJ</Label><Input value={form.cnpj} onChange={e=>setForm({...form, cnpj:e.target.value})} data-testid="escola-cnpj-input"/></div>
                <div><Label>SRE</Label><Input value={form.sre} onChange={e=>setForm({...form, sre:e.target.value})}/></div>
                <div><Label>Direção</Label><Input value={form.diretor} onChange={e=>setForm({...form, diretor:e.target.value})}/></div>
                <div><Label>Telefone</Label><Input value={form.telefone} onChange={e=>setForm({...form, telefone:e.target.value})}/></div>
                <div className="col-span-2"><Label>E-mail</Label><Input value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/></div>
                <div className="col-span-2"><Label>Endereço</Label><Input value={form.endereco} onChange={e=>setForm({...form, endereco:e.target.value})}/></div>
                <div className="col-span-2"><Label>Observações</Label><Textarea value={form.observacoes} onChange={e=>setForm({...form, observacoes:e.target.value})}/></div>
              </div>
              <DialogFooter><Button onClick={save} className="bg-sky-700 hover:bg-sky-800" data-testid="escola-save-button">Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <Table data-testid="escolas-table">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Nome</TableHead><TableHead>CNPJ</TableHead><TableHead>Direção</TableHead>
              <TableHead>Contato</TableHead><TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-slate-500 py-8">Nenhuma caixa escolar.</TableCell></TableRow>
            ) : filtered.map(r => (
              <TableRow key={r.id} className="row-hover">
                <TableCell className="font-medium">{r.nome}</TableCell>
                <TableCell className="font-mono-data text-xs">{r.cnpj}</TableCell>
                <TableCell>{r.diretor || "—"}</TableCell>
                <TableCell className="text-xs text-slate-600">{r.telefone || "—"}<br/>{r.email || ""}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={()=>edit(r)} data-testid={`edit-escola-${r.id}`}><Pencil size={15}/></Button>
                  <Button variant="ghost" size="icon" onClick={()=>del(r.id)} className="text-rose-600" data-testid={`delete-escola-${r.id}`}><Trash2 size={15}/></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
