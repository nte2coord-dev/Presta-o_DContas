# Prestação de Contas das Caixas Escolares — SEE/MG (SRE Metropolitana A)

Sistema de página única (HTML + CSS + JS) para análise de Termos de Compromisso e Termos de Obras.
Os dados ficam no `localStorage` do navegador; não há back-end.

## Estrutura

```
app/frontend/
  index.html   # shell e carregamento de fontes/bibliotecas
  style.css    # visual (IBM Plex Sans, Merriweather, JetBrains Mono)
  app.js       # telas, dados, regras e geração de DOCX
```

## Executar

```bash
cd app/frontend
python -m http.server 5173
```

Abra `http://localhost:5173`. Usuário de demonstração: `admin@seemg.gov.br` / `Admin@2026`.

## Observações

- Fontes (Google Fonts) e a biblioteca `docx` são carregadas por CDN; é preciso internet.
- Perfis: Admin (tudo, inclui Usuários), Analista (cadastros) e Gestor (somente leitura).
- A autenticação é apenas demonstrativa (hash simples no cliente). Em produção, ela e os dados devem ficar em um servidor.
- A versão anterior (React + FastAPI/MongoDB) continua no histórico do Git, no commit `e32225a`.
