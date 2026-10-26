import { useState } from "react";
import { api, API } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown } from "lucide-react";

async function download(kind, data, filename) {
  const resp = await fetch(`${API}/documentos/gerar`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, data }),
  });
  if (!resp.ok) { toast.error("Erro ao gerar documento"); return; }
  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  toast.success("Documento gerado.");
}

function Field({ label, children }) {
  return <div><Label className="text-xs uppercase tracking-wider font-semibold text-slate-600">{label}</Label><div className="mt-1">{children}</div></div>;
}

export default function Documentos() {
  // Parecer
  const [par, setPar] = useState({ tipo: "sem_ressalva", escola: "", cnpj: "", termo_numero: "", exercicio: "", analista: "", valor_recebido: "", valor_aplicado: "", rendimentos: "", saldo_devolver: "", ressalvas_text: "", observacoes: "" });
  const [capa, setCapa] = useState({ escola: "", cnpj: "", termo_numero: "", exercicio: "", tipo_processo: "Compromisso", analista: "", volume: "01", folhas: "" });
  const [etiq, setEtiq] = useState({ sre: "Metropolitana A", escola: "", cnpj: "", exercicio: "", tipo_processo: "Compromisso", numero_caixa: "", localizacao: "" });
  const [of, setOf] = useState({ numero: "", escola: "", termo_numero: "", exercicio: "", prazo_dias: 30, pendencias_text: "", observacoes: "", analista: "" });

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Oficinas</div>
        <h2 className="font-serif text-2xl font-bold text-slate-900">Gerador de Documentos (DOCX)</h2>
        <p className="text-sm text-slate-500">Preencha apenas o que precisar — campos vazios aparecem como "—" no documento.</p>
      </div>

      <Tabs defaultValue="parecer">
        <TabsList>
          <TabsTrigger value="parecer" data-testid="tab-parecer">Parecer Conclusivo</TabsTrigger>
          <TabsTrigger value="capa" data-testid="tab-capa">Capa de Processo</TabsTrigger>
          <TabsTrigger value="etiqueta" data-testid="tab-etiqueta">Etiqueta de Caixa</TabsTrigger>
          <TabsTrigger value="oficio" data-testid="tab-oficio">Ofício / Diligência</TabsTrigger>
        </TabsList>

        <TabsContent value="parecer">
          <Card><CardHeader><CardTitle className="font-serif">Parecer Conclusivo</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Field label="Tipo">
                <Select value={par.tipo} onValueChange={v=>setPar({...par, tipo:v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent><SelectItem value="sem_ressalva">Sem Ressalvas</SelectItem><SelectItem value="com_ressalva">Com Ressalvas</SelectItem></SelectContent>
                </Select>
              </Field>
              <Field label="Analista"><Input value={par.analista} onChange={e=>setPar({...par, analista:e.target.value})} data-testid="parecer-analista-input"/></Field>
              <Field label="Caixa Escolar"><Input value={par.escola} onChange={e=>setPar({...par, escola:e.target.value})} data-testid="parecer-escola-input"/></Field>
              <Field label="CNPJ"><Input value={par.cnpj} onChange={e=>setPar({...par, cnpj:e.target.value})}/></Field>
              <Field label="Nº Termo"><Input value={par.termo_numero} onChange={e=>setPar({...par, termo_numero:e.target.value})}/></Field>
              <Field label="Exercício"><Input value={par.exercicio} onChange={e=>setPar({...par, exercicio:e.target.value})}/></Field>
              <Field label="Valor Recebido"><Input value={par.valor_recebido} onChange={e=>setPar({...par, valor_recebido:e.target.value})}/></Field>
              <Field label="Valor Aplicado"><Input value={par.valor_aplicado} onChange={e=>setPar({...par, valor_aplicado:e.target.value})}/></Field>
              <Field label="Rendimentos"><Input value={par.rendimentos} onChange={e=>setPar({...par, rendimentos:e.target.value})}/></Field>
              <Field label="Saldo a Devolver"><Input value={par.saldo_devolver} onChange={e=>setPar({...par, saldo_devolver:e.target.value})}/></Field>
              {par.tipo === "com_ressalva" && (
                <div className="col-span-2"><Field label="Ressalvas (uma por linha)"><Textarea rows={4} value={par.ressalvas_text} onChange={e=>setPar({...par, ressalvas_text:e.target.value})}/></Field></div>
              )}
              <div className="col-span-2"><Field label="Observações"><Textarea value={par.observacoes} onChange={e=>setPar({...par, observacoes:e.target.value})}/></Field></div>
              <div className="col-span-2 flex justify-end">
                <Button className="bg-sky-700 hover:bg-sky-800" data-testid="gerar-parecer-button"
                  onClick={()=>download("parecer", { ...par, ressalvas: par.ressalvas_text.split("\n").map(s=>s.trim()).filter(Boolean) }, "parecer_conclusivo.docx")}>
                  <FileDown size={15} className="mr-1.5"/>Gerar DOCX
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capa">
          <Card><CardHeader><CardTitle className="font-serif">Capa de Processo</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Field label="Caixa Escolar"><Input value={capa.escola} onChange={e=>setCapa({...capa, escola:e.target.value})}/></Field>
              <Field label="CNPJ"><Input value={capa.cnpj} onChange={e=>setCapa({...capa, cnpj:e.target.value})}/></Field>
              <Field label="Nº Termo"><Input value={capa.termo_numero} onChange={e=>setCapa({...capa, termo_numero:e.target.value})}/></Field>
              <Field label="Exercício"><Input value={capa.exercicio} onChange={e=>setCapa({...capa, exercicio:e.target.value})}/></Field>
              <Field label="Tipo"><Input value={capa.tipo_processo} onChange={e=>setCapa({...capa, tipo_processo:e.target.value})}/></Field>
              <Field label="Analista"><Input value={capa.analista} onChange={e=>setCapa({...capa, analista:e.target.value})}/></Field>
              <Field label="Volume"><Input value={capa.volume} onChange={e=>setCapa({...capa, volume:e.target.value})}/></Field>
              <Field label="Folhas"><Input value={capa.folhas} onChange={e=>setCapa({...capa, folhas:e.target.value})}/></Field>
              <div className="col-span-2 flex justify-end">
                <Button className="bg-sky-700 hover:bg-sky-800" data-testid="gerar-capa-button" onClick={()=>download("capa", capa, "capa_processo.docx")}><FileDown size={15} className="mr-1.5"/>Gerar DOCX</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="etiqueta">
          <Card><CardHeader><CardTitle className="font-serif">Etiqueta de Caixa Box</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Field label="SRE"><Input value={etiq.sre} onChange={e=>setEtiq({...etiq, sre:e.target.value})}/></Field>
              <Field label="Caixa Escolar"><Input value={etiq.escola} onChange={e=>setEtiq({...etiq, escola:e.target.value})}/></Field>
              <Field label="CNPJ"><Input value={etiq.cnpj} onChange={e=>setEtiq({...etiq, cnpj:e.target.value})}/></Field>
              <Field label="Exercício(s)"><Input value={etiq.exercicio} onChange={e=>setEtiq({...etiq, exercicio:e.target.value})}/></Field>
              <Field label="Tipo"><Input value={etiq.tipo_processo} onChange={e=>setEtiq({...etiq, tipo_processo:e.target.value})}/></Field>
              <Field label="Nº Caixa"><Input value={etiq.numero_caixa} onChange={e=>setEtiq({...etiq, numero_caixa:e.target.value})}/></Field>
              <div className="col-span-2"><Field label="Localização"><Input value={etiq.localizacao} onChange={e=>setEtiq({...etiq, localizacao:e.target.value})}/></Field></div>
              <div className="col-span-2 flex justify-end">
                <Button className="bg-sky-700 hover:bg-sky-800" data-testid="gerar-etiqueta-button" onClick={()=>download("etiqueta", etiq, "etiqueta_caixa.docx")}><FileDown size={15} className="mr-1.5"/>Gerar DOCX</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oficio">
          <Card><CardHeader><CardTitle className="font-serif">Ofício de Diligência</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Field label="Nº Ofício"><Input value={of.numero} onChange={e=>setOf({...of, numero:e.target.value})} data-testid="oficio-doc-numero"/></Field>
              <Field label="Analista"><Input value={of.analista} onChange={e=>setOf({...of, analista:e.target.value})}/></Field>
              <Field label="Caixa Escolar"><Input value={of.escola} onChange={e=>setOf({...of, escola:e.target.value})}/></Field>
              <Field label="Nº Termo"><Input value={of.termo_numero} onChange={e=>setOf({...of, termo_numero:e.target.value})}/></Field>
              <Field label="Exercício"><Input value={of.exercicio} onChange={e=>setOf({...of, exercicio:e.target.value})}/></Field>
              <Field label="Prazo (dias)"><Input type="number" value={of.prazo_dias} onChange={e=>setOf({...of, prazo_dias:e.target.value})}/></Field>
              <div className="col-span-2"><Field label="Pendências (uma por linha)"><Textarea rows={4} value={of.pendencias_text} onChange={e=>setOf({...of, pendencias_text:e.target.value})}/></Field></div>
              <div className="col-span-2"><Field label="Observações"><Textarea value={of.observacoes} onChange={e=>setOf({...of, observacoes:e.target.value})}/></Field></div>
              <div className="col-span-2 flex justify-end">
                <Button className="bg-sky-700 hover:bg-sky-800" data-testid="gerar-oficio-button"
                  onClick={()=>download("oficio", { ...of, prazo_dias: Number(of.prazo_dias)||30, pendencias: of.pendencias_text.split("\n").map(s=>s.trim()).filter(Boolean) }, "oficio_diligencia.docx")}>
                  <FileDown size={15} className="mr-1.5"/>Gerar DOCX
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
