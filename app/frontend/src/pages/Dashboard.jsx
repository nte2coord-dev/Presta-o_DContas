import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusMeta } from "@/lib/api";
import { School, FileText, HardHat, FileWarning, ShieldAlert, CheckCircle2, Archive, Clock } from "lucide-react";

function Kpi({ icon: Icon, label, value, tone = "sky", testid }) {
  const colors = {
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 transition-base hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
          <div className="font-serif text-3xl font-bold text-slate-900 mt-2 tabular" data-testid={testid}>{value ?? 0}</div>
        </div>
        <div className={`w-10 h-10 rounded-md border grid place-items-center ${colors[tone]}`}><Icon size={18}/></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/stats").then(r => setStats(r.data)).catch(() => setStats({}));
  }, []);

  const dist = stats?.status_distribution || {};

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Visão Geral</div>
        <h2 className="font-serif text-2xl font-bold text-slate-900">Painel do Setor</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={School} label="Caixas Escolares" value={stats?.escolas} tone="slate" testid="kpi-escolas-value" />
        <Kpi icon={FileText} label="Termos de Compromisso" value={stats?.termos_compromisso} tone="sky" testid="kpi-termos-compromisso-value" />
        <Kpi icon={HardHat} label="Termos de Obras" value={stats?.termos_obras} tone="sky" testid="kpi-termos-obras-value" />
        <Kpi icon={Clock} label="Em Análise" value={stats?.em_analise} tone="sky" testid="kpi-em-analise-value" />
        <Kpi icon={FileWarning} label="Diligências Emitidas" value={stats?.diligencia_emitida} tone="amber" testid="kpi-diligencias-value" />
        <Kpi icon={CheckCircle2} label="Aprovados" value={stats?.aprovados} tone="emerald" testid="kpi-aprovados-value" />
        <Kpi icon={ShieldAlert} label="Bloqueados SIAFI" value={stats?.bloqueados_siafi} tone="rose" testid="kpi-bloqueados-siafi-value" />
        <Kpi icon={Archive} label="Arquivados" value={stats?.arquivados} tone="slate" testid="kpi-arquivados-value" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="font-serif">Distribuição por Status</CardTitle></CardHeader>
          <CardContent>
            {Object.keys(dist).length === 0 ? (
              <div className="text-sm text-slate-500 py-6 text-center">Sem processos cadastrados ainda.</div>
            ) : (
              <div className="space-y-3">
                {Object.entries(dist).sort((a,b)=>b[1]-a[1]).map(([code, qtd]) => {
                  const m = statusMeta(code);
                  const total = Object.values(dist).reduce((s,v)=>s+v,0) || 1;
                  const pct = Math.round((qtd/total)*100);
                  return (
                    <div key={code}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <Badge variant="outline" className={`${m.cls} border`}>{m.label}</Badge>
                        <span className="tabular text-slate-700 font-medium">{qtd} <span className="text-slate-400">({pct}%)</span></span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded"><div className="h-1.5 bg-sky-600 rounded" style={{ width: `${pct}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-serif">Ofícios</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div className="text-sm text-slate-600">Abertos</div>
              <div className="font-serif text-2xl font-bold tabular text-slate-900" data-testid="kpi-oficios-abertos-value">{stats?.oficios_abertos ?? 0}</div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="text-sm text-slate-600">Prazo crítico (≤ 5 dias)</div>
              <div className="font-serif text-2xl font-bold tabular text-rose-700" data-testid="kpi-oficios-criticos-value">{stats?.oficios_criticos ?? 0}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
