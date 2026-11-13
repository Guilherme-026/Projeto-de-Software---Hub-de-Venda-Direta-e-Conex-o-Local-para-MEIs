import React, { useState } from "react";
import {
  CheckCircle2,
  Minus,
  Plus,
  Copy,
  Check,
  ShieldCheck,
  QrCode,
  ArrowRight,
  X,
  Send,
  Sparkles,
  Siren,
  Radio,
  Clock,
  LogOut,
  ChefHat,
  AlertTriangle,
  Flame,
  CheckCheck,
  Smartphone,
  Layers,
  KeyRound,
  LockOpen,
  Shield,
  MapPin,
  Banknote,
  Bike,
  PackageCheck,
  CheckSquare2,
  Store,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export default function App() {
  // Controle de alternância entre as 3 telas solicitadas
  const [activeScreen, setActiveScreen] = useState<"tela1" | "tela2" | "tela3">(
    "tela1",
  );

  // ==========================================
  // ESTADOS DA TELA 1 (CLIENTE / CHECKOUT)
  // ==========================================
  const [tela1Quantities, setTela1Quantities] = useState<
    Record<string, number>
  >({
    item1: 2,
    item2: 0,
  });

  const [tela1FormData, setTela1FormData] = useState({
    name: "Carlos Mendes",
    whatsapp: "(11) 98765-4321",
    address: "Rua das Acácias, 142 - Vila Nova",
  });

  const [tela1Copied, setTela1Copied] = useState(false);
  const [showTela1OrderModal, setShowTela1OrderModal] = useState(false);

  const pixKey = "sabordavila.mei@exemplo.com";

  const menuItems: MenuItem[] = [
    {
      id: "item1",
      name: "Marmita Executivo Frango Grelhado",
      description:
        "Arroz, feijão carioca, filé de frango grelhado, farofa e salada.",
      price: 18.0,
    },
    {
      id: "item2",
      name: "Marmita Feijoada Completa",
      description:
        "Feijoada tradicional, arroz branco, couve refogada, laranja e torresmo.",
      price: 22.0,
    },
  ];

  const handleTela1QtyChange = (id: string, delta: number) => {
    setTela1Quantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const tela1TotalItems = Object.values(tela1Quantities).reduce(
    (acc, q) => acc + q,
    0,
  );
  const tela1TotalPrice = menuItems.reduce((acc, item) => {
    const qty = tela1Quantities[item.id] || 0;
    return acc + qty * item.price;
  }, 0);

  const formatBRL = (val: number) => {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setTela1Copied(true);
      setTimeout(() => setTela1Copied(false), 2500);
    } catch {
      setTela1Copied(true);
      setTimeout(() => setTela1Copied(false), 2500);
    }
  };

  // ==========================================
  // ESTADOS DA TELA 2 (COZINHA & SOS MEI)
  // ==========================================
  const [sosStatus, setSosStatus] = useState<{
    active: boolean;
    stage: string;
    pin: string;
  }>({
    active: true,
    stage: "Buscando em Onda 1 (até 3 km)",
    pin: "4829",
  });

  const [sosAlertTriggered, setSosAlertTriggered] = useState(false);
  const [order104Status, setOrder104Status] = useState<
    "preparar" | "em_preparo" | "pronto"
  >("preparar");
  const [order105Status, setOrder105Status] = useState<
    "aguardando" | "confirmado" | "em_preparo"
  >("aguardando");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pinCopied, setPinCopied] = useState(false);

  const handleTriggerSOS = () => {
    setSosAlertTriggered(true);
    setSosStatus({
      active: true,
      stage: "Alerta Reforçado • Buscando em Onda 1 e 2 (até 5 km)",
      pin: "4829",
    });
    setTimeout(() => setSosAlertTriggered(false), 3000);
  };

  const handleCopyPin = async () => {
    try {
      await navigator.clipboard.writeText("4829");
      setPinCopied(true);
      setTimeout(() => setPinCopied(false), 2000);
    } catch {
      setPinCopied(true);
      setTimeout(() => setPinCopied(false), 2000);
    }
  };

  // ==========================================
  // ESTADOS DA TELA 3 (ENTREGADOR / SOS & PIN)
  // ==========================================
  const [pinInput, setPinInput] = useState("4829");
  const [deliveryCount, setDeliveryCount] = useState(3);
  const [showEndShiftModal, setShowEndShiftModal] = useState(false);
  const [showLogoutModalEntregador, setShowLogoutModalEntregador] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* BARRA SUPERIOR RESPONSIVA DE NAVEGAÇÃO ENTRE AS 3 TELAS DO ECOSSISTEMA */}
      <nav
        aria-label="Navegação do protótipo"
        className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-xs"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#047857] text-white flex items-center justify-center font-bold text-base shadow-xs">
              <Store className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-sm sm:text-base text-[#111827] tracking-tight block">
                Hub de Venda Direta MEI
              </span>
              <span className="text-[11px] font-semibold text-[#6B7280]">
                Design Responsivo Mobile-First • Sem Taxas
              </span>
            </div>
          </div>

          {/* Seletor de Telas Mobile-First (Tabs com alvos de toque acessíveis) */}
          <div className="inline-flex rounded-xl p-1 bg-[#F3F4F6] border border-[#D1D5DB] w-full sm:w-auto justify-center overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveScreen("tela1")}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeScreen === "tela1"
                  ? "bg-[#047857] text-white shadow-xs"
                  : "text-[#4B5563] hover:text-[#111827]"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Tela 1 (Cliente)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen("tela2")}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeScreen === "tela2"
                  ? "bg-[#111827] text-white shadow-xs"
                  : "text-[#4B5563] hover:text-[#111827]"
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Tela 2 (Cozinha MEI)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen("tela3")}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeScreen === "tela3"
                  ? "bg-[#09090B] text-white shadow-xs"
                  : "text-[#4B5563] hover:text-[#111827]"
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Tela 3 (Entregador)</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* TELA 1 — ENTRADA PRINCIPAL: CARDÁPIO RELÂMPAGO E CHECKOUT DIRETO          */}
      {/* ========================================================================= */}
      {activeScreen === "tela1" && (
        <main
          className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col"
          role="region"
          aria-label="Tela 1 — Entrada Principal: Cardápio Relâmpago e Checkout Direto"
        >
          {/* Cabeçalho do Restaurante */}
          <header className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                Marmitaria Sabor da Vila
              </h1>
              <p className="text-sm text-[#4B5563] mt-0.5">
                Comida caseira com entrega rápida no bairro • Sem taxas de
                aplicativo
              </p>
            </div>

            {/* Badge multimodal (ícone de check + texto): "Aberto agora • Pedido Direto (Sem Taxas)" */}
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-[#047857] self-start sm:self-auto shrink-0"
              role="status"
            >
              <CheckCircle2
                className="w-4 h-4 text-[#047857] shrink-0"
                aria-hidden="true"
              />
              <span className="text-xs sm:text-sm font-bold text-[#047857]">
                Aberto agora • Pedido Direto (Sem Taxas)
              </span>
            </div>
          </header>

          {/* Grid Responsivo: 1 coluna no celular, 2 colunas no desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-28 lg:pb-8">
            {/* Coluna Principal: Cardápio de Hoje */}
            <section
              aria-labelledby="cardapio-heading"
              className="lg:col-span-7 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2
                  id="cardapio-heading"
                  className="text-lg sm:text-xl font-bold text-[#111827]"
                >
                  Cardápio de Hoje
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 bg-[#E5E7EB] text-[#111827] rounded-md">
                  Refeições Frescas
                </span>
              </div>

              <div className="space-y-4">
                {menuItems.map((item) => {
                  const qty = tela1Quantities[item.id] || 0;
                  return (
                    <article
                      key={item.id}
                      className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#D1D5DB] transition-all"
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-[#111827] leading-snug">
                          {item.name}
                        </h3>
                        <span className="text-lg font-black text-[#047857] whitespace-nowrap">
                          {formatBRL(item.price)}
                        </span>
                      </div>

                      <p className="text-sm font-normal text-[#374151] leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Controles de quantidade: botões >= 48px e 8px de espaçamento */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                        <span className="text-sm font-semibold text-[#111827]">
                          Quantidade:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTela1QtyChange(item.id, -1)}
                            disabled={qty === 0}
                            aria-label={`Diminuir quantidade de ${item.name}`}
                            className={`min-h-[48px] min-w-[48px] h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg border transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#047857] ${
                              qty === 0
                                ? "bg-[#F3F4F6] text-[#9CA3AF] border-[#E5E7EB] cursor-not-allowed"
                                : "bg-white text-[#111827] border-[#D1D5DB] hover:bg-[#F9FAFB] active:bg-[#E5E7EB]"
                            }`}
                          >
                            <Minus
                              className="w-5 h-5 stroke-[2.5]"
                              aria-hidden="true"
                            />
                          </button>

                          <span
                            className="min-w-[40px] text-center text-lg font-bold text-[#111827]"
                            aria-live="polite"
                          >
                            {qty}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleTela1QtyChange(item.id, 1)}
                            aria-label={`Aumentar quantidade de ${item.name}`}
                            className="min-h-[48px] min-w-[48px] h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg bg-emerald-50 text-[#047857] border border-emerald-300 hover:bg-emerald-100 active:bg-emerald-200 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#047857]"
                          >
                            <Plus
                              className="w-5 h-5 stroke-[2.5]"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Coluna Lateral: Dados para Entrega + Pagamento Pix */}
            <div className="lg:col-span-5 space-y-5">
              {/* Formulário Enxuto: Dados para Entrega */}
              <section
                aria-labelledby="entrega-heading"
                className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4"
              >
                <h2
                  id="entrega-heading"
                  className="text-lg font-bold text-[#111827]"
                >
                  Dados para Entrega
                </h2>

                <form
                  id="order-form-screen1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowTela1OrderModal(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="nome-completo"
                      className="block text-base font-semibold text-[#111827] mb-1.5"
                    >
                      Nome completo *
                    </label>
                    <input
                      id="nome-completo"
                      name="nomeCompleto"
                      type="text"
                      required
                      value={tela1FormData.name}
                      onChange={(e) =>
                        setTela1FormData({
                          ...tela1FormData,
                          name: e.target.value,
                        })
                      }
                      className="w-full min-h-[48px] px-3.5 text-base text-[#111827] bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-[#047857] transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="whatsapp"
                      className="block text-base font-semibold text-[#111827] mb-1.5"
                    >
                      WhatsApp para contato *
                    </label>
                    <input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      required
                      value={tela1FormData.whatsapp}
                      onChange={(e) =>
                        setTela1FormData({
                          ...tela1FormData,
                          whatsapp: e.target.value,
                        })
                      }
                      className="w-full min-h-[48px] px-3.5 text-base text-[#111827] bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-[#047857] transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="endereco"
                      className="block text-base font-semibold text-[#111827] mb-1.5"
                    >
                      Endereço de entrega *
                    </label>
                    <input
                      id="endereco"
                      name="endereco"
                      type="text"
                      required
                      value={tela1FormData.address}
                      onChange={(e) =>
                        setTela1FormData({
                          ...tela1FormData,
                          address: e.target.value,
                        })
                      }
                      className="w-full min-h-[48px] px-3.5 text-base text-[#111827] bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-[#047857] transition-colors"
                    />
                  </div>
                </form>
              </section>

              {/* Cartão de Pagamento Direto via Pix */}
              <section
                aria-labelledby="pix-heading"
                className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-[#047857]">
                    <QrCode className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2
                      id="pix-heading"
                      className="text-base font-bold text-[#111827] leading-snug"
                    >
                      Pagamento Direto via Pix (Sem Intermediação)
                    </h2>
                    <p className="text-xs text-[#4B5563] mt-0.5">
                      100% do valor vai para o microempreendedor local
                    </p>
                  </div>
                </div>

                <div className="bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl p-3.5 space-y-2">
                  <div className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                    Chave Pix E-mail:
                  </div>
                  <div
                    className="font-mono text-base font-bold text-[#111827] select-all break-all bg-white px-3 py-2 rounded-lg border border-[#E5E7EB]"
                    aria-label={`Chave Pix: ${pixKey}`}
                  >
                    {pixKey}
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="w-full min-h-[48px] h-12 px-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 border-2 border-[#047857] text-[#047857] bg-white hover:bg-emerald-50 active:bg-emerald-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#047857]"
                  >
                    {tela1Copied ? (
                      <>
                        <Check
                          className="w-5 h-5 text-[#047857] stroke-[2.5]"
                          aria-hidden="true"
                        />
                        <span>Chave Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy
                          className="w-5 h-5 text-[#047857]"
                          aria-hidden="true"
                        />
                        <span>Copiar Chave</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[#4B5563] pt-0.5">
                  <ShieldCheck
                    className="w-4 h-4 text-[#047857] shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    Transação protegida e direta com a Marmitaria Sabor da Vila
                  </span>
                </div>
              </section>

              {/* Card de Resumo no Desktop */}
              <div className="hidden lg:block bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-md space-y-4">
                <div className="flex items-center justify-between text-base">
                  <span className="font-semibold text-[#374151]">
                    Total do Pedido:
                  </span>
                  <span className="text-xl font-black text-[#111827]">
                    {formatBRL(tela1TotalPrice)}{" "}
                    <span className="text-sm font-normal text-[#4B5563]">
                      ({tela1TotalItems}{" "}
                      {tela1TotalItems === 1 ? "item" : "itens"})
                    </span>
                  </span>
                </div>

                <button
                  type="submit"
                  form="order-form-screen1"
                  disabled={tela1TotalItems === 0}
                  className={`w-full min-h-[52px] h-[52px] px-6 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#047857] ${
                    tela1TotalItems === 0
                      ? "bg-[#9CA3AF] cursor-not-allowed opacity-75"
                      : "bg-[#047857] hover:bg-[#065F46] active:bg-[#064E3B] cursor-pointer active:scale-[0.99]"
                  }`}
                >
                  <span>Enviar Pedido e Confirmar Pix</span>
                  <ArrowRight
                    className="w-5 h-5 stroke-[2.5]"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Rodapé Fixo no Mobile (<= lg) para acesso imediato com o polegar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E5E7EB] p-4 shadow-2xl space-y-3">
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold text-[#374151]">
                  Total do Pedido:
                </span>
                <span className="text-lg font-extrabold text-[#111827]">
                  {formatBRL(tela1TotalPrice)}{" "}
                  <span className="text-sm font-normal text-[#4B5563]">
                    ({tela1TotalItems}{" "}
                    {tela1TotalItems === 1 ? "item" : "itens"})
                  </span>
                </span>
              </div>

              <button
                type="submit"
                form="order-form-screen1"
                disabled={tela1TotalItems === 0}
                className={`w-full min-h-[52px] h-[52px] px-6 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#047857] ${
                  tela1TotalItems === 0
                    ? "bg-[#9CA3AF] cursor-not-allowed opacity-75"
                    : "bg-[#047857] hover:bg-[#065F46] active:bg-[#064E3B] cursor-pointer active:scale-[0.99]"
                }`}
              >
                <span>Enviar Pedido e Confirmar Pix</span>
                <ArrowRight
                  className="w-5 h-5 stroke-[2.5]"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {/* Modal de Confirmação do Pedido */}
          {showTela1OrderModal && (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-[#111827]">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-[#047857] flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-[#111827]">
                        Pedido Pronto para Envio!
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4B5563]">
                        Conexão Direta via WhatsApp e Pix
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTela1OrderModal(false)}
                    aria-label="Fechar"
                    className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 text-sm space-y-2">
                  <p className="font-bold text-[#111827] border-b border-[#E5E7EB] pb-2">
                    Resumo do Pedido:
                  </p>
                  {menuItems.map((item) => {
                    const qty = tela1Quantities[item.id] || 0;
                    if (qty === 0) return null;
                    return (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-[#374151]">
                          {qty}x {item.name}
                        </span>
                        <span className="font-bold text-[#111827]">
                          {formatBRL(item.price * qty)}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center text-base font-extrabold text-[#111827] pt-2 border-t border-[#E5E7EB]">
                    <span>Total do Pedido:</span>
                    <span className="text-[#047857]">
                      {formatBRL(tela1TotalPrice)}
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs sm:text-sm text-[#065F46] space-y-1">
                  <p className="font-bold text-emerald-950">
                    Destinatário & Entrega:
                  </p>
                  <p>
                    <span className="font-semibold">Cliente:</span>{" "}
                    {tela1FormData.name}
                  </p>
                  <p>
                    <span className="font-semibold">WhatsApp:</span>{" "}
                    {tela1FormData.whatsapp}
                  </p>
                  <p>
                    <span className="font-semibold">Endereço:</span>{" "}
                    {tela1FormData.address}
                  </p>
                  <p className="pt-1 font-bold text-emerald-900">
                    Chave Pix: {pixKey}
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  <a
                    href={`https://wa.me/5511987654321?text=${encodeURIComponent(
                      `Olá Marmitaria Sabor da Vila!\n\n` +
                        `Gostaria de confirmar meu pedido:\n` +
                        menuItems
                          .filter((i) => (tela1Quantities[i.id] || 0) > 0)
                          .map(
                            (i) =>
                              `• ${tela1Quantities[i.id]}x ${i.name} (${formatBRL(i.price * (tela1Quantities[i.id] || 0))})`,
                          )
                          .join("\n") +
                        `\n\nTotal: ${formatBRL(tela1TotalPrice)}\n` +
                        `Nome: ${tela1FormData.name}\n` +
                        `Endereço: ${tela1FormData.address}\n\n` +
                        `Pagamento via Pix para: ${pixKey}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[52px] h-[52px] rounded-xl font-bold text-base text-white bg-[#047857] hover:bg-[#065F46] flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    <span>Confirmar pelo WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setShowTela1OrderModal(false);
                      setActiveScreen("tela2");
                    }}
                    className="w-full min-h-[48px] h-12 rounded-xl font-bold text-sm text-[#111827] bg-[#F3F4F6] border border-[#D1D5DB] hover:bg-[#E5E7EB] transition-colors"
                  >
                    Acompanhar Preparo no Painel da Cozinha (Tela 2)
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* TELA 2 — EXECUÇÃO CENTRAL: PAINEL OPERACIONAL DA COZINHA E ACIONAMENTO SOS */}
      {/* ========================================================================= */}
      {activeScreen === "tela2" && (
        <main
          className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col space-y-6"
          role="region"
          aria-label="Tela 2 — Execução Central: Painel Operacional da Cozinha e Acionamento SOS"
        >
          {/* 1. Barra Superior Autenticada */}
          <header className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 text-[#047857]">
                <ChefHat className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">
                  Visão do MEI • Gestão Operacional
                </p>
                <h1 className="text-base sm:text-xl font-extrabold text-[#111827]">
                  Sra. Helena Souza • Marmitaria Sabor da Vila
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              aria-label="Sair da sessão autenticada"
              className="min-h-[48px] min-w-[48px] px-4 rounded-xl text-sm font-bold text-[#111827] bg-[#F3F4F6] border border-[#D1D5DB] hover:bg-[#E5E7EB] active:bg-[#D1D5DB] flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#111827]"
            >
              <LogOut className="w-4 h-4 text-[#111827]" aria-hidden="true" />
              <span>Sair</span>
            </button>
          </header>

          {/* Notificação toast quando o alerta SOS é emitido */}
          {sosAlertTriggered && (
            <div
              role="status"
              className="bg-red-50 border-2 border-[#B91C1C] rounded-2xl p-4 flex items-center gap-3 text-[#B91C1C] animate-in fade-in"
            >
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <span className="text-sm sm:text-base font-bold">
                Alerta SOS emitido com sucesso! Motoboys autônomos da região
                foram notificados.
              </span>
            </div>
          )}

          {/* Grid Responsivo da Cozinha */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 2. Módulo de Emergência Logística (Destaque) */}
            <section
              aria-labelledby="modulo-sos-heading"
              className="lg:col-span-5 space-y-4"
            >
              <h2
                id="modulo-sos-heading"
                className="text-lg font-bold text-[#111827]"
              >
                Módulo de Emergência Logística
              </h2>

              {/* Botão de alerta de largura total (altura 52px, cor vermelha escura #B91C1C com ícone de sirene/alerta) */}
              <button
                type="button"
                onClick={handleTriggerSOS}
                className="w-full min-h-[52px] h-[52px] rounded-xl font-bold text-base text-white bg-[#B91C1C] hover:bg-[#991B1B] active:bg-[#7F1D1D] flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-red-300"
                aria-label="Acionar SOS Entregador"
              >
                <Siren
                  className="w-6 h-6 stroke-[2.2] animate-pulse"
                  aria-hidden="true"
                />
                <span>Acionar SOS Entregador</span>
              </button>

              {/* Cartão de Chamado SOS Ativo logo abaixo */}
              <div className="bg-white border-2 border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                {/* Badge multimodal (ícone de radar + texto) */}
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-300 text-[#991B1B]"
                  role="status"
                >
                  <Radio
                    className="w-4 h-4 text-[#B91C1C] shrink-0 animate-spin"
                    style={{ animationDuration: "3s" }}
                    aria-hidden="true"
                  />
                  <span className="text-xs sm:text-sm font-extrabold text-[#991B1B]">
                    SOS Ativo • {sosStatus.stage}
                  </span>
                </div>

                {/* Detalhe do Turno e Remuneração */}
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3.5 flex items-start gap-3">
                  <Clock
                    className="w-5 h-5 text-[#111827] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="text-sm leading-snug">
                    <span className="font-bold text-[#111827] block text-base">
                      Diária Almoço (11h às 14h) — Valor: R$ 65,00
                    </span>
                    <span className="text-xs text-[#4B5563]">
                      Acordo direto sem taxa de plataforma intermediária.
                    </span>
                  </div>
                </div>

                {/* Caixa de destaque com borda tracejada escura mostrando a trava de segurança */}
                <div className="border-2 border-dashed border-[#111827] bg-[#FEF3C7] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#92400E] uppercase tracking-wider">
                      <KeyRound className="w-4 h-4 text-[#92400E]" /> Trava de
                      Segurança
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPin}
                      className="text-xs font-bold text-[#111827] underline hover:text-[#047857] flex items-center gap-1"
                      aria-label="Copiar código PIN"
                    >
                      {pinCopied ? "PIN Copiado!" : "Copiar"}
                    </button>
                  </div>

                  <div
                    className="text-2xl sm:text-3xl font-black tracking-widest text-[#111827] font-mono bg-white px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-center shadow-xs"
                    aria-label="Código de liberação no balcão: 4829"
                  >
                    PIN DO BALCÃO: 4829
                  </div>

                  <p className="text-xs font-semibold text-[#111827] text-center pt-0.5">
                    Solicite este código ao motoboy na chegada.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Seção "Fila de Pedidos da Cozinha (2 Ativos)" */}
            <section
              aria-labelledby="fila-pedidos-heading"
              className="lg:col-span-7 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2
                  id="fila-pedidos-heading"
                  className="text-lg font-bold text-[#111827] flex items-center gap-2"
                >
                  <span>Fila de Pedidos da Cozinha (2 Ativos)</span>
                </h2>
                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-[#047857] rounded-md border border-emerald-300">
                  Tempo Real
                </span>
              </div>

              <div className="space-y-4">
                {/* Cartão Pedido #104 (Prioritário) */}
                <article
                  className="bg-white border-2 border-[#111827] rounded-2xl p-4 sm:p-5 shadow-md space-y-3.5 relative overflow-hidden"
                  aria-label="Pedido prioritário número 104"
                >
                  <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#1D4ED8]" />

                  {/* Cabeçalho do Pedido #104 */}
                  <div className="flex items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3 pl-1">
                    <div>
                      <div className="text-base font-extrabold text-[#111827]">
                        Pedido #104 • 12:14
                      </div>
                      <span className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wide">
                        Prioritário
                      </span>
                    </div>

                    {/* Badge multimodal verde (ícone de check + texto): "Pix Confirmado" */}
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#047857]"
                      role="status"
                    >
                      <CheckCircle2
                        className="w-4 h-4 text-[#047857] stroke-[2.5]"
                        aria-hidden="true"
                      />
                      <span className="text-xs sm:text-sm font-bold text-[#047857]">
                        Pix Confirmado
                      </span>
                    </div>
                  </div>

                  {/* Cliente e Local */}
                  <div className="text-sm pl-1 space-y-0.5">
                    <p className="font-extrabold text-[#111827] text-base">
                      Carlos Mendes • Rua das Acácias, 142 - Vila Nova
                    </p>
                  </div>

                  {/* Itens */}
                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3.5 pl-4 space-y-1">
                    <p className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                      Itens do Pedido:
                    </p>
                    <p className="text-base font-bold text-[#111827]">
                      2x Marmita Executivo Frango Grelhado (R$ 36,00)
                    </p>
                  </div>

                  {/* Botão de ação única largura total (altura 48px, azul escuro #1D4ED8): "Iniciar Preparo" */}
                  <button
                    type="button"
                    onClick={() => {
                      if (order104Status === "preparar")
                        setOrder104Status("em_preparo");
                      else if (order104Status === "em_preparo")
                        setOrder104Status("pronto");
                      else setOrder104Status("preparar");
                    }}
                    className="w-full min-h-[48px] h-12 rounded-xl font-bold text-base text-white bg-[#1D4ED8] hover:bg-[#1E40AF] active:bg-[#1E3A8A] flex items-center justify-center gap-2 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D4ED8]"
                  >
                    {order104Status === "preparar" && (
                      <>
                        <Flame
                          className="w-5 h-5 text-white"
                          aria-hidden="true"
                        />
                        <span>Iniciar Preparo</span>
                      </>
                    )}
                    {order104Status === "em_preparo" && (
                      <>
                        <ChefHat
                          className="w-5 h-5 text-white"
                          aria-hidden="true"
                        />
                        <span>Em Preparo (Clique para Concluir)</span>
                      </>
                    )}
                    {order104Status === "pronto" && (
                      <>
                        <CheckCheck
                          className="w-5 h-5 text-white"
                          aria-hidden="true"
                        />
                        <span>Pronto para Retirada</span>
                      </>
                    )}
                  </button>
                </article>

                {/* Cartão Pedido #105 */}
                <article
                  className="bg-white border border-[#D1D5DB] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 relative overflow-hidden"
                  aria-label="Pedido número 105"
                >
                  <div
                    className={`absolute top-0 left-0 bottom-0 w-2 ${
                      order105Status === "aguardando"
                        ? "bg-[#B45309]"
                        : "bg-[#047857]"
                    }`}
                  />

                  {/* Cabeçalho do Pedido #105 */}
                  <div className="flex items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3 pl-1">
                    <div className="text-base font-extrabold text-[#111827]">
                      Pedido #105 • 12:18
                    </div>

                    {order105Status === "aguardando" ? (
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-[#92400E]"
                        role="status"
                      >
                        <Clock
                          className="w-4 h-4 text-[#B45309] stroke-[2.5]"
                          aria-hidden="true"
                        />
                        <span className="text-xs sm:text-sm font-bold text-[#92400E]">
                          Aguardando Pix
                        </span>
                      </div>
                    ) : (
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#047857]"
                        role="status"
                      >
                        <CheckCircle2
                          className="w-4 h-4 text-[#047857] stroke-[2.5]"
                          aria-hidden="true"
                        />
                        <span className="text-xs sm:text-sm font-bold text-[#047857]">
                          Pix Confirmado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Cliente e Local */}
                  <div className="text-sm pl-1 space-y-0.5">
                    <p className="font-extrabold text-[#111827] text-base">
                      Mariana Costa • Av. Central, 89 - Vila Nova
                    </p>
                  </div>

                  {/* Itens */}
                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3.5 pl-4 space-y-1">
                    <p className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                      Itens do Pedido:
                    </p>
                    <p className="text-base font-bold text-[#111827]">
                      1x Marmita Feijoada Completa (R$ 22,00)
                    </p>
                  </div>

                  {/* Botão de ação única largura total (altura 48px, verde escuro #047857): "Confirmar Pix Recebido" */}
                  {order105Status === "aguardando" ? (
                    <button
                      type="button"
                      onClick={() => setOrder105Status("confirmado")}
                      className="w-full min-h-[48px] h-12 rounded-xl font-bold text-base text-white bg-[#047857] hover:bg-[#065F46] active:bg-[#064E3B] flex items-center justify-center gap-2 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#047857]"
                    >
                      <Check
                        className="w-5 h-5 text-white stroke-[2.5]"
                        aria-hidden="true"
                      />
                      <span>Confirmar Pix Recebido</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOrder105Status("em_preparo")}
                      className="w-full min-h-[48px] h-12 rounded-xl font-bold text-base text-white bg-[#1D4ED8] hover:bg-[#1E40AF] active:bg-[#1E3A8A] flex items-center justify-center gap-2 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D4ED8]"
                    >
                      <Flame
                        className="w-5 h-5 text-white"
                        aria-hidden="true"
                      />
                      <span>Iniciar Preparo</span>
                    </button>
                  )}
                </article>
              </div>
            </section>
          </div>

          {/* Modal Logout Cozinha */}
          {showLogoutModal && (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 text-[#111827]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-[#111827]" />
                  </div>
                  <h3 className="text-lg font-bold">
                    Encerrar Sessão da Cozinha?
                  </h3>
                </div>
                <p className="text-sm text-[#4B5563]">
                  Sra. Helena Souza, você tem 2 pedidos ativos na fila e o SOS
                  Entregador ativo.
                </p>
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 min-h-[48px] rounded-xl font-bold text-sm bg-[#F3F4F6] text-[#111827] border border-[#D1D5DB]"
                  >
                    Permanecer Conectada
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLogoutModal(false);
                      setActiveScreen("tela1");
                    }}
                    className="flex-1 min-h-[48px] rounded-xl font-bold text-sm bg-[#B91C1C] text-white"
                  >
                    Sair do Painel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* TELA 3 — ALERTAS E RESULTADOS: MURAL TURNOS/SOS E VALIDAÇÃO PIN            */}
      {/* ========================================================================= */}
      {activeScreen === "tela3" && (
        <main
          className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col space-y-6 text-[#09090B]"
          role="region"
          aria-label="Tela 3 — Alertas e Resultados: Mural de Turnos/SOS e Validação Presencial por PIN"
        >
          {/* 1. Cabeçalho do Entregador */}
          <header className="bg-white border-2 border-[#09090B] rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#09090B] text-white flex items-center justify-center shrink-0 border-2 border-[#09090B]">
                <Bike className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div className="leading-tight">
                <h1 className="text-base sm:text-lg font-black text-[#09090B] tracking-tight">
                  Rafael Oliveira • Motoboy Local
                </h1>
                {/* Badge multimodal de reputação (ícone de escudo + texto): "0 Strikes • Conta Ativa" */}
                <div
                  className="inline-flex items-center gap-1.5 mt-0.5 px-3 py-0.5 rounded-full bg-emerald-100 border border-emerald-500 text-[#065F46]"
                  role="status"
                >
                  <Shield
                    className="w-3.5 h-3.5 text-[#047857] stroke-[2.5]"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-black text-[#047857]">
                    0 Strikes • Conta Ativa
                  </span>
                </div>
              </div>
            </div>

            {/* Botão "Sair" (altura mínima 48px) */}
            <button
              type="button"
              onClick={() => setShowLogoutModalEntregador(true)}
              aria-label="Sair da conta de entregador"
              className="min-h-[48px] min-w-[48px] px-4 rounded-xl text-sm font-bold text-[#09090B] bg-[#F3F4F6] border-2 border-[#09090B] hover:bg-[#E5E7EB] active:bg-[#D1D5DB] flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#09090B]"
            >
              <LogOut className="w-4 h-4 text-[#09090B]" aria-hidden="true" />
              <span>Sair</span>
            </button>
          </header>

          {/* Grid Responsivo para Leitura Clara Sob Luz Solar Direta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Coluna 1: Alerta SOS Aceito + Trava de Segurança por PIN */}
            <div className="space-y-6">
              {/* 2. Cartão de Alerta SOS Aceito (Topo) */}
              <section
                aria-labelledby="sos-aceito-heading"
                className="bg-white border-2 border-[#B91C1C] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5"
              >
                <h2 id="sos-aceito-heading" className="sr-only">
                  Cartão de Alerta SOS Aceito
                </h2>

                {/* Badge multimodal laranja/vermelho escuro (ícone de sirene + texto): "Chamado SOS Local • 1,8 km de você" */}
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border-2 border-[#B91C1C] text-[#991B1B]"
                  role="status"
                >
                  <Siren
                    className="w-4 h-4 text-[#B91C1C] stroke-[2.5] animate-pulse"
                    aria-hidden="true"
                  />
                  <span className="text-xs sm:text-sm font-black text-[#991B1B]">
                    Chamado SOS Local • 1,8 km de você
                  </span>
                </div>

                {/* Estabelecimento & Endereço */}
                <div className="space-y-1 pt-1 border-t border-[#E5E7EB]">
                  <p className="text-lg font-black text-[#09090B] leading-tight">
                    Marmitaria Sabor da Vila
                  </p>
                  <p className="text-sm font-bold text-[#374151] flex items-center gap-1.5">
                    <MapPin
                      className="w-4 h-4 text-[#B91C1C] shrink-0"
                      aria-hidden="true"
                    />
                    <span>Rua das Palmeiras, 310 - Vila Nova</span>
                  </p>
                </div>

                {/* Valor transparente com regra 50/50 */}
                <div className="bg-[#FEF2F2] border-2 border-red-200 rounded-xl p-3.5">
                  <span className="text-xs font-extrabold text-[#991B1B] uppercase tracking-wider block mb-0.5">
                    Remuneração Garantida
                  </span>
                  <p className="text-base font-black text-[#09090B] leading-snug">
                    Diária: R$ 65,00 (Regra 50/50: R$ 32,50 na chegada + R$
                    32,50 no fim)
                  </p>
                </div>
              </section>

              {/* 3. Seção de Trava de Segurança Presencial (Validação por PIN) */}
              <section
                aria-labelledby="pin-val-heading"
                className="bg-white border-2 border-[#09090B] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5"
              >
                <h2 id="pin-val-heading" className="sr-only">
                  Trava de Segurança Presencial
                </h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  className="space-y-3.5"
                >
                  {/* Label persistente em negrito */}
                  <label
                    htmlFor="pin-input"
                    className="block text-base font-extrabold text-[#09090B] leading-snug"
                  >
                    Digite o PIN de 4 dígitos informado no balcão *
                  </label>

                  {/* Campo numérico grande centralizado com dígitos de 24px espaçados, preenchido com: "4829" */}
                  <div>
                    <input
                      id="pin-input"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      required
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="w-full min-h-[56px] h-14 bg-[#F3F4F6] border-2 border-[#09090B] rounded-xl text-center font-mono text-[24px] font-black tracking-[0.4em] text-[#09090B] focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all select-all"
                      aria-label="Código PIN de 4 dígitos"
                    />
                  </div>

                  {/* Botão primário largura total (altura 52px, verde escuro #047857 com ícone de cadeado aberto): "Validar PIN e Iniciar Turno" */}
                  <button
                    type="submit"
                    className="w-full min-h-[52px] h-[52px] rounded-xl font-black text-base text-white bg-[#047857] hover:bg-[#065F46] active:bg-[#064E3B] flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-emerald-300"
                  >
                    <LockOpen
                      className="w-5 h-5 text-white stroke-[2.5]"
                      aria-hidden="true"
                    />
                    <span>Validar PIN e Iniciar Turno</span>
                  </button>
                </form>
              </section>
            </div>

            {/* Coluna 2: Painel de Resultados e Acompanhamento */}
            <div className="space-y-6">
              <section
                aria-labelledby="status-operacao-heading"
                className="bg-white border-2 border-[#09090B] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b-2 border-[#E5E7EB] pb-3">
                  <h2
                    id="status-operacao-heading"
                    className="text-lg font-black text-[#09090B]"
                  >
                    Status Atual da Operação
                  </h2>
                  <span className="w-3 h-3 rounded-full bg-[#047857] animate-ping" />
                </div>

                {/* Badge multimodal verde (ícone de verificação + texto): "Turno em Andamento • Presença Confirmada" */}
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-100 border-2 border-emerald-600 text-[#065F46] w-full"
                  role="status"
                >
                  <CheckCircle2
                    className="w-5 h-5 text-[#047857] stroke-[2.5] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-xs sm:text-sm font-black text-[#047857]">
                    Turno em Andamento • Presença Confirmada
                  </span>
                </div>

                {/* Indicador Financeiro */}
                <div className="bg-[#F3F4F6] border-2 border-[#D1D5DB] rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#047857] uppercase tracking-wider">
                    <Banknote className="w-4 h-4 text-[#047857]" />
                    <span>Pagamento Instantâneo MEI</span>
                  </div>
                  <p className="text-base font-black text-[#09090B] leading-snug">
                    1ª Parcela Pix (50% — R$ 32,50) Liberada
                  </p>
                  <p className="text-xs font-bold text-[#374151]">
                    Chave Pix cadastrada:{" "}
                    <span className="font-mono text-[#09090B]">
                      rafael.entregas@exemplo.com
                    </span>
                  </p>
                </div>

                {/* Indicador de Produtividade em destaque */}
                <div className="bg-white border-2 border-[#09090B] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#09090B] text-white flex items-center justify-center font-bold">
                      <PackageCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-base font-black text-[#09090B]">
                        Entregas Realizadas neste Turno: {deliveryCount}
                      </p>
                      <p className="text-xs font-bold text-[#4B5563]">
                        Média de 18 min por entrega
                      </p>
                    </div>
                  </div>
                  {/* Botão de incremento rápido */}
                  <button
                    type="button"
                    onClick={() => setDeliveryCount((prev) => prev + 1)}
                    aria-label="Registrar entrega concluída"
                    className="min-h-[48px] min-w-[48px] px-3.5 bg-[#F3F4F6] border-2 border-[#09090B] rounded-xl font-black text-sm text-[#09090B] hover:bg-[#E5E7EB] active:scale-95 transition-all"
                  >
                    +1
                  </button>
                </div>

                {/* Botão secundário largura total (altura 48px, borda escura): "Encerrar Turno e Solicitar 2ª Parcela" */}
                <button
                  type="button"
                  onClick={() => setShowEndShiftModal(true)}
                  className="w-full min-h-[48px] h-12 rounded-xl font-black text-base text-[#09090B] bg-white border-2 border-[#09090B] hover:bg-[#F3F4F6] active:bg-[#E5E7EB] flex items-center justify-center gap-2 shadow-xs transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  <CheckSquare2
                    className="w-5 h-5 text-[#09090B]"
                    aria-hidden="true"
                  />
                  <span>Encerrar Turno e Solicitar 2ª Parcela</span>
                </button>
              </section>
            </div>
          </div>

          {/* Modal de Encerramento de Turno */}
          {showEndShiftModal && (
            <div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-full max-w-md bg-white rounded-3xl border-2 border-[#09090B] p-6 shadow-2xl space-y-4 text-[#09090B]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#047857]">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black">
                    Encerrar Turno & Liberação Pix
                  </h3>
                </div>
                <div className="bg-[#F3F4F6] border-2 border-[#D1D5DB] rounded-xl p-3.5 text-sm space-y-1.5">
                  <p className="font-black text-base">
                    Total do Turno: R$ 65,00
                  </p>
                  <p className="text-xs text-[#047857] font-black">
                    1ª Parcela paga: R$ 32,50 (Paga na validação do PIN)
                  </p>
                  <p className="text-xs text-[#09090B] font-black">
                    2ª Parcela a liberar: R$ 32,50 (Saldo Final)
                  </p>
                  <p className="text-xs text-[#4B5563] pt-1">
                    Total de entregas finalizadas: {deliveryCount}
                  </p>
                </div>
                <p className="text-xs font-bold text-[#374151]">
                  O valor de R$ 32,50 será transferido diretamente para a chave
                  Pix <strong>rafael.entregas@exemplo.com</strong> pela Sra.
                  Helena Souza.
                </p>
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEndShiftModal(false)}
                    className="flex-1 min-h-[48px] rounded-xl font-bold text-sm bg-[#F3F4F6] text-[#09090B] border-2 border-[#09090B]"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEndShiftModal(false);
                    }}
                    className="flex-1 min-h-[48px] rounded-xl font-black text-sm bg-[#047857] text-white"
                  >
                    Confirmar Encerramento
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Logout Entregador */}
          {showLogoutModalEntregador && (
            <div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-full max-w-md bg-white rounded-3xl border-2 border-[#09090B] p-6 shadow-2xl space-y-4 text-[#09090B]">
                <div className="flex items-center gap-3">
                  <LogOut className="w-6 h-6 text-[#09090B]" />
                  <h3 className="text-lg font-black">
                    Sair da Sessão do Motoboy?
                  </h3>
                </div>
                <p className="text-sm font-bold text-[#374151]">
                  Rafael Oliveira, seu turno está com a presença confirmada na
                  Marmitaria Sabor da Vila.
                </p>
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogoutModalEntregador(false)}
                    className="flex-1 min-h-[48px] rounded-xl font-bold text-sm bg-[#F3F4F6] text-[#09090B] border-2 border-[#09090B]"
                  >
                    Continuar no Turno
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLogoutModalEntregador(false);
                      setActiveScreen("tela1");
                    }}
                    className="flex-1 min-h-[48px] rounded-xl font-black text-sm bg-[#B91C1C] text-white"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
