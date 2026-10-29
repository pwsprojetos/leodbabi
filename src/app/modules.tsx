"use client";

import { useEffect, useState } from "react";
import { Bell, Check, ChevronRight, CircleHelp, ClipboardList, Copy, Mail, Megaphone, MessageSquare, Package, Pause, Play, Plus, Save, Send, Settings, ShieldCheck, Store, Tag, TicketPercent, Trash2, Users, Wallet, X } from "lucide-react";

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
    rows: [["Mariana Costa", "mariana@email.com", "18", "Hoje", "Frequente"], ["Ricardo Alves", "ricardo@email.com", "7", "Ontem", "Regular"], ["Camila Oliveira", "camila@email.com", "24", "05/10/2026", "Frequente"], ["Joao Mendes", "joao@email.com", "11", "03/10/2026", "Regular"]],
    formTitle: "Cadastrar cliente", fields: ["Nome completo", "E-mail", "Telefone", "Observações"],
  },
  stores: {
    title: "Lojas", description: "Organize unidades, equipes e indicadores por loja.", icon: Store, action: "Nova loja",
    columns: ["Unidade", "Endereço", "Responsável", "Pedidos hoje", "Status"],
    rows: [["Unidade Jardins", "Av. Paulista, 100", "Ana Martins", "84", "Aberta"], ["Unidade Centro", "Rua Central, 45", "Paulo Lima", "61", "Aberta"]],
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
    title: "Central de ajuda", description: "Encontre respostas praticas, tutoriais e canais de suporte para operar o Mercado Liverpoll.", icon: CircleHelp, action: "Abrir chamado",
    columns: ["Assunto", "Categoria", "Atualizado", "Status"],
    rows: [["Como cadastrar produtos?", "Catálogo", "Hoje", "Resolvido"], ["Configurar nova unidade", "Lojas", "Ontem", "Resolvido"], ["Integração de pagamentos", "Financeiro", "05/10/2026", "Em análise"]],
    formTitle: "Abrir chamado de suporte", fields: ["Assunto", "Categoria", "Descrição", "E-mail para retorno"],
  },
};

type SupportTicket = { id: string; subject: string; category: string; createdAt: string; status: string; name: string; email: string; accountId: string; description: string };

export type UserPreferences = { defaultSalesPeriod: "7d" | "30d" | "year"; lowStockThreshold: number; notifications: { orders: boolean; stock: boolean; promotions: boolean } };
export const defaultUserPreferences: UserPreferences = { defaultSalesPeriod: "7d", lowStockThreshold: 15, notifications: { orders: true, stock: true, promotions: true } };

function SettingsCenter() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultUserPreferences);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const stored = window.localStorage.getItem("liverpoll-preferences");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<UserPreferences>;
        setPreferences({ ...defaultUserPreferences, ...parsed, notifications: { ...defaultUserPreferences.notifications, ...parsed.notifications } });
      } catch { window.localStorage.removeItem("liverpoll-preferences"); }
    }
  }, []);
  function savePreferences(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem("liverpoll-preferences", JSON.stringify(preferences));
    window.dispatchEvent(new Event("liverpoll-preferences-updated"));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }
  const toggle = (key: keyof UserPreferences["notifications"]) => setPreferences(current => ({ ...current, notifications: { ...current.notifications, [key]: !current.notifications[key] } }));
  return <div className="mx-auto max-w-[1200px] p-5 sm:p-8">
    <div className="mb-8"><div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#16865b]"><Settings size={16} /> Configuração da conta</div><h2 className="text-[28px] font-extrabold tracking-[-.05em] sm:text-[32px]">Preferências</h2><p className="mt-2 text-sm text-[#849087]">Personalize o painel e escolha quais avisos aparecem para você.</p></div>
    <form onSubmit={savePreferences} className="space-y-5">
      <section className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5 sm:p-7"><div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef8e4] text-[#16865b]"><Wallet size={19} /></div><div><h3 className="font-bold text-[#173c2c]">Visão geral</h3><p className="mt-1 text-sm text-[#849087]">Defina o período que o gráfico de vendas abre por padrão.</p></div></div><label className="block max-w-md text-xs font-semibold text-[#526157]">Período padrão do gráfico<select value={preferences.defaultSalesPeriod} onChange={event => setPreferences(current => ({ ...current, defaultSalesPeriod: event.target.value as UserPreferences["defaultSalesPeriod"] }))} className="mt-2 w-full rounded-xl border border-[#dfe7e1] bg-white px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]"><option value="7d">Últimos 7 dias</option><option value="30d">Últimos 30 dias</option><option value="year">Este ano</option></select><span className="mt-2 block font-normal text-[#849087]">A seleção também atualiza o gráfico ao salvar.</span></label></section>
      <section className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5 sm:p-7"><div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef8e4] text-[#16865b]"><Package size={19} /></div><div><h3 className="font-bold text-[#173c2c]">Estoque</h3><p className="mt-1 text-sm text-[#849087]">Escolha a quantidade que define um produto como estoque baixo.</p></div></div><label className="block max-w-md text-xs font-semibold text-[#526157]">Avisar quando restarem<input type="number" min="0" max="100000" value={preferences.lowStockThreshold} onChange={event => setPreferences(current => ({ ...current, lowStockThreshold: Math.max(0, Number(event.target.value)) }))} className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]" /><span className="mt-2 block font-normal text-[#849087]">unidades ou menos. Esse limite controla o aviso de estoque baixo.</span></label></section>
      <section className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5 sm:p-7"><div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef8e4] text-[#16865b]"><Bell size={19} /></div><div><h3 className="font-bold text-[#173c2c]">Notificações</h3><p className="mt-1 text-sm text-[#849087]">Ative apenas os avisos relevantes para sua operação.</p></div></div><div className="divide-y divide-[#eef2ef]">{([{ key: "orders", title: "Pedidos e vendas", description: "Novos pedidos, pagamentos e atualizações." }, { key: "stock", title: "Estoque baixo", description: "Produtos que atingiram o limite configurado acima." }, { key: "promotions", title: "Promoções", description: "Atualizações e resultados das campanhas." }] as const).map(item => <label key={item.key} className="flex cursor-pointer items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><span><strong className="block text-sm text-[#304b3c]">{item.title}</strong><span className="mt-1 block text-xs text-[#849087]">{item.description}</span></span><input type="checkbox" checked={preferences.notifications[item.key]} onChange={() => toggle(item.key)} className="h-5 w-5 accent-[#16865b]" /></label>)}</div></section>
      <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center"><p role="status" className="text-sm text-[#16865b]">{saved ? "Preferências salvas e aplicadas." : "As alterações só entram em vigor depois de salvar."}</p><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173c2c] px-5 py-3 text-sm font-bold text-white hover:bg-[#24533e]"><Save size={16} />{saved ? "Salvo" : "Salvar preferências"}</button></div>
    </form>
  </div>;
}

function HelpCenter({ createRequest = 0, onCreateHandled }: { createRequest?: number; onCreateHandled?: () => void }) {
  const [accountId, setAccountId] = useState("");
  const [name, setName] = useState("Gabriel Silva");
  const [email, setEmail] = useState("master@liverpoll.com");
  const [category, setCategory] = useState("Problema técnico");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [submittedId, setSubmittedId] = useState("");

  useEffect(() => {
    let storedAccountId = window.localStorage.getItem("liverpoll-account-id");
    if (!storedAccountId) {
      const randomId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase() : Math.random().toString(36).slice(2, 12).toUpperCase();
      storedAccountId = `LVP-${randomId}`;
      window.localStorage.setItem("liverpoll-account-id", storedAccountId);
    }
    setAccountId(storedAccountId);
    const savedTickets = window.localStorage.getItem("liverpoll-support-tickets");
    if (savedTickets) {
      try { setTickets(JSON.parse(savedTickets) as SupportTicket[]); }
      catch { window.localStorage.removeItem("liverpoll-support-tickets"); }
    }
  }, []);

  useEffect(() => {
    if (!createRequest) return;
    document.getElementById("help-subject")?.focus();
    onCreateHandled?.();
  }, [createRequest, onCreateHandled]);

  function submitTicket(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ticket: SupportTicket = {
      id: `CH-${Date.now().toString().slice(-8)}`,
      subject: subject.trim(),
      category,
      createdAt: new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date()),
      status: "Aberto",
      name: name.trim(),
      email: email.trim(),
      accountId,
      description: description.trim(),
    };
    const updated = [ticket, ...tickets];
    setTickets(updated);
    window.localStorage.setItem("liverpoll-support-tickets", JSON.stringify(updated));
    setSubmittedId(ticket.id);
    setSubject("");
    setDescription("");
  }

  return <div className="mx-auto max-w-[1440px] p-5 sm:p-8">
    <div className="mb-8"><p className="mb-2 text-sm font-medium text-[#16865b]">Estamos aqui para ajudar</p><h2 className="text-[28px] font-extrabold sm:text-[32px]">Central de ajuda</h2><p className="mt-2 max-w-2xl text-sm text-[#849087]">Fale com nossa equipe e acompanhe suas solicitações em um só lugar.</p></div>
    <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8e4] text-[#16865b]"><MessageSquare size={19} /></div><h3 className="font-bold text-[#173c2c]">Abra um chamado</h3><p className="mt-2 text-sm leading-5 text-[#718077]">Descreva o problema com detalhes. Seu ID de conta será incluído para ajudar a equipe a localizar seu cadastro.</p></article>
      <article className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8e4] text-[#16865b]"><Mail size={19} /></div><h3 className="font-bold text-[#173c2c]">E-mail de suporte</h3><p className="mt-2 text-sm leading-5 text-[#718077]">Canal demonstrativo. Substitua este endereco pelo contato oficial antes de publicar.</p><a href="mailto:suporte@liverpoll.example" className="mt-2 inline-block text-sm font-semibold text-[#16865b] hover:underline">suporte@liverpoll.example</a></article>
      <article className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8e4] text-[#16865b]"><MessageSquare size={19} /></div><h3 className="font-bold text-[#173c2c]">WhatsApp</h3><p className="mt-2 text-sm leading-5 text-[#718077]">Numero ficticio para demonstracao. Troque pelo WhatsApp oficial antes de publicar.</p><a href="https://wa.me/5511000000000" target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-[#16865b] hover:underline">+55 (11) 00000-0000</a></article><article className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8e4] text-[#16865b]"><ShieldCheck size={19} /></div><h3 className="font-bold text-[#173c2c]">Acompanhamento</h3><p className="mt-2 text-sm leading-5 text-[#718077]">Cada solicitação recebe um protocolo. Consulte o status na lista abaixo.</p></article>
    </div>
    <div className="grid items-start gap-6 xl:grid-cols-[1.2fr_.8fr]">
      <form onSubmit={submitTicket} className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5 sm:p-7">
        <div className="mb-6"><h3 className="text-lg font-extrabold text-[#173c2c]">Descreva o problema</h3><p className="mt-1 text-sm text-[#849087]">Os campos com * são obrigatórios.</p></div>
        {submittedId && <div role="status" className="mb-5 rounded-xl border border-[#d8edcf] bg-[#f4f9ef] p-4 text-sm text-[#315c3f]">Solicitação registrada neste navegador. Protocolo: <strong>{submittedId}</strong></div>}
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#526157]">Seu nome *<input required value={name} onChange={event => setName(event.target.value)} autoComplete="name" className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]" /></label>
          <label className="text-xs font-semibold text-[#526157]">E-mail para contato *<input required type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]" /></label>
          <label className="text-xs font-semibold text-[#526157]">ID da conta<input readOnly value={accountId || "Gerando identificador..."} className="mt-2 w-full rounded-xl border border-[#e9eeeb] bg-[#f7faf7] px-3 py-3 text-sm font-medium text-[#718077] outline-none" /></label>
          <label className="text-xs font-semibold text-[#526157]">Categoria *<select value={category} onChange={event => setCategory(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dfe7e1] bg-white px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]"><option>Problema técnico</option><option>Pedidos</option><option>Produtos e estoque</option><option>Clientes e lojas</option><option>Conta e acesso</option><option>Sugestão</option><option>Outro</option></select></label>
        </div>
        <label className="mb-5 block text-xs font-semibold text-[#526157]">Assunto *<input id="help-subject" required value={subject} onChange={event => setSubject(event.target.value)} maxLength={120} placeholder="Resuma o problema em poucas palavras" className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]" /></label>
        <label className="block text-xs font-semibold text-[#526157]">O que aconteceu? *<textarea required value={description} onChange={event => setDescription(event.target.value)} maxLength={3000} rows={6} placeholder="Conte o que estava tentando fazer, o que aconteceu e quando começou." className="mt-2 w-full resize-y rounded-xl border border-[#dfe7e1] px-3 py-3 text-sm font-normal leading-5 outline-none focus:border-[#16865b]" /><span className="mt-1 block text-right font-normal text-[#9ca9a1]">{description.length}/3000</span></label>
        <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#eef2ef] pt-5 sm:flex-row sm:items-center"><p className="text-xs text-[#849087]">Seus dados de conta serão anexados ao chamado.</p><button disabled={!accountId} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173c2c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#24533e] disabled:cursor-wait disabled:opacity-60"><Send size={16} />Registrar chamado</button></div>
      </form>
      <section className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h3 className="font-bold text-[#173c2c]">Suas solicitações</h3><p className="mt-1 text-xs text-[#849087]">Protocolos registrados neste navegador</p></div><span className="rounded-full bg-[#eef8e4] px-2.5 py-1 text-xs font-bold text-[#16865b]">{tickets.length}</span></div>{tickets.length ? <div className="space-y-3">{tickets.map(ticket => <article key={ticket.id} className="rounded-xl border border-[#eef2ef] p-4"><div className="mb-2 flex items-start justify-between gap-3"><strong className="text-sm text-[#304b3c]">{ticket.subject}</strong><span className="shrink-0 rounded-full bg-[#fff5df] px-2 py-1 text-[10px] font-bold text-[#94651d]">{ticket.status}</span></div><p className="text-xs text-[#849087]">{ticket.category} · {ticket.createdAt}</p><p className="mt-2 text-xs leading-5 text-[#718077]">{ticket.description}</p><p className="mt-2 text-[11px] text-[#849087]">{ticket.name} / {ticket.accountId} / {ticket.email}</p><p className="mt-1 text-[11px] font-semibold text-[#16865b]">Protocolo {ticket.id}</p></article>)}</div> : <div className="rounded-xl bg-[#f7faf7] p-5 text-center"><p className="text-sm font-semibold text-[#526157]">Nenhuma solicitação ainda</p><p className="mt-1 text-xs leading-5 text-[#849087]">Os chamados que você registrar aparecerão aqui.</p></div>}</section>
    </div>
  </div>;
}

type Campaign = { id: string; name: string; mechanic: "percentage" | "fixed" | "bundle" | "shipping"; value: number; scope: string; audience: string; channel: "whatsapp" | "email" | "app"; coupon: string; startDate: string; endDate: string; limit: number; redemptions: number; paused: boolean };

const audienceLabels: Record<string, string> = { all: "Todos os clientes", frequent: "Clientes frequentes", new: "Clientes novos", inactive: "Clientes inativos" };
const mechanicLabels: Record<Campaign["mechanic"], string> = { percentage: "Desconto percentual", fixed: "Desconto em reais", bundle: "Leve mais, pague menos", shipping: "Frete grátis" };

function localDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function campaignStatus(campaign: Campaign, today: string) {
  if (campaign.paused) return "Pausada";
  if (campaign.endDate < today) return "Encerrada";
  if (campaign.startDate > today) return "Agendada";
  if (campaign.limit > 0 && campaign.redemptions >= campaign.limit) return "Limite atingido";
  return "Ativa";
}

function campaignOffer(campaign: Campaign) {
  if (campaign.mechanic === "percentage") return `${campaign.value}% de desconto`;
  if (campaign.mechanic === "fixed") return `R$ ${campaign.value.toFixed(2).replace(".", ",")} de desconto`;
  if (campaign.mechanic === "shipping") return campaign.value > 0 ? `Frete grátis em pedidos acima de R$ ${campaign.value.toFixed(2).replace(".", ",")}` : "Frete grátis";
  return `Leve mais, pague menos (${campaign.value}% de economia)`;
}

function PromotionsCenter({ createRequest = 0, onCreateHandled }: { createRequest?: number; onCreateHandled?: () => void }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customerRows, setCustomerRows] = useState<string[][]>(modules.customers.rows);
  const [loaded, setLoaded] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState({ name: "", mechanic: "percentage" as Campaign["mechanic"], value: "10", scope: "Todos os produtos", audience: "all", channel: "whatsapp" as Campaign["channel"], coupon: "", startDate: localDateString(new Date()), endDate: localDateString(new Date(Date.now() + 14 * 86400000)), limit: "0" });
  const today = localDateString(new Date());

  useEffect(() => {
    const saved = window.localStorage.getItem("liverpoll-promotions-campaigns");
    if (saved) {
      try { setCampaigns(JSON.parse(saved) as Campaign[]); }
      catch { window.localStorage.removeItem("liverpoll-promotions-campaigns"); }
    }
    const savedCustomers = window.localStorage.getItem("liverpoll-customers-records");
    if (savedCustomers) {
      try { setCustomerRows(JSON.parse(savedCustomers) as string[][]); }
      catch { window.localStorage.removeItem("liverpoll-customers-records"); }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem("liverpoll-promotions-campaigns", JSON.stringify(campaigns));
  }, [campaigns, loaded]);

  useEffect(() => {
    if (!createRequest) return;
    setFormOpen(true);
    onCreateHandled?.();
  }, [createRequest, onCreateHandled]);

  const customersInAudience = (audience: string) => customerRows.filter(row => {
    const profile = (row[4] || "").toLowerCase();
    if (audience === "frequent") return profile.includes("frequente");
    if (audience === "new") return profile.includes("novo");
    if (audience === "inactive") return profile.includes("inativo") || /[3-9]\d dias|\d+ meses/i.test(row[3] || "");
    return true;
  });
  const audienceCount = (audience: string) => customersInAudience(audience).length;
  const activeCampaigns = campaigns.filter(campaign => campaignStatus(campaign, today) === "Ativa").length;
  const totalRedemptions = campaigns.reduce((sum, campaign) => sum + campaign.redemptions, 0);
  const reachedCustomers = campaigns.filter(campaign => campaignStatus(campaign, today) === "Ativa").reduce((sum, campaign) => sum + audienceCount(campaign.audience), 0);

  function createCampaign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = draft.coupon.trim().toUpperCase() || (draft.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase());
    const campaign: Campaign = { id: `CMP-${Date.now()}`, name: draft.name.trim(), mechanic: draft.mechanic, value: Number(draft.value) || 0, scope: draft.scope.trim(), audience: draft.audience, channel: draft.channel, coupon: code, startDate: draft.startDate, endDate: draft.endDate, limit: Number(draft.limit) || 0, redemptions: 0, paused: false };
    setCampaigns(current => [campaign, ...current]);
    setFormOpen(false);
    setNotice(`Campanha “${campaign.name}” criada com o cupom ${campaign.coupon}.`);
    setDraft(current => ({ ...current, name: "", coupon: "" }));
  }

  async function copyText(value: string, success: string) {
    try { await navigator.clipboard.writeText(value); setNotice(success); }
    catch { setNotice("Nao foi possivel copiar automaticamente. Selecione e copie o texto manualmente."); }
  }

  function promotionMessage(campaign: Campaign) {
    return `Ola! Temos uma oferta especial para voce: ${campaign.name}. ${campaignOffer(campaign)} em ${campaign.scope}. Use o cupom ${campaign.coupon} ate ${new Intl.DateTimeFormat("pt-BR").format(new Date(campaign.endDate + "T12:00:00"))}. Consulte as condicoes no Mercado Liverpoll.`;
  }

  return <div className="mx-auto max-w-[1440px] p-5 sm:p-8">
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-medium text-[#16865b]">Campanhas para seus clientes</p><h2 className="text-[28px] font-extrabold sm:text-[32px]">Promocoes</h2><p className="mt-2 text-sm text-[#849087]">Crie ofertas, escolha quem recebe e acompanhe os resgates.</p></div><button onClick={() => setFormOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173c2c] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#24533e]"><Plus size={17} /> Nova promocao</button></div>
    {notice && <div role="status" className="mb-5 flex items-center justify-between rounded-xl border border-[#d8edcf] bg-[#f4f9ef] px-4 py-3 text-sm text-[#315c3f]">{notice}<button onClick={() => setNotice("")} aria-label="Fechar aviso"><X size={16} /></button></div>}
    <div className="mb-7 grid gap-4 sm:grid-cols-3"><article className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5"><p className="text-sm text-[#849087]">Campanhas ativas</p><strong className="mt-2 block text-2xl text-[#16865b]">{activeCampaigns}</strong></article><article className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5"><p className="text-sm text-[#849087]">Público estimado nas campanhas ativas</p><strong className="mt-2 block text-2xl">{reachedCustomers.toLocaleString("pt-BR")}</strong><p className="mt-1 text-xs text-[#9ca9a1]">Soma dos segmentos; um cliente pode participar de mais de uma campanha.</p></article><article className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5"><p className="text-sm text-[#849087]">Resgates registrados</p><strong className="mt-2 block text-2xl">{totalRedemptions.toLocaleString("pt-BR")}</strong></article></div>
    <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#304b3c]"><Megaphone size={17} className="text-[#16865b]" /> Suas campanhas</div>
    {campaigns.length ? <div className="grid gap-4 xl:grid-cols-2">{campaigns.map(campaign => { const status = campaignStatus(campaign, today); const statusClass = status === "Ativa" ? "bg-[#eaf8e6] text-[#16865b]" : status === "Agendada" ? "bg-[#edf4ff] text-[#426caa]" : "bg-[#f1f3f1] text-[#718077]"; const message = promotionMessage(campaign); return <article key={campaign.id} className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div className="flex min-w-0 items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef8e4] text-[#16865b]"><TicketPercent size={20} /></div><div className="min-w-0"><h3 className="truncate font-bold text-[#173c2c]">{campaign.name}</h3><p className="mt-1 text-sm font-semibold text-[#16865b]">{campaignOffer(campaign)}</p></div></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass}`}>{status}</span></div><div className="my-5 grid gap-3 rounded-xl bg-[#f7faf7] p-4 text-xs sm:grid-cols-2"><p><span className="text-[#849087]">Público</span><strong className="mt-1 block text-[#304b3c]">{audienceLabels[campaign.audience]} · aprox. {audienceCount(campaign.audience)}</strong></p><p><span className="text-[#849087]">Produtos/categorias</span><strong className="mt-1 block text-[#304b3c]">{campaign.scope}</strong></p><p><span className="text-[#849087]">Vigencia</span><strong className="mt-1 block text-[#304b3c]">{new Intl.DateTimeFormat("pt-BR").format(new Date(campaign.startDate + "T12:00:00"))} a {new Intl.DateTimeFormat("pt-BR").format(new Date(campaign.endDate + "T12:00:00"))}</strong></p><p><span className="text-[#849087]">Cupom · canal</span><strong className="mt-1 block text-[#304b3c]">{campaign.coupon} · {campaign.channel === "whatsapp" ? "WhatsApp" : campaign.channel === "email" ? "E-mail" : "App"}</strong></p></div><div className="mb-4 flex items-center justify-between text-xs"><span className="text-[#718077]">Resgates: <strong className="text-[#304b3c]">{campaign.redemptions}{campaign.limit ? ` / ${campaign.limit}` : ""}</strong></span>{campaign.limit > 0 && <div className="ml-3 h-1.5 w-24 overflow-hidden rounded-full bg-[#e9eeeb]"><div className="h-full rounded-full bg-[#16865b]" style={{ width: `${Math.min(100, campaign.redemptions / campaign.limit * 100)}%` }} /></div>}</div><div className="flex flex-wrap gap-2 border-t border-[#eef2ef] pt-4"><button onClick={() => copyText(campaign.coupon, `Cupom ${campaign.coupon} copiado.`)} className="rounded-lg border border-[#dfe7e1] px-3 py-2 text-xs font-semibold text-[#526157] hover:bg-[#f7faf7]"><Copy size={13} className="mr-1 inline" />Copiar cupom</button><button onClick={() => { if (campaign.channel === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer"); else if (campaign.channel === "email") { const recipients = customersInAudience(campaign.audience).map(row => row[1]).filter(address => address && address.includes("@")); window.location.href = `mailto:?bcc=${encodeURIComponent(recipients.join(","))}&subject=${encodeURIComponent(campaign.name)}&body=${encodeURIComponent(message)}`; } else copyText(message, "Mensagem da campanha copiada."); }} className="rounded-lg bg-[#16865b] px-3 py-2 text-xs font-semibold text-white hover:bg-[#116e4c]"><Send size={13} className="mr-1 inline" />Preparar divulgacao</button>{status === "Ativa" && <button onClick={() => setCampaigns(current => current.map(item => item.id === campaign.id ? { ...item, redemptions: item.redemptions + 1 } : item))} className="rounded-lg border border-[#dfe7e1] px-3 py-2 text-xs font-semibold text-[#526157] hover:bg-[#f7faf7]">+ Registrar resgate</button>}<button onClick={() => setCampaigns(current => current.map(item => item.id === campaign.id ? { ...item, paused: !item.paused } : item))} className="rounded-lg border border-[#dfe7e1] px-3 py-2 text-xs font-semibold text-[#526157] hover:bg-[#f7faf7]">{campaign.paused ? <><Play size={13} className="mr-1 inline" />Retomar</> : <><Pause size={13} className="mr-1 inline" />Pausar</>}</button><button onClick={() => { if (window.confirm(`Excluir a campanha "${campaign.name}"?`)) setCampaigns(current => current.filter(item => item.id !== campaign.id)); }} aria-label={`Excluir promoção ${campaign.name}`} className="rounded-lg border border-[#f2d5d1] px-3 py-2 text-xs font-semibold text-[#a34d45] hover:bg-[#fff1ee]"><Trash2 size={14} className="mr-1 inline" />Excluir promoção</button></div></article>; })}</div> : <div className="soft-shadow rounded-2xl border border-dashed border-[#cfdcd2] bg-white px-6 py-14 text-center"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e4] text-[#16865b]"><Megaphone size={22} /></div><h3 className="font-bold text-[#173c2c]">Sua próxima campanha começa aqui</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718077]">Crie uma oferta, escolha um público e prepare a mensagem para divulgar por WhatsApp ou e-mail.</p><button onClick={() => setFormOpen(true)} className="mt-5 rounded-xl bg-[#173c2c] px-4 py-2.5 text-sm font-semibold text-white">Criar primeira campanha</button></div>}
    <div className="mt-6 rounded-xl border border-[#e9eeeb] bg-white p-4 text-xs leading-5 text-[#718077]">As estimativas de público usam os clientes cadastrados neste navegador. A divulgação abre um rascunho no canal escolhido; não envia mensagens automaticamente. Registre os resgates para acompanhar os resultados.</div>
    {formOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173c2c]/40 p-4" role="dialog" aria-modal="true" aria-labelledby="new-campaign-title"><form onSubmit={createCampaign} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-7"><div className="mb-6 flex items-start justify-between"><div><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef8e4] text-[#16865b]"><TicketPercent size={20} /></div><h3 id="new-campaign-title" className="text-xl font-extrabold text-[#173c2c]">Criar promocao</h3><p className="mt-1 text-sm text-[#849087]">Defina a oferta e quem deve recebe-la.</p></div><button type="button" onClick={() => setFormOpen(false)} aria-label="Fechar formulario" className="rounded-lg p-1 text-[#849087]"><X size={20} /></button></div><div className="grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2 text-xs font-semibold text-[#526157]">Nome da campanha *<input required maxLength={80} value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} placeholder="Ex.: Oferta especial de fim de semana" className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]" /></label><label className="text-xs font-semibold text-[#526157]">Tipo de oferta *<select value={draft.mechanic} onChange={event => setDraft({ ...draft, mechanic: event.target.value as Campaign["mechanic"], value: event.target.value === "shipping" ? "0" : draft.value })} className="mt-2 w-full rounded-xl border border-[#dfe7e1] bg-white px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]">{Object.entries(mechanicLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label className="text-xs font-semibold text-[#526157]">{draft.mechanic === "fixed" ? "Valor do desconto (R$) *" : draft.mechanic === "shipping" ? "Pedido minimo (R$)" : "Desconto / economia (%) *"}<input required={draft.mechanic !== "shipping"} type="number" min={draft.mechanic === "shipping" ? "0" : "1"} max={draft.mechanic === "percentage" || draft.mechanic === "bundle" ? 100 : 100000} step="0.01" value={draft.value} onChange={event => setDraft({ ...draft, value: event.target.value })} className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]" /></label><label className="text-xs font-semibold text-[#526157]">Produtos ou categorias *<input required value={draft.scope} onChange={event => setDraft({ ...draft, scope: event.target.value })} placeholder="Ex.: Hortifruti" className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]" /></label><label className="text-xs font-semibold text-[#526157]">Público-alvo *<select value={draft.audience} onChange={event => setDraft({ ...draft, audience: event.target.value })} className="mt-2 w-full rounded-xl border border-[#dfe7e1] bg-white px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]">{Object.entries(audienceLabels).map(([key, label]) => <option key={key} value={key}>{label} ({audienceCount(key)})</option>)}</select><span className="mt-1 block font-normal text-[#849087]">Estimativa baseada nos cadastros locais.</span></label><label className="text-xs font-semibold text-[#526157]">Canal de divulgacao *<select value={draft.channel} onChange={event => setDraft({ ...draft, channel: event.target.value as Campaign["channel"] })} className="mt-2 w-full rounded-xl border border-[#dfe7e1] bg-white px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]"><option value="whatsapp">WhatsApp</option><option value="email">E-mail</option><option value="app">App / copiar mensagem</option></select></label><label className="text-xs font-semibold text-[#526157]">Cupom (opcional)<input value={draft.coupon} onChange={event => setDraft({ ...draft, coupon: event.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "") })} maxLength={20} placeholder="Gerado automaticamente se vazio" className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-3 text-sm font-normal uppercase outline-none focus:border-[#16865b]" /></label><label className="text-xs font-semibold text-[#526157]">Inicio da campanha *<input required type="date" min={today} value={draft.startDate} onChange={event => setDraft({ ...draft, startDate: event.target.value, endDate: draft.endDate < event.target.value ? event.target.value : draft.endDate })} className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]" /></label><label className="text-xs font-semibold text-[#526157]">Fim da campanha *<input required type="date" min={draft.startDate} value={draft.endDate} onChange={event => setDraft({ ...draft, endDate: event.target.value })} className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]" /></label><label className="text-xs font-semibold text-[#526157]">Limite de resgates<input type="number" min="0" value={draft.limit} onChange={event => setDraft({ ...draft, limit: event.target.value })} className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-3 text-sm font-normal outline-none focus:border-[#16865b]" /><span className="mt-1 block font-normal text-[#849087]">0 = sem limite.</span></label></div><div className="mt-6 flex flex-col-reverse justify-end gap-3 border-t border-[#eef2ef] pt-5 sm:flex-row"><button type="button" onClick={() => setFormOpen(false)} className="rounded-xl border border-[#dfe7e1] px-4 py-3 text-sm font-semibold text-[#526157]">Cancelar</button><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173c2c] px-5 py-3 text-sm font-bold text-white"><Check size={16} /> Criar campanha</button></div></form></div>}
  </div>;
}

export function SectionModule({ section, createRequest = 0, onCreateHandled }: { section: Exclude<SectionKey, "overview">; createRequest?: number; onCreateHandled?: () => void }) {
  const config = modules[section];
  const Icon = config.icon;
  const activeLabel = section === "products" ? "Produtos cadastrados" : section === "stores" ? "Lojas cadastradas" : "Registros ativos";
  const activeTotal = section === "orders" ? "1.520" : section === "products" ? "846" : section === "stores" ? "12" : "3.842";
  const dailyTotal = section === "orders" ? "240" : section === "products" ? "64" : section === "stores" ? "3" : section === "customers" ? "28" : "184";
  const [popupOpen, setPopupOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const storageKey = `liverpoll-${section}-records`;
  const [rows, setRows] = useState(config.rows);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        const savedRows = JSON.parse(stored) as string[][];
        if (section === "customers" && savedRows.length < 4) savedRows.push(config.rows[3]);
        if (section === "stores" && savedRows.length === 3) savedRows.splice(2, 1);
        setRows(savedRows);
      } catch { window.localStorage.removeItem(storageKey); }
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!createRequest || section === "help" || section === "promotions") return;
    setPopupOpen(true);
    onCreateHandled?.();
  }, [createRequest, onCreateHandled, section]);

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

  if (section === "help") return <HelpCenter createRequest={createRequest} onCreateHandled={onCreateHandled} />;
  if (section === "promotions") return <PromotionsCenter createRequest={createRequest} onCreateHandled={onCreateHandled} />;
  if (section === "settings") return <SettingsCenter />;

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
