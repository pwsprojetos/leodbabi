"use client";

import { useEffect, useState } from "react";
import { Bell, ChevronDown, CircleHelp, ClipboardList, LayoutDashboard, LogOut, Menu, Package, Search, Settings, ShoppingCart, Store, Tag, Users, Wallet, X } from "lucide-react";
import { defaultUserPreferences, SectionKey, SectionModule, UserPreferences } from "./modules";
import { useAuth } from "./auth";

const nav = [
  { label: "Visao geral", icon: LayoutDashboard, section: "overview" as SectionKey },
  { label: "Pedidos", icon: ClipboardList, section: "orders" as SectionKey, badge: "24" },
  { label: "Produtos", icon: Package, section: "products" as SectionKey },
  { label: "Clientes", icon: Users, section: "customers" as SectionKey },
  { label: "Lojas", icon: Store, section: "stores" as SectionKey },
  { label: "Promocoes", icon: Tag, section: "promotions" as SectionKey },
];

function StatCard({ icon: Icon, title, value }: { icon: typeof Wallet; title: string; value: string }) {
  return <div className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5"><div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8e4] text-[#16865b]"><Icon size={19} /></div><p className="mb-1 text-sm text-[#849087]">{title}</p><h3 className="text-[25px] font-extrabold">{value}</h3></div>;
}
function Overview() {
  const [period, setPeriod] = useState("Ultimos 7 dias");
  const [kpis, setKpis] = useState({ revenue: 0, orderCount: 0, customerCount: 0 });
  useEffect(() => {
    const readRows = (key: string, fallback: string[][]) => {
      try {
        const saved = window.localStorage.getItem(key);
        if (!saved) return fallback;
        const parsed: unknown = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter((row): row is string[] => Array.isArray(row)) : fallback;
      } catch { return fallback; }
    };
    const orders = readRows("liverpoll-orders-records", [
      ["#MC-20491", "Mariana Costa", "Unidade Jardins", "R$ 248,90", "Pago"],
      ["#MC-20490", "Ricardo Alves", "Unidade Centro", "R$ 86,40", "Separando"],
      ["#MC-20489", "Camila Oliveira", "Unidade Jardins", "R$ 412,75", "Pago"],
    ]);
    const customers = readRows("liverpoll-customers-records", [["Mariana Costa"], ["Ricardo Alves"], ["Camila Oliveira"], ["Joao Mendes"]]);
    const orderAmounts = orders.map(row => {
      const raw = (row[3] || "").replace("R$", "").replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
      const amount = Number(raw);
      return raw && Number.isFinite(amount) ? amount : null;
    }).filter((amount): amount is number => amount !== null);
    const revenue = orderAmounts.reduce((sum, amount) => sum + amount, 0);
    const customerCount = customers.filter(row => Boolean(row[0]?.trim())).length;
    setKpis({ revenue, orderCount: orderAmounts.length, customerCount });
  }, []);
  const currency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  const number = (value: number) => new Intl.NumberFormat("pt-BR").format(value);
  useEffect(() => {
    const loadPeriod = () => {
      try {
        const saved = window.localStorage.getItem("liverpoll-preferences");
        const preferences = saved ? JSON.parse(saved) as Partial<UserPreferences> : defaultUserPreferences;
        setPeriod(preferences.defaultSalesPeriod === "30d" ? "Ultimos 30 dias" : preferences.defaultSalesPeriod === "year" ? "Este ano" : "Ultimos 7 dias");
      } catch { setPeriod("Ultimos 7 dias"); }
    };
    loadPeriod();
    window.addEventListener("liverpoll-preferences-updated", loadPeriod);
    return () => window.removeEventListener("liverpoll-preferences-updated", loadPeriod);
  }, []);
  const sales = [{ day: "Segunda", value: 5800 }, { day: "Terca", value: 7400 }, { day: "Quarta", value: 6200 }, { day: "Quinta", value: 10100 }, { day: "Sexta", value: 8300 }, { day: "Sabado", value: 10800 }, { day: "Domingo", value: 9200 }];
  const categories = [{ name: "Mercearia", share: 38, color: "#16865b" }, { name: "Hortifruti", share: 26, color: "#9bd45b" }, { name: "Bebidas", share: 18, color: "#f3bb62" }, { name: "Outros", share: 18, color: "#dce8df" }];
  const totalSales = sales.reduce((sum, item) => sum + item.value, 0);
  const donutCircumference = 2 * Math.PI * 48;
 const shortCurrency = (value: number) => `R$ ${(value / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}k`;
  return <div className="mx-auto max-w-[1440px] p-5 sm:p-8"><div className="mb-8"><p className="mb-2 text-sm font-medium text-[#16865b]">Sua operacao em um so lugar</p><h2 className="text-[28px] font-extrabold sm:text-[32px]">Visao geral</h2></div><div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={Wallet} title="Total faturado nos pedidos" value={currency(kpis.revenue)} /><StatCard icon={ShoppingCart} title="Pedidos cadastrados" value={number(kpis.orderCount)} /><StatCard icon={Users} title="Clientes cadastrados" value={number(kpis.customerCount)} /><StatCard icon={Package} title="Ticket médio dos pedidos" value={currency(kpis.orderCount ? kpis.revenue / kpis.orderCount : 0)} /></div><div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]"><section className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5 sm:p-6"><div className="mb-7 flex items-start justify-between"><div><h3 className="text-base font-bold">Desempenho de vendas</h3><p className="mt-1 text-xs text-[#849087]">Acompanhe o faturamento da sua operacao</p></div><select value={period} onChange={event => setPeriod(event.target.value)} className="rounded-lg border border-[#e5ebe6] bg-white px-3 py-2 text-xs font-semibold outline-none"><option>Ultimos 7 dias</option><option>Ultimos 30 dias</option><option>Este ano</option></select></div><div className="chart-grid flex h-[220px] items-end justify-around border-b border-[#dfe7e1]">{sales.map((item, index) => <div key={item.day} tabIndex={0} title={`${item.day}: ${currency(item.value)} Â· ${((item.value / totalSales) * 100).toFixed(1)}% do faturamento do periodo`} aria-label={`${item.day}: ${currency(item.value)}, ${((item.value / totalSales) * 100).toFixed(1)}% do faturamento do periodo`} className={`bar chart-bar group relative h-[${[47, 60, 51, 83, 68, 89, 76][index]}%] w-[8%] focus:outline-none`} style={{ height: `${[47, 60, 51, 83, 68, 89, 76][index]}%` }}><span className="chart-value-label">{shortCurrency(item.value)}</span><span className="chart-tooltip" role="tooltip"><strong>{item.day}</strong><span>{currency(item.value)}</span><small>{((item.value / totalSales) * 100).toFixed(1)}% do periodo</small></span></div>)}</div><div className="mt-2 flex justify-around text-[10px] text-[#849087]">{sales.map(item => <span key={item.day} className="w-[8%] text-center">{item.day.slice(0, 3)}</span>)}</div></section><section className="soft-shadow rounded-2xl border border-[#e9eeeb] bg-white p-5 sm:p-6"><h3 className="text-base font-bold">Categorias mais vendidas</h3><p className="mt-1 text-xs text-[#849087]">Participacao no faturamento</p><div className="my-6 flex items-center gap-6"><div className="relative h-[128px] w-[128px] shrink-0 rounded-full"><svg viewBox="0 0 128 128" className="h-full w-full -rotate-90 overflow-visible" role="img" aria-label="GrÃ¡fico de rosca com participaÃ§Ã£o das categorias no faturamento">{categories.map((category, index) => { const offset = categories.slice(0, index).reduce((sum, item) => sum + item.share, 0) * donutCircumference / 100; const length = category.share * donutCircumference / 100; return <circle key={category.name} cx="64" cy="64" r="48" fill="none" stroke={category.color} strokeWidth="24" strokeDasharray={`${length} ${donutCircumference - length}`} strokeDashoffset={-offset} tabIndex={0} className="donut-segment" aria-label={`${category.name}: ${category.share}% do faturamento`}><title>{`${category.name}: ${category.share}% do faturamento`}</title></circle>; })}</svg><div className="pointer-events-none absolute inset-[18px] flex items-center justify-center rounded-full bg-white"><strong className="text-xl">100%</strong></div></div><div className="space-y-3 text-xs">{categories.map(category => <div key={category.name} tabIndex={0} title={`${category.name}: ${category.share}% do faturamento`} className="group relative cursor-help rounded focus:outline-none focus:ring-2 focus:ring-[#16865b]" aria-label={`${category.name}: ${category.share}% do faturamento`}><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />{category.name} <strong>{category.share}%</strong><span className="chart-tooltip chart-tooltip-side" role="tooltip"><strong>{category.name}</strong><span>{category.share}% do faturamento</span></span></div>)}</div></div><div className="rounded-xl bg-[#f5f9f4] p-3 text-xs text-[#5c6e62]">Mercearia cresceu <strong>18,4%</strong> este mes</div></section></div></div>;
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  const [saved, setSaved] = useState(false);
  function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setSaved(true); window.setTimeout(onClose, 800); }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173c2c]/40 p-4" role="dialog" aria-modal="true"><form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between"><div><div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#d6e9a9] text-lg font-bold text-[#2f633e]">GS</div><h2 className="text-lg font-extrabold">Perfil do usuario</h2><p className="mt-1 text-xs text-[#849087]">Atualize os dados da sua conta.</p></div><button type="button" onClick={onClose} aria-label="Fechar perfil" className="rounded-lg p-1 text-[#849087]"><X size={19} /></button></div><div className="grid gap-4"><label className="text-xs font-semibold text-[#526157]">Nome<input defaultValue="Gabriel Silva" className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-2.5 text-sm font-normal outline-none" /></label><label className="text-xs font-semibold text-[#526157]">E-mail<input type="email" defaultValue="gabriel@liverpoll.com" className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-2.5 text-sm font-normal outline-none" /></label><label className="text-xs font-semibold text-[#526157]">Cargo<input defaultValue="Administrador" className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-3 py-2.5 text-sm font-normal outline-none" /></label></div><button className="mt-6 w-full rounded-xl bg-[#173c2c] px-4 py-3 text-sm font-bold text-white">{saved ? "Perfil salvo" : "Salvar perfil"}</button></form></div>;
}

type SearchResult = { type: string; name: string; detail: string; section?: SectionKey; action?: string };

function GlobalSearch({ onClose, onSelect }: { onClose: () => void; onSelect: (result: SearchResult) => void }) {
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<SearchResult[]>([]);
  useEffect(() => {
    const shortcuts: SearchResult[] = [
      { type: "Aba", name: "Visao geral", detail: "Painel, faturamento e graficos", section: "overview" },
      { type: "Aba", name: "Pedidos", detail: "Consultar pedidos e status", section: "orders" },
      { type: "Aba", name: "Produtos", detail: "Catalogo, precos e estoque", section: "products" },
      { type: "Aba", name: "Clientes", detail: "Cadastro e relacionamento", section: "customers" },
      { type: "Aba", name: "Lojas", detail: "Unidades e equipes", section: "stores" },
      { type: "Aba", name: "Promocoes", detail: "Campanhas e ofertas", section: "promotions" },
      { type: "Aba", name: "Preferencias", detail: "Configuracoes do sistema", section: "settings" },
      { type: "Aba", name: "Central de ajuda", detail: "Tutoriais e suporte", section: "help" },
      { type: "Funcao", name: "Novo pedido", detail: "Abrir formulario de pedido", section: "orders", action: "create" },
      { type: "Funcao", name: "Novo produto", detail: "Cadastrar produto; abrir formulario de produto", section: "products", action: "create" },
      { type: "Funcao", name: "Novo cliente", detail: "Cadastrar cliente; abrir formulario de cliente", section: "customers", action: "create" },
      { type: "Funcao", name: "Nova loja", detail: "Cadastrar loja; abrir formulario de loja", section: "stores", action: "create" },
      { type: "Funcao", name: "Nova promocao", detail: "Criar promocao; abrir formulario de promocao", section: "promotions", action: "create" },
      { type: "Funcao", name: "Abrir chamado de suporte", detail: "Criar chamado na Central de ajuda", section: "help", action: "create" },
      { type: "Funcao", name: "Abrir perfil do usuario", detail: "Editar dados do perfil", action: "profile" },
      { type: "Funcao", name: "Abrir notificacoes", detail: "Ver notificacoes recentes", action: "notifications" },
      { type: "Funcao", name: "Marcar notificacoes como lidas", detail: "Limpar o indicador de notificacoes", action: "read-notifications" },
      { type: "Funcao", name: "Sair da conta", detail: "Encerrar sessao", action: "logout" },
    ];
    const sectionNames: Record<string, string> = { orders: "Pedido", products: "Produto", customers: "Cliente", stores: "Loja", promotions: "Promocao" };
    const stored: SearchResult[] = [];
    Object.keys(sectionNames).forEach(section => {
      const saved = window.localStorage.getItem("liverpoll-" + section + "-records");
      if (!saved) return;
      try {
        const rows = JSON.parse(saved) as string[][];
        rows.forEach(row => stored.push({ type: sectionNames[section], name: row[0] || "Registro", detail: row.slice(1).filter(Boolean).join(" ? "), section: section as SectionKey }));
      } catch { window.localStorage.removeItem("liverpoll-" + section + "-records"); }
    });
    const examples: SearchResult[] = [
      { type: "Pedido", name: "#MC-20491", detail: "Mariana Costa ? R$ 248,90", section: "orders" },
      { type: "Pedido", name: "#MC-20490", detail: "Ricardo Alves ? R$ 86,40", section: "orders" },
      { type: "Produto", name: "Leite integral Itambe 1L", detail: "Laticinios ? 12 un.", section: "products" },
      { type: "Produto", name: "Pao de forma Pullman", detail: "Padaria ? 7 un.", section: "products" },
      { type: "Cliente", name: "Mariana Costa", detail: "mariana@email.com", section: "customers" },
      { type: "Cliente", name: "Ricardo Alves", detail: "ricardo@email.com", section: "customers" },
      { type: "Loja", name: "Unidade Jardins", detail: "Av. Paulista, 100", section: "stores" },
      { type: "Loja", name: "Unidade Centro", detail: "Rua Central, 45", section: "stores" },
      { type: "Promocao", name: "Leve 3, pague 2", detail: "Desconto de 33%", section: "promotions" },
    ];
    const combined = [...shortcuts, ...stored, ...examples];
    setRecords(combined.filter((record, index) => combined.findIndex(item => item.type === record.type && item.name === record.name) === index));
  }, []);
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9@#., ]/g, " ").split(/\s+/).filter(Boolean).map(word => word.endsWith("s") ? word.slice(0, -1) : word).join(" ");
  const normalizedQuery = normalize(query.trim());
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  const results = terms.length ? records.filter(record => {
    const searchable = normalize(record.type + " " + record.name + " " + record.detail);
    return terms.every(term => searchable.includes(term));
  }).slice(0, 20) : [];
  return <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#173c2c]/40 p-4 pt-[12vh]" role="dialog" aria-modal="true"><div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl"><div className="flex items-center gap-3 rounded-xl border border-[#dfe7e1] px-4 py-3"><Search size={19} className="text-[#849087]" /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Escape") onClose(); if (event.key === "Enter" && results[0]) onSelect(results[0]); }} placeholder="Pesquise abas, funcoes, pedidos, produtos..." className="flex-1 text-sm outline-none" /><button onClick={onClose} aria-label="Fechar pesquisa"><X size={18} className="text-[#849087]" /></button></div><div className={"mt-4 max-h-[55vh] overflow-y-auto " + (terms.length ? "" : "hidden")}>{results.length ? results.map((result, index) => <button key={result.type + "-" + result.name + "-" + index} onClick={() => onSelect(result)} className="flex w-full items-center justify-between rounded-xl p-3 text-left hover:bg-[#f4f8f3]"><span><strong className="block text-sm text-[#304b3c]">{result.name}</strong><span className="text-xs text-[#718077]">{result.detail}</span></span><span className="rounded-full bg-[#eef8e4] px-2 py-1 text-[10px] font-bold text-[#16865b]">{result.type}</span></button>) : <p className="p-8 text-center text-sm text-[#849087]">Nenhuma aba, funcao ou registro encontrado.</p>}</div><div className={"mt-3 flex items-center justify-between border-t border-[#eef2ef] pt-3 text-xs text-[#849087] " + (terms.length ? "" : "hidden")}><span>{results.length} resultado(s)</span><button onClick={onClose} className="font-bold text-[#16865b]">Fechar</button></div></div></div>;
}

type Notification = { title: string; text: string; time: string; unread: boolean; category: "orders" | "stock" | "promotions"; stockLevel?: number };

const initialNotifications: Notification[] = [
  { title: "Pedido aguardando separacao", text: "O pedido #MC-20490 precisa de atencao.", time: "Agora", unread: true, category: "orders" },
  { title: "Estoque baixo", text: "Leite integral Itambe esta com 12 unidades.", time: "Ha 15 min", unread: true, category: "stock", stockLevel: 12 },
  { title: "Nova venda realizada", text: "A venda #MC-20491 foi paga com sucesso.", time: "Ha 1 h", unread: false, category: "orders" },
  { title: "Campanha de promoção ativa", text: "A campanha Black Friday está disponível para seus clientes.", time: "Hoje", unread: false, category: "promotions" },
];

function NotificationPanel({ notifications, preferences, onRead, onReadAll, onClose }: { notifications: Notification[]; preferences: UserPreferences; onRead: (title: string) => void; onReadAll: () => void; onClose: () => void }) {
  const visibleNotifications = notifications.filter(notification => preferences.notifications[notification.category] && (notification.category !== "stock" || (notification.stockLevel ?? 0) <= preferences.lowStockThreshold));
  const unread = visibleNotifications.filter(notification => notification.unread).length;
  return <div className="absolute right-16 top-16 z-40 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-[#e9eeeb] bg-white p-4 shadow-2xl"><div className="mb-3 flex items-center justify-between"><div><h3 className="font-bold text-[#173c2c]">Notificacoes</h3><p className="text-xs text-[#849087]">{unread} nao lidas</p></div><button onClick={onReadAll} disabled={!unread} className="text-xs font-bold text-[#16865b] disabled:cursor-default disabled:text-[#9ca9a1]">Marcar como lidas</button></div><div className="space-y-2">{visibleNotifications.length ? visibleNotifications.map(notification => <button key={notification.title} onClick={() => onRead(notification.title)} aria-label={notification.title + (notification.unread ? ", nao lida" : ", lida")} className={"w-full rounded-xl p-3 text-left transition hover:bg-[#f4f8f3] " + (notification.unread ? "bg-[#f4f9ef]" : "bg-white")}><div className="flex gap-3"><span className={"mt-1 h-2 w-2 shrink-0 rounded-full " + (notification.unread ? "bg-[#ef6256]" : "bg-[#dfe7e1]")} /><span><strong className="block text-xs text-[#304b3c]">{notification.title}</strong><span className="mt-1 block text-xs leading-4 text-[#718077]">{notification.text}</span><span className="mt-1 block text-[10px] text-[#9ca9a1]">{notification.time}</span></span></div></button>) : <p className="rounded-xl bg-[#f7faf7] p-4 text-center text-xs text-[#849087]">Nenhum aviso corresponde às preferências atuais.</p>}</div><button onClick={onClose} className="mt-3 w-full rounded-xl border border-[#dfe7e1] py-2 text-xs font-bold text-[#526157]">Fechar</button></div>;
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [pendingCreate, setPendingCreate] = useState<{ section: Exclude<SectionKey, "overview">; id: number } | null>(null);
  const [createRequestId, setCreateRequestId] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultUserPreferences);
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const saved = window.localStorage.getItem("liverpoll-preferences");
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<UserPreferences>;
          setPreferences({ ...defaultUserPreferences, ...parsed, notifications: { ...defaultUserPreferences.notifications, ...parsed.notifications } });
        } else setPreferences(defaultUserPreferences);
      } catch { setPreferences(defaultUserPreferences); }
    };
    loadPreferences();
    window.addEventListener("liverpoll-preferences-updated", loadPreferences);
    return () => window.removeEventListener("liverpoll-preferences-updated", loadPreferences);
  }, []);
  useEffect(() => {
    const saved = window.localStorage.getItem("liverpoll-notifications");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Notification[];
      if (Array.isArray(parsed) && parsed.every(item => typeof item.title === "string" && typeof item.unread === "boolean")) setNotifications(parsed.map(item => ({ ...item, category: item.category || (item.title.toLowerCase().includes("estoque") ? "stock" : "orders"), stockLevel: item.stockLevel ?? (item.title.toLowerCase().includes("estoque") ? 12 : undefined) })));
    } catch { window.localStorage.removeItem("liverpoll-notifications"); }
  }, []);
  const updateNotifications = (next: Notification[]) => { setNotifications(next); window.localStorage.setItem("liverpoll-notifications", JSON.stringify(next)); };
  const markNotificationRead = (title: string) => updateNotifications(notifications.map(item => item.title === title ? { ...item, unread: false } : item));
  const markAllNotificationsRead = () => updateNotifications(notifications.map(item => ({ ...item, unread: false })));
  const hasVisibleUnread = notifications.some(item => item.unread && preferences.notifications[item.category] && (item.category !== "stock" || (item.stockLevel ?? 0) <= preferences.lowStockThreshold));
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = (section: SectionKey) => { setActiveSection(section); setMobileOpen(false); };
  const selectSearchResult = (result: SearchResult) => {
    setSearchOpen(false);
    if (result.action === "create" && result.section && result.section !== "overview") {
      const id = createRequestId + 1;
      setCreateRequestId(id);
      setPendingCreate({ section: result.section, id });
      navigate(result.section);
      return;
    }
    if (result.section) navigate(result.section);
    if (result.action === "profile") setProfileOpen(true);
    if (result.action === "notifications") setNotificationOpen(true);
    if (result.action === "read-notifications") markAllNotificationsRead();
    if (result.action === "logout") logout();
  };
  return <div className="min-h-screen"><aside className={`sidebar-scroll fixed inset-y-0 left-0 z-20 flex w-[252px] flex-col bg-[#173c2c] px-5 py-6 text-white transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}><div className="mb-11 flex items-center justify-between px-2"><button type="button" onClick={() => navigate("overview")} aria-label="Voltar para a visao geral" className="flex items-center gap-2.5 text-left"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c9f36b] text-[#173c2c]"><ShoppingCart size={19} /></div><span className="text-xl font-extrabold">Mercado Liverpoll<span className="text-[#c9f36b">.</span></span></button><button className="lg:hidden" onClick={() => setMobileOpen(false)}><X size={20} /></button></div><div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#8cac9a]">Menu principal</div><nav className="space-y-1">{nav.map(({ label, icon: Icon, section, badge }) => <button key={section} onClick={() => navigate(section)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${activeSection === section ? "bg-[#2b6048] text-[#c9f36b]" : "text-[#c3d4ca] hover:bg-[#24533e]"}`}><Icon size={18} />{label}{badge && <span className="ml-auto rounded-md bg-[#c9f36b] px-1.5 py-0.5 text-[10px] font-bold text-[#173c2c]">{badge}</span>}</button>)}</nav><div className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#8cac9a]">Configuracoes</div><nav className="space-y-1"><button onClick={() => navigate("settings")} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${activeSection === "settings" ? "bg-[#2b6048] text-[#c9f36b]" : "text-[#c3d4ca] hover:bg-[#24533e]"}`}><Settings size={18} />Preferencias</button><button onClick={() => navigate("help")} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${activeSection === "help" ? "bg-[#2b6048] text-[#c9f36b]" : "text-[#c3d4ca] hover:bg-[#24533e]"}`}><CircleHelp size={18} />Central de ajuda</button></nav><button onClick={logout} className="mt-auto flex items-center gap-3 px-3 text-sm text-[#b9ccc0]"><LogOut size={17} />Sair da conta</button></aside><main className="lg:ml-[252px]"><header className="flex h-[78px] items-center justify-between border-b border-[#e9eeeb] bg-white px-5 sm:px-8"><div className="flex items-center gap-3"><button className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={22} /></button><div><p className="text-xs text-[#849087]">Quarta-feira, 08 de outubro de 2026</p><h1 className="mt-0.5 text-lg font-extrabold">Bom dia, Gabriel</h1></div></div><div className="flex items-center gap-3 sm:gap-5"><button onClick={() => setSearchOpen(true)} className="hidden text-[#849087] sm:block" aria-label="Pesquisar registros"><Search size={19} /></button><button onClick={() => setNotificationOpen(open => !open)} className="relative text-[#849087]" aria-label="Abrir notificacoes"><Bell size={19} />{hasVisibleUnread && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border-2 border-white bg-[#ef6256]" />}</button><button onClick={() => setProfileOpen(true)} className="flex items-center gap-2" aria-label="Abrir perfil do usuario"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d6e9a9] text-xs font-bold text-[#2f633e]">GS</div><span className="hidden text-sm font-semibold sm:block">Gabriel Silva</span><ChevronDown className="hidden text-[#849087] sm:block" size={15} /></button></div></header>{searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} onSelect={selectSearchResult} />}{notificationOpen && <NotificationPanel notifications={notifications} preferences={preferences} onRead={markNotificationRead} onReadAll={markAllNotificationsRead} onClose={() => setNotificationOpen(false)} />}{activeSection === "overview" ? <Overview /> : <SectionModule key={activeSection} section={activeSection} createRequest={pendingCreate?.section === activeSection ? pendingCreate.id : 0} onCreateHandled={() => setPendingCreate(null)} />}</main>{profileOpen ? <ProfileModal onClose={() => setProfileOpen(false)} /> : null}</div>;
}
