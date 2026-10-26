import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, School, FileText, HardHat, CalendarDays,
  FileWarning, Target, Calculator, FileSignature, Users, LogOut, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Painel", testid: "nav-dashboard", end: true },
  { to: "/escolas", icon: School, label: "Caixas Escolares", testid: "nav-escolas" },
  { to: "/termos", icon: FileText, label: "Termos de Compromisso", testid: "nav-termos" },
  { to: "/obras", icon: HardHat, label: "Termos de Obras", testid: "nav-obras" },
  { to: "/agendamentos", icon: CalendarDays, label: "Agendamentos", testid: "nav-agendamentos" },
  { to: "/oficios", icon: FileWarning, label: "Ofícios / Diligências", testid: "nav-oficios" },
  { to: "/metas", icon: Target, label: "Controle de Metas", testid: "nav-metas" },
  { to: "/calculadora", icon: Calculator, label: "Calculadora Financeira", testid: "nav-calculadora" },
  { to: "/documentos", icon: FileSignature, label: "Gerador de Documentos", testid: "nav-documentos" },
  { to: "/usuarios", icon: Users, label: "Usuários", testid: "nav-usuarios", adminOnly: true },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded bg-sky-700 text-white grid place-items-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="font-serif text-sm font-bold leading-tight text-slate-900">SEE/MG</div>
              <div className="text-[11px] text-slate-500 leading-tight">Prestação de Contas</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.filter(i => !i.adminOnly || isAdmin).map(({ to, icon: Icon, label, testid, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              data-testid={testid}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-base ${
                  isActive
                    ? "bg-sky-50 text-sky-800 font-semibold border-l-2 border-sky-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200">
          <div className="text-xs text-slate-500 px-2 py-1">
            <div className="font-medium text-slate-800 truncate" data-testid="user-name">{user?.name}</div>
            <div className="truncate">{user?.email}</div>
            <div className="mt-1 inline-block text-[10px] uppercase tracking-wider font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {user?.role}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 justify-start text-slate-600"
            data-testid="logout-button"
            onClick={async () => { await logout(); nav("/login"); }}
          >
            <LogOut size={15} className="mr-2" /> Sair
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="glass sticky top-0 z-10 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">SRE Metropolitana A</div>
            <h1 className="font-serif text-lg font-bold text-slate-900">Prestação de Contas</h1>
          </div>
          <div className="text-xs text-slate-500 tabular">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
