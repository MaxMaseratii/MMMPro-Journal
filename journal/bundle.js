const {
  useState,
  useEffect
} = React;

// Hardened Icon component: if a Lucide icon name doesn't exist or errors,
// this catches it and renders nothing for that icon instead of crashing
// the whole app (which is what "page goes black" was caused by).
const Icon = ({
  name,
  className
}) => {
  const ref = React.useRef(null);
  useEffect(function () {
    if (!ref.current) return;
    try {
      ref.current.innerHTML = '';
      const iconFn = lucide[name] || lucide['HelpCircle'];
      if (!iconFn) return;
      const svg = lucide.createElement(iconFn);
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.style.display = 'block';
      ref.current.appendChild(svg);
    } catch (err) {
      console.error('Icon render failed for name:', name, err);
    }
  }, [name]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: "inline-flex items-center justify-center flex-shrink-0 " + (className || '')
  });
};

// Single source of truth for a trade's signed P&L - every place that sums
// trades (calendar, Total P&L, buffer/drawdown, reports, consistency) calls
// this instead of repeating the abs()+sign-flip logic inline, so those can
// never silently drift apart from each other.
const tradeSignedPnl = function (t) {
  const v = Math.abs(parseFloat(t.pnl) || 0);
  return t.result === 'win' ? v : -v;
};
const fmt = function (n) {
  if (n === null || n === undefined || isNaN(n)) return '$0.00';
  const sign = n < 0 ? '-' : '';
  return sign + "$" + Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
const VIEW_MODES = [{
  key: 'dollars',
  label: 'Dollars'
}, {
  key: 'percent',
  label: 'Percentage'
}, {
  key: 'rmultiple',
  label: 'R-Multiple'
}, {
  key: 'points',
  label: 'Points'
}, {
  key: 'privacy',
  label: 'Privacy'
}];

// Renders the same underlying $ amount through whichever lens the person has
// selected, without needing separate calculations stored anywhere - context
// carries the account's current risk-per-trade, buffer, and point value so
// Percentage/R-Multiple/Points stay meaningful even as those numbers change.
const fmtView = function (amount, viewMode, context) {
  if (amount === null || amount === undefined || isNaN(amount)) amount = 0;
  const ctx = context || {};
  if (viewMode === 'privacy') return amount >= 0 ? '••••' : '-••••';
  if (viewMode === 'percent') {
    const base = ctx.buffer;
    if (!base) return '-';
    return (amount >= 0 ? '+' : '') + (amount / base * 100).toFixed(1) + '%';
  }
  if (viewMode === 'rmultiple') {
    const risk = ctx.risk;
    if (!risk) return '-';
    return (amount >= 0 ? '+' : '') + (amount / risk).toFixed(2) + 'R';
  }
  if (viewMode === 'points') {
    const pt = ctx.pointValue;
    if (!pt) return '-';
    return (amount >= 0 ? '+' : '') + (amount / pt).toFixed(1) + ' pts';
  }
  return fmt(amount);
};

// ---------------------------------------------------------------------
// TRANSLATIONS - keyed by the exact English string as it appears on screen.
// The translator (below) walks the live page and swaps matched text/placeholder
// values, so most of the app's visible copy stays translatable without every
// JSX string needing to be rewritten as a lookup call.
// ---------------------------------------------------------------------
const LANGUAGES = [{
  code: 'en',
  label: 'English'
}, {
  code: 'fr',
  label: 'Français'
}, {
  code: 'es',
  label: 'Español'
}, {
  code: 'ht',
  label: 'Kreyòl Ayisyen'
}, {
  code: 'ja',
  label: '日本語'
}, {
  code: 'zh',
  label: '中文'
}, {
  code: 'de',
  label: 'Deutsch'
}, {
  code: 'pt',
  label: 'Português'
}];
const TRANSLATIONS = {
  "MMM Pro Journal": {
    fr: "Journal MMM Pro",
    es: "Diario MMM Pro",
    ht: "Jounal MMM Pro",
    pt: "Diário MMM Pro",
    de: "MMM Pro Journal",
    ja: "MMMプロジャーナル",
    zh: "MMM专业交易日志"
  },
  "Sign in to your account": {
    fr: "Connectez-vous à votre compte",
    es: "Inicia sesión en tu cuenta",
    ht: "Konekte sou kont ou",
    pt: "Entre na sua conta",
    de: "In dein Konto einloggen",
    ja: "アカウントにサインイン",
    zh: "登录您的账户"
  },
  "Create your account": {
    fr: "Créez votre compte",
    es: "Crea tu cuenta",
    ht: "Kreye kont ou",
    pt: "Crie sua conta",
    de: "Konto erstellen",
    ja: "アカウントを作成",
    zh: "创建您的账户"
  },
  "Your name": {
    fr: "Votre nom",
    es: "Tu nombre",
    ht: "Non ou",
    pt: "Seu nome",
    de: "Dein Name",
    ja: "お名前",
    zh: "您的姓名"
  },
  "Email": {
    fr: "E-mail",
    es: "Correo electrónico",
    ht: "Imel",
    pt: "E-mail",
    de: "E-Mail",
    ja: "メール",
    zh: "电子邮箱"
  },
  "Password": {
    fr: "Mot de passe",
    es: "Contraseña",
    ht: "Modpas",
    pt: "Senha",
    de: "Passwort",
    ja: "パスワード",
    zh: "密码"
  },
  "Sign In": {
    fr: "Se connecter",
    es: "Iniciar sesión",
    ht: "Konekte",
    pt: "Entrar",
    de: "Anmelden",
    ja: "サインイン",
    zh: "登录"
  },
  "Create Account": {
    fr: "Créer un compte",
    es: "Crear cuenta",
    ht: "Kreye kont",
    pt: "Criar conta",
    de: "Konto erstellen",
    ja: "アカウント作成",
    zh: "创建账户"
  },
  "Please wait...": {
    fr: "Veuillez patienter...",
    es: "Espera por favor...",
    ht: "Tanpri tann...",
    pt: "Aguarde...",
    de: "Bitte warten...",
    ja: "お待ちください...",
    zh: "请稍候..."
  },
  "Sign up": {
    fr: "S'inscrire",
    es: "Regístrate",
    ht: "Enskri",
    pt: "Cadastre-se",
    de: "Registrieren",
    ja: "新規登録",
    zh: "注册"
  },
  "Sign in": {
    fr: "Se connecter",
    es: "Inicia sesión",
    ht: "Konekte",
    pt: "Entrar",
    de: "Anmelden",
    ja: "サインイン",
    zh: "登录"
  },
  "Don't have an account?": {
    fr: "Vous n'avez pas de compte ?",
    es: "¿No tienes una cuenta?",
    ht: "Ou pa gen kont?",
    pt: "Não tem uma conta?",
    de: "Noch kein Konto?",
    ja: "アカウントをお持ちでないですか？",
    zh: "还没有账户？"
  },
  "Already have an account?": {
    fr: "Vous avez déjà un compte ?",
    es: "¿Ya tienes una cuenta?",
    ht: "Ou gen kont deja?",
    pt: "Já tem uma conta?",
    de: "Bereits ein Konto?",
    ja: "すでにアカウントをお持ちですか？",
    zh: "已经有账户了？"
  },
  "Forgot password?": {
    fr: "Mot de passe oublié ?",
    es: "¿Olvidaste tu contraseña?",
    ht: "Ou bliye modpas ou?",
    pt: "Esqueceu a senha?",
    de: "Passwort vergessen?",
    ja: "パスワードをお忘れですか？",
    zh: "忘记密码？"
  },
  "Sign out": {
    fr: "Se déconnecter",
    es: "Cerrar sesión",
    ht: "Dekonekte",
    pt: "Sair",
    de: "Abmelden",
    ja: "サインアウト",
    zh: "退出登录"
  },
  "Loading...": {
    fr: "Chargement...",
    es: "Cargando...",
    ht: "Ap chaje...",
    pt: "Carregando...",
    de: "Wird geladen...",
    ja: "読み込み中...",
    zh: "加载中..."
  },
  "Edit display name": {
    fr: "Modifier le nom affiché",
    es: "Editar nombre visible",
    ht: "Chanje non ki afiche",
    pt: "Editar nome de exibição",
    de: "Anzeigename bearbeiten",
    ja: "表示名を編集",
    zh: "编辑显示名称"
  },
  "Active Only": {
    fr: "Actifs uniquement",
    es: "Solo activos",
    ht: "Sèlman aktif",
    pt: "Somente ativos",
    de: "Nur aktive",
    ja: "アクティブのみ",
    zh: "仅活跃账户"
  },
  "All Accounts": {
    fr: "Tous les comptes",
    es: "Todas las cuentas",
    ht: "Tout kont",
    pt: "Todas as contas",
    de: "Alle Konten",
    ja: "すべてのアカウント",
    zh: "所有账户"
  },
  "Add Account": {
    fr: "Ajouter un compte",
    es: "Agregar cuenta",
    ht: "Ajoute yon kont",
    pt: "Adicionar conta",
    de: "Konto hinzufügen",
    ja: "アカウントを追加",
    zh: "添加账户"
  },
  "Daily Log": {
    fr: "Journal quotidien",
    es: "Registro diario",
    ht: "Jounal chak jou",
    pt: "Registro diário",
    de: "Tageseintrag",
    ja: "デイリーログ",
    zh: "每日记录"
  },
  "Export CSV": {
    fr: "Exporter CSV",
    es: "Exportar CSV",
    ht: "Ekspòte CSV",
    pt: "Exportar CSV",
    de: "CSV exportieren",
    ja: "CSVをエクスポート",
    zh: "导出CSV"
  },
  "Start: ": {
    fr: "Début : ",
    es: "Inicio: ",
    ht: "Kòmansman: ",
    pt: "Início: ",
    de: "Start: ",
    ja: "開始: ",
    zh: "开始: "
  },
  "Target: ": {
    fr: "Objectif : ",
    es: "Objetivo: ",
    ht: "Objektif: ",
    pt: "Meta: ",
    de: "Ziel: ",
    ja: "目標: ",
    zh: "目标: "
  },
  "Active Strategy": {
    fr: "Stratégie active",
    es: "Estrategia activa",
    ht: "Estrateji aktif",
    pt: "Estratégia ativa",
    de: "Aktive Strategie",
    ja: "アクティブ戦略",
    zh: "当前策略"
  },
  "Current Capital (Buffer)": {
    fr: "Capital actuel (tampon)",
    es: "Capital actual (colchón)",
    ht: "Kapital aktyèl (tanpon)",
    pt: "Capital atual (buffer)",
    de: "Aktuelles Kapital (Puffer)",
    ja: "現在の資金（バッファー）",
    zh: "当前资金（缓冲）"
  },
  "Risk Per Trade": {
    fr: "Risque par transaction",
    es: "Riesgo por operación",
    ht: "Risk pou chak tranzaksyon",
    pt: "Risco por operação",
    de: "Risiko pro Trade",
    ja: "1取引あたりのリスク",
    zh: "每笔交易风险"
  },
  "Total P&L": {
    fr: "P&L total",
    es: "P&L total",
    ht: "P&L total",
    pt: "P&L total",
    de: "Gesamt-P&L",
    ja: "合計損益",
    zh: "总盈亏"
  },
  "Win Rate": {
    fr: "Taux de réussite",
    es: "Tasa de victorias",
    ht: "Pousantaj viktwa",
    pt: "Taxa de acerto",
    de: "Trefferquote",
    ja: "勝率",
    zh: "胜率"
  },
  "Contracts Unlocked": {
    fr: "Contrats débloqués",
    es: "Contratos desbloqueados",
    ht: "Kontra ki debloke",
    pt: "Contratos desbloqueados",
    de: "Freigeschaltete Kontrakte",
    ja: "解放された契約数",
    zh: "已解锁合约数"
  },
  "Risk / Trade": {
    fr: "Risque / transaction",
    es: "Riesgo / operación",
    ht: "Risk / Tranzaksyon",
    pt: "Risco / Operação",
    de: "Risiko / Trade",
    ja: "リスク / 取引",
    zh: "风险 / 交易"
  },
  "Locked Max Stop": {
    fr: "Stop max verrouillé",
    es: "Stop máximo fijo",
    ht: "Estòp maksimòm fikse",
    pt: "Stop máximo fixo",
    de: "Fixiertes Max-Stop",
    ja: "固定最大ストップ",
    zh: "锁定最大止损"
  },
  "Daily Target (2 wins)": {
    fr: "Objectif quotidien (2 gains)",
    es: "Meta diaria (2 ganancias)",
    ht: "Objektif chak jou (2 viktwa)",
    pt: "Meta diária (2 ganhos)",
    de: "Tagesziel (2 Gewinne)",
    ja: "デイリー目標（2勝）",
    zh: "每日目标（2次获胜）"
  },
  "Consistency Required": {
    fr: "Cohérence requise",
    es: "Consistencia requerida",
    ht: "Konsistans obligatwa",
    pt: "Consistência exigida",
    de: "Erforderliche Konsistenz",
    ja: "必要な一貫性",
    zh: "所需一致性"
  },
  "Max Profit Allowed / Day": {
    fr: "Profit max autorisé / jour",
    es: "Ganancia máxima permitida / día",
    ht: "Pwofi maksimòm otorize / jou",
    pt: "Lucro máximo permitido / dia",
    de: "Max. erlaubter Gewinn / Tag",
    ja: "1日あたりの最大許容利益",
    zh: "每日最大允许利润"
  },
  "Daily Loss Limit": {
    fr: "Limite de perte quotidienne",
    es: "Límite de pérdida diaria",
    ht: "Limit pèt chak jou",
    pt: "Limite de perda diária",
    de: "Tägliches Verlustlimit",
    ja: "デイリー損失上限",
    zh: "每日亏损限额"
  },
  "DLL Type": {
    fr: "Type de LPQ",
    es: "Tipo de LPD",
    ht: "Tip LPJ",
    pt: "Tipo de LPD",
    de: "DLL-Typ",
    ja: "DLLタイプ",
    zh: "DLL类型"
  },
  "Win / Trade": {
    fr: "Gain / transaction",
    es: "Ganancia / operación",
    ht: "Genyen / Tranzaksyon",
    pt: "Ganho / Operação",
    de: "Gewinn / Trade",
    ja: "勝ち / 取引",
    zh: "盈利 / 交易"
  },
  "RR Ratio": {
    fr: "Ratio R/R",
    es: "Ratio R/R",
    ht: "Rapò R/R",
    pt: "Relação R/R",
    de: "CRV-Verhältnis",
    ja: "RR比率",
    zh: "盈亏比"
  },
  "Breakeven Win Rate": {
    fr: "Taux de réussite d'équilibre",
    es: "Tasa de equilibrio",
    ht: "Pousantaj balans",
    pt: "Taxa de acerto de equilíbrio",
    de: "Breakeven-Trefferquote",
    ja: "損益分岐勝率",
    zh: "盈亏平衡胜率"
  },
  "Wins to Hit Target": {
    fr: "Gains pour atteindre l'objectif",
    es: "Ganancias para llegar a la meta",
    ht: "Viktwa pou rive nan objektif",
    pt: "Ganhos para atingir a meta",
    de: "Gewinne bis zum Ziel",
    ja: "目標達成に必要な勝ち数",
    zh: "达到目标所需胜场数"
  },
  "Avg Trades Taken / Day": {
    fr: "Moy. transactions / jour",
    es: "Prom. operaciones / día",
    ht: "Mwayèn tranzaksyon / jou",
    pt: "Média de operações / dia",
    de: "Ø Trades / Tag",
    ja: "1日あたりの平均取引数",
    zh: "每日平均交易数"
  },
  "Most Trades Taken (Day)": {
    fr: "Max de transactions (jour)",
    es: "Máx. operaciones (día)",
    ht: "Pi plis tranzaksyon (jou)",
    pt: "Máx. de operações (dia)",
    de: "Meiste Trades (Tag)",
    ja: "1日の最多取引数",
    zh: "单日最多交易数"
  },
  "Remaining to Target": {
    fr: "Restant pour l'objectif",
    es: "Restante para la meta",
    ht: "Rès pou rive nan objektif",
    pt: "Restante para a meta",
    de: "Verbleibend bis zum Ziel",
    ja: "目標までの残り",
    zh: "距目标还差"
  },
  "Capital (Buffer)": {
    fr: "Capital (tampon)",
    es: "Capital (colchón)",
    ht: "Kapital (tanpon)",
    pt: "Capital (buffer)",
    de: "Kapital (Puffer)",
    ja: "資金（バッファー）",
    zh: "资金（缓冲）"
  },
  "Costs": {
    fr: "Coûts",
    es: "Costos",
    ht: "Depans",
    pt: "Custos",
    de: "Kosten",
    ja: "コスト",
    zh: "成本"
  },
  "Total Costs": {
    fr: "Coûts totaux",
    es: "Costos totales",
    ht: "Total depans",
    pt: "Custos totais",
    de: "Gesamtkosten",
    ja: "合計コスト",
    zh: "总成本"
  },
  "Total Payouts": {
    fr: "Paiements totaux",
    es: "Pagos totales",
    ht: "Total peman",
    pt: "Total de pagamentos",
    de: "Gesamtauszahlungen",
    ja: "合計出金",
    zh: "总支出"
  },
  "Net Profitability": {
    fr: "Rentabilité nette",
    es: "Rentabilidad neta",
    ht: "Pwofitabilite nèt",
    pt: "Rentabilidade líquida",
    de: "Nettorentabilität",
    ja: "純利益率",
    zh: "净盈利能力"
  },
  "Payout Ledger": {
    fr: "Registre des paiements",
    es: "Registro de pagos",
    ht: "Rejis peman",
    pt: "Registro de pagamentos",
    de: "Auszahlungsübersicht",
    ja: "出金台帳",
    zh: "支出记录"
  },
  "Add Payout": {
    fr: "Ajouter un paiement",
    es: "Agregar pago",
    ht: "Ajoute peman",
    pt: "Adicionar pagamento",
    de: "Auszahlung hinzufügen",
    ja: "出金を追加",
    zh: "添加支出记录"
  },
  "No payouts recorded yet.": {
    fr: "Aucun paiement enregistré pour l'instant.",
    es: "Aún no hay pagos registrados.",
    ht: "Poko gen okenn peman ki anrejistre.",
    pt: "Nenhum pagamento registrado ainda.",
    de: "Noch keine Auszahlungen erfasst.",
    ja: "まだ出金の記録がありません。",
    zh: "尚未记录任何支出。"
  },
  "Per-Account Breakdown": {
    fr: "Répartition par compte",
    es: "Desglose por cuenta",
    ht: "Detay pa kont",
    pt: "Detalhamento por conta",
    de: "Aufschlüsselung nach Konto",
    ja: "アカウント別内訳",
    zh: "按账户明细"
  },
  "No accounts yet.": {
    fr: "Aucun compte pour l'instant.",
    es: "Aún no hay cuentas.",
    ht: "Poko gen kont.",
    pt: "Nenhuma conta ainda.",
    de: "Noch keine Konten.",
    ja: "まだアカウントがありません。",
    zh: "暂无账户。"
  },
  "No accounts yet. Add one to start tracking your buffer.": {
    fr: "Aucun compte pour l'instant. Ajoutez-en un pour suivre votre tampon.",
    es: "Aún no hay cuentas. Agrega una para empezar a seguir tu colchón.",
    ht: "Poko gen kont. Ajoute youn pou kòmanse swiv tanpon ou.",
    pt: "Nenhuma conta ainda. Adicione uma para começar a acompanhar seu buffer.",
    de: "Noch keine Konten. Füge eines hinzu, um deinen Puffer zu verfolgen.",
    ja: "まだアカウントがありません。追加してバッファーの追跡を始めましょう。",
    zh: "暂无账户。添加一个账户开始追踪您的缓冲。"
  },
  "Performance Overview": {
    fr: "Aperçu des performances",
    es: "Resumen de rendimiento",
    ht: "Apèsi pèfòmans",
    pt: "Visão geral de desempenho",
    de: "Leistungsübersicht",
    ja: "パフォーマンス概要",
    zh: "业绩概览"
  },
  "All Accounts, Combined": {
    fr: "Tous les comptes, combinés",
    es: "Todas las cuentas, combinadas",
    ht: "Tout kont, konbine",
    pt: "Todas as contas, combinadas",
    de: "Alle Konten, kombiniert",
    ja: "全アカウント合算",
    zh: "所有账户合计"
  },
  "Rule Adherence": {
    fr: "Respect des règles",
    es: "Cumplimiento de reglas",
    ht: "Respekte règ yo",
    pt: "Adesão às regras",
    de: "Regeltreue",
    ja: "ルール遵守率",
    zh: "规则遵守情况"
  },
  "Total Trades": {
    fr: "Transactions totales",
    es: "Operaciones totales",
    ht: "Total tranzaksyon",
    pt: "Total de operações",
    de: "Trades gesamt",
    ja: "合計取引数",
    zh: "总交易数"
  },
  "Best day: ": {
    fr: "Meilleur jour : ",
    es: "Mejor día: ",
    ht: "Pi bon jou: ",
    pt: "Melhor dia: ",
    de: "Bester Tag: ",
    ja: "最高の日: ",
    zh: "最佳日: "
  },
  "Worst day: ": {
    fr: "Pire jour : ",
    es: "Peor día: ",
    ht: "Pi move jou: ",
    pt: "Pior dia: ",
    de: "Schlechtester Tag: ",
    ja: "最悪の日: ",
    zh: "最差日: "
  },
  "Trade History": {
    fr: "Historique des transactions",
    es: "Historial de operaciones",
    ht: "Istwa tranzaksyon",
    pt: "Histórico de operações",
    de: "Trade-Historie",
    ja: "取引履歴",
    zh: "交易历史"
  },
  "No entries yet.": {
    fr: "Aucune entrée pour l'instant.",
    es: "Aún no hay entradas.",
    ht: "Poko gen antre.",
    pt: "Nenhum registro ainda.",
    de: "Noch keine Einträge.",
    ja: "まだ記録がありません。",
    zh: "暂无记录。"
  },
  "Delete entry": {
    fr: "Supprimer l'entrée",
    es: "Eliminar entrada",
    ht: "Efase antre a",
    pt: "Excluir registro",
    de: "Eintrag löschen",
    ja: "記録を削除",
    zh: "删除记录"
  },
  "Trade 1": {
    fr: "Transaction 1",
    es: "Operación 1",
    ht: "Tranzaksyon 1",
    pt: "Operação 1",
    de: "Trade 1",
    ja: "取引1",
    zh: "交易1"
  },
  "Trade 2": {
    fr: "Transaction 2",
    es: "Operación 2",
    ht: "Tranzaksyon 2",
    pt: "Operação 2",
    de: "Trade 2",
    ja: "取引2",
    zh: "交易2"
  },
  "Trade 3": {
    fr: "Transaction 3",
    es: "Operación 3",
    ht: "Tranzaksyon 3",
    pt: "Operação 3",
    de: "Trade 3",
    ja: "取引3",
    zh: "交易3"
  },
  "Win": {
    fr: "Gain",
    es: "Ganancia",
    ht: "Genyen",
    pt: "Ganho",
    de: "Gewinn",
    ja: "勝ち",
    zh: "盈利"
  },
  "Loss": {
    fr: "Perte",
    es: "Pérdida",
    ht: "Pèdi",
    pt: "Perda",
    de: "Verlust",
    ja: "負け",
    zh: "亏损"
  },
  "Long": {
    fr: "Long",
    es: "Largo",
    ht: "Long",
    pt: "Comprado",
    de: "Long",
    ja: "ロング",
    zh: "多单"
  },
  "Short": {
    fr: "Court",
    es: "Corto",
    ht: "Kout",
    pt: "Vendido",
    de: "Short",
    ja: "ショート",
    zh: "空单"
  },
  "Buffer after this day: ": {
    fr: "Tampon après ce jour : ",
    es: "Colchón después de este día: ",
    ht: "Tanpon apre jou sa a: ",
    pt: "Buffer após este dia: ",
    de: "Puffer nach diesem Tag: ",
    ja: "この日の後のバッファー: ",
    zh: "本日后的缓冲: "
  },
  "Discipline Leaderboard": {
    fr: "Classement de la discipline",
    es: "Tabla de disciplina",
    ht: "Klasman disiplin",
    pt: "Ranking de disciplina",
    de: "Disziplin-Rangliste",
    ja: "規律ランキング",
    zh: "纪律排行榜"
  },
  "Your Discipline Checklist": {
    fr: "Votre liste de discipline",
    es: "Tu lista de disciplina",
    ht: "Lis disiplin ou",
    pt: "Sua lista de disciplina",
    de: "Deine Disziplin-Checkliste",
    ja: "あなたの規律チェックリスト",
    zh: "您的纪律检查清单"
  },
  "Overall score: ": {
    fr: "Score global : ",
    es: "Puntuación general: ",
    ht: "Nòt jeneral: ",
    pt: "Pontuação geral: ",
    de: "Gesamtwertung: ",
    ja: "総合スコア: ",
    zh: "总分: "
  },
  "Logged every day since you started?": {
    fr: "Avez-vous enregistré chaque jour depuis le début ?",
    es: "¿Registraste todos los días desde que empezaste?",
    ht: "Èske ou anrejistre chak jou depi ou kòmanse?",
    pt: "Registrou todos os dias desde que começou?",
    de: "Jeden Tag seit Beginn protokolliert?",
    ja: "開始してから毎日記録していますか？",
    zh: "自开始以来是否每天都有记录？"
  },
  "Did physical exercise?": {
    fr: "Avez-vous fait de l'exercice physique ?",
    es: "¿Hiciste ejercicio físico?",
    ht: "Èske ou te fè egzèsis fizik?",
    pt: "Fez exercício físico?",
    de: "Sport gemacht?",
    ja: "運動をしましたか？",
    zh: "是否进行了体育锻炼？"
  },
  "Followed your written entry rules?": {
    fr: "Avez-vous suivi vos règles d'entrée écrites ?",
    es: "¿Seguiste tus reglas de entrada escritas?",
    ht: "Èske ou te swiv règ antre ekri ou yo?",
    pt: "Seguiu suas regras de entrada escritas?",
    de: "Deine schriftlichen Einstiegsregeln befolgt?",
    ja: "書面のエントリールールに従いましたか？",
    zh: "是否遵守了您写下的入场规则？"
  },
  "Stayed within your risk per trade (no over-risk)?": {
    fr: "Êtes-vous resté dans votre risque par transaction (pas de surisque) ?",
    es: "¿Te mantuviste dentro de tu riesgo por operación (sin exceso de riesgo)?",
    ht: "Èske ou te rete nan risk pou chak tranzaksyon (san twòp risk)?",
    pt: "Ficou dentro do seu risco por operação (sem excesso de risco)?",
    de: "Innerhalb deines Risikos pro Trade geblieben (kein Überrisiko)?",
    ja: "1取引あたりのリスク内に収まりましたか？（過剰リスクなし）",
    zh: "是否控制在每笔交易风险范围内（没有过度冒险）？"
  },
  "Stayed within your unlocked contract size (no over-lot)?": {
    fr: "Êtes-vous resté dans la taille de contrat débloquée (pas de surtaille) ?",
    es: "¿Te mantuviste dentro del tamaño de contrato desbloqueado (sin exceso de lote)?",
    ht: "Èske ou te rete nan gwosè kontra ki debloke a (san twòp lo)?",
    pt: "Ficou dentro do tamanho de contrato desbloqueado (sem excesso de lote)?",
    de: "Innerhalb der freigeschalteten Kontraktgröße geblieben (kein Über-Lot)?",
    ja: "解放された契約サイズ内に収まりましたか？（過剰ロットなし）",
    zh: "是否控制在已解锁的合约规模内（没有超额手数）？"
  },
  "Respected the Daily Execution Matrix?": {
    fr: "Avez-vous respecté la matrice d'exécution quotidienne ?",
    es: "¿Respetaste la matriz de ejecución diaria?",
    ht: "Èske ou te respekte matris egzekisyon chak jou a?",
    pt: "Respeitou a Matriz de Execução Diária?",
    de: "Die tägliche Ausführungsmatrix eingehalten?",
    ja: "デイリー実行マトリックスを守りましたか？",
    zh: "是否遵守了每日执行矩阵？"
  },
  "Stayed within your max daily loss (2x risk per trade)?": {
    fr: "Êtes-vous resté dans votre perte maximale quotidienne (2x le risque par transaction) ?",
    es: "¿Te mantuviste dentro de tu pérdida máxima diaria (2x el riesgo por operación)?",
    ht: "Èske ou te rete nan pèt maksimòm chak jou (2x risk pou chak tranzaksyon)?",
    pt: "Ficou dentro da sua perda máxima diária (2x o risco por operação)?",
    de: "Innerhalb deines maximalen Tagesverlusts geblieben (2x Risiko pro Trade)?",
    ja: "1日の最大損失内に収まりましたか？（1取引リスクの2倍）",
    zh: "是否控制在每日最大亏损内（每笔交易风险的2倍）？"
  },
  "Completed HTF to LTF analysis before entry?": {
    fr: "Avez-vous terminé l'analyse HTF vers LTF avant d'entrer ?",
    es: "¿Completaste el análisis de HTF a LTF antes de entrar?",
    ht: "Èske ou te fini analiz HTF a LTF anvan ou antre?",
    pt: "Concluiu a análise de HTF para LTF antes de entrar?",
    de: "HTF-zu-LTF-Analyse vor dem Einstieg abgeschlossen?",
    ja: "エントリー前にHTFからLTFへの分析を完了しましたか？",
    zh: "入场前是否完成了从高时间框架到低时间框架的分析？"
  },
  "Traded in the direction of your daily bias?": {
    fr: "Avez-vous négocié dans le sens de votre biais quotidien ?",
    es: "¿Operaste en la dirección de tu sesgo diario?",
    ht: "Èske ou te fè tranzaksyon nan direksyon bias ou chak jou a?",
    pt: "Operou na direção do seu viés diário?",
    de: "In Richtung deines Tagesbias gehandelt?",
    ja: "デイリーバイアスの方向に取引しましたか？",
    zh: "是否按照每日偏向方向进行交易？"
  },
  "No data yet": {
    fr: "Pas encore de données",
    es: "Sin datos aún",
    ht: "Poko gen done",
    pt: "Ainda sem dados",
    de: "Noch keine Daten",
    ja: "まだデータがありません",
    zh: "暂无数据"
  },
  "Risk of Ruin - Consecutive Loss Projection & Gain to Recover": {
    fr: "Risque de ruine - Projection de pertes consécutives et gain pour récupérer",
    es: "Riesgo de ruina - Proyección de pérdidas consecutivas y ganancia para recuperar",
    ht: "Risk Riwin - Pwojeksyon Pèt Youn Apre Lòt ak Genyen pou Rekipere",
    pt: "Risco de Ruína - Projeção de Perdas Consecutivas e Ganho para Recuperar",
    de: "Ruinrisiko - Prognose aufeinanderfolgender Verluste & Erholungsgewinn",
    ja: "破産リスク - 連続損失の予測と回復に必要な利益",
    zh: "破产风险 - 连续亏损预测与恢复所需盈利"
  },
  "Consecutive Losses": {
    fr: "Pertes consécutives",
    es: "Pérdidas consecutivas",
    ht: "Pèt Youn Apre Lòt",
    pt: "Perdas consecutivas",
    de: "Aufeinanderfolgende Verluste",
    ja: "連続損失",
    zh: "连续亏损"
  },
  "Buffer Remaining": {
    fr: "Tampon restant",
    es: "Colchón restante",
    ht: "Tanpon ki rete",
    pt: "Buffer restante",
    de: "Verbleibender Puffer",
    ja: "残りバッファー",
    zh: "剩余缓冲"
  },
  "Gain Needed to Recover": {
    fr: "Gain nécessaire pour récupérer",
    es: "Ganancia necesaria para recuperar",
    ht: "Genyen ki nesesè pou rekipere",
    pt: "Ganho necessário para recuperar",
    de: "Benötigter Gewinn zur Erholung",
    ja: "回復に必要な利益",
    zh: "恢复所需盈利"
  },
  "Account wiped": {
    fr: "Compte anéanti",
    es: "Cuenta liquidada",
    ht: "Kont efase nèt",
    pt: "Conta zerada",
    de: "Konto gelöscht",
    ja: "口座が消滅",
    zh: "账户已清零"
  },
  "Daily Trade Execution Matrix - your actual risk": {
    fr: "Matrice d'exécution quotidienne - votre risque réel",
    es: "Matriz de ejecución diaria - tu riesgo real",
    ht: "Matris Egzekisyon Chak Jou - risk reyèl ou",
    pt: "Matriz de Execução Diária - seu risco real",
    de: "Tägliche Trade-Ausführungsmatrix - dein tatsächliches Risiko",
    ja: "デイリー取引実行マトリックス - 実際のリスク",
    zh: "每日交易执行矩阵 - 您的实际风险"
  },
  "Scenario": {
    fr: "Scénario",
    es: "Escenario",
    ht: "Senaryo",
    pt: "Cenário",
    de: "Szenario",
    ja: "シナリオ",
    zh: "场景"
  },
  "Long Setup Rules": {
    fr: "Règles de configuration longue",
    es: "Reglas de configuración larga",
    ht: "Règ pou Long",
    pt: "Regras de configuração para Long",
    de: "Regeln für Long-Setups",
    ja: "ロングセットアップルール",
    zh: "多单设置规则"
  },
  "Short Setup Rules": {
    fr: "Règles de configuration courte",
    es: "Reglas de configuración corta",
    ht: "Règ pou Kout",
    pt: "Regras de configuração para Short",
    de: "Regeln für Short-Setups",
    ja: "ショートセットアップルール",
    zh: "空单设置规则"
  },
  "No rules defined.": {
    fr: "Aucune règle définie.",
    es: "No hay reglas definidas.",
    ht: "Pa gen règ ki defini.",
    pt: "Nenhuma regra definida.",
    de: "Keine Regeln definiert.",
    ja: "ルールが定義されていません。",
    zh: "尚未定义规则。"
  },
  "Log Today's Trades": {
    fr: "Enregistrer les transactions d'aujourd'hui",
    es: "Registrar las operaciones de hoy",
    ht: "Anrejistre tranzaksyon jodi a",
    pt: "Registrar operações de hoje",
    de: "Heutige Trades protokollieren",
    ja: "今日の取引を記録",
    zh: "记录今日交易"
  },
  "Entry Method": {
    fr: "Méthode de saisie",
    es: "Método de entrada",
    ht: "Metòd Antre",
    pt: "Método de entrada",
    de: "Eingabemethode",
    ja: "入力方法",
    zh: "录入方式"
  },
  "Manual Entry": {
    fr: "Saisie manuelle",
    es: "Entrada manual",
    ht: "Antre Manyèl",
    pt: "Entrada manual",
    de: "Manuelle Eingabe",
    ja: "手動入力",
    zh: "手动录入"
  },
  "Import CSV": {
    fr: "Importer CSV",
    es: "Importar CSV",
    ht: "Enpòte CSV",
    pt: "Importar CSV",
    de: "CSV importieren",
    ja: "CSVをインポート",
    zh: "导入CSV"
  },
  "Choose CSV File": {
    fr: "Choisir un fichier CSV",
    es: "Elegir archivo CSV",
    ht: "Chwazi Fichye CSV",
    pt: "Escolher arquivo CSV",
    de: "CSV-Datei wählen",
    ja: "CSVファイルを選択",
    zh: "选择CSV文件"
  },
  "Date": {
    fr: "Date",
    es: "Fecha",
    ht: "Dat",
    pt: "Data",
    de: "Datum",
    ja: "日付",
    zh: "日期"
  },
  "Did you trade today?": {
    fr: "Avez-vous négocié aujourd'hui ?",
    es: "¿Operaste hoy?",
    ht: "Èske ou te fè tranzaksyon jodi a?",
    pt: "Você operou hoje?",
    de: "Hast du heute gehandelt?",
    ja: "今日取引しましたか？",
    zh: "今天交易了吗？"
  },
  "Yes": {
    fr: "Oui",
    es: "Sí",
    ht: "Wi",
    pt: "Sim",
    de: "Ja",
    ja: "はい",
    zh: "是"
  },
  "No": {
    fr: "Non",
    es: "No",
    ht: "Non",
    pt: "Não",
    de: "Nein",
    ja: "いいえ",
    zh: "否"
  },
  "Physical exercise today?": {
    fr: "Exercice physique aujourd'hui ?",
    es: "¿Ejercicio físico hoy?",
    ht: "Egzèsis fizik jodi a?",
    pt: "Exercício físico hoje?",
    de: "Heute Sport gemacht?",
    ja: "今日は運動しましたか？",
    zh: "今天锻炼了吗？"
  },
  "Reason": {
    fr: "Raison",
    es: "Razón",
    ht: "Rezon",
    pt: "Motivo",
    de: "Grund",
    ja: "理由",
    zh: "原因"
  },
  "No Setup Found": {
    fr: "Aucune configuration trouvée",
    es: "No se encontró configuración",
    ht: "Pa Jwenn Setup",
    pt: "Nenhuma configuração encontrada",
    de: "Kein Setup gefunden",
    ja: "セットアップが見つかりません",
    zh: "未发现设置"
  },
  "Did Not Trade": {
    fr: "N'a pas négocié",
    es: "No operó",
    ht: "Pa Fè Tranzaksyon",
    pt: "Não operou",
    de: "Nicht gehandelt",
    ja: "取引しなかった",
    zh: "未交易"
  },
  "Other": {
    fr: "Autre",
    es: "Otro",
    ht: "Lòt",
    pt: "Outro",
    de: "Andere",
    ja: "その他",
    zh: "其他"
  },
  "Save No-Trade Day": {
    fr: "Enregistrer jour sans transaction",
    es: "Guardar día sin operar",
    ht: "Anrejistre Jou San Tranzaksyon",
    pt: "Salvar dia sem operação",
    de: "Handelsfreien Tag speichern",
    ja: "非取引日を保存",
    zh: "保存无交易日"
  },
  "Save Entry": {
    fr: "Enregistrer l'entrée",
    es: "Guardar entrada",
    ht: "Anrejistre Antre",
    pt: "Salvar registro",
    de: "Eintrag speichern",
    ja: "記録を保存",
    zh: "保存记录"
  },
  "Save Account": {
    fr: "Enregistrer le compte",
    es: "Guardar cuenta",
    ht: "Anrejistre Kont",
    pt: "Salvar conta",
    de: "Konto speichern",
    ja: "アカウントを保存",
    zh: "保存账户"
  },
  "Save": {
    fr: "Enregistrer",
    es: "Guardar",
    ht: "Anrejistre",
    pt: "Salvar",
    de: "Speichern",
    ja: "保存",
    zh: "保存"
  },
  "Cancel": {
    fr: "Annuler",
    es: "Cancelar",
    ht: "Anile",
    pt: "Cancelar",
    de: "Abbrechen",
    ja: "キャンセル",
    zh: "取消"
  },
  "Add Trading Account": {
    fr: "Ajouter un compte de trading",
    es: "Agregar cuenta de trading",
    ht: "Ajoute Kont Tranzaksyon",
    pt: "Adicionar conta de trading",
    de: "Trading-Konto hinzufügen",
    ja: "取引口座を追加",
    zh: "添加交易账户"
  },
  "Start Funded Account": {
    fr: "Démarrer un compte financé",
    es: "Iniciar cuenta financiada",
    ht: "Kòmanse Kont Finanse",
    pt: "Iniciar conta financiada",
    de: "Finanziertes Konto starten",
    ja: "ファンド口座を開始",
    zh: "开始出资账户"
  },
  "Account Name": {
    fr: "Nom du compte",
    es: "Nombre de la cuenta",
    ht: "Non Kont",
    pt: "Nome da conta",
    de: "Kontoname",
    ja: "口座名",
    zh: "账户名称"
  },
  "Starting Balance": {
    fr: "Solde de départ",
    es: "Saldo inicial",
    ht: "Balans Depa",
    pt: "Saldo inicial",
    de: "Startkapital",
    ja: "開始残高",
    zh: "起始余额"
  },
  "Capital / Buffer ($)": {
    fr: "Capital / Tampon ($)",
    es: "Capital / Colchón ($)",
    ht: "Kapital / Tanpon ($)",
    pt: "Capital / Buffer ($)",
    de: "Kapital / Puffer ($)",
    ja: "資金 / バッファー ($)",
    zh: "资金 / 缓冲 ($)"
  },
  "Drawdown Type": {
    fr: "Type de retrait",
    es: "Tipo de drawdown",
    ht: "Tip Drawdown",
    pt: "Tipo de drawdown",
    de: "Drawdown-Typ",
    ja: "ドローダウンタイプ",
    zh: "回撤类型"
  },
  "Market": {
    fr: "Marché",
    es: "Mercado",
    ht: "Mache",
    pt: "Mercado",
    de: "Markt",
    ja: "市場",
    zh: "市场"
  },
  "Profit Target ($)": {
    fr: "Objectif de profit ($)",
    es: "Meta de ganancia ($)",
    ht: "Objektif Pwofi ($)",
    pt: "Meta de lucro ($)",
    de: "Gewinnziel ($)",
    ja: "利益目標 ($)",
    zh: "盈利目标 ($)"
  },
  "Consistency Rule (%)": {
    fr: "Règle de cohérence (%)",
    es: "Regla de consistencia (%)",
    ht: "Règ Konsistans (%)",
    pt: "Regra de consistência (%)",
    de: "Konsistenzregel (%)",
    ja: "一貫性ルール (%)",
    zh: "一致性规则 (%)"
  },
  "Daily Loss Limit ($)": {
    fr: "Limite de perte quotidienne ($)",
    es: "Límite de pérdida diaria ($)",
    ht: "Limit Pèt Chak Jou ($)",
    pt: "Limite de perda diária ($)",
    de: "Tägliches Verlustlimit ($)",
    ja: "デイリー損失上限 ($)",
    zh: "每日亏损限额 ($)"
  },
  "Daily Loss Limit Type": {
    fr: "Type de limite de perte quotidienne",
    es: "Tipo de límite de pérdida diaria",
    ht: "Tip Limit Pèt Chak Jou",
    pt: "Tipo de limite de perda diária",
    de: "Typ des Tagesverlustlimits",
    ja: "デイリー損失上限タイプ",
    zh: "每日亏损限额类型"
  },
  "Strategy Name": {
    fr: "Nom de la stratégie",
    es: "Nombre de la estrategia",
    ht: "Non Estrateji",
    pt: "Nome da estratégia",
    de: "Strategiename",
    ja: "戦略名",
    zh: "策略名称"
  },
  "Add rule": {
    fr: "Ajouter une règle",
    es: "Agregar regla",
    ht: "Ajoute règ",
    pt: "Adicionar regra",
    de: "Regel hinzufügen",
    ja: "ルールを追加",
    zh: "添加规则"
  },
  "Challenge Cost ($)": {
    fr: "Coût du challenge ($)",
    es: "Costo del desafío ($)",
    ht: "Pri Defi ($)",
    pt: "Custo do desafio ($)",
    de: "Challenge-Kosten ($)",
    ja: "チャレンジ費用 ($)",
    zh: "挑战费用 ($)"
  },
  "Activation Cost ($)": {
    fr: "Coût d'activation ($)",
    es: "Costo de activación ($)",
    ht: "Pri Aktivasyon ($)",
    pt: "Custo de ativação ($)",
    de: "Aktivierungskosten ($)",
    ja: "アクティベーション費用 ($)",
    zh: "激活费用 ($)"
  },
  "Reset Cost ($)": {
    fr: "Coût de réinitialisation ($)",
    es: "Costo de reinicio ($)",
    ht: "Pri Reyajiste",
    pt: "Custo de reinício ($)",
    de: "Reset-Kosten ($)",
    ja: "リセット費用 ($)",
    zh: "重置费用 ($)"
  },
  "Master / Copied Account Number (optional)": {
    fr: "Numéro de compte maître / copié (facultatif)",
    es: "Número de cuenta maestra / copiada (opcional)",
    ht: "Nimewo Kont Mèt / Kopye (opsyonèl)",
    pt: "Número de conta mestre / copiada (opcional)",
    de: "Master-/kopierte Kontonummer (optional)",
    ja: "マスター / コピー元口座番号（任意）",
    zh: "主账户 / 跟单账户号（可选）"
  },
  "How was your day? (thoughts, emotions, anything on your mind)": {
    fr: "Comment s'est passée votre journée ? (pensées, émotions, tout ce qui vous préoccupe)",
    es: "¿Cómo estuvo tu día? (pensamientos, emociones, lo que tengas en mente)",
    ht: "Kijan jounen ou te ye? (panse, emosyon, nenpòt bagay nan tèt ou)",
    pt: "Como foi seu dia? (pensamentos, emoções, qualquer coisa na sua mente)",
    de: "Wie war dein Tag? (Gedanken, Gefühle, alles, was dich beschäftigt)",
    ja: "今日はどんな一日でしたか？（考え、感情、気になることなど）",
    zh: "您今天过得怎么样？（想法、情绪，任何心中所想）"
  },
  "Add another trade": {
    fr: "Ajouter une autre transaction",
    es: "Agregar otra operación",
    ht: "Ajoute yon lòt tranzaksyon",
    pt: "Adicionar outra operação",
    de: "Weiteren Trade hinzufügen",
    ja: "別の取引を追加",
    zh: "添加另一笔交易"
  },
  "Circuit Breaker - 2 losses. Day over.": {
    fr: "Coupe-circuit - 2 pertes. Journée terminée.",
    es: "Interruptor - 2 pérdidas. Día terminado.",
    ht: "Kout Sikwi - 2 pèt. Jounen fini.",
    pt: "Disjuntor - 2 perdas. Dia encerrado.",
    de: "Sicherung - 2 Verluste. Tag beendet.",
    ja: "サーキットブレーカー - 2敗。本日終了。",
    zh: "熔断机制 - 已亏损2次。今日结束。"
  },
  "Greed Filter - 2 wins. Day over.": {
    fr: "Filtre de cupidité - 2 gains. Journée terminée.",
    es: "Filtro de codicia - 2 ganancias. Día terminado.",
    ht: "Filtè Konvwatiz - 2 genyen. Jounen fini.",
    pt: "Filtro de ganância - 2 ganhos. Dia encerrado.",
    de: "Gier-Filter - 2 Gewinne. Tag beendet.",
    ja: "強欲フィルター - 2勝。本日終了。",
    zh: "贪婪过滤 - 已获胜2次。今日结束。"
  },
  "Day over - Trade 3 result stands.": {
    fr: "Journée terminée - le résultat de la transaction 3 est final.",
    es: "Día terminado - el resultado de la operación 3 es final.",
    ht: "Jounen fini - rezilta Tranzaksyon 3 la kanpe.",
    pt: "Dia encerrado - o resultado da Operação 3 é definitivo.",
    de: "Tag beendet - Ergebnis von Trade 3 bleibt bestehen.",
    ja: "本日終了 - 取引3の結果が確定。",
    zh: "今日结束 - 第3笔交易结果维持不变。"
  }
};
let originalTextMap = null;

// Added with the expert-journal upgrade (Overview stats, Flow State, Psychology, Historical Plan, Discipline Test)
Object.assign(TRANSLATIONS, {
  "Flow State": {
    fr: "État de flow",
    es: "Estado de flujo",
    ht: "Eta Flow",
    pt: "Estado de fluxo",
    de: "Flow-Zustand",
    ja: "フロー状態",
    zh: "心流状态"
  },
  "Psychology": {
    fr: "Psychologie",
    es: "Psicología",
    ht: "Psikoloji",
    pt: "Psicologia",
    de: "Psychologie",
    ja: "心理",
    zh: "心理"
  },
  "Flow State Training": {
    fr: "Entraînement à l'état de flow",
    es: "Entrenamiento del estado de flujo",
    ht: "Antrenman Eta Flow",
    pt: "Treino do estado de fluxo",
    de: "Flow-State-Training",
    ja: "フロー状態トレーニング",
    zh: "心流状态训练"
  },
  "Historical Plan": {
    fr: "Plan historique",
    es: "Plan histórico",
    ht: "Plan istorik",
    pt: "Plano histórico",
    de: "Plan-Historie",
    ja: "過去のプラン",
    zh: "历史计划"
  },
  "Discipline & Psychology Tracker": {
    fr: "Suivi discipline et psychologie",
    es: "Seguimiento de disciplina y psicología",
    ht: "Swivi Disiplin ak Psikoloji",
    pt: "Acompanhamento de disciplina e psicologia",
    de: "Disziplin- & Psychologie-Tracker",
    ja: "規律＆心理トラッカー",
    zh: "纪律与心理追踪器"
  },
  "Pre-Session Go / No-Go": {
    fr: "Feu vert / Feu rouge avant session",
    es: "Go / No-Go previo a la sesión",
    ht: "Go / No-Go Anvan Sesyon",
    pt: "Go / No-Go pré-sessão",
    de: "Go / No-Go vor der Session",
    ja: "セッション前のGo / No-Go",
    zh: "开盘前 Go / No-Go"
  },
  "Performance Overview": {
    fr: "Aperçu des performances",
    es: "Resumen de rendimiento",
    ht: "Apèsi Pèfòmans",
    pt: "Visão geral de desempenho",
    de: "Performance-Übersicht",
    ja: "パフォーマンス概要",
    zh: "绩效概览"
  },
  "Key trading metrics and portfolio performance": {
    fr: "Indicateurs clés de trading et performance du portefeuille",
    es: "Métricas clave de trading y rendimiento del portafolio",
    ht: "Metrik kle trading ak pèfòmans pòtfolyo",
    pt: "Métricas-chave de trading e desempenho da carteira",
    de: "Wichtige Trading-Kennzahlen und Portfolio-Performance",
    ja: "主要なトレード指標とポートフォリオの成績",
    zh: "关键交易指标与投资组合表现"
  },
  "Advanced Statistics": {
    fr: "Statistiques avancées",
    es: "Estadísticas avanzadas",
    ht: "Estatistik Avanse",
    pt: "Estatísticas avançadas",
    de: "Erweiterte Statistiken",
    ja: "詳細統計",
    zh: "高级统计"
  },
  "Deep performance analytics and behavioral insights": {
    fr: "Analyse approfondie des performances et du comportement",
    es: "Análisis profundo del rendimiento y del comportamiento",
    ht: "Analiz pèfòmans ak konpòtman an pwofondè",
    pt: "Análise profunda de desempenho e comportamento",
    de: "Tiefe Performance-Analysen und Verhaltenseinblicke",
    ja: "詳細なパフォーマンス分析と行動インサイト",
    zh: "深入的绩效分析与行为洞察"
  },
  "Net Balance": {
    fr: "Solde net",
    es: "Saldo neto",
    ht: "Balans Nèt",
    pt: "Saldo líquido",
    de: "Nettosaldo",
    ja: "純残高",
    zh: "净余额"
  },
  "Starting balance + Total P&L": {
    fr: "Solde initial + P&L total",
    es: "Saldo inicial + P&L total",
    ht: "Balans kòmansman + P&L total",
    pt: "Saldo inicial + P&L total",
    de: "Startkapital + Gesamt-P&L",
    ja: "初期残高＋合計損益",
    zh: "初始余额 + 总盈亏"
  },
  "Net profit/loss": {
    fr: "Profit/perte net",
    es: "Ganancia/pérdida neta",
    ht: "Pwofi/pèt nèt",
    pt: "Lucro/prejuízo líquido",
    de: "Nettogewinn/-verlust",
    ja: "純損益",
    zh: "净盈亏"
  },
  "Winning trades percentage": {
    fr: "Pourcentage de trades gagnants",
    es: "Porcentaje de operaciones ganadoras",
    ht: "Pousantaj tranzaksyon ki genyen",
    pt: "Percentual de operações vencedoras",
    de: "Anteil gewonnener Trades",
    ja: "勝ちトレードの割合",
    zh: "盈利交易占比"
  },
  "All executed trades": {
    fr: "Tous les trades exécutés",
    es: "Todas las operaciones ejecutadas",
    ht: "Tout tranzaksyon egzekite",
    pt: "Todas as operações executadas",
    de: "Alle ausgeführten Trades",
    ja: "全約定トレード",
    zh: "所有已执行交易"
  },
  "Discipline Score": {
    fr: "Score de discipline",
    es: "Puntuación de disciplina",
    ht: "Nòt Disiplin",
    pt: "Pontuação de disciplina",
    de: "Disziplin-Score",
    ja: "規律スコア",
    zh: "纪律得分"
  },
  "Trading discipline rating": {
    fr: "Évaluation de la discipline de trading",
    es: "Calificación de disciplina de trading",
    ht: "Evalyasyon disiplin trading",
    pt: "Avaliação da disciplina de trading",
    de: "Bewertung der Trading-Disziplin",
    ja: "トレード規律の評価",
    zh: "交易纪律评级"
  },
  "R Factor": {
    fr: "Facteur R",
    es: "Factor R",
    ht: "Faktè R",
    pt: "Fator R",
    de: "R-Faktor",
    ja: "Rファクター",
    zh: "R因子"
  },
  "Risk/Reward ratio": {
    fr: "Ratio risque/rendement",
    es: "Relación riesgo/beneficio",
    ht: "Rapò risk/rekonpans",
    pt: "Relação risco/retorno",
    de: "Chance-Risiko-Verhältnis",
    ja: "リスクリワード比",
    zh: "风险回报比"
  },
  "Profit Factor": {
    fr: "Facteur de profit",
    es: "Factor de beneficio",
    ht: "Faktè Pwofi",
    pt: "Fator de lucro",
    de: "Profit-Faktor",
    ja: "プロフィットファクター",
    zh: "盈利因子"
  },
  "Gross Win / Gross Loss": {
    fr: "Gain brut / Perte brute",
    es: "Ganancia bruta / Pérdida bruta",
    ht: "Gany brit / Pèt brit",
    pt: "Ganho bruto / Perda bruta",
    de: "Bruttogewinn / Bruttoverlust",
    ja: "総利益／総損失",
    zh: "总盈利 / 总亏损"
  },
  "Avg Win/Loss": {
    fr: "Gain/Perte moyen",
    es: "Ganancia/Pérdida media",
    ht: "Gany/Pèt mwayen",
    pt: "Ganho/Perda médio",
    de: "Ø Gewinn/Verlust",
    ja: "平均利益/損失",
    zh: "平均盈亏"
  },
  "Win vs Loss ratio": {
    fr: "Ratio gains/pertes",
    es: "Relación ganancias/pérdidas",
    ht: "Rapò gany/pèt",
    pt: "Relação ganhos/perdas",
    de: "Gewinn-zu-Verlust-Verhältnis",
    ja: "勝ち対負けの比率",
    zh: "盈亏比"
  },
  "Sharpe Ratio": {
    fr: "Ratio de Sharpe",
    es: "Ratio de Sharpe",
    ht: "Rapò Sharpe",
    pt: "Índice de Sharpe",
    de: "Sharpe-Ratio",
    ja: "シャープレシオ",
    zh: "夏普比率"
  },
  "Risk-adjusted returns (daily)": {
    fr: "Rendements ajustés au risque (quotidien)",
    es: "Rendimientos ajustados al riesgo (diario)",
    ht: "Rannman ajiste pou risk (chak jou)",
    pt: "Retornos ajustados ao risco (diário)",
    de: "Risikoadjustierte Renditen (täglich)",
    ja: "リスク調整後リターン（日次）",
    zh: "风险调整后收益（日度）"
  },
  "Max Consecutive Wins": {
    fr: "Gains consécutifs max",
    es: "Máx. ganancias consecutivas",
    ht: "Maks viktwa youn dèyè lòt",
    pt: "Máx. vitórias consecutivas",
    de: "Max. Gewinnserie",
    ja: "最大連勝",
    zh: "最大连胜"
  },
  "Best winning streak": {
    fr: "Meilleure série gagnante",
    es: "Mejor racha ganadora",
    ht: "Pi bon seri viktwa",
    pt: "Melhor sequência vencedora",
    de: "Beste Gewinnserie",
    ja: "最高の連勝記録",
    zh: "最佳连胜纪录"
  },
  "Max Consecutive Losses": {
    fr: "Pertes consécutives max",
    es: "Máx. pérdidas consecutivas",
    ht: "Maks defèt youn dèyè lòt",
    pt: "Máx. derrotas consecutivas",
    de: "Max. Verlustserie",
    ja: "最大連敗",
    zh: "最大连败"
  },
  "Worst losing streak": {
    fr: "Pire série perdante",
    es: "Peor racha perdedora",
    ht: "Pi move seri defèt",
    pt: "Pior sequência perdedora",
    de: "Schlimmste Verlustserie",
    ja: "最悪の連敗記録",
    zh: "最差连败纪录"
  },
  "Expectancy / Trade": {
    fr: "Espérance / trade",
    es: "Expectativa / operación",
    ht: "Espeyans / tranzaksyon",
    pt: "Expectativa / operação",
    de: "Erwartungswert / Trade",
    ja: "期待値／トレード",
    zh: "每笔期望值"
  },
  "Average edge per trade": {
    fr: "Avantage moyen par trade",
    es: "Ventaja media por operación",
    ht: "Avantaj mwayen pa tranzaksyon",
    pt: "Vantagem média por operação",
    de: "Durchschnittlicher Vorteil pro Trade",
    ja: "1トレードあたりの平均優位性",
    zh: "每笔交易平均优势"
  },
  "Largest Win": {
    fr: "Plus gros gain",
    es: "Mayor ganancia",
    ht: "Pi gwo gany",
    pt: "Maior ganho",
    de: "Größter Gewinn",
    ja: "最大利益",
    zh: "最大盈利"
  },
  "Best single trade": {
    fr: "Meilleur trade",
    es: "Mejor operación",
    ht: "Pi bon tranzaksyon",
    pt: "Melhor operação",
    de: "Bester Einzeltrade",
    ja: "最高の単一トレード",
    zh: "最佳单笔交易"
  },
  "Largest Loss": {
    fr: "Plus grosse perte",
    es: "Mayor pérdida",
    ht: "Pi gwo pèt",
    pt: "Maior perda",
    de: "Größter Verlust",
    ja: "最大損失",
    zh: "最大亏损"
  },
  "Worst single trade": {
    fr: "Pire trade",
    es: "Peor operación",
    ht: "Pi move tranzaksyon",
    pt: "Pior operação",
    de: "Schlechtester Einzeltrade",
    ja: "最悪の単一トレード",
    zh: "最差单笔交易"
  },
  "Avg R:R Ratio": {
    fr: "Ratio R:R moyen",
    es: "Ratio R:R medio",
    ht: "Rapò R:R mwayen",
    pt: "Razão R:R média",
    de: "Ø R:R-Verhältnis",
    ja: "平均R:R比",
    zh: "平均R:R比"
  },
  "Average win R / average loss R": {
    fr: "R moyen des gains / R moyen des pertes",
    es: "R medio ganador / R medio perdedor",
    ht: "R mwayen gany / R mwayen pèt",
    pt: "R médio de ganho / R médio de perda",
    de: "Ø Gewinn-R / Ø Verlust-R",
    ja: "平均利益R／平均損失R",
    zh: "平均盈利R / 平均亏损R"
  },
  "Avg R / Trade": {
    fr: "R moyen / trade",
    es: "R medio / operación",
    ht: "R mwayen / tranzaksyon",
    pt: "R médio / operação",
    de: "Ø R / Trade",
    ja: "平均R／トレード",
    zh: "平均R/笔"
  },
  "Needs risk logged per trade": {
    fr: "Nécessite le risque noté par trade",
    es: "Requiere registrar el riesgo por operación",
    ht: "Mande pou risk anrejistre pou chak tranzaksyon",
    pt: "Requer risco registrado por operação",
    de: "Erfordert erfasstes Risiko pro Trade",
    ja: "トレードごとのリスク記録が必要",
    zh: "需要记录每笔交易风险"
  },
  "Max Drawdown": {
    fr: "Drawdown max",
    es: "Drawdown máx.",
    ht: "Drawdown Maks",
    pt: "Drawdown máx.",
    de: "Max. Drawdown",
    ja: "最大ドローダウン",
    zh: "最大回撤"
  },
  "Peak-to-trough equity": {
    fr: "Capital du pic au creux",
    es: "Capital de pico a valle",
    ht: "Kapital soti pi wo rive pi ba",
    pt: "Capital de pico a vale",
    de: "Kapital von Hoch zu Tief",
    ja: "ピークから谷までの資産",
    zh: "净值峰谷回撤"
  },
  "Recovery Factor": {
    fr: "Facteur de récupération",
    es: "Factor de recuperación",
    ht: "Faktè Rekipérasyon",
    pt: "Fator de recuperação",
    de: "Erholungsfaktor",
    ja: "リカバリーファクター",
    zh: "恢复因子"
  },
  "Net profit / max drawdown": {
    fr: "Profit net / drawdown max",
    es: "Beneficio neto / drawdown máx.",
    ht: "Pwofi nèt / drawdown maks",
    pt: "Lucro líquido / drawdown máx.",
    de: "Nettogewinn / Max. Drawdown",
    ja: "純利益／最大ドローダウン",
    zh: "净利润 / 最大回撤"
  },
  "Day Win Rate": {
    fr: "Taux de jours gagnants",
    es: "Tasa de días ganadores",
    ht: "To jou ki genyen",
    pt: "Taxa de dias vencedores",
    de: "Gewinntage-Quote",
    ja: "勝ち日率",
    zh: "盈利日占比"
  },
  "Mental Readiness": {
    fr: "Préparation mentale",
    es: "Preparación mental",
    ht: "Preparasyon Mantal",
    pt: "Preparação mental",
    de: "Mentale Bereitschaft",
    ja: "メンタル準備度",
    zh: "心理准备度"
  },
  "Avg pre-session Mental Check": {
    fr: "Mental Check moyen avant session",
    es: "Mental Check medio previo a la sesión",
    ht: "Mental Check mwayen anvan sesyon",
    pt: "Mental Check médio pré-sessão",
    de: "Ø Mental Check vor der Session",
    ja: "セッション前の平均メンタルチェック",
    zh: "开盘前平均心理检查"
  },
  "Trading Discipline Test": {
    fr: "Test de discipline de trading",
    es: "Test de disciplina de trading",
    ht: "Tès Disiplin Trading",
    pt: "Teste de disciplina de trading",
    de: "Trading-Disziplin-Test",
    ja: "トレード規律テスト",
    zh: "交易纪律测试"
  },
  "Take the Free Test": {
    fr: "Passer le test gratuit",
    es: "Hacer la prueba gratis",
    ht: "Pran tès gratis la",
    pt: "Fazer o teste grátis",
    de: "Kostenlosen Test machen",
    ja: "無料テストを受ける",
    zh: "参加免费测试"
  },
  "Retake the test": {
    fr: "Repasser le test",
    es: "Repetir la prueba",
    ht: "Refè tès la",
    pt: "Refazer o teste",
    de: "Test wiederholen",
    ja: "テストをやり直す",
    zh: "重新测试"
  },
  "Your Trading Discipline Score": {
    fr: "Votre score de discipline de trading",
    es: "Tu puntuación de disciplina de trading",
    ht: "Nòt Disiplin Trading ou",
    pt: "Sua pontuação de disciplina de trading",
    de: "Dein Trading-Disziplin-Score",
    ja: "あなたのトレード規律スコア",
    zh: "你的交易纪律得分"
  },
  "Your profile": {
    fr: "Votre profil",
    es: "Tu perfil",
    ht: "Pwofil ou",
    pt: "Seu perfil",
    de: "Dein Profil",
    ja: "あなたのプロフィール",
    zh: "你的画像"
  },
  "Strongest Area": {
    fr: "Point le plus fort",
    es: "Área más fuerte",
    ht: "Zòn pi fò",
    pt: "Área mais forte",
    de: "Stärkster Bereich",
    ja: "最も強い分野",
    zh: "最强领域"
  },
  "Biggest Leak": {
    fr: "Plus grosse fuite",
    es: "Mayor fuga",
    ht: "Pi gwo fwit",
    pt: "Maior vazamento",
    de: "Größtes Leck",
    ja: "最大の弱点",
    zh: "最大漏洞"
  },
  "Score by Category": {
    fr: "Score par catégorie",
    es: "Puntuación por categoría",
    ht: "Nòt pa kategori",
    pt: "Pontuação por categoria",
    de: "Score pro Kategorie",
    ja: "カテゴリー別スコア",
    zh: "分类得分"
  },
  "What To Watch": {
    fr: "Points de vigilance",
    es: "Qué vigilar",
    ht: "Sa pou swiv",
    pt: "O que observar",
    de: "Worauf du achten solltest",
    ja: "注意点",
    zh: "需要留意"
  },
  "Test History": {
    fr: "Historique des tests",
    es: "Historial de pruebas",
    ht: "Istwa tès yo",
    pt: "Histórico de testes",
    de: "Testverlauf",
    ja: "テスト履歴",
    zh: "测试历史"
  },
  "Home": {
    fr: "Accueil",
    es: "Inicio",
    ht: "Akèy",
    pt: "Início",
    de: "Startseite",
    ja: "ホーム",
    zh: "首页"
  },
  "Mental Check trend": {
    fr: "Tendance du Mental Check",
    es: "Tendencia del Mental Check",
    ht: "Tandans Mental Check",
    pt: "Tendência do Mental Check",
    de: "Mental-Check-Verlauf",
    ja: "メンタルチェックの推移",
    zh: "心理检查趋势"
  },
  "Body & State": {
    fr: "Corps et état",
    es: "Cuerpo y estado",
    ht: "Kò ak eta",
    pt: "Corpo e estado",
    de: "Körper & Zustand",
    ja: "身体と状態",
    zh: "身体与状态"
  },
  "Sleep & Recovery": {
    fr: "Sommeil et récupération",
    es: "Sueño y recuperación",
    ht: "Dòmi ak rekipérasyon",
    pt: "Sono e recuperação",
    de: "Schlaf & Erholung",
    ja: "睡眠と回復",
    zh: "睡眠与恢复"
  },
  "Physical Energy": {
    fr: "Énergie physique",
    es: "Energía física",
    ht: "Enèji fizik",
    pt: "Energia física",
    de: "Körperliche Energie",
    ja: "身体のエネルギー",
    zh: "身体能量"
  },
  "Focus & Clarity": {
    fr: "Concentration et clarté",
    es: "Enfoque y claridad",
    ht: "Konsantrasyon ak klète",
    pt: "Foco e clareza",
    de: "Fokus & Klarheit",
    ja: "集中力と明晰さ",
    zh: "专注与清晰"
  },
  "Outside Stress": {
    fr: "Stress extérieur",
    es: "Estrés externo",
    ht: "Estrès deyò",
    pt: "Estresse externo",
    de: "Äußerer Stress",
    ja: "外的ストレス",
    zh: "外部压力"
  },
  "Green Light": {
    fr: "Feu vert",
    es: "Luz verde",
    ht: "Limyè vèt",
    pt: "Luz verde",
    de: "Grünes Licht",
    ja: "グリーンライト",
    zh: "绿灯"
  },
  "Proceed With Care": {
    fr: "Procédez avec prudence",
    es: "Procede con cuidado",
    ht: "Avanse ak prekosyon",
    pt: "Prossiga com cuidado",
    de: "Mit Vorsicht vorgehen",
    ja: "慎重に進む",
    zh: "谨慎进行"
  },
  "Reduced Size": {
    fr: "Taille réduite",
    es: "Tamaño reducido",
    ht: "Gwosè redwi",
    pt: "Tamanho reduzido",
    de: "Reduzierte Größe",
    ja: "サイズ縮小",
    zh: "缩小仓位"
  },
  "Stand Down": {
    fr: "Ne pas trader",
    es: "No operar",
    ht: "Pa fè tranzaksyon",
    pt: "Não operar",
    de: "Nicht handeln",
    ja: "トレード見送り",
    zh: "停止交易"
  },
  "How much in the flow do you feel right now?": {
    fr: "À quel point êtes-vous dans le flow en ce moment ?",
    es: "¿Cuánto en flujo te sientes ahora mismo?",
    ht: "Ki jan ou santi ou nan flow la kounye a?",
    pt: "Quanto em fluxo você se sente agora?",
    de: "Wie sehr fühlst du dich gerade im Flow?",
    ja: "今、どれくらいフロー状態を感じますか？",
    zh: "你现在有多“心流”？"
  },
  "Your skill level today": {
    fr: "Votre niveau de compétence aujourd'hui",
    es: "Tu nivel de habilidad hoy",
    ht: "Nivo konpetans ou jodi a",
    pt: "Seu nível de habilidade hoje",
    de: "Dein Skill-Level heute",
    ja: "今日のスキルレベル",
    zh: "你今天的技能水平"
  },
  "Challenge of today's market": {
    fr: "Défi du marché aujourd'hui",
    es: "Reto del mercado de hoy",
    ht: "Defi mache jodi a",
    pt: "Desafio do mercado hoje",
    de: "Herausforderung des heutigen Marktes",
    ja: "今日の相場の難しさ",
    zh: "今日市场的挑战度"
  },
  "Performance zone": {
    fr: "Zone de performance",
    es: "Zona de rendimiento",
    ht: "Zòn pèfòmans",
    pt: "Zona de desempenho",
    de: "Leistungszone",
    ja: "パフォーマンスゾーン",
    zh: "表现区间"
  },
  "Start the Flow Ritual": {
    fr: "Commencer le rituel de flow",
    es: "Iniciar el ritual de flujo",
    ht: "Kòmanse Rit Flow la",
    pt: "Iniciar o ritual de fluxo",
    de: "Flow-Ritual starten",
    ja: "フローの儀式を始める",
    zh: "开始心流仪式"
  },
  "Nervous System Reset": {
    fr: "Réinitialisation du système nerveux",
    es: "Reinicio del sistema nervioso",
    ht: "Rekòmanse sistèm nève a",
    pt: "Reinício do sistema nervoso",
    de: "Nervensystem-Reset",
    ja: "神経系リセット",
    zh: "神经系统重置"
  },
  "Body Activation": {
    fr: "Activation du corps",
    es: "Activación del cuerpo",
    ht: "Aktivasyon Kò a",
    pt: "Ativação do corpo",
    de: "Körperaktivierung",
    ja: "ボディ活性化",
    zh: "身体激活"
  },
  "Market Synchronization": {
    fr: "Synchronisation avec le marché",
    es: "Sincronización con el mercado",
    ht: "Senkwonizasyon ak Mache a",
    pt: "Sincronização com o mercado",
    de: "Marktsynchronisation",
    ja: "相場との同期",
    zh: "市场同步"
  },
  "Plan & Intention": {
    fr: "Plan et intention",
    es: "Plan e intención",
    ht: "Plan ak entansyon",
    pt: "Plano e intenção",
    de: "Plan & Absicht",
    ja: "プランと意図",
    zh: "计划与意图"
  },
  "Anchor Activation": {
    fr: "Activation de l'ancre",
    es: "Activación del ancla",
    ht: "Aktivasyon Lank la",
    pt: "Ativação da âncora",
    de: "Anker-Aktivierung",
    ja: "アンカーの起動",
    zh: "锚点激活"
  },
  "How do you feel after the ritual?": {
    fr: "Comment vous sentez-vous après le rituel ?",
    es: "¿Cómo te sientes después del ritual?",
    ht: "Ki jan ou santi apre rit la?",
    pt: "Como você se sente após o ritual?",
    de: "Wie fühlst du dich nach dem Ritual?",
    ja: "儀式の後、どう感じますか？",
    zh: "仪式之后你感觉如何？"
  },
  "Focus": {
    fr: "Concentration",
    es: "Enfoque",
    ht: "Konsantrasyon",
    pt: "Foco",
    de: "Fokus",
    ja: "集中",
    zh: "专注"
  },
  "Calmness": {
    fr: "Calme",
    es: "Calma",
    ht: "Kalm",
    pt: "Calma",
    de: "Ruhe",
    ja: "落ち着き",
    zh: "平静"
  },
  "Confidence": {
    fr: "Confiance",
    es: "Confianza",
    ht: "Konfyans",
    pt: "Confiança",
    de: "Selbstvertrauen",
    ja: "自信",
    zh: "自信"
  },
  "Clarity": {
    fr: "Clarté",
    es: "Claridad",
    ht: "Klète",
    pt: "Clareza",
    de: "Klarheit",
    ja: "明晰さ",
    zh: "清晰"
  },
  "Select...": {
    fr: "Sélectionner...",
    es: "Seleccionar...",
    ht: "Chwazi...",
    pt: "Selecionar...",
    de: "Auswählen...",
    ja: "選択...",
    zh: "请选择..."
  },
  "Excellent": {
    fr: "Excellent",
    es: "Excelente",
    ht: "Ekselan",
    pt: "Excelente",
    de: "Ausgezeichnet",
    ja: "最高",
    zh: "极好"
  },
  "Good": {
    fr: "Bon",
    es: "Bueno",
    ht: "Bon",
    pt: "Bom",
    de: "Gut",
    ja: "良い",
    zh: "良好"
  },
  "Okay": {
    fr: "Correct",
    es: "Regular",
    ht: "Pasab",
    pt: "Razoável",
    de: "Okay",
    ja: "普通",
    zh: "一般"
  },
  "Poor": {
    fr: "Faible",
    es: "Bajo",
    ht: "Fèb",
    pt: "Fraco",
    de: "Schwach",
    ja: "低い",
    zh: "较差"
  },
  "Flow Score": {
    fr: "Score de flow",
    es: "Puntuación de flujo",
    ht: "Nòt Flow",
    pt: "Pontuação de fluxo",
    de: "Flow-Score",
    ja: "フロースコア",
    zh: "心流得分"
  },
  "Save Session": {
    fr: "Enregistrer la session",
    es: "Guardar sesión",
    ht: "Anrejistre sesyon",
    pt: "Salvar sessão",
    de: "Session speichern",
    ja: "セッションを保存",
    zh: "保存本次训练"
  },
  "Start over": {
    fr: "Recommencer",
    es: "Empezar de nuevo",
    ht: "Rekòmanse",
    pt: "Recomeçar",
    de: "Neu starten",
    ja: "最初からやり直す",
    zh: "重新开始"
  },
  "Cancel": {
    fr: "Annuler",
    es: "Cancelar",
    ht: "Anile",
    pt: "Cancelar",
    de: "Abbrechen",
    ja: "キャンセル",
    zh: "取消"
  },
  "Flow Session History": {
    fr: "Historique des sessions de flow",
    es: "Historial de sesiones de flujo",
    ht: "Istwa sesyon flow",
    pt: "Histórico de sessões de fluxo",
    de: "Flow-Session-Verlauf",
    ja: "フローセッション履歴",
    zh: "心流训练历史"
  },
  "Personal Advice": {
    fr: "Conseils personnalisés",
    es: "Consejos personales",
    ht: "Konsèy pèsonèl",
    pt: "Conselhos pessoais",
    de: "Persönliche Empfehlungen",
    ja: "パーソナルアドバイス",
    zh: "个性化建议"
  },
  "Psychology Check-In": {
    fr: "Bilan psychologique",
    es: "Chequeo psicológico",
    ht: "Tcheke Psikolojik",
    pt: "Check-in psicológico",
    de: "Psychologie-Check-in",
    ja: "心理チェックイン",
    zh: "心理签到"
  },
  "Save Check-In": {
    fr: "Enregistrer le bilan",
    es: "Guardar chequeo",
    ht: "Anrejistre tcheke a",
    pt: "Salvar check-in",
    de: "Check-in speichern",
    ja: "チェックインを保存",
    zh: "保存签到"
  },
  "Main emotional state": {
    fr: "État émotionnel principal",
    es: "Estado emocional principal",
    ht: "Eta emosyonèl prensipal",
    pt: "Estado emocional principal",
    de: "Hauptsächlicher emotionaler Zustand",
    ja: "主な感情状態",
    zh: "主要情绪状态"
  },
  "Triggers you felt": {
    fr: "Déclencheurs ressentis",
    es: "Detonantes que sentiste",
    ht: "Deklanchè ou santi yo",
    pt: "Gatilhos que sentiu",
    de: "Ausgelöste Trigger",
    ja: "感じたトリガー",
    zh: "你感受到的触发因素"
  },
  "Urge to break your plan": {
    fr: "Envie de briser votre plan",
    es: "Impulso de romper tu plan",
    ht: "Anvi pou kraze plan ou",
    pt: "Impulso de quebrar seu plano",
    de: "Drang, deinen Plan zu brechen",
    ja: "プランを破りたい衝動",
    zh: "想打破计划的冲动"
  },
  "I broke one of my rules today": {
    fr: "J'ai enfreint une de mes règles aujourd'hui",
    es: "Rompí una de mis reglas hoy",
    ht: "Mwen vyole youn nan règ mwen yo jodi a",
    pt: "Quebrei uma das minhas regras hoje",
    de: "Ich habe heute eine meiner Regeln gebrochen",
    ja: "今日、ルールを1つ破った",
    zh: "我今天打破了一条规则"
  },
  "Most frequent triggers": {
    fr: "Déclencheurs les plus fréquents",
    es: "Detonantes más frecuentes",
    ht: "Deklanchè ki pi souvan",
    pt: "Gatilhos mais frequentes",
    de: "Häufigste Trigger",
    ja: "最も多いトリガー",
    zh: "最常见的触发因素"
  },
  "Pattern Analysis & History": {
    fr: "Analyse des schémas et historique",
    es: "Análisis de patrones e historial",
    ht: "Analiz modèl ak istwa",
    pt: "Análise de padrões e histórico",
    de: "Musteranalyse & Verlauf",
    ja: "パターン分析と履歴",
    zh: "模式分析与历史"
  },
  "Discipline Index": {
    fr: "Indice de discipline",
    es: "Índice de disciplina",
    ht: "Endèks Disiplin",
    pt: "Índice de disciplina",
    de: "Disziplin-Index",
    ja: "規律指数",
    zh: "纪律指数"
  },
  "Emotional Stability": {
    fr: "Stabilité émotionnelle",
    es: "Estabilidad emocional",
    ht: "Estabilite emosyonèl",
    pt: "Estabilidade emocional",
    de: "Emotionale Stabilität",
    ja: "感情の安定性",
    zh: "情绪稳定性"
  },
  "Revenge Index": {
    fr: "Indice de revenge trading",
    es: "Índice de revenge trading",
    ht: "Endèks Revenge",
    pt: "Índice de revenge trading",
    de: "Revenge-Index",
    ja: "リベンジ指数",
    zh: "报复指数"
  },
  "Greed Index": {
    fr: "Indice de cupidité",
    es: "Índice de codicia",
    ht: "Endèks Gwo anvi",
    pt: "Índice de ganância",
    de: "Gier-Index",
    ja: "欲張り指数",
    zh: "贪婪指数"
  },
  "Fear Index": {
    fr: "Indice de peur",
    es: "Índice de miedo",
    ht: "Endèks Laperèz",
    pt: "Índice de medo",
    de: "Angst-Index",
    ja: "恐怖指数",
    zh: "恐惧指数"
  },
  "Rule-Break Rate": {
    fr: "Taux d'infraction aux règles",
    es: "Tasa de ruptura de reglas",
    ht: "To vyolasyon règ",
    pt: "Taxa de quebra de regras",
    de: "Regelbruch-Quote",
    ja: "ルール違反率",
    zh: "违规率"
  },
  "Days planned": {
    fr: "Jours planifiés",
    es: "Días planificados",
    ht: "Jou planifye",
    pt: "Dias planejados",
    de: "Geplante Tage",
    ja: "計画した日数",
    zh: "计划天数"
  },
  "Plan followed": {
    fr: "Plan respecté",
    es: "Plan seguido",
    ht: "Plan swiv",
    pt: "Plano seguido",
    de: "Plan befolgt",
    ja: "プラン遵守",
    zh: "遵守计划"
  },
  "Plan broken": {
    fr: "Plan non respecté",
    es: "Plan roto",
    ht: "Plan kraze",
    pt: "Plano quebrado",
    de: "Plan gebrochen",
    ja: "プラン違反",
    zh: "违反计划"
  },
  "Target hit rate": {
    fr: "Taux d'objectifs atteints",
    es: "Tasa de objetivos alcanzados",
    ht: "To objektif atenn",
    pt: "Taxa de metas atingidas",
    de: "Zielerreichungsquote",
    ja: "目標達成率",
    zh: "目标达成率"
  },
  "All months": {
    fr: "Tous les mois",
    es: "Todos los meses",
    ht: "Tout mwa",
    pt: "Todos os meses",
    de: "Alle Monate",
    ja: "すべての月",
    zh: "所有月份"
  },
  "All days": {
    fr: "Tous les jours",
    es: "Todos los días",
    ht: "Tout jou",
    pt: "Todos os dias",
    de: "Alle Tage",
    ja: "すべての日",
    zh: "所有日期"
  },
  "Nothing matches this filter.": {
    fr: "Aucun résultat pour ce filtre.",
    es: "Nada coincide con este filtro.",
    ht: "Pa gen anyen ki koresponn ak filt sa a.",
    pt: "Nada corresponde a este filtro.",
    de: "Nichts entspricht diesem Filter.",
    ja: "このフィルターに一致する項目はありません。",
    zh: "没有符合此筛选的内容。"
  },
  "Open Gamma Levels": {
    fr: "Ouvrir les niveaux gamma",
    es: "Abrir niveles gamma",
    ht: "Louvri nivo gamma",
    pt: "Abrir níveis gamma",
    de: "Gamma-Levels öffnen",
    ja: "ガンマレベルを開く",
    zh: "打开Gamma水平"
  },
  "Create a free account to unlock your Trading Discipline Test result": {
    fr: "Créez un compte gratuit pour débloquer le résultat de votre test",
    es: "Crea una cuenta gratis para desbloquear el resultado de tu prueba",
    ht: "Kreye yon kont gratis pou debloke rezilta tès ou",
    pt: "Crie uma conta grátis para desbloquear o resultado do teste",
    de: "Erstelle ein kostenloses Konto, um dein Testergebnis freizuschalten",
    ja: "無料アカウントを作成してテスト結果を確認",
    zh: "创建免费账户以解锁测试结果"
  }
});
Object.assign(TRANSLATIONS, {
  "Command Center": {
    fr: "Centre de commande",
    es: "Centro de mando",
    ht: "Sant kòmand",
    pt: "Central de comando",
    de: "Kommandozentrale",
    ja: "コマンドセンター",
    zh: "指挥中心"
  },
  "Pre-Session": {
    fr: "Avant-session",
    es: "Pre-sesión",
    ht: "Anvan sesyon",
    pt: "Pré-sessão",
    de: "Vor der Session",
    ja: "セッション前",
    zh: "开盘前"
  },
  "Trades": {
    fr: "Trades",
    es: "Operaciones",
    ht: "Tranzaksyon",
    pt: "Operações",
    de: "Trades",
    ja: "トレード",
    zh: "交易"
  },
  "Money": {
    fr: "Argent",
    es: "Dinero",
    ht: "Lajan",
    pt: "Dinheiro",
    de: "Geld",
    ja: "お金",
    zh: "资金"
  },
  "Test & Progress": {
    fr: "Test et progrès",
    es: "Prueba y progreso",
    ht: "Tès ak pwogrè",
    pt: "Teste e progresso",
    de: "Test & Fortschritt",
    ja: "テストと進捗",
    zh: "测试与进度"
  },
  "Today's Mission": {
    fr: "Mission du jour",
    es: "Misión de hoy",
    ht: "Misyon jodi a",
    pt: "Missão de hoje",
    de: "Heutige Mission",
    ja: "今日のミッション",
    zh: "今日任务"
  },
  "Your Plan": {
    fr: "Votre plan",
    es: "Tu plan",
    ht: "Plan ou",
    pt: "Seu plano",
    de: "Dein Plan",
    ja: "あなたのプラン",
    zh: "你的计划"
  },
  "Account Rules & System Limits": {
    fr: "Règles du compte et limites du système",
    es: "Reglas de la cuenta y límites del sistema",
    ht: "Règ kont lan ak limit sistèm",
    pt: "Regras da conta e limites do sistema",
    de: "Kontoregeln & Systemgrenzen",
    ja: "口座ルールとシステム上限",
    zh: "账户规则与系统限制"
  },
  "Take the Discipline Test to unlock this": {
    fr: "Passez le test de discipline pour débloquer ceci",
    es: "Haz la prueba de disciplina para desbloquear esto",
    ht: "Pran tès disiplin lan pou debloke sa a",
    pt: "Faça o teste de disciplina para desbloquear",
    de: "Mach den Disziplin-Test, um dies freizuschalten",
    ja: "規律テストを受けて解除しましょう",
    zh: "完成纪律测试以解锁"
  },
  "Take the Discipline Test": {
    fr: "Passer le test de discipline",
    es: "Hacer la prueba de disciplina",
    ht: "Pran tès disiplin lan",
    pt: "Fazer o teste de disciplina",
    de: "Disziplin-Test machen",
    ja: "規律テストを受ける",
    zh: "参加纪律测试"
  },
  "Take the Test": {
    fr: "Passer le test",
    es: "Hacer la prueba",
    ht: "Pran tès la",
    pt: "Fazer o teste",
    de: "Test machen",
    ja: "テストを受ける",
    zh: "参加测试"
  },
  "What should we call you?": {
    fr: "Comment devons-nous vous appeler ?",
    es: "¿Cómo te llamamos?",
    ht: "Kijan nou dwe rele w?",
    pt: "Como devemos chamar você?",
    de: "Wie sollen wir dich nennen?",
    ja: "お名前を教えてください",
    zh: "我们该怎么称呼你？"
  },
  "Save my name": {
    fr: "Enregistrer mon nom",
    es: "Guardar mi nombre",
    ht: "Anrejistre non mwen",
    pt: "Salvar meu nome",
    de: "Namen speichern",
    ja: "名前を保存",
    zh: "保存我的名字"
  },
  "Mental Check done": {
    fr: "Mental Check fait",
    es: "Mental Check hecho",
    ht: "Mental Check fèt",
    pt: "Mental Check feito",
    de: "Mental Check erledigt",
    ja: "メンタルチェック完了",
    zh: "已完成心理检查"
  },
  "Daily Plan set": {
    fr: "Plan quotidien défini",
    es: "Plan diario definido",
    ht: "Plan chak jou defini",
    pt: "Plano diário definido",
    de: "Tagesplan gesetzt",
    ja: "デイリープラン設定済み",
    zh: "已设置每日计划"
  },
  "Today logged": {
    fr: "Journée enregistrée",
    es: "Día registrado",
    ht: "Jou a anrejistre",
    pt: "Dia registrado",
    de: "Heute erfasst",
    ja: "今日を記録済み",
    zh: "今日已记录"
  },
  "Buffer (your room to be wrong)": {
    fr: "Buffer (votre marge d'erreur)",
    es: "Buffer (tu margen de error)",
    ht: "Buffer (maj erè ou)",
    pt: "Buffer (sua margem de erro)",
    de: "Puffer (dein Fehlerspielraum)",
    ja: "バッファ（許容できる失敗の余地）",
    zh: "缓冲（你的容错空间）"
  },
  "Open": {
    fr: "Ouvrir",
    es: "Abrir",
    ht: "Louvri",
    pt: "Abrir",
    de: "Öffnen",
    ja: "開く",
    zh: "打开"
  },
  "Flow Ritual": {
    fr: "Rituel de flow",
    es: "Ritual de flujo",
    ht: "Rit flow",
    pt: "Ritual de fluxo",
    de: "Flow-Ritual",
    ja: "フローの儀式",
    zh: "心流仪式"
  }
});
function applyTranslation(lang) {
  if (typeof document === 'undefined') return;
  const root = document.getElementById('root');
  if (!root) return;
  if (!originalTextMap) originalTextMap = new WeakMap();
  const translateValue = function (original) {
    const key = original.trim();
    if (!key) return original;
    const entry = TRANSLATIONS[key];
    if (!entry) return original;
    if (lang === 'en') return original;
    return entry[lang] || original;
  };

  // True when `current` is either the cached English original itself, or one
  // of its already-known translations. If neither matches, the live text was
  // changed by something other than this translator (e.g. React re-rendering
  // new copy for a different UI state), so the cached "original" is stale and
  // must be refreshed - otherwise this function would keep stomping fresh
  // React updates back to whatever text the node first happened to hold.
  const isKnownVariant = function (original, current) {
    if (current === original) return true;
    const entry = TRANSLATIONS[original.trim()];
    if (!entry) return false;
    return Object.keys(entry).some(function (l) {
      return entry[l] === current;
    });
  };
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let node;
  while (node = walker.nextNode()) {
    const cached = originalTextMap.get(node);
    if (cached === undefined || !isKnownVariant(cached, node.nodeValue)) {
      originalTextMap.set(node, node.nodeValue);
    }
    const original = originalTextMap.get(node);
    const translated = translateValue(original);
    if (node.nodeValue !== translated) node.nodeValue = translated;
  }
  const placeholderEls = root.querySelectorAll('[placeholder]');
  placeholderEls.forEach(function (el) {
    const cached = originalTextMap.get(el);
    const current = el.getAttribute('placeholder');
    if (cached === undefined || !isKnownVariant(cached, current)) {
      originalTextMap.set(el, current);
    }
    const original = originalTextMap.get(el);
    const translated = translateValue(original);
    if (el.getAttribute('placeholder') !== translated) el.setAttribute('placeholder', translated);
  });
}
function InstallAppModal(props) {
  const onClose = props.onClose;
  const [platform, setPlatform] = useState('iphone');
  const steps = platform === 'iphone' ? [{
    title: 'Open this page in Safari',
    body: 'Must be Safari - Chrome on iPhone cannot add a home-screen app.'
  }, {
    title: 'Tap the Share button',
    body: 'The square with an arrow up, at the bottom of Safari.'
  }, {
    title: 'Scroll and tap "Add to Home Screen"',
    body: 'It\'s further down the share sheet.'
  }, {
    title: 'Name it and tap Add',
    body: 'The gold M icon appears on your home screen, opening like a real app.'
  }] : [{
    title: 'Open this page in Chrome',
    body: 'Samsung Internet has the same option under its menu.'
  }, {
    title: 'Tap the three-dot menu',
    body: 'Top right of the browser.'
  }, {
    title: 'Tap "Add to Home screen" or "Install app"',
    body: 'Either option works the same way.'
  }, {
    title: 'Tap Add',
    body: 'The gold M icon appears with your other apps.'
  }];
  return /*#__PURE__*/React.createElement(Modal, {
    onClose: onClose,
    title: "Put MMM Pro Journal on Your Phone",
    size: "md"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Optional. Adds a home-screen icon so the app opens full-screen, like a real app - no browser bar. Do this from the browser, not from a downloaded file."), /*#__PURE__*/React.createElement("div", {
    className: "flex bg-gray-900 border border-gray-800 rounded-lg p-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setPlatform('iphone');
    },
    className: "flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-1.5 " + (platform === 'iphone' ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-500 hover:text-white')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Smartphone",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "iPhone")), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setPlatform('android');
    },
    className: "flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-1.5 " + (platform === 'android' ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-500 hover:text-white')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Smartphone",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Android"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, steps.map(function (step, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "flex gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-7 w-7 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-sm font-bold flex items-center justify-center flex-shrink-0"
    }, i + 1), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-white text-sm font-medium"
    }, step.title), /*#__PURE__*/React.createElement("p", {
      className: "text-gray-500 text-xs mt-0.5"
    }, step.body)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 bg-black/30 rounded-lg p-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./logo-icon-192.png",
    alt: "MMM Pro Journal icon",
    className: "h-10 w-10 rounded-xl flex-shrink-0"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "This is the icon you're looking for once it's added."))));
}
function LanguageSwitcher(props) {
  const language = props.language;
  const setLanguage = props.setLanguage;
  return /*#__PURE__*/React.createElement("select", {
    value: language,
    onChange: function (e) {
      setLanguage(e.target.value);
    },
    className: "bg-gray-900 border border-gray-800 text-gray-300 rounded-lg px-2 py-1.5 text-xs focus:border-yellow-400/50 outline-none"
  }, LANGUAGES.map(function (l) {
    return /*#__PURE__*/React.createElement("option", {
      key: l.code,
      value: l.code
    }, l.label);
  }));
}

// THE MAXMILLIONS INSTITUTIONAL TRADING CHARTER - CORE RISK ENGINE
// ---------------------------------------------------------------------

const PHASE_CONFIG = {
  challenge: {
    mode: 'Speed Mode',
    riskPct: 0.10,
    label: 'Phase 1 - Evaluation'
  },
  funded: {
    mode: 'Speed Mode',
    riskPct: 0.10,
    label: 'Phase 2 - Funded Cash Run'
  },
  live: {
    mode: 'Preservation Mode',
    riskPct: 0.02,
    label: 'Phase 3 - Live Consolidation'
  },
  paper: {
    mode: 'Practice Mode',
    riskPct: 0.10,
    label: 'Paper - Practice Run'
  }
};
const MIN_RR = 2;
function getRiskAmount(accountType, buffer) {
  const cfg = PHASE_CONFIG[accountType] || PHASE_CONFIG.challenge;
  return Math.max(buffer, 0) * cfg.riskPct;
}
const CAPITAL_TIERS = [{
  key: 'nano',
  floor: 100,
  label: 'Nano'
}, {
  key: 'micro',
  floor: 1000,
  label: 'Micro'
}, {
  key: 'mini',
  floor: 10000,
  label: 'Mini'
}];
function getContractPlan(buffer, marketKey) {
  const b = Math.max(buffer, 0);
  const spec = MARKET_SPECS[marketKey] || MARKET_SPECS.nasdaq100;
  const minBuffer = spec.minBuffer || 100;
  if (b < minBuffer) return {
    tier: 'none',
    count: 0,
    label: 'Below $' + minBuffer.toLocaleString() + ' - no trade unlocked'
  };
  let tier = CAPITAL_TIERS[0];
  for (let i = CAPITAL_TIERS.length - 1; i >= 0; i--) {
    if (b >= CAPITAL_TIERS[i].floor) {
      tier = CAPITAL_TIERS[i];
      break;
    }
  }
  const count = Math.floor(b / tier.floor);
  return {
    tier: tier.key,
    count: count,
    label: count + ' ' + tier.label + (count > 1 ? 's' : '')
  };
}
const MARKET_SPECS = {
  nasdaq100: {
    label: 'Nasdaq 100',
    nanoTicker: 'NNQ',
    nanoPt: 0.20,
    microTicker: 'MNQ',
    microPt: 2.00,
    miniTicker: 'NQ',
    miniPt: 20.00
  },
  sp500: {
    label: 'S&P 500',
    nanoTicker: 'NES',
    nanoPt: 0.50,
    microTicker: 'MES',
    microPt: 5.00,
    miniTicker: 'ES',
    miniPt: 50.00
  },
  russell2000: {
    label: 'Russell 2000',
    nanoTicker: 'N2K',
    nanoPt: 0.50,
    microTicker: 'M2K',
    microPt: 5.00,
    miniTicker: 'RTY',
    miniPt: 50.00
  },
  dow: {
    label: 'Dow Jones',
    nanoTicker: 'NDOW',
    nanoPt: 0.05,
    microTicker: 'MYM',
    microPt: 0.50,
    miniTicker: 'YM',
    miniPt: 5.00
  },
  gold: {
    label: 'Gold',
    nanoTicker: '1OZ',
    nanoPt: 1.00,
    microTicker: 'MGC',
    microPt: 10.00,
    miniTicker: 'GC',
    miniPt: 100.00
  },
  crudeoil: {
    label: 'Crude Oil',
    nanoTicker: 'TCL',
    nanoPt: 10.00,
    microTicker: 'MCL',
    microPt: 100.00,
    miniTicker: 'CL',
    miniPt: 1000.00
  },
  // Silver has no $100 nano contract - the smallest tradable size (SIC) needs a $1,000 buffer minimum.
  silver: {
    label: 'Silver',
    nanoTicker: null,
    nanoPt: null,
    microTicker: 'SIC',
    microPt: 100.00,
    miniTicker: 'SIL',
    miniPt: 1000.00,
    minBuffer: 1000
  }
};
function getMaxStopPoints(marketKey, accountType) {
  const cfg = PHASE_CONFIG[accountType] || PHASE_CONFIG.challenge;
  const spec = MARKET_SPECS[marketKey] || MARKET_SPECS.nasdaq100;
  if (spec.nanoTicker && spec.nanoPt) return cfg.riskPct * (100 / spec.nanoPt);
  // No nano tier (Silver): base the locked stop on the smallest tier that exists, the $1,000 micro.
  return cfg.riskPct * (1000 / spec.microPt);
}
function getTickerForTier(marketKey, tier) {
  const spec = MARKET_SPECS[marketKey] || MARKET_SPECS.nasdaq100;
  if (tier === 'nano') return spec.nanoTicker || '-';
  if (tier === 'micro') return spec.microTicker || '-';
  if (tier === 'mini') return spec.miniTicker || '-';
  return '-';
}

// Many prop firms (e.g. MFFU's Rapid EOD) require a minimum number of days
// actually traded before a pass/payout request is even eligible, separate
// from whether the profit target has been hit - counts unique trading days
// for this specific account.
function getTradingDaysCount(entries, accountId) {
  const dates = entries.filter(function (e) {
    return e.accountId === accountId && e.tradedToday !== 'no';
  }).map(function (e) {
    return e.date;
  });
  return new Set(dates).size;
}
function getCumulativeProfitBefore(entries, accountId, dateStr) {
  return entries.filter(function (e) {
    return e.accountId === accountId && e.tradedToday !== 'no' && e.date < dateStr;
  }).reduce(function (sum, e) {
    return sum + e.trades.reduce(function (s, t) {
      return s + tradeSignedPnl(t);
    }, 0);
  }, 0);
}
function getConsistencyCap(account, cumulativeBefore) {
  const pct = parseFloat(account.consistencyPct);
  if (!pct || pct <= 0 || pct >= 100 || cumulativeBefore <= 0) return null;
  const p = pct / 100;
  return p * cumulativeBefore / (1 - p);
}

// The 4 confirmed real-world payout mechanisms, checked against actual prop
// firm help-center wording (MFFU, Tradeify, Apex, TopStep, Phidias). Every
// account picks exactly one - "simple" is the default so existing accounts
// (saved before this taxonomy existed) keep working unchanged.
const PAYOUT_TYPES = [{
  key: 'simple',
  label: 'Simple Threshold',
  firms: 'MFFU Rapid EOD, DayTraders',
  desc: "Clear a buffer once, then a flat $ amount per payout after that - often uncapped."
}, {
  key: 'streak',
  label: 'Winning-Days Streak',
  firms: 'Tradeify Flex, Apex, TopStep',
  desc: 'Log a set number of days each at or above a minimum profit, then the payout is a % of total profit (or a flat cap).'
}, {
  key: 'formula',
  label: 'Cycle Formula + Buffer Floor',
  firms: 'Tradeify Daily',
  desc: "Payout = this cycle's profit x a multiplier, capped, and never lets the account dip below its buffer."
}, {
  key: 'twoleg',
  label: 'Two-Leg Flat',
  firms: 'Phidias E2L',
  desc: 'Hit the same profit target twice - the first clears the eval, the second pays a flat cash amount plus live-account credit.'
}];

// Whether an account actually has enough of its chosen payout type's fields
// filled in to compute anything - each type has its own "is this configured"
// bar, since they don't share the same required fields.
function payoutRulesConfigured(account) {
  if (!account) return false;
  const type = account.payoutType || 'simple';
  if (type === 'streak') return (parseFloat(account.streakDays) || 0) > 0 && (parseFloat(account.streakPctOfTotal) || 0) > 0;
  if (type === 'formula') return (parseFloat(account.formulaBuffer) || 0) > 0;
  if (type === 'twoleg') return (parseFloat(account.twoLegTarget) || 0) > 0;
  return (parseFloat(account.payoutBuffer) || 0) > 0 || (parseFloat(account.payoutThreshold) || 0) > 0;
}

// Tracks progress toward the NEXT payout, dispatched by the account's payout
// type (see PAYOUT_TYPES above). Every branch returns the SAME shape -
// { type, eligible, requestable, progressPct, progressLabel, note, split,
// cap, isFirstPayout, liveCredit } - so the UI can render any of the 4
// mechanisms generically. Returns null when this account has no payout rules
// configured yet, or is a Challenge (no payouts on a Challenge).
function getPayoutStatus(account, entries) {
  if (!account || account.accountType === 'challenge') return null;
  if (!payoutRulesConfigured(account)) return null;
  const type = account.payoutType || 'simple';
  const payouts = (account.payouts || []).slice().sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });
  const lastPayout = payouts.length ? payouts[payouts.length - 1] : null;
  const windowStart = lastPayout ? lastPayout.date : null;
  const isFirstPayout = !lastPayout;
  const accEntries = entries.filter(function (e) {
    return e.accountId === account.id && e.tradedToday !== 'no';
  });
  const cycleEntries = windowStart ? accEntries.filter(function (e) {
    return e.date > windowStart;
  }) : accEntries;
  const dayPnl = function (e) {
    return e.trades.reduce(function (s, t) {
      return s + tradeSignedPnl(t);
    }, 0);
  };
  const cycleProfit = cycleEntries.reduce(function (s, e) {
    return s + dayPnl(e);
  }, 0);
  const totalPnl = accEntries.reduce(function (s, e) {
    return s + dayPnl(e);
  }, 0);

  // ---- Winning-Days Streak (Tradeify Flex, Apex, TopStep) ----
  if (type === 'streak') {
    const dayMin = parseFloat(account.streakDayMin) || 0;
    const byDate = {};
    cycleEntries.forEach(function (e) {
      byDate[e.date] = (byDate[e.date] || 0) + dayPnl(e);
    });
    const qualifyingDays = Object.keys(byDate).filter(function (d) {
      return byDate[d] >= dayMin;
    }).length;
    const need = parseInt(account.streakDays) || 0;
    const daysEligible = need > 0 ? qualifyingDays >= need : true;
    const pctAmount = totalPnl * ((parseFloat(account.streakPctOfTotal) || 0) / 100);
    const cap = account.streakFlatCap ? parseFloat(account.streakFlatCap) : null;
    const rawRequestable = cap !== null ? Math.min(Math.max(pctAmount, 0), cap) : Math.max(pctAmount, 0);
    const eligible = daysEligible && rawRequestable > 0;
    return {
      type: type,
      eligible: eligible,
      requestable: eligible ? rawRequestable : 0,
      progressPct: need > 0 ? Math.min(100, qualifyingDays / need * 100) : 0,
      progressLabel: qualifyingDays + ' of ' + need + ' qualifying days (each >= ' + fmt(dayMin) + ')',
      note: eligible ? 'Streak cleared - ' + fmt(rawRequestable) + ' available (' + (parseFloat(account.streakPctOfTotal) || 0) + '% of total profit' + (cap !== null ? ', capped at ' + fmt(cap) : '') + ').' : qualifyingDays + ' of ' + need + ' qualifying days logged so far - each needs at least ' + fmt(dayMin) + ' net profit to count.',
      split: null,
      cap: cap,
      isFirstPayout: isFirstPayout,
      liveCredit: null
    };
  }

  // ---- Cycle Formula + Buffer Floor (Tradeify Daily) ----
  if (type === 'formula') {
    const buffer = parseFloat(account.formulaBuffer) || 0;
    const bufferCleared = totalPnl >= buffer;
    const mult = parseFloat(account.formulaMultiplier) || 2;
    const raw = cycleProfit * mult;
    const cap = account.formulaCap ? parseFloat(account.formulaCap) : null;
    const minPay = parseFloat(account.formulaMinPayout) || 0;
    let payable = cap !== null ? Math.min(Math.max(raw, 0), cap) : Math.max(raw, 0);
    const currentBalance = (parseFloat(account.startingBalance) || 0) + totalPnl;
    const bufferPoint = (parseFloat(account.startingBalance) || 0) + buffer;
    payable = Math.min(payable, Math.max(currentBalance - bufferPoint, 0));
    const eligible = bufferCleared && cycleProfit > 0 && payable >= minPay;
    const amountRemaining = Math.max(0, buffer - totalPnl);
    return {
      type: type,
      eligible: eligible,
      requestable: eligible ? payable : 0,
      progressPct: buffer > 0 ? Math.min(100, totalPnl / buffer * 100) : 0,
      progressLabel: fmt(Math.max(0, totalPnl)) + ' of ' + fmt(buffer) + ' (buffer)',
      note: !bufferCleared ? fmt(amountRemaining) + ' more net profit needed to clear the buffer.' : eligible ? 'Cycle profit ' + fmt(cycleProfit) + ' x ' + mult + ' = ' + fmt(payable) + ' available.' : "Buffer cleared, but this cycle's payout (" + fmt(payable) + ') is below the ' + fmt(minPay) + ' minimum.',
      split: null,
      cap: cap,
      isFirstPayout: isFirstPayout,
      liveCredit: null
    };
  }

  // ---- Two-Leg Flat (Phidias E2L) ----
  if (type === 'twoleg') {
    const target = parseFloat(account.twoLegTarget) || 0;
    const legsCleared = target > 0 ? Math.floor(totalPnl / target) : 0;
    const eligible = legsCleared >= 2;
    const cash = parseFloat(account.twoLegCashPayout) || 0;
    const credit = parseFloat(account.twoLegLiveCredit) || 0;
    return {
      type: type,
      eligible: eligible,
      requestable: eligible ? cash : 0,
      progressPct: target > 0 ? Math.min(100, totalPnl / (target * 2) * 100) : 0,
      progressLabel: 'Leg ' + Math.min(legsCleared + 1, 2) + ' of 2',
      note: legsCleared === 0 ? 'Leg 1 (eval): ' + fmt(Math.max(0, target - totalPnl)) + ' more needed.' : legsCleared === 1 ? 'Leg 1 cleared. Leg 2 (cash): ' + fmt(Math.max(0, target * 2 - totalPnl)) + ' more needed.' : 'Both legs cleared - ' + fmt(cash) + ' cash + ' + fmt(credit) + ' live-account credit.',
      split: null,
      cap: null,
      isFirstPayout: isFirstPayout,
      liveCredit: credit
    };
  }

  // ---- Simple Threshold (MFFU Rapid EOD, DayTraders) - the default ----
  const buffer = parseFloat(account.payoutBuffer) || 0;
  const threshold = parseFloat(account.payoutThreshold) || 0;
  const targetAmount = isFirstPayout ? buffer : threshold || buffer;
  const netProfit = cycleProfit;
  const amountRemaining = Math.max(0, targetAmount - netProfit);
  const progressPct = targetAmount > 0 ? Math.min(100, netProfit / targetAmount * 100) : 0;
  const minDays = account.minQualifyingDays ? parseFloat(account.minQualifyingDays) : 0;
  const qualifyingDays = new Set(cycleEntries.map(function (e) {
    return e.date;
  })).size;
  const daysRemaining = Math.max(0, minDays - qualifyingDays);
  const moneyEligible = targetAmount > 0 ? netProfit >= targetAmount : true;
  const daysEligible = minDays > 0 ? qualifyingDays >= minDays : true;
  const eligible = moneyEligible && daysEligible;
  const split = account.profitSplit ? parseFloat(account.profitSplit) : 100;
  let requestable = netProfit > 0 ? netProfit * (split / 100) : 0;
  const cap = account.payoutCap ? parseFloat(account.payoutCap) : null;
  if (cap && requestable > cap) requestable = cap;

  // Pace projection: average net $/trading day across this account's whole
  // history, used to guess how many more sessions at that pace it takes to
  // close the remaining gap - a rough ETA, not a promise.
  const totalDays = new Set(accEntries.map(function (e) {
    return e.date;
  })).size;
  const avgPerDay = totalDays > 0 ? totalPnl / totalDays : 0;
  const projectedDaysToTarget = amountRemaining > 0 && avgPerDay > 0 ? Math.ceil(amountRemaining / avgPerDay) : null;
  return {
    type: 'simple',
    eligible: eligible,
    requestable: eligible ? requestable : 0,
    progressPct: progressPct,
    progressLabel: fmt(Math.max(0, netProfit)) + ' of ' + fmt(targetAmount) + (isFirstPayout ? ' (first payout buffer)' : ' (since last payout)'),
    note: !moneyEligible ? fmt(amountRemaining) + ' more net profit needed' + (!daysEligible ? ', and ' + daysRemaining + ' more qualifying day' + (daysRemaining !== 1 ? 's' : '') : '') + '.' + (projectedDaysToTarget ? ' At your current pace, about ' + projectedDaysToTarget + ' more trading day' + (projectedDaysToTarget !== 1 ? 's' : '') + '.' : '') : !daysEligible ? daysRemaining + ' more qualifying day' + (daysRemaining !== 1 ? 's' : '') + ' needed.' : isFirstPayout ? 'First payout buffer cleared.' : "This payout's threshold cleared.",
    split: split,
    cap: cap,
    isFirstPayout: isFirstPayout,
    liveCredit: null
  };
}

// Before you have any trading history, there is no real cap yet (math needs
// past profit to work with). This gives a starter number instead of nothing,
// based on your profit target, so the number on screen is always useful.
function getConsistencyGuideline(account) {
  const pct = parseFloat(account.consistencyPct);
  const target = parseFloat(account.profitTarget) || 0;
  if (!pct || pct <= 0 || pct >= 100 || target <= 0) return null;
  return pct / 100 * target;
}
const computeStatus = function (account, buffer, totalPnl) {
  const target = parseFloat(account.profitTarget) || 0;
  if (buffer <= 0) return 'breached';
  if (target > 0 && totalPnl >= target) {
    return account.accountType === 'challenge' ? 'passed' : 'target-hit';
  }
  return 'active';
};

// Pure, top-level so both the component and aggregate calculations (which need to
// know if an account is breached before deciding whether to count its trades) can
// use the exact same math as what's shown on screen.
const calcBufferHistory = function (account, accEntries) {
  if (!account) return [];
  const dtype = account.drawdownType || 'static';
  const maxDD = parseFloat(account.maxDrawdown) || 0;
  const traded = accEntries.filter(function (e) {
    return e.tradedToday !== 'no';
  });
  const chronological = traded.slice().sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });
  let pool = maxDD;
  let peak = maxDD;
  const history = [];
  chronological.forEach(function (entry) {
    const dayPnl = entry.trades.reduce(function (s, t) {
      return s + tradeSignedPnl(t);
    }, 0);
    if (dtype === 'intraday') {
      entry.trades.forEach(function (t) {
        const val = Math.abs(parseFloat(t.pnl) || 0);
        pool = pool + (t.result === 'win' ? val : -val);
        if (pool > peak) peak = pool;
      });
    } else {
      pool = pool + dayPnl;
      if (dtype === 'eod' && pool > peak) peak = pool;
    }
    const floor = peak - maxDD;
    const buffer = pool - floor;
    history.push({
      date: entry.date,
      buffer: buffer,
      pnl: dayPnl
    });
  });
  return history;
};
const computeAccountStatus = function (account, allEntries) {
  const accE = allEntries.filter(function (e) {
    return e.accountId === account.id;
  });
  // A brand-new account with no logged days at all cannot possibly be
  // breached - breaching only happens through logged trading losses over
  // time, so this guards against ever mis-flagging a fresh account as
  // breached due to any data quirk in the buffer calculation.
  if (accE.length === 0) return 'active';
  const hist = calcBufferHistory(account, accE);
  const buf = hist.length > 0 ? hist[hist.length - 1].buffer : parseFloat(account.maxDrawdown) || 0;
  const traded = accE.filter(function (e) {
    return e.tradedToday !== 'no';
  });
  const pnl = traded.reduce(function (sum, e) {
    return sum + e.trades.reduce(function (s, t) {
      return s + tradeSignedPnl(t);
    }, 0);
  }, 0);
  return computeStatus(account, buf, pnl);
};
const isArchived = function (account, status) {
  return status === 'breached' || account.archived === true;
};
const STATUS_STYLES = {
  active: {
    label: 'Active',
    cls: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
  },
  passed: {
    label: 'Passed',
    cls: 'bg-green-500/15 text-green-300 border-green-500/30'
  },
  'target-hit': {
    label: 'Target Hit',
    cls: 'bg-green-500/15 text-green-300 border-green-500/30'
  },
  breached: {
    label: 'Breached',
    cls: 'bg-red-500/15 text-red-300 border-red-500/30'
  }
};
const ACCOUNT_TYPES = [{
  key: 'challenge',
  label: 'Challenge',
  activeCls: 'bg-purple-500/20 text-purple-400 border-purple-500/40'
}, {
  key: 'funded',
  label: 'Funded',
  activeCls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
}, {
  key: 'live',
  label: 'Live',
  activeCls: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
}, {
  key: 'paper',
  label: 'Paper',
  activeCls: 'bg-blue-500/20 text-blue-400 border-blue-500/40'
}];
const ACCOUNT_BADGE_CLS = {
  challenge: 'bg-purple-500/20 text-purple-300',
  funded: 'bg-emerald-500/20 text-emerald-300',
  live: 'bg-cyan-500/20 text-cyan-300',
  paper: 'bg-blue-500/20 text-blue-300',
  breached: 'bg-red-500/20 text-red-300'
};
const BIAS_OPTIONS = [{
  key: 'bullish',
  label: 'Bullish',
  icon: 'TrendingUp',
  cls: 'bg-green-500/20 text-green-400 border-green-500/40'
}, {
  key: 'bearish',
  label: 'Bearish',
  icon: 'TrendingDown',
  cls: 'bg-red-500/20 text-red-400 border-red-500/40'
}, {
  key: 'neutral',
  label: 'Neutral/Range',
  icon: 'Minus',
  cls: 'bg-gray-600/30 text-gray-300 border-gray-500/40'
}];
const NO_TRADE_REASONS = [{
  key: 'no-setup',
  label: 'No Setup Found'
}, {
  key: 'did-not-trade',
  label: 'Did Not Trade'
}, {
  key: 'other',
  label: 'Other'
}];
const DRAWDOWN_TYPES = [{
  key: 'static',
  short: 'Static',
  label: 'Static (fixed from starting capital)'
}, {
  key: 'eod',
  short: 'EOD Trailing',
  label: 'EOD Trailing (trails end-of-day close)'
}, {
  key: 'intraday',
  short: 'Intraday Trailing',
  label: 'Intraday Trailing (trails every trade)'
}];
const MARKET_OPTIONS = [{
  key: 'nasdaq100',
  label: 'Nasdaq 100'
}, {
  key: 'sp500',
  label: 'S&P 500'
}, {
  key: 'russell2000',
  label: 'Russell 2000'
}, {
  key: 'dow',
  label: 'Dow Jones'
}, {
  key: 'gold',
  label: 'Gold'
}, {
  key: 'crudeoil',
  label: 'Crude Oil'
}, {
  key: 'silver',
  label: 'Silver (min. $1,000 buffer)'
}];
const emptyAccountForm = {
  name: '',
  startingBalance: '',
  maxDrawdown: '',
  profitTarget: '',
  rewardRatio: '2.5',
  accountType: 'challenge',
  market: 'nasdaq100',
  drawdownType: 'static',
  copiedAccountNumber: '',
  linkedFromId: null,
  linkedFromLabel: '',
  strategyName: '',
  longRules: [''],
  shortRules: [''],
  accountCost: '',
  activationCost: '',
  resetCost: '',
  consistencyPct: '',
  dailyLossLimit: '',
  dllType: 'hard',
  minTradingDays: '',
  payoutType: 'simple',
  payoutBuffer: '',
  payoutThreshold: '',
  profitSplit: '',
  minQualifyingDays: '',
  payoutCap: '',
  streakDays: '',
  streakDayMin: '',
  streakPctOfTotal: '',
  streakFlatCap: '',
  formulaBuffer: '',
  formulaMultiplier: '2',
  formulaCap: '',
  formulaMinPayout: '',
  twoLegTarget: '',
  twoLegCashPayout: '',
  twoLegLiveCredit: ''
};
const emptyMentalCheck = function () {
  return {
    marketAwareness: 5,
    riskRespect: 5,
    humility: 5,
    mindset: 5,
    sleep: 7,
    energy: 7,
    focus: 7,
    stress: 3
  };
};
const emptyDailyPlan = function (defaultRisk, defaultRR) {
  return {
    riskAmount: defaultRisk ? defaultRisk.toFixed(2) : '',
    targetProfit: '',
    maxTrades: '3',
    plannedTrades: '2',
    riskRewardRatio: defaultRR ? String(defaultRR) : '',
    maxLossPerDay: '',
    startTime: '',
    endTime: '',
    notes: ''
  };
};
const emptyReflection = function () {
  return {
    wentWrong: '',
    wentRight: '',
    lessonsLearned: '',
    improvementPlan: '',
    emotionalState: 'neutral',
    marketConditions: ''
  };
};
const emptyEntryForm = function (defaultRisk, defaultContracts, defaultRR, planTemplate, mentalCheckSource) {
  return {
    date: new Date().toISOString().split('T')[0],
    tradedToday: 'yes',
    noTradeReason: '',
    noTradeNotes: '',
    dailyBias: 'neutral',
    exercised: false,
    strategyId: 'default',
    trades: [{
      result: 'win',
      pnl: '',
      direction: 'long',
      rulesChecked: [],
      positionSize: defaultContracts ? String(defaultContracts) : '',
      riskAmount: defaultRisk ? defaultRisk.toFixed(2) : '',
      htfLtf: false,
      chartUrl: '',
      stopHandling: 'respected',
      revengeEntry: false
    }],
    notes: '',
    // Pre-session mental check is filled out on its own page now, not in this
    // modal - whatever was saved there for today carries straight through.
    mentalCheck: mentalCheckSource ? Object.assign({}, emptyMentalCheck(), mentalCheckSource) : emptyMentalCheck(),
    // If the trader has set a Daily Plan template on the account (Daily Plan
    // page), use it as the starting point for today's plan instead of a blank
    // one - that's what lets setting it once cover a whole week/month/year.
    dailyPlan: planTemplate ? Object.assign({}, emptyDailyPlan(defaultRisk, defaultRR), planTemplate) : emptyDailyPlan(defaultRisk, defaultRR),
    reflection: emptyReflection()
  };
};

// A strategy is a named set of long/short entry rules. Older accounts only ever
// had one rule set stored directly on the account - this treats that as an
// implicit "Default Strategy" so nothing breaks, while accounts.strategies
// (once someone adds more) holds any additional named strategies.
const getStrategies = function (account) {
  const extra = account.strategies || [];
  const defaultStrategy = {
    id: 'default',
    name: account.strategyName || 'Default Strategy',
    longRules: account.longRules || [],
    shortRules: account.shortRules || []
  };
  return [defaultStrategy].concat(extra);
};
const emptyStrategyForm = {
  name: '',
  longRules: [''],
  shortRules: ['']
};

// Resolves the actual rule list for a trade based on which strategy was
// selected for that day (entry.strategyId), not just the account's single
// legacy rule set - so multiple named strategies can coexist on one account.
const getApplicableRules = function (trade, entry, account) {
  const strategies = getStrategies(account);
  const strategy = strategies.find(function (s) {
    return s.id === (entry.strategyId || 'default');
  }) || strategies[0];
  const rules = trade.direction === 'long' ? strategy.longRules || [] : strategy.shortRules || [];
  return rules.filter(function (r) {
    return r && r.trim();
  });
};
function AuthScreen(props) {
  const language = props.language;
  const setLanguage = props.setLanguage;
  const wantsCourse = props.wantsCourse;
  const fromDiagnostic = props.fromDiagnostic;
  const [mode, setMode] = useState(wantsCourse || props.wantsSignup ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [showInstall, setShowInstall] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async function () {
    setError('');
    setInfo('');
    if (!email || !password) {
      setError('Enter email and password.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        if (displayName) await cred.user.updateProfile({
          displayName: displayName
        });
      } else {
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (e) {
      setError(e.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  // A registered user's trading history should never be out of reach just
  // because a password was forgotten - this sends Firebase's own reset email
  // so they can get back into their real account instead of being stuck.
  const handleForgotPassword = async function () {
    setError('');
    setInfo('');
    if (!email) {
      setError('Enter your email above first, then tap "Forgot password?".');
      return;
    }
    setLoading(true);
    try {
      await auth.sendPasswordResetEmail(email);
      setInfo('Password reset email sent to ' + email + ' - check your inbox (and spam folder).');
    } catch (e) {
      setError(e.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-black text-white flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-sm bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-2xl p-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("a", {
    href: "../",
    className: "inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-yellow-400 border border-gray-700 rounded-lg px-2.5 py-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Home",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Home")), /*#__PURE__*/React.createElement(LanguageSwitcher, {
    language: language,
    setLanguage: setLanguage
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center mb-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./logo-wordmark.png",
    alt: "MMM Pro Journal",
    className: "h-20 w-auto rounded-xl border border-yellow-500/20"
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500 text-sm text-center mb-4"
  }, mode === 'login' ? 'Sign in to your account' : 'Create your account'), fromDiagnostic && /*#__PURE__*/React.createElement("div", {
    className: "bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2.5 mb-4 flex items-start gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ClipboardCheck",
    className: "h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-yellow-200/90"
  }, mode === 'login' ? 'Sign in to' : 'Create a free account to', " unlock your Trading Discipline Test result - your score and advice are waiting and will be saved in your journal.")), wantsCourse && /*#__PURE__*/React.createElement("div", {
    className: "bg-teal-500/10 border border-teal-500/30 rounded-lg px-3 py-2.5 mb-4 flex items-start gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "GraduationCap",
    className: "h-4 w-4 text-teal-400 flex-shrink-0 mt-0.5"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-teal-200/90"
  }, mode === 'login' ? 'Sign in to' : 'Create a free account to', " start the MMM Mastery Course - it's free, and your progress is saved to your account.")), mode === 'signup' && /*#__PURE__*/React.createElement("input", {
    value: displayName,
    onChange: function (e) {
      setDisplayName(e.target.value);
    },
    placeholder: "Your name",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 mb-3 focus:border-yellow-400/50 outline-none"
  }), /*#__PURE__*/React.createElement("input", {
    value: email,
    onChange: function (e) {
      setEmail(e.target.value);
    },
    placeholder: "Email",
    type: "email",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 mb-3 focus:border-yellow-400/50 outline-none"
  }), /*#__PURE__*/React.createElement("input", {
    value: password,
    onChange: function (e) {
      setPassword(e.target.value);
    },
    placeholder: "Password",
    type: "password",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 mb-3 focus:border-yellow-400/50 outline-none"
  }), error && /*#__PURE__*/React.createElement("p", {
    className: "text-red-400 text-xs mb-3"
  }, error), info && /*#__PURE__*/React.createElement("p", {
    className: "text-green-400 text-xs mb-3"
  }, info), /*#__PURE__*/React.createElement("button", {
    onClick: handleSubmit,
    disabled: loading,
    className: "w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2.5 rounded-lg font-semibold disabled:opacity-50 mb-3"
  }, loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'), mode === 'login' && /*#__PURE__*/React.createElement("button", {
    onClick: handleForgotPassword,
    disabled: loading,
    className: "w-full text-center text-xs text-gray-500 hover:text-yellow-400 mb-3"
  }, "Forgot password?"), /*#__PURE__*/React.createElement("p", {
    className: "text-center text-sm text-gray-500"
  }, mode === 'login' ? "Don't have an account?" : "Already have an account?", ' ', /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setMode(mode === 'login' ? 'signup' : 'login');
      setError('');
      setInfo('');
    },
    className: "text-yellow-400 hover:underline"
  }, mode === 'login' ? 'Sign up' : 'Sign in')), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setShowInstall(true);
    },
    className: "w-full text-center text-xs text-gray-600 hover:text-gray-400 mt-4 flex items-center justify-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Smartphone",
    className: "h-3 w-3"
  }), /*#__PURE__*/React.createElement("span", null, "Put MMM Pro Journal on your phone"))), showInstall && /*#__PURE__*/React.createElement(InstallAppModal, {
    onClose: function () {
      setShowInstall(false);
    }
  }));
}
function EditableName(props) {
  const user = props.user;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [override, setOverride] = useState(null);
  const [saving, setSaving] = useState(false);
  const currentLabel = override || user.displayName || user.email;
  const startEdit = function () {
    setDraft(override || user.displayName || '');
    setEditing(true);
  };
  const save = async function () {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await auth.currentUser.updateProfile({
        displayName: trimmed
      });
      await db.collection('leaderboard').doc(user.uid).set({
        displayName: trimmed
      }, {
        merge: true
      });
      setOverride(trimmed);
      setEditing(false);
    } catch (e) {
      console.error('name update error:', e.code, e.message);
    }
    setSaving(false);
  };
  if (editing) {
    return /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("input", {
      value: draft,
      onChange: function (e) {
        setDraft(e.target.value);
      },
      placeholder: "Your name",
      className: "bg-gray-800 border border-gray-700 text-white rounded px-2 py-0.5 text-sm w-32 focus:border-yellow-400/50 outline-none"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: save,
      disabled: saving || !draft.trim(),
      className: "text-green-400 hover:underline disabled:opacity-40 text-sm"
    }, "Save"), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        setEditing(false);
      },
      className: "text-gray-500 hover:text-gray-300 text-sm"
    }, "Cancel"));
  }
  return /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, currentLabel), /*#__PURE__*/React.createElement("button", {
    onClick: startEdit,
    className: "text-gray-500 hover:text-yellow-400",
    title: "Edit display name"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Pencil",
    className: "h-3 w-3"
  })));
}
function UserCounters() {
  const [total, setTotal] = useState(null);
  const [online, setOnline] = useState(null);
  useEffect(function () {
    let unsub = null;
    let retryTimer = null;
    function subscribe() {
      unsub = db.collection('presence').onSnapshot(function (snap) {
        const now = Date.now();
        let onlineCount = 0;
        snap.forEach(function (doc) {
          const data = doc.data();
          const lastSeen = data.lastSeen && data.lastSeen.toMillis ? data.lastSeen.toMillis() : now;
          if (now - lastSeen < 60000) onlineCount++;
        });
        setTotal(snap.size);
        setOnline(onlineCount);
      }, function (err) {
        console.error('presence listener error:', err.code, err.message);
        setTotal(null);
        setOnline(null);
        if (unsub) {
          unsub();
          unsub = null;
        }
        retryTimer = setTimeout(subscribe, 5000);
      });
    }
    subscribe();
    return function () {
      if (unsub) unsub();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);
  if (total === null) return null;
  return /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-2 ml-2 align-middle"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 text-xs text-gray-400"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-white"
  }), total), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 text-xs text-gray-400"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-green-400"
  }), online));
}
function SystemExplainer() {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-xl overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-start gap-3 p-4 text-left"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Zap",
    className: "h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-yellow-100/80"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-400 font-semibold"
  }, "Charter: "), "Risk is fixed by Phase - ", /*#__PURE__*/React.createElement("span", {
    className: "text-white font-medium"
  }, "10% Speed Mode"), " (Challenge / Funded) or", /*#__PURE__*/React.createElement("span", {
    className: "text-white font-medium"
  }, " 2% Preservation Mode"), " (Live). Every trade targets your account's reward-to-risk (minimum ", MIN_RR, ":1). Max 3 trades/day, tie-breaker mandatory on a 1-1 split.", /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-400 underline ml-1"
  }, open ? 'Hide details' : 'What does this mean?'))), /*#__PURE__*/React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "px-4 pb-4 space-y-3 text-sm text-gray-300 border-t border-yellow-500/20 pt-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-yellow-400 font-semibold mb-1"
  }, "Capital = Drawdown Buffer"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400"
  }, "Your Capital is strictly your drawdown buffer, not the nominal account size. Risk is calculated as a fixed percentage of this buffer.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-blue-400 font-semibold mb-1"
  }, "Capital Sizing Lock"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400"
  }, "You don't choose your contract size - your Capital does. $100 unlocks 1 Nano, $1,000 unlocks 1 Micro, $10,000 unlocks 1 Mini.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-red-400 font-semibold mb-1"
  }, "Locked Maximum Stop Loss"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400"
  }, "Because capital tiers and point-values scale together, your max stop in points never changes for a market and phase. If the chart needs a wider stop, you skip the trade.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-purple-400 font-semibold mb-1"
  }, "Daily Execution Matrix"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400"
  }, "2 losses = circuit breaker, day over. 2 wins = greed filter, day over. A 1-1 split forces a mandatory Trade 3 tie-breaker.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-orange-400 font-semibold mb-1"
  }, "Prop Firm Rules (optional, per account)"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400"
  }, "Consistency % caps how much of your total profit a single day can represent. Daily Loss Limit is separate from your Capital and resets every day - some firms hard-breach it, others soft-breach."))));
}
function t_border(key) {
  if (key === 'challenge') return 'bg-purple-500/10 border-purple-500/40';
  if (key === 'funded') return 'bg-emerald-500/10 border-emerald-500/40';
  if (key === 'breached') return 'bg-red-500/10 border-red-500/40';
  if (key === 'paper') return 'bg-blue-500/10 border-blue-500/40';
  return 'bg-cyan-500/10 border-cyan-500/40';
}
const NAV_GROUPS = ACCOUNT_TYPES.concat([{
  key: 'breached',
  label: 'Breached',
  activeCls: 'bg-red-500/20 text-red-400 border-red-500/40'
}]);
const PAGE_TABS = [{
  key: 'overview',
  label: 'Overview',
  icon: 'LayoutDashboard'
}, {
  key: 'dailyplan',
  label: 'Daily Plan',
  icon: 'Calendar'
}, {
  key: 'mentalcheck',
  label: 'Mental Check',
  icon: 'Brain'
}, {
  key: 'flowstate',
  label: 'Flow State',
  icon: 'Waves'
}, {
  key: 'history',
  label: 'Trade History',
  icon: 'Calendar'
}, {
  key: 'reports',
  label: 'Reports',
  icon: 'BarChart3'
}, {
  key: 'discipline',
  label: 'Discipline',
  icon: 'ListChecks'
}, {
  key: 'psychology',
  label: 'Psychology',
  icon: 'HeartPulse'
}, {
  key: 'finances',
  label: 'Finances',
  icon: 'DollarSign'
}, {
  key: 'projections',
  label: 'Projections',
  icon: 'Target'
}, {
  key: 'strategy',
  label: 'Strategy',
  icon: 'BookOpen'
}];
function AccountGroupNav(props) {
  const accounts = props.accounts;
  const activeAccountId = props.activeAccountId;
  const onSelect = props.onSelect;
  const getStatus = props.getStatus;
  const filter = props.filter;
  const selectedIds = props.selectedIds;
  const onToggleAccount = props.onToggleAccount;
  const onToggleGroup = props.onToggleGroup;
  const onToggleAll = props.onToggleAll;
  const [openGroup, setOpenGroup] = useState(null);
  const nonBreachedTotal = accounts.filter(function (a) {
    return getStatus(a) !== 'breached';
  }).length;
  const allSelectedCount = accounts.filter(function (a) {
    return selectedIds.has(a.id);
  }).length;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-2 flex-wrap items-center"
  }, NAV_GROUPS.map(function (type) {
    const isBreachedGroup = type.key === 'breached';
    const allOfType = isBreachedGroup ? accounts.filter(function (a) {
      return getStatus(a) === 'breached';
    }) : accounts.filter(function (a) {
      return a.accountType === type.key && getStatus(a) !== 'breached';
    });
    const group = isBreachedGroup ? allOfType : filter === 'all' ? allOfType : allOfType.filter(function (a) {
      return !isArchived(a, getStatus(a));
    });
    const activeInGroup = isBreachedGroup ? allOfType.length : allOfType.filter(function (a) {
      return !isArchived(a, getStatus(a));
    }).length;
    const isOpen = openGroup === type.key;
    const groupSelectedCount = group.filter(function (a) {
      return selectedIds.has(a.id);
    }).length;
    const groupAllSelected = group.length > 0 && groupSelectedCount === group.length;
    if (isBreachedGroup && allOfType.length === 0) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: type.key,
      className: "relative"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        setOpenGroup(isOpen ? null : type.key);
      },
      className: "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition " + (isOpen ? t_border(type.key) : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700')
    }, /*#__PURE__*/React.createElement("span", {
      className: "px-1.5 py-0.5 rounded text-xs font-semibold " + ACCOUNT_BADGE_CLS[type.key]
    }, type.label), /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-gray-500"
    }, "(", activeInGroup, isBreachedGroup ? '' : ' Active', ")"), groupSelectedCount > 0 && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300"
    }, groupSelectedCount, " in view"), /*#__PURE__*/React.createElement(Icon, {
      name: isOpen ? "ChevronUp" : "ChevronDown",
      className: "h-3.5 w-3.5 text-gray-500"
    })), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "absolute z-40 mt-1 w-72 bg-black border border-gray-800 rounded-xl shadow-2xl p-2 max-h-80 overflow-y-auto"
    }, group.length === 0 && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-600 p-2"
    }, "No ", type.label.toLowerCase(), " accounts to show."), group.length > 0 && /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        onToggleGroup(group.map(function (a) {
          return a.id;
        }), !groupAllSelected);
      },
      className: "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-gray-900 border-b border-gray-800 mb-1"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: groupAllSelected ? "CheckSquare" : "Square",
      className: "h-3.5 w-3.5 flex-shrink-0 " + (groupAllSelected ? 'text-yellow-400' : 'text-gray-600')
    }), /*#__PURE__*/React.createElement("span", null, "Select all ", type.label.toLowerCase(), " for Overview/Equity Curve")), group.map(function (acc) {
      const st = getStatus(acc);
      const archived = isArchived(acc, st);
      const checked = selectedIds.has(acc.id);
      return /*#__PURE__*/React.createElement("div", {
        key: acc.id,
        className: "w-full flex items-center gap-1.5 px-1 py-0.5 rounded-lg " + (activeAccountId === acc.id ? 'bg-yellow-500/10' : '')
      }, /*#__PURE__*/React.createElement("button", {
        onClick: function (e) {
          e.stopPropagation();
          onToggleAccount(acc.id);
        },
        className: "p-1.5 flex-shrink-0",
        title: "Include in Overview/Equity Curve"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: checked ? "CheckSquare" : "Square",
        className: "h-3.5 w-3.5 " + (checked ? 'text-yellow-400' : 'text-gray-600')
      })), /*#__PURE__*/React.createElement("button", {
        onClick: function () {
          onSelect(acc.id, isBreachedGroup);
          setOpenGroup(null);
        },
        className: "flex-1 flex items-center justify-between px-2 py-1.5 rounded-lg text-sm text-left " + (archived ? 'opacity-40 ' : '') + (activeAccountId === acc.id ? 'text-yellow-300' : 'text-gray-300 hover:bg-gray-900')
      }, /*#__PURE__*/React.createElement("span", null, acc.name, " #", acc.accountNumber), archived && /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] text-red-400"
      }, "Archived")));
    })));
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onToggleAll,
    className: "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition " + (allSelectedCount === nonBreachedTotal && nonBreachedTotal > 0 ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: allSelectedCount === nonBreachedTotal && nonBreachedTotal > 0 ? "CheckSquare" : "Square",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "All Accounts (", allSelectedCount, " in view)")));
}
function RiskOfRuinCard(props) {
  const currentBuffer = props.currentBuffer;
  const divisor = props.divisor;
  const accountType = props.accountType;
  const [open, setOpen] = useState(false);
  const checkpoints = [5, 10, 15, 20, 25, 30, 40, 50].filter(function (n) {
    return n <= divisor * 2.5;
  });
  const rows = checkpoints.map(function (n) {
    const remaining = currentBuffer * Math.pow(1 - 1 / divisor, n);
    const pctRemaining = currentBuffer > 0 ? remaining / currentBuffer * 100 : 0;
    const recoveryPct = remaining > 0 ? (currentBuffer - remaining) / remaining * 100 : null;
    return {
      n: n,
      remaining: remaining,
      pctRemaining: pctRemaining,
      recoveryPct: recoveryPct
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between p-6 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "TrendingDown",
    className: "h-5 w-5 text-red-400"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Risk of Ruin"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Consecutive loss projection & gain needed to recover"))), /*#__PURE__*/React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-gray-500 flex-shrink-0"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "px-6 pb-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "Hypothetical: if every trade lost at the fixed Charter risk% for this phase."), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-sm"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-left text-gray-500 text-xs uppercase tracking-wide border-b border-gray-800"
  }, /*#__PURE__*/React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Consecutive Losses"), /*#__PURE__*/React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Buffer Remaining"), /*#__PURE__*/React.createElement("th", {
    className: "pb-2 pr-4"
  }, "% of Buffer Left"), /*#__PURE__*/React.createElement("th", {
    className: "pb-2"
  }, "Gain Needed to Recover"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(function (r) {
    return /*#__PURE__*/React.createElement("tr", {
      key: r.n,
      className: "border-b border-gray-800/50 last:border-0"
    }, /*#__PURE__*/React.createElement("td", {
      className: "py-2 pr-4 text-white font-medium"
    }, r.n, " losses"), /*#__PURE__*/React.createElement("td", {
      className: "py-2 pr-4 font-semibold " + (r.pctRemaining <= 20 ? 'text-red-400' : r.pctRemaining <= 50 ? 'text-yellow-400' : 'text-green-400')
    }, fmt(r.remaining)), /*#__PURE__*/React.createElement("td", {
      className: "py-2 pr-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-20 bg-gray-800 rounded-full h-1.5 overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full " + (r.pctRemaining <= 20 ? 'bg-red-400' : r.pctRemaining <= 50 ? 'bg-yellow-400' : 'bg-green-400'),
      style: {
        width: Math.max(r.pctRemaining, 2) + '%'
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "text-xs " + (r.pctRemaining <= 20 ? 'text-red-400' : r.pctRemaining <= 50 ? 'text-yellow-400' : 'text-green-400')
    }, r.pctRemaining.toFixed(1), "%"))), /*#__PURE__*/React.createElement("td", {
      className: "py-2"
    }, r.recoveryPct === null ? /*#__PURE__*/React.createElement("span", {
      className: "text-red-500 font-semibold"
    }, "Account wiped") : /*#__PURE__*/React.createElement("span", {
      className: "font-semibold " + (r.recoveryPct >= 100 ? 'text-red-400' : r.recoveryPct >= 40 ? 'text-yellow-400' : 'text-gray-300')
    }, "+", r.recoveryPct.toFixed(1), "% needed")));
  })))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600 mt-3"
  }, accountType === 'live' ? 'Live runs Preservation Mode (2%) - the buffer erodes much slower, protecting real capital.' : 'Challenge and Funded run Speed Mode (10%) - faster progress, faster erosion under a bad streak.')));
}
function DailyTradeMatrix(props) {
  const risk = props.riskUnit;
  const rr = props.rewardRatio;
  const reward = risk * rr;
  const scenarios = [{
    name: 'A - Perfect',
    trades: ['W', 'W', '-'],
    pnl: 2 * reward
  }, {
    name: 'B - Recovery',
    trades: ['L', 'W', 'W'],
    pnl: -risk + 2 * reward
  }, {
    name: 'C - Neutral',
    trades: ['L', 'W', 'L'],
    pnl: reward - 2 * risk
  }, {
    name: 'D - Save',
    trades: ['W', 'L', 'L'],
    pnl: reward - 2 * risk
  }, {
    name: 'E - Worst',
    trades: ['L', 'L', '-'],
    pnl: -2 * risk
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-black/40 border border-gray-800 rounded-xl p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "LayoutGrid",
    className: "h-4 w-4 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-semibold text-white"
  }, "Daily Trade Execution Matrix - your actual risk")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-3"
  }, "Max 3 trades - stop at 2 wins or 2 losses, mandatory Trade 3 on a tie. Built from this account's real risk (", fmt(risk), ") at ", rr, ":1 reward (", fmt(reward), ")."), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-xs"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-left text-gray-500 uppercase tracking-wide border-b border-gray-800"
  }, /*#__PURE__*/React.createElement("th", {
    className: "pb-1.5 pr-3"
  }, "Scenario"), /*#__PURE__*/React.createElement("th", {
    className: "pb-1.5 pr-3"
  }, "Trade 1"), /*#__PURE__*/React.createElement("th", {
    className: "pb-1.5 pr-3"
  }, "Trade 2"), /*#__PURE__*/React.createElement("th", {
    className: "pb-1.5 pr-3"
  }, "Trade 3"), /*#__PURE__*/React.createElement("th", {
    className: "pb-1.5"
  }, "Daily P&L"))), /*#__PURE__*/React.createElement("tbody", null, scenarios.map(function (s, i) {
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      className: "border-b border-gray-800/50 last:border-0"
    }, /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 pr-3 font-medium " + (s.pnl > 0 ? 'text-green-400' : s.pnl < 0 ? 'text-red-400' : 'text-gray-300')
    }, s.name), s.trades.map(function (t, ti) {
      return /*#__PURE__*/React.createElement("td", {
        key: ti,
        className: "py-1.5 pr-3"
      }, t === '-' ? /*#__PURE__*/React.createElement("span", {
        className: "text-gray-700"
      }, "-") : /*#__PURE__*/React.createElement("span", {
        className: t === 'W' ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'
      }, t, " ", t === 'W' ? '+' + fmt(reward) : '-' + fmt(risk)));
    }), /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 font-bold " + (s.pnl > 0 ? 'text-green-400' : s.pnl < 0 ? 'text-red-400' : 'text-gray-300')
    }, s.pnl >= 0 ? '+' : '', fmt(s.pnl)));
  })))));
}

// Shown once an account is breached - a specific, honest recap using the exact
// same discipline checklist as the rest of the app, scoped to just this account,
// plus a look at the actual day the buffer hit zero.
// Shows up only when the consistency rule is actually being violated right now
// - the forward-looking "Max Profit Allowed / Day" stat tells you what's safe
// to make today, but once a day's already over the limit, the fix isn't to
// undo that day - it's to earn more elsewhere so the ratio rebalances. This
// computes exactly how much more, verified against a real trader's account:
// $1,800 best day on $3,400 total at a 50% limit needs exactly $200 more.
function ConsistencyRebalanceWidget(props) {
  const account = props.account;
  const accountEntries = props.accountEntries;
  if (!account.consistencyPct) return null;
  const pct = parseFloat(account.consistencyPct) / 100;
  if (!pct || pct <= 0 || pct >= 1) return null;
  const d = computeOverviewData([account], accountEntries);
  if (!d.bestDay || d.totalPnl <= 0) return null;
  const bestDayPnl = d.byDate[d.bestDay] || 0;
  if (bestDayPnl <= 0) return null;
  const currentRatio = bestDayPnl / d.totalPnl;
  if (currentRatio <= pct) return null;
  const additionalNeeded = Math.max(0, bestDayPnl / pct - d.totalPnl);
  return /*#__PURE__*/React.createElement("div", {
    className: "border border-orange-500/40 bg-orange-500/10 rounded-xl p-4 flex items-start gap-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "TrendingUp",
    className: "h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-orange-300 font-semibold text-sm"
  }, "Best day is over your consistency limit"), /*#__PURE__*/React.createElement("p", {
    className: "text-orange-200/80 text-xs mt-1"
  }, "Your best day (", /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, fmt(bestDayPnl)), ") is currently ", /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, (currentRatio * 100).toFixed(1), "%"), " of your total profit - over your ", account.consistencyPct, "% limit. You don't need to undo that day - make ", /*#__PURE__*/React.createElement("span", {
    className: "num text-white font-semibold"
  }, fmt(additionalNeeded)), " more in total profit (from other days) and the ratio rebalances back into compliance on its own.")));
}
function BreachReviewCard(props) {
  const account = props.account;
  const accountEntries = props.accountEntries;
  const bufferHistory = props.bufferHistory;
  const checklist = computeDisciplineChecklist([account], accountEntries);
  const items = [{
    label: 'Followed your written entry rules',
    value: checklist.entryRulesPct
  }, {
    label: 'Stayed within your risk per trade',
    value: checklist.riskDisciplinePct
  }, {
    label: 'Stayed within your max daily loss (2x risk)',
    value: checklist.dailyLossCapPct
  }, {
    label: 'Stayed within your unlocked contract size',
    value: checklist.lotDisciplinePct
  }, {
    label: 'Respected the Daily Execution Matrix',
    value: checklist.matrixPct
  }, {
    label: 'Completed HTF to LTF analysis before entry',
    value: checklist.htfPct
  }, {
    label: 'Traded in the direction of your daily bias',
    value: checklist.biasPct
  }].filter(function (i) {
    return i.value !== null;
  });
  const wentWell = items.filter(function (i) {
    return i.value >= 70;
  });
  const toWorkOn = items.filter(function (i) {
    return i.value < 70;
  });
  const breachDay = bufferHistory.length > 0 ? bufferHistory[bufferHistory.length - 1] : null;
  const breachEntry = breachDay ? accountEntries.find(function (e) {
    return e.date === breachDay.date;
  }) : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-red-500/30 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "FileSearch",
    className: "h-5 w-5 text-red-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Breach Review")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "A specific look at what happened on this account - not a punishment, just the facts so the next one goes differently."), breachDay && /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 rounded-lg p-3 mb-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 mb-1"
  }, "The day the buffer hit zero: ", /*#__PURE__*/React.createElement("span", {
    className: "text-white font-medium"
  }, breachDay.date)), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold " + (breachDay.pnl < 0 ? 'text-red-400' : 'text-gray-300')
  }, breachDay.pnl >= 0 ? '+' : '', fmt(breachDay.pnl), " that day"), breachEntry && breachEntry.trades && breachEntry.trades.length > 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mt-1"
  }, breachEntry.trades.length, " trade", breachEntry.trades.length !== 1 ? 's' : '', " logged that day - ", breachEntry.trades.filter(function (t) {
    return t.result === 'loss';
  }).length, " loss", breachEntry.trades.filter(function (t) {
    return t.result === 'loss';
  }).length !== 1 ? 'es' : '', ".")), items.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Not enough logged trades on this account to build a review yet.") : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs uppercase tracking-wide text-green-400 font-semibold mb-2"
  }, "What went well"), wentWell.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600"
  }, "Nothing cleared 70% on this account.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, wentWell.map(function (i, idx) {
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "flex items-center justify-between text-xs bg-black/30 rounded-lg px-2.5 py-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-300"
    }, i.label), /*#__PURE__*/React.createElement("span", {
      className: "text-green-400 font-semibold"
    }, i.value.toFixed(0), "%"));
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs uppercase tracking-wide text-red-400 font-semibold mb-2"
  }, "What to work on"), toWorkOn.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600"
  }, "Nothing fell below 70% on this account.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, toWorkOn.map(function (i, idx) {
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "flex items-center justify-between text-xs bg-black/30 rounded-lg px-2.5 py-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-300"
    }, i.label), /*#__PURE__*/React.createElement("span", {
      className: "text-red-400 font-semibold"
    }, i.value.toFixed(0), "%"));
  })))));
}
function StrategyCard(props) {
  const account = props.account;
  const onManage = props.onManage;
  const strategies = getStrategies(account).filter(function (s) {
    const hasLong = (s.longRules || []).filter(function (r) {
      return r && r.trim();
    }).length > 0;
    const hasShort = (s.shortRules || []).filter(function (r) {
      return r && r.trim();
    }).length > 0;
    return hasLong || hasShort || s.id !== 'default';
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BookOpen",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Strategy Rules")), /*#__PURE__*/React.createElement("button", {
    onClick: onManage,
    className: "flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/15 px-3 py-1.5 rounded-lg text-sm font-medium transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Plus",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Add Strategy"))), strategies.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-8 border border-dashed border-gray-800 rounded-xl"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BookOpen",
    className: "h-8 w-8 text-gray-700 mx-auto mb-2"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500 text-sm"
  }, "No strategies defined yet."), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 text-xs mt-1"
  }, "Add one with its own Long/Short entry rules - you'll pick which strategy you used each time you log a day.")) : strategies.map(function (strategy) {
    const longRules = (strategy.longRules || []).filter(function (r) {
      return r && r.trim();
    });
    const shortRules = (strategy.shortRules || []).filter(function (r) {
      return r && r.trim();
    });
    return /*#__PURE__*/React.createElement("div", {
      key: strategy.id
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-medium text-white mb-2"
    }, strategy.name), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-1 md:grid-cols-2 gap-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-black/40 border border-green-800/40 rounded-xl p-4"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs uppercase tracking-wide text-green-400 font-semibold mb-2 flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "TrendingUp",
      className: "h-3.5 w-3.5"
    }), /*#__PURE__*/React.createElement("span", null, "Long Setup Rules")), longRules.length === 0 ? /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-600"
    }, "No rules defined.") : /*#__PURE__*/React.createElement("ul", {
      className: "space-y-1.5"
    }, longRules.map(function (r, i) {
      return /*#__PURE__*/React.createElement("li", {
        key: i,
        className: "text-sm text-gray-300 flex items-start gap-2"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-green-400 mt-0.5 leading-none"
      }, "*"), /*#__PURE__*/React.createElement("span", null, r));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "bg-black/40 border border-red-800/40 rounded-xl p-4"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs uppercase tracking-wide text-red-400 font-semibold mb-2 flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "TrendingDown",
      className: "h-3.5 w-3.5"
    }), /*#__PURE__*/React.createElement("span", null, "Short Setup Rules")), shortRules.length === 0 ? /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-600"
    }, "No rules defined.") : /*#__PURE__*/React.createElement("ul", {
      className: "space-y-1.5"
    }, shortRules.map(function (r, i) {
      return /*#__PURE__*/React.createElement("li", {
        key: i,
        className: "text-sm text-gray-300 flex items-start gap-2"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-red-400 mt-0.5 leading-none"
      }, "*"), /*#__PURE__*/React.createElement("span", null, r));
    })))));
  }));
}
function MiniStat(props) {
  const accentBorder = (props.color || '').replace(/text-/g, 'border-');
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 border border-gray-800/80 border-l-2 rounded-lg pl-3 pr-2.5 py-2 " + accentBorder
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500 leading-tight mb-0.5"
  }, props.label), /*#__PURE__*/React.createElement("div", {
    className: "num text-[15px] font-semibold " + props.color
  }, props.value));
}

// Shared math for both the General guide and the Personal plan - General uses
// the system max risk (the ceiling, the same for everyone on this account
// type), Personal uses whatever the trader actually locked in as their
// tolerance. Keeping one function means the two views can never silently
// drift apart from the same underlying formulas.
function tradingPlanMath(account, riskAmount, totalPnl) {
  const rtu = riskAmount;
  const rr = Math.max(parseFloat(account.rewardRatio) || MIN_RR, MIN_RR);
  const winPerTrade = rtu * rr;
  const minWinRate = rtu + winPerTrade > 0 ? rtu / (rtu + winPerTrade) * 100 : 0;
  const winsToTarget = winPerTrade > 0 ? Math.ceil((parseFloat(account.profitTarget) || 0) / winPerTrade) : 0;
  const remaining = (parseFloat(account.profitTarget) || 0) - totalPnl;
  return {
    rr: rr,
    winPerTrade: winPerTrade,
    minWinRate: minWinRate,
    winsToTarget: winsToTarget,
    remaining: remaining
  };
}

// GENERAL: the ceiling - the most the Charter's math allows, same for every
// trader on this account type. This is a guide and a barrier, never the
// trader's own choice (see PersonalPlanStats below for that).
function GeneralPlanStats(props) {
  const account = props.account;
  const m = tradingPlanMath(account, props.riskPerTrade, props.totalPnl);
  const avgTradesPerDay = props.avgTradesPerDay || 0;
  const maxTradesInDay = props.maxTradesInDay || 0;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Win / Trade (max)",
    value: fmt(m.winPerTrade),
    color: "text-green-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "RR Ratio",
    value: m.rr + ":1",
    color: "text-purple-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Breakeven Win Rate",
    value: m.minWinRate.toFixed(1) + "%",
    color: "text-purple-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Avg Trades Taken / Day",
    value: avgTradesPerDay.toFixed(1),
    color: "text-blue-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Most Trades Taken (Day)",
    value: String(maxTradesInDay),
    color: "text-blue-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Capital (Buffer)",
    value: fmt(account.maxDrawdown),
    color: "text-yellow-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Suggested Trades (sample)",
    value: "20-25",
    color: "text-gray-300"
  }));
}

// PERSONAL: the trader's own final decision - how far they actually are from
// the goal, given the risk they chose (never more than General's ceiling).
function PersonalPlanStats(props) {
  const account = props.account;
  const m = tradingPlanMath(account, props.riskPerTrade, props.totalPnl);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Wins to Hit Target",
    value: m.winsToTarget + " wins",
    color: "text-purple-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Remaining to Target",
    value: fmt(Math.max(0, m.remaining)),
    color: "text-yellow-400"
  }));
}

// A reference-only rule of thumb (not part of the system's own risk math above
// it): size each trade so the buffer could survive roughly 20-25 losing
// trades in a row before it's gone, instead of just the system's own max.
// Shown right under Personal Risk Tolerance so a trader can compare the two
// and, optionally, one-click apply the suggested number as their tolerance.
function TradeBudgetReference(props) {
  const buffer = Math.max(parseFloat(props.buffer) || 0, 0);
  const systemMaxRisk = parseFloat(props.systemMaxRisk) || 0;
  const onApply = props.onApply;
  const locked = !!props.locked;
  if (buffer <= 0) return null;
  const HIGH_COUNT = 20; // fewer survivable losers -> bigger $ per trade
  const LOW_COUNT = 25; // more survivable losers -> smaller $ per trade
  const highRisk = buffer / HIGH_COUNT;
  const lowRisk = buffer / LOW_COUNT;
  const midRisk = Math.min((lowRisk + highRisk) / 2, systemMaxRisk);
  const fitsUnderMax = systemMaxRisk > 0 && lowRisk <= systemMaxRisk;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ListOrdered",
    className: "h-5 w-5 text-blue-400"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-semibold text-white"
  }, "Suggested Trade Budget (Reference)")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-3"
  }, "A rule of thumb: size each trade so your buffer could survive about ", HIGH_COUNT, "-", LOW_COUNT, " losing trades in a row before it's gone. This is just a reference - it changes nothing until you apply it below."), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: HIGH_COUNT + "-Trade Life",
    value: fmt(highRisk) + "/trade",
    color: "text-blue-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: LOW_COUNT + "-Trade Life",
    value: fmt(lowRisk) + "/trade",
    color: "text-blue-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "As % of Buffer",
    value: (100 / LOW_COUNT).toFixed(1) + "% - " + (100 / HIGH_COUNT).toFixed(1) + "%",
    color: "text-gray-400"
  })), locked ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Lock",
    className: "h-3 w-3"
  }), /*#__PURE__*/React.createElement("span", null, "Risk tolerance is locked for this account - this reference is informational only until it passes or fails.")) : fitsUnderMax ? /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      onApply(midRisk.toFixed(2));
    },
    className: "text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/40"
  }, "Use ", fmt(midRisk), "/trade as My Personal Risk Tolerance") : /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600"
  }, "Your system max (", fmt(systemMaxRisk), "/trade) is already tighter than this reference - you're already more conservative than a ", LOW_COUNT, "-trade life count."));
}

// RR/win-rate breakeven math and minimum-sample-size guidance. Kept off the
// main dashboard (collapsed by default, lives on the Strategy page) so it
// doesn't add weight to the screen a trader checks every day - it's a
// reference they open deliberately, not a stat that's always in their face.
const RR_BREAKEVEN_TABLE = [{
  rr: '1:1',
  breakeven: '50%',
  profitable: 'above ~55-60%'
}, {
  rr: '1:1.5',
  breakeven: '40%',
  profitable: 'above ~45-50%'
}, {
  rr: '1:2',
  breakeven: '33.33%',
  profitable: 'above ~40%'
}, {
  rr: '1:3',
  breakeven: '25%',
  profitable: 'above ~30-35%'
}, {
  rr: '1:5',
  breakeven: '16.67%',
  profitable: 'above ~20-25%'
}];
const BACKTEST_REQUIREMENTS_TABLE = [{
  style: 'Scalping',
  min: '500',
  ideal: '1,000',
  data: '1-3 months'
}, {
  style: 'Intraday',
  min: '100-200',
  ideal: '500',
  data: '3-12 months'
}, {
  style: 'Swing Trading',
  min: '50-100',
  ideal: '200-500',
  data: '2-5 years'
}, {
  style: 'Position / Trend Following',
  min: '30-50',
  ideal: '100-200',
  data: '5+ years'
}];
function StrategyBacktestReference() {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between gap-2 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Calculator",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-semibold text-white"
  }, "Strategy, RR & Sample-Size Reference")), /*#__PURE__*/React.createElement(Icon, {
    name: open ? 'ChevronUp' : 'ChevronDown',
    className: "h-4 w-4 text-gray-500 flex-shrink-0"
  })), !open ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600 mt-1.5"
  }, "Your win rate needed to be profitable at each RR, and how many backtested trades you need before trusting a strategy. Click to expand.") : /*#__PURE__*/React.createElement("div", {
    className: "mt-4 space-y-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-white font-medium"
  }, "Your strategy must be fixed - never change it if it's profitable."), " A profitable strategy means a good win rate for its RR (risk/reward). Change the RR, and the win rate you need changes too:"), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-xs"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-gray-500 border-b border-gray-800"
  }, /*#__PURE__*/React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "RR"), /*#__PURE__*/React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "Breakeven Win Rate"), /*#__PURE__*/React.createElement("th", {
    className: "text-left py-1.5"
  }, "Profitable When"))), /*#__PURE__*/React.createElement("tbody", null, RR_BREAKEVEN_TABLE.map(function (r) {
    return /*#__PURE__*/React.createElement("tr", {
      key: r.rr,
      className: "border-b border-gray-900"
    }, /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 pr-3 text-purple-300 font-medium num"
    }, r.rr), /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 pr-3 text-gray-300 num"
    }, r.breakeven), /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 text-green-400 num"
    }, r.profitable));
  }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 mb-2"
  }, "Minimum sample size before trusting a strategy's numbers: ", /*#__PURE__*/React.createElement("span", {
    className: "text-white font-medium"
  }, "100 trades"), ". Ideal: ", /*#__PURE__*/React.createElement("span", {
    className: "text-white font-medium"
  }, "200-500 trades"), ". By trading style:"), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-xs"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-gray-500 border-b border-gray-800"
  }, /*#__PURE__*/React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "Style"), /*#__PURE__*/React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "Minimum"), /*#__PURE__*/React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "Ideal"), /*#__PURE__*/React.createElement("th", {
    className: "text-left py-1.5"
  }, "Data Span"))), /*#__PURE__*/React.createElement("tbody", null, BACKTEST_REQUIREMENTS_TABLE.map(function (r) {
    return /*#__PURE__*/React.createElement("tr", {
      key: r.style,
      className: "border-b border-gray-900"
    }, /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 pr-3 text-gray-300"
    }, r.style), /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 pr-3 text-blue-300 num"
    }, r.min), /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 pr-3 text-green-400 num"
    }, r.ideal), /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 text-gray-400"
    }, r.data));
  }))))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600"
  }, "Why 20-25 suggested trades on the Overview's General panel: across a 400-trade sample, a trader can run into 14 losses in a row - sizing around a 20-25 trade \"survival window\" is the sweet spot that accounts for that.")));
}
function ProjectionsCard(props) {
  const account = props.account;
  const accountEntries = props.accountEntries;
  const defaultRisk = props.defaultRiskPerTrade;
  const storageKey = 'mmm_projection_' + account.id;
  const defaultSettings = {
    riskPerTrade: defaultRisk || 0,
    rewardRatio: Math.max(parseFloat(account.rewardRatio) || MIN_RR, MIN_RR),
    profitTarget: parseFloat(account.profitTarget) || 0,
    riskCuttingPercent: 0,
    compoundingPercent: 0,
    mode: 'date',
    accountsToCopy: 1,
    winRatePct: 50,
    sampleTrades: 20,
    wcWins: 10,
    wcLosses: 10
  };
  const [settings, setSettings] = useState(function () {
    try {
      const saved = localStorage.getItem(storageKey);
      // Merge onto the defaults rather than replacing them outright, so a
      // trader who saved settings before the account-copying/win-rate modes
      // existed still gets sane values for the new fields instead of undefined.
      if (saved) return Object.assign({}, defaultSettings, JSON.parse(saved));
    } catch (e) {}
    return defaultSettings;
  });
  useEffect(function () {
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch (e) {}
  }, [settings, storageKey]);
  const update = function (key, value) {
    setSettings(function (prev) {
      const next = Object.assign({}, prev);
      next[key] = value;
      return next;
    });
  };

  // Real day-by-day P&L pulled straight from this account's logged entries,
  // so the projection swaps in what actually happened the moment a day has
  // been logged, instead of only ever showing the simulated path.
  const pnlByDate = {};
  accountEntries.forEach(function (e) {
    if (e.tradedToday === 'no') return;
    const dayPnl = (e.trades || []).reduce(function (s, t) {
      return s + tradeSignedPnl(t);
    }, 0);
    pnlByDate[e.date] = (pnlByDate[e.date] || 0) + dayPnl;
  });
  const target = settings.profitTarget || 0;
  const days = [];
  if (settings.riskPerTrade > 0 && settings.rewardRatio > 0 && target > 0) {
    let cumulativeTarget = 0;
    let currentRisk = settings.riskPerTrade;
    let tradingDayCount = 0;
    let calendarDayCount = 0;
    while (cumulativeTarget < target && tradingDayCount < 200) {
      calendarDayCount++;
      const d = new Date();
      d.setDate(d.getDate() + calendarDayCount - 1);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      tradingDayCount++;
      const dateStr = d.toISOString().split('T')[0];
      const reward = currentRisk * settings.rewardRatio;
      cumulativeTarget += reward;
      const hasActual = pnlByDate.hasOwnProperty(dateStr);
      const actualPnl = hasActual ? pnlByDate[dateStr] : undefined;
      days.push({
        date: dateStr,
        dayNumber: tradingDayCount,
        risk: currentRisk,
        reward: reward,
        targetExpectation: cumulativeTarget,
        hasActual: hasActual,
        actualPnl: actualPnl
      });
      if (hasActual) {
        if (actualPnl < 0 && settings.riskCuttingPercent > 0) currentRisk = currentRisk * (1 - settings.riskCuttingPercent / 100);else if (actualPnl > 0 && settings.compoundingPercent > 0) currentRisk = currentRisk * (1 + settings.compoundingPercent / 100);
      } else if (settings.compoundingPercent > 0) {
        currentRisk = currentRisk * (1 + settings.compoundingPercent / 100);
      }
    }
  }
  const dailyReward = settings.riskPerTrade * settings.rewardRatio;
  const loggedDaysInPlan = days.filter(function (d) {
    return d.hasActual;
  }).length;
  const cumulativeActual = days.reduce(function (s, d) {
    return s + (d.hasActual ? d.actualPnl : 0);
  }, 0);
  const progressPct = target > 0 ? Math.min(100, Math.max(0, cumulativeActual / target * 100)) : 0;
  const accountsN = Math.max(1, parseInt(settings.accountsToCopy, 10) || 1);
  const risk = settings.riskPerTrade || 0;
  const reward = risk * settings.rewardRatio;
  const breakevenWinRatePct = risk + reward > 0 ? risk / (risk + reward) * 100 : 0;

  // Win Rate mode - a win rate, a sample size, risk/trade and RR turn into an
  // expected result for one account and for every copied account combined.
  const wrTrades = Math.max(0, parseInt(settings.sampleTrades, 10) || 0);
  const wrWinRate = Math.max(0, Math.min(100, parseFloat(settings.winRatePct) || 0));
  const wrWins = Math.round(wrTrades * (wrWinRate / 100));
  const wrLosses = wrTrades - wrWins;
  const wrGrossPerAccount = wrWins * reward - wrLosses * risk;
  const wrExpectancyPerTrade = wrWinRate / 100 * reward - (1 - wrWinRate / 100) * risk;

  // Trade Count mode - the trader sets the exact number of winners and losers
  // instead of a percentage, useful for "what if I go 12-8" style questions.
  const tcWins = Math.max(0, parseInt(settings.wcWins, 10) || 0);
  const tcLosses = Math.max(0, parseInt(settings.wcLosses, 10) || 0);
  const tcTotalTrades = tcWins + tcLosses;
  const tcGrossPerAccount = tcWins * reward - tcLosses * risk;
  const tcImpliedWinRate = tcTotalTrades > 0 ? tcWins / tcTotalTrades * 100 : null;
  const mode = settings.mode || 'date';
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Target",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Target Projection")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "Model the path to your target by day, by win rate, or by a set number of wins and losses - scaled across every account you copy-trade."), /*#__PURE__*/React.createElement("div", {
    className: "grid sm:grid-cols-[2fr_1fr] gap-3 mb-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5"
  }, [{
    key: 'date',
    label: 'Day-by-Day Plan'
  }, {
    key: 'winrate',
    label: 'Win Rate'
  }, {
    key: 'tradecount',
    label: 'Trade Count'
  }].map(function (m) {
    return /*#__PURE__*/React.createElement("button", {
      key: m.key,
      onClick: function () {
        update('mode', m.key);
      },
      className: "flex-1 py-2 rounded-lg text-xs font-medium border transition " + (mode === m.key ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
    }, m.label);
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Accounts to Copy"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    value: settings.accountsToCopy || '',
    onChange: function (e) {
      update('accountsToCopy', parseInt(e.target.value, 10) || 1);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white",
    placeholder: "1"
  }))), accountsN > 1 && /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-600 -mt-3 mb-4"
  }, "Every dollar figure below is scaled x", accountsN, " for copy-trading across ", accountsN, " accounts."), mode === 'date' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "grid sm:grid-cols-2 gap-4 mb-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Risk Per Trade ($)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: settings.riskPerTrade || '',
    onChange: function (e) {
      update('riskPerTrade', parseFloat(e.target.value) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white",
    placeholder: "0"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Reward:Risk Ratio"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.1",
    value: settings.rewardRatio || '',
    onChange: function (e) {
      update('rewardRatio', parseFloat(e.target.value) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white",
    placeholder: "2"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Profit Target ($)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: settings.profitTarget || '',
    onChange: function (e) {
      update('profitTarget', parseFloat(e.target.value) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white",
    placeholder: "0"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Daily Profit / Trade"), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-green-400 num"
  }, fmt(dailyReward * accountsN)))), /*#__PURE__*/React.createElement("div", {
    className: "grid sm:grid-cols-2 gap-5 mb-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs text-gray-400"
  }, "Risk Cutting on a Loss"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-red-400 num"
  }, settings.riskCuttingPercent, "%")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    step: "5",
    value: settings.riskCuttingPercent,
    onChange: function (e) {
      update('riskCuttingPercent', parseInt(e.target.value, 10));
    },
    className: "w-full accent-red-400"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-600 mt-1"
  }, "Shrinks next trade's risk after a logged losing day.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs text-gray-400"
  }, "Compounding on a Win"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-green-400 num"
  }, settings.compoundingPercent, "%")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    step: "5",
    value: settings.compoundingPercent,
    onChange: function (e) {
      update('compoundingPercent', parseInt(e.target.value, 10));
    },
    className: "w-full accent-green-400"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-600 mt-1"
  }, "Grows next trade's risk after a logged winning day."))), days.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600 border border-gray-800 rounded-lg p-4 text-center"
  }, "Fill in risk per trade, reward:risk and a profit target to generate the plan.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Trading Days to Target",
    value: String(days.length),
    color: "text-blue-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Daily Reward",
    value: fmt(dailyReward * accountsN),
    color: "text-yellow-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Progress (Logged Days)",
    value: progressPct.toFixed(1) + '%',
    color: "text-green-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Days Logged So Far",
    value: loggedDaysInPlan + ' of ' + days.length,
    color: "text-purple-400"
  })), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto -mx-2"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-xs min-w-[640px]"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-gray-500 border-b border-gray-800"
  }, /*#__PURE__*/React.createElement("th", {
    className: "text-left px-2 py-2 font-medium"
  }, "Day"), /*#__PURE__*/React.createElement("th", {
    className: "text-center px-2 py-2 font-medium"
  }, "Risk"), /*#__PURE__*/React.createElement("th", {
    className: "text-center px-2 py-2 font-medium"
  }, "Expected Profit"), /*#__PURE__*/React.createElement("th", {
    className: "text-center px-2 py-2 font-medium"
  }, "Progress to Goal"), /*#__PURE__*/React.createElement("th", {
    className: "text-center px-2 py-2 font-medium"
  }, "Actual Result"))), /*#__PURE__*/React.createElement("tbody", null, days.map(function (d) {
    const pct = target > 0 ? Math.min(100, d.targetExpectation / target * 100) : 0;
    const reached = d.targetExpectation >= target;
    return /*#__PURE__*/React.createElement("tr", {
      key: d.date,
      className: "border-b border-gray-900 hover:bg-white/[0.02]"
    }, /*#__PURE__*/React.createElement("td", {
      className: "px-2 py-2 text-gray-300"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-medium"
    }, d.date), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-gray-600"
    }, "Day ", d.dayNumber)), /*#__PURE__*/React.createElement("td", {
      className: "px-2 py-2 text-center text-blue-400 num"
    }, fmt(d.risk * accountsN)), /*#__PURE__*/React.createElement("td", {
      className: "px-2 py-2 text-center text-green-400 num"
    }, fmt(d.reward * accountsN)), /*#__PURE__*/React.createElement("td", {
      className: "px-2 py-2 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "num font-semibold " + (reached ? 'text-green-400' : 'text-yellow-400')
    }, fmt(d.targetExpectation * accountsN)), /*#__PURE__*/React.createElement("div", {
      className: "h-1.5 bg-gray-800 rounded-full overflow-hidden mt-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full " + (reached ? 'bg-green-400' : 'bg-yellow-400'),
      style: {
        width: Math.max(2, pct) + '%'
      }
    }))), /*#__PURE__*/React.createElement("td", {
      className: "px-2 py-2 text-center num"
    }, d.hasActual ? /*#__PURE__*/React.createElement("span", {
      className: d.actualPnl > 0 ? 'text-green-400' : d.actualPnl < 0 ? 'text-red-400' : 'text-gray-400'
    }, d.actualPnl > 0 ? '+' : '', fmt(d.actualPnl * accountsN)) : /*#__PURE__*/React.createElement("span", {
      className: "text-gray-700"
    }, "-")));
  })))))), mode === 'winrate' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Risk Per Trade ($)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: settings.riskPerTrade || '',
    onChange: function (e) {
      update('riskPerTrade', parseFloat(e.target.value) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white",
    placeholder: "0"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Reward:Risk Ratio"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.1",
    value: settings.rewardRatio || '',
    onChange: function (e) {
      update('rewardRatio', parseFloat(e.target.value) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white",
    placeholder: "2"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Win Rate (%)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    max: "100",
    value: settings.winRatePct || '',
    onChange: function (e) {
      update('winRatePct', parseFloat(e.target.value) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white",
    placeholder: "50"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Sample Size (trades)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    value: settings.sampleTrades || '',
    onChange: function (e) {
      update('sampleTrades', parseInt(e.target.value, 10) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white",
    placeholder: "20"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Implied Wins / Losses",
    value: wrWins + 'W / ' + wrLosses + 'L',
    color: "text-blue-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Expectancy / Trade",
    value: fmt(wrExpectancyPerTrade),
    color: wrExpectancyPerTrade >= 0 ? 'text-green-400' : 'text-red-400'
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Breakeven Win Rate",
    value: breakevenWinRatePct.toFixed(1) + '%',
    color: "text-yellow-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Total Result (1 account)",
    value: fmt(wrGrossPerAccount),
    color: wrGrossPerAccount >= 0 ? 'text-green-400' : 'text-red-400'
  })), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/40 border border-gray-800 rounded-lg p-4 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-1"
  }, "Total Result across ", accountsN, " account", accountsN !== 1 ? 's' : ''), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-bold num " + (wrGrossPerAccount * accountsN >= 0 ? 'text-green-400' : 'text-red-400')
  }, fmt(wrGrossPerAccount * accountsN)))), mode === 'tradecount' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Risk Per Trade ($)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: settings.riskPerTrade || '',
    onChange: function (e) {
      update('riskPerTrade', parseFloat(e.target.value) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white",
    placeholder: "0"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Reward:Risk Ratio"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.1",
    value: settings.rewardRatio || '',
    onChange: function (e) {
      update('rewardRatio', parseFloat(e.target.value) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white",
    placeholder: "2"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Winning Trades"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    value: settings.wcWins || '',
    onChange: function (e) {
      update('wcWins', parseInt(e.target.value, 10) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-green-400",
    placeholder: "10"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Losing Trades"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    value: settings.wcLosses || '',
    onChange: function (e) {
      update('wcLosses', parseInt(e.target.value, 10) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-red-400",
    placeholder: "10"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Total Trades",
    value: String(tcTotalTrades),
    color: "text-blue-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Implied Win Rate",
    value: tcImpliedWinRate === null ? '-' : tcImpliedWinRate.toFixed(1) + '%',
    color: "text-yellow-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Breakeven Win Rate",
    value: breakevenWinRatePct.toFixed(1) + '%',
    color: "text-gray-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Total Result (1 account)",
    value: fmt(tcGrossPerAccount),
    color: tcGrossPerAccount >= 0 ? 'text-green-400' : 'text-red-400'
  })), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/40 border border-gray-800 rounded-lg p-4 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-1"
  }, "Total Result across ", accountsN, " account", accountsN !== 1 ? 's' : ''), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-bold num " + (tcGrossPerAccount * accountsN >= 0 ? 'text-green-400' : 'text-red-400')
  }, fmt(tcGrossPerAccount * accountsN)))));
}
function CostsAndPayoutsCard(props) {
  const account = props.account;
  const status = props.status;
  const showActivation = status === 'passed' || status === 'target-hit' || account.accountType !== 'challenge';
  const showReset = status === 'breached';
  const totalCosts = (parseFloat(account.accountCost) || 0) + (parseFloat(account.activationCost) || 0) + (parseFloat(account.resetCost) || 0);
  const payouts = account.payouts || [];
  const totalPayouts = payouts.reduce(function (s, p) {
    return s + (parseFloat(p.amount) || 0);
  }, 0);
  const profitability = totalPayouts - totalCosts;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-4"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Receipt",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Costs")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Challenge Cost",
    value: fmt(account.accountCost),
    color: "text-red-400"
  }), showActivation && /*#__PURE__*/React.createElement(MiniStat, {
    label: "Activation Cost",
    value: fmt(account.activationCost),
    color: "text-red-400"
  }), showReset && /*#__PURE__*/React.createElement(MiniStat, {
    label: "Reset Cost",
    value: fmt(account.resetCost),
    color: "text-red-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Total Costs",
    value: fmt(totalCosts),
    color: "text-red-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Total Payouts",
    value: fmt(totalPayouts),
    color: "text-green-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Net Profitability",
    value: fmt(profitability),
    color: profitability >= 0 ? 'text-green-400' : 'text-red-400'
  })));
}

// Consistency Required / Max Profit Allowed / Daily Loss Limit stats, meant to be
// dropped straight into the Active Strategy card's stat grid alongside its other MiniStats.
function PropFirmRuleStats(props) {
  const account = props.account;
  const entries = props.entries;
  const dll = parseFloat(account.dailyLossLimit) || null;
  const minDays = account.minTradingDays ? parseFloat(account.minTradingDays) : null;
  if (!account.consistencyPct && !dll && !minDays) return null;
  const todayStr = new Date().toISOString().split('T')[0];
  const cumBefore = getCumulativeProfitBefore(entries, account.id, todayStr);
  const cap = getConsistencyCap(account, cumBefore);
  const guideline = getConsistencyGuideline(account);
  const daysTraded = minDays ? getTradingDaysCount(entries, account.id) : 0;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Consistency Required",
    value: account.consistencyPct ? account.consistencyPct + "%" : 'Not set',
    color: "text-purple-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Max Profit Allowed / Day",
    value: account.consistencyPct ? cap !== null ? fmt(cap) : guideline !== null ? fmt(guideline) : 'Add a profit target' : '-',
    color: "text-yellow-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Daily Loss Limit",
    value: dll ? fmt(dll) : 'Not set',
    color: "text-red-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "DLL Type",
    value: dll ? account.dllType === 'hard' ? 'Hard Breach' : 'Soft Breach' : '-',
    color: dll && account.dllType === 'hard' ? 'text-red-400' : 'text-yellow-400'
  }), minDays !== null && /*#__PURE__*/React.createElement(MiniStat, {
    label: "Trading Days (min)",
    value: daysTraded + " of " + minDays,
    color: daysTraded >= minDays ? 'text-green-400' : 'text-yellow-400'
  }));
}

// The explanatory text and today's within/over check, meant to sit below the
// Active Strategy card's stat grid, right under PropFirmRuleStats.
function PropFirmRuleNote(props) {
  const account = props.account;
  const entries = props.entries;
  if (!account.consistencyPct) return null;
  const todayStr = new Date().toISOString().split('T')[0];
  const cumBefore = getCumulativeProfitBefore(entries, account.id, todayStr);
  const cap = getConsistencyCap(account, cumBefore);
  const guideline = getConsistencyGuideline(account);
  const todaysEntry = entries.find(function (e) {
    return e.accountId === account.id && e.date === todayStr && e.tradedToday !== 'no';
  });
  const todaysPnl = todaysEntry ? todaysEntry.trades.reduce(function (s, t) {
    return s + tradeSignedPnl(t);
  }, 0) : null;
  const todayWithin = cap !== null && todaysPnl !== null ? todaysPnl <= cap : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-3 space-y-1.5"
  }, cap === null ? guideline !== null ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "You have no profitable days logged yet, so this is a starter number: ", fmt(guideline), " is ", account.consistencyPct, "% of your ", fmt(parseFloat(account.profitTarget) || 0), " profit target. It switches to a real cap the moment you log your first profitable day.") : /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Add a profit target on this account and we'll give you a starter max-per-day number here, before you've even logged your first profitable day.") : /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "How this number is worked out: your ", account.consistencyPct, "% rule means no single day can be more than ", account.consistencyPct, "% of your total profit. Cumulative profit before today is ", /*#__PURE__*/React.createElement("span", {
    className: "text-white font-medium"
  }, fmt(cumBefore)), ", so today's cap is ", /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-400 font-medium"
  }, fmt(cap)), " - the amount that would keep today at exactly ", account.consistencyPct, "% of the new total."), todayWithin !== null && /*#__PURE__*/React.createElement("p", {
    className: "text-xs flex items-center gap-1.5 " + (todayWithin ? 'text-green-400' : 'text-red-400')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: todayWithin ? "CheckCircle" : "AlertTriangle",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Today's logged P&L is ", fmt(todaysPnl), " - ", todayWithin ? 'within' : 'OVER', " the ", fmt(cap), " cap.")));
}
function PayoutTypeSelector(props) {
  const value = props.value;
  const onChange = props.onChange;
  return /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-2"
  }, PAYOUT_TYPES.map(function (t) {
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      type: "button",
      onClick: function () {
        onChange(t.key);
      },
      className: "text-left p-2.5 rounded-lg border text-xs transition " + (value === t.key ? 'bg-yellow-500/15 border-yellow-500/50 text-yellow-200' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600')
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-semibold"
    }, t.label), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-gray-500 mt-0.5"
    }, t.firms));
  }));
}

// Renders the fields for whichever payout type is selected. `get`/`set` let
// this be reused against two different state shapes - the Add Account
// form's newAccount draft, and PayoutRulesForm's own local state - without
// duplicating the field markup in both places.
function PayoutTypeFieldset(props) {
  const type = props.type;
  const get = props.get;
  const set = props.set;
  const cls = "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400/50 outline-none";
  if (type === 'streak') {
    return /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-3"
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Qualifying Days Needed"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: get('streakDays'),
      onChange: function (e) {
        set('streakDays', e.target.value);
      },
      placeholder: "e.g. 5",
      className: cls
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Min Profit / Qualifying Day ($)"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: get('streakDayMin'),
      onChange: function (e) {
        set('streakDayMin', e.target.value);
      },
      placeholder: "e.g. 200",
      className: cls
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Payout (% of Total Profit)"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: get('streakPctOfTotal'),
      onChange: function (e) {
        set('streakPctOfTotal', e.target.value);
      },
      placeholder: "e.g. 50",
      className: cls
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Flat Cap ($, optional)"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: get('streakFlatCap'),
      onChange: function (e) {
        set('streakFlatCap', e.target.value);
      },
      placeholder: "leave blank if uncapped",
      className: cls
    })));
  }
  if (type === 'formula') {
    return /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-3"
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Buffer Before First Payout ($)"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: get('formulaBuffer'),
      onChange: function (e) {
        set('formulaBuffer', e.target.value);
      },
      placeholder: "e.g. 1000",
      className: cls
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Cycle Profit Multiplier"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      step: "0.1",
      value: get('formulaMultiplier'),
      onChange: function (e) {
        set('formulaMultiplier', e.target.value);
      },
      placeholder: "e.g. 2",
      className: cls
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Payout Cap ($)"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: get('formulaCap'),
      onChange: function (e) {
        set('formulaCap', e.target.value);
      },
      placeholder: "e.g. 1500",
      className: cls
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Minimum Payout ($)"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: get('formulaMinPayout'),
      onChange: function (e) {
        set('formulaMinPayout', e.target.value);
      },
      placeholder: "e.g. 250",
      className: cls
    })));
  }
  if (type === 'twoleg') {
    return /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-3"
    }, /*#__PURE__*/React.createElement(Field, {
      label: "Target Per Leg ($)"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: get('twoLegTarget'),
      onChange: function (e) {
        set('twoLegTarget', e.target.value);
      },
      placeholder: "e.g. 3000",
      className: cls
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Cash Payout ($)"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: get('twoLegCashPayout'),
      onChange: function (e) {
        set('twoLegCashPayout', e.target.value);
      },
      placeholder: "e.g. 1500",
      className: cls
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Live Account Credit ($)"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: get('twoLegLiveCredit'),
      onChange: function (e) {
        set('twoLegLiveCredit', e.target.value);
      },
      placeholder: "e.g. 50000",
      className: cls
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "First Payout Buffer ($)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: get('payoutBuffer'),
    onChange: function (e) {
      set('payoutBuffer', e.target.value);
    },
    placeholder: "e.g. 1100",
    className: cls
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Each Payout After That ($)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: get('payoutThreshold'),
    onChange: function (e) {
      set('payoutThreshold', e.target.value);
    },
    placeholder: "e.g. 500",
    className: cls
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Your Profit Split (%)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: get('profitSplit'),
    onChange: function (e) {
      set('profitSplit', e.target.value);
    },
    placeholder: "e.g. 90",
    className: cls
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Min Qualifying Days (optional)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: get('minQualifyingDays'),
    onChange: function (e) {
      set('minQualifyingDays', e.target.value);
    },
    placeholder: "leave blank if none",
    className: cls
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Payout Cap ($, optional)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: get('payoutCap'),
    onChange: function (e) {
      set('payoutCap', e.target.value);
    },
    placeholder: "leave blank if uncapped",
    className: cls
  })));
}
const emptyPayoutFields = {
  payoutBuffer: '',
  payoutThreshold: '',
  profitSplit: '90',
  minQualifyingDays: '',
  payoutCap: '',
  streakDays: '',
  streakDayMin: '',
  streakPctOfTotal: '',
  streakFlatCap: '',
  formulaBuffer: '',
  formulaMultiplier: '2',
  formulaCap: '',
  formulaMinPayout: '',
  twoLegTarget: '',
  twoLegCashPayout: '',
  twoLegLiveCredit: ''
};
function PayoutRulesForm(props) {
  const account = props.account;
  const onSave = props.onSave;
  const onCancel = props.onCancel;
  const [type, setType] = useState(account.payoutType || 'simple');
  const [values, setValues] = useState(function () {
    const v = Object.assign({}, emptyPayoutFields);
    Object.keys(v).forEach(function (k) {
      if (account[k] !== undefined && account[k] !== null) v[k] = String(account[k]);
    });
    return v;
  });
  const get = function (field) {
    return values[field];
  };
  const set = function (field, value) {
    setValues(Object.assign({}, values, {
      [field]: value
    }));
  };
  const canSave = type === 'streak' ? !!(values.streakDays && values.streakPctOfTotal) : type === 'formula' ? !!values.formulaBuffer : type === 'twoleg' ? !!values.twoLegTarget : !!(values.payoutBuffer || values.payoutThreshold);
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement(PayoutTypeSelector, {
    value: type,
    onChange: setType
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, (PAYOUT_TYPES.find(function (t) {
    return t.key === type;
  }) || {}).desc), /*#__PURE__*/React.createElement(PayoutTypeFieldset, {
    type: type,
    get: get,
    set: set
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      const num = function (v) {
        return v === '' || v === null || v === undefined ? null : parseFloat(v);
      };
      onSave({
        payoutType: type,
        payoutBuffer: num(values.payoutBuffer),
        payoutThreshold: num(values.payoutThreshold),
        profitSplit: num(values.profitSplit),
        minQualifyingDays: num(values.minQualifyingDays),
        payoutCap: num(values.payoutCap),
        streakDays: num(values.streakDays),
        streakDayMin: num(values.streakDayMin),
        streakPctOfTotal: num(values.streakPctOfTotal),
        streakFlatCap: num(values.streakFlatCap),
        formulaBuffer: num(values.formulaBuffer),
        formulaMultiplier: num(values.formulaMultiplier),
        formulaCap: num(values.formulaCap),
        formulaMinPayout: num(values.formulaMinPayout),
        twoLegTarget: num(values.twoLegTarget),
        twoLegCashPayout: num(values.twoLegCashPayout),
        twoLegLiveCredit: num(values.twoLegLiveCredit)
      });
    },
    disabled: !canSave,
    className: "flex-1 bg-green-500/20 text-green-400 border border-green-500/40 py-2 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
  }, "Save Payout Rules"), onCancel && /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    className: "px-4 py-2 rounded-lg text-sm text-gray-400 border border-gray-700"
  }, "Cancel")));
}
function PayoutTrackerCard(props) {
  const account = props.account;
  const entries = props.entries;
  const onSaveRules = props.onSaveRules;
  const [editing, setEditing] = useState(false);
  if (!account || account.accountType === 'challenge') return null;
  const hasRules = payoutRulesConfigured(account);
  if (!hasRules || editing) {
    return /*#__PURE__*/React.createElement("div", {
      className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-1"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Calendar",
      className: "h-5 w-5 text-yellow-400"
    }), /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-semibold text-white"
    }, "Payout Rules")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-500 mb-4"
    }, hasRules ? 'Update the payout rules for this account.' : "Pick how this firm actually pays out, fill in its numbers once, and we'll track exactly how close you are to your next payout - and tell you the moment it's due."), /*#__PURE__*/React.createElement(PayoutRulesForm, {
      account: account,
      onSave: function (rules) {
        onSaveRules(rules);
        setEditing(false);
      },
      onCancel: hasRules ? function () {
        setEditing(false);
      } : null
    }));
  }
  const status = getPayoutStatus(account, entries);
  if (!status) return null;
  const typeInfo = PAYOUT_TYPES.find(function (t) {
    return t.key === status.type;
  }) || PAYOUT_TYPES[0];
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4 flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Calendar",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Payout Tracker"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
  }, typeInfo.label)), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setEditing(true);
    },
    className: "text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Pencil",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Edit Rules"))), status.eligible ? /*#__PURE__*/React.createElement("div", {
    className: "border border-green-500/40 bg-green-500/10 rounded-xl p-4 flex items-start gap-3 mb-4"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "CheckCircle",
    className: "h-5 w-5 text-green-400 mt-0.5 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-green-300 font-semibold text-sm"
  }, "Payout Ready - ", fmt(status.requestable), " Available"), /*#__PURE__*/React.createElement("p", {
    className: "text-green-200/70 text-xs mt-1"
  }, status.note, " Log into your prop firm's own dashboard and submit the request there - this journal tracks it, it doesn't send it for you. Once it's paid, add it below in the Payout Ledger so the next cycle starts counting from today."))) : /*#__PURE__*/React.createElement("div", {
    className: "border border-yellow-500/30 bg-yellow-500/10 rounded-xl p-4 flex items-start gap-3 mb-4"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Clock",
    className: "h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-yellow-300 font-semibold text-sm"
  }, status.isFirstPayout ? 'Building Toward Your First Payout' : 'Building Toward Your Next Payout'), /*#__PURE__*/React.createElement("p", {
    className: "text-yellow-200/70 text-xs mt-1"
  }, status.note))), /*#__PURE__*/React.createElement("div", {
    className: "mb-1 flex justify-between text-xs text-gray-500"
  }, /*#__PURE__*/React.createElement("span", null, status.progressLabel), /*#__PURE__*/React.createElement("span", null, status.progressPct.toFixed(0), "%")), /*#__PURE__*/React.createElement("div", {
    className: "h-2.5 bg-gray-800 rounded-full overflow-hidden mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full " + (status.eligible ? 'bg-green-400' : 'bg-yellow-400'),
    style: {
      width: Math.max(2, status.progressPct) + '%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-2"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Requestable Now",
    value: fmt(status.requestable),
    color: status.requestable > 0 ? 'text-green-400' : 'text-gray-500'
  }), status.split ? /*#__PURE__*/React.createElement(MiniStat, {
    label: "Your Split",
    value: status.split + "%",
    color: "text-purple-400"
  }) : null, status.cap ? /*#__PURE__*/React.createElement(MiniStat, {
    label: "Payout Cap",
    value: fmt(status.cap),
    color: "text-gray-400"
  }) : null, status.liveCredit ? /*#__PURE__*/React.createElement(MiniStat, {
    label: "Live Credit (2nd leg)",
    value: fmt(status.liveCredit),
    color: "text-cyan-400"
  }) : null));
}
function PayoutLedger(props) {
  const account = props.account;
  const onAddPayout = props.onAddPayout;
  const suggestedAmount = props.suggestedAmount;
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const payouts = account.payouts || [];
  if (account.accountType === 'challenge') return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-4"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Banknote",
    className: "h-5 w-5 text-green-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Payout Ledger")), suggestedAmount > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setAmount(suggestedAmount.toFixed(2));
    },
    className: "text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg mb-3"
  }, "Use tracked amount: ", fmt(suggestedAmount)), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: date,
    onChange: function (e) {
      setDate(e.target.value);
    },
    className: "bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "Payout amount",
    value: amount,
    onChange: function (e) {
      setAmount(e.target.value);
    },
    className: "flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      if (!amount) return;
      onAddPayout({
        amount: amount,
        date: date
      });
      setAmount('');
    },
    className: "bg-green-500/20 text-green-400 border border-green-500/40 px-4 py-2 rounded-lg text-sm font-medium"
  }, "Add Payout")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, payouts.slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  }).map(function (p, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "flex justify-between text-sm bg-black/30 rounded-lg px-3 py-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-400"
    }, p.date), /*#__PURE__*/React.createElement("span", {
      className: "text-green-400 font-semibold"
    }, fmt(parseFloat(p.amount))));
  }), payouts.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600"
  }, "No payouts recorded yet.")));
}
function EquityCurve(props) {
  const points = props.points;
  const floorPoints = props.floorPoints;
  const startingAmount = props.startingAmount;
  const targetAmount = props.targetAmount;
  if (!points || points.length < 2) return /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600 py-6 text-center"
  }, "Not enough data yet - log at least 2 days to see your equity curve.");
  const hasFloor = floorPoints && floorPoints.length === points.length;
  const w = 900,
    h = 260,
    padL = 60,
    padR = 30,
    padTop = 24,
    padBottom = 34;
  const plotW = w - padL - padR;
  const plotTop = padTop,
    plotBottom = h - padBottom;
  const stepX = points.length > 1 ? plotW / (points.length - 1) : 0;
  const xFor = function (i) {
    return padL + i * stepX;
  };

  // Everything - balance, floor, starting amount, target - is the exact same
  // kind of number (dollars of P&L from where you started), so they all share
  // one axis. Putting any of them on a separate scale makes their positions
  // relative to each other meaningless on screen, even if the math underneath
  // is technically correct - which is exactly what made the last version
  // confusing: Start and Actual could visually cross with no real relationship.
  let allValues = points.map(function (p) {
    return p.cum;
  });
  if (hasFloor) allValues = allValues.concat(floorPoints.map(function (p) {
    return p.cum;
  }));
  if (startingAmount !== null && startingAmount !== undefined) allValues.push(startingAmount);
  if (targetAmount !== null && targetAmount !== undefined) allValues.push(targetAmount);
  let vMin = Math.min.apply(null, allValues),
    vMax = Math.max.apply(null, allValues);
  const vPad = (vMax - vMin || Math.abs(vMax) || 1) * 0.12;
  vMin -= vPad;
  vMax += vPad;
  const yFor = function (v) {
    return plotTop + (plotBottom - plotTop) * (1 - (v - vMin) / (vMax - vMin || 1));
  };
  const coords = points.map(function (p, i) {
    return {
      x: xFor(i),
      y: yFor(p.cum),
      cum: p.cum,
      date: p.date
    };
  });
  const pathD = coords.map(function (c, i) {
    return (i === 0 ? 'M' : 'L') + c.x.toFixed(1) + ',' + c.y.toFixed(1);
  }).join(' ');
  const last = coords[coords.length - 1];
  const compareBase = startingAmount !== null && startingAmount !== undefined ? startingAmount : 0;
  const lineColor = last.cum >= compareBase ? '#4ade80' : '#f87171';
  let floorPathD = null,
    lastFloor = null;
  if (hasFloor) {
    const floorCoords = floorPoints.map(function (p, i) {
      return {
        x: xFor(i),
        y: yFor(p.cum)
      };
    });
    floorPathD = floorCoords.map(function (c, i) {
      return (i === 0 ? 'M' : 'L') + c.x.toFixed(1) + ',' + c.y.toFixed(1);
    }).join(' ');
    lastFloor = floorCoords[floorCoords.length - 1];
  }
  const startY = startingAmount !== null && startingAmount !== undefined ? yFor(startingAmount) : null;
  const targetY = targetAmount !== null && targetAmount !== undefined ? yFor(targetAmount) : null;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 " + w + " " + h,
    className: "w-full",
    style: {
      minWidth: '500px',
      height: '260px'
    }
  }, startY !== null && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    y1: startY,
    x2: w - padR,
    y2: startY,
    stroke: "#60a5fa",
    strokeDasharray: "3 3",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: padL - 6,
    y: startY + 3,
    fill: "#60a5fa",
    fontSize: "9",
    textAnchor: "end"
  }, "Start")), targetY !== null && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    y1: targetY,
    x2: w - padR,
    y2: targetY,
    stroke: "#facc15",
    strokeDasharray: "3 3",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: padL - 6,
    y: targetY + 3,
    fill: "#facc15",
    fontSize: "9",
    textAnchor: "end"
  }, "Target")), floorPathD && /*#__PURE__*/React.createElement("path", {
    d: floorPathD,
    fill: "none",
    stroke: "#f87171",
    strokeWidth: "1.5",
    strokeDasharray: "5 3"
  }), lastFloor && /*#__PURE__*/React.createElement("circle", {
    cx: lastFloor.x,
    cy: lastFloor.y,
    r: "3",
    fill: "#f87171"
  }), /*#__PURE__*/React.createElement("path", {
    d: pathD,
    fill: "none",
    stroke: lineColor,
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: last.x,
    cy: last.y,
    r: "4",
    fill: lineColor
  }), /*#__PURE__*/React.createElement("text", {
    x: padL,
    y: h - 10,
    fill: "#6b7280",
    fontSize: "10"
  }, coords[0].date), /*#__PURE__*/React.createElement("text", {
    x: w - padR,
    y: h - 10,
    fill: "#6b7280",
    fontSize: "10",
    textAnchor: "end"
  }, last.date), /*#__PURE__*/React.createElement("text", {
    x: last.x,
    y: last.y - 10,
    fill: lineColor,
    fontSize: "11",
    fontWeight: "600",
    textAnchor: "end"
  }, fmt(last.cum)))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 flex-wrap mt-2 text-[11px] text-gray-500"
  }, startingAmount !== null && startingAmount !== undefined && /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-block w-3 h-0.5",
    style: {
      borderTop: '1.5px dashed #60a5fa'
    }
  }), "Starting balance (", fmt(startingAmount), ")"), hasFloor && /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-block w-3 h-0.5",
    style: {
      borderTop: '1.5px dashed #f87171'
    }
  }), "Trailing floor - breach if Balance touches this"), targetAmount !== null && targetAmount !== undefined && /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-block w-3 h-0.5",
    style: {
      borderTop: '1.5px dashed #facc15'
    }
  }), "Target (", fmt(targetAmount), ")"), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-block w-3 h-0.5",
    style: {
      background: lineColor
    }
  }), "Balance (account value)")));
}
function computeTradeAdherence(trade, entry, account) {
  const factors = [];
  const applicableRules = getApplicableRules(trade, entry, account);
  if (applicableRules.length > 0) factors.push((trade.rulesChecked || []).length / applicableRules.length);
  if (entry.dailyBias && entry.dailyBias !== 'neutral') {
    const aligned = entry.dailyBias === 'bullish' && trade.direction === 'long' || entry.dailyBias === 'bearish' && trade.direction === 'short';
    factors.push(aligned ? 1 : 0);
  }
  if (trade.riskAmount !== '' && trade.riskAmount !== undefined && trade.expectedRisk) {
    factors.push(Math.abs(parseFloat(trade.riskAmount)) <= trade.expectedRisk * 1.1 ? 1 : 0);
  }
  if (trade.positionSize !== '' && trade.positionSize !== undefined && trade.expectedContracts) {
    factors.push(parseFloat(trade.positionSize) <= trade.expectedContracts ? 1 : 0);
  }
  if (typeof entry.matrixAdherent === 'boolean') factors.push(entry.matrixAdherent ? 1 : 0);
  if (typeof trade.htfLtf === 'boolean') factors.push(trade.htfLtf ? 1 : 0);
  if (factors.length === 0) return null;
  return factors.reduce(function (s, f) {
    return s + f;
  }, 0) / factors.length;
}

// Same underlying signals as computeTradeAdherence, but kept as separate named
// questions instead of one blended number - each becomes its own trackable line
// on the discipline checklist (entry rules, risk size, lot size, bias, HTF/LTF).
// Rule-based auto-tags, not an AI model - straightforward pattern checks
// against data you already log (trade order in the day, prior result that
// day, bias match, risk/rule compliance). Labeled honestly as automated
// tagging rather than "AI" since no model inference is actually happening.
const computeTradeTags = function (trade, tradeIndex, allTradesInDay, entry, account) {
  const tags = [];
  if (tradeIndex >= 2) tags.push('Overtrade');
  if (tradeIndex > 0 && allTradesInDay[tradeIndex - 1] && allTradesInDay[tradeIndex - 1].result === 'loss') tags.push('Revenge Trade');
  if (entry.dailyBias && entry.dailyBias !== 'neutral') {
    const aligned = entry.dailyBias === 'bullish' && trade.direction === 'long' || entry.dailyBias === 'bearish' && trade.direction === 'short';
    if (!aligned) tags.push('Against Bias');
  }
  const factors = computeTradeDisciplineFactors(trade, entry, account);
  if (factors.riskOk === false) tags.push('Over-Risk');
  if (factors.sizeOk === false) tags.push('Over-Lot');
  if (factors.rulesFrac !== null && factors.rulesFrac === 1) tags.push('Rules Followed');
  if (factors.htfDone === false) tags.push('No HTF Check');
  return tags;
};
function computeTradeDisciplineFactors(trade, entry, account) {
  const applicableRules = getApplicableRules(trade, entry, account);
  const rulesFrac = applicableRules.length > 0 ? (trade.rulesChecked || []).length / applicableRules.length : null;

  // "No over-risk" checks two things, not one: did you log a risk amount within
  // your locked budget, AND did the trade actually lose more than that budget
  // once it closed. A trader who logs a small riskAmount but takes a much
  // bigger real loss (stop not honored, slippage, moving the stop) shouldn't
  // pass this just because the number they typed looked fine.
  let riskOk = null;
  if (trade.riskAmount !== '' && trade.riskAmount !== undefined && trade.expectedRisk) {
    riskOk = Math.abs(parseFloat(trade.riskAmount)) <= trade.expectedRisk * 1.1;
  }
  if (trade.result === 'loss' && trade.expectedRisk && trade.pnl !== '' && trade.pnl !== undefined) {
    const realizedLossOk = Math.abs(parseFloat(trade.pnl)) <= trade.expectedRisk * 1.1;
    riskOk = riskOk === null ? realizedLossOk : riskOk && realizedLossOk;
  }
  const sizeOk = trade.positionSize !== '' && trade.positionSize !== undefined && trade.expectedContracts ? parseFloat(trade.positionSize) <= trade.expectedContracts : null;
  const biasOk = entry.dailyBias && entry.dailyBias !== 'neutral' ? entry.dailyBias === 'bullish' && trade.direction === 'long' || entry.dailyBias === 'bearish' && trade.direction === 'short' : null;
  const htfDone = typeof trade.htfLtf === 'boolean' ? trade.htfLtf : null;
  return {
    rulesFrac: rulesFrac,
    riskOk: riskOk,
    sizeOk: sizeOk,
    biasOk: biasOk,
    htfDone: htfDone
  };
}

// Rolls every trade's factors up into one set of pass-rates across all of a
// person's accounts - the actual "specific list of questions" behind the
// discipline score. Each question only counts once there's real data for it.
function computeDisciplineChecklist(accounts, entries) {
  const accountsById = {};
  accounts.forEach(function (a) {
    accountsById[a.id] = a;
  });
  const exerciseDays = entries.filter(function (e) {
    return typeof e.exercised === 'boolean';
  });
  const exercisePct = exerciseDays.length > 0 ? exerciseDays.filter(function (e) {
    return e.exercised;
  }).length / exerciseDays.length * 100 : null;
  const tradedEntries = entries.filter(function (e) {
    return e.tradedToday !== 'no';
  });
  const matrixDays = tradedEntries.filter(function (e) {
    return typeof e.matrixAdherent === 'boolean';
  });
  const matrixPct = matrixDays.length > 0 ? matrixDays.filter(function (e) {
    return e.matrixAdherent;
  }).length / matrixDays.length * 100 : null;

  // Your max loss for a day is capped by the matrix's circuit breaker (2 losses,
  // each at your locked risk per trade) - e.g. $100 risk x 2 = $200 max. A day
  // that lost more than that isn't just "one over-risk trade", it's the specific
  // failure mode of blowing straight through the daily circuit breaker.
  let dailyCapOkCount = 0,
    dailyCapTotal = 0;
  tradedEntries.forEach(function (e) {
    const dayPnl = e.trades.reduce(function (s, t) {
      return s + tradeSignedPnl(t);
    }, 0);
    const expectedRisk = e.trades.length > 0 ? e.trades[0].expectedRisk : null;
    if (dayPnl < 0 && expectedRisk) {
      dailyCapTotal++;
      if (Math.abs(dayPnl) <= expectedRisk * 2 * 1.1) dailyCapOkCount++;
    }
  });
  const dailyLossCapPct = dailyCapTotal > 0 ? dailyCapOkCount / dailyCapTotal * 100 : null;
  const allTrades = tradedEntries.flatMap(function (e) {
    return e.trades.map(function (t) {
      return {
        trade: t,
        entry: e
      };
    });
  });
  let rulesSum = 0,
    rulesCount = 0;
  let riskOkCount = 0,
    riskTotal = 0;
  let sizeOkCount = 0,
    sizeTotal = 0;
  let biasOkCount = 0,
    biasTotal = 0;
  let htfOkCount = 0,
    htfTotal = 0;
  allTrades.forEach(function (pair) {
    const account = accountsById[pair.entry.accountId];
    if (!account) return;
    const f = computeTradeDisciplineFactors(pair.trade, pair.entry, account);
    if (f.rulesFrac !== null) {
      rulesSum += f.rulesFrac;
      rulesCount++;
    }
    if (f.riskOk !== null) {
      riskTotal++;
      if (f.riskOk) riskOkCount++;
    }
    if (f.sizeOk !== null) {
      sizeTotal++;
      if (f.sizeOk) sizeOkCount++;
    }
    if (f.biasOk !== null) {
      biasTotal++;
      if (f.biasOk) biasOkCount++;
    }
    if (f.htfDone !== null) {
      htfTotal++;
      if (f.htfDone) htfOkCount++;
    }
  });
  return {
    exercisePct: exercisePct,
    entryRulesPct: rulesCount > 0 ? rulesSum / rulesCount * 100 : null,
    riskDisciplinePct: riskTotal > 0 ? riskOkCount / riskTotal * 100 : null,
    lotDisciplinePct: sizeTotal > 0 ? sizeOkCount / sizeTotal * 100 : null,
    matrixPct: matrixPct,
    dailyLossCapPct: dailyLossCapPct,
    biasPct: biasTotal > 0 ? biasOkCount / biasTotal * 100 : null,
    htfPct: htfTotal > 0 ? htfOkCount / htfTotal * 100 : null
  };
}
function computeOverviewData(accounts, entries) {
  // Costs and payouts are real money already spent or received - they count for
  // every account regardless of status. Trading performance (P&L, win rate, equity
  // curve) only reflects accounts that are still active, so a blown account's
  // losses don't keep dragging down numbers that are supposed to represent where
  // things stand right now.
  const accountIds = {};
  const breachedIds = {};
  accounts.forEach(function (a) {
    accountIds[a.id] = true;
    if (computeAccountStatus(a, entries) === 'breached') breachedIds[a.id] = true;
  });

  // Must check accountIds[e.accountId], not just exclude breached ones - entries
  // is always the full, all-accounts array at every call site, so without this
  // an entry from an account that isn't even in the selected/passed-in accounts
  // list would still slip through and land on the wrong calendar day or total.
  const tradedEntries = entries.filter(function (e) {
    return e.tradedToday !== 'no' && accountIds[e.accountId] && !breachedIds[e.accountId];
  });
  const allTrades = tradedEntries.flatMap(function (e) {
    return e.trades.map(function (t) {
      return Object.assign({}, t, {
        date: e.date,
        accountId: e.accountId,
        entry: e
      });
    });
  });
  const accountsById = {};
  accounts.forEach(function (a) {
    accountsById[a.id] = a;
  });
  const winCount = allTrades.filter(function (t) {
    return t.result === 'win';
  }).length;
  const lossCount = allTrades.filter(function (t) {
    return t.result === 'loss';
  }).length;
  const totalTrades = winCount + lossCount;
  const overallWinRate = totalTrades > 0 ? winCount / totalTrades * 100 : 0;
  const totalPnl = allTrades.reduce(function (s, t) {
    return s + tradeSignedPnl(t);
  }, 0);

  // Standard trading metrics: profit factor (gross profit / gross loss - above
  // 1.0 means profitable), average win/loss size, and expectancy (what you
  // should expect to make per trade on average, blending win rate and size).
  const grossProfit = allTrades.filter(function (t) {
    return t.result === 'win';
  }).reduce(function (s, t) {
    return s + Math.abs(parseFloat(t.pnl) || 0);
  }, 0);
  const grossLoss = allTrades.filter(function (t) {
    return t.result === 'loss';
  }).reduce(function (s, t) {
    return s + Math.abs(parseFloat(t.pnl) || 0);
  }, 0);
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : null;
  const avgWin = winCount > 0 ? grossProfit / winCount : null;
  const avgLoss = lossCount > 0 ? grossLoss / lossCount : null;
  const expectancy = totalTrades > 0 ? totalPnl / totalTrades : null;
  const scores = [];
  allTrades.forEach(function (t) {
    const acc = accountsById[t.accountId];
    if (!acc) return;
    const sc = computeTradeAdherence(t, t.entry, acc);
    if (sc !== null) scores.push(sc);
  });
  const ruleAdherencePct = scores.length > 0 ? scores.reduce(function (s, v) {
    return s + v;
  }, 0) / scores.length * 100 : null;
  const totalAllCosts = accounts.reduce(function (s, a) {
    return s + (parseFloat(a.accountCost) || 0) + (parseFloat(a.activationCost) || 0) + (parseFloat(a.resetCost) || 0);
  }, 0);
  const totalAllPayouts = accounts.reduce(function (s, a) {
    return s + (a.payouts || []).reduce(function (ps, p) {
      return ps + (parseFloat(p.amount) || 0);
    }, 0);
  }, 0);
  const byDate = {};
  tradedEntries.forEach(function (e) {
    const dayPnl = e.trades.reduce(function (s, t) {
      return s + tradeSignedPnl(t);
    }, 0);
    byDate[e.date] = (byDate[e.date] || 0) + dayPnl;
  });
  const sortedDates = Object.keys(byDate).sort(function (a, b) {
    return new Date(a) - new Date(b);
  });
  let cum = 0;
  const equityPoints = sortedDates.map(function (d) {
    cum += byDate[d];
    return {
      date: d,
      cum: cum
    };
  });
  let bestDay = null,
    worstDay = null;
  sortedDates.forEach(function (d) {
    if (bestDay === null || byDate[d] > byDate[bestDay]) bestDay = d;
    if (worstDay === null || byDate[d] < byDate[worstDay]) worstDay = d;
  });
  const greenDays = sortedDates.filter(function (d) {
    return byDate[d] > 0;
  }).length;
  const dayWinRate = sortedDates.length > 0 ? greenDays / sortedDates.length * 100 : null;
  return {
    totalPnl: totalPnl,
    overallWinRate: overallWinRate,
    totalTrades: totalTrades,
    ruleAdherencePct: ruleAdherencePct,
    totalAllCosts: totalAllCosts,
    totalAllPayouts: totalAllPayouts,
    equityPoints: equityPoints,
    bestDay: bestDay,
    worstDay: worstDay,
    byDate: byDate,
    profitFactor: profitFactor,
    avgWin: avgWin,
    avgLoss: avgLoss,
    expectancy: expectancy,
    dayWinRate: dayWinRate
  };
}
function computeDisciplineScore(accounts, entries) {
  if (accounts.length === 0) return null;
  const loggedDates = entries.map(function (e) {
    return e.date;
  }).filter(Boolean);
  const uniqueLoggedDays = new Set(loggedDates).size;
  // "Since start" means since the person's first logged day, not their account
  // creation date - a dormant gap between setting up an account and actually
  // beginning to log shouldn't count against someone's consistency.
  let daysSinceStart = 1;
  if (loggedDates.length > 0) {
    const earliestLoggedDate = loggedDates.reduce(function (min, d) {
      return d < min ? d : min;
    });
    const msSinceFirstLog = Date.now() - new Date(earliestLoggedDate + 'T00:00:00').getTime();
    daysSinceStart = Math.max(1, Math.floor(msSinceFirstLog / (1000 * 60 * 60 * 24)) + 1);
  }
  const loggingConsistency = Math.min(100, uniqueLoggedDays / daysSinceStart * 100);
  const checklist = computeDisciplineChecklist(accounts, entries);

  // Showing up every day since you started is the main thing being measured here -
  // a trader on day 1 who logs today is exactly as consistent as a trader on day 14
  // who has logged every day, so logging consistency carries the most weight and
  // is always present. Every other question - exercise, entry rules, risk size,
  // lot size, the daily matrix, HTF/LTF analysis, bias alignment - only gets
  // folded in once there's actual data to judge, so a consistent newcomer with
  // no trades yet isn't dragged down by questions that don't apply to them yet.
  const parts = [{
    weight: 0.28,
    value: loggingConsistency
  }];
  if (checklist.exercisePct !== null) parts.push({
    weight: 0.10,
    value: checklist.exercisePct
  });
  if (checklist.entryRulesPct !== null) parts.push({
    weight: 0.13,
    value: checklist.entryRulesPct
  });
  if (checklist.riskDisciplinePct !== null) parts.push({
    weight: 0.12,
    value: checklist.riskDisciplinePct
  });
  if (checklist.lotDisciplinePct !== null) parts.push({
    weight: 0.07,
    value: checklist.lotDisciplinePct
  });
  if (checklist.matrixPct !== null) parts.push({
    weight: 0.08,
    value: checklist.matrixPct
  });
  if (checklist.dailyLossCapPct !== null) parts.push({
    weight: 0.10,
    value: checklist.dailyLossCapPct
  });
  if (checklist.htfPct !== null) parts.push({
    weight: 0.06,
    value: checklist.htfPct
  });
  if (checklist.biasPct !== null) parts.push({
    weight: 0.06,
    value: checklist.biasPct
  });
  const totalWeight = parts.reduce(function (s, p) {
    return s + p.weight;
  }, 0);
  const score = parts.reduce(function (s, p) {
    return s + p.value * p.weight;
  }, 0) / totalWeight;
  return {
    score: score,
    loggingConsistency: loggingConsistency,
    checklist: checklist,
    daysLogged: uniqueLoggedDays,
    daysSinceStart: daysSinceStart
  };
}
function disciplineGrade(score) {
  if (score === null || score === undefined) return {
    letter: '-',
    color: 'text-gray-500'
  };
  if (score >= 90) return {
    letter: 'A',
    color: 'text-green-400'
  };
  if (score >= 80) return {
    letter: 'B',
    color: 'text-lime-400'
  };
  if (score >= 70) return {
    letter: 'C',
    color: 'text-yellow-400'
  };
  if (score >= 60) return {
    letter: 'D',
    color: 'text-orange-400'
  };
  return {
    letter: 'F',
    color: 'text-red-400'
  };
}

// Deeper analytics for the Overview: streaks, extremes, Sharpe, drawdown and
// R-multiples. Uses the same trade set as computeOverviewData so every number
// on the page agrees with every other number.
function computeAdvancedStats(accounts, entries) {
  const ov = computeOverviewData(accounts, entries);
  const ids = {};
  accounts.forEach(function (a) {
    if (computeAccountStatus(a, entries) !== 'breached') ids[a.id] = true;
  });
  const traded = entries.filter(function (e) {
    return e.tradedToday !== 'no' && ids[e.accountId];
  }).slice().sort(function (a, b) {
    return (a.date || '').localeCompare(b.date || '');
  });
  const trades = [];
  traded.forEach(function (e) {
    (e.trades || []).forEach(function (t) {
      if (t.result === 'win' || t.result === 'loss') trades.push(t);
    });
  });
  let curW = 0,
    curL = 0,
    maxW = 0,
    maxL = 0,
    largestWin = null,
    largestLoss = null;
  const rs = [],
    winRs = [],
    lossRs = [];
  trades.forEach(function (t) {
    const p = tradeSignedPnl(t);
    if (t.result === 'win') {
      curW++;
      curL = 0;
      if (largestWin === null || p > largestWin) largestWin = p;
    } else {
      curL++;
      curW = 0;
      if (largestLoss === null || p < largestLoss) largestLoss = p;
    }
    if (curW > maxW) maxW = curW;
    if (curL > maxL) maxL = curL;
    const risk = Math.abs(parseFloat(t.riskAmount) || 0);
    if (risk > 0) {
      const r = p / risk;
      rs.push(r);
      if (r > 0) winRs.push(r);else lossRs.push(Math.abs(r));
    }
  });
  const mean = function (a) {
    return a.length ? a.reduce(function (s, v) {
      return s + v;
    }, 0) / a.length : null;
  };
  const avgR = mean(rs);
  const avgWinR = mean(winRs),
    avgLossR = mean(lossRs);
  const avgRR = avgWinR !== null && avgLossR ? avgWinR / avgLossR : ov.avgWin && ov.avgLoss ? ov.avgWin / ov.avgLoss : null;
  const startBal = accounts.filter(function (a) {
    return ids[a.id];
  }).reduce(function (s, a) {
    return s + (parseFloat(a.startingBalance) || 0);
  }, 0);
  const days = Object.keys(ov.byDate).sort();
  let sharpe = null;
  if (days.length >= 2 && startBal > 0) {
    const rets = days.map(function (d) {
      return ov.byDate[d] / startBal;
    });
    const m = mean(rets);
    const sd = Math.sqrt(rets.reduce(function (s, v) {
      return s + Math.pow(v - m, 2);
    }, 0) / (rets.length - 1));
    sharpe = sd > 0 ? m / sd * Math.sqrt(252) : null;
  }
  let peak = 0,
    maxDD = 0;
  ov.equityPoints.forEach(function (p) {
    if (p.cum > peak) peak = p.cum;
    if (peak - p.cum > maxDD) maxDD = peak - p.cum;
  });
  const recovery = maxDD > 0 ? ov.totalPnl / maxDD : null;
  const disc = computeDisciplineScore(accounts, entries);
  const mcs = entries.filter(function (e) {
    return e.mentalCheck;
  }).map(function (e) {
    return mentalCheckTotal(e.mentalCheck);
  }).filter(function (v) {
    return v > 0;
  });
  return Object.assign({}, ov, {
    startBal: startBal,
    netBalance: startBal + ov.totalPnl,
    maxW: maxW,
    maxL: maxL,
    largestWin: largestWin,
    largestLoss: largestLoss,
    sharpe: sharpe,
    avgR: avgR,
    avgRR: avgRR,
    rFactor: ov.avgWin && ov.avgLoss ? ov.avgWin / ov.avgLoss : null,
    maxDD: maxDD,
    recovery: recovery,
    tradingDays: days.length,
    tradesPerDay: days.length ? trades.length / days.length : null,
    disciplineScore: disc ? disc.score : null,
    avgMental: mcs.length ? mean(mcs) / 40 * 100 : null
  });
}
function ProStatTile(p) {
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 border border-gray-800/80 rounded-xl p-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] uppercase tracking-wide text-gray-500"
  }, p.label), /*#__PURE__*/React.createElement("div", {
    className: "num text-xl font-bold mt-1 " + p.color
  }, p.value), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-600 mt-0.5"
  }, p.sub));
}
function ProStatsPanel(props) {
  const s = computeAdvancedStats(props.accounts, props.entries);
  const none = s.totalTrades === 0;
  const g = disciplineGrade(s.disciplineScore);
  const pos = function (v) {
    return v === null || v === undefined ? 'text-gray-500' : v >= 0 ? 'text-green-400' : 'text-red-400';
  };
  const num = function (v, d) {
    return v === null || v === undefined || isNaN(v) ? '-' : v.toFixed(d === undefined ? 2 : d);
  };
  const Tile = ProStatTile;
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Gauge",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-semibold text-white"
  }, "Performance Overview")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "Key trading metrics and portfolio performance"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 lg:grid-cols-4 gap-3"
  }, /*#__PURE__*/React.createElement(Tile, {
    label: "Net Balance",
    value: fmt(s.netBalance),
    color: "text-white",
    sub: "Starting balance + Total P&L"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Total P&L",
    value: fmt(s.totalPnl),
    color: pos(s.totalPnl),
    sub: "Net profit/loss"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Win Rate",
    value: none ? '-' : s.overallWinRate.toFixed(1) + '%',
    color: none ? 'text-gray-500' : s.overallWinRate >= 50 ? 'text-green-400' : 'text-red-400',
    sub: "Winning trades percentage"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Total Trades",
    value: String(s.totalTrades),
    color: "text-white",
    sub: "All executed trades"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Discipline Score",
    value: s.disciplineScore === null ? '-' : Math.round(s.disciplineScore) + '% ' + g.letter,
    color: g.color,
    sub: "Trading discipline rating"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "R Factor",
    value: num(s.rFactor),
    color: s.rFactor === null ? 'text-gray-500' : s.rFactor >= 1 ? 'text-green-400' : 'text-red-400',
    sub: "Risk/Reward ratio"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Profit Factor",
    value: num(s.profitFactor),
    color: s.profitFactor === null ? 'text-gray-500' : s.profitFactor >= 1 ? 'text-green-400' : 'text-red-400',
    sub: "Gross Win / Gross Loss"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Avg Win/Loss",
    value: s.avgWin === null && s.avgLoss === null ? '-' : fmt(s.avgWin || 0) + '/' + fmt(s.avgLoss || 0),
    color: "text-white",
    sub: "Win vs Loss ratio"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Microscope",
    className: "h-5 w-5 text-purple-400"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-semibold text-white"
  }, "Advanced Statistics")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "Deep performance analytics and behavioral insights"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 lg:grid-cols-4 gap-3"
  }, /*#__PURE__*/React.createElement(Tile, {
    label: "Sharpe Ratio",
    value: num(s.sharpe),
    color: s.sharpe === null ? 'text-gray-500' : s.sharpe >= 1 ? 'text-green-400' : s.sharpe >= 0 ? 'text-yellow-400' : 'text-red-400',
    sub: "Risk-adjusted returns (daily)"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Max Consecutive Wins",
    value: String(s.maxW),
    color: "text-green-400",
    sub: "Best winning streak"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Max Consecutive Losses",
    value: String(s.maxL),
    color: "text-red-400",
    sub: "Worst losing streak"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Expectancy / Trade",
    value: s.expectancy === null ? '-' : fmt(s.expectancy),
    color: pos(s.expectancy),
    sub: "Average edge per trade"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Largest Win",
    value: s.largestWin === null ? '-' : fmt(s.largestWin),
    color: "text-green-400",
    sub: "Best single trade"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Largest Loss",
    value: s.largestLoss === null ? '-' : fmt(s.largestLoss),
    color: "text-red-400",
    sub: "Worst single trade"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Avg R:R Ratio",
    value: num(s.avgRR),
    color: s.avgRR === null ? 'text-gray-500' : s.avgRR >= 1 ? 'text-green-400' : 'text-red-400',
    sub: "Average win R / average loss R"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Avg R / Trade",
    value: s.avgR === null ? '-' : num(s.avgR) + 'R',
    color: pos(s.avgR),
    sub: "Needs risk logged per trade"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Max Drawdown",
    value: fmt(-s.maxDD),
    color: s.maxDD > 0 ? 'text-red-400' : 'text-gray-500',
    sub: "Peak-to-trough equity"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Recovery Factor",
    value: num(s.recovery),
    color: pos(s.recovery),
    sub: "Net profit / max drawdown"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Day Win Rate",
    value: s.dayWinRate === null ? '-' : s.dayWinRate.toFixed(0) + '%',
    color: s.dayWinRate === null ? 'text-gray-500' : s.dayWinRate >= 50 ? 'text-green-400' : 'text-red-400',
    sub: s.tradingDays + " trading days"
  }), /*#__PURE__*/React.createElement(Tile, {
    label: "Mental Readiness",
    value: s.avgMental === null ? '-' : s.avgMental.toFixed(0) + '%',
    color: s.avgMental === null ? 'text-gray-500' : s.avgMental >= 70 ? 'text-green-400' : 'text-yellow-400',
    sub: "Avg pre-session Mental Check"
  }))));
}
function DiagnosticResultCard(props) {
  const r = props.result;
  if (!r) {
    return /*#__PURE__*/React.createElement("div", {
      className: "bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-2xl p-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-2"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "ClipboardCheck",
      className: "h-5 w-5 text-yellow-400"
    }), /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-semibold text-white"
    }, "Trading Discipline Test")), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-gray-400 mb-4"
    }, "Twenty yes/no questions that find where your discipline leaks. Your score, profile and advice are saved here."), /*#__PURE__*/React.createElement("a", {
      href: "../diagnostic/",
      className: "inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-semibold"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Play",
      className: "h-4 w-4"
    }), /*#__PURE__*/React.createElement("span", null, "Take the Free Test")));
  }
  const col = function (p) {
    return p >= 70 ? '#4ade80' : p >= 45 ? '#fbbf24' : '#f87171';
  };
  const hist = r.history || [];
  const prev = hist.length >= 2 ? hist[hist.length - 2].score : null;
  const delta = prev === null ? null : r.score - prev;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-2xl p-6 space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ClipboardCheck",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Trading Discipline Test")), /*#__PURE__*/React.createElement("a", {
    href: "../diagnostic/",
    className: "text-xs text-gray-300 hover:text-yellow-400 border border-gray-700 rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "RotateCcw",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Retake the test"))), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 border border-gray-800 rounded-xl p-5 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-500 mb-1"
  }, "Your Trading Discipline Score"), /*#__PURE__*/React.createElement("div", {
    className: "num text-5xl font-extrabold",
    style: {
      color: col(r.score)
    }
  }, r.score, "%"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-bold mt-1",
    style: {
      color: col(r.score)
    }
  }, r.bandLabel || r.band), delta !== null && /*#__PURE__*/React.createElement("div", {
    className: "text-xs mt-2 " + (delta >= 0 ? 'text-green-400' : 'text-red-400')
  }, (delta >= 0 ? '+' : '') + delta + ' pts vs previous test'), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-600 mt-2"
  }, new Date(r.ts).toLocaleDateString())), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 bg-black/30 border border-gray-800 rounded-xl p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-500 mb-1"
  }, "Your profile"), /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold text-white mb-1"
  }, r.archetypeLabel || r.archetype), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-400 leading-relaxed"
  }, r.archetypeNote), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 mt-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500"
  }, "Strongest Area"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold text-green-400"
  }, r.strongestLabel || r.strongest, " (", r.strongestPct, "%)")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500"
  }, "Biggest Leak"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold text-red-400"
  }, r.weakestLabel || r.weakest, " (", r.weakestPct, "%)"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-semibold text-white mb-3"
  }, "Score by Category"), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-x-6 gap-y-3"
  }, (r.cats || []).map(function (c) {
    return /*#__PURE__*/React.createElement("div", {
      key: c.name
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between text-xs mb-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-300"
    }, c.label || c.name), /*#__PURE__*/React.createElement("span", {
      className: "num font-semibold",
      style: {
        color: col(c.pct)
      }
    }, c.pct, "%")), /*#__PURE__*/React.createElement("div", {
      className: "h-2 bg-gray-800 rounded-full overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full",
      style: {
        width: c.pct + '%',
        background: col(c.pct)
      }
    })));
  }))), (r.flags || []).length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-semibold text-white mb-3"
  }, "What To Watch"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, r.flags.map(function (f, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "bg-black/30 border border-gray-800 rounded-lg p-3 flex items-start gap-2.5"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "AlertTriangle",
      className: "h-4 w-4 text-red-400 flex-shrink-0 mt-0.5"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-gray-200"
    }, f.text), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-500 mt-0.5 leading-relaxed"
    }, f.flag)));
  }))), hist.length > 1 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-semibold text-white mb-2"
  }, "Test History"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-end gap-1.5 h-16"
  }, hist.map(function (h, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      title: new Date(h.ts).toLocaleDateString() + ': ' + h.score + '%',
      className: "flex-1 rounded-t",
      style: {
        height: Math.max(6, h.score) + '%',
        background: col(h.score)
      }
    });
  }))));
}

// ===================== Mental readiness (extends the 4-slider Mental Check) =====================
const MENTAL_EXTRA_SLIDERS = [{
  key: 'sleep',
  label: 'Sleep & Recovery',
  sub: 'How rested are you? 1 = exhausted, 10 = fully recharged.',
  def: 7
}, {
  key: 'energy',
  label: 'Physical Energy',
  sub: 'Body and energy level right now.',
  def: 7
}, {
  key: 'focus',
  label: 'Focus & Clarity',
  sub: 'Can you stay on one chart, one plan, without drifting?',
  def: 7
}, {
  key: 'stress',
  label: 'Outside Stress',
  sub: 'Money worries, people, work - anything pulling at you. 1 = none, 10 = heavy.',
  def: 3
}];
function mentalReadiness(mc) {
  if (!mc) return null;
  const core = mentalCheckTotal(mc) / 40;
  const g = function (k, d) {
    return mc[k] === undefined || mc[k] === null ? d : mc[k];
  };
  const hasExtras = mc.sleep !== undefined || mc.energy !== undefined || mc.focus !== undefined || mc.stress !== undefined;
  const extras = (g('sleep', 7) + g('energy', 7) + g('focus', 7) + (11 - g('stress', 3))) / 40;
  const pct = Math.round((hasExtras ? core * 0.6 + extras * 0.4 : core) * 100);
  const tips = [];
  if (g('riskRespect', 5) <= 4) tips.push('Risk respect is low: use your locked risk-per-trade and write down your daily loss cap before the first trade.');
  if (g('humility', 5) <= 4) tips.push('Humility is low: you are at risk of chasing or revenge trading. After any loss, step away for 30 minutes.');
  if (g('marketAwareness', 5) <= 4) tips.push('Market awareness is low: mark higher-timeframe bias and key levels first, and wait for an A+ setup.');
  if (g('mindset', 5) <= 4) tips.push('Mindset is low: treat today as a business day, with a fixed number of trades and no need to make money back.');
  if (hasExtras && g('sleep', 7) <= 4) tips.push('You are under-slept: tired traders break rules. Cut size and trade fewer setups.');
  if (hasExtras && g('stress', 3) >= 7) tips.push('Outside stress is high: it leaks into execution. Consider journal-only or a single, small trade.');
  if (hasExtras && g('focus', 7) <= 4) tips.push('Focus is low: do the Flow State ritual before opening the platform.');
  let verdict, cls, desc;
  if (pct >= 80) {
    verdict = 'Green Light';
    cls = 'text-green-400 border-green-500/40 bg-green-500/10';
    desc = 'Trade your plan at normal, locked risk.';
  } else if (pct >= 60) {
    verdict = 'Proceed With Care';
    cls = 'text-yellow-300 border-yellow-500/40 bg-yellow-500/10';
    desc = 'A+ setups only, and no more than your planned number of trades.';
  } else if (pct >= 40) {
    verdict = 'Reduced Size';
    cls = 'text-orange-300 border-orange-500/40 bg-orange-500/10';
    desc = 'Cut risk, take one trade at most, and stop after the first loss.';
  } else {
    verdict = 'Stand Down';
    cls = 'text-red-400 border-red-500/40 bg-red-500/10';
    desc = 'Journal only today. Protect your buffer, not your ego.';
  }
  return {
    pct: pct,
    verdict: verdict,
    cls: cls,
    desc: desc,
    tips: tips
  };
}
function MentalReadinessPanel(props) {
  const r = mentalReadiness(props.value);
  if (!r) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl border p-4 " + r.cls
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-3 flex-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Gauge",
    className: "h-5 w-5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, r.verdict)), /*#__PURE__*/React.createElement("span", {
    className: "num text-2xl font-extrabold"
  }, r.pct, "%")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm mt-1 opacity-90"
  }, r.desc), r.tips.length > 0 && /*#__PURE__*/React.createElement("ul", {
    className: "mt-3 space-y-1.5 text-xs text-gray-300"
  }, r.tips.map(function (t, i) {
    return /*#__PURE__*/React.createElement("li", {
      key: i,
      className: "flex items-start gap-2"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "ChevronRight",
      className: "h-3.5 w-3.5 mt-0.5 text-gray-500"
    }), /*#__PURE__*/React.createElement("span", null, t));
  })));
}

// Does being mentally ready actually change your results? Compares the day's
// P&L on high-readiness check-ins vs low ones, using the person's own data.
function MentalInsights(props) {
  const entries = props.entries;
  const rows = entries.filter(function (e) {
    return e.mentalCheck && mentalCheckTotal(e.mentalCheck) > 0;
  }).sort(function (a, b) {
    return a.date < b.date ? -1 : 1;
  });
  if (rows.length === 0) return null;
  const dayPnl = function (e) {
    return e.tradedToday === 'no' ? null : (e.trades || []).reduce(function (s, t) {
      return s + tradeSignedPnl(t);
    }, 0);
  };
  const hi = [],
    lo = [];
  rows.forEach(function (e) {
    const p = dayPnl(e);
    if (p === null || !(e.trades || []).length) return;
    (mentalCheckTotal(e.mentalCheck) >= 32 ? hi : lo).push(p);
  });
  const avg = function (a) {
    return a.length ? a.reduce(function (s, v) {
      return s + v;
    }, 0) / a.length : null;
  };
  const last = rows.slice(-30);
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-500 mb-2"
  }, "Mental Check trend (last ", last.length, " check-ins, out of 40)"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-end gap-1 h-24"
  }, last.map(function (e) {
    const t = mentalCheckTotal(e.mentalCheck);
    const c = t >= 32 ? 'bg-green-500' : t >= 20 ? 'bg-yellow-500' : 'bg-red-500';
    return /*#__PURE__*/React.createElement("div", {
      key: e.id,
      title: e.date + ': ' + t + '/40',
      className: "flex-1 rounded-t " + c,
      style: {
        height: Math.max(8, t / 40 * 100) + '%'
      }
    });
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: 'Avg day P&L when ready (32+/40), ' + hi.length + ' days',
    value: avg(hi) === null ? '-' : fmt(avg(hi)),
    color: avg(hi) === null ? 'text-gray-500' : avg(hi) >= 0 ? 'text-green-400' : 'text-red-400'
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: 'Avg day P&L when not ready (<32/40), ' + lo.length + ' days',
    value: avg(lo) === null ? '-' : fmt(avg(lo)),
    color: avg(lo) === null ? 'text-gray-500' : avg(lo) >= 0 ? 'text-green-400' : 'text-red-400'
  })));
}

// ===================== Flow State Training =====================
const FLOW_RITUAL = [{
  title: 'Nervous System Reset',
  duration: 300,
  icon: 'Heart',
  description: 'Box breathing to calm the nervous system before the market opens.',
  instructions: ['Sit upright and close your eyes', 'Breathe in for 4 counts', 'Hold for 4 counts', 'Breathe out for 6 counts', 'Repeat slowly until the timer ends']
}, {
  title: 'Body Activation',
  duration: 180,
  icon: 'Zap',
  description: 'Move to release tension and wake the body up.',
  instructions: ['Stand and shake out your whole body for 30 seconds', '20 push-ups (modify as needed)', '20 jumping jacks', 'Roll your neck slowly both ways', 'Take 3 deep breaths']
}, {
  title: 'Market Synchronization',
  duration: 180,
  icon: 'Activity',
  description: 'Tune in to the market without analyzing it yet.',
  instructions: ['Open your chart and just observe', 'Trending or ranging?', 'Is volume high or low?', 'What is the pace - fast, slow, erratic?', 'Make 3 simple observations, nothing more']
}, {
  title: 'Plan & Intention',
  duration: 180,
  icon: 'Target',
  description: 'Lock your MMM plan in before the first trade.',
  instructions: ['Say: "I trade my plan, and only A+ setups."', 'Say: "I honor my stop and my locked risk-per-trade."', 'Say: "I stop at my daily loss cap, no exceptions."', 'Say: "After a loss I step away for 30 minutes."', 'Feel the commitment behind each sentence']
}, {
  title: 'Anchor Activation',
  duration: 120,
  icon: 'Star',
  description: 'Create a physical anchor you can recall mid-session.',
  instructions: ['Hold a small object (coin, ring, stone)', 'Recall your best-executed trading day', 'Focus on the feeling of calm and precision, not the profit', 'Squeeze the object and say "I am ready"']
}];
function flowZone(skill, challenge) {
  if (challenge >= 7 && skill >= 7) return {
    zone: 'Flow',
    cls: 'text-green-400',
    desc: 'Optimal trading state: skill and challenge are both high.'
  };
  if (challenge - skill >= 3) return {
    zone: 'Anxiety',
    cls: 'text-red-400',
    desc: 'Challenge outruns your skill. Reduce size or skip the session.'
  };
  if (skill - challenge >= 3) return {
    zone: 'Boredom',
    cls: 'text-yellow-300',
    desc: 'Under-challenged: high risk of overtrading. Stick to your A+ setups only.'
  };
  if (skill <= 4 && challenge <= 4) return {
    zone: 'Apathy',
    cls: 'text-gray-400',
    desc: 'Low engagement. Use this session for review and learning, not for risk.'
  };
  return {
    zone: 'Building',
    cls: 'text-blue-300',
    desc: 'Balanced but not peak. A short ritual can lift you into flow.'
  };
}
function FlowStateTraining(props) {
  const uid = props.uid;
  const [view, setView] = useState('assess');
  const [flowPct, setFlowPct] = useState(50);
  const [skill, setSkill] = useState(5);
  const [challenge, setChallenge] = useState(5);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [feel, setFeel] = useState({});
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState(null);
  const [totalSecs, setTotalSecs] = useState(0);
  const ref = db.collection('users').doc(uid).collection('flowSessions');
  useEffect(function () {
    const unsub = ref.orderBy('ts', 'desc').limit(40).onSnapshot(function (snap) {
      setSessions(snap.docs.map(function (d) {
        return Object.assign({
          id: d.id
        }, d.data());
      }));
    }, function () {});
    return unsub;
  }, [uid]);
  useEffect(function () {
    if (!running) return;
    const t = setInterval(function () {
      setElapsed(function (v) {
        return v + 1;
      });
      setTotalSecs(function (v) {
        return v + 1;
      });
    }, 1000);
    return function () {
      clearInterval(t);
    };
  }, [running]);
  const zone = flowZone(skill, challenge);
  const ritualDone = Object.keys(done).length === FLOW_RITUAL.length;
  const score = function () {
    let b = flowPct;
    if (zone.zone === 'Flow') b += 15;
    if (ritualDone) b += 10;
    Object.values(feel).forEach(function (v) {
      if (v === 'excellent') b += 5;else if (v === 'good') b += 2;else if (v === 'poor') b -= 5;
    });
    return Math.max(0, Math.min(100, b));
  }();
  const rec = score >= 80 ? {
    t: 'Flow achieved - trade your plan at normal risk.',
    c: 'text-green-400'
  } : score >= 60 ? {
    t: 'Good state - A+ setups only.',
    c: 'text-yellow-300'
  } : score >= 40 ? {
    t: 'Below peak - reduce size and limit trades.',
    c: 'text-orange-300'
  } : {
    t: 'Not ready - no live trading. Review and reset.',
    c: 'text-red-400'
  };
  const mmss = function (s) {
    return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + s % 60;
  };
  const finishStep = function () {
    const nd = Object.assign({}, done);
    nd[step] = true;
    setDone(nd);
    setRunning(false);
    setElapsed(0);
    if (step < FLOW_RITUAL.length - 1) setStep(step + 1);else setView('results');
  };
  const reset = function () {
    setView('assess');
    setStep(0);
    setDone({});
    setElapsed(0);
    setRunning(false);
    setFeel({});
    setTotalSecs(0);
    setStatus(null);
  };
  const save = async function () {
    try {
      await ref.add({
        ts: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        flowPct: flowPct,
        skill: skill,
        challenge: challenge,
        zone: zone.zone,
        ritual: ritualDone,
        ritualSecs: totalSecs,
        feelings: feel,
        score: score
      });
      setStatus({
        type: 'ok',
        text: 'Session saved.'
      });
    } catch (e) {
      setStatus({
        type: 'error',
        text: 'Could not save: ' + e.message
      });
    }
  };
  const removeSession = async function (id) {
    try {
      await ref.doc(id).delete();
    } catch (e) {}
  };
  const withR = sessions.filter(function (s) {
      return s.ritual;
    }),
    noR = sessions.filter(function (s) {
      return !s.ritual;
    });
  const avg = function (a) {
    return a.length ? Math.round(a.reduce(function (s, v) {
      return s + v.score;
    }, 0) / a.length) : null;
  };
  const cur = FLOW_RITUAL[step];
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-cyan-950/40 to-black border border-cyan-800/40 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Waves",
    className: "h-5 w-5 text-cyan-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Flow State Training")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-5"
  }, "A 15-minute pre-session ritual that gets you calm, focused and committed to the MMM plan before the first trade. Assess, run the ritual, then log how you feel."), view === 'assess' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-xs mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "How much in the flow do you feel right now?"), /*#__PURE__*/React.createElement("span", {
    className: "num text-cyan-300"
  }, flowPct, "%")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    value: flowPct,
    onChange: function (e) {
      setFlowPct(parseInt(e.target.value, 10));
    },
    className: "w-full accent-cyan-400"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-xs mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "Your skill level today"), /*#__PURE__*/React.createElement("span", {
    className: "num text-cyan-300"
  }, skill, "/10")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "1",
    max: "10",
    value: skill,
    onChange: function (e) {
      setSkill(parseInt(e.target.value, 10));
    },
    className: "w-full accent-cyan-400"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-xs mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "Challenge of today's market"), /*#__PURE__*/React.createElement("span", {
    className: "num text-cyan-300"
  }, challenge, "/10")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "1",
    max: "10",
    value: challenge,
    onChange: function (e) {
      setChallenge(parseInt(e.target.value, 10));
    },
    className: "w-full accent-cyan-400"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 border border-gray-800 rounded-xl p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-500"
  }, "Performance zone"), /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold " + zone.cls
  }, zone.zone), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-400 mt-1"
  }, zone.desc)), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setView('ritual');
    },
    className: "inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/30 px-5 py-2.5 rounded-lg text-sm font-semibold"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Play",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Start the Flow Ritual"))), view === 'ritual' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs text-gray-400"
  }, /*#__PURE__*/React.createElement("span", null, "Step ", step + 1, " of ", FLOW_RITUAL.length), /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, mmss(cur.duration), " suggested")), /*#__PURE__*/React.createElement("div", {
    className: "h-1.5 bg-gray-800 rounded-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-cyan-400 transition-all",
    style: {
      width: Object.keys(done).length / FLOW_RITUAL.length * 100 + '%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 border border-cyan-800/30 rounded-xl p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: cur.icon,
    className: "h-5 w-5 text-cyan-400"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "font-semibold text-white"
  }, cur.title)), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-400 mb-3"
  }, cur.description), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-1.5"
  }, cur.instructions.map(function (t, i) {
    return /*#__PURE__*/React.createElement("li", {
      key: i,
      className: "flex items-start gap-2 text-sm text-gray-300"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "CheckCircle",
      className: "h-4 w-4 text-cyan-500 mt-0.5"
    }), /*#__PURE__*/React.createElement("span", null, t));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 flex-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num text-3xl font-bold text-cyan-300"
  }, mmss(Math.max(0, cur.duration - elapsed))), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setRunning(!running);
    },
    className: "inline-flex items-center gap-1.5 bg-gray-800 border border-gray-700 text-gray-200 px-3 py-2 rounded-lg text-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: running ? 'Pause' : 'Play',
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, running ? 'Pause' : 'Start timer')), /*#__PURE__*/React.createElement("button", {
    onClick: finishStep,
    className: "inline-flex items-center gap-1.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 px-4 py-2 rounded-lg text-sm font-semibold"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Check",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, step < FLOW_RITUAL.length - 1 ? 'Done, next step' : 'Finish ritual')), /*#__PURE__*/React.createElement("button", {
    onClick: reset,
    className: "text-xs text-gray-500 hover:text-gray-300"
  }, "Cancel"))), view === 'results' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-semibold text-white mb-3"
  }, "How do you feel after the ritual?"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-3"
  }, ['Focus', 'Calmness', 'Confidence', 'Clarity'].map(function (f) {
    return /*#__PURE__*/React.createElement("div", {
      key: f
    }, /*#__PURE__*/React.createElement("label", {
      className: "block text-xs text-cyan-300 mb-1"
    }, f), /*#__PURE__*/React.createElement("select", {
      value: feel[f] || '',
      onChange: function (e) {
        const n = Object.assign({}, feel);
        n[f] = e.target.value;
        setFeel(n);
      },
      className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm outline-none"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Select..."), /*#__PURE__*/React.createElement("option", {
      value: "excellent"
    }, "Excellent"), /*#__PURE__*/React.createElement("option", {
      value: "good"
    }, "Good"), /*#__PURE__*/React.createElement("option", {
      value: "okay"
    }, "Okay"), /*#__PURE__*/React.createElement("option", {
      value: "poor"
    }, "Poor")));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 border border-gray-800 rounded-xl p-5 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-500"
  }, "Flow Score"), /*#__PURE__*/React.createElement("div", {
    className: "num text-5xl font-extrabold text-cyan-300"
  }, score), /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold mt-1 " + rec.c
  }, rec.t), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-600 mt-1"
  }, "Zone: ", zone.zone, ritualDone ? ' - ritual completed' : '')), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 flex-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: save,
    className: "bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/30 px-4 py-2 rounded-lg text-sm font-semibold"
  }, "Save Session"), /*#__PURE__*/React.createElement("button", {
    onClick: reset,
    className: "inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "RotateCcw",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Start over")), status && /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-medium " + (status.type === 'error' ? 'text-red-400' : 'text-green-400')
  }, status.text)))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "History",
    className: "h-5 w-5 text-gray-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Flow Session History")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "Your saved flow sessions. Compare the days you ran the ritual against the days you skipped it."), sessions.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 py-6 text-center"
  }, "No flow sessions saved yet.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Sessions",
    value: String(sessions.length),
    color: "text-blue-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Avg Flow Score",
    value: String(avg(sessions)),
    color: "text-cyan-300"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Avg with ritual",
    value: avg(withR) === null ? '-' : String(avg(withR)),
    color: "text-green-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Avg without ritual",
    value: avg(noR) === null ? '-' : String(avg(noR)),
    color: "text-gray-400"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-end gap-1 h-20 mb-4"
  }, sessions.slice().reverse().map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      title: s.date + ': ' + s.score,
      className: "flex-1 rounded-t bg-cyan-500/70",
      style: {
        height: Math.max(6, s.score) + '%'
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-xs"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-gray-500 border-b border-gray-800"
  }, /*#__PURE__*/React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "Date"), /*#__PURE__*/React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "Zone"), /*#__PURE__*/React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "Ritual"), /*#__PURE__*/React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "Score"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, sessions.slice(0, 15).map(function (s) {
    return /*#__PURE__*/React.createElement("tr", {
      key: s.id,
      className: "border-b border-gray-900"
    }, /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 pr-3 text-gray-300 num"
    }, s.date), /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 pr-3 text-gray-400"
    }, s.zone), /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 pr-3 text-gray-400"
    }, s.ritual ? 'Completed' : 'Skipped'), /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 pr-3 font-semibold num text-cyan-300"
    }, s.score), /*#__PURE__*/React.createElement("td", {
      className: "py-1.5 text-right"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        removeSession(s.id);
      },
      className: "text-gray-600 hover:text-red-400"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Trash2",
      className: "h-3.5 w-3.5"
    }))));
  })))))));
}

// ===================== Discipline & Psychology Tracker =====================
const PSYCH_MOODS = ['calm', 'focused', 'confident', 'anxious', 'frustrated', 'overconfident', 'fatigued', 'distracted'];
const PSYCH_NEGATIVE = ['anxious', 'frustrated', 'overconfident', 'fatigued', 'distracted'];
const PSYCH_TRIGGERS = ['FOMO', 'Revenge urge', 'Fear of loss', 'Greed', 'Overconfidence', 'Boredom', 'Fatigue', 'Outside stress'];
function computePsychProfile(accounts, entries, logs) {
  const ids = {};
  accounts.forEach(function (a) {
    ids[a.id] = true;
  });
  const traded = entries.filter(function (e) {
    return ids[e.accountId] && e.tradedToday !== 'no' && (e.trades || []).length > 0;
  });
  let postLoss = 0,
    revenge = 0,
    oversize = 0,
    beyondMax = 0,
    totalTrades = 0;
  traded.forEach(function (e) {
    const tr = e.trades || [];
    const maxT = parseInt(e.dailyPlan && e.dailyPlan.maxTrades, 10);
    tr.forEach(function (t, i) {
      totalTrades++;
      const risk = Math.abs(parseFloat(t.riskAmount) || 0);
      if (t.expectedRisk && risk > t.expectedRisk * 1.1) oversize++;
      if (maxT > 0 && i >= maxT) beyondMax++;
      if (i > 0 && tr[i - 1].result === 'loss') {
        postLoss++;
        const prev = Math.abs(parseFloat(tr[i - 1].riskAmount) || 0);
        if (prev > 0 && risk > prev * 1.1) revenge++;
      }
    });
  });
  const disc = computeDisciplineScore(accounts, entries);
  const reflections = entries.filter(function (e) {
    return ids[e.accountId] && e.reflection && e.reflection.emotionalState;
  });
  const negRefl = reflections.filter(function (e) {
    return ['anxious', 'frustrated', 'excited', 'fatigued'].indexOf(e.reflection.emotionalState) >= 0;
  }).length;
  const negLogs = logs.filter(function (l) {
    return PSYCH_NEGATIVE.indexOf(l.mood) >= 0;
  }).length;
  const emoTotal = reflections.length + logs.length;
  const fearLogs = logs.filter(function (l) {
    return (l.triggers || []).indexOf('Fear of loss') >= 0;
  }).length;
  return {
    discipline: disc ? disc.score : null,
    stability: emoTotal > 0 ? 100 - (negRefl + negLogs) / emoTotal * 100 : null,
    revenge: postLoss > 0 ? revenge / postLoss * 100 : null,
    greed: totalTrades > 0 ? (oversize + beyondMax) / totalTrades * 100 : null,
    fear: logs.length > 0 ? fearLogs / logs.length * 100 : null,
    ruleBreakRate: logs.length > 0 ? logs.filter(function (l) {
      return l.ruleBreak;
    }).length / logs.length * 100 : null,
    trades: totalTrades
  };
}
function PsychologyTracker(props) {
  const uid = props.uid;
  const accounts = props.accounts;
  const entries = props.entries;
  const todayStr = new Date().toISOString().slice(0, 10);
  const [logs, setLogs] = useState([]);
  const [mood, setMood] = useState('calm');
  const [triggers, setTriggers] = useState([]);
  const [urge, setUrge] = useState(3);
  const [ruleBreak, setRuleBreak] = useState(false);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState(null);
  const ref = db.collection('users').doc(uid).collection('psychLogs');
  useEffect(function () {
    const unsub = ref.orderBy('ts', 'desc').limit(120).onSnapshot(function (snap) {
      setLogs(snap.docs.map(function (d) {
        return Object.assign({
          id: d.id
        }, d.data());
      }));
    }, function () {});
    return unsub;
  }, [uid]);
  const toggleTrigger = function (t) {
    setTriggers(triggers.indexOf(t) >= 0 ? triggers.filter(function (x) {
      return x !== t;
    }) : triggers.concat([t]));
  };
  const save = async function () {
    try {
      await ref.add({
        ts: Date.now(),
        date: todayStr,
        mood: mood,
        triggers: triggers,
        urge: urge,
        ruleBreak: ruleBreak,
        note: note
      });
      setTriggers([]);
      setNote('');
      setRuleBreak(false);
      setUrge(3);
      setMood('calm');
      setStatus({
        type: 'ok',
        text: 'Check-in saved.'
      });
    } catch (e) {
      setStatus({
        type: 'error',
        text: 'Could not save: ' + e.message
      });
    }
  };
  const remove = async function (id) {
    try {
      await ref.doc(id).delete();
    } catch (e) {}
  };
  const p = computePsychProfile(accounts, entries, logs);
  const tile = function (label, v, goodHigh, sub) {
    const has = v !== null && v !== undefined;
    const good = has && (goodHigh ? v >= 70 : v <= 20);
    const mid = has && (goodHigh ? v >= 45 : v <= 40);
    const c = !has ? 'text-gray-500' : good ? 'text-green-400' : mid ? 'text-yellow-400' : 'text-red-400';
    return /*#__PURE__*/React.createElement(ProStatTile, {
      key: label,
      label: label,
      value: has ? Math.round(v) + '%' : '-',
      color: c,
      sub: sub
    });
  };
  const trigCount = {};
  logs.forEach(function (l) {
    (l.triggers || []).forEach(function (t) {
      trigCount[t] = (trigCount[t] || 0) + 1;
    });
  });
  const trigList = Object.keys(trigCount).sort(function (a, b) {
    return trigCount[b] - trigCount[a];
  });
  const maxTrig = trigList.length ? trigCount[trigList[0]] : 1;
  const ov = computeOverviewData(accounts, entries);
  const withBreak = [],
    noBreak = [];
  logs.forEach(function (l) {
    if (ov.byDate[l.date] === undefined) return;
    (l.ruleBreak ? withBreak : noBreak).push(ov.byDate[l.date]);
  });
  const avgA = function (a) {
    return a.length ? a.reduce(function (s, v) {
      return s + v;
    }, 0) / a.length : null;
  };
  const advice = [];
  if (p.revenge !== null && p.revenge > 15) advice.push('Revenge pattern: after losses you sized up ' + Math.round(p.revenge) + '% of the time. Apply the 30-minute rule: close the platform after any loss and keep risk fixed.');
  if (p.greed !== null && p.greed > 15) advice.push('Overtrading or oversizing on ' + Math.round(p.greed) + '% of trades. Respect your planned number of trades and your locked risk-per-trade.');
  if (p.fear !== null && p.fear > 25) advice.push('Fear of loss shows up in ' + Math.round(p.fear) + '% of check-ins. Pre-define the stop and size small enough that a loss is just a cost of doing business.');
  if (p.stability !== null && p.stability < 60) advice.push('Emotional stability is ' + Math.round(p.stability) + '%. Run the Flow State ritual before sessions and check the Mental Check verdict before trading.');
  if (trigList.length && trigCount[trigList[0]] >= 3) advice.push('Your most frequent trigger is "' + trigList[0] + '" (' + trigCount[trigList[0]] + 'x). Write a one-line if-then rule for it and put it in tomorrow\'s plan.');
  if (p.ruleBreakRate !== null && p.ruleBreakRate > 25) advice.push('You reported breaking a rule in ' + Math.round(p.ruleBreakRate) + '% of check-ins. Pick one rule to fix this week instead of all of them.');
  if (advice.length === 0) advice.push(logs.length < 3 ? 'Log a few daily check-ins and trades to unlock personal pattern analysis.' : 'No red flags in your current data. Keep logging daily to hold the standard.');
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-rose-950/30 to-black border border-rose-800/40 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "HeartPulse",
    className: "h-5 w-5 text-rose-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Discipline & Psychology Tracker")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "Your behavioral profile, built from your trades, reflections and daily check-ins. Lower is better for Revenge, Greed and Fear; higher is better for Discipline and Emotional Stability."), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 lg:grid-cols-3 gap-3"
  }, tile('Discipline Index', p.discipline, true, 'From your Discipline score'), tile('Emotional Stability', p.stability, true, 'Calm vs. charged states'), tile('Revenge Index', p.revenge, false, 'Size-ups right after a loss'), tile('Greed Index', p.greed, false, 'Oversized or beyond-plan trades'), tile('Fear Index', p.fear, false, 'Check-ins with fear of loss'), tile('Rule-Break Rate', p.ruleBreakRate, false, 'Check-ins where you broke a rule'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Sparkles",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Personal Advice")), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2 mt-3"
  }, advice.map(function (a, i) {
    return /*#__PURE__*/React.createElement("li", {
      key: i,
      className: "flex items-start gap-2 text-sm text-gray-300"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "ChevronRight",
      className: "h-4 w-4 text-yellow-400 mt-0.5"
    }), /*#__PURE__*/React.createElement("span", null, a));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "PenLine",
    className: "h-5 w-5 text-rose-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Psychology Check-In")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "A 30-second honest log of how you felt while trading today."), /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1.5"
  }, "Main emotional state"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 mb-4"
  }, PSYCH_MOODS.map(function (m) {
    return /*#__PURE__*/React.createElement("button", {
      key: m,
      onClick: function () {
        setMood(m);
      },
      className: "px-3 py-1.5 rounded-lg text-xs capitalize border " + (mood === m ? 'bg-rose-500/20 border-rose-500/50 text-rose-200' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200')
    }, m);
  })), /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1.5"
  }, "Triggers you felt"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 mb-4"
  }, PSYCH_TRIGGERS.map(function (t) {
    const on = triggers.indexOf(t) >= 0;
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: function () {
        toggleTrigger(t);
      },
      className: "px-3 py-1.5 rounded-lg text-xs border " + (on ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200')
    }, t);
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid md:grid-cols-2 gap-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-xs mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "Urge to break your plan"), /*#__PURE__*/React.createElement("span", {
    className: "num text-rose-300"
  }, urge, "/10")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "1",
    max: "10",
    value: urge,
    onChange: function (e) {
      setUrge(parseInt(e.target.value, 10));
    },
    className: "w-full accent-rose-400"
  })), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: ruleBreak,
    onChange: function (e) {
      setRuleBreak(e.target.checked);
    },
    className: "accent-rose-400 h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "I broke one of my rules today"))), /*#__PURE__*/React.createElement("textarea", {
    value: note,
    onChange: function (e) {
      setNote(e.target.value);
    },
    placeholder: "What happened, and what will you do differently?",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm h-16 outline-none resize-none mb-3"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: save,
    className: "bg-rose-500/20 border border-rose-500/40 text-rose-200 hover:bg-rose-500/30 px-4 py-2 rounded-lg text-sm font-semibold"
  }, "Save Check-In"), status && /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-medium " + (status.type === 'error' ? 'text-red-400' : 'text-green-400')
  }, status.text))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "History",
    className: "h-5 w-5 text-gray-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Pattern Analysis & History")), logs.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 py-6 text-center"
  }, "No psychology check-ins yet.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-5 mt-3"
  }, trigList.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-500 mb-2"
  }, "Most frequent triggers"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, trigList.map(function (t) {
    return /*#__PURE__*/React.createElement("div", {
      key: t
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between text-xs mb-0.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-300"
    }, t), /*#__PURE__*/React.createElement("span", {
      className: "num text-gray-400"
    }, trigCount[t], "x")), /*#__PURE__*/React.createElement("div", {
      className: "h-1.5 bg-gray-800 rounded-full overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full bg-yellow-500/80 rounded-full",
      style: {
        width: trigCount[t] / maxTrig * 100 + '%'
      }
    })));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: 'Avg day P&L after a rule break (' + withBreak.length + ' days)',
    value: avgA(withBreak) === null ? '-' : fmt(avgA(withBreak)),
    color: avgA(withBreak) === null ? 'text-gray-500' : avgA(withBreak) >= 0 ? 'text-green-400' : 'text-red-400'
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: 'Avg day P&L when disciplined (' + noBreak.length + ' days)',
    value: avgA(noBreak) === null ? '-' : fmt(avgA(noBreak)),
    color: avgA(noBreak) === null ? 'text-gray-500' : avgA(noBreak) >= 0 ? 'text-green-400' : 'text-red-400'
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, logs.slice(0, 20).map(function (l) {
    return /*#__PURE__*/React.createElement("div", {
      key: l.id,
      className: "bg-black/30 border border-gray-800 rounded-lg p-3 flex items-start justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 flex-wrap text-xs"
    }, /*#__PURE__*/React.createElement("span", {
      className: "num text-gray-300"
    }, l.date), /*#__PURE__*/React.createElement("span", {
      className: "capitalize px-2 py-0.5 rounded-full bg-gray-800 text-gray-300"
    }, l.mood), /*#__PURE__*/React.createElement("span", {
      className: "text-gray-500"
    }, "urge ", l.urge, "/10"), l.ruleBreak && /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30"
    }, "rule broken"), (l.triggers || []).map(function (t) {
      return /*#__PURE__*/React.createElement("span", {
        key: t,
        className: "px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-300"
      }, t);
    })), l.note && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-400 mt-1.5"
    }, l.note)), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        remove(l.id);
      },
      className: "text-gray-600 hover:text-red-400 flex-shrink-0"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Trash2",
      className: "h-3.5 w-3.5"
    })));
  })))));
}

// ===================== Historical Plan =====================
function HistoricalPlan(props) {
  const entries = props.entries;
  const [month, setMonth] = useState('all');
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);
  const planned = entries.filter(function (e) {
    const p = e.dailyPlan;
    return p && (p.targetProfit || p.maxTrades || p.maxLossPerDay || p.notes);
  }).sort(function (a, b) {
    return a.date < b.date ? 1 : -1;
  });
  const evalDay = function (e) {
    const p = e.dailyPlan || {};
    const tr = e.tradedToday === 'no' ? [] : e.trades || [];
    const pnl = tr.reduce(function (s, t) {
      return s + tradeSignedPnl(t);
    }, 0);
    const maxT = parseInt(p.maxTrades, 10);
    const cap = parseFloat(p.maxLossPerDay);
    const tgt = parseFloat(p.targetProfit);
    const withinTrades = !(maxT > 0) || tr.length <= maxT;
    const withinLoss = !(cap > 0) || pnl >= -cap * 1.1;
    return {
      tr: tr,
      pnl: pnl,
      withinTrades: withinTrades,
      withinLoss: withinLoss,
      followed: withinTrades && withinLoss,
      targetHit: tgt > 0 ? pnl >= tgt : null
    };
  };
  const months = Array.from(new Set(planned.map(function (e) {
    return (e.date || '').slice(0, 7);
  })));
  const rows = planned.filter(function (e) {
    if (month !== 'all' && (e.date || '').slice(0, 7) !== month) return false;
    const ev = evalDay(e);
    if (filter === 'followed') return ev.followed;
    if (filter === 'broken') return !ev.followed;
    return true;
  });
  const evs = planned.map(evalDay);
  const followedPct = evs.length ? Math.round(evs.filter(function (v) {
    return v.followed;
  }).length / evs.length * 100) : null;
  const tg = evs.filter(function (v) {
    return v.targetHit !== null;
  });
  const targetPct = tg.length ? Math.round(tg.filter(function (v) {
    return v.targetHit;
  }).length / tg.length * 100) : null;
  const fol = evs.filter(function (v) {
      return v.followed;
    }),
    brk = evs.filter(function (v) {
      return !v.followed;
    });
  const avgP = function (a) {
    return a.length ? a.reduce(function (s, v) {
      return s + v.pnl;
    }, 0) / a.length : null;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "History",
    className: "h-5 w-5 text-purple-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Historical Plan")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "Every past plan next to what actually happened. Open a day to see its trades, reflection and mental check."), planned.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 py-6 text-center"
  }, "No logged days with a plan yet. Save a Daily Plan, then log your entry to build your plan history.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Days planned",
    value: String(planned.length),
    color: "text-blue-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Plan followed",
    value: followedPct === null ? '-' : followedPct + '%',
    color: followedPct >= 70 ? 'text-green-400' : 'text-yellow-400'
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Target hit rate",
    value: targetPct === null ? '-' : targetPct + '%',
    color: "text-purple-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Avg P&L: followed / broken",
    value: (avgP(fol) === null ? '-' : fmt(avgP(fol))) + ' / ' + (avgP(brk) === null ? '-' : fmt(avgP(brk))),
    color: "text-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("select", {
    value: month,
    onChange: function (e) {
      setMonth(e.target.value);
    },
    className: "bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none"
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All months"), months.map(function (m) {
    return /*#__PURE__*/React.createElement("option", {
      key: m,
      value: m
    }, m);
  })), [['all', 'All days'], ['followed', 'Plan followed'], ['broken', 'Plan broken']].map(function (f) {
    return /*#__PURE__*/React.createElement("button", {
      key: f[0],
      onClick: function () {
        setFilter(f[0]);
      },
      className: "px-3 py-1.5 rounded-lg text-xs border " + (filter === f[0] ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'bg-gray-800 border-gray-700 text-gray-400')
    }, f[1]);
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, rows.slice(0, 60).map(function (e) {
    const ev = evalDay(e),
      p = e.dailyPlan || {};
    const isOpen = open === e.id;
    return /*#__PURE__*/React.createElement("div", {
      key: e.id,
      className: "bg-black/30 border border-gray-800 rounded-xl"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        setOpen(isOpen ? null : e.id);
      },
      className: "w-full text-left p-3 flex items-center justify-between gap-3 flex-wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 flex-wrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: "num text-sm text-gray-200"
    }, e.date), /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] px-2 py-0.5 rounded-full border " + (ev.followed ? 'bg-green-500/10 text-green-300 border-green-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30')
    }, ev.followed ? 'Plan followed' : 'Plan broken'), ev.targetHit !== null && /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] " + (ev.targetHit ? 'text-green-400' : 'text-gray-500')
    }, ev.targetHit ? 'Target hit' : 'Target missed')), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4 text-xs"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-500"
    }, "Plan: ", p.plannedTrades || '-', " trades, target ", p.targetProfit ? fmt(parseFloat(p.targetProfit)) : '-'), /*#__PURE__*/React.createElement("span", {
      className: "text-gray-500"
    }, "Actual: ", ev.tr.length, " trades"), /*#__PURE__*/React.createElement("span", {
      className: "num font-semibold " + (ev.pnl >= 0 ? 'text-green-400' : 'text-red-400')
    }, fmt(ev.pnl)), /*#__PURE__*/React.createElement(Icon, {
      name: isOpen ? 'ChevronUp' : 'ChevronDown',
      className: "h-4 w-4 text-gray-500"
    }))), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "border-t border-gray-800 p-3 space-y-3 text-xs text-gray-400"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 md:grid-cols-4 gap-2"
    }, /*#__PURE__*/React.createElement("div", null, "Risk / trade: ", /*#__PURE__*/React.createElement("span", {
      className: "text-gray-200 num"
    }, p.riskAmount ? fmt(parseFloat(p.riskAmount)) : '-')), /*#__PURE__*/React.createElement("div", null, "Max trades: ", /*#__PURE__*/React.createElement("span", {
      className: "text-gray-200 num"
    }, p.maxTrades || '-')), /*#__PURE__*/React.createElement("div", null, "R:R plan: ", /*#__PURE__*/React.createElement("span", {
      className: "text-gray-200 num"
    }, p.riskRewardRatio || '-')), /*#__PURE__*/React.createElement("div", null, "Max loss / day: ", /*#__PURE__*/React.createElement("span", {
      className: "text-gray-200 num"
    }, p.maxLossPerDay ? fmt(parseFloat(p.maxLossPerDay)) : '-')), /*#__PURE__*/React.createElement("div", null, "Session: ", /*#__PURE__*/React.createElement("span", {
      className: "text-gray-200"
    }, p.startTime || '-', " to ", p.endTime || '-')), /*#__PURE__*/React.createElement("div", null, "Mental check: ", /*#__PURE__*/React.createElement("span", {
      className: "text-gray-200 num"
    }, e.mentalCheck && mentalCheckTotal(e.mentalCheck) ? mentalCheckTotal(e.mentalCheck) + '/40' : '-')), /*#__PURE__*/React.createElement("div", null, "Within max trades: ", /*#__PURE__*/React.createElement("span", {
      className: ev.withinTrades ? 'text-green-400' : 'text-red-400'
    }, ev.withinTrades ? 'Yes' : 'No')), /*#__PURE__*/React.createElement("div", null, "Within loss cap: ", /*#__PURE__*/React.createElement("span", {
      className: ev.withinLoss ? 'text-green-400' : 'text-red-400'
    }, ev.withinLoss ? 'Yes' : 'No'))), p.notes && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-500"
    }, "Plan notes:"), " ", /*#__PURE__*/React.createElement("span", {
      className: "text-gray-300"
    }, p.notes)), ev.tr.length > 0 && /*#__PURE__*/React.createElement("div", null, ev.tr.map(function (t, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "flex justify-between border-b border-gray-900 py-1"
      }, /*#__PURE__*/React.createElement("span", null, "Trade ", i + 1, t.direction ? ' - ' + t.direction : '', t.setup ? ' - ' + t.setup : ''), /*#__PURE__*/React.createElement("span", {
        className: "num " + (t.result === 'win' ? 'text-green-400' : 'text-red-400')
      }, fmt(tradeSignedPnl(t))));
    })), e.reflection && (e.reflection.wentWrong || e.reflection.wentRight || e.reflection.lessonsLearned) && /*#__PURE__*/React.createElement("div", {
      className: "space-y-1"
    }, e.reflection.wentRight && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
      className: "text-green-400"
    }, "Went right:"), " ", e.reflection.wentRight), e.reflection.wentWrong && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
      className: "text-red-400"
    }, "Went wrong:"), " ", e.reflection.wentWrong), e.reflection.lessonsLearned && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
      className: "text-yellow-400"
    }, "Lesson:"), " ", e.reflection.lessonsLearned))));
  }), rows.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 py-4 text-center"
  }, "Nothing matches this filter."))));
}

// ===================== Pre-Session Go / No-Go =====================
const GONOGO_ITEMS = ['Higher-timeframe bias and key levels are marked', 'News and events for today are checked', 'My risk per trade is my locked amount', 'My daily loss cap is written down', 'Stop and target are defined before any entry', 'I will take A+ setups from my plan only'];
function PreSessionGoNoGo(props) {
  const key = 'mmm-gonogo-' + props.accountId + '-' + new Date().toISOString().slice(0, 10);
  const [checked, setChecked] = useState(function () {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      return [];
    }
  });
  const toggle = function (i) {
    const n = checked.indexOf(i) >= 0 ? checked.filter(function (x) {
      return x !== i;
    }) : checked.concat([i]);
    setChecked(n);
    try {
      localStorage.setItem(key, JSON.stringify(n));
    } catch (e) {}
  };
  const r = mentalReadiness(props.mentalCheck);
  const all = checked.length === GONOGO_ITEMS.length;
  const ready = r && r.pct >= 60;
  const go = all && ready;
  return /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border p-6 " + (go ? 'border-green-500/40 bg-green-500/5' : 'border-gray-800 bg-gradient-to-br from-gray-900 to-black')
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-3 flex-wrap mb-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShieldCheck",
    className: "h-5 w-5 " + (go ? 'text-green-400' : 'text-yellow-400')
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Pre-Session Go / No-Go")), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold px-3 py-1 rounded-full border " + (go ? 'bg-green-500/15 text-green-300 border-green-500/40' : 'bg-red-500/10 text-red-300 border-red-500/30')
  }, go ? 'GO' : 'NOT YET')), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "Tick every item and keep your mental readiness at 60% or better. Resets every day."), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, GONOGO_ITEMS.map(function (t, i) {
    return /*#__PURE__*/React.createElement("label", {
      key: i,
      className: "flex items-center gap-2.5 text-sm text-gray-300 cursor-pointer"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: checked.indexOf(i) >= 0,
      onChange: function () {
        toggle(i);
      },
      className: "accent-green-400 h-4 w-4"
    }), /*#__PURE__*/React.createElement("span", null, t));
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 text-xs text-gray-400"
  }, "Mental readiness: ", /*#__PURE__*/React.createElement("span", {
    className: "font-semibold " + (ready ? 'text-green-400' : 'text-red-400')
  }, r ? r.pct + '% - ' + r.verdict : 'not set')));
}

// ===================== Navigation sections (menu reorganised into a clear flow) =====================
// Internal test accounts that must never appear on the public leaderboard.
const HIDDEN_LEADERBOARD_NAMES = ['Upg Tester', 'Claude Archive Test'];
const NAV_SECTIONS = [{
  key: 'overview',
  label: 'Overview',
  icon: 'LayoutDashboard',
  pages: [{
    key: 'overview',
    label: 'Command Center',
    icon: 'LayoutDashboard'
  }]
}, {
  key: 'plan',
  label: 'Pre-Session',
  icon: 'Calendar',
  pages: [{
    key: 'dailyplan',
    label: 'Daily Plan',
    icon: 'Calendar'
  }, {
    key: 'mentalcheck',
    label: 'Mental Check',
    icon: 'Brain'
  }, {
    key: 'flowstate',
    label: 'Flow State',
    icon: 'Waves'
  }, {
    key: 'historicalplan',
    label: 'Historical Plan',
    icon: 'History'
  }]
}, {
  key: 'trades',
  label: 'Trades',
  icon: 'CandlestickChart',
  pages: [{
    key: 'history',
    label: 'Trade History',
    icon: 'Calendar'
  }, {
    key: 'reports',
    label: 'Reports',
    icon: 'BarChart3'
  }]
}, {
  key: 'disc',
  label: 'Discipline',
  icon: 'ShieldCheck',
  pages: [{
    key: 'discipline',
    label: 'Test & Progress',
    icon: 'ClipboardCheck'
  }, {
    key: 'psychology',
    label: 'Psychology',
    icon: 'HeartPulse'
  }]
}, {
  key: 'money',
  label: 'Money',
  icon: 'DollarSign',
  pages: [{
    key: 'finances',
    label: 'Finances',
    icon: 'DollarSign'
  }, {
    key: 'projections',
    label: 'Projections',
    icon: 'Target'
  }]
}, {
  key: 'strategy',
  label: 'Strategy',
  icon: 'BookOpen',
  pages: [{
    key: 'strategy',
    label: 'Strategy',
    icon: 'BookOpen'
  }]
}];
const DISCIPLINE_GATED_PAGES = ['discipline', 'psychology', 'flowstate', 'mentalcheck'];
function sectionForPage(pageKey) {
  return NAV_SECTIONS.find(function (s) {
    return s.pages.some(function (p) {
      return p.key === pageKey;
    });
  }) || NAV_SECTIONS[0];
}
function MainNav(props) {
  const activePage = props.activePage;
  const setActivePage = props.setActivePage;
  const section = sectionForPage(activePage);
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5 overflow-x-auto pb-1"
  }, NAV_SECTIONS.map(function (s) {
    const on = s.key === section.key;
    return /*#__PURE__*/React.createElement("button", {
      key: s.key,
      onClick: function () {
        setActivePage(s.pages[0].key);
      },
      className: "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap border transition " + (on ? 'bg-yellow-500/15 border-yellow-500/50 text-yellow-300' : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s.icon,
      className: "h-4 w-4"
    }), /*#__PURE__*/React.createElement("span", null, s.label));
  })), section.pages.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1 border-b border-gray-900 overflow-x-auto"
  }, section.pages.map(function (p) {
    return /*#__PURE__*/React.createElement("button", {
      key: p.key,
      onClick: function () {
        setActivePage(p.key);
      },
      className: "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition " + (activePage === p.key ? 'border-yellow-400 text-yellow-300' : 'border-transparent text-gray-500 hover:text-gray-300')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: p.icon,
      className: "h-3.5 w-3.5"
    }), /*#__PURE__*/React.createElement("span", null, p.label));
  })));
}

// Everything that measures discipline is locked until the trader has taken the
// Trading Discipline Test - it's the baseline every later score is compared to.
function DisciplineTestGate(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-yellow-950/30 to-black border border-yellow-500/30 rounded-2xl p-8 text-center max-w-2xl mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-4"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Lock",
    className: "h-8 w-8 text-yellow-400"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold text-white mb-2"
  }, "Take the Discipline Test to unlock this"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-400 leading-relaxed mb-5"
  }, "The Trading Discipline Test is your starting line. It takes 2 minutes and sets the baseline that every later score, check-in and psychology report is compared with. Until you take it, Mental Check, Flow State, Psychology and the Discipline page stay locked."), /*#__PURE__*/React.createElement("a", {
    href: "../diagnostic/",
    className: "inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-xl font-bold"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Play",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Take the Discipline Test")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600 mt-4"
  }, "Already took it? Come back through \"Sign In to See Results\" at the end of the test and it will appear here."));
}
function DisciplineRing(props) {
  const score = props.score;
  const g = disciplineGrade(score);
  const r = 34,
    c = 2 * Math.PI * r;
  const pct = score === null || score === undefined ? 0 : Math.max(0, Math.min(100, score));
  const stroke = pct >= 80 ? '#4ade80' : pct >= 60 ? '#fbbf24' : '#f87171';
  return /*#__PURE__*/React.createElement("div", {
    className: "relative h-24 w-24 flex-shrink-0"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 80 80",
    className: "h-24 w-24 -rotate-90"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "40",
    cy: "40",
    r: r,
    fill: "none",
    stroke: "#1f2937",
    strokeWidth: "7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "40",
    cy: "40",
    r: r,
    fill: "none",
    stroke: stroke,
    strokeWidth: "7",
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: c * (1 - pct / 100)
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex flex-col items-center justify-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num text-xl font-extrabold " + g.color
  }, score === null || score === undefined ? '-' : Math.round(score)), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] font-bold " + g.color
  }, "Grade ", g.letter)));
}

// The first thing you see: how healthy is the account, how disciplined are
// you, and what should you do right now.
function CommandCenter(props) {
  const s = computeAdvancedStats(props.accounts, props.entries);
  const acc = props.account;
  const maxDD = parseFloat(acc.maxDrawdown) || 0;
  const buffer = Math.max(props.buffer, 0);
  const bufPct = maxDD > 0 ? Math.max(0, Math.min(100, buffer / maxDD * 100)) : 0;
  const bufColor = bufPct < 30 ? 'bg-red-500' : bufPct < 60 ? 'bg-yellow-500' : 'bg-green-500';
  const r = mentalReadiness(props.mentalCheck);
  const maxTrades = 3;
  const tradesLeft = Math.max(0, maxTrades - props.todayTrades);
  const mission = [{
    ok: !!props.mentalDone,
    label: 'Mental Check done',
    go: 'mentalcheck'
  }, {
    ok: props.planSet,
    label: 'Daily Plan set',
    go: 'dailyplan'
  }, {
    ok: props.todayTrades > 0 || props.loggedToday,
    label: 'Today logged',
    go: null
  }];
  const stopped = props.todayPnl <= -props.dailyCap && props.dailyCap > 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "grid lg:grid-cols-5 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-3 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between gap-4 flex-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold text-white truncate"
  }, acc.name), /*#__PURE__*/React.createElement("span", {
    className: "text-xs px-2.5 py-1 rounded-full font-medium border " + STATUS_STYLES[props.status].cls
  }, STATUS_STYLES[props.status].label)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mt-1"
  }, props.phaseLabel)), /*#__PURE__*/React.createElement(DisciplineRing, {
    score: s.disciplineScore
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-xs mb-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "Buffer (your room to be wrong)"), /*#__PURE__*/React.createElement("span", {
    className: "num text-white font-semibold"
  }, fmt(buffer), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500"
  }, "of ", fmt(maxDD)))), /*#__PURE__*/React.createElement("div", {
    className: "h-3 bg-gray-800 rounded-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full transition-all " + bufColor,
    style: {
      width: bufPct + '%'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500"
  }, "Net Balance"), /*#__PURE__*/React.createElement("div", {
    className: "num text-lg font-bold text-white"
  }, fmt(s.netBalance))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500"
  }, "Total P&L"), /*#__PURE__*/React.createElement("div", {
    className: "num text-lg font-bold " + (s.totalPnl >= 0 ? 'text-green-400' : 'text-red-400')
  }, fmt(s.totalPnl))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500"
  }, "Win Rate"), /*#__PURE__*/React.createElement("div", {
    className: "num text-lg font-bold " + (s.totalTrades === 0 ? 'text-gray-500' : s.overallWinRate >= 50 ? 'text-green-400' : 'text-red-400')
  }, s.totalTrades === 0 ? '-' : s.overallWinRate.toFixed(1) + '%')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500"
  }, "Trades"), /*#__PURE__*/React.createElement("div", {
    className: "num text-lg font-bold text-white"
  }, s.totalTrades)))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 bg-gradient-to-br from-purple-950/30 to-black border border-purple-800/40 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Crosshair",
    className: "h-5 w-5 text-purple-400"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "font-semibold text-white"
  }, "Today's Mission")), r && props.mentalDone ? /*#__PURE__*/React.createElement("div", {
    className: "rounded-lg border px-3 py-2 mb-3 flex items-center justify-between " + r.cls
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-bold"
  }, r.verdict), /*#__PURE__*/React.createElement("span", {
    className: "num font-bold"
  }, r.pct, "%")) : /*#__PURE__*/React.createElement("div", {
    className: "rounded-lg border border-gray-700 bg-gray-900/60 px-3 py-2 mb-3 text-sm text-gray-400"
  }, "Mental readiness not checked yet"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 rounded-lg p-2.5 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-gray-500"
  }, "Risk / trade"), /*#__PURE__*/React.createElement("div", {
    className: "num text-sm font-bold text-purple-300"
  }, fmt(props.risk))), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 rounded-lg p-2.5 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-gray-500"
  }, "Max loss today"), /*#__PURE__*/React.createElement("div", {
    className: "num text-sm font-bold text-red-300"
  }, fmt(props.dailyCap))), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 rounded-lg p-2.5 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-gray-500"
  }, "Trades left"), /*#__PURE__*/React.createElement("div", {
    className: "num text-sm font-bold text-white"
  }, tradesLeft, " / ", maxTrades))), stopped && /*#__PURE__*/React.createElement("div", {
    className: "rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-xs px-3 py-2 mb-3"
  }, "Daily loss cap reached. You are done for today."), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-1.5 mb-4"
  }, mission.map(function (m) {
    return /*#__PURE__*/React.createElement("li", {
      key: m.label,
      className: "flex items-center justify-between text-sm"
    }, /*#__PURE__*/React.createElement("span", {
      className: "flex items-center gap-2 " + (m.ok ? 'text-green-300' : 'text-gray-400')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: m.ok ? 'CheckCircle' : 'Circle',
      className: "h-4 w-4"
    }), /*#__PURE__*/React.createElement("span", null, m.label)), !m.ok && m.go && /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        props.onGo(m.go);
      },
      className: "text-xs text-purple-300 hover:underline"
    }, "Open"));
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      props.onGo('dailyplan');
    },
    className: "bg-purple-500/20 border border-purple-500/40 text-purple-200 px-3 py-1.5 rounded-lg"
  }, "Daily Plan"), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      props.onGo('flowstate');
    },
    className: "bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 px-3 py-1.5 rounded-lg"
  }, "Flow Ritual"))));
}

// First-run, required: shows a real name on the leaderboard instead of Trader-XXXX.
function NamePromptModal(props) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const save = async function () {
    const t = name.trim();
    if (t.length < 2) {
      setErr('Please enter your name.');
      return;
    }
    setSaving(true);
    try {
      await auth.currentUser.updateProfile({
        displayName: t
      });
      await db.collection('leaderboard').doc(props.uid).set({
        displayName: t
      }, {
        merge: true
      });
      props.onSaved(t);
    } catch (e) {
      setErr('Could not save: ' + e.message);
      setSaving(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-sm bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-bold text-white mb-1"
  }, "What should we call you?"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 mb-4"
  }, "Your name shows on the Discipline Leaderboard. Right now it shows as an anonymous Trader ID. Add your real name or trading handle."), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: function (e) {
      setName(e.target.value);
    },
    onKeyDown: function (e) {
      if (e.key === 'Enter') save();
    },
    placeholder: "Your name",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 mb-3 outline-none focus:border-yellow-400/50"
  }), err && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-red-400 mb-2"
  }, err), /*#__PURE__*/React.createElement("button", {
    onClick: save,
    disabled: saving,
    className: "w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2.5 rounded-lg font-semibold disabled:opacity-50"
  }, saving ? 'Saving...' : 'Save my name')));
}
function OverviewStats(props) {
  const accounts = props.accounts;
  const entries = props.entries;
  const d = computeOverviewData(accounts, entries);
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "LayoutDashboard",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "All Accounts, Combined")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-3"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Total P&L",
    value: fmt(d.totalPnl),
    color: d.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Win Rate",
    value: d.totalTrades === 0 ? '-' : d.overallWinRate.toFixed(1) + '%',
    color: d.totalTrades === 0 ? 'text-gray-500' : d.overallWinRate >= 50 ? 'text-green-400' : 'text-red-400'
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Profit Factor",
    value: d.profitFactor === null ? '-' : d.profitFactor.toFixed(2),
    color: d.profitFactor === null ? 'text-gray-500' : d.profitFactor >= 1 ? 'text-green-400' : 'text-red-400'
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Day Win Rate",
    value: d.dayWinRate === null ? '-' : d.dayWinRate.toFixed(0) + '%',
    color: d.dayWinRate === null ? 'text-gray-500' : d.dayWinRate >= 50 ? 'text-green-400' : 'text-red-400'
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Avg Win",
    value: d.avgWin === null ? '-' : fmt(d.avgWin),
    color: "text-green-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Avg Loss",
    value: d.avgLoss === null ? '-' : fmt(d.avgLoss),
    color: "text-red-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Expectancy / Trade",
    value: d.expectancy === null ? '-' : fmt(d.expectancy),
    color: d.expectancy === null ? 'text-gray-500' : d.expectancy >= 0 ? 'text-green-400' : 'text-red-400'
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Rule Adherence",
    value: d.ruleAdherencePct === null ? '-' : d.ruleAdherencePct.toFixed(1) + '%',
    color: "text-purple-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Total Trades",
    value: String(d.totalTrades),
    color: "text-white"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Total Costs",
    value: fmt(d.totalAllCosts),
    color: "text-red-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Total Payouts",
    value: fmt(d.totalAllPayouts),
    color: "text-green-400"
  })), (d.bestDay || d.worstDay) && /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 text-xs text-gray-400 pt-1"
  }, d.bestDay && /*#__PURE__*/React.createElement("div", null, "Best day: ", /*#__PURE__*/React.createElement("span", {
    className: "text-green-400 font-medium"
  }, d.bestDay), " (", fmt(d.byDate[d.bestDay]), ")"), d.worstDay && /*#__PURE__*/React.createElement("div", null, "Worst day: ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-400 font-medium"
  }, d.worstDay), " (", fmt(d.byDate[d.worstDay]), ")")));
}
function TradingCalendar(props) {
  const accounts = props.accounts;
  const entries = props.entries;
  const viewMode = props.viewMode || 'dollars';
  const viewContext = props.viewContext || {};
  const [monthOffset, setMonthOffset] = useState(0);
  const d = computeOverviewData(accounts, entries);
  const now = new Date();
  const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = viewDate.getDay();
  const monthLabel = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  const pad2 = function (n) {
    return n < 10 ? '0' + n : '' + n;
  };
  const dateKey = function (day) {
    return year + '-' + pad2(month + 1) + '-' + pad2(day);
  };
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  let monthTotal = 0,
    greenDays = 0,
    redDays = 0;
  cells.forEach(function (day) {
    if (!day) return;
    const pnl = d.byDate[dateKey(day)];
    if (pnl === undefined) return;
    monthTotal += pnl;
    if (pnl > 0) greenDays++;else if (pnl < 0) redDays++;
  });
  const maxAbs = Math.max.apply(null, cells.filter(function (day) {
    return day && d.byDate[dateKey(day)] !== undefined;
  }).map(function (day) {
    return Math.abs(d.byDate[dateKey(day)]);
  }).concat([1]));
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Calendar",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Trading Calendar")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500"
  }, greenDays, " green - ", redDays, " red"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setMonthOffset(monthOffset - 1);
    },
    className: "text-gray-500 hover:text-white p-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronLeft",
    className: "h-4 w-4"
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-white font-medium w-32 text-center num"
  }, monthLabel), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setMonthOffset(Math.min(monthOffset + 1, 0));
    },
    disabled: monthOffset >= 0,
    className: "text-gray-500 hover:text-white disabled:opacity-20 p-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronRight",
    className: "h-4 w-4"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num text-sm font-semibold " + (monthTotal >= 0 ? 'text-green-400' : 'text-red-400')
  }, viewMode === 'privacy' ? '••••' : (monthTotal >= 0 ? '+' : '') + fmt(monthTotal), " this month")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-7 gap-1.5 text-center text-[10px] text-gray-600 mb-1.5"
  }, ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(function (lbl, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i
    }, lbl);
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-7 gap-1.5"
  }, cells.map(function (day, i) {
    if (!day) return /*#__PURE__*/React.createElement("div", {
      key: i
    });
    const key = dateKey(day);
    const pnl = d.byDate[key];
    const hasData = pnl !== undefined;
    const intensity = hasData ? Math.min(Math.abs(pnl) / maxAbs, 1) : 0;
    const bg = !hasData ? '#111827' : pnl > 0 ? 'rgba(74, 222, 128, ' + (0.18 + intensity * 0.62) + ')' : pnl < 0 ? 'rgba(248, 113, 113, ' + (0.18 + intensity * 0.62) + ')' : '#374151';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "aspect-square rounded-md flex flex-col items-center justify-center border border-gray-800/60 px-0.5",
      style: {
        backgroundColor: bg
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-gray-400 leading-none"
    }, day), hasData && /*#__PURE__*/React.createElement("span", {
      className: "num text-[9px] font-semibold text-white leading-tight mt-0.5"
    }, viewMode === 'privacy' ? '••' : fmtView(pnl, viewMode, viewContext).replace('.00', '')));
  })));
}

// A small, honest set of reports - built from data you already log, not padded
// out to hit a number. Each one groups your trades by a dimension you already
// track and shows win rate and P&L for each group.
// Only trades imported from a broker file carry openTime/closeTime/prices -
// manually-logged trades don't have that granularity, so this only shows
// what's actually known, rather than inventing timestamps for hand-entered days.
function ClosedTradesTable(props) {
  const accountEntries = props.accountEntries;
  const [open, setOpen] = useState(false);
  const fmtTime = function (ms) {
    if (!ms) return '-';
    return new Date(ms).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };
  const fmtDuration = function (ms) {
    if (!ms || ms < 0) return '-';
    const totalSec = Math.round(ms / 1000);
    const h = Math.floor(totalSec / 3600),
      m = Math.floor(totalSec % 3600 / 60),
      s = totalSec % 60;
    let out = '';
    if (h > 0) out += h + 'h ';
    if (h > 0 || m > 0) out += m + 'm ';
    out += s + 'sec';
    return out.trim();
  };
  const rows = [];
  accountEntries.forEach(function (e) {
    (e.trades || []).forEach(function (t) {
      if (!t.openTime || !t.closeTime) return;
      rows.push(t);
    });
  });
  rows.sort(function (a, b) {
    return b.closeTime - a.closeTime;
  });
  if (rows.length === 0) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between p-6 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ListOrdered",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Closed Trades"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "(", rows.length, ")")), /*#__PURE__*/React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-gray-500 flex-shrink-0"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "px-6 pb-6 overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-sm whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-left text-gray-500 text-xs border-b border-gray-800"
  }, /*#__PURE__*/React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Symbol"), /*#__PURE__*/React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Volume"), /*#__PURE__*/React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Open Time"), /*#__PURE__*/React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Avg Entry"), /*#__PURE__*/React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Bias"), /*#__PURE__*/React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Duration"), /*#__PURE__*/React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Close Time"), /*#__PURE__*/React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Avg Close"), /*#__PURE__*/React.createElement("th", {
    className: "pb-2 text-right"
  }, "Profit"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(function (t, i) {
    const pnlVal = tradeSignedPnl(t);
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      className: "border-b border-gray-800/50 last:border-0"
    }, /*#__PURE__*/React.createElement("td", {
      className: "py-2 pr-4 text-white font-medium"
    }, t.symbol || '-'), /*#__PURE__*/React.createElement("td", {
      className: "py-2 pr-4 text-gray-300"
    }, t.positionSize || '-'), /*#__PURE__*/React.createElement("td", {
      className: "py-2 pr-4 text-gray-400"
    }, fmtTime(t.openTime)), /*#__PURE__*/React.createElement("td", {
      className: "py-2 pr-4 num text-gray-300"
    }, t.entryPrice ? t.entryPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2
    }) : '-'), /*#__PURE__*/React.createElement("td", {
      className: "py-2 pr-4"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] px-1.5 py-0.5 rounded font-semibold " + (t.direction === 'long' ? 'bg-blue-500/15 text-blue-300' : 'bg-red-500/15 text-red-300')
    }, t.direction === 'long' ? 'LONG' : 'SHORT')), /*#__PURE__*/React.createElement("td", {
      className: "py-2 pr-4 text-gray-400"
    }, fmtDuration(t.closeTime - t.openTime)), /*#__PURE__*/React.createElement("td", {
      className: "py-2 pr-4 text-gray-400"
    }, fmtTime(t.closeTime)), /*#__PURE__*/React.createElement("td", {
      className: "py-2 pr-4 num text-gray-300"
    }, t.exitPrice ? t.exitPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2
    }) : '-'), /*#__PURE__*/React.createElement("td", {
      className: "py-2 num font-semibold text-right " + (pnlVal >= 0 ? 'text-green-400' : 'text-red-400')
    }, pnlVal >= 0 ? '+' : '', fmt(pnlVal)));
  })))));
}
function ReportsCard(props) {
  const accounts = props.accounts;
  const entries = props.entries;
  const [open, setOpen] = useState(false);
  const [activeReport, setActiveReport] = useState('weekday');
  const accountsById = {};
  accounts.forEach(function (a) {
    accountsById[a.id] = a;
  });
  const breachedIds = {};
  accounts.forEach(function (a) {
    if (computeAccountStatus(a, entries) === 'breached') breachedIds[a.id] = true;
  });
  const tradedEntries = entries.filter(function (e) {
    return e.tradedToday !== 'no' && !breachedIds[e.accountId];
  });
  const allTrades = tradedEntries.flatMap(function (e) {
    return e.trades.map(function (t) {
      return Object.assign({}, t, {
        date: e.date,
        accountId: e.accountId,
        entry: e
      });
    });
  });
  const groupBy = function (keyFn) {
    const groups = {};
    allTrades.forEach(function (t) {
      const key = keyFn(t);
      if (key === null || key === undefined) return;
      if (!groups[key]) groups[key] = {
        wins: 0,
        losses: 0,
        pnl: 0
      };
      const v = Math.abs(parseFloat(t.pnl) || 0);
      groups[key].pnl += t.result === 'win' ? v : -v;
      if (t.result === 'win') groups[key].wins++;else groups[key].losses++;
    });
    return groups;
  };
  const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const reports = {
    weekday: {
      label: 'By Day of Week',
      order: WEEKDAY_NAMES,
      groups: groupBy(function (t) {
        return WEEKDAY_NAMES[new Date(t.date + 'T00:00:00').getDay()];
      })
    },
    bias: {
      label: 'By Daily Bias',
      order: ['Bullish', 'Bearish', 'Neutral/Range'],
      groups: groupBy(function (t) {
        return (BIAS_OPTIONS.find(function (b) {
          return b.key === t.entry.dailyBias;
        }) || {}).label || null;
      })
    },
    market: {
      label: 'By Market',
      order: null,
      groups: groupBy(function (t) {
        const acc = accountsById[t.accountId];
        return acc ? (MARKET_SPECS[acc.market || 'nasdaq100'] || {}).label : null;
      })
    },
    strategy: {
      label: 'By Strategy',
      order: null,
      groups: groupBy(function (t) {
        const acc = accountsById[t.accountId];
        if (!acc) return null;
        const strategies = getStrategies(acc);
        const s = strategies.find(function (s) {
          return s.id === (t.entry.strategyId || 'default');
        });
        return s ? s.name : null;
      })
    }
  };
  const current = reports[activeReport];
  const keys = current.order ? current.order.filter(function (k) {
    return current.groups[k];
  }) : Object.keys(current.groups).sort(function (a, b) {
    return current.groups[b].pnl - current.groups[a].pnl;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between p-6 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BarChart3",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Reports"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Win rate and P&L broken down by weekday, bias, market, and strategy"))), /*#__PURE__*/React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-gray-500 flex-shrink-0"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "px-6 pb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-3 flex-wrap"
  }, Object.keys(reports).map(function (key) {
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      onClick: function () {
        setActiveReport(key);
      },
      className: "px-3 py-1.5 rounded-lg text-xs font-medium border transition " + (activeReport === key ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700')
    }, reports[key].label);
  })), keys.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600"
  }, "Not enough logged trades for this report yet.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, keys.map(function (key) {
    const g = current.groups[key];
    const total = g.wins + g.losses;
    const wr = total > 0 ? g.wins / total * 100 : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: key,
      className: "flex items-center justify-between text-sm bg-black/30 rounded-lg px-3 py-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-300"
    }, key), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-gray-500"
    }, total, " trade", total !== 1 ? 's' : ''), /*#__PURE__*/React.createElement("span", {
      className: "num text-xs " + (wr >= 50 ? 'text-green-400' : 'text-red-400')
    }, wr.toFixed(0), "% WR"), /*#__PURE__*/React.createElement("span", {
      className: "num font-semibold " + (g.pnl >= 0 ? 'text-green-400' : 'text-red-400')
    }, fmt(g.pnl))));
  }))));
}
function EquityCurveBlock(props) {
  const accounts = props.accounts;
  const entries = props.entries;
  const d = computeOverviewData(accounts, entries);
  const singleAccount = accounts.length === 1 ? accounts[0] : null;
  // Real account-dollar terms, matching what MFFU's own dashboard shows -
  // Balance = starting balance + P&L (your actual account value), Floor =
  // Balance - buffer (verified against MFFU's own "Max Drawdown" figure:
  // $25,363.40 balance - $1,000 buffer = $24,363.40, exactly what their
  // dashboard displayed). Target = starting balance + profit target. All
  // three are numbers you'd actually recognize, not an abstracted scale.
  let equityPointsForChart = d.equityPoints;
  let floorPoints = null;
  let startingAmount = null;
  let targetAmount = null;
  if (singleAccount) {
    const startBal = parseFloat(singleAccount.startingBalance) || 0;
    const accEntries = entries.filter(function (e) {
      return e.accountId === singleAccount.id;
    });
    const hist = calcBufferHistory(singleAccount, accEntries);
    let cum = 0;
    const combined = hist.map(function (h) {
      cum += h.pnl;
      const balance = startBal + cum;
      return {
        date: h.date,
        balance: balance,
        floor: balance - h.buffer
      };
    });
    equityPointsForChart = combined.map(function (c) {
      return {
        date: c.date,
        cum: c.balance
      };
    });
    floorPoints = combined.map(function (c) {
      return {
        date: c.date,
        cum: c.floor
      };
    });
    startingAmount = startBal;
    targetAmount = singleAccount.profitTarget ? startBal + parseFloat(singleAccount.profitTarget) : null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-4"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "LineChart",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Equity Curve", singleAccount ? ' - ' + singleAccount.name : accounts.length > 0 ? ' - ' + accounts.length + ' Accounts Combined' : '')), /*#__PURE__*/React.createElement(EquityCurve, {
    points: equityPointsForChart,
    floorPoints: floorPoints,
    startingAmount: startingAmount,
    targetAmount: targetAmount
  }), !singleAccount && accounts.length > 1 && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600 mt-2"
  }, "The starting/floor/target lines only show for a single selected account, since each account's buffer and target are different numbers - select just one above to see them."));
}

// Real, computed-from-your-own-trades stop-loss and revenge-trading stats -
// never example numbers. Reads straight off the active account's logged
// trades, so it's blank/neutral until there's actually something to show.
function TradeDisciplineTracker(props) {
  const accountEntries = props.accountEntries;
  const allTrades = accountEntries.filter(function (e) {
    return e.tradedToday !== 'no';
  }).flatMap(function (e) {
    return (e.trades || []).map(function (t) {
      return Object.assign({}, t, {
        date: e.date
      });
    });
  });
  if (allTrades.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-1"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "ShieldAlert",
      className: "h-5 w-5 text-yellow-400"
    }), /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-semibold text-white"
    }, "Trade Discipline Tracker")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-500"
    }, "Log a trade and mark what happened to its stop-loss to start building this - stop-loss handling and revenge-entry flags, tracked automatically across every trade on this account."));
  }
  const respected = allTrades.filter(function (t) {
    return (t.stopHandling || 'respected') === 'respected';
  });
  const widened = allTrades.filter(function (t) {
    return t.stopHandling === 'widened';
  });
  const removed = allTrades.filter(function (t) {
    return t.stopHandling === 'removed';
  });
  const moved = widened.concat(removed);
  const pct = function (n) {
    return allTrades.length > 0 ? Math.round(n / allTrades.length * 100) : 0;
  };
  const avgAbs = function (list) {
    const losers = list.map(function (t) {
      return tradeSignedPnl(t);
    }).filter(function (p) {
      return p < 0;
    });
    if (losers.length === 0) return null;
    return Math.abs(losers.reduce(function (s, p) {
      return s + p;
    }, 0) / losers.length);
  };
  const avgLossRespected = avgAbs(respected);
  const avgLossMoved = avgAbs(moved);
  const lossMultiplier = avgLossRespected && avgLossMoved ? avgLossMoved / avgLossRespected : null;
  const movedThatWon = moved.filter(function (t) {
    return t.result === 'win';
  }).length;
  const revengeTrades = allTrades.filter(function (t) {
    return !!t.revengeEntry;
  });
  const nonRevengeTrades = allTrades.filter(function (t) {
    return !t.revengeEntry;
  });
  const avgPnl = function (list) {
    return list.length > 0 ? list.reduce(function (s, t) {
      return s + tradeSignedPnl(t);
    }, 0) / list.length : null;
  };
  const revengeAvgPnl = avgPnl(revengeTrades);
  const nonRevengeAvgPnl = avgPnl(nonRevengeTrades);
  const revengeWinRate = revengeTrades.length > 0 ? revengeTrades.filter(function (t) {
    return t.result === 'win';
  }).length / revengeTrades.length * 100 : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShieldAlert",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Trade Discipline Tracker"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500"
  }, allTrades.length, " trade", allTrades.length !== 1 ? 's' : '', " logged on this account")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-2"
  }, "What happens after price approaches your stop"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Stop Respected",
    value: pct(respected.length) + '%',
    color: "text-green-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Stop Widened",
    value: pct(widened.length) + '%',
    color: "text-yellow-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Stop Removed",
    value: pct(removed.length) + '%',
    color: "text-red-400"
  })), lossMultiplier !== null ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 mt-3 leading-relaxed"
  }, "Trades where the stop was moved or removed lost ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-400 font-semibold num"
  }, lossMultiplier.toFixed(1), "x"), " more on average (", fmt(avgLossMoved), ") than trades where it was respected (", fmt(avgLossRespected), ").", movedThatWon === 0 && moved.length > 0 ? ' Moving it hasn\'t turned a single one of those trades into a winner yet.' : '') : moved.length > 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mt-3"
  }, "Not enough losing trades yet in both groups to compare the average loss size.") : /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mt-3"
  }, "Every logged trade has respected its stop so far - keep it that way.")), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-gray-800 pt-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-2"
  }, "Revenge entries (reacting to an earlier loss, not the setup)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Revenge Entries",
    value: revengeTrades.length + ' of ' + allTrades.length,
    color: "text-red-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Revenge Win Rate",
    value: revengeWinRate === null ? '-' : revengeWinRate.toFixed(0) + '%',
    color: revengeWinRate !== null && revengeWinRate < 50 ? 'text-red-400' : 'text-gray-300'
  })), revengeTrades.length > 0 && revengeAvgPnl !== null && nonRevengeAvgPnl !== null ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 mt-3 leading-relaxed"
  }, "Revenge entries have averaged ", /*#__PURE__*/React.createElement("span", {
    className: "font-semibold num " + (revengeAvgPnl >= 0 ? 'text-green-400' : 'text-red-400')
  }, fmt(revengeAvgPnl)), " per trade, against ", /*#__PURE__*/React.createElement("span", {
    className: "font-semibold num " + (nonRevengeAvgPnl >= 0 ? 'text-green-400' : 'text-red-400')
  }, fmt(nonRevengeAvgPnl)), " for everything else.") : /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mt-3"
  }, "No revenge entries flagged yet on this account.")));
}
function DisciplineChecklistCard(props) {
  const accounts = props.accounts;
  const entries = props.entries;
  const [open, setOpen] = useState(false);
  const disc = computeDisciplineScore(accounts, entries);
  if (!disc) return null;
  const c = disc.checklist;
  const questions = [{
    label: 'Logged every day since you started?',
    value: disc.loggingConsistency,
    sub: disc.daysLogged + ' of ' + disc.daysSinceStart + ' days'
  }, {
    label: 'Did physical exercise?',
    value: c.exercisePct
  }, {
    label: 'Followed your written entry rules?',
    value: c.entryRulesPct
  }, {
    label: 'Stayed within your risk per trade (no over-risk)?',
    value: c.riskDisciplinePct
  }, {
    label: 'Stayed within your unlocked contract size (no over-lot)?',
    value: c.lotDisciplinePct
  }, {
    label: 'Respected the Daily Execution Matrix?',
    value: c.matrixPct
  }, {
    label: 'Stayed within your max daily loss (2x risk per trade)?',
    value: c.dailyLossCapPct
  }, {
    label: 'Completed HTF to LTF analysis before entry?',
    value: c.htfPct
  }, {
    label: 'Traded in the direction of your daily bias?',
    value: c.biasPct
  }];
  const withData = questions.filter(function (q) {
    return q.value !== null && q.value !== undefined;
  });
  const passing = withData.filter(function (q) {
    return q.value >= 70;
  });
  const scoreColor = disc.score >= 70 ? '#4ade80' : disc.score >= 40 ? '#facc15' : '#f87171';
  const scoreTextCls = disc.score >= 70 ? 'text-green-400' : disc.score >= 40 ? 'text-yellow-400' : 'text-red-400';
  const ringCirc = 97.4;
  const ringDash = Math.max(0, Math.min(100, disc.score)) / 100 * ringCirc;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between p-6 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-12 h-12 flex-shrink-0"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 36 36",
    className: "w-12 h-12 -rotate-90"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "18",
    r: "15.5",
    fill: "none",
    stroke: "#1f2937",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "18",
    r: "15.5",
    fill: "none",
    stroke: scoreColor,
    strokeWidth: "3",
    strokeDasharray: ringDash + " " + ringCirc,
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("span", {
    className: "num absolute inset-0 flex items-center justify-center text-xs font-bold " + scoreTextCls
  }, disc.score.toFixed(0))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Your Discipline Checklist"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, passing.length, " of ", withData.length, " tracked questions above 70%"))), /*#__PURE__*/React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-gray-500 flex-shrink-0"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "px-6 pb-6 space-y-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 -mt-1 mb-1"
  }, "Each question only counts once you have data for it, so one you haven't triggered yet won't drag your score down."), questions.map(function (q, i) {
    const hasData = q.value !== null && q.value !== undefined;
    const barColor = !hasData ? 'bg-gray-700' : q.value >= 70 ? 'bg-green-400' : q.value >= 40 ? 'bg-yellow-400' : 'bg-red-400';
    const textColor = !hasData ? 'text-gray-600' : q.value >= 70 ? 'text-green-400' : q.value >= 40 ? 'text-yellow-400' : 'text-red-400';
    return /*#__PURE__*/React.createElement("div", {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between text-xs mb-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-300"
    }, q.label, q.sub && /*#__PURE__*/React.createElement("span", {
      className: "text-gray-600 ml-1"
    }, "(", q.sub, ")")), /*#__PURE__*/React.createElement("span", {
      className: textColor + " font-semibold flex-shrink-0 ml-2"
    }, hasData ? q.value.toFixed(0) + '%' : 'No data yet')), /*#__PURE__*/React.createElement("div", {
      className: "w-full bg-gray-800 rounded-full h-1.5 overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full transition-all " + barColor,
      style: {
        width: (hasData ? q.value : 0) + '%'
      }
    })));
  })));
}

// The three-pillar reflection log for the active account - what went wrong,
// what went right, tomorrow's plan - plus a running average of the
// pre-session Mental Check score, so the psychological side of trading gets
// the same kind of tracked history as the P&L side does.
function ReflectionLog(props) {
  const accountEntries = props.accountEntries;
  const [open, setOpen] = useState(false);
  const withReflection = accountEntries.filter(function (e) {
    const r = e.reflection;
    return r && (r.wentWrong || r.wentRight || r.lessonsLearned || r.improvementPlan);
  }).slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  const withMentalCheck = accountEntries.filter(function (e) {
    return e.mentalCheck && mentalCheckTotal(e.mentalCheck) > 0;
  });
  const avgMental = withMentalCheck.length > 0 ? withMentalCheck.reduce(function (s, e) {
    return s + mentalCheckTotal(e.mentalCheck);
  }, 0) / withMentalCheck.length : null;
  if (withReflection.length === 0 && avgMental === null) return null;
  const avgColor = avgMental === null ? 'text-gray-500' : avgMental >= 32 ? 'text-green-400' : avgMental >= 20 ? 'text-yellow-400' : 'text-red-400';
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between p-6 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BookOpen",
    className: "h-5 w-5 text-purple-400 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Discipline & Psychology Log"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, withReflection.length, " reflection", withReflection.length !== 1 ? 's' : '', " logged", avgMental !== null && /*#__PURE__*/React.createElement("span", null, " - avg mental check ", /*#__PURE__*/React.createElement("span", {
    className: avgColor
  }, avgMental.toFixed(0), "/40"))))), /*#__PURE__*/React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-gray-500 flex-shrink-0"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "px-6 pb-6 space-y-3"
  }, withReflection.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "No written reflections yet - fill in the \"Discipline & Psychology Reflection\" section next time you log a day to start the log.") : withReflection.map(function (e) {
    const r = e.reflection;
    return /*#__PURE__*/React.createElement("div", {
      key: e.id,
      className: "bg-black/30 border border-gray-800 rounded-lg p-3 space-y-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between text-[11px] text-gray-500"
    }, /*#__PURE__*/React.createElement("span", {
      className: "num"
    }, e.date), r.emotionalState && /*#__PURE__*/React.createElement("span", {
      className: "capitalize px-2 py-0.5 rounded-full bg-gray-800 text-gray-400"
    }, r.emotionalState)), r.wentRight && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-300"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-green-400 font-medium"
    }, "Right: "), r.wentRight), r.wentWrong && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-300"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-red-400 font-medium"
    }, "Wrong: "), r.wentWrong), r.lessonsLearned && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-300"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-blue-400 font-medium"
    }, "Lesson: "), r.lessonsLearned), r.improvementPlan && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-300"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-yellow-400 font-medium"
    }, "Tomorrow: "), r.improvementPlan));
  })));
}
function DisciplineLeaderboard(props) {
  const currentUid = props.uid;
  const currentName = props.currentName;
  const [rows, setRows] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(function () {
    let cancelled = false;

    // Build the leaderboard straight from what's actually sitting in Firestore -
    // every registered user's accounts and entries - rather than waiting for each
    // person's own browser to write a leaderboard doc. That way someone who set
    // up their accounts last week and hasn't opened the app since still shows up.
    async function loadAll() {
      try {
        const [namesSnap, accountsSnap, entriesSnap] = await Promise.all([db.collection('leaderboard').get(), db.collectionGroup('accounts').get(), db.collectionGroup('entries').get()]);
        const namesByUid = {};
        namesSnap.forEach(function (d) {
          const data = d.data();
          if (data.displayName) namesByUid[d.id] = data.displayName;
        });

        // Paper (practice) accounts never count toward anyone's discipline score
        // or leaderboard rank - track their ids so both accounts and the entries
        // logged against them can be skipped below.
        const paperAccountIds = {};
        accountsSnap.forEach(function (d) {
          if (d.data().accountType === 'paper') paperAccountIds[d.id] = true;
        });
        const accountsByUid = {};
        accountsSnap.forEach(function (d) {
          const uid = d.ref.parent.parent ? d.ref.parent.parent.id : null;
          if (!uid) return;
          if (paperAccountIds[d.id]) return;
          if (!accountsByUid[uid]) accountsByUid[uid] = [];
          accountsByUid[uid].push(Object.assign({
            id: d.id
          }, d.data()));
        });
        const entriesByUid = {};
        entriesSnap.forEach(function (d) {
          const uid = d.ref.parent.parent ? d.ref.parent.parent.id : null;
          if (!uid) return;
          const data = d.data();
          if (paperAccountIds[data.accountId]) return;
          if (!entriesByUid[uid]) entriesByUid[uid] = [];
          entriesByUid[uid].push(Object.assign({
            id: d.id
          }, data));
        });
        const allUids = Array.from(new Set(Object.keys(accountsByUid).concat(Object.keys(entriesByUid))));
        const computed = allUids.map(function (uid) {
          const disc = computeDisciplineScore(accountsByUid[uid] || [], entriesByUid[uid] || []);
          if (!disc) return null;
          const displayName = uid === currentUid && currentName ? currentName : namesByUid[uid] || 'Trader-' + uid.slice(0, 4);
          return {
            uid: uid,
            displayName: displayName,
            disciplineScore: disc.score
          };
        }).filter(function (r) {
          return r !== null && HIDDEN_LEADERBOARD_NAMES.indexOf(r.displayName) < 0;
        });
        computed.sort(function (a, b) {
          return b.disciplineScore - a.disciplineScore;
        });
        if (!cancelled) {
          setRows(computed);
          setLoadError(false);
        }
      } catch (e) {
        console.error('leaderboard aggregate read error:', e.code, e.message);
        if (!cancelled) setLoadError(true);
      }
    }
    loadAll();
    const interval = setInterval(loadAll, 60000);
    return function () {
      cancelled = true;
      clearInterval(interval);
    };
  }, [currentUid, currentName]);
  if (rows.length === 0) {
    if (loadError) {
      return /*#__PURE__*/React.createElement("div", {
        className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2 mb-2"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "Award",
        className: "h-5 w-5 text-yellow-400"
      }), /*#__PURE__*/React.createElement("h2", {
        className: "text-lg font-semibold text-white"
      }, "Discipline Leaderboard")), /*#__PURE__*/React.createElement("p", {
        className: "text-xs text-red-400"
      }, "Couldn't load everyone's data - this needs a Firestore rules update to allow reading across users. Check the browser console for the exact error."));
    }
    return null;
  }
  const myIndex = rows.findIndex(function (r) {
    return r.uid === currentUid;
  });
  const myPercentile = myIndex >= 0 ? Math.max(1, Math.round((myIndex + 1) / rows.length * 100)) : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between p-6 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Award",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Discipline Leaderboard"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "(", rows.length, " trader", rows.length !== 1 ? 's' : '', ")")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, myPercentile !== null && /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-yellow-400 font-medium hidden sm:inline"
  }, "Rank ", myIndex + 1, " of ", rows.length, " - top ", myPercentile, "%"), /*#__PURE__*/React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-gray-500"
  }))), open && /*#__PURE__*/React.createElement("div", {
    className: "px-6 pb-6"
  }, myPercentile !== null && /*#__PURE__*/React.createElement("div", {
    className: "mb-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-400 font-semibold"
  }, "You are in the top ", myPercentile, "%"), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, " - rank ", myIndex + 1, " of ", rows.length, " - score ", rows[myIndex].disciplineScore.toFixed(1))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5 max-h-96 overflow-y-auto pr-1"
  }, rows.map(function (r, i) {
    const isMe = r.uid === currentUid;
    const scoreOk = typeof r.disciplineScore === 'number' && isFinite(r.disciplineScore);
    return /*#__PURE__*/React.createElement("div", {
      key: r.uid,
      className: "grid items-center gap-3 text-sm rounded-lg px-3 py-2 " + (isMe ? 'bg-yellow-500/15 border border-yellow-500/30' : 'bg-black/30'),
      style: {
        gridTemplateColumns: '2.25rem 1fr auto'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-500 num"
    }, "#", i + 1), /*#__PURE__*/React.createElement("span", {
      className: "truncate min-w-0 " + (isMe ? 'text-yellow-300 font-semibold' : 'text-white')
    }, r.displayName || 'Trader', isMe ? ' (you)' : ''), /*#__PURE__*/React.createElement("span", {
      className: "num text-green-400 font-semibold bg-green-500/10 border border-green-500/20 rounded-md px-2 py-0.5 flex-shrink-0"
    }, scoreOk ? r.disciplineScore.toFixed(1) : '-'));
  }))));
}

// Verified against real CME contract specs (point value = $ per 1.00 price move).
const TICKER_POINT_VALUES = {
  MES: 5,
  ES: 50,
  MNQ: 2,
  NQ: 20,
  M2K: 5,
  RTY: 50,
  MYM: 0.5,
  YM: 5,
  MGC: 10,
  GC: 100,
  SIL: 1000,
  SI: 5000,
  MCL: 100,
  CL: 1000
};
const getPointValueForContract = function (contractOrProduct) {
  const upper = (contractOrProduct || '').toUpperCase();
  const roots = Object.keys(TICKER_POINT_VALUES).sort(function (a, b) {
    return b.length - a.length;
  });
  for (let i = 0; i < roots.length; i++) {
    if (upper.indexOf(roots[i]) === 0) return TICKER_POINT_VALUES[roots[i]];
  }
  return null;
};

// Minimal but correct CSV parser - handles quoted fields that may contain commas.
const parseCsvRows = function (text) {
  const rows = [];
  let row = [],
    field = '',
    inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;else if (c === ',') {
        row.push(field);
        field = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field);
        field = '';
        if (row.length > 1 || row[0] !== '') rows.push(row);
        row = [];
      } else field += c;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
};

// Weighted-average position matching per contract: opens a position, adds to
// it on same-direction fills, and realizes P&L against the average entry
// price as opposing fills close or flip it. This is the standard approach
// broker-import tools use to turn a per-fill order export into round-turn
// trades without needing strict per-lot FIFO bookkeeping.
const buildTradovateTrades = function (fills) {
  const byContract = {};
  fills.forEach(function (f) {
    if (!byContract[f.contract]) byContract[f.contract] = [];
    byContract[f.contract].push(f);
  });
  const roundTurns = [];
  Object.keys(byContract).forEach(function (contract) {
    const list = byContract[contract].slice().sort(function (a, b) {
      return a.time - b.time;
    });
    const pointValue = getPointValueForContract(contract) || getPointValueForContract(list[0].product);
    let posQty = 0,
      avgEntryPrice = 0,
      entryTime = null;
    list.forEach(function (f) {
      const signedQty = f.side === 'Buy' ? f.qty : -f.qty;
      if (posQty === 0) {
        posQty = signedQty;
        avgEntryPrice = f.price;
        entryTime = f.time;
      } else if (posQty > 0 && signedQty > 0 || posQty < 0 && signedQty < 0) {
        const newQty = posQty + signedQty;
        avgEntryPrice = (avgEntryPrice * Math.abs(posQty) + f.price * Math.abs(signedQty)) / Math.abs(newQty);
        posQty = newQty;
      } else {
        const closingQty = Math.min(Math.abs(posQty), Math.abs(signedQty));
        const direction = posQty > 0 ? 'long' : 'short';
        const pnlPoints = direction === 'long' ? f.price - avgEntryPrice : avgEntryPrice - f.price;
        const pnl = pointValue !== null ? Math.round(pnlPoints * pointValue * closingQty * 100) / 100 : null;
        // closeDateStr comes from Tradovate's own Date column on the closing fill,
        // not derived from the fill timestamp - a UTC conversion of the timestamp
        // can land on the wrong calendar day depending on session/timezone offset.
        roundTurns.push({
          contract: contract,
          product: f.product,
          direction: direction,
          qty: closingQty,
          entryPrice: avgEntryPrice,
          exitPrice: f.price,
          openTime: entryTime,
          closeTime: f.time,
          closeDateStr: f.dateStr,
          pnl: pnl
        });
        const remaining = Math.abs(signedQty) - closingQty;
        posQty = posQty > 0 ? posQty - closingQty : posQty + closingQty;
        if (remaining > 0) {
          posQty = f.side === 'Buy' ? remaining : -remaining;
          avgEntryPrice = f.price;
          entryTime = f.time;
        } else if (posQty === 0) {
          avgEntryPrice = 0;
          entryTime = null;
        }
      }
    });
  });
  return roundTurns;
};

// Tradovate's Date column looks like "9/16/26" or "09/16/2026" - always local
// session date, unlike the fill timestamp which can shift a day under UTC
// conversion. Normalizes to YYYY-MM-DD to match how entries are keyed everywhere
// else in the app.
const normalizeTradovateDate = function (dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.trim().split('/');
  if (parts.length !== 3) return null;
  let [m, d, y] = parts;
  if (y.length === 2) y = '20' + y;
  m = m.padStart(2, '0');
  d = d.padStart(2, '0');
  if (y.length !== 4 || isNaN(parseInt(m, 10)) || isNaN(parseInt(d, 10))) return null;
  return y + '-' + m + '-' + d;
};

// Parses a Tradovate Reports > Orders CSV export into round-turn trades
// grouped by the day each trade closed. Returns skipped counts so the import
// preview can be honest about anything it couldn't price or understand.
const parseTradovateCsv = function (text, commissionPerContract) {
  const commission = parseFloat(commissionPerContract) || 0;
  const rows = parseCsvRows(text).filter(function (r) {
    return r.length > 1;
  });
  if (rows.length < 2) return {
    byDate: {},
    skipped: 0,
    totalTrades: 0,
    error: 'No data rows found in this file.'
  };
  const header = rows[0].map(function (h) {
    return h.trim();
  });
  const idx = {};
  header.forEach(function (h, i) {
    idx[h] = i;
  });
  const findCol = function (names) {
    for (let i = 0; i < names.length; i++) {
      if (idx[names[i]] !== undefined) return idx[names[i]];
    }
    return -1;
  };
  const statusIdx = findCol(['Status']);
  const bsIdx = findCol(['B/S']);
  const contractIdx = findCol(['Contract']);
  const productIdx = findCol(['Product']);
  const qtyIdx = findCol(['Filled Qty', 'filledQty']);
  const priceIdx = findCol(['Avg Fill Price', 'avgPrice']);
  const timeIdx = findCol(['Fill Time', 'Timestamp']);
  const dateIdx = findCol(['Date']);
  if (bsIdx < 0 || contractIdx < 0 || qtyIdx < 0 || priceIdx < 0 || timeIdx < 0) {
    return {
      byDate: {},
      skipped: 0,
      totalTrades: 0,
      error: "This doesn't look like a Tradovate Orders export."
    };
  }
  const fills = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (statusIdx >= 0 && r[statusIdx] && r[statusIdx].trim() !== 'Filled') continue;
    const qty = parseFloat(r[qtyIdx]);
    const price = parseFloat(r[priceIdx]);
    const side = (r[bsIdx] || '').trim();
    const contract = (r[contractIdx] || '').trim();
    const product = productIdx >= 0 ? (r[productIdx] || '').trim() : contract;
    const timeStr = r[timeIdx];
    if (!qty || !price || !side || !contract || !timeStr) continue;
    const time = new Date(timeStr).getTime();
    if (isNaN(time)) continue;
    const dateStr = dateIdx >= 0 ? normalizeTradovateDate(r[dateIdx]) : null;
    fills.push({
      contract: contract,
      product: product,
      side: side,
      qty: qty,
      price: price,
      time: time,
      dateStr: dateStr || new Date(time).toISOString().split('T')[0]
    });
  }
  const roundTurns = buildTradovateTrades(fills);
  const priced = roundTurns.filter(function (rt) {
    return rt.pnl !== null;
  }).map(function (rt) {
    // Commission is charged round-turn, per contract - subtracting it here means
    // every downstream number (day totals, consistency %, buffer) reflects what
    // you actually kept, not the gross price-movement figure Tradovate's Orders
    // export alone would imply.
    const net = Math.round((rt.pnl - commission * rt.qty) * 100) / 100;
    return Object.assign({}, rt, {
      pnl: net,
      grossPnl: rt.pnl,
      commissionCharged: Math.round(commission * rt.qty * 100) / 100
    });
  });
  const skipped = roundTurns.length - priced.length;
  const byDate = {};
  priced.forEach(function (rt) {
    const dateKey = rt.closeDateStr;
    if (!byDate[dateKey]) byDate[dateKey] = [];
    byDate[dateKey].push(rt);
  });
  return {
    byDate: byDate,
    skipped: skipped,
    totalTrades: priced.length,
    error: null
  };
};

// Tradovate's Performance export has each trade already matched entry-to-exit
// by the broker itself (buyFillId/sellFillId paired, pnl pre-computed) - no
// FIFO/weighted-average reconstruction needed, which also means it can't
// diverge from Tradovate's own numbers the way rebuilding from raw Orders
// fills sometimes can (e.g. a position closed via two separate partial fills
// is already represented as two separate rows here, correctly).
const parsePerformanceCsv = function (text, commissionPerContract) {
  const commission = parseFloat(commissionPerContract) || 0;
  const rows = parseCsvRows(text).filter(function (r) {
    return r.length > 1;
  });
  if (rows.length < 2) return {
    byDate: {},
    skipped: 0,
    totalTrades: 0,
    error: 'No data rows found in this file.'
  };
  const header = rows[0].map(function (h) {
    return h.trim();
  });
  const idx = {};
  header.forEach(function (h, i) {
    idx[h] = i;
  });
  const findCol = function (names) {
    for (let i = 0; i < names.length; i++) {
      if (idx[names[i]] !== undefined) return idx[names[i]];
    }
    return -1;
  };
  const symbolIdx = findCol(['symbol']);
  const qtyIdx = findCol(['qty']);
  const pnlIdx = findCol(['pnl']);
  const boughtIdx = findCol(['boughtTimestamp']);
  const soldIdx = findCol(['soldTimestamp']);
  const buyPriceIdx = findCol(['buyPrice']);
  const sellPriceIdx = findCol(['sellPrice']);
  if (symbolIdx < 0 || qtyIdx < 0 || pnlIdx < 0 || boughtIdx < 0 || soldIdx < 0) {
    return {
      byDate: {},
      skipped: 0,
      totalTrades: 0,
      error: "This doesn't look like a Tradovate Performance export - it needs symbol, qty, pnl, boughtTimestamp, and soldTimestamp columns."
    };
  }

  // "$27.50" or "$(20.00)" for a loss - parenthesis means negative, not a minus sign.
  const parseMoney = function (s) {
    if (!s) return null;
    const negative = s.indexOf('(') >= 0;
    const num = parseFloat(s.replace(/[\$,()]/g, ''));
    if (isNaN(num)) return null;
    return negative ? -Math.abs(num) : num;
  };
  const toLocalDate = function (timestampStr) {
    // "09/15/2026 14:30:34" - take the date portion directly as text, same
    // trick as the Orders.csv Date column: it's already local/session time,
    // no UTC conversion to accidentally shift the day.
    if (!timestampStr) return null;
    const datePart = timestampStr.trim().split(' ')[0];
    const parts = datePart.split('/');
    if (parts.length !== 3) return null;
    const m = parts[0].padStart(2, '0'),
      d = parts[1].padStart(2, '0'),
      y = parts[2];
    return y + '-' + m + '-' + d;
  };
  const priced = [];
  let skipped = 0;
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const symbol = (r[symbolIdx] || '').trim();
    const qty = parseFloat(r[qtyIdx]);
    const grossPnl = parseMoney(r[pnlIdx]);
    const boughtStr = r[boughtIdx],
      soldStr = r[soldIdx];
    if (!symbol || !qty || grossPnl === null || !boughtStr || !soldStr) {
      skipped++;
      continue;
    }
    const boughtTime = new Date(boughtStr).getTime();
    const soldTime = new Date(soldStr).getTime();
    if (isNaN(boughtTime) || isNaN(soldTime)) {
      skipped++;
      continue;
    }
    // Bought before sold = long (bought to open, sold to close). Sold before
    // bought = short (sold to open, bought to close). The closing action's
    // own timestamp is what determines which calendar day the trade lands on.
    const direction = boughtTime < soldTime ? 'long' : 'short';
    const closeDateStr = toLocalDate(direction === 'long' ? soldStr : boughtStr);
    if (!closeDateStr) {
      skipped++;
      continue;
    }
    const net = Math.round((grossPnl - commission * qty) * 100) / 100;
    const openTime = direction === 'long' ? boughtTime : soldTime;
    const closeTime = direction === 'long' ? soldTime : boughtTime;
    const buyPrice = buyPriceIdx >= 0 ? parseFloat(r[buyPriceIdx]) : null;
    const sellPrice = sellPriceIdx >= 0 ? parseFloat(r[sellPriceIdx]) : null;
    const entryPrice = direction === 'long' ? buyPrice : sellPrice;
    const exitPrice = direction === 'long' ? sellPrice : buyPrice;
    priced.push({
      contract: symbol,
      product: symbol,
      direction: direction,
      qty: qty,
      pnl: net,
      grossPnl: grossPnl,
      commissionCharged: Math.round(commission * qty * 100) / 100,
      closeDateStr: closeDateStr,
      openTime: openTime,
      closeTime: closeTime,
      entryPrice: entryPrice,
      exitPrice: exitPrice
    });
  }
  const byDate = {};
  priced.forEach(function (rt) {
    if (!byDate[rt.closeDateStr]) byDate[rt.closeDateStr] = [];
    byDate[rt.closeDateStr].push(rt);
  });
  return {
    byDate: byDate,
    skipped: skipped,
    totalTrades: priced.length,
    error: null
  };
};

// Generic closed-trade CSV support for everything that isn't Tradovate -
// NinjaTrader, TopstepX, ProjectX, MT4/5 trade history exports, ThinkOrSwim
// and the rest all export one row per already-closed trade with some
// spelling of a date column and some spelling of a P&L column. Rather than
// guess at broker-specific fills/round-turn reconstruction (safe only for
// Tradovate, where the point values have been verified), this matches by
// column name against the common aliases each platform actually uses and
// only proceeds when it can find both a date and a P&L column - anything
// it can't confidently read is skipped and counted, never guessed at.
const GENERIC_CSV_ALIASES = {
  date: ['date', 'trade date', 'close date', 'closed date', 'exit date', 'date closed', 'time closed', 'exit time', 'closing time'],
  pnl: ['pnl', 'p&l', 'p/l', 'net pnl', 'net p&l', 'net profit', 'profit', 'profit/loss', 'realized pnl', 'realized p&l', 'realized p/l', 'gain/loss', 'amount'],
  direction: ['side', 'direction', 'type', 'buy/sell', 'action', 'position'],
  qty: ['qty', 'quantity', 'size', 'contracts', 'lots', 'volume', 'shares'],
  symbol: ['symbol', 'instrument', 'contract', 'ticker', 'market', 'product']
};
const parseGenericTradesCsv = function (text, commissionPerContract) {
  const commission = parseFloat(commissionPerContract) || 0;
  const rows = parseCsvRows(text).filter(function (r) {
    return r.length > 1;
  });
  if (rows.length < 2) return {
    byDate: {},
    skipped: 0,
    totalTrades: 0,
    error: 'No data rows found in this file.'
  };
  const header = rows[0].map(function (h) {
    return (h || '').trim().toLowerCase();
  });
  const findCol = function (aliasKey) {
    const names = GENERIC_CSV_ALIASES[aliasKey];
    for (let i = 0; i < names.length; i++) {
      const at = header.indexOf(names[i]);
      if (at >= 0) return at;
    }
    return -1;
  };
  const dateIdx = findCol('date');
  const pnlIdx = findCol('pnl');
  const dirIdx = findCol('direction');
  const qtyIdx = findCol('qty');
  const symbolIdx = findCol('symbol');
  if (dateIdx < 0 || pnlIdx < 0) {
    return {
      byDate: {},
      skipped: 0,
      totalTrades: 0,
      error: "Couldn't find a date column and a P&L column in this file's header - this importer needs at least those two to read a trade history export."
    };
  }
  const parseMoney = function (s) {
    if (s === undefined || s === null || s === '') return null;
    const str = String(s).trim();
    const negative = str.indexOf('(') >= 0 || str.indexOf('-') === 0;
    const num = parseFloat(str.replace(/[\$,()]/g, '').replace(/^-/, ''));
    if (isNaN(num)) return null;
    return negative ? -Math.abs(num) : num;
  };
  const toLocalDate = function (raw) {
    if (!raw) return null;
    const str = String(raw).trim().split(' ')[0];
    // Already ISO (yyyy-mm-dd)
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
    // US-style m/d/yyyy or m/d/yy
    const parts = str.split('/');
    if (parts.length === 3) {
      let y = parts[2];
      if (y.length === 2) y = '20' + y;
      return y + '-' + parts[0].padStart(2, '0') + '-' + parts[1].padStart(2, '0');
    }
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    return null;
  };
  const priced = [];
  let skipped = 0;
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const dateStr = toLocalDate(r[dateIdx]);
    const grossPnl = parseMoney(r[pnlIdx]);
    if (!dateStr || grossPnl === null) {
      skipped++;
      continue;
    }
    const qty = qtyIdx >= 0 ? parseFloat(r[qtyIdx]) || 1 : 1;
    const rawDir = (dirIdx >= 0 ? r[dirIdx] || '' : '').toLowerCase();
    const direction = rawDir.indexOf('sell') >= 0 || rawDir.indexOf('short') >= 0 ? 'short' : 'long';
    const symbol = symbolIdx >= 0 ? (r[symbolIdx] || '').trim() : '';
    const net = Math.round((grossPnl - commission * qty) * 100) / 100;
    priced.push({
      contract: symbol,
      product: symbol,
      direction: direction,
      qty: qty,
      pnl: net,
      grossPnl: grossPnl,
      commissionCharged: Math.round(commission * qty * 100) / 100,
      closeDateStr: dateStr,
      openTime: null,
      closeTime: null,
      entryPrice: null,
      exitPrice: null
    });
  }
  const byDate = {};
  priced.forEach(function (rt) {
    if (!byDate[rt.closeDateStr]) byDate[rt.closeDateStr] = [];
    byDate[rt.closeDateStr].push(rt);
  });
  return {
    byDate: byDate,
    skipped: skipped,
    totalTrades: priced.length,
    error: priced.length === 0 ? "Found a date and P&L column, but couldn't read a valid row from either - check the file isn't empty below the header." : null
  };
};

// Looks at the header row to decide which parser fits - the person just
// picks whichever file their platform gave them, no need to know the
// difference. Tradovate's two export types get broker-specific handling
// (verified point values for its Orders/fills reconstruction); everything
// else falls through to the generic date+P&L column matcher, which covers
// NinjaTrader, TopstepX, ProjectX, MT4/5 and most other closed-trade
// history exports.
const parseTradeFile = function (text, commissionPerContract) {
  const firstLine = (text.split('\n')[0] || '').toLowerCase();
  if (firstLine.indexOf('buyfillid') >= 0 || firstLine.indexOf('sellfillid') >= 0) {
    return parsePerformanceCsv(text, commissionPerContract);
  }
  if (firstLine.indexOf('b/s') >= 0 || firstLine.indexOf('filled qty') >= 0) {
    return parseTradovateCsv(text, commissionPerContract);
  }
  return parseGenericTradesCsv(text, commissionPerContract);
};
function toCSV(entries) {
  const header = ['date', 'tradedToday', 'noTradeReason', 'dailyBias', 'exercised', 'direction', 'result', 'pnl', 'positionSize', 'riskAmount', 'htfLtf', 'notes'];
  const rows = [header.join(',')];
  entries.forEach(function (e) {
    const notes = (e.notes || '').replace(/,/g, ';');
    if (e.tradedToday === 'no') {
      rows.push([e.date, 'no', e.noTradeReason || '', '', '', '', '', '', '', '', '', notes].join(','));
    } else {
      (e.trades || []).forEach(function (t) {
        rows.push([e.date, 'yes', '', e.dailyBias, e.exercised ? 'yes' : 'no', t.direction, t.result, t.pnl, t.positionSize || '', t.riskAmount || '', t.htfLtf ? 'yes' : 'no', notes].join(','));
      });
    }
  });
  return rows.join('\n');
}
function downloadCSV(csv, filename) {
  const blob = new Blob([csv], {
    type: 'text/csv'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(function (l) {
    return l.trim() !== '';
  });
  const header = lines[0].split(',');
  return lines.slice(1).map(function (line) {
    const cols = line.split(',');
    const obj = {};
    header.forEach(function (h, i) {
      obj[h] = cols[i] !== undefined ? cols[i] : '';
    });
    return obj;
  });
}
async function importCSV(text, accountId, entriesRef) {
  const rows = parseCSV(text);
  // A Tradovate Orders export has completely different columns (B/S, Filled Qty,
  // Avg Fill Price...) - without this check, none of those match our expected
  // "date"/"direction"/"result" fields, so every row silently collapses into one
  // broken entry with an undefined date instead of failing loudly.
  if (rows.length > 0 && rows[0].date === undefined) {
    const looksLikeTradovate = rows[0]['B/S'] !== undefined || rows[0]['Filled Qty'] !== undefined || rows[0]['Avg Fill Price'] !== undefined;
    throw new Error(looksLikeTradovate ? "This looks like a broker export, not a journal CSV. Use the \"Import Trades (CSV)\" button in Trade History instead - it reads broker files directly." : "This file doesn't have the columns this importer expects (needs a \"date\" column at minimum). Use the CSV exported from this app's own \"Export CSV\" button as a template, or use the \"Import Trades (CSV)\" button in Trade History for a broker export.");
  }
  const byDate = {};
  rows.forEach(function (r) {
    if (!byDate[r.date]) byDate[r.date] = {
      date: r.date,
      tradedToday: r.tradedToday || 'yes',
      noTradeReason: r.noTradeReason || '',
      dailyBias: r.dailyBias || 'neutral',
      exercised: r.exercised === 'yes',
      trades: [],
      notes: r.notes || ''
    };
    if (r.tradedToday === 'yes' && r.direction) {
      byDate[r.date].trades.push({
        direction: r.direction,
        result: r.result,
        pnl: r.pnl,
        positionSize: r.positionSize || '',
        riskAmount: r.riskAmount || '',
        htfLtf: r.htfLtf === 'yes',
        rulesChecked: []
      });
    }
  });
  const dates = Object.keys(byDate);
  for (let i = 0; i < dates.length; i++) {
    const entry = byDate[dates[i]];
    if (entry.tradedToday === 'no') {
      await entriesRef.add({
        accountId: accountId,
        date: entry.date,
        tradedToday: 'no',
        noTradeReason: entry.noTradeReason,
        notes: entry.notes,
        dailyBias: 'neutral',
        exercised: entry.exercised,
        trades: []
      });
    } else {
      await entriesRef.add({
        accountId: accountId,
        date: entry.date,
        tradedToday: 'yes',
        dailyBias: entry.dailyBias,
        exercised: entry.exercised,
        trades: entry.trades,
        notes: entry.notes,
        matrixAdherent: entry.trades.length <= 3
      });
    }
  }
  return dates.length;
}

// CSV import as an entry method inside the Add Entry modal (Export CSV lives
// next to the Daily Log button in Trade History instead - it's a read action,
// not a way of logging an entry).
function DupeCleanupModal(props) {
  const accountEntries = props.accountEntries;
  const entriesRef = props.entriesRef;
  const onClose = props.onClose;
  const [busy, setBusy] = useState(null);
  const byDate = {};
  accountEntries.forEach(function (e) {
    if (!byDate[e.date]) byDate[e.date] = [];
    byDate[e.date].push(e);
  });
  const dupeDates = Object.keys(byDate).filter(function (d) {
    return byDate[d].length > 1;
  }).sort();
  const keepThisOne = async function (date, keepId) {
    setBusy(date);
    const group = byDate[date];
    for (let i = 0; i < group.length; i++) {
      if (group[i].id !== keepId) await entriesRef.doc(group[i].id).delete();
    }
    setBusy(null);
  };
  return /*#__PURE__*/React.createElement(Modal, {
    onClose: onClose,
    title: "Clean Up Duplicate Days",
    size: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Days with more than one entry - usually from re-importing the same broker file before the overwrite fix. Pick which copy to keep for each day; the others get deleted. Nothing is removed automatically."), dupeDates.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-green-400 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "CheckCircle",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "No duplicate days found on this account.")) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 max-h-96 overflow-y-auto"
  }, dupeDates.map(function (date) {
    const group = byDate[date];
    return /*#__PURE__*/React.createElement("div", {
      key: date,
      className: "border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-white font-medium mb-2"
    }, date, " - ", group.length, " copies found"), /*#__PURE__*/React.createElement("div", {
      className: "space-y-1.5"
    }, group.map(function (entry) {
      const total = (entry.trades || []).reduce(function (s, t) {
        return s + tradeSignedPnl(t);
      }, 0);
      return /*#__PURE__*/React.createElement("div", {
        key: entry.id,
        className: "flex items-center justify-between bg-black/30 rounded-lg px-3 py-2 text-xs"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-gray-400"
      }, (entry.trades || []).length, " trade", (entry.trades || []).length !== 1 ? 's' : ''), /*#__PURE__*/React.createElement("span", {
        className: "num font-semibold " + (total >= 0 ? 'text-green-400' : 'text-red-400')
      }, fmt(total)), /*#__PURE__*/React.createElement("button", {
        onClick: function () {
          keepThisOne(date, entry.id);
        },
        disabled: busy === date,
        className: "bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1 rounded-lg font-medium disabled:opacity-40"
      }, busy === date ? 'Working...' : 'Keep This One'));
    })));
  }))));
}
function CsvImportFields(props) {
  const account = props.account;
  const entriesRef = props.entriesRef;
  const onDone = props.onDone;
  const [status, setStatus] = useState('');
  const fileRef = React.useRef(null);
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Import a CSV of trades for ", account.name, " instead of entering them one by one. Expects the same column format as an exported file - export a day first if you need a template."), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      fileRef.current.click();
    },
    className: "w-full flex items-center justify-center gap-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 px-4 py-2.5 rounded-lg text-sm font-medium"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Upload",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Choose CSV File")), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: ".csv",
    className: "hidden",
    onChange: async function (e) {
      const file = e.target.files[0];
      if (!file) return;
      setStatus('Importing...');
      try {
        const text = await file.text();
        const count = await importCSV(text, account.id, entriesRef);
        setStatus('Imported ' + count + ' day(s).');
        e.target.value = '';
        if (onDone) setTimeout(onDone, 900);
      } catch (err) {
        setStatus(err.message || 'Import failed.');
        e.target.value = '';
      }
    }
  }), status && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400"
  }, status));
}
const MENTAL_CHECK_SLIDERS = [{
  key: 'marketAwareness',
  label: 'Market Regime Awareness',
  sub: 'How well do you understand current market conditions right now?'
}, {
  key: 'riskRespect',
  label: 'Risk Respect Level',
  sub: 'Will you strictly follow your risk management rules today?'
}, {
  key: 'humility',
  label: 'Humility Check',
  sub: 'Are you emotionally balanced - not chasing, not revenge-trading?'
}, {
  key: 'mindset',
  label: 'Professional Mindset',
  sub: 'Are you approaching today as a business, not a gamble?'
}];
function mentalCheckTotal(mc) {
  if (!mc) return 0;
  return (mc.marketAwareness || 0) + (mc.riskRespect || 0) + (mc.humility || 0) + (mc.mindset || 0);
}

// A collapsible pre-session check-in, real sliders tied to real state (unlike
// the source app's decorative demo numbers) - the score is computed live
// from what's actually moved, not a hardcoded percentage.
function MentalCheckSection(props) {
  const value = props.value;
  const onChange = props.onChange;
  const [open, setOpen] = useState(false);
  const total = mentalCheckTotal(value);
  const scoreColor = total >= 32 ? 'text-green-400' : total >= 20 ? 'text-yellow-400' : 'text-red-400';
  return /*#__PURE__*/React.createElement("div", {
    className: "border border-gray-800 rounded-lg overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between px-3 py-2.5 bg-gray-900/60 text-left"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-gray-300 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Brain",
    className: "h-3.5 w-3.5 text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "Pre-Session Mental Check")), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs num font-semibold " + scoreColor
  }, total, "/40"), /*#__PURE__*/React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-3.5 w-3.5 text-gray-500"
  }))), open && /*#__PURE__*/React.createElement("div", {
    className: "p-3 space-y-3 bg-black/20"
  }, MENTAL_CHECK_SLIDERS.map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      key: s.key
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-0.5"
    }, /*#__PURE__*/React.createElement("label", {
      className: "text-xs text-gray-400"
    }, s.label), /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-yellow-400 num"
    }, value[s.key], "/10")), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "1",
      max: "10",
      value: value[s.key],
      onChange: function (e) {
        onChange(s.key, parseInt(e.target.value, 10));
      },
      className: "w-full accent-teal-400"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-gray-600"
    }, s.sub));
  })));
}

// The day's plan, written down before trading starts - risk, target, session
// window and allowed trade count - so the Discipline tab can later compare
// what was planned against what actually happened.
function DailyPlanSection(props) {
  const value = props.value;
  const onChange = props.onChange;
  const [open, setOpen] = useState(false);
  const hasPlan = value.riskAmount || value.targetProfit;
  return /*#__PURE__*/React.createElement("div", {
    className: "border border-gray-800 rounded-lg overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between px-3 py-2.5 bg-gray-900/60 text-left"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-gray-300 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Calendar",
    className: "h-3.5 w-3.5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("span", null, "Daily Plan")), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-2"
  }, hasPlan && /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300"
  }, "Set"), /*#__PURE__*/React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-3.5 w-3.5 text-gray-500"
  }))), open && /*#__PURE__*/React.createElement("div", {
    className: "p-3 space-y-3 bg-black/20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Risk Per Trade ($)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value.riskAmount,
    onChange: function (e) {
      onChange('riskAmount', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Target Profit Today ($)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value.targetProfit,
    onChange: function (e) {
      onChange('targetProfit', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Planned Trades"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    max: "3",
    value: value.plannedTrades,
    onChange: function (e) {
      onChange('plannedTrades', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Reward:Risk Ratio"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.1",
    value: value.riskRewardRatio,
    onChange: function (e) {
      onChange('riskRewardRatio', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Session Start"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: value.startTime,
    onChange: function (e) {
      onChange('startTime', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Session End"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: value.endTime,
    onChange: function (e) {
      onChange('endTime', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Setups you're allowed to take today"), /*#__PURE__*/React.createElement("textarea", {
    value: value.notes,
    onChange: function (e) {
      onChange('notes', e.target.value);
    },
    placeholder: "e.g. only the A+ pullback setup, no counter-trend trades before 10am...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm h-14 focus:border-yellow-400/50 outline-none resize-none"
  }))));
}

// Flat (always-open, no border-box/collapse) version of the mental check
// sliders, for the Mental Check page itself - the check-in IS the page, so
// there's no reason to hide it behind another toggle the way the old
// in-modal version did.
function MentalCheckFields(props) {
  const value = props.value;
  const onChange = props.onChange;
  const total = mentalCheckTotal(value);
  const scoreColor = total >= 32 ? 'text-green-400' : total >= 20 ? 'text-yellow-400' : 'text-red-400';
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-gray-400"
  }, "Total"), /*#__PURE__*/React.createElement("span", {
    className: "text-sm num font-semibold " + scoreColor
  }, total, "/40")), MENTAL_CHECK_SLIDERS.map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      key: s.key
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-0.5"
    }, /*#__PURE__*/React.createElement("label", {
      className: "text-xs text-gray-400"
    }, s.label), /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-yellow-400 num"
    }, value[s.key], "/10")), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "1",
      max: "10",
      value: value[s.key],
      onChange: function (e) {
        onChange(s.key, parseInt(e.target.value, 10));
      },
      className: "w-full accent-teal-400"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-gray-600"
    }, s.sub));
  }), props.showExtras && /*#__PURE__*/React.createElement("div", {
    className: "pt-3 mt-1 border-t border-gray-800 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-semibold text-teal-300"
  }, "Body & State"), MENTAL_EXTRA_SLIDERS.map(function (s) {
    const v = value[s.key] === undefined ? s.def : value[s.key];
    return /*#__PURE__*/React.createElement("div", {
      key: s.key
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-0.5"
    }, /*#__PURE__*/React.createElement("label", {
      className: "text-xs text-gray-400"
    }, s.label), /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-yellow-400 num"
    }, v, "/10")), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "1",
      max: "10",
      value: v,
      onChange: function (e) {
        onChange(s.key, parseInt(e.target.value, 10));
      },
      className: "w-full accent-teal-400"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-gray-600"
    }, s.sub));
  })));
}

// Flat version of the Daily Plan fields (no Risk Per Trade field - that's
// handled by Personal Risk Tolerance right above it on the Daily Plan page,
// so asking for risk twice in the same blended card would be confusing).
function PlanFieldsGrid(props) {
  const value = props.value;
  const onChange = props.onChange;
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Target Profit Today ($)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value.targetProfit,
    onChange: function (e) {
      onChange('targetProfit', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Planned Trades"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    max: "3",
    value: value.plannedTrades,
    onChange: function (e) {
      onChange('plannedTrades', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Reward:Risk Ratio"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.1",
    value: value.riskRewardRatio,
    onChange: function (e) {
      onChange('riskRewardRatio', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Max Loss / Day ($)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value.maxLossPerDay,
    onChange: function (e) {
      onChange('maxLossPerDay', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Session Start"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: value.startTime,
    onChange: function (e) {
      onChange('startTime', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Session End"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: value.endTime,
    onChange: function (e) {
      onChange('endTime', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Setups you're allowed to take today"), /*#__PURE__*/React.createElement("textarea", {
    value: value.notes,
    onChange: function (e) {
      onChange('notes', e.target.value);
    },
    placeholder: "e.g. only the A+ pullback setup, no counter-trend trades before 10am...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm h-14 focus:border-yellow-400/50 outline-none resize-none"
  })));
}
const EMOTIONAL_STATES = ['neutral', 'confident', 'anxious', 'frustrated', 'excited', 'fatigued'];

// The three-pillar reflection - what went wrong, what went right, tomorrow's
// plan - plus lessons learned and emotional state. Shown collapsed by
// default so it never blocks a quick log, but it's what feeds the
// Discipline tab's reflection log.
function ReflectionSection(props) {
  const value = props.value;
  const onChange = props.onChange;
  const [open, setOpen] = useState(false);
  const hasReflection = value.wentWrong || value.wentRight || value.improvementPlan;
  return /*#__PURE__*/React.createElement("div", {
    className: "border border-gray-800 rounded-lg overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between px-3 py-2.5 bg-gray-900/60 text-left"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-gray-300 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ListChecks",
    className: "h-3.5 w-3.5 text-purple-400"
  }), /*#__PURE__*/React.createElement("span", null, "Discipline & Psychology Reflection")), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-2"
  }, hasReflection && /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300"
  }, "Filled"), /*#__PURE__*/React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-3.5 w-3.5 text-gray-500"
  }))), open && /*#__PURE__*/React.createElement("div", {
    className: "p-3 space-y-3 bg-black/20"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-red-400 mb-1"
  }, "What went wrong?"), /*#__PURE__*/React.createElement("textarea", {
    value: value.wentWrong,
    onChange: function (e) {
      onChange('wentWrong', e.target.value);
    },
    placeholder: "Mistakes, emotional decisions, rule breaks...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm h-14 focus:border-red-400/50 outline-none resize-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-green-400 mb-1"
  }, "What went right?"), /*#__PURE__*/React.createElement("textarea", {
    value: value.wentRight,
    onChange: function (e) {
      onChange('wentRight', e.target.value);
    },
    placeholder: "Disciplined decisions, setups you're proud of...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm h-14 focus:border-green-400/50 outline-none resize-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-400 mb-1"
  }, "Lessons learned"), /*#__PURE__*/React.createElement("textarea", {
    value: value.lessonsLearned,
    onChange: function (e) {
      onChange('lessonsLearned', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm h-12 focus:border-yellow-400/50 outline-none resize-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-yellow-400 mb-1"
  }, "Tomorrow's improvement plan"), /*#__PURE__*/React.createElement("textarea", {
    value: value.improvementPlan,
    onChange: function (e) {
      onChange('improvementPlan', e.target.value);
    },
    placeholder: "One concrete thing to do differently tomorrow...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm h-14 focus:border-yellow-400/50 outline-none resize-none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Emotional state"), /*#__PURE__*/React.createElement("select", {
    value: value.emotionalState,
    onChange: function (e) {
      onChange('emotionalState', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm capitalize focus:border-yellow-400/50 outline-none"
  }, EMOTIONAL_STATES.map(function (s) {
    return /*#__PURE__*/React.createElement("option", {
      key: s,
      value: s
    }, s);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Market conditions"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: value.marketConditions,
    onChange: function (e) {
      onChange('marketConditions', e.target.value);
    },
    placeholder: "e.g. choppy, trending, news-driven",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })))));
}
function PerAccountBreakdown(props) {
  const accounts = props.accounts.filter(function (a) {
    return computeAccountStatus(a, props.entries) !== 'breached';
  });
  const entries = props.entries;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-4"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Layers",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Per-Account Breakdown")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, accounts.map(function (acc) {
    const accEntries = entries.filter(function (e) {
      return e.accountId === acc.id;
    });
    const accTrades = accEntries.filter(function (e) {
      return e.tradedToday !== 'no';
    }).flatMap(function (e) {
      return e.trades;
    });
    const accPnl = accTrades.reduce(function (s, t) {
      return s + tradeSignedPnl(t);
    }, 0);
    const accWins = accTrades.filter(function (t) {
      return t.result === 'win';
    }).length;
    const accWinRate = accTrades.length > 0 ? accWins / accTrades.length * 100 : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: acc.id,
      className: "flex items-center justify-between text-sm bg-black/30 rounded-lg px-4 py-3 flex-wrap gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-white font-medium"
    }, acc.name, " #", acc.accountNumber), /*#__PURE__*/React.createElement("span", {
      className: "px-1.5 py-0.5 rounded text-[10px] " + (ACCOUNT_BADGE_CLS[acc.accountType] || ACCOUNT_BADGE_CLS.challenge)
    }, function () {
      const f = ACCOUNT_TYPES.find(function (t) {
        return t.key === acc.accountType;
      });
      return f ? f.label : '';
    }())), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-500"
    }, accTrades.length, " trades"), /*#__PURE__*/React.createElement("span", {
      className: "num " + (accWinRate >= 50 ? 'text-green-400' : 'text-red-400')
    }, accWinRate.toFixed(0), "% WR"), /*#__PURE__*/React.createElement("span", {
      className: "num font-semibold " + (accPnl >= 0 ? 'text-green-400' : 'text-red-400')
    }, fmt(accPnl))));
  }), accounts.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500 text-center py-4"
  }, props.accounts.length > 0 ? 'All accounts are breached - check the Breached tab.' : 'No accounts yet.')));
}
function MMMJournal(props) {
  const user = props.user;
  const language = props.language;
  const setLanguage = props.setLanguage;
  const [accountFilter, setAccountFilter] = useState('active');
  const [viewMode, setViewMode] = useState('dollars');
  const [activePage, setActivePage] = useState(props.wantsDiagnostic ? 'discipline' : 'overview');
  const [diagnostic, setDiagnostic] = useState(null);
  const [diagnosticReady, setDiagnosticReady] = useState(false);
  const [savedName, setSavedName] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [entries, setEntries] = useState([]);
  const [activeAccountId, setActiveAccountId] = useState(null);
  const [hasManualSelection, setHasManualSelection] = useState(false);
  const [selectedAccountIds, setSelectedAccountIds] = useState(new Set());
  const [hasInitializedSelection, setHasInitializedSelection] = useState(false);
  const [viewingBreached, setViewingBreached] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showManageStrategies, setShowManageStrategies] = useState(false);
  const [brokerCsvText, setBrokerCsvText] = useState(null);
  const [brokerCommission, setBrokerCommission] = useState('');
  const [showInstall, setShowInstall] = useState(false);
  const [riskToleranceDraft, setRiskToleranceDraft] = useState('');
  const [confirmedTolerance, setConfirmedTolerance] = useState(undefined);
  const [riskToleranceStatus, setRiskToleranceStatus] = useState(null);
  const [dailyPlanTemplateDraft, setDailyPlanTemplateDraft] = useState(emptyDailyPlan(0, 1));
  const [dailyPlanCadence, setDailyPlanCadence] = useState('daily');
  const [dailyPlanTemplateStatus, setDailyPlanTemplateStatus] = useState(null);
  const [mentalCheckDraft, setMentalCheckDraft] = useState(emptyMentalCheck());
  const [mentalCheckStatus, setMentalCheckStatus] = useState(null);
  const [showImportBroker, setShowImportBroker] = useState(false);
  const [showDupeCleanup, setShowDupeCleanup] = useState(false);
  const [brokerImportPreview, setBrokerImportPreview] = useState(null);
  const [brokerImportError, setBrokerImportError] = useState('');
  const [brokerImportBusy, setBrokerImportBusy] = useState(false);
  const [newStrategy, setNewStrategy] = useState(emptyStrategyForm);
  const [entryMethod, setEntryMethod] = useState('manual');
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [newAccount, setNewAccount] = useState(emptyAccountForm);
  const [newEntry, setNewEntry] = useState(emptyEntryForm(0, 1));
  const [saveEntryError, setSaveEntryError] = useState('');
  const [entrySavedToast, setEntrySavedToast] = useState('');
  const accountsRef = db.collection('users').doc(user.uid).collection('accounts');
  const entriesRef = db.collection('users').doc(user.uid).collection('entries');

  // The free Trading Discipline Test hands its result over in localStorage;
  // here it's attached to the signed-in account (Firestore, with a local
  // fallback) so it lives in the journal instead of only in one browser.
  useEffect(function () {
    const docRef = db.collection('users').doc(user.uid).collection('profile').doc('diagnostic');
    const localKey = 'mmm-diagnostic-saved-' + user.uid;
    let pending = null;
    try {
      pending = JSON.parse(localStorage.getItem('mmm-diagnostic-pending') || 'null');
    } catch (e) {}
    let cancelled = false;
    (async function () {
      let existing = null;
      try {
        const snap = await docRef.get();
        if (snap.exists) existing = snap.data();
      } catch (e) {}
      if (!existing) {
        try {
          existing = JSON.parse(localStorage.getItem(localKey) || 'null');
        } catch (e) {}
      }
      if (pending && pending.score !== undefined) {
        const history = (existing && existing.history || []).concat([{
          ts: pending.ts,
          score: pending.score
        }]).slice(-12);
        const merged = Object.assign({}, pending, {
          history: history
        });
        try {
          localStorage.setItem(localKey, JSON.stringify(merged));
        } catch (e) {}
        try {
          await docRef.set(merged);
        } catch (e) {}
        try {
          localStorage.removeItem('mmm-diagnostic-pending');
        } catch (e) {}
        existing = merged;
      }
      if (!cancelled) {
        setDiagnostic(existing);
        setDiagnosticReady(true);
      }
    })();
    return function () {
      cancelled = true;
    };
  }, [user.uid]);
  useEffect(function () {
    if (!entrySavedToast) return;
    const t = setTimeout(function () {
      setEntrySavedToast('');
    }, 4000);
    return function () {
      clearTimeout(t);
    };
  }, [entrySavedToast]);
  useEffect(function () {
    const unsub = accountsRef.orderBy('createdAt', 'asc').onSnapshot(function (snap) {
      const list = snap.docs.map(function (d) {
        return Object.assign({
          id: d.id
        }, d.data());
      });
      setAccounts(list);
      // Functional updater so this always sees the real current selection, not
      // whatever activeAccountId happened to be when this listener was first set
      // up - otherwise every snapshot update (like adding a new account) would
      // silently reset the selection back to the oldest account in the list.
      setActiveAccountId(function (prev) {
        if (prev && list.some(function (a) {
          return a.id === prev;
        })) return prev;
        return list.length ? list[0].id : null;
      });
    });
    return unsub;
  }, [user.uid]);
  useEffect(function () {
    const unsub = entriesRef.orderBy('date', 'desc').onSnapshot(function (snap) {
      setEntries(snap.docs.map(function (d) {
        return Object.assign({
          id: d.id
        }, d.data());
      }));
    });
    return unsub;
  }, [user.uid]);

  // Until the user has actually clicked an account themselves, the default
  // selection should prefer a live account over a breached one - otherwise
  // whichever account happens to be oldest (breached or not) becomes the
  // default view, which is exactly the "why am I looking at a breached
  // account I never chose" problem this fixes.
  useEffect(function () {
    if (hasManualSelection) return;
    if (accounts.length === 0) return;
    const nonBreached = accounts.find(function (a) {
      return computeAccountStatus(a, entries) !== 'breached';
    });
    setViewingBreached(false);
    setActiveAccountId(nonBreached ? nonBreached.id : null);
  }, [accounts, entries, hasManualSelection]);

  // Populates the Overview/Equity Curve selection once, the first time accounts
  // load - after that, the user's own checkbox choices are never overridden,
  // even if they deliberately deselect everything. Paper accounts start
  // unchecked - practice trades shouldn't quietly blend into real combined
  // numbers unless the trader opts in by hand.
  useEffect(function () {
    if (hasInitializedSelection) return;
    if (accounts.length === 0) return;
    const nonBreached = accounts.filter(function (a) {
      return a.accountType !== 'paper' && computeAccountStatus(a, entries) !== 'breached';
    });
    setSelectedAccountIds(new Set(nonBreached.map(function (a) {
      return a.id;
    })));
    setHasInitializedSelection(true);
  }, [accounts, entries, hasInitializedSelection]);
  const toggleAccountSelection = function (id) {
    setSelectedAccountIds(function (prev) {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else next.add(id);
      return next;
    });
  };
  const toggleGroupSelection = function (ids, select) {
    setSelectedAccountIds(function (prev) {
      const next = new Set(prev);
      ids.forEach(function (id) {
        if (select) next.add(id);else next.delete(id);
      });
      return next;
    });
  };
  const toggleAllAccountSelection = function () {
    const nonBreached = accounts.filter(function (a) {
      return getAccountStatus(a) !== 'breached';
    });
    const allSelected = nonBreached.length > 0 && nonBreached.every(function (a) {
      return selectedAccountIds.has(a.id);
    });
    setSelectedAccountIds(allSelected ? new Set() : new Set(nonBreached.map(function (a) {
      return a.id;
    })));
  };
  const accountsForOverview = accounts.filter(function (a) {
    return selectedAccountIds.has(a.id);
  });

  // Paper accounts are a practice sandbox - they should never move a real
  // discipline score or the leaderboard, so every discipline computation
  // for this user runs on real (non-paper) accounts/entries only.
  const nonPaperAccounts = accounts.filter(function (a) {
    return a.accountType !== 'paper';
  });
  const nonPaperAccountIdSet = new Set(nonPaperAccounts.map(function (a) {
    return a.id;
  }));
  const nonPaperEntries = entries.filter(function (e) {
    return nonPaperAccountIdSet.has(e.accountId);
  });
  useEffect(function () {
    const ref = db.collection('presence').doc(user.uid);
    const beat = function () {
      ref.set({
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        email: user.email || ''
      }, {
        merge: true
      }).catch(function (e) {
        console.error('presence heartbeat error:', e.code, e.message);
      });
    };
    beat();
    const interval = setInterval(beat, 20000);
    return function () {
      clearInterval(interval);
    };
  }, [user.uid]);

  // Records the person's display name the moment they log in, regardless of
  // whether they have any trading accounts yet. Without this, someone who
  // signed up with a real name but hasn't set up an account never gets that
  // name saved anywhere the leaderboard can read it, and shows as Trader-XXXX.
  useEffect(function () {
    db.collection('leaderboard').doc(user.uid).set({
      displayName: user.displayName || 'Trader-' + user.uid.slice(0, 4)
    }, {
      merge: true
    }).catch(function (e) {
      console.error('leaderboard name write error:', e.code, e.message);
    });
  }, [user.uid, user.displayName]);
  useEffect(function () {
    const disc = computeDisciplineScore(nonPaperAccounts, nonPaperEntries);
    if (!disc) return;
    db.collection('leaderboard').doc(user.uid).set({
      displayName: user.displayName || 'Trader-' + user.uid.slice(0, 4),
      disciplineScore: disc.score,
      loggingConsistency: disc.loggingConsistency,
      exercisePct: disc.checklist.exercisePct,
      entryRulesPct: disc.checklist.entryRulesPct,
      riskDisciplinePct: disc.checklist.riskDisciplinePct,
      lotDisciplinePct: disc.checklist.lotDisciplinePct,
      matrixPct: disc.checklist.matrixPct,
      dailyLossCapPct: disc.checklist.dailyLossCapPct,
      htfPct: disc.checklist.htfPct,
      biasPct: disc.checklist.biasPct,
      daysLogged: disc.daysLogged,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, {
      merge: true
    }).catch(function (e) {
      console.error('leaderboard write error:', e.code, e.message);
    });
  }, [accounts, entries, user.uid]);
  const activeAccount = accounts.find(function (a) {
    return a.id === activeAccountId;
  });
  const accountEntries = entries.filter(function (e) {
    return e.accountId === activeAccountId;
  });
  // Today's entry (if the trader already logged trades or a no-trade day for
  // today) and whatever pre-session check-in exists for today - whichever of
  // the two is "freshest" is what the Mental Check page edits and what a new
  // Daily Log entry picks up automatically, so the check-in is only ever
  // filled out once a day, on its own page, not duplicated in the modal too.
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysEntryForAccount = accountEntries.find(function (e) {
    return e.date === todayStr;
  });
  const todaysMentalCheckSource = todaysEntryForAccount && todaysEntryForAccount.mentalCheck ? todaysEntryForAccount.mentalCheck : activeAccount && activeAccount.todayMentalCheck && activeAccount.todayMentalCheck.date === todayStr ? activeAccount.todayMentalCheck : null;
  const tradingDaysCount = activeAccount ? getTradingDaysCount(entries, activeAccount.id) : 0;
  const minTradingDaysNeeded = activeAccount && activeAccount.minTradingDays ? parseFloat(activeAccount.minTradingDays) : null;
  const daysStillNeeded = minTradingDaysNeeded ? Math.max(0, minTradingDaysNeeded - tradingDaysCount) : 0;
  const payoutStatus = activeAccount ? getPayoutStatus(activeAccount, entries) : null;
  const bufferHistory = activeAccount ? calcBufferHistory(activeAccount, accountEntries) : [];
  const currentBuffer = bufferHistory.length > 0 ? bufferHistory[bufferHistory.length - 1].buffer : activeAccount ? parseFloat(activeAccount.maxDrawdown) || 0 : 0;
  const activeCfg = activeAccount ? PHASE_CONFIG[activeAccount.accountType] || PHASE_CONFIG.challenge : PHASE_CONFIG.challenge;
  const riskPerTrade = getRiskAmount(activeAccount ? activeAccount.accountType : 'challenge', currentBuffer);
  const contractPlan = getContractPlan(currentBuffer, activeAccount ? activeAccount.market || 'nasdaq100' : 'nasdaq100');
  const activePointValue = function () {
    if (!activeAccount) return null;
    const spec = MARKET_SPECS[activeAccount.market || 'nasdaq100'] || MARKET_SPECS.nasdaq100;
    if (contractPlan.tier === 'nano') return spec.nanoPt;
    if (contractPlan.tier === 'micro') return spec.microPt;
    if (contractPlan.tier === 'mini') return spec.miniPt;
    return null;
  }();
  const maxStopPoints = activeAccount ? getMaxStopPoints(activeAccount.market || 'nasdaq100', activeAccount.accountType) : 0;
  const activeTicker = activeAccount ? getTickerForTier(activeAccount.market || 'nasdaq100', contractPlan.tier) : '-';
  const ruinDivisor = activeCfg.riskPct > 0 ? 1 / activeCfg.riskPct : 10;
  const activeRR = activeAccount ? Math.max(parseFloat(activeAccount.rewardRatio) || MIN_RR, MIN_RR) : MIN_RR;

  // Whenever the selected account changes, reload the risk-tolerance draft and
  // the Daily Plan template draft from that account's own saved data (each
  // account has its own tolerance and its own plan - switching accounts must
  // never leak one account's draft into another's inputs).
  useEffect(function () {
    setRiskToleranceDraft(activeAccount && activeAccount.riskTolerance ? String(activeAccount.riskTolerance) : '');
    setConfirmedTolerance(undefined);
    setRiskToleranceStatus(null);
    const tpl = activeAccount && activeAccount.dailyPlanTemplate;
    setDailyPlanTemplateDraft(tpl ? Object.assign({}, emptyDailyPlan(riskPerTrade, activeRR), tpl) : emptyDailyPlan(riskPerTrade, activeRR));
    setDailyPlanCadence(tpl && tpl.cadence ? tpl.cadence : 'daily');
    setDailyPlanTemplateStatus(null);
    // eslint-disable-next-line
  }, [activeAccountId]);

  // Keeps the Mental Check page's draft in sync with whatever's actually the
  // freshest source for today - today's own entry if one already exists, or
  // the standalone check-in saved earlier that morning - so switching
  // accounts, switching pages, or another tab saving a new entry for today
  // never leaves the sliders showing stale or wrong-account numbers.
  useEffect(function () {
    setMentalCheckDraft(todaysMentalCheckSource ? Object.assign({}, emptyMentalCheck(), todaysMentalCheckSource) : emptyMentalCheck());
    setMentalCheckStatus(null);
    // eslint-disable-next-line
  }, [activeAccountId, activePage, todaysEntryForAccount && todaysEntryForAccount.id]);

  // Risk tolerance: the Charter's math (riskPerTrade, contractPlan) is always
  // the ceiling - the most a trader is ever allowed to risk. A trader can
  // choose to trade smaller than that ceiling if the full amount would risk
  // triggering revenge trading or emotional strain, but never larger. When
  // set, lot size is recalculated to fit inside the smaller dollar amount
  // using the same stop distance, rather than just capping the dollar figure
  // and leaving the lot size at the full-risk tier.
  const riskToleranceRaw = confirmedTolerance !== undefined ? confirmedTolerance : activeAccount && activeAccount.riskTolerance ? parseFloat(activeAccount.riskTolerance) : null;
  const effectiveRiskPerTrade = riskToleranceRaw && riskToleranceRaw > 0 ? Math.min(riskToleranceRaw, riskPerTrade) : riskPerTrade;
  const toleranceIsActive = effectiveRiskPerTrade < riskPerTrade;
  const effectiveContracts = function () {
    if (!toleranceIsActive || !activePointValue || !maxStopPoints) return contractPlan.count;
    const fit = Math.floor(effectiveRiskPerTrade / (maxStopPoints * activePointValue));
    return Math.max(1, Math.min(contractPlan.count, fit));
  }();
  const effectiveDailyCap = effectiveRiskPerTrade * 2;
  const effectiveTierLabel = (CAPITAL_TIERS.find(function (t) {
    return t.key === contractPlan.tier;
  }) || {}).label || '';
  const effectiveContractLabel = contractPlan.tier === 'none' ? contractPlan.label : effectiveContracts + ' ' + effectiveTierLabel + (effectiveContracts > 1 ? 's' : '');
  const tradedAccountEntries = accountEntries.filter(function (e) {
    return e.tradedToday !== 'no';
  });
  const totalPnl = tradedAccountEntries.reduce(function (sum, e) {
    return sum + e.trades.reduce(function (s, t) {
      return s + tradeSignedPnl(t);
    }, 0);
  }, 0);
  const winTrades = tradedAccountEntries.flatMap(function (e) {
    return e.trades;
  }).filter(function (t) {
    return t.result === 'win';
  }).length;
  const lossTrades = tradedAccountEntries.flatMap(function (e) {
    return e.trades;
  }).filter(function (t) {
    return t.result === 'loss';
  }).length;
  const totalTrades = winTrades + lossTrades;
  const winRate = totalTrades > 0 ? winTrades / totalTrades * 100 : 0;
  const avgTradesPerDay = tradedAccountEntries.length > 0 ? totalTrades / tradedAccountEntries.length : 0;
  const maxTradesInDay = tradedAccountEntries.reduce(function (max, e) {
    return Math.max(max, e.trades.length);
  }, 0);
  const activeStatus = activeAccount ? accountEntries.length === 0 ? 'active' : computeStatus(activeAccount, currentBuffer, totalPnl) : 'active';
  const shouldShowAccountDetail = activeAccount && (accountFilter !== 'active' || activeStatus !== 'breached' || viewingBreached);

  // Once a risk tolerance is actually locked in, it stays locked for the
  // rest of this account's active life - no changing your mind mid-account
  // and quietly raising your own risk. It only opens back up once the
  // account is done (passed/target-hit, or breached/failed), at which point
  // a new number would apply to whatever account comes next anyway.
  const toleranceLocked = !!(activeAccount && activeAccount.riskTolerance && activeStatus === 'active');
  const getAccountStatus = function (acc) {
    return computeAccountStatus(acc, entries);
  };
  const rulesForDirection = function (direction) {
    if (!activeAccount) return [];
    const strategies = getStrategies(activeAccount);
    const strategy = strategies.find(function (s) {
      return s.id === (newEntry.strategyId || 'default');
    }) || strategies[0];
    const list = direction === 'long' ? strategy.longRules : strategy.shortRules;
    return (list || []).filter(function (r) {
      return r && r.trim();
    });
  };
  const biasAligns = function (bias, direction) {
    if (bias === 'neutral') return null;
    if (bias === 'bullish') return direction === 'long';
    if (bias === 'bearish') return direction === 'short';
    return null;
  };
  const handleAddAccount = async function () {
    if (!newAccount.name || !newAccount.startingBalance || !newAccount.maxDrawdown) return;
    const existingOfType = accounts.filter(function (a) {
      return a.accountType === newAccount.accountType;
    }).length;
    const doc = await accountsRef.add({
      name: newAccount.name,
      accountNumber: existingOfType + 1,
      startingBalance: parseFloat(newAccount.startingBalance),
      maxDrawdown: parseFloat(newAccount.maxDrawdown),
      profitTarget: parseFloat(newAccount.profitTarget) || 0,
      rewardRatio: Math.max(parseFloat(newAccount.rewardRatio) || MIN_RR, MIN_RR),
      accountType: newAccount.accountType,
      market: newAccount.market || 'nasdaq100',
      drawdownType: newAccount.drawdownType || 'static',
      copiedAccountNumber: newAccount.copiedAccountNumber || '',
      linkedFromId: newAccount.linkedFromId || null,
      linkedFromLabel: newAccount.linkedFromLabel || '',
      strategyName: newAccount.strategyName || '',
      longRules: newAccount.longRules.filter(function (r) {
        return r && r.trim();
      }),
      shortRules: newAccount.shortRules.filter(function (r) {
        return r && r.trim();
      }),
      accountCost: parseFloat(newAccount.accountCost) || 0,
      activationCost: parseFloat(newAccount.activationCost) || 0,
      resetCost: parseFloat(newAccount.resetCost) || 0,
      consistencyPct: newAccount.consistencyPct ? parseFloat(newAccount.consistencyPct) : null,
      minTradingDays: newAccount.minTradingDays ? parseFloat(newAccount.minTradingDays) : null,
      dailyLossLimit: newAccount.dailyLossLimit ? parseFloat(newAccount.dailyLossLimit) : null,
      dllType: newAccount.dllType || 'hard',
      payoutType: newAccount.payoutType || 'simple',
      payoutBuffer: newAccount.payoutBuffer ? parseFloat(newAccount.payoutBuffer) : null,
      payoutThreshold: newAccount.payoutThreshold ? parseFloat(newAccount.payoutThreshold) : null,
      profitSplit: newAccount.profitSplit ? parseFloat(newAccount.profitSplit) : null,
      minQualifyingDays: newAccount.minQualifyingDays ? parseFloat(newAccount.minQualifyingDays) : null,
      payoutCap: newAccount.payoutCap ? parseFloat(newAccount.payoutCap) : null,
      streakDays: newAccount.streakDays ? parseFloat(newAccount.streakDays) : null,
      streakDayMin: newAccount.streakDayMin ? parseFloat(newAccount.streakDayMin) : null,
      streakPctOfTotal: newAccount.streakPctOfTotal ? parseFloat(newAccount.streakPctOfTotal) : null,
      streakFlatCap: newAccount.streakFlatCap ? parseFloat(newAccount.streakFlatCap) : null,
      formulaBuffer: newAccount.formulaBuffer ? parseFloat(newAccount.formulaBuffer) : null,
      formulaMultiplier: newAccount.formulaMultiplier ? parseFloat(newAccount.formulaMultiplier) : null,
      formulaCap: newAccount.formulaCap ? parseFloat(newAccount.formulaCap) : null,
      formulaMinPayout: newAccount.formulaMinPayout ? parseFloat(newAccount.formulaMinPayout) : null,
      twoLegTarget: newAccount.twoLegTarget ? parseFloat(newAccount.twoLegTarget) : null,
      twoLegCashPayout: newAccount.twoLegCashPayout ? parseFloat(newAccount.twoLegCashPayout) : null,
      twoLegLiveCredit: newAccount.twoLegLiveCredit ? parseFloat(newAccount.twoLegLiveCredit) : null,
      payouts: [],
      archived: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    setHasManualSelection(true);
    setViewingBreached(false);
    setActiveAccountId(doc.id);
    // A new paper (practice) account stays out of the combined Overview by
    // default, same as it stays out of the discipline score and leaderboard -
    // the trader can still check its box by hand if they want it blended in.
    if (newAccount.accountType !== 'paper') {
      setSelectedAccountIds(function (prev) {
        const next = new Set(prev);
        next.add(doc.id);
        return next;
      });
    }
    setNewAccount(emptyAccountForm);
    setShowAddAccount(false);
  };
  const handleStartFundedFromChallenge = function (challengeAcc) {
    setNewAccount(Object.assign({}, emptyAccountForm, {
      accountType: 'funded',
      market: challengeAcc.market || 'nasdaq100',
      rewardRatio: challengeAcc.rewardRatio || '2.5',
      name: challengeAcc.name.replace(/challenge/i, '').trim() + ' - Funded',
      startingBalance: challengeAcc.startingBalance,
      drawdownType: challengeAcc.drawdownType || 'static',
      strategyName: challengeAcc.strategyName || '',
      longRules: challengeAcc.longRules && challengeAcc.longRules.length ? challengeAcc.longRules : [''],
      shortRules: challengeAcc.shortRules && challengeAcc.shortRules.length ? challengeAcc.shortRules : [''],
      linkedFromId: challengeAcc.id,
      linkedFromLabel: challengeAcc.name + ' #' + challengeAcc.accountNumber
    }));
    setShowAddAccount(true);
  };

  // Accounts can never be permanently deleted from the app - that would wipe
  // real trading history (entries, payouts, buffer data) a user may need
  // later for records, taxes, or a payout dispute. Instead, every account
  // moves through a lifecycle: Active -> Funded/Live (accountType already
  // tracks this) -> Breached ("failed", computed automatically from real
  // losses - never user-set) -> or manually Archived, which is reversible.
  // This just flips the existing `archived` flag; it never touches entries.
  const handleArchiveAccount = async function (id, currentlyArchived) {
    const verb = currentlyArchived ? 'Unarchive' : 'Archive';
    const msg = currentlyArchived ? 'Unarchive this account? It will show up as active again.' : "Archive this account? It'll stop counting as active, but every trade and entry stays saved - you can unarchive it anytime.";
    if (!confirm(msg)) return;
    await accountsRef.doc(id).update({
      archived: !currentlyArchived
    });
  };
  const handleAddPayout = async function (payout) {
    await accountsRef.doc(activeAccount.id).update({
      payouts: firebase.firestore.FieldValue.arrayUnion(payout)
    });
  };
  const handleSavePayoutRules = async function (rules) {
    await accountsRef.doc(activeAccount.id).update(rules);
  };
  const handleChangeMarket = async function (newMarket) {
    await accountsRef.doc(activeAccount.id).update({
      market: newMarket
    });
  };
  const handleChangeRiskTolerance = async function (value) {
    setRiskToleranceStatus(null);
    if (toleranceLocked) {
      setRiskToleranceStatus({
        type: 'error',
        text: 'Locked - you already set your risk tolerance for this account. It stays fixed until this account passes or fails, so you can\'t raise or lower it mid-account.'
      });
      return;
    }
    if (riskPerTrade <= 0) {
      setRiskToleranceStatus({
        type: 'error',
        text: "Can't set a tolerance yet - this account's system max risk per trade is $0 (check the buffer/account setup)."
      });
      return;
    }
    const num = parseFloat(value);
    try {
      if (value === '' || value === null) {
        setConfirmedTolerance(null);
        setRiskToleranceDraft('');
        await accountsRef.doc(activeAccount.id).update({
          riskTolerance: null
        });
        setRiskToleranceStatus({
          type: 'success',
          text: 'Cleared - back to system max.'
        });
        return;
      }
      if (isNaN(num) || num <= 0) {
        setRiskToleranceStatus({
          type: 'error',
          text: 'Enter a number greater than 0.'
        });
        return;
      }
      // The General calculation is always the ceiling - a trader can only
      // choose to trade smaller than it, never larger. Rather than silently
      // clamping a too-high number down, this tells the trader plainly that
      // what they typed was not allowed and exactly what was used instead,
      // so a caution is seen, not just a surprising smaller number.
      const wasOverMax = num > riskPerTrade;
      const clamped = Math.min(num, riskPerTrade);
      // Update local state immediately so the dashboard reflects the change right
      // away, rather than waiting on the Firestore write/listener round trip -
      // the write below still persists it for next session.
      setConfirmedTolerance(clamped);
      setRiskToleranceDraft(String(clamped));
      await accountsRef.doc(activeAccount.id).update({
        riskTolerance: clamped
      });
      if (wasOverMax) {
        setRiskToleranceStatus({
          type: 'error',
          text: 'Caution: $' + num + ' is above the General max of ' + fmt(riskPerTrade) + '/trade - that is not allowed. Using ' + fmt(clamped) + '/trade instead, and it is now locked at that amount.'
        });
      } else {
        setRiskToleranceStatus({
          type: 'success',
          text: 'Saved and locked - now using ' + fmt(clamped) + '/trade until this account passes or fails.'
        });
      }
    } catch (e) {
      console.error('Risk tolerance save failed:', e.code, e.message);
      setRiskToleranceStatus({
        type: 'error',
        text: "Couldn't save: " + (e.message || 'unknown error') + '. Your change is showing locally but was not persisted - try again.'
      });
    }
  };

  // Saves the Daily Plan as a reusable template on the account itself (not a
  // single day's entry). Once saved, every new Daily Log pre-fills its Daily
  // Plan section from this template - so setting it once covers that one day,
  // the whole week, the month, or the year, however long the trader says it's
  // good for (the cadence label), without having to retype it each time a new
  // entry is opened. A trader can always edit a single day's own plan inside
  // that day's entry without touching this template.
  const handleSaveDailyPlanTemplate = async function () {
    setDailyPlanTemplateStatus(null);
    try {
      // riskAmount always mirrors the Personal Risk Tolerance set above it on
      // this same page, never a separately-typed value - there's only one
      // risk-per-trade field on this page now, not two that could drift apart.
      const payload = Object.assign({}, dailyPlanTemplateDraft, {
        cadence: dailyPlanCadence,
        riskAmount: effectiveRiskPerTrade.toFixed(2)
      });
      await accountsRef.doc(activeAccount.id).update({
        dailyPlanTemplate: payload
      });
      const cadenceLabel = {
        daily: 'every day',
        weekly: 'this week',
        monthly: 'this month',
        yearly: 'this year'
      }[dailyPlanCadence] || 'every day';
      setDailyPlanTemplateStatus({
        type: 'success',
        text: 'Saved - this plan will pre-fill new Daily Log entries for ' + cadenceLabel + ' until you change it.'
      });
    } catch (e) {
      console.error('Daily plan template save failed:', e.code, e.message);
      setDailyPlanTemplateStatus({
        type: 'error',
        text: "Couldn't save: " + (e.message || 'unknown error') + '. Try again.'
      });
    }
  };
  const updateDailyPlanTemplateDraft = function (key, value) {
    setDailyPlanTemplateDraft(Object.assign({}, dailyPlanTemplateDraft, {
      [key]: value
    }));
  };
  const updateMentalCheckDraft = function (key, value) {
    setMentalCheckDraft(Object.assign({}, mentalCheckDraft, {
      [key]: value
    }));
  };

  // The pre-session check-in now lives on its own page instead of the Daily
  // Log modal. If today's entry already exists (trades or a no-trade day were
  // already logged today), update that entry directly so there's still only
  // one document per account per day. Otherwise, stash it on the account as
  // "today's" check-in - handleSaveEntry/the no-trade-day save both pick it
  // up automatically when that day's real entry is created later.
  const handleSaveMentalCheck = async function () {
    setMentalCheckStatus(null);
    try {
      if (todaysEntryForAccount) {
        await entriesRef.doc(todaysEntryForAccount.id).update({
          mentalCheck: mentalCheckDraft
        });
      } else {
        await accountsRef.doc(activeAccount.id).update({
          todayMentalCheck: Object.assign({}, mentalCheckDraft, {
            date: todayStr
          })
        });
      }
      setMentalCheckStatus({
        type: 'success',
        text: "Saved - this will carry over automatically when you log today's Daily Log entry."
      });
    } catch (e) {
      console.error('Mental check save failed:', e.code, e.message);
      setMentalCheckStatus({
        type: 'error',
        text: "Couldn't save: " + (e.message || 'unknown error') + '. Try again.'
      });
    }
  };
  const handleBackToActive = function () {
    setViewingBreached(false);
    const nonBreached = accounts.find(function (a) {
      return computeAccountStatus(a, entries) !== 'breached';
    });
    setActiveAccountId(nonBreached ? nonBreached.id : null);
  };
  const handleBrokerFileSelect = function (file) {
    setBrokerImportError('');
    setBrokerImportPreview(null);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      setBrokerCsvText(e.target.result);
      const result = parseTradeFile(e.target.result, brokerCommission);
      if (result.error) {
        setBrokerImportError(result.error);
        return;
      }
      if (result.totalTrades === 0) {
        setBrokerImportError('No fillable trades found in this file.');
        return;
      }
      setBrokerImportPreview(result);
    };
    reader.onerror = function () {
      setBrokerImportError('Could not read that file.');
    };
    reader.readAsText(file);
  };
  const handleBrokerCommissionChange = function (value) {
    setBrokerCommission(value);
    if (!brokerCsvText) return;
    const result = parseTradeFile(brokerCsvText, value);
    if (!result.error && result.totalTrades > 0) setBrokerImportPreview(result);
  };
  const handleConfirmBrokerImport = async function () {
    if (!brokerImportPreview || !activeAccountId) return;
    setBrokerImportBusy(true);
    try {
      const dates = Object.keys(brokerImportPreview.byDate);
      for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        const dayTrades = brokerImportPreview.byDate[date];
        const trades = dayTrades.map(function (rt) {
          return {
            result: rt.pnl >= 0 ? 'win' : 'loss',
            pnl: Math.abs(rt.pnl).toFixed(2),
            direction: rt.direction,
            rulesChecked: [],
            positionSize: String(rt.qty),
            riskAmount: '',
            htfLtf: false,
            openTime: rt.openTime || null,
            closeTime: rt.closeTime || null,
            symbol: rt.contract || null,
            entryPrice: rt.entryPrice !== undefined && rt.entryPrice !== null && !isNaN(rt.entryPrice) ? rt.entryPrice : null,
            exitPrice: rt.exitPrice !== undefined && rt.exitPrice !== null && !isNaN(rt.exitPrice) ? rt.exitPrice : null
          };
        });
        // Re-importing the same account+date must overwrite, not stack a second
        // entry alongside the first. Querying Firestore directly here (not the
        // local `entries` state) matters: that state comes from an async
        // listener that can lag behind what's actually saved, especially right
        // after a previous import - checking the local copy could miss
        // entries that genuinely exist and let a duplicate through anyway.
        const existingSnap = await entriesRef.where('accountId', '==', activeAccountId).where('date', '==', date).get();
        for (let j = 0; j < existingSnap.docs.length; j++) {
          await entriesRef.doc(existingSnap.docs[j].id).delete();
        }
        await entriesRef.add({
          accountId: activeAccountId,
          date: date,
          tradedToday: 'yes',
          dailyBias: 'neutral',
          exercised: false,
          strategyId: 'default',
          trades: trades,
          notes: 'Imported from Tradovate',
          matrixAdherent: trades.length <= 3
        });
      }
      setBrokerImportPreview(null);
      setShowImportBroker(false);
    } catch (e) {
      setBrokerImportError('Import failed partway through: ' + e.message + '. Days already written are saved - check Trade History before re-importing to avoid duplicates.');
    }
    setBrokerImportBusy(false);
  };
  const handleAddStrategy = async function () {
    if (!newStrategy.name.trim()) return;
    const strategy = {
      id: 'strat_' + Date.now(),
      name: newStrategy.name.trim(),
      longRules: newStrategy.longRules.filter(function (r) {
        return r && r.trim();
      }),
      shortRules: newStrategy.shortRules.filter(function (r) {
        return r && r.trim();
      })
    };
    await accountsRef.doc(activeAccount.id).update({
      strategies: firebase.firestore.FieldValue.arrayUnion(strategy)
    });
    setNewStrategy(emptyStrategyForm);
  };
  const handleDeleteStrategy = async function (strategyId) {
    const remaining = (activeAccount.strategies || []).filter(function (s) {
      return s.id !== strategyId;
    });
    await accountsRef.doc(activeAccount.id).update({
      strategies: remaining
    });
  };
  const addStrategyRuleRow = function (field) {
    const updated = {};
    updated[field] = newStrategy[field].concat(['']);
    setNewStrategy(Object.assign({}, newStrategy, updated));
  };
  const updateStrategyRuleRow = function (field, idx, value) {
    const list = newStrategy[field].slice();
    list[idx] = value;
    const updated = {};
    updated[field] = list;
    setNewStrategy(Object.assign({}, newStrategy, updated));
  };
  const removeStrategyRuleRow = function (field, idx) {
    const updated = {};
    updated[field] = newStrategy[field].filter(function (_, i) {
      return i !== idx;
    });
    setNewStrategy(Object.assign({}, newStrategy, updated));
  };
  const addRuleRow = function (field) {
    const updated = {};
    updated[field] = newAccount[field].concat(['']);
    setNewAccount(Object.assign({}, newAccount, updated));
  };
  const updateRuleRow = function (field, idx, value) {
    const list = newAccount[field].slice();
    list[idx] = value;
    const updated = {};
    updated[field] = list;
    setNewAccount(Object.assign({}, newAccount, updated));
  };
  const removeRuleRow = function (field, idx) {
    const updated = {};
    updated[field] = newAccount[field].filter(function (_, i) {
      return i !== idx;
    });
    setNewAccount(Object.assign({}, newAccount, updated));
  };
  const filledTrades = newEntry.trades.filter(function (t) {
    return t.pnl !== '';
  });
  const filledWins = filledTrades.filter(function (t) {
    return t.result === 'win';
  }).length;
  const filledLosses = filledTrades.filter(function (t) {
    return t.result === 'loss';
  }).length;
  const isTie = filledTrades.length === 2 && filledWins === 1 && filledLosses === 1;
  const filledPnlSigned = filledTrades.reduce(function (s, t) {
    return s + tradeSignedPnl(t);
  }, 0);
  const cumBeforeThisDay = activeAccount ? getCumulativeProfitBefore(entries, activeAccount.id, newEntry.date) : 0;
  const consistencyCap = activeAccount ? getConsistencyCap(activeAccount, cumBeforeThisDay) : null;
  const overConsistency = consistencyCap !== null && filledPnlSigned > consistencyCap;
  const dllLimit = activeAccount ? parseFloat(activeAccount.dailyLossLimit) || null : null;
  const todaysLoss = filledPnlSigned < 0 ? Math.abs(filledPnlSigned) : 0;
  const dllBreached = dllLimit !== null && todaysLoss >= dllLimit;
  const addTradeRow = function () {
    if (newEntry.trades.length >= 3 || filledWins >= 2 || filledLosses >= 2 || dllBreached) return;
    setNewEntry(Object.assign({}, newEntry, {
      trades: newEntry.trades.concat([{
        result: 'win',
        pnl: '',
        direction: 'long',
        rulesChecked: [],
        positionSize: String(effectiveContracts),
        riskAmount: effectiveRiskPerTrade.toFixed(2),
        htfLtf: false,
        chartUrl: '',
        stopHandling: 'respected',
        revengeEntry: false
      }])
    }));
  };
  const removeTradeRow = function (idx) {
    setNewEntry(Object.assign({}, newEntry, {
      trades: newEntry.trades.filter(function (_, i) {
        return i !== idx;
      })
    }));
  };
  const updateTradeRow = function (idx, field, value) {
    const trades = newEntry.trades.slice();
    trades[idx] = Object.assign({}, trades[idx]);
    trades[idx][field] = value;
    if (field === 'direction') trades[idx].rulesChecked = [];
    setNewEntry(Object.assign({}, newEntry, {
      trades: trades
    }));
  };
  const toggleRuleChecked = function (tradeIdx, ruleText) {
    const trades = newEntry.trades.slice();
    trades[tradeIdx] = Object.assign({}, trades[tradeIdx]);
    const current = trades[tradeIdx].rulesChecked || [];
    trades[tradeIdx].rulesChecked = current.indexOf(ruleText) !== -1 ? current.filter(function (r) {
      return r !== ruleText;
    }) : current.concat([ruleText]);
    setNewEntry(Object.assign({}, newEntry, {
      trades: trades
    }));
  };
  const updateReflection = function (key, value) {
    setNewEntry(Object.assign({}, newEntry, {
      reflection: Object.assign({}, newEntry.reflection, {
        [key]: value
      })
    }));
  };
  const handleSaveEntry = async function () {
    if (!activeAccountId) return;
    setSaveEntryError('');
    if (newEntry.tradedToday === 'no') {
      // A no-trade day is still a logged day - choosing NOT to force a trade
      // is exactly the discipline this app is trying to build, so it has to
      // save cleanly and the user has to see that it counted, not just
      // silently vanish into the log. computeDisciplineScore already counts
      // every logged date (traded or not) toward loggingConsistency, the
      // single largest-weighted factor in the discipline score - this just
      // makes that visible instead of invisible.
      if (!newEntry.noTradeReason) {
        setSaveEntryError('Pick a reason above, then you can save.');
        return;
      }
      try {
        await entriesRef.add({
          accountId: activeAccountId,
          date: newEntry.date,
          tradedToday: 'no',
          noTradeReason: newEntry.noTradeReason,
          notes: newEntry.noTradeNotes,
          dailyBias: 'neutral',
          exercised: newEntry.exercised,
          strategyId: newEntry.strategyId || 'default',
          trades: [],
          mentalCheck: newEntry.mentalCheck,
          dailyPlan: newEntry.dailyPlan,
          reflection: newEntry.reflection
        });
      } catch (e) {
        console.error('Save no-trade day failed:', e.code, e.message);
        setSaveEntryError("Couldn't save: " + (e.message || 'unknown error') + '. Try again.');
        return;
      }
      setNewEntry(emptyEntryForm(effectiveRiskPerTrade, effectiveContracts, activeRR, activeAccount && activeAccount.dailyPlanTemplate, todaysMentalCheckSource));
      setShowAddEntry(false);
      setEntrySavedToast('Logged - staying disciplined and not forcing a trade still counts toward your discipline score.');
      return;
    }
    if (filledTrades.length === 0) {
      setSaveEntryError('Add at least one trade first.');
      return;
    }
    if (isTie) {
      setSaveEntryError('A 1-1 split needs a tie-breaker third trade before you can save.');
      return;
    }
    const wins = filledTrades.filter(function (t) {
      return t.result === 'win';
    }).length;
    const losses = filledTrades.filter(function (t) {
      return t.result === 'loss';
    }).length;
    const matrixAdherent = filledTrades.length <= 3 && wins <= 2 && losses <= 2 && !(filledTrades.length === 2 && wins === 1 && losses === 1);
    const stampedTrades = filledTrades.map(function (t) {
      return Object.assign({}, t, {
        expectedRisk: effectiveRiskPerTrade,
        expectedContracts: effectiveContracts
      });
    });
    try {
      await entriesRef.add({
        accountId: activeAccountId,
        date: newEntry.date,
        tradedToday: 'yes',
        dailyBias: newEntry.dailyBias,
        exercised: newEntry.exercised,
        strategyId: newEntry.strategyId || 'default',
        trades: stampedTrades,
        notes: newEntry.notes,
        matrixAdherent: matrixAdherent,
        mentalCheck: newEntry.mentalCheck,
        dailyPlan: newEntry.dailyPlan,
        reflection: newEntry.reflection
      });
    } catch (e) {
      console.error('Save entry failed:', e.code, e.message);
      setSaveEntryError("Couldn't save: " + (e.message || 'unknown error') + '. Try again.');
      return;
    }
    setNewEntry(emptyEntryForm(effectiveRiskPerTrade, effectiveContracts, activeRR, activeAccount && activeAccount.dailyPlanTemplate, todaysMentalCheckSource));
    setShowAddEntry(false);
    setEntrySavedToast('Entry saved.');
  };
  const handleDeleteEntry = async function (id) {
    await entriesRef.doc(id).delete();
  };
  const lastEntryForActive = accountEntries.length > 0 ? accountEntries.slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  })[0] : null;
  const daysSinceLastLog = lastEntryForActive ? Math.floor((new Date() - new Date(lastEntryForActive.date)) / (1000 * 60 * 60 * 24)) : null;
  const linkableAccounts = newAccount.accountType === 'funded' ? accounts.filter(function (a) {
    return a.accountType === 'challenge';
  }) : newAccount.accountType === 'live' ? accounts.filter(function (a) {
    return a.accountType === 'funded';
  }) : [];
  const newAccountPreviewCfg = PHASE_CONFIG[newAccount.accountType] || PHASE_CONFIG.challenge;
  const newAccountMaxStop = getMaxStopPoints(newAccount.market, newAccount.accountType);
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-black text-white p-4 md:p-8"
  }, !(user.displayName || savedName) && /*#__PURE__*/React.createElement(NamePromptModal, {
    uid: user.uid,
    onSaved: setSavedName
  }), entrySavedToast && /*#__PURE__*/React.createElement("div", {
    className: "fixed top-4 right-4 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 max-w-xs"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "CheckCircle2",
    className: "h-4 w-4 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, entrySavedToast)), /*#__PURE__*/React.createElement("div", {
    className: "max-w-6xl mx-auto space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-4 pb-5 border-b border-gray-900"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "./logo-wordmark.png",
    alt: "MMM Pro Journal",
    className: "h-10 w-auto rounded-lg border border-yellow-500/20"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500 text-sm mt-1 flex items-center flex-wrap"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(EditableName, {
    user: user
  }), " - ", /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      auth.signOut();
    },
    className: "text-red-400 hover:underline"
  }, "Sign out")), /*#__PURE__*/React.createElement(UserCounters, null))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("a", {
    href: "../",
    title: "Back to maxmaserati.com",
    className: "flex items-center gap-1.5 bg-gray-900 border border-gray-800 text-gray-400 hover:text-yellow-300 hover:border-yellow-500/40 rounded-lg px-3 py-1.5 text-sm font-semibold transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Home",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Home")), /*#__PURE__*/React.createElement("a", {
    href: "course/index.html",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "flex items-center gap-1.5 bg-gradient-to-r from-[#D6B15E] to-[#b8903f] text-black px-3 py-1.5 rounded-lg text-sm font-semibold hover:from-[#e0c074] hover:to-[#c89f4c] transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "GraduationCap",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Course")), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setShowInstall(true);
    },
    title: "Put MMM Pro Journal on your phone",
    className: "bg-gray-900 border border-gray-800 text-gray-400 hover:text-yellow-300 hover:border-yellow-500/40 rounded-lg p-1.5 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Smartphone",
    className: "h-4 w-4"
  })), /*#__PURE__*/React.createElement("select", {
    value: viewMode,
    onChange: function (e) {
      setViewMode(e.target.value);
    },
    className: "bg-gray-900 border border-gray-800 text-gray-300 rounded-lg px-2 py-1.5 text-xs focus:border-yellow-400/50 outline-none"
  }, VIEW_MODES.map(function (v) {
    return /*#__PURE__*/React.createElement("option", {
      key: v.key,
      value: v.key
    }, v.label);
  })), /*#__PURE__*/React.createElement(LanguageSwitcher, {
    language: language,
    setLanguage: setLanguage
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex bg-gray-900 border border-gray-800 rounded-lg p-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setViewingBreached(false);
      setAccountFilter('active');
    },
    className: "px-3 py-1.5 rounded-md text-xs font-medium transition " + (accountFilter === 'active' ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-500 hover:text-white')
  }, "Active Only"), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setAccountFilter('all');
    },
    className: "px-3 py-1.5 rounded-md text-xs font-medium transition " + (accountFilter === 'all' ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-500 hover:text-white')
  }, "All Accounts")), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setNewAccount(emptyAccountForm);
      setShowAddAccount(true);
    },
    className: "flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-black px-4 py-2 rounded-lg font-semibold hover:from-green-400 hover:to-emerald-500 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Plus",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Add Account")))), accounts.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement(AccountGroupNav, {
    accounts: accounts,
    activeAccountId: activeAccountId,
    onSelect: function (id, fromBreachedTab) {
      setHasManualSelection(true);
      setViewingBreached(!!fromBreachedTab);
      setActiveAccountId(id);
      setActivePage('overview');
    },
    getStatus: getAccountStatus,
    filter: accountFilter,
    selectedIds: selectedAccountIds,
    onToggleAccount: toggleAccountSelection,
    onToggleGroup: toggleGroupSelection,
    onToggleAll: toggleAllAccountSelection
  }), shouldShowAccountDetail && /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setNewEntry(emptyEntryForm(effectiveRiskPerTrade, effectiveContracts, activeRR, activeAccount && activeAccount.dailyPlanTemplate, todaysMentalCheckSource));
      setEntryMethod('manual');
      setSaveEntryError('');
      setShowAddEntry(true);
    },
    className: "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium bg-yellow-500/10 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/15 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "CalendarPlus",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Daily Log")), shouldShowAccountDetail && /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setBrokerImportError('');
      setBrokerImportPreview(null);
      setBrokerCsvText(null);
      setBrokerCommission('');
      setShowImportBroker(true);
    },
    className: "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium bg-gray-900 border-gray-800 text-gray-300 hover:border-blue-500/40 hover:text-blue-300 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Upload",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Import Trades (CSV)")), shouldShowAccountDetail && function () {
    const seenDates = {};
    let hasDupes = false;
    accountEntries.forEach(function (e) {
      if (seenDates[e.date]) hasDupes = true;
      seenDates[e.date] = true;
    });
    if (!hasDupes) return null;
    return /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        setShowDupeCleanup(true);
      },
      className: "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium bg-red-500/10 border-red-500/40 text-red-300 hover:bg-red-500/20 transition"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "AlertTriangle",
      className: "h-3.5 w-3.5"
    }), /*#__PURE__*/React.createElement("span", null, "Duplicate Days Found - Clean Up"));
  }()), shouldShowAccountDetail && /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900/60 to-black border border-gray-800 rounded-xl px-5 py-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3.5"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-white font-semibold"
  }, activeAccount.name), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, activeAccount.linkedFromLabel && /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "Promoted from ", /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-400"
  }, activeAccount.linkedFromLabel)), activeAccount.copiedAccountNumber && /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "Copy of ", /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-400"
  }, activeAccount.copiedAccountNumber)), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      handleArchiveAccount(activeAccount.id, activeAccount.archived === true);
    },
    className: "text-xs text-gray-600 hover:text-yellow-400 transition"
  }, activeAccount.archived === true ? 'Unarchive account' : 'Archive account'))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-0.5"
  }, "Capital"), /*#__PURE__*/React.createElement("div", {
    className: "num text-white font-semibold"
  }, fmt(activeAccount.startingBalance))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-0.5"
  }, "Drawdown"), /*#__PURE__*/React.createElement("div", {
    className: "num font-semibold " + (currentBuffer - (parseFloat(activeAccount.maxDrawdown) || 0) < 0 ? 'text-red-400' : 'text-white')
  }, fmt(currentBuffer - (parseFloat(activeAccount.maxDrawdown) || 0))), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-600"
  }, "from ", fmt(activeAccount.maxDrawdown))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-0.5"
  }, "Drawdown type"), /*#__PURE__*/React.createElement("div", {
    className: "text-white font-semibold text-sm"
  }, (DRAWDOWN_TYPES.find(function (dt) {
    return dt.key === (activeAccount.drawdownType || 'static');
  }) || {}).short)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-0.5"
  }, "Market"), /*#__PURE__*/React.createElement("select", {
    value: activeAccount.market || 'nasdaq100',
    onChange: function (e) {
      handleChangeMarket(e.target.value);
    },
    className: "bg-gray-900 border border-gray-700 text-white rounded-md px-2 py-1 text-sm focus:border-yellow-400/50 outline-none w-full"
  }, MARKET_OPTIONS.map(function (m) {
    return /*#__PURE__*/React.createElement("option", {
      key: m.key,
      value: m.key
    }, m.label);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-0.5"
  }, "Target"), /*#__PURE__*/React.createElement("div", {
    className: "num text-white font-semibold"
  }, fmt(activeAccount.profitTarget))))), /*#__PURE__*/React.createElement(SystemExplainer, null)), accounts.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, diagnostic && /*#__PURE__*/React.createElement(DiagnosticResultCard, {
    result: diagnostic
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-center py-20 border border-dashed border-gray-700 rounded-2xl"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Shield",
    className: "h-10 w-10 text-gray-600 mx-auto mb-3"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500"
  }, "No accounts yet. Add one to start tracking your buffer."))) : !shouldShowAccountDetail ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-20 border border-dashed border-gray-700 rounded-2xl"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Shield",
    className: "h-10 w-10 text-gray-600 mx-auto mb-3"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500"
  }, "No active accounts right now."), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 text-sm mt-1"
  }, "Add a new account to get started, or check the Breached tab to review what happened."), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setNewAccount(emptyAccountForm);
      setShowAddAccount(true);
    },
    className: "mt-4 inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-black px-4 py-2 rounded-lg font-semibold hover:from-green-400 hover:to-emerald-500 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Plus",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Add Account"))) : /*#__PURE__*/React.createElement(React.Fragment, null, activeAccount && /*#__PURE__*/React.createElement(React.Fragment, null, activeStatus === 'breached' && /*#__PURE__*/React.createElement("div", {
    className: "border border-red-500/40 bg-red-500/10 rounded-xl p-4 flex items-start gap-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "AlertTriangle",
    className: "h-5 w-5 text-red-400 mt-0.5"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-red-300 font-semibold text-sm"
  }, "Account Breached"), /*#__PURE__*/React.createElement("p", {
    className: "text-red-200/70 text-xs mt-1"
  }, "Buffer fully consumed. This account is now archived.")), /*#__PURE__*/React.createElement("button", {
    onClick: handleBackToActive,
    className: "text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 flex-shrink-0"
  }, "Back to Active"), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setNewAccount(emptyAccountForm);
      setShowAddAccount(true);
    },
    className: "text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg border border-red-500/40 flex-shrink-0"
  }, "Open New Account")), activeStatus === 'passed' && /*#__PURE__*/React.createElement("div", {
    className: "border border-green-500/40 bg-green-500/10 rounded-xl p-4 flex items-start gap-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Trophy",
    className: "h-5 w-5 text-green-400 mt-0.5"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-green-300 font-semibold text-sm"
  }, "Challenge Passed!"), /*#__PURE__*/React.createElement("p", {
    className: "text-green-200/70 text-xs mt-1"
  }, "Start tracking the funded account."), daysStillNeeded > 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-yellow-300 text-xs mt-1 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "AlertTriangle",
    className: "h-3 w-3 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, "Target hit, but this firm requires ", minTradingDaysNeeded, " trading days minimum - you're at ", tradingDaysCount, ". ", daysStillNeeded, " more day", daysStillNeeded !== 1 ? 's' : '', " needed before you can actually request the pass."))), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      handleStartFundedFromChallenge(activeAccount);
    },
    className: "text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1.5 rounded-lg border border-green-500/40 flex-shrink-0"
  }, "Start Funded Account")), activeStatus === 'target-hit' && /*#__PURE__*/React.createElement("div", {
    className: "border border-green-500/40 bg-green-500/10 rounded-xl p-4 flex items-start gap-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "DollarSign",
    className: "h-5 w-5 text-green-400 mt-0.5"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-green-300 font-semibold text-sm"
  }, "Target Hit"), /*#__PURE__*/React.createElement("p", {
    className: "text-green-200/70 text-xs mt-1"
  }, activeAccount.accountType === 'funded' ? 'Ready for payout.' : 'Profit target reached.'), daysStillNeeded > 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-yellow-300 text-xs mt-1 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "AlertTriangle",
    className: "h-3 w-3 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, "But this firm requires ", minTradingDaysNeeded, " trading days minimum - you're at ", tradingDaysCount, ". ", daysStillNeeded, " more day", daysStillNeeded !== 1 ? 's' : '', " needed before this actually qualifies.")))), payoutStatus && payoutStatus.eligible && /*#__PURE__*/React.createElement("div", {
    className: "border border-green-500/40 bg-green-500/10 rounded-xl p-4 flex items-start gap-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Calendar",
    className: "h-5 w-5 text-green-400 mt-0.5 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-green-300 font-semibold text-sm"
  }, "Payout Due - ", fmt(payoutStatus.requestable), " available", payoutStatus.split ? ' at your ' + payoutStatus.split + '% split' : ''), /*#__PURE__*/React.createElement("p", {
    className: "text-green-200/70 text-xs mt-1"
  }, payoutStatus.note, " Head to your prop firm's dashboard to request it, then log it on the Finances tab.")), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setActivePage('finances');
    },
    className: "text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1.5 rounded-lg border border-green-500/40 flex-shrink-0"
  }, "View Payout Tracker")), daysSinceLastLog !== null && daysSinceLastLog >= 1 && activeStatus === 'active' && /*#__PURE__*/React.createElement("div", {
    className: "border border-orange-500/30 bg-orange-500/10 rounded-xl p-3 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Clock",
    className: "h-4 w-4 text-orange-400"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-orange-200/80"
  }, "Last logged ", daysSinceLastLog, " day", daysSinceLastLog !== 1 ? 's' : '', " ago. Log today's activity or mark it as no-trade.")), /*#__PURE__*/React.createElement(MainNav, {
    activePage: activePage,
    setActivePage: setActivePage
  }), activeAccount.accountType === 'paper' && /*#__PURE__*/React.createElement("div", {
    className: "border border-blue-500/30 bg-blue-500/10 rounded-xl p-3 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "FlaskConical",
    className: "h-4 w-4 text-blue-400 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-blue-200/80"
  }, "Paper account - practice only. Nothing logged here counts toward your discipline score, the leaderboard, or any other real account's numbers.")), activePage === 'overview' && /*#__PURE__*/React.createElement(React.Fragment, null, selectedAccountIds.size === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-16 border border-dashed border-gray-700 rounded-2xl"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Square",
    className: "h-10 w-10 text-gray-600 mx-auto mb-3"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 font-medium"
  }, "No accounts selected"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 text-sm mt-1"
  }, "Check the boxes next to accounts in the nav above to see their numbers here - the whole Overview stays at zero until something's selected.")) : /*#__PURE__*/React.createElement(React.Fragment, null, diagnosticReady && !diagnostic && /*#__PURE__*/React.createElement("div", {
    className: "border border-yellow-500/40 bg-yellow-500/10 rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ClipboardCheck",
    className: "h-5 w-5 text-yellow-400 mt-0.5"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold text-yellow-200"
  }, "Take the Discipline Test to unlock Mental Check, Flow State, Psychology and Discipline"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-yellow-200/70"
  }, "2 minutes. It is your baseline for measuring progress."))), /*#__PURE__*/React.createElement("a", {
    href: "../diagnostic/",
    className: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-semibold"
  }, "Take the Test")), /*#__PURE__*/React.createElement(CommandCenter, {
    account: activeAccount,
    accounts: accountsForOverview,
    entries: entries,
    status: activeStatus,
    buffer: currentBuffer,
    phaseLabel: activeCfg.label + ' - ' + activeCfg.mode + ' (' + activeCfg.riskPct * 100 + '% risk) - ' + ((MARKET_SPECS[activeAccount.market || 'nasdaq100'] || {}).label || '') + ' ' + activeTicker,
    risk: effectiveRiskPerTrade,
    dailyCap: effectiveDailyCap,
    todayTrades: todaysEntryForAccount && todaysEntryForAccount.tradedToday !== 'no' ? (todaysEntryForAccount.trades || []).length : 0,
    todayPnl: todaysEntryForAccount && todaysEntryForAccount.tradedToday !== 'no' ? (todaysEntryForAccount.trades || []).reduce(function (sum, t) {
      return sum + tradeSignedPnl(t);
    }, 0) : 0,
    loggedToday: !!todaysEntryForAccount,
    mentalDone: !!todaysMentalCheckSource,
    mentalCheck: todaysMentalCheckSource || mentalCheckDraft,
    planSet: !!(activeAccount.dailyPlanTemplate && (activeAccount.dailyPlanTemplate.targetProfit || activeAccount.dailyPlanTemplate.maxLossPerDay)),
    onGo: setActivePage
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "UserCheck",
    className: "h-5 w-5 text-blue-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Your Plan"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "trader's final decision")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 lg:grid-cols-4 gap-3"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Risk Per Trade",
    value: fmt(effectiveRiskPerTrade),
    icon: "Target",
    color: "text-blue-400",
    sub: toleranceIsActive ? "Tolerance (system max " + fmt(riskPerTrade) + ")" : activeCfg.mode + " (" + activeCfg.riskPct * 100 + "%)"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Current Capital (Buffer)",
    value: fmt(Math.max(currentBuffer, 0)),
    icon: "Shield",
    color: activeStatus === 'breached' ? 'text-red-400' : currentBuffer < (parseFloat(activeAccount.maxDrawdown) || 0) * 0.5 ? 'text-yellow-400' : 'text-green-400'
  }), /*#__PURE__*/React.createElement(PersonalPlanStats, {
    account: activeAccount,
    riskPerTrade: effectiveRiskPerTrade,
    totalPnl: totalPnl
  }))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600"
  }, accountsForOverview.length === accounts.filter(function (a) {
    return getAccountStatus(a) !== 'breached';
  }).length ? 'Stats below show all selected accounts, combined.' : 'Stats below show ' + accountsForOverview.length + ' selected account' + (accountsForOverview.length !== 1 ? 's' : '') + ': ' + accountsForOverview.map(function (a) {
    return a.name;
  }).join(', ')), /*#__PURE__*/React.createElement("div", {
    className: "grid xl:grid-cols-2 gap-4 items-start"
  }, /*#__PURE__*/React.createElement(EquityCurveBlock, {
    accounts: accountsForOverview,
    entries: entries
  }), /*#__PURE__*/React.createElement(TradingCalendar, {
    accounts: accountsForOverview,
    entries: entries,
    viewMode: viewMode,
    viewContext: {
      buffer: parseFloat(activeAccount.maxDrawdown) || 0,
      risk: effectiveRiskPerTrade,
      pointValue: activePointValue
    }
  })), /*#__PURE__*/React.createElement(ProStatsPanel, {
    accounts: accountsForOverview,
    entries: entries
  }), /*#__PURE__*/React.createElement("details", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl group"
  }, /*#__PURE__*/React.createElement("summary", {
    className: "cursor-pointer list-none flex items-center justify-between gap-2 p-5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Scale",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-base font-semibold text-white"
  }, "Account Rules & System Limits"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "the maximums set by the system for this account")), /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronDown",
    className: "h-4 w-4 text-gray-500"
  })), /*#__PURE__*/React.createElement("div", {
    className: "px-5 pb-5 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-3"
  }, /*#__PURE__*/React.createElement(MiniStat, {
    label: "Contracts Unlocked (max)",
    value: contractPlan.label,
    color: "text-yellow-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Risk / Trade (max)",
    value: fmt(riskPerTrade),
    color: "text-blue-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Locked Max Stop",
    value: maxStopPoints.toFixed(0) + " pts",
    color: "text-red-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Daily Target (max, 2 wins)",
    value: fmt(riskPerTrade * activeRR * 2),
    color: "text-green-400"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    label: "Max Loss / Day (max)",
    value: fmt(riskPerTrade * 2),
    color: "text-red-400"
  }), /*#__PURE__*/React.createElement(PropFirmRuleStats, {
    account: activeAccount,
    entries: entries
  }), /*#__PURE__*/React.createElement(GeneralPlanStats, {
    account: activeAccount,
    riskPerTrade: riskPerTrade,
    totalPnl: totalPnl,
    avgTradesPerDay: avgTradesPerDay,
    maxTradesInDay: maxTradesInDay
  })), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 border border-gray-800/80 rounded-lg px-3 py-2.5"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 flex items-start gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShieldAlert",
    className: "h-3.5 w-3.5 text-yellow-400 flex-shrink-0 mt-0.5"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-300 font-medium"
  }, "General rule:"), " max ", /*#__PURE__*/React.createElement("span", {
    className: "text-white font-semibold"
  }, "3 trades/day"), ", max ", /*#__PURE__*/React.createElement("span", {
    className: "text-green-400 font-semibold"
  }, "2 wins"), ", max ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-400 font-semibold"
  }, "2 losses"), ". Hit any of those and you're done for the day - no exceptions."))), /*#__PURE__*/React.createElement(PropFirmRuleNote, {
    account: activeAccount,
    entries: entries
  }), /*#__PURE__*/React.createElement(ConsistencyRebalanceWidget, {
    account: activeAccount,
    accountEntries: accountEntries
  }))))), activePage === 'dailyplan' && activeAccount && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-purple-950/40 to-black border border-purple-800/40 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Calendar",
    className: "h-5 w-5 text-purple-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Daily Plan"), toleranceLocked && /*#__PURE__*/React.createElement("span", {
    className: "text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Lock",
    className: "h-3 w-3"
  }), /*#__PURE__*/React.createElement("span", null, "Risk Locked"))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-5"
  }, "Your risk per trade and your plan for the session, in one place. Set your risk tolerance once - it's the amount you can lose per trade without it triggering revenge trading, capped at the system max (", fmt(riskPerTrade), "/trade, see General on Overview) and locked for this account until it passes or fails. Everything below it - target, planned trades, session window - can change as often as you like."), /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1.5"
  }, "Your risk tolerance ($ per trade)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    max: riskPerTrade,
    step: "1",
    value: riskToleranceDraft,
    placeholder: fmt(riskPerTrade) + ' (system max)',
    disabled: toleranceLocked,
    onChange: function (e) {
      setRiskToleranceDraft(e.target.value);
    },
    onBlur: function () {
      if (!toleranceLocked) handleChangeRiskTolerance(riskToleranceDraft);
    },
    onKeyDown: function (e) {
      if (e.key === 'Enter' && !toleranceLocked) {
        handleChangeRiskTolerance(riskToleranceDraft);
        e.target.blur();
      }
    },
    className: "flex-1 bg-black/40 border border-purple-700/40 text-purple-200 text-lg font-semibold rounded-lg px-3 py-2 outline-none focus:border-purple-400/60 num " + (toleranceLocked ? 'opacity-50 cursor-not-allowed' : '')
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      if (!toleranceLocked) handleChangeRiskTolerance(riskToleranceDraft);
    },
    disabled: toleranceLocked,
    className: "bg-purple-500/20 border border-purple-500/40 text-purple-300 px-4 rounded-lg text-sm font-semibold transition flex-shrink-0 " + (toleranceLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500/30')
  }, "Confirm")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600 mt-1.5"
  }, toleranceLocked ? "Locked - it'll unlock automatically once this account passes or fails." : 'Type a number and click Confirm (or press Enter). Clear the field and confirm to go back to the system max.'), riskToleranceStatus && /*#__PURE__*/React.createElement("p", {
    className: "text-xs mt-1.5 font-medium " + (riskToleranceStatus.type === 'error' ? 'text-red-400' : 'text-green-400')
  }, riskToleranceStatus.text), toleranceIsActive ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-purple-300/80 mt-2 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "CheckCircle",
    className: "h-3.5 w-3.5 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, "Active - trading below the system max by choice.")) : /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600 mt-2"
  }, "Not set - currently using the full system max.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 border border-purple-800/30 rounded-lg px-3 py-2.5 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-1"
  }, "Your risk/trade"), /*#__PURE__*/React.createElement("div", {
    className: "num text-lg font-bold text-purple-300"
  }, fmt(effectiveRiskPerTrade))), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 border border-purple-800/30 rounded-lg px-3 py-2.5 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-1"
  }, "Your lot size"), /*#__PURE__*/React.createElement("div", {
    className: "num text-lg font-bold text-purple-300"
  }, effectiveContractLabel)), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 border border-purple-800/30 rounded-lg px-3 py-2.5 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-1"
  }, "Your max loss/day"), /*#__PURE__*/React.createElement("div", {
    className: "num text-lg font-bold text-purple-300"
  }, fmt(effectiveDailyCap))))), /*#__PURE__*/React.createElement("div", {
    className: "h-px bg-gray-800 my-5"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-2 mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500"
  }, "Apply this plan for:"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, [{
    key: 'daily',
    label: 'Every Day'
  }, {
    key: 'weekly',
    label: 'This Week'
  }, {
    key: 'monthly',
    label: 'This Month'
  }, {
    key: 'yearly',
    label: 'This Year'
  }].map(function (c) {
    return /*#__PURE__*/React.createElement("button", {
      key: c.key,
      onClick: function () {
        setDailyPlanCadence(c.key);
      },
      className: "px-3.5 py-1.5 rounded-lg text-xs font-medium border transition " + (dailyPlanCadence === c.key ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200')
    }, c.label);
  }))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600 mb-4"
  }, "Set it once and it pre-fills every new Daily Log entry you add until you change it - so it covers one day, the whole week, the month, or the year, whichever you pick above."), /*#__PURE__*/React.createElement(PlanFieldsGrid, {
    value: dailyPlanTemplateDraft,
    onChange: updateDailyPlanTemplateDraft
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mt-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleSaveDailyPlanTemplate,
    className: "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition"
  }, "Save Daily Plan"), dailyPlanTemplateStatus && /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-medium " + (dailyPlanTemplateStatus.type === 'error' ? 'text-red-400' : 'text-green-400')
  }, dailyPlanTemplateStatus.text))), /*#__PURE__*/React.createElement(PreSessionGoNoGo, {
    accountId: activeAccount.id,
    mentalCheck: mentalCheckDraft
  }), /*#__PURE__*/React.createElement(TradeBudgetReference, {
    buffer: currentBuffer,
    systemMaxRisk: riskPerTrade,
    onApply: handleChangeRiskTolerance,
    locked: toleranceLocked
  })), activePage === 'historicalplan' && activeAccount && /*#__PURE__*/React.createElement(HistoricalPlan, {
    entries: accountEntries
  }), activePage === 'flowstate' && diagnosticReady && !diagnostic && /*#__PURE__*/React.createElement(DisciplineTestGate, null), activePage === 'flowstate' && diagnostic && /*#__PURE__*/React.createElement(FlowStateTraining, {
    uid: user.uid
  }), activePage === 'psychology' && diagnosticReady && !diagnostic && /*#__PURE__*/React.createElement(DisciplineTestGate, null), activePage === 'psychology' && diagnostic && /*#__PURE__*/React.createElement(PsychologyTracker, {
    uid: user.uid,
    accounts: nonPaperAccounts,
    entries: nonPaperEntries
  }), activePage === 'mentalcheck' && diagnosticReady && !diagnostic && /*#__PURE__*/React.createElement(DisciplineTestGate, null), activePage === 'mentalcheck' && diagnostic && activeAccount && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-teal-950/40 to-black border border-teal-800/40 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Brain",
    className: "h-5 w-5 text-teal-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Pre-Session Mental Check")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, todaysEntryForAccount ? "Today's entry is already logged - this updates its mental check directly." : "Fill this out before you start trading today. It'll carry over automatically when you log today's Daily Log entry."), /*#__PURE__*/React.createElement(MentalCheckFields, {
    value: mentalCheckDraft,
    onChange: updateMentalCheckDraft,
    showExtras: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement(MentalReadinessPanel, {
    value: mentalCheckDraft
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mt-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleSaveMentalCheck,
    className: "bg-teal-500/20 border border-teal-500/40 text-teal-300 hover:bg-teal-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition"
  }, "Save Check-In"), mentalCheckStatus && /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-medium " + (mentalCheckStatus.type === 'error' ? 'text-red-400' : 'text-green-400')
  }, mentalCheckStatus.text))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "History",
    className: "h-5 w-5 text-gray-400"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "History")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "The trend over time: market awareness, risk respect, humility and professional mindset, each out of 10."), /*#__PURE__*/React.createElement("div", {
    className: "mb-5"
  }, /*#__PURE__*/React.createElement(MentalInsights, {
    entries: accountEntries
  })), function () {
    const withMc = accountEntries.filter(function (e) {
      return e.mentalCheck && mentalCheckTotal(e.mentalCheck) > 0;
    }).sort(function (a, b) {
      return b.date < a.date ? -1 : 1;
    });
    if (withMc.length === 0) {
      return /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-gray-600 py-6 text-center"
      }, "No mental check-ins logged yet for this account - fill one out next time you add a Daily Log entry.");
    }
    const avg = withMc.reduce(function (s, e) {
      return s + mentalCheckTotal(e.mentalCheck);
    }, 0) / withMc.length;
    const avgColor = avg >= 32 ? 'text-green-400' : avg >= 20 ? 'text-yellow-400' : 'text-red-400';
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"
    }, /*#__PURE__*/React.createElement(MiniStat, {
      label: "Average Score",
      value: avg.toFixed(0) + "/40",
      color: avgColor
    }), /*#__PURE__*/React.createElement(MiniStat, {
      label: "Days Checked In",
      value: String(withMc.length),
      color: "text-blue-400"
    }), /*#__PURE__*/React.createElement(MiniStat, {
      label: "Last Score",
      value: mentalCheckTotal(withMc[0].mentalCheck) + "/40",
      color: "text-purple-400"
    }), /*#__PURE__*/React.createElement(MiniStat, {
      label: "Last Check-In",
      value: withMc[0].date,
      color: "text-gray-400"
    })), /*#__PURE__*/React.createElement("div", {
      className: "overflow-x-auto"
    }, /*#__PURE__*/React.createElement("table", {
      className: "w-full text-xs"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      className: "text-gray-500 border-b border-gray-800"
    }, /*#__PURE__*/React.createElement("th", {
      className: "text-left py-1.5 pr-3"
    }, "Date"), /*#__PURE__*/React.createElement("th", {
      className: "text-left py-1.5 pr-3"
    }, "Market Awareness"), /*#__PURE__*/React.createElement("th", {
      className: "text-left py-1.5 pr-3"
    }, "Risk Respect"), /*#__PURE__*/React.createElement("th", {
      className: "text-left py-1.5 pr-3"
    }, "Humility"), /*#__PURE__*/React.createElement("th", {
      className: "text-left py-1.5 pr-3"
    }, "Mindset"), /*#__PURE__*/React.createElement("th", {
      className: "text-left py-1.5"
    }, "Total"))), /*#__PURE__*/React.createElement("tbody", null, withMc.slice(0, 30).map(function (e) {
      const t = mentalCheckTotal(e.mentalCheck);
      const tc = t >= 32 ? 'text-green-400' : t >= 20 ? 'text-yellow-400' : 'text-red-400';
      return /*#__PURE__*/React.createElement("tr", {
        key: e.id,
        className: "border-b border-gray-900"
      }, /*#__PURE__*/React.createElement("td", {
        className: "py-1.5 pr-3 text-gray-300 num"
      }, e.date), /*#__PURE__*/React.createElement("td", {
        className: "py-1.5 pr-3 text-gray-400 num"
      }, e.mentalCheck.marketAwareness, "/10"), /*#__PURE__*/React.createElement("td", {
        className: "py-1.5 pr-3 text-gray-400 num"
      }, e.mentalCheck.riskRespect, "/10"), /*#__PURE__*/React.createElement("td", {
        className: "py-1.5 pr-3 text-gray-400 num"
      }, e.mentalCheck.humility, "/10"), /*#__PURE__*/React.createElement("td", {
        className: "py-1.5 pr-3 text-gray-400 num"
      }, e.mentalCheck.mindset, "/10"), /*#__PURE__*/React.createElement("td", {
        className: "py-1.5 font-semibold num " + tc
      }, t, "/40"));
    })))));
  }())), activePage === 'history' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-white flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Calendar",
    className: "h-5 w-5 text-yellow-400"
  }), /*#__PURE__*/React.createElement("span", null, "Trade History")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      downloadCSV(toCSV(accountEntries), activeAccount.name + '-trades.csv');
    },
    className: "flex items-center gap-1.5 bg-gray-900 border border-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:border-blue-500/40 hover:text-blue-300 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Download",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Export CSV")), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setNewEntry(emptyEntryForm(effectiveRiskPerTrade, effectiveContracts, activeRR, activeAccount && activeAccount.dailyPlanTemplate, todaysMentalCheckSource));
      setEntryMethod('manual');
      setSaveEntryError('');
      setShowAddEntry(true);
    },
    className: "flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-black px-3 py-1.5 rounded-lg text-sm font-semibold hover:from-green-400 hover:to-emerald-500 transition"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Plus",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Daily Log")))), /*#__PURE__*/React.createElement(ClosedTradesTable, {
    accountEntries: accountEntries
  }), accountEntries.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12 border border-dashed border-gray-800 rounded-xl text-gray-500 text-sm"
  }, "No entries yet.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, accountEntries.slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  }).map(function (entry) {
    if (entry.tradedToday === 'no') {
      const reasonLabel = (NO_TRADE_REASONS.find(function (r) {
        return r.key === entry.noTradeReason;
      }) || {}).label || entry.noTradeReason;
      return /*#__PURE__*/React.createElement("div", {
        key: entry.id,
        className: "bg-gray-900/40 border border-gray-800 rounded-xl p-3 flex items-center justify-between"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2"
      }, /*#__PURE__*/React.createElement("div", {
        className: "w-2 h-2 rounded-full bg-gray-600"
      }), /*#__PURE__*/React.createElement("span", {
        className: "text-white text-sm font-medium"
      }, entry.date), /*#__PURE__*/React.createElement("span", {
        className: "text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-300"
      }, "No Trade - ", reasonLabel)), /*#__PURE__*/React.createElement("button", {
        onClick: function () {
          handleDeleteEntry(entry.id);
        },
        className: "text-xs text-red-400/70 hover:text-red-400"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "Trash2",
        className: "h-3.5 w-3.5"
      })));
    }
    const dayPnl = entry.trades.reduce(function (s, t) {
      return s + tradeSignedPnl(t);
    }, 0);
    const bufferAtDate = bufferHistory.find(function (b) {
      return b.date === entry.date;
    });
    const isExpanded = expandedEntry === entry.id;
    const biasInfo = BIAS_OPTIONS.find(function (b) {
      return b.key === entry.dailyBias;
    }) || BIAS_OPTIONS[2];
    const entryCumBefore = activeAccount.consistencyPct ? getCumulativeProfitBefore(entries, activeAccount.id, entry.date) : 0;
    const entryCap = activeAccount.consistencyPct ? getConsistencyCap(activeAccount, entryCumBefore) : null;
    const entryWithinConsistency = entryCap !== null ? dayPnl <= entryCap : null;
    return /*#__PURE__*/React.createElement("div", {
      key: entry.id,
      className: "bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        setExpandedEntry(isExpanded ? null : entry.id);
      },
      className: "w-full flex items-center justify-between p-3 hover:bg-gray-800/30 transition"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 flex-wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-2 h-2 rounded-full " + (dayPnl >= 0 ? 'bg-green-400' : 'bg-red-400')
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-white text-sm font-medium"
    }, entry.date), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] px-1.5 py-0.5 rounded border " + biasInfo.cls + " flex items-center gap-1"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: biasInfo.icon,
      className: "h-3 w-3"
    }), /*#__PURE__*/React.createElement("span", null, biasInfo.label)), entry.exercised && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 flex items-center gap-1"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Dumbbell",
      className: "h-3 w-3"
    }), /*#__PURE__*/React.createElement("span", null, "Exercised")), entryWithinConsistency !== null && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 " + (entryWithinConsistency ? 'bg-green-500/15 text-green-400 border-green-500/30' : 'bg-red-500/15 text-red-400 border-red-500/30')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: entryWithinConsistency ? "CheckCircle" : "AlertTriangle",
      className: "h-3 w-3"
    }), /*#__PURE__*/React.createElement("span", null, entryWithinConsistency ? 'Within consistency' : 'Over consistency'))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "num font-semibold text-sm " + (dayPnl >= 0 ? 'text-green-400' : 'text-red-400')
    }, dayPnl >= 0 ? '+' : '', fmt(dayPnl)), /*#__PURE__*/React.createElement(Icon, {
      name: isExpanded ? "ChevronUp" : "ChevronDown",
      className: "h-4 w-4 text-gray-500"
    }))), isExpanded && /*#__PURE__*/React.createElement("div", {
      className: "px-3 pb-3 space-y-2 border-t border-gray-800 pt-3"
    }, entry.trades.map(function (t, i) {
      const val = Math.abs(parseFloat(t.pnl) || 0);
      const aligned = biasAligns(entry.dailyBias, t.direction);
      const score = computeTradeAdherence(t, entry, activeAccount);
      const tags = computeTradeTags(t, i, entry.trades, entry, activeAccount);
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "bg-black/30 rounded-lg px-3 py-2 space-y-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center justify-between text-xs flex-wrap gap-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-1.5 flex-wrap"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-gray-400"
      }, "Trade ", i + 1), /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] px-1.5 py-0.5 rounded " + (t.direction === 'long' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400')
      }, t.direction === 'long' ? 'LONG' : 'SHORT'), aligned !== null && /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 " + (aligned ? 'bg-green-500/15 text-green-400' : 'bg-orange-500/15 text-orange-400')
      }, /*#__PURE__*/React.createElement(Icon, {
        name: aligned ? "CheckCircle" : "AlertTriangle",
        className: "h-2.5 w-2.5"
      }), /*#__PURE__*/React.createElement("span", null, aligned ? 'With trend' : 'Against bias')), score !== null && /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] px-1.5 py-0.5 rounded " + (score >= 0.7 ? 'bg-green-500/15 text-green-400' : score >= 0.4 ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400')
      }, (score * 100).toFixed(0), "%")), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2"
      }, /*#__PURE__*/React.createElement("span", {
        className: "font-medium px-1.5 py-0.5 rounded " + (t.result === 'win' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400')
      }, t.result === 'win' ? 'WIN' : 'LOSS'), /*#__PURE__*/React.createElement("span", {
        className: "font-semibold " + (t.result === 'win' ? 'text-green-400' : 'text-red-400')
      }, t.result === 'win' ? '+' : '-', fmt(val)))), (t.positionSize || t.riskAmount) && /*#__PURE__*/React.createElement("p", {
        className: "text-[10px] text-gray-500"
      }, "Size: ", t.positionSize || 'N/A', " - Risked: ", t.riskAmount ? fmt(parseFloat(t.riskAmount)) : 'N/A', " - HTF/LTF: ", t.htfLtf ? 'Yes' : 'No'), t.chartUrl && /*#__PURE__*/React.createElement("a", {
        href: t.chartUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-0.5"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "Link",
        className: "h-2.5 w-2.5"
      }), /*#__PURE__*/React.createElement("span", null, "View chart")), tags.length > 0 && /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-1 flex-wrap pt-0.5"
      }, tags.map(function (tag, ti) {
        const isGood = tag === 'Rules Followed';
        return /*#__PURE__*/React.createElement("span", {
          key: ti,
          className: "text-[9px] px-1.5 py-0.5 rounded-full border " + (isGood ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-orange-500/10 text-orange-300 border-orange-500/30')
        }, tag);
      })));
    }), entry.notes && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-500 italic mt-2"
    }, "\"", entry.notes, "\""), bufferAtDate && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-600 mt-2"
    }, "Buffer after this day: ", /*#__PURE__*/React.createElement("span", {
      className: "text-gray-400"
    }, fmt(bufferAtDate.buffer))), entryCap !== null && /*#__PURE__*/React.createElement("p", {
      className: "text-xs mt-1 " + (entryWithinConsistency ? 'text-gray-500' : 'text-red-400')
    }, "Consistency check: cumulative profit before this day was ", fmt(entryCumBefore), ", so the ", activeAccount.consistencyPct, "% cap for this day was ", fmt(entryCap), " - this day made ", fmt(dayPnl), ", which is ", entryWithinConsistency ? 'within the cap' : 'OVER the cap and would need diluting by future profitable days', "."), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        handleDeleteEntry(entry.id);
      },
      className: "text-xs text-red-400/70 hover:text-red-400 flex items-center gap-1.5 mt-2"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Trash2",
      className: "h-3.5 w-3.5"
    }), /*#__PURE__*/React.createElement("span", null, "Delete entry"))));
  }))), activePage === 'reports' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReportsCard, {
    accounts: accountsForOverview,
    entries: entries
  }), /*#__PURE__*/React.createElement(PerAccountBreakdown, {
    accounts: accounts,
    entries: entries
  })), activePage === 'discipline' && diagnosticReady && !diagnostic && /*#__PURE__*/React.createElement(DisciplineTestGate, null), activePage === 'discipline' && diagnostic && /*#__PURE__*/React.createElement(React.Fragment, null, activeStatus === 'breached' && /*#__PURE__*/React.createElement(BreachReviewCard, {
    account: activeAccount,
    accountEntries: accountEntries,
    bufferHistory: bufferHistory
  }), /*#__PURE__*/React.createElement(DiagnosticResultCard, {
    result: diagnostic
  }), /*#__PURE__*/React.createElement(DisciplineChecklistCard, {
    accounts: nonPaperAccounts,
    entries: nonPaperEntries
  }), /*#__PURE__*/React.createElement(TradeDisciplineTracker, {
    accountEntries: accountEntries
  }), /*#__PURE__*/React.createElement(ReflectionLog, {
    accountEntries: accountEntries
  }), /*#__PURE__*/React.createElement(DisciplineLeaderboard, {
    uid: user.uid,
    currentName: savedName || user.displayName || user.email
  })), activePage === 'finances' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CostsAndPayoutsCard, {
    account: activeAccount,
    status: activeStatus
  }), /*#__PURE__*/React.createElement(PayoutTrackerCard, {
    account: activeAccount,
    entries: entries,
    onSaveRules: handleSavePayoutRules
  }), /*#__PURE__*/React.createElement(PayoutLedger, {
    account: activeAccount,
    onAddPayout: handleAddPayout,
    suggestedAmount: payoutStatus && payoutStatus.eligible ? payoutStatus.requestable : null
  }), /*#__PURE__*/React.createElement(RiskOfRuinCard, {
    currentBuffer: Math.max(currentBuffer, 0),
    divisor: ruinDivisor,
    accountType: activeAccount.accountType
  })), activePage === 'projections' && /*#__PURE__*/React.createElement(ProjectionsCard, {
    account: activeAccount,
    accountEntries: accountEntries,
    defaultRiskPerTrade: effectiveRiskPerTrade
  }), activePage === 'strategy' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement(StrategyCard, {
    account: activeAccount,
    onManage: function () {
      setNewStrategy(emptyStrategyForm);
      setShowManageStrategies(true);
    }
  }), /*#__PURE__*/React.createElement(StrategyBacktestReference, null))))), showAddAccount && /*#__PURE__*/React.createElement(Modal, {
    onClose: function () {
      setShowAddAccount(false);
    },
    title: newAccount.linkedFromId ? "Start Funded Account" : "Add Trading Account",
    size: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1"
  }, "Account Type (Phase)"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, ACCOUNT_TYPES.map(function (t) {
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      onClick: function () {
        setNewAccount(Object.assign({}, newAccount, {
          accountType: t.key,
          linkedFromId: null,
          linkedFromLabel: ''
        }));
      },
      className: "flex-1 py-2.5 rounded-lg text-sm font-medium transition border " + (newAccount.accountType === t.key ? t.activeCls : 'bg-gray-800 text-gray-500 border-gray-700')
    }, t.label);
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mt-1"
  }, PHASE_CONFIG[newAccount.accountType].label, " - ", PHASE_CONFIG[newAccount.accountType].mode, " (", PHASE_CONFIG[newAccount.accountType].riskPct * 100, "% risk)")), (newAccount.accountType === 'funded' || newAccount.accountType === 'live') && /*#__PURE__*/React.createElement(Field, {
    label: "Link to existing " + (newAccount.accountType === 'funded' ? 'Challenge' : 'Funded') + " account (optional)"
  }, /*#__PURE__*/React.createElement("select", {
    value: newAccount.linkedFromId || '',
    onChange: function (e) {
      const id = e.target.value;
      if (!id) {
        setNewAccount(Object.assign({}, newAccount, {
          linkedFromId: null,
          linkedFromLabel: ''
        }));
        return;
      }
      const found = linkableAccounts.find(function (a) {
        return a.id === id;
      });
      setNewAccount(Object.assign({}, newAccount, {
        linkedFromId: id,
        linkedFromLabel: found ? found.name + ' #' + found.accountNumber : ''
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Standalone - already passed elsewhere, just logging it here"), linkableAccounts.map(function (a) {
    return /*#__PURE__*/React.createElement("option", {
      key: a.id,
      value: a.id
    }, a.name, " #", a.accountNumber);
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Account Name"
  }, /*#__PURE__*/React.createElement("input", {
    value: newAccount.name,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        name: e.target.value
      }));
    },
    placeholder: "e.g. Phidias 1",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Starting Balance"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: newAccount.startingBalance,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        startingBalance: e.target.value
      }));
    },
    placeholder: "100000",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Capital / Buffer ($)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: newAccount.maxDrawdown,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        maxDrawdown: e.target.value
      }));
    },
    placeholder: "500",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Drawdown Type"
  }, /*#__PURE__*/React.createElement("select", {
    value: newAccount.drawdownType,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        drawdownType: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  }, DRAWDOWN_TYPES.map(function (dt) {
    return /*#__PURE__*/React.createElement("option", {
      key: dt.key,
      value: dt.key
    }, dt.label);
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Market"
  }, /*#__PURE__*/React.createElement("select", {
    value: newAccount.market,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        market: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  }, MARKET_OPTIONS.map(function (m) {
    return /*#__PURE__*/React.createElement("option", {
      key: m.key,
      value: m.key
    }, m.label);
  })))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Profit Target ($)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: newAccount.profitTarget,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        profitTarget: e.target.value
      }));
    },
    placeholder: "1500",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Reward:Risk Ratio (min " + MIN_RR + ":1)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.1",
    min: MIN_RR,
    value: newAccount.rewardRatio,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        rewardRatio: e.target.value
      }));
    },
    placeholder: "2.5",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  }), parseFloat(newAccount.rewardRatio) < MIN_RR && newAccount.rewardRatio !== '' && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-red-400 mt-1"
  }, "Below minimum - will be locked to ", MIN_RR, ":1 on save."))), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 bg-black/40 border border-gray-800 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-gray-400"
  }, "Phase: ", /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-400 font-medium"
  }, newAccountPreviewCfg.label)), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-400"
  }, "Mode: ", /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-400 font-medium"
  }, newAccountPreviewCfg.mode, " (", newAccountPreviewCfg.riskPct * 100, "%)")), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-400"
  }, "Locked Max Stop: ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-400 font-medium"
  }, newAccountMaxStop.toFixed(0), " points")), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-400"
  }, "RR Target: ", /*#__PURE__*/React.createElement("span", {
    className: "text-purple-400 font-medium"
  }, Math.max(parseFloat(newAccount.rewardRatio) || MIN_RR, MIN_RR), ":1"))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-gray-800 pt-4 space-y-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-yellow-400 font-medium flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShieldAlert",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Prop Firm Rules (optional - leave blank if the firm has none)")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Consistency Rule (%)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: newAccount.consistencyPct,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        consistencyPct: e.target.value
      }));
    },
    placeholder: "e.g. 40 - leave blank if none",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Min Trading Days"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: newAccount.minTradingDays,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        minTradingDays: e.target.value
      }));
    },
    placeholder: "e.g. 4 - leave blank if none",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Daily Loss Limit ($)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: newAccount.dailyLossLimit,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        dailyLossLimit: e.target.value
      }));
    },
    placeholder: "e.g. 1000 - leave blank if none",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  }))), newAccount.dailyLossLimit && /*#__PURE__*/React.createElement(Field, {
    label: "Daily Loss Limit Type"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setNewAccount(Object.assign({}, newAccount, {
        dllType: 'hard'
      }));
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border " + (newAccount.dllType === 'hard' ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, "Hard Breach (account terminated)"), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setNewAccount(Object.assign({}, newAccount, {
        dllType: 'soft'
      }));
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border " + (newAccount.dllType === 'soft' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, "Soft Breach (flatten & lock)"))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Consistency rule caps how much of your total profit any single day can represent - checked at payout time. Daily Loss Limit is separate from your Capital and resets every day.")), newAccount.accountType !== 'challenge' && /*#__PURE__*/React.createElement("div", {
    className: "border-t border-gray-800 pt-4 space-y-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-yellow-400 font-medium flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Calendar",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Payout Rules (optional - can also be set later on the Finances tab)")), /*#__PURE__*/React.createElement(PayoutTypeSelector, {
    value: newAccount.payoutType || 'simple',
    onChange: function (t) {
      setNewAccount(Object.assign({}, newAccount, {
        payoutType: t
      }));
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, (PAYOUT_TYPES.find(function (t) {
    return t.key === (newAccount.payoutType || 'simple');
  }) || {}).desc), /*#__PURE__*/React.createElement(PayoutTypeFieldset, {
    type: newAccount.payoutType || 'simple',
    get: function (field) {
      return newAccount[field];
    },
    set: function (field, value) {
      setNewAccount(Object.assign({}, newAccount, {
        [field]: value
      }));
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-gray-800 pt-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-yellow-400 font-medium mb-2 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Receipt",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Costs")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-3"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Challenge Cost ($)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: newAccount.accountCost,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        accountCost: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Activation Cost ($)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: newAccount.activationCost,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        activationCost: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Reset Cost ($)"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: newAccount.resetCost,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        resetCost: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })))), /*#__PURE__*/React.createElement(Field, {
    label: "Master / Copied Account Number (optional)"
  }, /*#__PURE__*/React.createElement("input", {
    value: newAccount.copiedAccountNumber,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        copiedAccountNumber: e.target.value
      }));
    },
    placeholder: "If copying a master account",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: handleAddAccount,
    disabled: !newAccount.name || !newAccount.startingBalance || !newAccount.maxDrawdown,
    className: "w-full bg-gradient-to-r from-green-500 to-emerald-600 text-black py-2.5 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Save",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Save Account")))), showManageStrategies && activeAccount && /*#__PURE__*/React.createElement(Modal, {
    onClose: function () {
      setShowManageStrategies(false);
    },
    title: "Manage Strategies",
    size: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-400 mb-2"
  }, "Existing strategies"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, getStrategies(activeAccount).map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      className: "bg-black/30 border border-gray-800 rounded-lg p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-white font-medium text-sm"
    }, s.name), s.id !== 'default' && /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        handleDeleteStrategy(s.id);
      },
      className: "text-red-400/70 hover:text-red-400"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Trash2",
      className: "h-3.5 w-3.5"
    }))), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-500 mt-1"
    }, (s.longRules || []).filter(function (r) {
      return r && r.trim();
    }).length, " long rule(s) - ", (s.shortRules || []).filter(function (r) {
      return r && r.trim();
    }).length, " short rule(s)"));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-gray-800 pt-4 space-y-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-yellow-400 font-medium"
  }, "Add a new strategy"), /*#__PURE__*/React.createElement(Field, {
    label: "Strategy Name"
  }, /*#__PURE__*/React.createElement("input", {
    value: newStrategy.name,
    onChange: function (e) {
      setNewStrategy(Object.assign({}, newStrategy, {
        name: e.target.value
      }));
    },
    placeholder: "e.g. Reversal Scalp",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm text-green-400 mb-1.5 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "TrendingUp",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Long Setup Rules")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, newStrategy.longRules.map(function (rule, idx) {
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("input", {
      value: rule,
      onChange: function (e) {
        updateStrategyRuleRow('longRules', idx, e.target.value);
      },
      placeholder: "Rule " + (idx + 1),
      className: "flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
    }), newStrategy.longRules.length > 1 && /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        removeStrategyRuleRow('longRules', idx);
      },
      className: "text-gray-500 hover:text-red-400 flex-shrink-0"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "X",
      className: "h-3.5 w-3.5"
    })));
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      addStrategyRuleRow('longRules');
    },
    className: "text-xs text-green-400 hover:text-green-300 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Plus",
    className: "h-3 w-3"
  }), /*#__PURE__*/React.createElement("span", null, "Add rule")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm text-red-400 mb-1.5 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "TrendingDown",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Short Setup Rules")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, newStrategy.shortRules.map(function (rule, idx) {
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("input", {
      value: rule,
      onChange: function (e) {
        updateStrategyRuleRow('shortRules', idx, e.target.value);
      },
      placeholder: "Rule " + (idx + 1),
      className: "flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
    }), newStrategy.shortRules.length > 1 && /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        removeStrategyRuleRow('shortRules', idx);
      },
      className: "text-gray-500 hover:text-red-400 flex-shrink-0"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "X",
      className: "h-3.5 w-3.5"
    })));
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      addStrategyRuleRow('shortRules');
    },
    className: "text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Plus",
    className: "h-3 w-3"
  }), /*#__PURE__*/React.createElement("span", null, "Add rule"))))), /*#__PURE__*/React.createElement("button", {
    onClick: handleAddStrategy,
    disabled: !newStrategy.name.trim(),
    className: "w-full bg-gradient-to-r from-green-500 to-emerald-600 text-black py-2.5 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Save",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Add Strategy"))))), showInstall && /*#__PURE__*/React.createElement(InstallAppModal, {
    onClose: function () {
      setShowInstall(false);
    }
  }), showDupeCleanup && activeAccount && /*#__PURE__*/React.createElement(DupeCleanupModal, {
    accountEntries: accountEntries,
    entriesRef: entriesRef,
    onClose: function () {
      setShowDupeCleanup(false);
    }
  }), showImportBroker && activeAccount && /*#__PURE__*/React.createElement(Modal, {
    onClose: function () {
      setShowImportBroker(false);
    },
    title: "Import Trades (CSV)",
    size: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-200 space-y-1"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "text-white font-medium"
  }, "Tradovate:"), " Reports ", '>', " Performance (recommended - already matched entry to exit) or Reports ", '>', " Orders (reconstructed from raw fills using verified CME point values for ES/MES, NQ/MNQ, RTY/M2K, YM/MYM, GC/MGC, SI/SIL, and CL/MCL). Either file is auto-detected."), /*#__PURE__*/React.createElement("p", {
    className: "text-blue-300/70"
  }, "Any other platform: NinjaTrader, TopstepX, ProjectX, MT4/5, ThinkOrSwim and most others export a closed-trade history CSV with a date column and a P&L column per trade - upload it as-is and it's matched by column name automatically. Whatever the exchange rate or point value already baked into that P&L figure is what gets imported as-is."), /*#__PURE__*/React.createElement("p", {
    className: "text-blue-300/70"
  }, "If the export doesn't include commissions, enter your round-turn rate below and it'll be subtracted per contract, so every number here reflects what you actually kept.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Commission per contract, round-turn ($)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    step: "0.01",
    placeholder: "e.g. 1.30 - check your broker's fee schedule",
    value: brokerCommission,
    onChange: function (e) {
      handleBrokerCommissionChange(e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400/50 outline-none"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-600 mt-1"
  }, "Leave blank or 0 if you're not sure, or if the P&L column is already net - you can re-enter this after uploading and the preview below updates automatically.")), !brokerImportPreview && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Trade History CSV"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".csv",
    onChange: function (e) {
      handleBrokerFileSelect(e.target.files[0]);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-700 file:text-gray-300"
  })), brokerImportError && /*#__PURE__*/React.createElement("div", {
    className: "bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-300"
  }, brokerImportError), brokerImportPreview && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 rounded-lg p-3 text-sm"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-white font-medium mb-1"
  }, brokerImportPreview.totalTrades, " trade", brokerImportPreview.totalTrades !== 1 ? 's' : '', " found across ", Object.keys(brokerImportPreview.byDate).length, " day", Object.keys(brokerImportPreview.byDate).length !== 1 ? 's' : ''), brokerImportPreview.skipped > 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-yellow-400"
  }, brokerImportPreview.skipped, " trade", brokerImportPreview.skipped !== 1 ? 's' : '', " skipped - unrecognized contract, couldn't price."), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mt-1"
  }, "Added as new daily log entries with bias set to Neutral (edit any day afterward if needed). A day that already has entries for ", /*#__PURE__*/React.createElement("span", {
    className: "text-white"
  }, activeAccount.name), " gets fully replaced, not duplicated.")), /*#__PURE__*/React.createElement("div", {
    className: "max-h-48 overflow-y-auto space-y-1.5"
  }, Object.keys(brokerImportPreview.byDate).sort().map(function (date) {
    const dayTrades = brokerImportPreview.byDate[date];
    const dayPnl = dayTrades.reduce(function (s, t) {
      return s + t.pnl;
    }, 0);
    const willOverwrite = accountEntries.some(function (e) {
      return e.date === date;
    });
    return /*#__PURE__*/React.createElement("div", {
      key: date,
      className: "flex items-center justify-between text-xs bg-black/30 rounded-lg px-3 py-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-gray-300"
    }, date, willOverwrite && /*#__PURE__*/React.createElement("span", {
      className: "text-yellow-400 ml-1.5"
    }, "(overwrites existing)")), /*#__PURE__*/React.createElement("span", {
      className: "text-gray-500"
    }, dayTrades.length, " trade", dayTrades.length !== 1 ? 's' : ''), /*#__PURE__*/React.createElement("span", {
      className: "num font-semibold " + (dayPnl >= 0 ? 'text-green-400' : 'text-red-400')
    }, fmt(dayPnl)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setBrokerImportPreview(null);
    },
    className: "flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-700 transition"
  }, "Choose Different File"), /*#__PURE__*/React.createElement("button", {
    onClick: handleConfirmBrokerImport,
    disabled: brokerImportBusy,
    className: "flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-black py-2.5 rounded-lg font-semibold disabled:opacity-40 flex items-center justify-center gap-1.5"
  }, brokerImportBusy ? /*#__PURE__*/React.createElement("span", null, "Importing...") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "Upload",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Confirm Import"))))))), showAddEntry && activeAccount && /*#__PURE__*/React.createElement(Modal, {
    onClose: function () {
      setShowAddEntry(false);
    },
    title: "Log Today's Trades",
    size: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Entry Method"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setEntryMethod('manual');
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-1.5 " + (entryMethod === 'manual' ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "PenLine",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Manual Entry")), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setEntryMethod('csv');
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-1.5 " + (entryMethod === 'csv' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Upload",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Import CSV")))), entryMethod === 'csv' ? /*#__PURE__*/React.createElement(CsvImportFields, {
    account: activeAccount,
    entriesRef: entriesRef,
    onDone: function () {
      setShowAddEntry(false);
    }
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Field, {
    label: "Date"
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: newEntry.date,
    onChange: function (e) {
      setNewEntry(Object.assign({}, newEntry, {
        date: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Did you trade today?"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setNewEntry(Object.assign({}, newEntry, {
        tradedToday: 'yes'
      }));
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border " + (newEntry.tradedToday === 'yes' ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, "Yes"), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setNewEntry(Object.assign({}, newEntry, {
        tradedToday: 'no'
      }));
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border " + (newEntry.tradedToday === 'no' ? 'bg-gray-500/30 text-gray-300 border-gray-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, "No"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Physical exercise today?"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setNewEntry(Object.assign({}, newEntry, {
        exercised: true
      }));
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-1.5 " + (newEntry.exercised ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Dumbbell",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Yes")), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setNewEntry(Object.assign({}, newEntry, {
        exercised: false
      }));
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border " + (!newEntry.exercised ? 'bg-gray-500/30 text-gray-300 border-gray-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, "No"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/30 border border-gray-800 rounded-lg px-3 py-2.5 flex items-start gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Info",
    className: "h-3.5 w-3.5 text-gray-500 flex-shrink-0 mt-0.5"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Your pre-session mental check ", mentalCheckTotal(newEntry.mentalCheck) > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "text-teal-400 font-medium"
  }, "(", mentalCheckTotal(newEntry.mentalCheck), "/40, already set)") : /*#__PURE__*/React.createElement("span", null, "(not set yet)"), " and Daily Plan ", newEntry.dailyPlan.riskAmount || newEntry.dailyPlan.targetProfit ? /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-400 font-medium"
  }, "(set)") : /*#__PURE__*/React.createElement("span", null, "(not set)"), " now live on their own pages in the menu - this entry will pick up whatever's saved there for today.")), /*#__PURE__*/React.createElement(ReflectionSection, {
    value: newEntry.reflection,
    onChange: updateReflection
  }), newEntry.tradedToday === 'no' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Reason"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, NO_TRADE_REASONS.map(function (r) {
    return /*#__PURE__*/React.createElement("button", {
      key: r.key,
      onClick: function () {
        setNewEntry(Object.assign({}, newEntry, {
          noTradeReason: r.key
        }));
      },
      className: "py-2 rounded-lg text-xs font-medium border " + (newEntry.noTradeReason === r.key ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
    }, r.label);
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "How was your day? (thoughts, emotions, anything on your mind)"
  }, /*#__PURE__*/React.createElement("textarea", {
    value: newEntry.noTradeNotes,
    onChange: function (e) {
      setNewEntry(Object.assign({}, newEntry, {
        noTradeNotes: e.target.value
      }));
    },
    placeholder: "Frustrated I didn't find a setup, but glad I didn't force a trade...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 h-16 focus:border-yellow-400/50 outline-none resize-none"
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShieldCheck",
    className: "h-3.5 w-3.5 text-green-400 flex-shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, "Logging today - even a no-trade day - still counts toward your discipline score.")), saveEntryError && /*#__PURE__*/React.createElement("p", {
    className: "text-red-400 text-xs"
  }, saveEntryError), /*#__PURE__*/React.createElement("button", {
    onClick: handleSaveEntry,
    disabled: !newEntry.noTradeReason,
    className: "w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Save",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Save No-Trade Day"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Field, {
    label: "Strategy used today"
  }, /*#__PURE__*/React.createElement("select", {
    value: newEntry.strategyId || 'default',
    onChange: function (e) {
      setNewEntry(Object.assign({}, newEntry, {
        strategyId: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  }, getStrategies(activeAccount).map(function (s) {
    return /*#__PURE__*/React.createElement("option", {
      key: s.id,
      value: s.id
    }, s.name);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Daily Bias (which way is the trend?)"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, BIAS_OPTIONS.map(function (b) {
    return /*#__PURE__*/React.createElement("button", {
      key: b.key,
      onClick: function () {
        setNewEntry(Object.assign({}, newEntry, {
          dailyBias: b.key
        }));
      },
      className: "flex-1 py-2 rounded-lg text-sm font-medium transition border flex items-center justify-center gap-1.5 " + (newEntry.dailyBias === b.key ? b.cls : 'bg-gray-800 text-gray-500 border-gray-700')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: b.icon,
      className: "h-3.5 w-3.5"
    }), /*#__PURE__*/React.createElement("span", null, b.label));
  }))), /*#__PURE__*/React.createElement(DailyTradeMatrix, {
    riskUnit: effectiveRiskPerTrade,
    rewardRatio: activeRR
  }), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-sm text-gray-400"
  }, "Trades"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "Risk: ", /*#__PURE__*/React.createElement("span", {
    className: "text-blue-400 font-medium"
  }, fmt(effectiveRiskPerTrade)), " - ", effectiveContractLabel, " (", activeTicker, ") - Max stop: ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-400 font-medium"
  }, maxStopPoints.toFixed(0), " pts"))), newEntry.trades.map(function (trade, idx) {
    const applicableRules = rulesForDirection(trade.direction);
    const aligned = biasAligns(newEntry.dailyBias, trade.direction);
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "bg-gray-800/40 border border-gray-700 rounded-lg p-3 space-y-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 flex-wrap"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'direction', 'long');
      },
      className: "px-2.5 py-1.5 rounded-lg text-xs font-medium transition " + (trade.direction === 'long' ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-gray-800 text-gray-500 border border-gray-700')
    }, "Long"), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'direction', 'short');
      },
      className: "px-2.5 py-1.5 rounded-lg text-xs font-medium transition " + (trade.direction === 'short' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-gray-800 text-gray-500 border border-gray-700')
    }, "Short"), aligned !== null && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] px-2 py-1 rounded flex items-center gap-1 " + (aligned ? 'bg-green-500/15 text-green-400' : 'bg-orange-500/15 text-orange-400')
    }, /*#__PURE__*/React.createElement(Icon, {
      name: aligned ? "CheckCircle" : "AlertTriangle",
      className: "h-2.5 w-2.5"
    }), /*#__PURE__*/React.createElement("span", null, aligned ? 'With trend' : 'Against bias'))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'result', 'win');
      },
      className: "px-3 py-2 rounded-lg text-sm font-medium transition " + (trade.result === 'win' ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-gray-800 text-gray-500 border border-gray-700')
    }, "Win"), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'result', 'loss');
      },
      className: "px-3 py-2 rounded-lg text-sm font-medium transition " + (trade.result === 'loss' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-gray-800 text-gray-500 border border-gray-700')
    }, "Loss"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      placeholder: "P&L amount",
      value: trade.pnl,
      onChange: function (e) {
        updateTradeRow(idx, 'pnl', e.target.value);
      },
      className: "flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
    }), newEntry.trades.length > 1 && /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        removeTradeRow(idx);
      },
      className: "text-gray-500 hover:text-red-400 flex-shrink-0"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "X",
      className: "h-4 w-4"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-2"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      placeholder: "Contracts",
      value: trade.positionSize,
      onChange: function (e) {
        updateTradeRow(idx, 'positionSize', e.target.value);
      },
      className: "bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400/50 outline-none"
    }), /*#__PURE__*/React.createElement("input", {
      type: "number",
      placeholder: "$ Risked on this trade",
      value: trade.riskAmount,
      onChange: function (e) {
        updateTradeRow(idx, 'riskAmount', e.target.value);
      },
      className: "bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400/50 outline-none"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'htfLtf', !trade.htfLtf);
      },
      className: "w-full flex items-center gap-2 text-left text-xs text-gray-300 hover:text-white"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: trade.htfLtf ? "CheckSquare" : "Square",
      className: "h-4 w-4 flex-shrink-0 " + (trade.htfLtf ? 'text-green-400' : 'text-gray-600')
    }), /*#__PURE__*/React.createElement("span", null, "HTF to LTF analysis done before this trade?")), /*#__PURE__*/React.createElement("div", {
      className: "bg-black/30 rounded-lg p-2.5 space-y-2"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-gray-500 uppercase tracking-wide"
    }, "What happened to your stop-loss?"), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'stopHandling', 'respected');
      },
      className: "flex-1 py-1.5 rounded-lg text-[11px] font-medium border " + ((trade.stopHandling || 'respected') === 'respected' ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
    }, "Respected"), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'stopHandling', 'widened');
      },
      className: "flex-1 py-1.5 rounded-lg text-[11px] font-medium border " + (trade.stopHandling === 'widened' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
    }, "Widened"), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'stopHandling', 'removed');
      },
      className: "flex-1 py-1.5 rounded-lg text-[11px] font-medium border " + (trade.stopHandling === 'removed' ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
    }, "Removed")), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'revengeEntry', !trade.revengeEntry);
      },
      className: "w-full flex items-center gap-2 text-left text-xs text-gray-300 hover:text-white pt-0.5"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: trade.revengeEntry ? "CheckSquare" : "Square",
      className: "h-4 w-4 flex-shrink-0 " + (trade.revengeEntry ? 'text-red-400' : 'text-gray-600')
    }), /*#__PURE__*/React.createElement("span", null, "Revenge entry - reacting to an earlier loss today, not the setup?"))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Link",
      className: "h-3.5 w-3.5 text-gray-500 flex-shrink-0"
    }), /*#__PURE__*/React.createElement("input", {
      type: "url",
      placeholder: "TradingView chart link (optional)",
      value: trade.chartUrl || '',
      onChange: function (e) {
        updateTradeRow(idx, 'chartUrl', e.target.value);
      },
      className: "flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-xs focus:border-yellow-400/50 outline-none"
    })), applicableRules.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "bg-black/30 rounded-lg p-2.5 space-y-1.5"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-gray-500 uppercase tracking-wide"
    }, "Did you follow your ", trade.direction, " rules?"), applicableRules.map(function (rule, ri) {
      const checked = (trade.rulesChecked || []).indexOf(rule) !== -1;
      return /*#__PURE__*/React.createElement("button", {
        key: ri,
        onClick: function () {
          toggleRuleChecked(idx, rule);
        },
        className: "w-full flex items-center gap-2 text-left text-xs text-gray-300 hover:text-white"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: checked ? "CheckSquare" : "Square",
        className: "h-4 w-4 flex-shrink-0 " + (checked ? 'text-green-400' : 'text-gray-600')
      }), /*#__PURE__*/React.createElement("span", null, rule));
    })));
  }), filledLosses >= 2 && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-red-400 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "AlertTriangle",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Circuit Breaker - 2 losses. Day over.")), filledWins >= 2 && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-green-400 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "CheckCircle",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Greed Filter - 2 wins. Day over.")), isTie && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-yellow-400 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Scale",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Tie-Breaker required - Trade 3 is mandatory before you can save today's log.")), filledTrades.length >= 3 && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400"
  }, "Day over - Trade 3 result stands."), consistencyCap !== null && filledPnlSigned > 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-xs flex items-center gap-1.5 " + (overConsistency ? 'text-red-400' : 'text-gray-400')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: overConsistency ? "AlertTriangle" : "Info",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Today: ", fmt(filledPnlSigned), " of ", fmt(consistencyCap), " max allowed under your ", activeAccount.consistencyPct, "% consistency rule", overConsistency ? ' - exceeded, this day will need diluting by future profitable days' : '', ".")), dllLimit !== null && /*#__PURE__*/React.createElement("p", {
    className: "text-xs flex items-center gap-1.5 " + (dllBreached ? 'text-red-400' : 'text-gray-400')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: dllBreached ? "AlertTriangle" : "Info",
    className: "h-3.5 w-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Daily Loss Limit: ", fmt(todaysLoss), " of ", fmt(dllLimit), dllBreached ? activeAccount.dllType === 'hard' ? ' - HARD BREACH, this would terminate the account' : ' - SOFT BREACH, firm would flatten and lock you out today' : '', ".")), /*#__PURE__*/React.createElement("button", {
    onClick: addTradeRow,
    disabled: newEntry.trades.length >= 3 || filledWins >= 2 || filledLosses >= 2 || dllBreached,
    className: "text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1.5 mt-1 disabled:opacity-30 disabled:cursor-not-allowed"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Plus",
    className: "h-3 w-3"
  }), /*#__PURE__*/React.createElement("span", null, "Add another trade"))), /*#__PURE__*/React.createElement(Field, {
    label: "How was your day? (thoughts, emotions, anything on your mind)"
  }, /*#__PURE__*/React.createElement("textarea", {
    value: newEntry.notes,
    onChange: function (e) {
      setNewEntry(Object.assign({}, newEntry, {
        notes: e.target.value
      }));
    },
    placeholder: "How did it feel taking these trades? Any pressure, doubt, confidence...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 h-20 focus:border-yellow-400/50 outline-none resize-none"
  })), saveEntryError && /*#__PURE__*/React.createElement("p", {
    className: "text-red-400 text-xs"
  }, saveEntryError), /*#__PURE__*/React.createElement("button", {
    onClick: handleSaveEntry,
    disabled: filledTrades.length === 0 || isTie,
    className: "w-full bg-gradient-to-r from-green-500 to-emerald-600 text-black py-2.5 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Save",
    className: "h-4 w-4"
  }), /*#__PURE__*/React.createElement("span", null, "Save Entry")))))));
}
function StatCard(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500"
  }, props.label), /*#__PURE__*/React.createElement("div", {
    className: "h-7 w-7 rounded-full flex items-center justify-center bg-current/10 flex-shrink-0 " + props.color
  }, /*#__PURE__*/React.createElement(Icon, {
    name: props.icon,
    className: "h-3.5 w-3.5 " + props.color
  }))), /*#__PURE__*/React.createElement("div", {
    className: "num text-2xl font-bold " + props.color
  }, props.value), props.sub && /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-600 mt-1"
  }, props.sub));
}
function Modal(props) {
  const size = props.size || 'md';
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black bg-opacity-80",
    onClick: props.onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative bg-black border border-yellow-500/20 rounded-2xl p-6 w-full " + (size === 'lg' ? 'max-w-lg' : 'max-w-md') + " max-h-[90vh] overflow-y-auto shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-5"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-white"
  }, props.title), /*#__PURE__*/React.createElement("button", {
    onClick: props.onClose,
    className: "text-gray-500 hover:text-white flex-shrink-0"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "X",
    className: "h-5 w-5"
  }))), props.children));
}
function Field(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1"
  }, props.label), props.children);
}
function App() {
  const [user, setUser] = useState(undefined);
  const [language, setLanguage] = useState(function () {
    try {
      return localStorage.getItem('mmm-language') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  // The homepage/diagnostic test link to the course as journal/?course=1 so
  // the course sits behind a free account instead of being open to anyone -
  // once a signed-in user carries that flag, send them straight to it.
  const wantsCourse = function () {
    try {
      return new URLSearchParams(window.location.search).get('course') === '1';
    } catch (e) {
      return false;
    }
  }();
  const wantsDiagnostic = function () {
    try {
      return new URLSearchParams(window.location.search).get('diagnostic') === '1';
    } catch (e) {
      return false;
    }
  }();
  const wantsSignup = function () {
    try {
      return new URLSearchParams(window.location.search).get('mode') === 'signup';
    } catch (e) {
      return false;
    }
  }();
  useEffect(function () {
    const unsub = auth.onAuthStateChanged(function (u) {
      setUser(u);
    });
    return unsub;
  }, []);
  useEffect(function () {
    try {
      localStorage.setItem('mmm-language', language);
    } catch (e) {}
    applyTranslation(language);
    const root = document.getElementById('root');
    if (!root) return;
    const observer = new MutationObserver(function () {
      applyTranslation(language);
    });
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true
    });
    return function () {
      observer.disconnect();
    };
  }, [language, user]);
  useEffect(function () {
    if (user && wantsCourse) window.location.href = 'course/index.html';
  }, [user, wantsCourse]);
  if (user === undefined) return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-black flex items-center justify-center text-yellow-400"
  }, "Loading...");
  if (user && wantsCourse) return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-black flex items-center justify-center text-yellow-400"
  }, "Taking you to the course...");
  return user ? /*#__PURE__*/React.createElement(MMMJournal, {
    user: user,
    language: language,
    setLanguage: setLanguage,
    wantsDiagnostic: wantsDiagnostic
  }) : /*#__PURE__*/React.createElement(AuthScreen, {
    language: language,
    setLanguage: setLanguage,
    wantsCourse: wantsCourse,
    wantsSignup: wantsSignup,
    fromDiagnostic: wantsDiagnostic
  });
}
const rootEl = ReactDOM.createRoot(document.getElementById('root'));
rootEl.render(/*#__PURE__*/React.createElement(App, null));