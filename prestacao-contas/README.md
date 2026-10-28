# Prestação de Contas das Caixas Escolares — réplica estática

Versão de página única (HTML + CSS + JS) do sistema da SRE Metropolitana A. Os dados ficam no `localStorage` do navegador; não há back-end.

## Executar

```bash
python -m http.server 5173
```

Abra `http://localhost:5173`. Usuário de demonstração: `admin@seemg.gov.br` / `Admin@2026`.

## Observações

- Fontes (IBM Plex Sans, Merriweather, JetBrains Mono) e a biblioteca `docx` são carregadas por CDN.
- A autenticação é apenas demonstrativa (hash simples no cliente); em produção ela deve ficar no servidor.
