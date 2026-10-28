'use strict';

/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 10);
const money = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const today = () => new Date().toISOString().slice(0, 10);
const dash = v => (v === undefined || v === null || v === '' ? '—' : v);
const hash = s => { let h = 5381; for (const c of String(s)) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return String(h); };

/* ícones Lucide (mesmos do original) */
const LUCIDE = {
  dashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  school: '<path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10"/><path d="M18 5v17"/><path d="m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/>',
  fileText: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  hardHat: '<path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v3"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><rect x="2" y="15" width="20" height="4" rx="1"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  fileWarning: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  calculator: '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
  filePen: '<path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/><path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><path d="M8 18h1"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  shieldCheck: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  shieldAlert: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  circleCheck: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  archive: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
  download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  upload: '<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  logout: '<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
};
const ico = (n, s = 16) => `<svg class="ico" xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${LUCIDE[n]}</svg>`;

/* ---------- dados ---------- */
const STATUS_TERMO = ['Em Execução', 'Prestação Devida', 'Agendado', 'Em Análise', 'Diligência Emitida',
  'Aprovado sem Ressalva', 'Aprovado com Ressalva', 'Bloqueado SIAFI', 'Assinado', 'Arquivado'];
const STATUS_CLASS = {
  'Em Execução': 't-slate', 'Prestação Devida': 't-amber', 'Agendado': 't-violet', 'Em Análise': 't-sky',
  'Diligência Emitida': 't-amber', 'Aprovado sem Ressalva': 't-emerald', 'Aprovado com Ressalva': 't-emerald',
  'Bloqueado SIAFI': 't-rose', 'Assinado': 't-emerald', 'Arquivado': 't-slate',
  'Aberto': 't-sky', 'Respondido': 't-emerald', 'Vencido': 't-rose'
};
const PERFIS = { admin: 'Administrador', analista: 'Analista', gestor: 'Gestor' };
const TIPOS_LANC = ['Aporte', 'Rendimento', 'Despesa', 'Devolução'];

function seed() {
  const u = [
    { id: 'u1', nome: 'Administrador', email: 'admin@seemg.gov.br', senha: hash('Admin@2026'), perfil: 'admin' },
    { id: 'u2', nome: 'Analista Demo', email: 'analista@seemg.gov.br', senha: hash('Analista@2026'), perfil: 'analista' },
    { id: 'u3', nome: 'Gestor Demo', email: 'gestor@seemg.gov.br', senha: hash('Gestor@2026'), perfil: 'gestor' }
  ];
  return {
    usuarios: u,
    escolas: [
      { id: 'e1', nome: 'Escola Teste', cnpj: '12.345.678/0001-99', sre: 'Metropolitana A', direcao: 'Maria', telefone: '31999990000', email: 'escola@test', endereco: '', observacoes: '' },
      { id: 'e2', nome: 'Cicalt', cnpj: '26190794000198', sre: 'Metropolitana A', direcao: 'pedro', telefone: '45628794', email: 'rrrr@ggggg', endereco: '', observacoes: '' }
    ],
    termos: [
      { id: 't1', tipo: 'compromisso', numero: 'TC-001/2026', exercicio: 2026, escolaId: 'e1', inicio: '2026-01-01', fim: '2026-12-31', valor: 10000, status: 'Em Análise', analistaId: '', plano: '', observacoes: '', extrato: '' },
      { id: 't2', tipo: 'compromisso', numero: '123456', exercicio: 2026, escolaId: 'e2', inicio: '', fim: '', valor: 2000, status: 'Prestação Devida', analistaId: 'u2', plano: '', observacoes: '', extrato: '' }
    ],
    agendamentos: [{ id: 'a1', escolaId: 'e1', tipo: 'Termo de Compromisso', data: '2026-11-01T10:00', analistaId: '', observacoes: '' }],
    oficios: [{ id: 'o1', numero: 'OF-001', tipo: 'Diligência', escolaId: 'e1', emissao: '2026-10-26', prazo: 10, status: 'Aberto', nlc: '', pendencias: '', observacoes: '' }],
    metas: [],
    lancamentos: [
      { id: 'l1', termoId: 't1', tipo: 'Aporte', data: '2026-01-01', descricao: 'Repasse inicial', fornecedor: '', valor: 10000 },
      { id: 'l2', termoId: 't1', tipo: 'Despesa', data: '2026-01-02', descricao: 'Material de consumo', fornecedor: '', valor: 3000 },
      { id: 'l3', termoId: 't1', tipo: 'Rendimento', data: '2026-01-03', descricao: 'Rendimento de aplicação', fornecedor: '', valor: 500 }
    ]
  };
}

let db;
function load() {
  try { db = JSON.parse(localStorage.getItem('pc_db')); } catch { db = null; }
  if (!db) { db = seed(); save(); }
}
function save() { try { localStorage.setItem('pc_db', JSON.stringify(db)); } catch { /* armazenamento indisponível */ } }
function session() { try { return db.usuarios.find(u => u.id === localStorage.getItem('pc_user')) || null; } catch { return null; } }

const byId = (list, id) => list.find(x => x.id === id);
const escolaNome = id => byId(db.escolas, id)?.nome ?? '—';
const userNome = id => byId(db.usuarios, id)?.nome ?? '—';
const canEdit = () => session()?.perfil !== 'gestor';
const isAdmin = () => session()?.perfil === 'admin';

/* ---------- componentes ---------- */
const badge = (s, cls) => `<span class="badge ${cls || STATUS_CLASS[s] || 't-slate'}">${esc(s)}</span>`;
const statusSelect = (r, opts) => `<select class="status ${STATUS_CLASS[r.status] || 't-slate'}" data-status="${r.id}" ${canEdit() ? '' : 'disabled'}>
  ${opts.map(o => `<option ${o === r.status ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;

function prazoInfo(o) {
  const fim = new Date(o.emissao + 'T00:00:00'); fim.setDate(fim.getDate() + Number(o.prazo || 0));
  const hoje = new Date(today() + 'T00:00:00');
  return Math.round((fim - hoje) / 86400000);
}
const prazoTxt = o => { const d = prazoInfo(o); return d >= 0 ? `${d}d restantes` : `vencido há ${-d}d`; };

function csv(rows, header) {
  const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return '﻿' + [header.map(q).join(';'), ...rows.map(r => r.map(q).join(';'))].join('\r\n');
}
function download(name, content, type = 'text/csv;charset=utf-8') {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------- modal de formulário ---------- */
function openForm({ title, fields, values = {}, onSave }) {
  const ov = document.createElement('div');
  ov.className = 'overlay';
  const input = f => {
    const v = values[f.k] ?? f.def ?? '';
    const common = `name="${f.k}" id="f_${f.k}" ${f.req ? 'required' : ''}`;
    if (f.type === 'select') {
      const ph = f.req || f.noEmpty ? '' : '<option value="">Selecione…</option>';
      return `<select class="input" ${common}>${f.req && !v ? '<option value="">Selecione…</option>' : ph}
        ${f.options.map(o => `<option value="${esc(o.v)}" ${String(o.v) === String(v) ? 'selected' : ''}>${esc(o.l)}</option>`).join('')}</select>`;
    }
    if (f.type === 'textarea') return `<textarea class="input" rows="3" ${common}>${esc(v)}</textarea>`;
    return `<input class="input" type="${f.type || 'text'}" ${f.step ? `step="${f.step}"` : ''} ${f.min !== undefined ? `min="${f.min}"` : ''} ${common} value="${esc(v)}">`;
  };
  ov.innerHTML = `<form class="modal"><h2>${esc(title)}</h2><button type="button" class="x" data-close aria-label="Close">${ico('x')}</button>
    <div class="grid2">${fields.map(f => `<div class="${f.full || f.type === 'textarea' ? 'full' : ''}"><label class="f" for="f_${f.k}">${esc(f.label)}</label>${input(f)}</div>`).join('')}</div>
    <div class="foot"><button class="btn primary">Salvar</button></div></form>`;
  document.body.appendChild(ov);
  const close = () => ov.remove();
  ov.addEventListener('mousedown', e => { if (e.target === ov) close(); });
  $('[data-close]', ov).onclick = close;
  document.addEventListener('keydown', function esc_(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc_); } });
  $('form', ov).onsubmit = e => {
    e.preventDefault();
    const out = {};
    for (const f of fields) {
      let v = $(`[name="${f.k}"]`, ov).value;
      if (f.type === 'number') v = v === '' ? 0 : Number(v);
      out[f.k] = v;
    }
    if (onSave(out) !== false) { close(); render(); }
  };
  ov.querySelector('input,select,textarea')?.focus();
}

/* ---------- definição das entidades (tabelas CRUD) ---------- */
const opts = (list, label) => list.map(x => ({ v: x.id, l: label(x) }));
const escolaOpts = () => opts(db.escolas, e => e.nome);
const analistaOpts = all => opts(db.usuarios.filter(u => all || u.perfil !== 'gestor'), u => u.nome);

function termoCfg(tipo, title, singular) {
  return {
    key: 'termos', filtro: true, eyebrow: 'Processos', title,
    novo: `Novo ${singular}`, formTitle: `Termos de ${tipo === 'obras' ? 'Obras' : 'Compromisso'}`,
    rows: () => db.termos.filter(t => t.tipo === tipo),
    defaults: { tipo },
    fields: () => [
      { k: 'numero', label: 'Número do Termo', req: true },
      { k: 'exercicio', label: 'Exercício', type: 'number', def: new Date().getFullYear() },
      { k: 'escolaId', label: 'Caixa Escolar', type: 'select', options: escolaOpts(), req: true },
      { k: 'inicio', label: 'Vigência Início', type: 'date' },
      { k: 'fim', label: 'Vigência Fim', type: 'date' },
      { k: 'valor', label: 'Valor Recebido (R$)', type: 'number', step: '0.01', min: 0 },
      { k: 'status', label: 'Status', type: 'select', options: STATUS_TERMO.map(s => ({ v: s, l: s })), def: 'Em Execução', noEmpty: true },
      { k: 'analistaId', label: 'Analista Responsável', type: 'select', options: analistaOpts(false) },
      { k: 'plano', label: 'Plano de Trabalho', type: 'textarea' },
      { k: 'observacoes', label: 'Observações', type: 'textarea' }
    ],
    cols: [
      { h: 'Termo', c: 'mono', f: r => esc(r.numero) },
      { h: 'Caixa Escolar', f: r => esc(escolaNome(r.escolaId)) },
      { h: 'Exercício', f: r => esc(r.exercicio) },
      { h: 'Vigência', c: 'sm', f: r => r.inicio || r.fim ? `${esc(dash(r.inicio))}<br>→ ${esc(dash(r.fim))}` : '→' },
      { h: 'Valor', c: 'mono', f: r => money(r.valor) },
      { h: 'Analista', c: 'sm', f: r => esc(userNome(r.analistaId)) },
      { h: 'Status', f: r => statusSelect(r, STATUS_TERMO) }
    ],
    csvHead: ['Termo', 'Caixa Escolar', 'Exercício', 'Início', 'Fim', 'Valor', 'Analista', 'Status'],
    csvRow: r => [r.numero, escolaNome(r.escolaId), r.exercicio, r.inicio, r.fim, r.valor, userNome(r.analistaId), r.status],
    filterBy: (r, f) => !f || r.status === f
  };
}

const CFG = {
  escolas: {
    key: 'escolas', eyebrow: 'Cadastros', title: 'Caixas Escolares', novo: 'Nova Caixa Escolar', formTitle: 'Caixa Escolar', importar: true,
    rows: () => db.escolas, defaults: {},
    fields: () => [
      { k: 'nome', label: 'Nome', req: true }, { k: 'cnpj', label: 'CNPJ', req: true },
      { k: 'sre', label: 'SRE', def: 'Metropolitana A' }, { k: 'direcao', label: 'Direção' },
      { k: 'telefone', label: 'Telefone' }, { k: 'email', label: 'E-mail' },
      { k: 'endereco', label: 'Endereço', full: true }, { k: 'observacoes', label: 'Observações', type: 'textarea' }
    ],
    cols: [
      { h: 'Nome', f: r => esc(r.nome) }, { h: 'CNPJ', c: 'mono', f: r => esc(r.cnpj) }, { h: 'Direção', f: r => esc(dash(r.direcao)) },
      { h: 'Contato', f: r => `${esc(dash(r.telefone))}<br><span class="sub">${esc(dash(r.email))}</span>` }
    ],
    csvHead: ['Nome', 'CNPJ', 'SRE', 'Direção', 'Telefone', 'E-mail', 'Endereço', 'Observações'],
    csvRow: r => [r.nome, r.cnpj, r.sre, r.direcao, r.telefone, r.email, r.endereco, r.observacoes]
  },
  termos: termoCfg('compromisso', 'Termos de Compromisso', 'Termo'),
  obras: termoCfg('obras', 'Termos de Obras', 'Termo de Obras'),
  agendamentos: {
    key: 'agendamentos', eyebrow: 'Fluxo', title: 'Agendamentos de Prestação de Contas', novo: 'Novo Agendamento', formTitle: 'Agendamento',
    rows: () => [...db.agendamentos].sort((a, b) => (a.data || '').localeCompare(b.data || '')), defaults: {},
    fields: () => [
      { k: 'escolaId', label: 'Caixa Escolar', type: 'select', options: escolaOpts(), req: true },
      { k: 'tipo', label: 'Tipo', type: 'select', options: ['Termo de Compromisso', 'Termo de Obras', 'Outros'].map(v => ({ v, l: v })), noEmpty: true, def: 'Termo de Compromisso' },
      { k: 'data', label: 'Data e Hora', type: 'datetime-local', req: true },
      { k: 'analistaId', label: 'Analista', type: 'select', options: analistaOpts(true) },
      { k: 'observacoes', label: 'Observações', type: 'textarea' }
    ],
    cols: [
      { h: 'Data', c: 'mono', f: r => esc((r.data || '').replace('T', ' ')) }, { h: 'Caixa Escolar', f: r => esc(escolaNome(r.escolaId)) },
      { h: 'Tipo', f: r => esc(r.tipo) }, { h: 'Analista', f: r => esc(userNome(r.analistaId)) }, { h: 'Observações', f: r => esc(r.observacoes) }
    ],
    csvHead: ['Data', 'Caixa Escolar', 'Tipo', 'Analista', 'Observações'],
    csvRow: r => [r.data, escolaNome(r.escolaId), r.tipo, userNome(r.analistaId), r.observacoes]
  },
  oficios: {
    key: 'oficios', eyebrow: 'Controle', title: 'Ofícios / Diligências', novo: 'Novo Ofício', formTitle: 'Ofício',
    rows: () => db.oficios, defaults: {},
    fields: () => [
      { k: 'numero', label: 'Número', req: true },
      { k: 'tipo', label: 'Tipo', type: 'select', options: ['Diligência', 'Reiteração', 'Outros'].map(v => ({ v, l: v })), noEmpty: true, def: 'Diligência' },
      { k: 'escolaId', label: 'Caixa Escolar', type: 'select', options: escolaOpts(), req: true },
      { k: 'emissao', label: 'Data Emissão', type: 'date', def: today(), req: true },
      { k: 'prazo', label: 'Prazo (dias)', type: 'number', def: 30, min: 0 },
      { k: 'status', label: 'Status', type: 'select', options: ['Aberto', 'Respondido', 'Vencido', 'Arquivado'].map(v => ({ v, l: v })), noEmpty: true, def: 'Aberto' },
      { k: 'nlc', label: 'NLC' }, { k: 'pendencias', label: 'Pendências' },
      { k: 'observacoes', label: 'Observações', type: 'textarea' }
    ],
    cols: [
      { h: 'Nº', c: 'mono', f: r => esc(r.numero) }, { h: 'Caixa Escolar', f: r => esc(escolaNome(r.escolaId)) }, { h: 'Tipo', f: r => esc(r.tipo) },
      { h: 'Emissão', c: 'mono', f: r => esc(r.emissao) },
      { h: 'Prazo', f: r => r.status === 'Aberto' ? `<span class="${prazoInfo(r) <= 5 ? 'diff bad' : ''}">${prazoTxt(r)}</span>` : '—' },
      { h: 'Status', f: r => badge(r.status) }, { h: 'NLC', f: r => esc(dash(r.nlc)) }
    ],
    csvHead: ['Nº', 'Caixa Escolar', 'Tipo', 'Emissão', 'Prazo (dias)', 'Status', 'NLC', 'Pendências'],
    csvRow: r => [r.numero, escolaNome(r.escolaId), r.tipo, r.emissao, r.prazo, r.status, r.nlc, r.pendencias]
  },
  metas: {
    key: 'metas', eyebrow: 'Desempenho', title: 'Controle de Metas', novo: 'Nova Meta', formTitle: 'Meta',
    rows: () => db.metas, defaults: {},
    fields: () => [
      { k: 'analistaId', label: 'Analista', type: 'select', options: analistaOpts(true), req: true },
      { k: 'exercicio', label: 'Exercício', type: 'number', def: new Date().getFullYear() },
      { k: 'meta', label: 'Meta', type: 'number', min: 0 }, { k: 'concluidos', label: 'Concluídos', type: 'number', min: 0 },
      { k: 'observacoes', label: 'Observações', type: 'textarea' }
    ],
    cols: [
      { h: 'Analista', f: r => esc(userNome(r.analistaId)) }, { h: 'Exercício', f: r => esc(r.exercicio) },
      { h: 'Meta', f: r => esc(r.meta) }, { h: 'Concluídos', f: r => esc(r.concluidos) },
      { h: 'Progresso', f: r => { const p = r.meta ? Math.min(100, Math.round(r.concluidos / r.meta * 100)) : 0; return `<div class="prog"><div class="track"><div class="fill" style="width:${p}%"></div></div>${p}%</div>`; } }
    ],
    csvHead: null
  },
  usuarios: {
    key: 'usuarios', eyebrow: 'Administração', title: 'Usuários', novo: 'Novo Usuário', formTitle: 'Usuário', adminOnly: true,
    rows: () => db.usuarios, defaults: {},
    fields: row => [
      { k: 'nome', label: 'Nome', req: true }, { k: 'email', label: 'E-mail', type: 'email', req: true },
      { k: 'senha', label: row ? 'Senha (deixe vazio para manter)' : 'Senha', type: 'password', req: !row, def: '' },
      { k: 'perfil', label: 'Perfil', type: 'select', noEmpty: true, def: 'analista', options: Object.entries(PERFIS).map(([v, l]) => ({ v, l })) }
    ],
    cols: [{ h: 'Nome', f: r => esc(r.nome) }, { h: 'E-mail', f: r => esc(r.email) }, { h: 'Perfil', f: r => badge(PERFIS[r.perfil], 't-sky') }],
    csvHead: null
  }
};

/* ---------- páginas ---------- */
const filters = {};

function listPage(name) {
  const c = CFG[name];
  const ro = !canEdit() || (c.adminOnly && !isAdmin());
  let rows = c.rows();
  if (c.filtro && filters[name]) rows = rows.filter(r => c.filterBy(r, filters[name]));
  const head = c.cols.map(x => `<th>${x.h}</th>`).join('') + '<th></th>';
  const body = rows.length ? rows.map(r => `<tr>${c.cols.map(x => `<td class="${x.c || ''}">${x.f(r)}</td>`).join('')}
      <td class="actions">${ro ? '' : `<button class="icon-btn" title="Editar" data-act="edit" data-ent="${name}" data-id="${r.id}">${ico('pencil')}</button>
      <button class="icon-btn del" title="Excluir" data-act="del" data-ent="${name}" data-id="${r.id}">${ico('trash')}</button>`}</td></tr>`).join('')
    : `<tr><td class="empty" colspan="${c.cols.length + 1}">${name === 'metas' ? 'Sem metas cadastradas.' : c.filtro ? 'Nenhum termo cadastrado.' : 'Nenhum registro cadastrado.'}</td></tr>`;
  return `<div class="stack"><div class="pagehead"><div class="eyebrow">${c.eyebrow}</div><h2 style="font-size:24px;line-height:32px;letter-spacing:-.36px">${c.title}</h2>
    <div class="tools">
      ${c.filtro ? `<select class="filter" data-filter="${name}"><option value="">Todos os status</option>${STATUS_TERMO.map(s => `<option ${filters[name] === s ? 'selected' : ''}>${s}</option>`).join('')}</select>` : ''}
      ${c.csvHead ? `<button class="btn" data-act="export" data-ent="${name}">${ico('download', 15)}Exportar</button>` : ''}
      ${c.importar && !ro ? `<button class="btn" data-act="import" data-ent="${name}">${ico('upload', 15)}Importar</button>` : ''}
      ${ro ? '' : `<button class="btn primary" data-act="new" data-ent="${name}">${ico('plus', 15)}${c.novo}</button>`}
    </div></div>
    <div class="card tablewrap"><table><thead><tr>${head.replace('<th></th>', '<th>Ações</th>')}</tr></thead><tbody>${body}</tbody></table></div></div>`;
}

function painelPage() {
  const t = db.termos;
  const n = s => t.filter(x => s.includes(x.status)).length;
  const stats = [
    ['Caixas Escolares', db.escolas.length, 'school', 'slate'],
    ['Termos de Compromisso', t.filter(x => x.tipo === 'compromisso').length, 'fileText', 'sky'],
    ['Termos de Obras', t.filter(x => x.tipo === 'obras').length, 'hardHat', 'sky'],
    ['Em Análise', n(['Em Análise']), 'clock', 'sky'],
    ['Diligências Emitidas', n(['Diligência Emitida']), 'fileWarning', 'amber'],
    ['Aprovados', n(['Aprovado sem Ressalva', 'Aprovado com Ressalva']), 'circleCheck', 'emerald'],
    ['Bloqueados SIAFI', n(['Bloqueado SIAFI']), 'shieldAlert', 'rose'],
    ['Arquivados', n(['Arquivado']), 'archive', 'slate']
  ];
  const dist = STATUS_TERMO.map(s => [s, t.filter(x => x.status === s).length]).filter(x => x[1]);
  const abertos = db.oficios.filter(o => o.status === 'Aberto');
  const criticos = abertos.filter(o => prazoInfo(o) <= 5).length;
  return `<div class="stack"><div><div class="eyebrow">Visão geral</div><h2 style="font-size:24px;line-height:32px;letter-spacing:-.36px">Painel do Setor</h2></div>
    <div class="stats">${stats.map(([l, v, i, tone]) => `<div class="stat"><div><div class="l">${l}</div><div class="n">${v}</div></div><div class="ibox tone-${tone}">${ico(i, 18)}</div></div>`).join('')}</div>
    <div class="panels">
      <div class="card rounded-xl panel"><div class="ph">Distribuição por Status</div><div class="pb dist">
        ${dist.length ? dist.map(([s, v]) => `<div><div class="top">${badge(s)}<span class="v">${v} <i>(${Math.round(v / t.length * 100)}%)</i></span></div><div class="track"><div class="fill" style="width:${Math.round(v / t.length * 100)}%"></div></div></div>`).join('') : '<p class="sub">Sem termos cadastrados.</p>'}</div></div>
      <div class="card rounded-xl panel"><div class="ph">Ofícios</div><div class="pb">
        <div class="kv">Abertos<b>${abertos.length}</b></div>
        <div class="kv">Prazo crítico (≤ 5 dias)<b class="crit">${criticos}</b></div></div></div>
    </div></div>`;
}

let calcTermo = '';
function calcPage() {
  const termos = db.termos;
  if (!termos.find(t => t.id === calcTermo)) calcTermo = '';
  let inner = '';
  if (calcTermo) {
    const t = byId(termos, calcTermo);
    const l = db.lancamentos.filter(x => x.termoId === t.id).sort((a, b) => a.data.localeCompare(b.data));
    const sum = tp => l.filter(x => x.tipo === tp).reduce((s, x) => s + Number(x.valor), 0);
    const saldo = sum('Aporte') + sum('Rendimento') - sum('Despesa') - sum('Devolução');
    const extrato = t.extrato === '' || t.extrato == null ? 0 : Number(t.extrato);
    const dif = Math.round((extrato - saldo) * 100) / 100;
    inner = `<div class="stats" style="margin-top:18px">
      ${[['Aportes', sum('Aporte')], ['Rendimentos', sum('Rendimento')], ['Despesas', sum('Despesa')], ['Devolução', sum('Devolução')], ['Saldo calculado', saldo]]
        .map(([a, b]) => `<div class="stat"><div><div class="l">${a}</div><div class="n" style="font-size:22px">${money(b)}</div></div></div>`).join('')}</div>
      <div class="card panel pad" style="margin-bottom:14px"><h3>Conciliação com Extrato Bancário</h3>
        <div class="row"><div><label class="f">Saldo Extrato Bancário (R$)</label><input class="input" type="number" step="0.01" id="extrato" value="${esc(t.extrato)}" ${canEdit() ? '' : 'disabled'}></div>
        <div><span class="diff ${dif === 0 ? 'ok' : 'bad'}">Diferença: ${dif < 0 ? '-' : ''}${money(Math.abs(dif))} ${dif === 0 ? '✓ conciliado' : '⚠ divergente'}</span></div></div></div>
      ${canEdit() ? `<div class="card panel pad" style="margin-bottom:14px"><h3>Novo Lançamento</h3><form id="lancForm" class="row">
        <div><label class="f">Tipo</label><select class="input" name="tipo">${TIPOS_LANC.map(x => `<option>${x}</option>`).join('')}</select></div>
        <div><label class="f">Data</label><input class="input" type="date" name="data" value="${today()}" required></div>
        <div style="flex:2 1 200px"><label class="f">Descrição</label><input class="input" name="descricao"></div>
        <div><label class="f">Fornecedor</label><input class="input" name="fornecedor"></div>
        <div><label class="f">Valor (R$)</label><input class="input" type="number" step="0.01" min="0" name="valor" required></div>
        <div style="flex:0 0 auto"><button class="btn primary">Adicionar</button></div></form></div>` : ''}
      <div class="card tablewrap"><table><thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Fornecedor</th><th>Valor</th><th></th></tr></thead><tbody>
      ${l.length ? l.map(x => `<tr><td class="mono">${esc(x.data)}</td><td>${esc(x.tipo)}</td><td>${esc(x.descricao)}</td><td>${esc(x.fornecedor)}</td><td class="mono">${money(x.valor)}</td>
        <td class="actions">${canEdit() ? `<button class="icon-btn del" data-act="del-lanc" data-id="${x.id}">${ico('trash')}</button>` : ''}</td></tr>`).join('') : '<tr><td class="empty" colspan="6">Sem lançamentos.</td></tr>'}
      </tbody></table></div>`;
  }
  return `<div class="pagehead"><div><div class="eyebrow">Finanças</div><h1>Calculadora Financeira — Conciliação Bancária</h1></div></div>
    <label class="f">Selecione o Termo</label>
    <select class="input" id="calcSel" style="max-width:420px"><option value="">Selecione um termo…</option>
    ${termos.map(t => `<option value="${t.id}" ${t.id === calcTermo ? 'selected' : ''}>Termo ${esc(t.numero)} · Exerc. ${esc(t.exercicio)}</option>`).join('')}</select>${inner}`;
}

let docTipo = 'Parecer Conclusivo';
const docVals = {};
const DOC_FIELDS = [
  ['analista', 'Analista'], ['escola', 'Caixa Escolar'], ['cnpj', 'CNPJ'], ['termo', 'Nº Termo'], ['exercicio', 'Exercício'],
  ['recebido', 'Valor Recebido'], ['aplicado', 'Valor Aplicado'], ['rendimentos', 'Rendimentos'], ['saldo', 'Saldo a Devolver']
];
function docsPage() {
  const tabs = ['Parecer Conclusivo', 'Capa de Processo', 'Etiqueta de Caixa', 'Ofício / Diligência'];
  return `<div class="pagehead"><div><div class="eyebrow">Oficinas</div><h1>Gerador de Documentos (DOCX)</h1></div></div>
    <p class="hint">Preencha apenas o que precisar — campos vazios aparecem como "—" no documento.</p>
    <div class="tabs">${tabs.map(t => `<button class="tab ${t === docTipo ? 'on' : ''}" data-doctab="${t}">${t}</button>`).join('')}</div>
    <form id="docForm" class="card panel pad"><div class="grid2">
      <div><label class="f">Tipo</label><select class="input" name="tipo"><option ${docVals.tipo === 'Sem Ressalvas' ? 'selected' : ''}>Sem Ressalvas</option><option ${docVals.tipo === 'Com Ressalvas' ? 'selected' : ''}>Com Ressalvas</option></select></div>
      ${DOC_FIELDS.map(([k, l]) => `<div><label class="f">${l}</label><input class="input" name="${k}" value="${esc(docVals[k])}"></div>`).join('')}
      <div class="full"><label class="f">Observações</label><textarea class="input" rows="3" name="obs">${esc(docVals.obs)}</textarea></div></div>
      <div class="foot" style="margin-top:16px"><button class="btn primary">${ico('download', 15)}Gerar DOCX</button></div></form>`;
}

async function gerarDocx(tipo, v) {
  if (!window.docx) { alert('Biblioteca DOCX não carregada (verifique a conexão com a internet).'); return; }
  const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType } = window.docx;
  const val = x => (x === undefined || x === null || String(x).trim() === '' ? '—' : String(x));
  const money_ = x => (String(x ?? '').trim() === '' ? '—' : (isNaN(Number(x)) ? String(x) : money(x)));
  const p = (text, o = {}) => new Paragraph({ alignment: o.align, spacing: { after: o.after ?? 160 }, children: [new TextRun({ text, bold: o.bold, size: o.size })] });
  const row = (a, b) => new TableRow({ children: [a, b].map((t, i) => new TableCell({ width: { size: i ? 65 : 35, type: WidthType.PERCENTAGE }, children: [p(t, { bold: !i, after: 60 })] })) });
  const dados = new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
    row('Caixa Escolar', val(v.escola)), row('CNPJ', val(v.cnpj)), row('Nº do Termo', val(v.termo)), row('Exercício', val(v.exercicio)),
    row('Valor Recebido', money_(v.recebido)), row('Valor Aplicado', money_(v.aplicado)), row('Rendimentos', money_(v.rendimentos)), row('Saldo a Devolver', money_(v.saldo))
  ] });
  const head = [p('SECRETARIA DE ESTADO DE EDUCAÇÃO DE MINAS GERAIS', { align: AlignmentType.CENTER, bold: true, after: 40 }),
    p('Superintendência Regional de Ensino — Metropolitana A', { align: AlignmentType.CENTER, after: 300 })];
  const assin = [p('', { after: 600 }), p('______________________________', { align: AlignmentType.CENTER, after: 40 }), p(val(v.analista), { align: AlignmentType.CENTER, bold: true, after: 40 }), p('Analista', { align: AlignmentType.CENTER })];
  let kids;
  if (tipo === 'Parecer Conclusivo') {
    kids = [...head, p('PARECER CONCLUSIVO', { align: AlignmentType.CENTER, bold: true, size: 32 }), p(`Prestação de contas ${val(v.tipo).toLowerCase()}`, { align: AlignmentType.CENTER, after: 300 }), dados, p('', {}), p('Observações', { bold: true }), p(val(v.obs)), ...assin];
  } else if (tipo === 'Capa de Processo') {
    kids = [...head, p('PROCESSO DE PRESTAÇÃO DE CONTAS', { align: AlignmentType.CENTER, bold: true, size: 36, after: 400 }), p(val(v.escola), { align: AlignmentType.CENTER, bold: true, size: 32 }), p(`CNPJ ${val(v.cnpj)}`, { align: AlignmentType.CENTER, after: 300 }),
      p(`Termo ${val(v.termo)} — Exercício ${val(v.exercicio)}`, { align: AlignmentType.CENTER, size: 28, after: 300 }), p(`Analista: ${val(v.analista)}`, { align: AlignmentType.CENTER }), p(val(v.obs), { align: AlignmentType.CENTER })];
  } else if (tipo === 'Etiqueta de Caixa') {
    kids = [p(val(v.escola), { align: AlignmentType.CENTER, bold: true, size: 40 }), p(`Termo ${val(v.termo)}`, { align: AlignmentType.CENTER, size: 32 }), p(`Exercício ${val(v.exercicio)}`, { align: AlignmentType.CENTER, size: 32 }), p(val(v.analista), { align: AlignmentType.CENTER })];
  } else {
    kids = [...head, p('OFÍCIO / DILIGÊNCIA', { bold: true, size: 30 }), p(`À Direção da ${val(v.escola)} (CNPJ ${val(v.cnpj)})`), p(`Assunto: Prestação de contas — Termo ${val(v.termo)}, exercício ${val(v.exercicio)}`),
      p('Em análise ao processo de prestação de contas em referência, foram identificadas as pendências abaixo, que devem ser sanadas no prazo estabelecido:'), p(val(v.obs)), p('Atenciosamente,'), ...assin];
  }
  const doc = new Document({ sections: [{ children: kids }] });
  download(`${tipo.replace(/[^\w]+/g, '_')}.docx`, await Packer.toBlob(doc));
}

/* ---------- shell, login e roteamento ---------- */
const NAV = [
  ['', 'Painel', 'dashboard'], ['escolas', 'Caixas Escolares', 'school'], ['termos', 'Termos de Compromisso', 'fileText'], ['obras', 'Termos de Obras', 'hardHat'],
  ['agendamentos', 'Agendamentos', 'calendar'], ['oficios', 'Ofícios / Diligências', 'fileWarning'], ['metas', 'Controle de Metas', 'target'],
  ['calculadora', 'Calculadora Financeira', 'calculator'], ['documentos', 'Gerador de Documentos', 'filePen'], ['usuarios', 'Usuários', 'users']
];
const route = () => location.hash.replace(/^#\/?/, '');

function loginView(err = '') {
  return `<div class="login"><div class="hero"><div class="mark">${ico('shieldCheck', 24)}</div><div class="eyebrow" style="color:inherit;opacity:.8">SEE/MG · Secretaria de Estado de Educação</div>
      <h1>Prestação de Contas<br>das Caixas Escolares</h1>
      <p>Sistema integrado para análise de Termos de Compromisso e Termos de Obras — substituindo múltiplas planilhas por um fluxo auditável e seguro.</p>
      <div class="org">Superintendência Regional de Ensino — Metropolitana A</div></div>
    <div class="box"><form id="loginForm"><div><h2 style="font-size:24px">Acesso ao Sistema</h2><p class="sub">Entre com seu e-mail institucional.</p></div>
      <div><label class="f">E-mail</label><input class="input" type="email" name="email" required autofocus></div>
      <div><label class="f">Senha</label><input class="input" type="password" name="senha" required></div>
      <div class="err">${esc(err)}</div><button class="btn primary">Entrar</button>
      <div class="demo">Credenciais de demonstração — Admin: admin@seemg.gov.br / Admin@2026</div></form></div></div>`;
}

function render() {
  const app = $('#app');
  const me = session();
  if (!me) { app.innerHTML = loginView(); return; }
  let r = route();
  if (r === 'usuarios' && !isAdmin()) r = '';
  const pages = { '': painelPage, calculadora: calcPage, documentos: docsPage };
  const html = pages[r] ? pages[r]() : CFG[r] ? listPage(r) : painelPage();
  const date = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  app.innerHTML = `<div class="layout"><aside class="side">
    <div class="brand"><div class="logo">${ico('shieldCheck', 20)}</div><div><b>SEE/MG</b><small>Prestação de Contas</small></div></div>
    <nav class="nav">${NAV.filter(n => n[0] !== 'usuarios' || isAdmin()).map(([k, l, i]) => `<a href="#/${k}" class="${k === r ? 'on' : ''}">${ico(i, 17)}${l}</a>`).join('')}</nav>
    <div class="me"><div class="who"><b>${esc(me.nome)}</b>${esc(me.email)}<br><span class="role">${esc(me.perfil)}</span></div><button data-act="logout">${ico('logout', 15)}Sair</button></div></aside>
    <div class="main"><div class="topbar"><div><small>SRE METROPOLITANA A</small><h2>Prestação de Contas</h2></div><div class="date">${date}</div></div>
    <div class="content">${html}</div></div></div>`;
}

/* ---------- eventos ---------- */
function openEntity(name, id) {
  const c = CFG[name];
  const rec = id ? byId(db[c.key], id) : null;
  openForm({
    title: `${rec ? 'Editar' : 'Novo'} ${c.formTitle}`, fields: c.fields(rec), values: rec ? { ...rec, senha: '' } : {},
    onSave: out => {
      if (name === 'usuarios') {
        const dup = db.usuarios.find(u => u.email.toLowerCase() === out.email.toLowerCase() && u.id !== id);
        if (dup) { alert('Já existe um usuário com este e-mail.'); return false; }
        out.senha = out.senha ? hash(out.senha) : rec.senha;
      }
      if (rec) Object.assign(rec, out);
      else db[c.key].push({ id: uid(), ...c.defaults, ...out, ...(c.key === 'termos' ? { extrato: '' } : {}) });
      save();
    }
  });
}

function importEscolas(file) {
  const rd = new FileReader();
  rd.onload = () => {
    const lines = String(rd.result).replace(/^﻿/, '').split(/\r?\n/).filter(Boolean);
    const sep = lines[0]?.includes(';') ? ';' : ',';
    let n = 0;
    for (const ln of lines.slice(1)) {
      const [nome, cnpj, sre, direcao, telefone, email, endereco, observacoes] = ln.split(sep).map(s => s.replace(/^"|"$/g, '').trim());
      if (!nome || !cnpj) continue;
      db.escolas.push({ id: uid(), nome, cnpj, sre: sre || 'Metropolitana A', direcao: direcao || '', telefone: telefone || '', email: email || '', endereco: endereco || '', observacoes: observacoes || '' });
      n++;
    }
    save(); render(); alert(`${n} caixa(s) escolar(es) importada(s). Formato: Nome;CNPJ;SRE;Direção;Telefone;E-mail;Endereço;Observações.`);
  };
  rd.readAsText(file);
}

document.addEventListener('click', e => {
  const tab = e.target.closest('[data-doctab]');
  if (tab) { Object.assign(docVals, Object.fromEntries(new FormData($('#docForm')))); docTipo = tab.dataset.doctab; render(); return; }
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const { act, ent, id } = b.dataset;
  if (act === 'logout') { localStorage.removeItem('pc_user'); location.hash = ''; render(); }
  else if (act === 'new') openEntity(ent);
  else if (act === 'edit') openEntity(ent, id);
  else if (act === 'del') {
    if (!confirm('Excluir este registro?')) return;
    const key = CFG[ent].key;
    if (key === 'usuarios' && id === session()?.id) { alert('Você não pode excluir o próprio usuário.'); return; }
    db[key] = db[key].filter(x => x.id !== id);
    if (key === 'termos') db.lancamentos = db.lancamentos.filter(l => l.termoId !== id);
    save(); render();
  } else if (act === 'del-lanc') { db.lancamentos = db.lancamentos.filter(l => l.id !== id); save(); render(); }
  else if (act === 'export') {
    const c = CFG[ent];
    download(`${ent}.csv`, csv(c.rows().map(c.csvRow), c.csvHead));
  } else if (act === 'import') {
    const f = document.createElement('input'); f.type = 'file'; f.accept = '.csv,text/csv';
    f.onchange = () => f.files[0] && importEscolas(f.files[0]); f.click();
  }
});

document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.status) { byId(db.termos, t.dataset.status).status = t.value; save(); render(); }
  else if (t.dataset.filter) { filters[t.dataset.filter] = t.value; render(); }
  else if (t.id === 'calcSel') { calcTermo = t.value; render(); }
  else if (t.id === 'extrato') { byId(db.termos, calcTermo).extrato = t.value; save(); render(); }
});

document.addEventListener('submit', async e => {
  const f = e.target;
  if (f.id === 'loginForm') {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    const u = db.usuarios.find(x => x.email.toLowerCase() === d.email.trim().toLowerCase() && x.senha === hash(d.senha));
    if (!u) { $('.err', f).textContent = 'E-mail ou senha inválidos.'; return; }
    localStorage.setItem('pc_user', u.id); location.hash = ''; render();
  } else if (f.id === 'lancForm') {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    db.lancamentos.push({ id: uid(), termoId: calcTermo, ...d, valor: Number(d.valor) }); save(); render();
  } else if (f.id === 'docForm') {
    e.preventDefault();
    Object.assign(docVals, Object.fromEntries(new FormData(f)));
    gerarDocx(docTipo, docVals);
  }
});

window.addEventListener('hashchange', render);
load();
render();
