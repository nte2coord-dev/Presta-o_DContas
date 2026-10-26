import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

const empty = { email: "", password: "", name: "", role: "analista" };

export default function Usuarios() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = () => api.get("/users").then(r=>setRows(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try { await api.post("/users", form); toast.success("Usuário criado."); setOpen(false); setForm(empty); load(); }
    catch (e) { toast.error(e.response?.data?.detail || "Erro"); }
  };
  const del = async (id) => { if (!window.confirm("Excluir usuário?")) return; await api.delete(`/users/${id}`); load(); };

  if (user?.role !== "admin") return <div className="text-slate-500">Acesso restrito a administradores.</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Administração</div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Usuários</h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sky-700 hover:bg-sky-800" data-testid="add-user-button"><Plus size={15} className="mr-1.5"/>Novo Usuário</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-serif">Novo Usuário</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Nome</Label><Input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} data-testid="user-name-input"/></div>
              <div><Label>E-mail</Label><Input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} data-testid="user-email-input"/></div>
              <div><Label>Senha</Label><Input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} data-testid="user-password-input"/></div>
              <div><Label>Perfil</Label>
                <Select value={form.role} onValueChange={v=>setForm({...form, role:v})}>
                  <SelectTrigger data-testid="user-role-select"><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="analista">Analista</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter><Button onClick={save} className="bg-sky-700 hover:bg-sky-800" data-testid="user-save-button">Criar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <Table data-testid="users-table">
          <TableHeader><TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Nome</TableHead><TableHead>E-mail</TableHead><TableHead>Perfil</TableHead><TableHead className="text-right">Ações</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {rows.map(r=>(
              <TableRow key={r.id} className="row-hover">
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="text-xs">{r.email}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{r.role}</Badge></TableCell>
                <TableCell className="text-right">
                  {r.email !== user.email && <Button variant="ghost" size="icon" onClick={()=>del(r.id)} className="text-rose-600"><Trash2 size={15}/></Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
