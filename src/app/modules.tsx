"use client";

import { useEffect, useState } from "react";
import { Check, ChevronRight, CircleHelp, ClipboardList, Package, Plus, Save, Settings, Store, Tag, Users, X } from "lucide-react";

export type SectionKey = "overview" | "orders" | "products" | "customers" | "stores" | "promotions" | "settings" | "help";

type ModuleConfig = {
  title: string;
  description: string;
  icon: typeof ClipboardList;
  action: string;
  columns: string[];
  rows: string[][];
  formTitle: string;
  fields: string[];
};

const modules: Record<Exclude<SectionKey, "overview">, ModuleConfig> = {
  orders: {
    title: "Pedidos", description: "Acompanhe e processe os pedidos do Mercado Liverpoll.", icon: ClipboardList, action: "Novo pedido",
    columns: ["Pedido", "Cliente", "Loja", "Total", "Status"],
    rows: [["#MC-20491", "Mariana Costa", "Unidade Jardins", "R$ 248,90", "Pago"], ["#MC-20490", "Ricardo Alves", "Unidade Centro", "R$ 86,40", "Separando"], ["#MC-20489", "Camila Oliveira", "Unidade Jardins", "R$ 412,75", "Pago"]],
    formTitle: "Criar novo pedido", fields: ["Cliente", "Loja", "Produto", "Quantidade"],
  },
  products: {
    title: "Produtos", description: "Controle o catálogo, preços e disponibilidade dos produtos.", icon: Package, action: "Novo produto",
    columns: ["Produto", "Categoria", "Estoque", "Preço", "Status"],
    rows: [["Leite integral Itambé 1L", "Laticínios", "12 un.", "R$ 5,99", "Baixo estoque"], ["Pão de forma Pullman", "Padaria", "7 un.", "R$ 9,49", "Baixo estoque"], ["Maçã Fuji kg", "Hortifruti", "18 kg", "R$ 8,90", "Disponível"]],
    formTitle: "Cadastrar produto", fields: ["Nome do produto", "Categoria", "Preço", "Estoque inicial"],
  },
  customers: {
    title: "Clientes", description: "Gerencie os clientes e acompanhe o relacionamento com sua loja.", icon: Users, action: "Novo cliente",
    columns: ["Cliente", "Contato", "Pedidos", "Última compra", "Perfil"],
    rows: [["Mariana Costa", "mariana@email.com", "18", "Hoje", "Frequente"], ["Ricardo Alves", "ricardo@email.com", "7", "Ontem", "Regular"], ["Camila Oliveira", "camila@email.com", "24", "05/10/2026", "Frequente"]],
    formTitle: "Cadastrar cliente", fields: ["Nome completo", "E-mail", "Telefone", "Observações"],
  },
  stores: {
    title: "Lojas", description: "Organize unidades, equipes e indicadores por loja.", icon: Store, action: "Nova loja",
    columns: ["Unidade", "Endereço", "Responsável", "Pedidos hoje", "Status"],
    rows: [["Unidade Jardins", "Av. Paulista, 100", "Ana Martins", "84", "Aberta"], ["Unidade Centro", "Rua Central, 45", "Paulo Lima", "61", "Aberta"], ["Unidade Norte", "Av. Norte, 820", "Julia Souza", "39", "Aberta"]],
    formTitle: "Cadastrar loja", fields: ["Nome da unidade", "Endereço", "Responsável", "Telefone"],
  },
  promotions: {
    title: "Promoções", description: "Crie campanhas e acompanhe o resultado das suas ofertas.", icon: Tag, action: "Nova promoção",
    columns: ["Campanha", "Período", "Desconto", "Usos", "Status"],
    rows: [["Leve 3, pague 2", "01–15 out.", "33%", "128", "Ativa"], ["Festival de hortifruti", "08–20 out.", "15%", "64", "Ativa"], ["Cliente novo", "Contínua", "10%", "212", "Ativa"]],
    formTitle: "Criar promoção", fields: ["Nome da campanha", "Desconto", "Data de início", "Data de término"],
  },
  settings: {
    title: "Preferências", description: "Configure a operação do Mercado Liverpoll.", icon: Settings, action: "Salvar alterações",
    columns: ["Configuração", "Valor", "Última alteração"],
    rows: [["Notificações de pedidos", "Ativadas", "Hoje"], ["Moeda", "Real brasileiro (R$)", "08/10/2026"], ["Fuso horário", "America/Bahia", "08/10/2026"]],
    formTitle: "Editar preferências", fields: ["Nome da empresa", "E-mail de contato", "Fuso horário", "Notificações"],
  },
  help: {
    title: "Central de ajuda", description: "Encontre respostas e acesse os canais de suporte.", icon: CircleHelp, action: "Abrir chamado",
    columns: ["Assunto", "Categoria", "Atualizado", "Status"],
    rows: [["Como cadastrar produtos?", "Catálogo", "Hoje", "Resolvido"], ["Configurar nova unidade", "Lojas", "Ontem", "Resolvido"], ["Integração de pagamentos", "Financeiro", "05/10/2026", "Em análise"]],
    formTitle: "Abrir chamado de suporte", fields: ["Assunto", "Categoria", "Descrição", "E-mail para retorno"],
  },
};

export function SectionModule({ section }: { section: Exclude<SectionKey, "overview"> }) {
  const config = modules[section];
  const Icon = config.icon;
  const activeLabel = section === "products" ? "Produtos cadastrados" : section === "stores" ? "Lojas cadastradas" : "Registros ativos";
  const activeTotal = section === "orders" ? "1.284" : section === "products" ? "846" : section === "stores" ? "12" : "3.842";
  const dailyTotal = section === "products" ? "64" : section === "stores" ? "3" : section === "customers" ? "28" : "184";
  const [popupOpen, setPopupOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const storageKey = `liverpoll-${section}-records`;
  const [rows, setRows] = useState(config.rows);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try { setRows(JSON.parse(stored) as string[][]); } catch { window.localStorage.removeItem(storageKey); }
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(storageKey, JSON.stringify(rows));
  }, [loaded, rows, storageKey]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Array.from(new FormData(event.currentTarget).values()).map(value => String(value).trim());
    const newRow = values.slice(0, config.columns.length).map((value, index) => value || (index === 0 ? "Novo registro" : "—"));
    while (newRow.length < config.columns.length) newRow.push("—");
    if (section === "customers") {
      newRow.splice(2, 0, "0");
      newRow.splice(3, 0, "Agora");
      newRow.splice(4, 0, "Novo");
      newRow.length = config.columns.length;
    }
    setRows(previous => [newRow, ...previous]);
    setSaved(true);
    window.setTimeout(() => { setPopupOpen(false); setSaved(false); }, 900);
  }

  return <div className="mx-auto max-w-[1440px] p-5 sm:p-8">
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#16865b]"><Icon size={16} /> Núcleo operacional</div><h2 className="text-[28px] font-extrabold tracking-[-.05em] sm:text-[32px]">{config.title}</h2><p className="mt-2 text-sm text-[#849087]">{config.description}</p></div>
      <button onClick={() => setPopupOpen(true)} className="flex items-center justify-center gap-2 rounded-xl bg-[#173c2c] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"><Plus size={16} /> {config.action}</button>
    </div>
    <div className="mb-6 grid gap-4 sm:grid-cols-3"><div className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5"><p className="text-sm text-[#849087]">{activeLabel}</p><strong className="mt-2 block text-2xl">{activeTotal}</strong></div><div className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5"><p className="text-sm text-[#849087]">Movimentações hoje</p><strong className="mt-2 block text-2xl">{dailyTotal}</strong></div><div className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5"><p className="text-sm text-[#849087]">Status da operação</p><strong className="mt-2 block text-2xl text-[#16865b]">Normal</strong></div></div>
    <section className="soft-shadow overflow-hidden rounded-2xl border border-[#e9eeeb] bg-white"><div className="flex items-center justify-between border-b border-[#eef2ef] p-5 sm:p-6"><div><h3 className="text-base font-bold">Registros recentes</h3><p className="mt-1 text-xs text-[#849087]">Atualizações do núcleo de {config.title.toLowerCase()}</p></div><button onClick={() => setPopupOpen(true)} className="text-xs font-bold text-[#16865b]">Adicionar <ChevronRight className="ml-1 inline" size={13} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead><tr className="border-b border-[#eef2ef] text-[11px] uppercase tracking-wider text-[#9ca9a1]">{config.columns.map(column => <th key={column} className="px-6 py-3 font-semibold">{column}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={`${row[0]}-${rowIndex}`} className="border-b border-[#f1f4f2] last:border-0">{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={`px-6 py-4 text-xs ${index === 0 ? "font-bold" : "text-[#718077]"}`}>{cell}</td>)}</tr>)}</tbody></table></div></section>
    {popupOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173c2c]/40 p-4" role="dialog" aria-modal="true"><form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between"><div><h3 className="text-lg font-extrabold">{config.formTitle}</h3><p className="mt-1 text-xs text-[#849087]">Preencha os dados para continuar.</p></div><button type="button" onClick={() => setPopupOpen(false)} aria-label="Fechar popup" className="rounded-lg p-1 text-[#849087] hover:bg-[#f1f5f1]"><X size={19} /></button></div><div className="grid gap-4 sm:grid-cols-2">{config.fields.map(field => <label key={field} className="text-xs font-semibold text-[#526157]">{field}<input required className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#16865b]" placeholder={`Informe ${field.toLowerCase()}`} /></label>)}</div><button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173c2c] px-4 py-3 text-sm font-bold text-white">{saved ? <><Check size={17} /> Salvo com sucesso</> : <><Save size={17} /> Salvar</>}</button></form></div>}
  </div>;
}
