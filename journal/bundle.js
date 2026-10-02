const {
  useState,
  useEffect
} = React;
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
  return React.createElement("span", {
    ref: ref,
    className: "inline-flex items-center justify-center flex-shrink-0 " + (className || '')
  });
};
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
  code: 'pt',
  label: 'Português'
}, {
  code: 'de',
  label: 'Deutsch'
}, {
  code: 'ht',
  label: 'Kreyòl Ayisyen'
}];
const TRANSLATIONS = {
  "MMM Pro Journal": {
    fr: "Journal MMM Pro",
    es: "Diario MMM Pro",
    ht: "Jounal MMM Pro",
    pt: "Diário MMM Pro",
    de: "MMM Pro Journal"
  },
  "Sign in to your account": {
    fr: "Connectez-vous à votre compte",
    es: "Inicia sesión en tu cuenta",
    ht: "Konekte sou kont ou",
    pt: "Entre na sua conta",
    de: "In dein Konto einloggen"
  },
  "Create your account": {
    fr: "Créez votre compte",
    es: "Crea tu cuenta",
    ht: "Kreye kont ou",
    pt: "Crie sua conta",
    de: "Konto erstellen"
  },
  "Your name": {
    fr: "Votre nom",
    es: "Tu nombre",
    ht: "Non ou",
    pt: "Seu nome",
    de: "Dein Name"
  },
  "Email": {
    fr: "E-mail",
    es: "Correo electrónico",
    ht: "Imel",
    pt: "E-mail",
    de: "E-Mail"
  },
  "Password": {
    fr: "Mot de passe",
    es: "Contraseña",
    ht: "Modpas",
    pt: "Senha",
    de: "Passwort"
  },
  "Sign In": {
    fr: "Se connecter",
    es: "Iniciar sesión",
    ht: "Konekte",
    pt: "Entrar",
    de: "Anmelden"
  },
  "Create Account": {
    fr: "Créer un compte",
    es: "Crear cuenta",
    ht: "Kreye kont",
    pt: "Criar conta",
    de: "Konto erstellen"
  },
  "Please wait...": {
    fr: "Veuillez patienter...",
    es: "Espera por favor...",
    ht: "Tanpri tann...",
    pt: "Aguarde...",
    de: "Bitte warten..."
  },
  "Sign up": {
    fr: "S'inscrire",
    es: "Regístrate",
    ht: "Enskri",
    pt: "Cadastre-se",
    de: "Registrieren"
  },
  "Sign in": {
    fr: "Se connecter",
    es: "Inicia sesión",
    ht: "Konekte",
    pt: "Entrar",
    de: "Anmelden"
  },
  "Don't have an account?": {
    fr: "Vous n'avez pas de compte ?",
    es: "¿No tienes una cuenta?",
    ht: "Ou pa gen kont?",
    pt: "Não tem uma conta?",
    de: "Noch kein Konto?"
  },
  "Already have an account?": {
    fr: "Vous avez déjà un compte ?",
    es: "¿Ya tienes una cuenta?",
    ht: "Ou gen kont deja?",
    pt: "Já tem uma conta?",
    de: "Bereits ein Konto?"
  },
  "Forgot password?": {
    fr: "Mot de passe oublié ?",
    es: "¿Olvidaste tu contraseña?",
    ht: "Ou bliye modpas ou?",
    pt: "Esqueceu a senha?",
    de: "Passwort vergessen?"
  },
  "Sign out": {
    fr: "Se déconnecter",
    es: "Cerrar sesión",
    ht: "Dekonekte",
    pt: "Sair",
    de: "Abmelden"
  },
  "Loading...": {
    fr: "Chargement...",
    es: "Cargando...",
    ht: "Ap chaje...",
    pt: "Carregando...",
    de: "Wird geladen..."
  },
  "Edit display name": {
    fr: "Modifier le nom affiché",
    es: "Editar nombre visible",
    ht: "Chanje non ki afiche",
    pt: "Editar nome de exibição",
    de: "Anzeigename bearbeiten"
  },
  "Active Only": {
    fr: "Actifs uniquement",
    es: "Solo activos",
    ht: "Sèlman aktif",
    pt: "Somente ativos",
    de: "Nur aktive"
  },
  "All Accounts": {
    fr: "Tous les comptes",
    es: "Todas las cuentas",
    ht: "Tout kont",
    pt: "Todas as contas",
    de: "Alle Konten"
  },
  "Add Account": {
    fr: "Ajouter un compte",
    es: "Agregar cuenta",
    ht: "Ajoute yon kont",
    pt: "Adicionar conta",
    de: "Konto hinzufügen"
  },
  "Daily Log": {
    fr: "Journal quotidien",
    es: "Registro diario",
    ht: "Jounal chak jou",
    pt: "Registro diário",
    de: "Tageseintrag"
  },
  "Export CSV": {
    fr: "Exporter CSV",
    es: "Exportar CSV",
    ht: "Ekspòte CSV",
    pt: "Exportar CSV",
    de: "CSV exportieren"
  },
  "Start: ": {
    fr: "Début : ",
    es: "Inicio: ",
    ht: "Kòmansman: ",
    pt: "Início: ",
    de: "Start: "
  },
  "Target: ": {
    fr: "Objectif : ",
    es: "Objetivo: ",
    ht: "Objektif: ",
    pt: "Meta: ",
    de: "Ziel: "
  },
  "Active Strategy": {
    fr: "Stratégie active",
    es: "Estrategia activa",
    ht: "Estrateji aktif",
    pt: "Estratégia ativa",
    de: "Aktive Strategie"
  },
  "Current Capital (Buffer)": {
    fr: "Capital actuel (tampon)",
    es: "Capital actual (colchón)",
    ht: "Kapital aktyèl (tanpon)",
    pt: "Capital atual (buffer)",
    de: "Aktuelles Kapital (Puffer)"
  },
  "Risk Per Trade": {
    fr: "Risque par transaction",
    es: "Riesgo por operación",
    ht: "Risk pou chak tranzaksyon",
    pt: "Risco por operação",
    de: "Risiko pro Trade"
  },
  "Total P&L": {
    fr: "P&L total",
    es: "P&L total",
    ht: "P&L total",
    pt: "P&L total",
    de: "Gesamt-P&L"
  },
  "Win Rate": {
    fr: "Taux de réussite",
    es: "Tasa de victorias",
    ht: "Pousantaj viktwa",
    pt: "Taxa de acerto",
    de: "Trefferquote"
  },
  "Contracts Unlocked": {
    fr: "Contrats débloqués",
    es: "Contratos desbloqueados",
    ht: "Kontra ki debloke",
    pt: "Contratos desbloqueados",
    de: "Freigeschaltete Kontrakte"
  },
  "Risk / Trade": {
    fr: "Risque / transaction",
    es: "Riesgo / operación",
    ht: "Risk / Tranzaksyon",
    pt: "Risco / Operação",
    de: "Risiko / Trade"
  },
  "Locked Max Stop": {
    fr: "Stop max verrouillé",
    es: "Stop máximo fijo",
    ht: "Estòp maksimòm fikse",
    pt: "Stop máximo fixo",
    de: "Fixiertes Max-Stop"
  },
  "Daily Target (2 wins)": {
    fr: "Objectif quotidien (2 gains)",
    es: "Meta diaria (2 ganancias)",
    ht: "Objektif chak jou (2 viktwa)",
    pt: "Meta diária (2 ganhos)",
    de: "Tagesziel (2 Gewinne)"
  },
  "Consistency Required": {
    fr: "Cohérence requise",
    es: "Consistencia requerida",
    ht: "Konsistans obligatwa",
    pt: "Consistência exigida",
    de: "Erforderliche Konsistenz"
  },
  "Max Profit Allowed / Day": {
    fr: "Profit max autorisé / jour",
    es: "Ganancia máxima permitida / día",
    ht: "Pwofi maksimòm otorize / jou",
    pt: "Lucro máximo permitido / dia",
    de: "Max. erlaubter Gewinn / Tag"
  },
  "Daily Loss Limit": {
    fr: "Limite de perte quotidienne",
    es: "Límite de pérdida diaria",
    ht: "Limit pèt chak jou",
    pt: "Limite de perda diária",
    de: "Tägliches Verlustlimit"
  },
  "DLL Type": {
    fr: "Type de LPQ",
    es: "Tipo de LPD",
    ht: "Tip LPJ",
    pt: "Tipo de LPD",
    de: "DLL-Typ"
  },
  "Win / Trade": {
    fr: "Gain / transaction",
    es: "Ganancia / operación",
    ht: "Genyen / Tranzaksyon",
    pt: "Ganho / Operação",
    de: "Gewinn / Trade"
  },
  "RR Ratio": {
    fr: "Ratio R/R",
    es: "Ratio R/R",
    ht: "Rapò R/R",
    pt: "Relação R/R",
    de: "CRV-Verhältnis"
  },
  "Breakeven Win Rate": {
    fr: "Taux de réussite d'équilibre",
    es: "Tasa de equilibrio",
    ht: "Pousantaj balans",
    pt: "Taxa de acerto de equilíbrio",
    de: "Breakeven-Trefferquote"
  },
  "Wins to Hit Target": {
    fr: "Gains pour atteindre l'objectif",
    es: "Ganancias para llegar a la meta",
    ht: "Viktwa pou rive nan objektif",
    pt: "Ganhos para atingir a meta",
    de: "Gewinne bis zum Ziel"
  },
  "Avg Trades Taken / Day": {
    fr: "Moy. transactions / jour",
    es: "Prom. operaciones / día",
    ht: "Mwayèn tranzaksyon / jou",
    pt: "Média de operações / dia",
    de: "Ø Trades / Tag"
  },
  "Most Trades Taken (Day)": {
    fr: "Max de transactions (jour)",
    es: "Máx. operaciones (día)",
    ht: "Pi plis tranzaksyon (jou)",
    pt: "Máx. de operações (dia)",
    de: "Meiste Trades (Tag)"
  },
  "Remaining to Target": {
    fr: "Restant pour l'objectif",
    es: "Restante para la meta",
    ht: "Rès pou rive nan objektif",
    pt: "Restante para a meta",
    de: "Verbleibend bis zum Ziel"
  },
  "Capital (Buffer)": {
    fr: "Capital (tampon)",
    es: "Capital (colchón)",
    ht: "Kapital (tanpon)",
    pt: "Capital (buffer)",
    de: "Kapital (Puffer)"
  },
  "Costs": {
    fr: "Coûts",
    es: "Costos",
    ht: "Depans",
    pt: "Custos",
    de: "Kosten"
  },
  "Total Costs": {
    fr: "Coûts totaux",
    es: "Costos totales",
    ht: "Total depans",
    pt: "Custos totais",
    de: "Gesamtkosten"
  },
  "Total Payouts": {
    fr: "Paiements totaux",
    es: "Pagos totales",
    ht: "Total peman",
    pt: "Total de pagamentos",
    de: "Gesamtauszahlungen"
  },
  "Net Profitability": {
    fr: "Rentabilité nette",
    es: "Rentabilidad neta",
    ht: "Pwofitabilite nèt",
    pt: "Rentabilidade líquida",
    de: "Nettorentabilität"
  },
  "Payout Ledger": {
    fr: "Registre des paiements",
    es: "Registro de pagos",
    ht: "Rejis peman",
    pt: "Registro de pagamentos",
    de: "Auszahlungsübersicht"
  },
  "Add Payout": {
    fr: "Ajouter un paiement",
    es: "Agregar pago",
    ht: "Ajoute peman",
    pt: "Adicionar pagamento",
    de: "Auszahlung hinzufügen"
  },
  "No payouts recorded yet.": {
    fr: "Aucun paiement enregistré pour l'instant.",
    es: "Aún no hay pagos registrados.",
    ht: "Poko gen okenn peman ki anrejistre.",
    pt: "Nenhum pagamento registrado ainda.",
    de: "Noch keine Auszahlungen erfasst."
  },
  "Per-Account Breakdown": {
    fr: "Répartition par compte",
    es: "Desglose por cuenta",
    ht: "Detay pa kont",
    pt: "Detalhamento por conta",
    de: "Aufschlüsselung nach Konto"
  },
  "No accounts yet.": {
    fr: "Aucun compte pour l'instant.",
    es: "Aún no hay cuentas.",
    ht: "Poko gen kont.",
    pt: "Nenhuma conta ainda.",
    de: "Noch keine Konten."
  },
  "No accounts yet. Add one to start tracking your buffer.": {
    fr: "Aucun compte pour l'instant. Ajoutez-en un pour suivre votre tampon.",
    es: "Aún no hay cuentas. Agrega una para empezar a seguir tu colchón.",
    ht: "Poko gen kont. Ajoute youn pou kòmanse swiv tanpon ou.",
    pt: "Nenhuma conta ainda. Adicione uma para começar a acompanhar seu buffer.",
    de: "Noch keine Konten. Füge eines hinzu, um deinen Puffer zu verfolgen."
  },
  "Performance Overview": {
    fr: "Aperçu des performances",
    es: "Resumen de rendimiento",
    ht: "Apèsi pèfòmans",
    pt: "Visão geral de desempenho",
    de: "Leistungsübersicht"
  },
  "All Accounts, Combined": {
    fr: "Tous les comptes, combinés",
    es: "Todas las cuentas, combinadas",
    ht: "Tout kont, konbine",
    pt: "Todas as contas, combinadas",
    de: "Alle Konten, kombiniert"
  },
  "Rule Adherence": {
    fr: "Respect des règles",
    es: "Cumplimiento de reglas",
    ht: "Respekte règ yo",
    pt: "Adesão às regras",
    de: "Regeltreue"
  },
  "Total Trades": {
    fr: "Transactions totales",
    es: "Operaciones totales",
    ht: "Total tranzaksyon",
    pt: "Total de operações",
    de: "Trades gesamt"
  },
  "Best day: ": {
    fr: "Meilleur jour : ",
    es: "Mejor día: ",
    ht: "Pi bon jou: ",
    pt: "Melhor dia: ",
    de: "Bester Tag: "
  },
  "Worst day: ": {
    fr: "Pire jour : ",
    es: "Peor día: ",
    ht: "Pi move jou: ",
    pt: "Pior dia: ",
    de: "Schlechtester Tag: "
  },
  "Trade History": {
    fr: "Historique des transactions",
    es: "Historial de operaciones",
    ht: "Istwa tranzaksyon",
    pt: "Histórico de operações",
    de: "Trade-Historie"
  },
  "No entries yet.": {
    fr: "Aucune entrée pour l'instant.",
    es: "Aún no hay entradas.",
    ht: "Poko gen antre.",
    pt: "Nenhum registro ainda.",
    de: "Noch keine Einträge."
  },
  "Delete entry": {
    fr: "Supprimer l'entrée",
    es: "Eliminar entrada",
    ht: "Efase antre a",
    pt: "Excluir registro",
    de: "Eintrag löschen"
  },
  "Trade 1": {
    fr: "Transaction 1",
    es: "Operación 1",
    ht: "Tranzaksyon 1",
    pt: "Operação 1",
    de: "Trade 1"
  },
  "Trade 2": {
    fr: "Transaction 2",
    es: "Operación 2",
    ht: "Tranzaksyon 2",
    pt: "Operação 2",
    de: "Trade 2"
  },
  "Trade 3": {
    fr: "Transaction 3",
    es: "Operación 3",
    ht: "Tranzaksyon 3",
    pt: "Operação 3",
    de: "Trade 3"
  },
  "Win": {
    fr: "Gain",
    es: "Ganancia",
    ht: "Genyen",
    pt: "Ganho",
    de: "Gewinn"
  },
  "Loss": {
    fr: "Perte",
    es: "Pérdida",
    ht: "Pèdi",
    pt: "Perda",
    de: "Verlust"
  },
  "Long": {
    fr: "Long",
    es: "Largo",
    ht: "Long",
    pt: "Comprado",
    de: "Long"
  },
  "Short": {
    fr: "Court",
    es: "Corto",
    ht: "Kout",
    pt: "Vendido",
    de: "Short"
  },
  "Buffer after this day: ": {
    fr: "Tampon après ce jour : ",
    es: "Colchón después de este día: ",
    ht: "Tanpon apre jou sa a: ",
    pt: "Buffer após este dia: ",
    de: "Puffer nach diesem Tag: "
  },
  "Discipline Leaderboard": {
    fr: "Classement de la discipline",
    es: "Tabla de disciplina",
    ht: "Klasman disiplin",
    pt: "Ranking de disciplina",
    de: "Disziplin-Rangliste"
  },
  "Your Discipline Checklist": {
    fr: "Votre liste de discipline",
    es: "Tu lista de disciplina",
    ht: "Lis disiplin ou",
    pt: "Sua lista de disciplina",
    de: "Deine Disziplin-Checkliste"
  },
  "Overall score: ": {
    fr: "Score global : ",
    es: "Puntuación general: ",
    ht: "Nòt jeneral: ",
    pt: "Pontuação geral: ",
    de: "Gesamtwertung: "
  },
  "Logged every day since you started?": {
    fr: "Avez-vous enregistré chaque jour depuis le début ?",
    es: "¿Registraste todos los días desde que empezaste?",
    ht: "Èske ou anrejistre chak jou depi ou kòmanse?",
    pt: "Registrou todos os dias desde que começou?",
    de: "Jeden Tag seit Beginn protokolliert?"
  },
  "Did physical exercise?": {
    fr: "Avez-vous fait de l'exercice physique ?",
    es: "¿Hiciste ejercicio físico?",
    ht: "Èske ou te fè egzèsis fizik?",
    pt: "Fez exercício físico?",
    de: "Sport gemacht?"
  },
  "Followed your written entry rules?": {
    fr: "Avez-vous suivi vos règles d'entrée écrites ?",
    es: "¿Seguiste tus reglas de entrada escritas?",
    ht: "Èske ou te swiv règ antre ekri ou yo?",
    pt: "Seguiu suas regras de entrada escritas?",
    de: "Deine schriftlichen Einstiegsregeln befolgt?"
  },
  "Stayed within your risk per trade (no over-risk)?": {
    fr: "Êtes-vous resté dans votre risque par transaction (pas de surisque) ?",
    es: "¿Te mantuviste dentro de tu riesgo por operación (sin exceso de riesgo)?",
    ht: "Èske ou te rete nan risk pou chak tranzaksyon (san twòp risk)?",
    pt: "Ficou dentro do seu risco por operação (sem excesso de risco)?",
    de: "Innerhalb deines Risikos pro Trade geblieben (kein Überrisiko)?"
  },
  "Stayed within your unlocked contract size (no over-lot)?": {
    fr: "Êtes-vous resté dans la taille de contrat débloquée (pas de surtaille) ?",
    es: "¿Te mantuviste dentro del tamaño de contrato desbloqueado (sin exceso de lote)?",
    ht: "Èske ou te rete nan gwosè kontra ki debloke a (san twòp lo)?",
    pt: "Ficou dentro do tamanho de contrato desbloqueado (sem excesso de lote)?",
    de: "Innerhalb der freigeschalteten Kontraktgröße geblieben (kein Über-Lot)?"
  },
  "Respected the Daily Execution Matrix?": {
    fr: "Avez-vous respecté la matrice d'exécution quotidienne ?",
    es: "¿Respetaste la matriz de ejecución diaria?",
    ht: "Èske ou te respekte matris egzekisyon chak jou a?",
    pt: "Respeitou a Matriz de Execução Diária?",
    de: "Die tägliche Ausführungsmatrix eingehalten?"
  },
  "Stayed within your max daily loss (2x risk per trade)?": {
    fr: "Êtes-vous resté dans votre perte maximale quotidienne (2x le risque par transaction) ?",
    es: "¿Te mantuviste dentro de tu pérdida máxima diaria (2x el riesgo por operación)?",
    ht: "Èske ou te rete nan pèt maksimòm chak jou (2x risk pou chak tranzaksyon)?",
    pt: "Ficou dentro da sua perda máxima diária (2x o risco por operação)?",
    de: "Innerhalb deines maximalen Tagesverlusts geblieben (2x Risiko pro Trade)?"
  },
  "Completed HTF to LTF analysis before entry?": {
    fr: "Avez-vous terminé l'analyse HTF vers LTF avant d'entrer ?",
    es: "¿Completaste el análisis de HTF a LTF antes de entrar?",
    ht: "Èske ou te fini analiz HTF a LTF anvan ou antre?",
    pt: "Concluiu a análise de HTF para LTF antes de entrar?",
    de: "HTF-zu-LTF-Analyse vor dem Einstieg abgeschlossen?"
  },
  "Traded in the direction of your daily bias?": {
    fr: "Avez-vous négocié dans le sens de votre biais quotidien ?",
    es: "¿Operaste en la dirección de tu sesgo diario?",
    ht: "Èske ou te fè tranzaksyon nan direksyon bias ou chak jou a?",
    pt: "Operou na direção do seu viés diário?",
    de: "In Richtung deines Tagesbias gehandelt?"
  },
  "No data yet": {
    fr: "Pas encore de données",
    es: "Sin datos aún",
    ht: "Poko gen done",
    pt: "Ainda sem dados",
    de: "Noch keine Daten"
  },
  "Risk of Ruin - Consecutive Loss Projection & Gain to Recover": {
    fr: "Risque de ruine - Projection de pertes consécutives et gain pour récupérer",
    es: "Riesgo de ruina - Proyección de pérdidas consecutivas y ganancia para recuperar",
    ht: "Risk Riwin - Pwojeksyon Pèt Youn Apre Lòt ak Genyen pou Rekipere",
    pt: "Risco de Ruína - Projeção de Perdas Consecutivas e Ganho para Recuperar",
    de: "Ruinrisiko - Prognose aufeinanderfolgender Verluste & Erholungsgewinn"
  },
  "Consecutive Losses": {
    fr: "Pertes consécutives",
    es: "Pérdidas consecutivas",
    ht: "Pèt Youn Apre Lòt",
    pt: "Perdas consecutivas",
    de: "Aufeinanderfolgende Verluste"
  },
  "Buffer Remaining": {
    fr: "Tampon restant",
    es: "Colchón restante",
    ht: "Tanpon ki rete",
    pt: "Buffer restante",
    de: "Verbleibender Puffer"
  },
  "Gain Needed to Recover": {
    fr: "Gain nécessaire pour récupérer",
    es: "Ganancia necesaria para recuperar",
    ht: "Genyen ki nesesè pou rekipere",
    pt: "Ganho necessário para recuperar",
    de: "Benötigter Gewinn zur Erholung"
  },
  "Account wiped": {
    fr: "Compte anéanti",
    es: "Cuenta liquidada",
    ht: "Kont efase nèt",
    pt: "Conta zerada",
    de: "Konto gelöscht"
  },
  "Daily Trade Execution Matrix - your actual risk": {
    fr: "Matrice d'exécution quotidienne - votre risque réel",
    es: "Matriz de ejecución diaria - tu riesgo real",
    ht: "Matris Egzekisyon Chak Jou - risk reyèl ou",
    pt: "Matriz de Execução Diária - seu risco real",
    de: "Tägliche Trade-Ausführungsmatrix - dein tatsächliches Risiko"
  },
  "Scenario": {
    fr: "Scénario",
    es: "Escenario",
    ht: "Senaryo",
    pt: "Cenário",
    de: "Szenario"
  },
  "Long Setup Rules": {
    fr: "Règles de configuration longue",
    es: "Reglas de configuración larga",
    ht: "Règ pou Long",
    pt: "Regras de configuração para Long",
    de: "Regeln für Long-Setups"
  },
  "Short Setup Rules": {
    fr: "Règles de configuration courte",
    es: "Reglas de configuración corta",
    ht: "Règ pou Kout",
    pt: "Regras de configuração para Short",
    de: "Regeln für Short-Setups"
  },
  "No rules defined.": {
    fr: "Aucune règle définie.",
    es: "No hay reglas definidas.",
    ht: "Pa gen règ ki defini.",
    pt: "Nenhuma regra definida.",
    de: "Keine Regeln definiert."
  },
  "Log Today's Trades": {
    fr: "Enregistrer les transactions d'aujourd'hui",
    es: "Registrar las operaciones de hoy",
    ht: "Anrejistre tranzaksyon jodi a",
    pt: "Registrar operações de hoje",
    de: "Heutige Trades protokollieren"
  },
  "Entry Method": {
    fr: "Méthode de saisie",
    es: "Método de entrada",
    ht: "Metòd Antre",
    pt: "Método de entrada",
    de: "Eingabemethode"
  },
  "Manual Entry": {
    fr: "Saisie manuelle",
    es: "Entrada manual",
    ht: "Antre Manyèl",
    pt: "Entrada manual",
    de: "Manuelle Eingabe"
  },
  "Import CSV": {
    fr: "Importer CSV",
    es: "Importar CSV",
    ht: "Enpòte CSV",
    pt: "Importar CSV",
    de: "CSV importieren"
  },
  "Choose CSV File": {
    fr: "Choisir un fichier CSV",
    es: "Elegir archivo CSV",
    ht: "Chwazi Fichye CSV",
    pt: "Escolher arquivo CSV",
    de: "CSV-Datei wählen"
  },
  "Date": {
    fr: "Date",
    es: "Fecha",
    ht: "Dat",
    pt: "Data",
    de: "Datum"
  },
  "Did you trade today?": {
    fr: "Avez-vous négocié aujourd'hui ?",
    es: "¿Operaste hoy?",
    ht: "Èske ou te fè tranzaksyon jodi a?",
    pt: "Você operou hoje?",
    de: "Hast du heute gehandelt?"
  },
  "Yes": {
    fr: "Oui",
    es: "Sí",
    ht: "Wi",
    pt: "Sim",
    de: "Ja"
  },
  "No": {
    fr: "Non",
    es: "No",
    ht: "Non",
    pt: "Não",
    de: "Nein"
  },
  "Physical exercise today?": {
    fr: "Exercice physique aujourd'hui ?",
    es: "¿Ejercicio físico hoy?",
    ht: "Egzèsis fizik jodi a?",
    pt: "Exercício físico hoje?",
    de: "Heute Sport gemacht?"
  },
  "Reason": {
    fr: "Raison",
    es: "Razón",
    ht: "Rezon",
    pt: "Motivo",
    de: "Grund"
  },
  "No Setup Found": {
    fr: "Aucune configuration trouvée",
    es: "No se encontró configuración",
    ht: "Pa Jwenn Setup",
    pt: "Nenhuma configuração encontrada",
    de: "Kein Setup gefunden"
  },
  "Did Not Trade": {
    fr: "N'a pas négocié",
    es: "No operó",
    ht: "Pa Fè Tranzaksyon",
    pt: "Não operou",
    de: "Nicht gehandelt"
  },
  "Other": {
    fr: "Autre",
    es: "Otro",
    ht: "Lòt",
    pt: "Outro",
    de: "Andere"
  },
  "Save No-Trade Day": {
    fr: "Enregistrer jour sans transaction",
    es: "Guardar día sin operar",
    ht: "Anrejistre Jou San Tranzaksyon",
    pt: "Salvar dia sem operação",
    de: "Handelsfreien Tag speichern"
  },
  "Save Entry": {
    fr: "Enregistrer l'entrée",
    es: "Guardar entrada",
    ht: "Anrejistre Antre",
    pt: "Salvar registro",
    de: "Eintrag speichern"
  },
  "Save Account": {
    fr: "Enregistrer le compte",
    es: "Guardar cuenta",
    ht: "Anrejistre Kont",
    pt: "Salvar conta",
    de: "Konto speichern"
  },
  "Save": {
    fr: "Enregistrer",
    es: "Guardar",
    ht: "Anrejistre",
    pt: "Salvar",
    de: "Speichern"
  },
  "Cancel": {
    fr: "Annuler",
    es: "Cancelar",
    ht: "Anile",
    pt: "Cancelar",
    de: "Abbrechen"
  },
  "Add Trading Account": {
    fr: "Ajouter un compte de trading",
    es: "Agregar cuenta de trading",
    ht: "Ajoute Kont Tranzaksyon",
    pt: "Adicionar conta de trading",
    de: "Trading-Konto hinzufügen"
  },
  "Start Funded Account": {
    fr: "Démarrer un compte financé",
    es: "Iniciar cuenta financiada",
    ht: "Kòmanse Kont Finanse",
    pt: "Iniciar conta financiada",
    de: "Finanziertes Konto starten"
  },
  "Account Name": {
    fr: "Nom du compte",
    es: "Nombre de la cuenta",
    ht: "Non Kont",
    pt: "Nome da conta",
    de: "Kontoname"
  },
  "Starting Balance": {
    fr: "Solde de départ",
    es: "Saldo inicial",
    ht: "Balans Depa",
    pt: "Saldo inicial",
    de: "Startkapital"
  },
  "Capital / Buffer ($)": {
    fr: "Capital / Tampon ($)",
    es: "Capital / Colchón ($)",
    ht: "Kapital / Tanpon ($)",
    pt: "Capital / Buffer ($)",
    de: "Kapital / Puffer ($)"
  },
  "Drawdown Type": {
    fr: "Type de retrait",
    es: "Tipo de drawdown",
    ht: "Tip Drawdown",
    pt: "Tipo de drawdown",
    de: "Drawdown-Typ"
  },
  "Market": {
    fr: "Marché",
    es: "Mercado",
    ht: "Mache",
    pt: "Mercado",
    de: "Markt"
  },
  "Profit Target ($)": {
    fr: "Objectif de profit ($)",
    es: "Meta de ganancia ($)",
    ht: "Objektif Pwofi ($)",
    pt: "Meta de lucro ($)",
    de: "Gewinnziel ($)"
  },
  "Consistency Rule (%)": {
    fr: "Règle de cohérence (%)",
    es: "Regla de consistencia (%)",
    ht: "Règ Konsistans (%)",
    pt: "Regra de consistência (%)",
    de: "Konsistenzregel (%)"
  },
  "Daily Loss Limit ($)": {
    fr: "Limite de perte quotidienne ($)",
    es: "Límite de pérdida diaria ($)",
    ht: "Limit Pèt Chak Jou ($)",
    pt: "Limite de perda diária ($)",
    de: "Tägliches Verlustlimit ($)"
  },
  "Daily Loss Limit Type": {
    fr: "Type de limite de perte quotidienne",
    es: "Tipo de límite de pérdida diaria",
    ht: "Tip Limit Pèt Chak Jou",
    pt: "Tipo de limite de perda diária",
    de: "Typ des Tagesverlustlimits"
  },
  "Strategy Name": {
    fr: "Nom de la stratégie",
    es: "Nombre de la estrategia",
    ht: "Non Estrateji",
    pt: "Nome da estratégia",
    de: "Strategiename"
  },
  "Add rule": {
    fr: "Ajouter une règle",
    es: "Agregar regla",
    ht: "Ajoute règ",
    pt: "Adicionar regra",
    de: "Regel hinzufügen"
  },
  "Challenge Cost ($)": {
    fr: "Coût du challenge ($)",
    es: "Costo del desafío ($)",
    ht: "Pri Defi ($)",
    pt: "Custo do desafio ($)",
    de: "Challenge-Kosten ($)"
  },
  "Activation Cost ($)": {
    fr: "Coût d'activation ($)",
    es: "Costo de activación ($)",
    ht: "Pri Aktivasyon ($)",
    pt: "Custo de ativação ($)",
    de: "Aktivierungskosten ($)"
  },
  "Reset Cost ($)": {
    fr: "Coût de réinitialisation ($)",
    es: "Costo de reinicio ($)",
    ht: "Pri Reyajiste",
    pt: "Custo de reinício ($)",
    de: "Reset-Kosten ($)"
  },
  "Master / Copied Account Number (optional)": {
    fr: "Numéro de compte maître / copié (facultatif)",
    es: "Número de cuenta maestra / copiada (opcional)",
    ht: "Nimewo Kont Mèt / Kopye (opsyonèl)",
    pt: "Número de conta mestre / copiada (opcional)",
    de: "Master-/kopierte Kontonummer (optional)"
  },
  "How was your day? (thoughts, emotions, anything on your mind)": {
    fr: "Comment s'est passée votre journée ? (pensées, émotions, tout ce qui vous préoccupe)",
    es: "¿Cómo estuvo tu día? (pensamientos, emociones, lo que tengas en mente)",
    ht: "Kijan jounen ou te ye? (panse, emosyon, nenpòt bagay nan tèt ou)",
    pt: "Como foi seu dia? (pensamentos, emoções, qualquer coisa na sua mente)",
    de: "Wie war dein Tag? (Gedanken, Gefühle, alles, was dich beschäftigt)"
  },
  "Add another trade": {
    fr: "Ajouter une autre transaction",
    es: "Agregar otra operación",
    ht: "Ajoute yon lòt tranzaksyon",
    pt: "Adicionar outra operação",
    de: "Weiteren Trade hinzufügen"
  },
  "Circuit Breaker - 2 losses. Day over.": {
    fr: "Coupe-circuit - 2 pertes. Journée terminée.",
    es: "Interruptor - 2 pérdidas. Día terminado.",
    ht: "Kout Sikwi - 2 pèt. Jounen fini.",
    pt: "Disjuntor - 2 perdas. Dia encerrado.",
    de: "Sicherung - 2 Verluste. Tag beendet."
  },
  "Greed Filter - 2 wins. Day over.": {
    fr: "Filtre de cupidité - 2 gains. Journée terminée.",
    es: "Filtro de codicia - 2 ganancias. Día terminado.",
    ht: "Filtè Konvwatiz - 2 genyen. Jounen fini.",
    pt: "Filtro de ganância - 2 ganhos. Dia encerrado.",
    de: "Gier-Filter - 2 Gewinne. Tag beendet."
  },
  "Day over - Trade 3 result stands.": {
    fr: "Journée terminée - le résultat de la transaction 3 est final.",
    es: "Día terminado - el resultado de la operación 3 es final.",
    ht: "Jounen fini - rezilta Tranzaksyon 3 la kanpe.",
    pt: "Dia encerrado - o resultado da Operação 3 é definitivo.",
    de: "Tag beendet - Ergebnis von Trade 3 bleibt bestehen."
  }
};
let originalTextMap = null;
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
  return React.createElement(Modal, {
    onClose: onClose,
    title: "Put MMM Pro Journal on Your Phone",
    size: "md"
  }, React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Optional. Adds a home-screen icon so the app opens full-screen, like a real app - no browser bar. Do this from the browser, not from a downloaded file."), React.createElement("div", {
    className: "flex bg-gray-900 border border-gray-800 rounded-lg p-1"
  }, React.createElement("button", {
    onClick: function () {
      setPlatform('iphone');
    },
    className: "flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-1.5 " + (platform === 'iphone' ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-500 hover:text-white')
  }, React.createElement(Icon, {
    name: "Smartphone",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "iPhone")), React.createElement("button", {
    onClick: function () {
      setPlatform('android');
    },
    className: "flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-1.5 " + (platform === 'android' ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-500 hover:text-white')
  }, React.createElement(Icon, {
    name: "Smartphone",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Android"))), React.createElement("div", {
    className: "space-y-3"
  }, steps.map(function (step, i) {
    return React.createElement("div", {
      key: i,
      className: "flex gap-3"
    }, React.createElement("div", {
      className: "h-7 w-7 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-sm font-bold flex items-center justify-center flex-shrink-0"
    }, i + 1), React.createElement("div", null, React.createElement("p", {
      className: "text-white text-sm font-medium"
    }, step.title), React.createElement("p", {
      className: "text-gray-500 text-xs mt-0.5"
    }, step.body)));
  })), React.createElement("div", {
    className: "flex items-center gap-3 bg-black/30 rounded-lg p-3"
  }, React.createElement("img", {
    src: "./logo-icon-192.png",
    alt: "MMM Pro Journal icon",
    className: "h-10 w-10 rounded-xl flex-shrink-0"
  }), React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "This is the icon you're looking for once it's added."))));
}
function LanguageSwitcher(props) {
  const language = props.language;
  const setLanguage = props.setLanguage;
  return React.createElement("select", {
    value: language,
    onChange: function (e) {
      setLanguage(e.target.value);
    },
    className: "bg-gray-900 border border-gray-800 text-gray-300 rounded-lg px-2 py-1.5 text-xs focus:border-yellow-400/50 outline-none"
  }, LANGUAGES.map(function (l) {
    return React.createElement("option", {
      key: l.code,
      value: l.code
    }, l.label);
  }));
}
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
  return cfg.riskPct * (1000 / spec.microPt);
}
function getTickerForTier(marketKey, tier) {
  const spec = MARKET_SPECS[marketKey] || MARKET_SPECS.nasdaq100;
  if (tier === 'nano') return spec.nanoTicker || '-';
  if (tier === 'micro') return spec.microTicker || '-';
  if (tier === 'mini') return spec.miniTicker || '-';
  return '-';
}
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
function payoutRulesConfigured(account) {
  if (!account) return false;
  const type = account.payoutType || 'simple';
  if (type === 'streak') return (parseFloat(account.streakDays) || 0) > 0 && (parseFloat(account.streakPctOfTotal) || 0) > 0;
  if (type === 'formula') return (parseFloat(account.formulaBuffer) || 0) > 0;
  if (type === 'twoleg') return (parseFloat(account.twoLegTarget) || 0) > 0;
  return (parseFloat(account.payoutBuffer) || 0) > 0 || (parseFloat(account.payoutThreshold) || 0) > 0;
}
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
}];
const ACCOUNT_BADGE_CLS = {
  challenge: 'bg-purple-500/20 text-purple-300',
  funded: 'bg-emerald-500/20 text-emerald-300',
  live: 'bg-cyan-500/20 text-cyan-300',
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
    mindset: 5
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
      chartUrl: ''
    }],
    notes: '',
    mentalCheck: mentalCheckSource ? Object.assign({}, emptyMentalCheck(), mentalCheckSource) : emptyMentalCheck(),
    dailyPlan: planTemplate ? Object.assign({}, emptyDailyPlan(defaultRisk, defaultRR), planTemplate) : emptyDailyPlan(defaultRisk, defaultRR),
    reflection: emptyReflection()
  };
};
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
  const [mode, setMode] = useState('login');
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
  return React.createElement("div", {
    className: "min-h-screen bg-black text-white flex items-center justify-center p-4"
  }, React.createElement("div", {
    className: "w-full max-w-sm bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-2xl p-8"
  }, React.createElement("div", {
    className: "flex justify-end mb-3"
  }, React.createElement(LanguageSwitcher, {
    language: language,
    setLanguage: setLanguage
  })), React.createElement("h1", {
    className: "text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent text-center mb-1"
  }, "MMM Pro Journal"), React.createElement("p", {
    className: "text-gray-500 text-sm text-center mb-6"
  }, mode === 'login' ? 'Sign in to your account' : 'Create your account'), mode === 'signup' && React.createElement("input", {
    value: displayName,
    onChange: function (e) {
      setDisplayName(e.target.value);
    },
    placeholder: "Your name",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 mb-3 focus:border-yellow-400/50 outline-none"
  }), React.createElement("input", {
    value: email,
    onChange: function (e) {
      setEmail(e.target.value);
    },
    placeholder: "Email",
    type: "email",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 mb-3 focus:border-yellow-400/50 outline-none"
  }), React.createElement("input", {
    value: password,
    onChange: function (e) {
      setPassword(e.target.value);
    },
    placeholder: "Password",
    type: "password",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 mb-3 focus:border-yellow-400/50 outline-none"
  }), error && React.createElement("p", {
    className: "text-red-400 text-xs mb-3"
  }, error), info && React.createElement("p", {
    className: "text-green-400 text-xs mb-3"
  }, info), React.createElement("button", {
    onClick: handleSubmit,
    disabled: loading,
    className: "w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2.5 rounded-lg font-semibold disabled:opacity-50 mb-3"
  }, loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'), mode === 'login' && React.createElement("button", {
    onClick: handleForgotPassword,
    disabled: loading,
    className: "w-full text-center text-xs text-gray-500 hover:text-yellow-400 mb-3"
  }, "Forgot password?"), React.createElement("p", {
    className: "text-center text-sm text-gray-500"
  }, mode === 'login' ? "Don't have an account?" : "Already have an account?", ' ', React.createElement("button", {
    onClick: function () {
      setMode(mode === 'login' ? 'signup' : 'login');
      setError('');
      setInfo('');
    },
    className: "text-yellow-400 hover:underline"
  }, mode === 'login' ? 'Sign up' : 'Sign in')), React.createElement("button", {
    onClick: function () {
      setShowInstall(true);
    },
    className: "w-full text-center text-xs text-gray-600 hover:text-gray-400 mt-4 flex items-center justify-center gap-1.5"
  }, React.createElement(Icon, {
    name: "Smartphone",
    className: "h-3 w-3"
  }), React.createElement("span", null, "Put MMM Pro Journal on your phone"))), showInstall && React.createElement(InstallAppModal, {
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
    return React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, React.createElement("input", {
      value: draft,
      onChange: function (e) {
        setDraft(e.target.value);
      },
      placeholder: "Your name",
      className: "bg-gray-800 border border-gray-700 text-white rounded px-2 py-0.5 text-sm w-32 focus:border-yellow-400/50 outline-none"
    }), React.createElement("button", {
      onClick: save,
      disabled: saving || !draft.trim(),
      className: "text-green-400 hover:underline disabled:opacity-40 text-sm"
    }, "Save"), React.createElement("button", {
      onClick: function () {
        setEditing(false);
      },
      className: "text-gray-500 hover:text-gray-300 text-sm"
    }, "Cancel"));
  }
  return React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, React.createElement("span", null, currentLabel), React.createElement("button", {
    onClick: startEdit,
    className: "text-gray-500 hover:text-yellow-400",
    title: "Edit display name"
  }, React.createElement(Icon, {
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
  return React.createElement("span", {
    className: "inline-flex items-center gap-2 ml-2 align-middle"
  }, React.createElement("span", {
    className: "inline-flex items-center gap-1 text-xs text-gray-400"
  }, React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-white"
  }), total), React.createElement("span", {
    className: "inline-flex items-center gap-1 text-xs text-gray-400"
  }, React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-green-400"
  }), online));
}
function SystemExplainer() {
  const [open, setOpen] = useState(false);
  return React.createElement("div", {
    className: "border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-xl overflow-hidden"
  }, React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-start gap-3 p-4 text-left"
  }, React.createElement(Icon, {
    name: "Zap",
    className: "h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0"
  }), React.createElement("div", {
    className: "flex-1"
  }, React.createElement("p", {
    className: "text-sm text-yellow-100/80"
  }, React.createElement("span", {
    className: "text-yellow-400 font-semibold"
  }, "Charter: "), "Risk is fixed by Phase - ", React.createElement("span", {
    className: "text-white font-medium"
  }, "10% Speed Mode"), " (Challenge / Funded) or", React.createElement("span", {
    className: "text-white font-medium"
  }, " 2% Preservation Mode"), " (Live). Every trade targets your account's reward-to-risk (minimum ", MIN_RR, ":1). Max 3 trades/day, tie-breaker mandatory on a 1-1 split.", React.createElement("span", {
    className: "text-yellow-400 underline ml-1"
  }, open ? 'Hide details' : 'What does this mean?'))), React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0"
  })), open && React.createElement("div", {
    className: "px-4 pb-4 space-y-3 text-sm text-gray-300 border-t border-yellow-500/20 pt-3"
  }, React.createElement("div", null, React.createElement("p", {
    className: "text-yellow-400 font-semibold mb-1"
  }, "Capital = Drawdown Buffer"), React.createElement("p", {
    className: "text-gray-400"
  }, "Your Capital is strictly your drawdown buffer, not the nominal account size. Risk is calculated as a fixed percentage of this buffer.")), React.createElement("div", null, React.createElement("p", {
    className: "text-blue-400 font-semibold mb-1"
  }, "Capital Sizing Lock"), React.createElement("p", {
    className: "text-gray-400"
  }, "You don't choose your contract size - your Capital does. $100 unlocks 1 Nano, $1,000 unlocks 1 Micro, $10,000 unlocks 1 Mini.")), React.createElement("div", null, React.createElement("p", {
    className: "text-red-400 font-semibold mb-1"
  }, "Locked Maximum Stop Loss"), React.createElement("p", {
    className: "text-gray-400"
  }, "Because capital tiers and point-values scale together, your max stop in points never changes for a market and phase. If the chart needs a wider stop, you skip the trade.")), React.createElement("div", null, React.createElement("p", {
    className: "text-purple-400 font-semibold mb-1"
  }, "Daily Execution Matrix"), React.createElement("p", {
    className: "text-gray-400"
  }, "2 losses = circuit breaker, day over. 2 wins = greed filter, day over. A 1-1 split forces a mandatory Trade 3 tie-breaker.")), React.createElement("div", null, React.createElement("p", {
    className: "text-orange-400 font-semibold mb-1"
  }, "Prop Firm Rules (optional, per account)"), React.createElement("p", {
    className: "text-gray-400"
  }, "Consistency % caps how much of your total profit a single day can represent. Daily Loss Limit is separate from your Capital and resets every day - some firms hard-breach it, others soft-breach."))));
}
function t_border(key) {
  if (key === 'challenge') return 'bg-purple-500/10 border-purple-500/40';
  if (key === 'funded') return 'bg-emerald-500/10 border-emerald-500/40';
  if (key === 'breached') return 'bg-red-500/10 border-red-500/40';
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
  return React.createElement("div", {
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
    return React.createElement("div", {
      key: type.key,
      className: "relative"
    }, React.createElement("button", {
      onClick: function () {
        setOpenGroup(isOpen ? null : type.key);
      },
      className: "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition " + (isOpen ? t_border(type.key) : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700')
    }, React.createElement("span", {
      className: "px-1.5 py-0.5 rounded text-xs font-semibold " + ACCOUNT_BADGE_CLS[type.key]
    }, type.label), React.createElement("span", {
      className: "text-xs text-gray-500"
    }, "(", activeInGroup, isBreachedGroup ? '' : ' Active', ")"), groupSelectedCount > 0 && React.createElement("span", {
      className: "text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300"
    }, groupSelectedCount, " in view"), React.createElement(Icon, {
      name: isOpen ? "ChevronUp" : "ChevronDown",
      className: "h-3.5 w-3.5 text-gray-500"
    })), isOpen && React.createElement("div", {
      className: "absolute z-40 mt-1 w-72 bg-black border border-gray-800 rounded-xl shadow-2xl p-2 max-h-80 overflow-y-auto"
    }, group.length === 0 && React.createElement("p", {
      className: "text-xs text-gray-600 p-2"
    }, "No ", type.label.toLowerCase(), " accounts to show."), group.length > 0 && React.createElement("button", {
      onClick: function () {
        onToggleGroup(group.map(function (a) {
          return a.id;
        }), !groupAllSelected);
      },
      className: "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-gray-900 border-b border-gray-800 mb-1"
    }, React.createElement(Icon, {
      name: groupAllSelected ? "CheckSquare" : "Square",
      className: "h-3.5 w-3.5 flex-shrink-0 " + (groupAllSelected ? 'text-yellow-400' : 'text-gray-600')
    }), React.createElement("span", null, "Select all ", type.label.toLowerCase(), " for Overview/Equity Curve")), group.map(function (acc) {
      const st = getStatus(acc);
      const archived = isArchived(acc, st);
      const checked = selectedIds.has(acc.id);
      return React.createElement("div", {
        key: acc.id,
        className: "w-full flex items-center gap-1.5 px-1 py-0.5 rounded-lg " + (activeAccountId === acc.id ? 'bg-yellow-500/10' : '')
      }, React.createElement("button", {
        onClick: function (e) {
          e.stopPropagation();
          onToggleAccount(acc.id);
        },
        className: "p-1.5 flex-shrink-0",
        title: "Include in Overview/Equity Curve"
      }, React.createElement(Icon, {
        name: checked ? "CheckSquare" : "Square",
        className: "h-3.5 w-3.5 " + (checked ? 'text-yellow-400' : 'text-gray-600')
      })), React.createElement("button", {
        onClick: function () {
          onSelect(acc.id, isBreachedGroup);
          setOpenGroup(null);
        },
        className: "flex-1 flex items-center justify-between px-2 py-1.5 rounded-lg text-sm text-left " + (archived ? 'opacity-40 ' : '') + (activeAccountId === acc.id ? 'text-yellow-300' : 'text-gray-300 hover:bg-gray-900')
      }, React.createElement("span", null, acc.name, " #", acc.accountNumber), archived && React.createElement("span", {
        className: "text-[10px] text-red-400"
      }, "Archived")));
    })));
  }), React.createElement("button", {
    onClick: onToggleAll,
    className: "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition " + (allSelectedCount === nonBreachedTotal && nonBreachedTotal > 0 ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700')
  }, React.createElement(Icon, {
    name: allSelectedCount === nonBreachedTotal && nonBreachedTotal > 0 ? "CheckSquare" : "Square",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "All Accounts (", allSelectedCount, " in view)")));
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden"
  }, React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between p-6 text-left"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "TrendingDown",
    className: "h-5 w-5 text-red-400"
  }), React.createElement("div", null, React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Risk of Ruin"), React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Consecutive loss projection & gain needed to recover"))), React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-gray-500 flex-shrink-0"
  })), open && React.createElement("div", {
    className: "px-6 pb-6"
  }, React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "Hypothetical: if every trade lost at the fixed Charter risk% for this phase."), React.createElement("div", {
    className: "overflow-x-auto"
  }, React.createElement("table", {
    className: "w-full text-sm"
  }, React.createElement("thead", null, React.createElement("tr", {
    className: "text-left text-gray-500 text-xs uppercase tracking-wide border-b border-gray-800"
  }, React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Consecutive Losses"), React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Buffer Remaining"), React.createElement("th", {
    className: "pb-2 pr-4"
  }, "% of Buffer Left"), React.createElement("th", {
    className: "pb-2"
  }, "Gain Needed to Recover"))), React.createElement("tbody", null, rows.map(function (r) {
    return React.createElement("tr", {
      key: r.n,
      className: "border-b border-gray-800/50 last:border-0"
    }, React.createElement("td", {
      className: "py-2 pr-4 text-white font-medium"
    }, r.n, " losses"), React.createElement("td", {
      className: "py-2 pr-4 font-semibold " + (r.pctRemaining <= 20 ? 'text-red-400' : r.pctRemaining <= 50 ? 'text-yellow-400' : 'text-green-400')
    }, fmt(r.remaining)), React.createElement("td", {
      className: "py-2 pr-4"
    }, React.createElement("div", {
      className: "flex items-center gap-2"
    }, React.createElement("div", {
      className: "w-20 bg-gray-800 rounded-full h-1.5 overflow-hidden"
    }, React.createElement("div", {
      className: "h-full rounded-full " + (r.pctRemaining <= 20 ? 'bg-red-400' : r.pctRemaining <= 50 ? 'bg-yellow-400' : 'bg-green-400'),
      style: {
        width: Math.max(r.pctRemaining, 2) + '%'
      }
    })), React.createElement("span", {
      className: "text-xs " + (r.pctRemaining <= 20 ? 'text-red-400' : r.pctRemaining <= 50 ? 'text-yellow-400' : 'text-green-400')
    }, r.pctRemaining.toFixed(1), "%"))), React.createElement("td", {
      className: "py-2"
    }, r.recoveryPct === null ? React.createElement("span", {
      className: "text-red-500 font-semibold"
    }, "Account wiped") : React.createElement("span", {
      className: "font-semibold " + (r.recoveryPct >= 100 ? 'text-red-400' : r.recoveryPct >= 40 ? 'text-yellow-400' : 'text-gray-300')
    }, "+", r.recoveryPct.toFixed(1), "% needed")));
  })))), React.createElement("p", {
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
  return React.createElement("div", {
    className: "bg-black/40 border border-gray-800 rounded-xl p-4"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, React.createElement(Icon, {
    name: "LayoutGrid",
    className: "h-4 w-4 text-yellow-400"
  }), React.createElement("h3", {
    className: "text-sm font-semibold text-white"
  }, "Daily Trade Execution Matrix - your actual risk")), React.createElement("p", {
    className: "text-xs text-gray-500 mb-3"
  }, "Max 3 trades - stop at 2 wins or 2 losses, mandatory Trade 3 on a tie. Built from this account's real risk (", fmt(risk), ") at ", rr, ":1 reward (", fmt(reward), ")."), React.createElement("div", {
    className: "overflow-x-auto"
  }, React.createElement("table", {
    className: "w-full text-xs"
  }, React.createElement("thead", null, React.createElement("tr", {
    className: "text-left text-gray-500 uppercase tracking-wide border-b border-gray-800"
  }, React.createElement("th", {
    className: "pb-1.5 pr-3"
  }, "Scenario"), React.createElement("th", {
    className: "pb-1.5 pr-3"
  }, "Trade 1"), React.createElement("th", {
    className: "pb-1.5 pr-3"
  }, "Trade 2"), React.createElement("th", {
    className: "pb-1.5 pr-3"
  }, "Trade 3"), React.createElement("th", {
    className: "pb-1.5"
  }, "Daily P&L"))), React.createElement("tbody", null, scenarios.map(function (s, i) {
    return React.createElement("tr", {
      key: i,
      className: "border-b border-gray-800/50 last:border-0"
    }, React.createElement("td", {
      className: "py-1.5 pr-3 font-medium " + (s.pnl > 0 ? 'text-green-400' : s.pnl < 0 ? 'text-red-400' : 'text-gray-300')
    }, s.name), s.trades.map(function (t, ti) {
      return React.createElement("td", {
        key: ti,
        className: "py-1.5 pr-3"
      }, t === '-' ? React.createElement("span", {
        className: "text-gray-700"
      }, "-") : React.createElement("span", {
        className: t === 'W' ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'
      }, t, " ", t === 'W' ? '+' + fmt(reward) : '-' + fmt(risk)));
    }), React.createElement("td", {
      className: "py-1.5 font-bold " + (s.pnl > 0 ? 'text-green-400' : s.pnl < 0 ? 'text-red-400' : 'text-gray-300')
    }, s.pnl >= 0 ? '+' : '', fmt(s.pnl)));
  })))));
}
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
  return React.createElement("div", {
    className: "border border-orange-500/40 bg-orange-500/10 rounded-xl p-4 flex items-start gap-3"
  }, React.createElement(Icon, {
    name: "TrendingUp",
    className: "h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0"
  }), React.createElement("div", null, React.createElement("p", {
    className: "text-orange-300 font-semibold text-sm"
  }, "Best day is over your consistency limit"), React.createElement("p", {
    className: "text-orange-200/80 text-xs mt-1"
  }, "Your best day (", React.createElement("span", {
    className: "num"
  }, fmt(bestDayPnl)), ") is currently ", React.createElement("span", {
    className: "num"
  }, (currentRatio * 100).toFixed(1), "%"), " of your total profit - over your ", account.consistencyPct, "% limit. You don't need to undo that day - make ", React.createElement("span", {
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-red-500/30 rounded-2xl p-6"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, React.createElement(Icon, {
    name: "FileSearch",
    className: "h-5 w-5 text-red-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Breach Review")), React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "A specific look at what happened on this account - not a punishment, just the facts so the next one goes differently."), breachDay && React.createElement("div", {
    className: "bg-black/30 rounded-lg p-3 mb-4"
  }, React.createElement("p", {
    className: "text-xs text-gray-400 mb-1"
  }, "The day the buffer hit zero: ", React.createElement("span", {
    className: "text-white font-medium"
  }, breachDay.date)), React.createElement("p", {
    className: "text-sm font-semibold " + (breachDay.pnl < 0 ? 'text-red-400' : 'text-gray-300')
  }, breachDay.pnl >= 0 ? '+' : '', fmt(breachDay.pnl), " that day"), breachEntry && breachEntry.trades && breachEntry.trades.length > 0 && React.createElement("p", {
    className: "text-xs text-gray-500 mt-1"
  }, breachEntry.trades.length, " trade", breachEntry.trades.length !== 1 ? 's' : '', " logged that day - ", breachEntry.trades.filter(function (t) {
    return t.result === 'loss';
  }).length, " loss", breachEntry.trades.filter(function (t) {
    return t.result === 'loss';
  }).length !== 1 ? 'es' : '', ".")), items.length === 0 ? React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Not enough logged trades on this account to build a review yet.") : React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, React.createElement("div", null, React.createElement("p", {
    className: "text-xs uppercase tracking-wide text-green-400 font-semibold mb-2"
  }, "What went well"), wentWell.length === 0 ? React.createElement("p", {
    className: "text-xs text-gray-600"
  }, "Nothing cleared 70% on this account.") : React.createElement("div", {
    className: "space-y-1.5"
  }, wentWell.map(function (i, idx) {
    return React.createElement("div", {
      key: idx,
      className: "flex items-center justify-between text-xs bg-black/30 rounded-lg px-2.5 py-1.5"
    }, React.createElement("span", {
      className: "text-gray-300"
    }, i.label), React.createElement("span", {
      className: "text-green-400 font-semibold"
    }, i.value.toFixed(0), "%"));
  }))), React.createElement("div", null, React.createElement("p", {
    className: "text-xs uppercase tracking-wide text-red-400 font-semibold mb-2"
  }, "What to work on"), toWorkOn.length === 0 ? React.createElement("p", {
    className: "text-xs text-gray-600"
  }, "Nothing fell below 70% on this account.") : React.createElement("div", {
    className: "space-y-1.5"
  }, toWorkOn.map(function (i, idx) {
    return React.createElement("div", {
      key: idx,
      className: "flex items-center justify-between text-xs bg-black/30 rounded-lg px-2.5 py-1.5"
    }, React.createElement("span", {
      className: "text-gray-300"
    }, i.label), React.createElement("span", {
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 space-y-6"
  }, React.createElement("div", {
    className: "flex items-center justify-between"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "BookOpen",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Strategy Rules")), React.createElement("button", {
    onClick: onManage,
    className: "flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/15 px-3 py-1.5 rounded-lg text-sm font-medium transition"
  }, React.createElement(Icon, {
    name: "Plus",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Add Strategy"))), strategies.length === 0 ? React.createElement("div", {
    className: "text-center py-8 border border-dashed border-gray-800 rounded-xl"
  }, React.createElement(Icon, {
    name: "BookOpen",
    className: "h-8 w-8 text-gray-700 mx-auto mb-2"
  }), React.createElement("p", {
    className: "text-gray-500 text-sm"
  }, "No strategies defined yet."), React.createElement("p", {
    className: "text-gray-600 text-xs mt-1"
  }, "Add one with its own Long/Short entry rules - you'll pick which strategy you used each time you log a day.")) : strategies.map(function (strategy) {
    const longRules = (strategy.longRules || []).filter(function (r) {
      return r && r.trim();
    });
    const shortRules = (strategy.shortRules || []).filter(function (r) {
      return r && r.trim();
    });
    return React.createElement("div", {
      key: strategy.id
    }, React.createElement("p", {
      className: "text-sm font-medium text-white mb-2"
    }, strategy.name), React.createElement("div", {
      className: "grid grid-cols-1 md:grid-cols-2 gap-4"
    }, React.createElement("div", {
      className: "bg-black/40 border border-green-800/40 rounded-xl p-4"
    }, React.createElement("p", {
      className: "text-xs uppercase tracking-wide text-green-400 font-semibold mb-2 flex items-center gap-1.5"
    }, React.createElement(Icon, {
      name: "TrendingUp",
      className: "h-3.5 w-3.5"
    }), React.createElement("span", null, "Long Setup Rules")), longRules.length === 0 ? React.createElement("p", {
      className: "text-xs text-gray-600"
    }, "No rules defined.") : React.createElement("ul", {
      className: "space-y-1.5"
    }, longRules.map(function (r, i) {
      return React.createElement("li", {
        key: i,
        className: "text-sm text-gray-300 flex items-start gap-2"
      }, React.createElement("span", {
        className: "text-green-400 mt-0.5 leading-none"
      }, "*"), React.createElement("span", null, r));
    }))), React.createElement("div", {
      className: "bg-black/40 border border-red-800/40 rounded-xl p-4"
    }, React.createElement("p", {
      className: "text-xs uppercase tracking-wide text-red-400 font-semibold mb-2 flex items-center gap-1.5"
    }, React.createElement(Icon, {
      name: "TrendingDown",
      className: "h-3.5 w-3.5"
    }), React.createElement("span", null, "Short Setup Rules")), shortRules.length === 0 ? React.createElement("p", {
      className: "text-xs text-gray-600"
    }, "No rules defined.") : React.createElement("ul", {
      className: "space-y-1.5"
    }, shortRules.map(function (r, i) {
      return React.createElement("li", {
        key: i,
        className: "text-sm text-gray-300 flex items-start gap-2"
      }, React.createElement("span", {
        className: "text-red-400 mt-0.5 leading-none"
      }, "*"), React.createElement("span", null, r));
    })))));
  }));
}
function MiniStat(props) {
  const accentBorder = (props.color || '').replace(/text-/g, 'border-');
  return React.createElement("div", {
    className: "bg-black/30 border border-gray-800/80 border-l-2 rounded-lg pl-3 pr-2.5 py-2 " + accentBorder
  }, React.createElement("div", {
    className: "text-[11px] text-gray-500 leading-tight mb-0.5"
  }, props.label), React.createElement("div", {
    className: "num text-[15px] font-semibold " + props.color
  }, props.value));
}
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
function GeneralPlanStats(props) {
  const account = props.account;
  const m = tradingPlanMath(account, props.riskPerTrade, props.totalPnl);
  const avgTradesPerDay = props.avgTradesPerDay || 0;
  const maxTradesInDay = props.maxTradesInDay || 0;
  return React.createElement(React.Fragment, null, React.createElement(MiniStat, {
    label: "Win / Trade (max)",
    value: fmt(m.winPerTrade),
    color: "text-green-400"
  }), React.createElement(MiniStat, {
    label: "RR Ratio",
    value: m.rr + ":1",
    color: "text-purple-400"
  }), React.createElement(MiniStat, {
    label: "Breakeven Win Rate",
    value: m.minWinRate.toFixed(1) + "%",
    color: "text-purple-400"
  }), React.createElement(MiniStat, {
    label: "Avg Trades Taken / Day",
    value: avgTradesPerDay.toFixed(1),
    color: "text-blue-400"
  }), React.createElement(MiniStat, {
    label: "Most Trades Taken (Day)",
    value: String(maxTradesInDay),
    color: "text-blue-400"
  }), React.createElement(MiniStat, {
    label: "Capital (Buffer)",
    value: fmt(account.maxDrawdown),
    color: "text-yellow-400"
  }), React.createElement(MiniStat, {
    label: "Suggested Trades (sample)",
    value: "20-25",
    color: "text-gray-300"
  }));
}
function PersonalPlanStats(props) {
  const account = props.account;
  const m = tradingPlanMath(account, props.riskPerTrade, props.totalPnl);
  return React.createElement(React.Fragment, null, React.createElement(MiniStat, {
    label: "Wins to Hit Target",
    value: m.winsToTarget + " wins",
    color: "text-purple-400"
  }), React.createElement(MiniStat, {
    label: "Remaining to Target",
    value: fmt(Math.max(0, m.remaining)),
    color: "text-yellow-400"
  }));
}
function TradeBudgetReference(props) {
  const buffer = Math.max(parseFloat(props.buffer) || 0, 0);
  const systemMaxRisk = parseFloat(props.systemMaxRisk) || 0;
  const onApply = props.onApply;
  const locked = !!props.locked;
  if (buffer <= 0) return null;
  const HIGH_COUNT = 20;
  const LOW_COUNT = 25;
  const highRisk = buffer / HIGH_COUNT;
  const lowRisk = buffer / LOW_COUNT;
  const midRisk = Math.min((lowRisk + highRisk) / 2, systemMaxRisk);
  const fitsUnderMax = systemMaxRisk > 0 && lowRisk <= systemMaxRisk;
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-5"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, React.createElement(Icon, {
    name: "ListOrdered",
    className: "h-5 w-5 text-blue-400"
  }), React.createElement("h3", {
    className: "text-sm font-semibold text-white"
  }, "Suggested Trade Budget (Reference)")), React.createElement("p", {
    className: "text-xs text-gray-500 mb-3"
  }, "A rule of thumb: size each trade so your buffer could survive about ", HIGH_COUNT, "-", LOW_COUNT, " losing trades in a row before it's gone. This is just a reference - it changes nothing until you apply it below."), React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3"
  }, React.createElement(MiniStat, {
    label: HIGH_COUNT + "-Trade Life",
    value: fmt(highRisk) + "/trade",
    color: "text-blue-400"
  }), React.createElement(MiniStat, {
    label: LOW_COUNT + "-Trade Life",
    value: fmt(lowRisk) + "/trade",
    color: "text-blue-400"
  }), React.createElement(MiniStat, {
    label: "As % of Buffer",
    value: (100 / LOW_COUNT).toFixed(1) + "% - " + (100 / HIGH_COUNT).toFixed(1) + "%",
    color: "text-gray-400"
  })), locked ? React.createElement("p", {
    className: "text-xs text-gray-600 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "Lock",
    className: "h-3 w-3"
  }), React.createElement("span", null, "Risk tolerance is locked for this account - this reference is informational only until it passes or fails.")) : fitsUnderMax ? React.createElement("button", {
    onClick: function () {
      onApply(midRisk.toFixed(2));
    },
    className: "text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/40"
  }, "Use ", fmt(midRisk), "/trade as My Personal Risk Tolerance") : React.createElement("p", {
    className: "text-xs text-gray-600"
  }, "Your system max (", fmt(systemMaxRisk), "/trade) is already tighter than this reference - you're already more conservative than a ", LOW_COUNT, "-trade life count."));
}
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-5"
  }, React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between gap-2 text-left"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "Calculator",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("h3", {
    className: "text-sm font-semibold text-white"
  }, "Strategy, RR & Sample-Size Reference")), React.createElement(Icon, {
    name: open ? 'ChevronUp' : 'ChevronDown',
    className: "h-4 w-4 text-gray-500 flex-shrink-0"
  })), !open ? React.createElement("p", {
    className: "text-xs text-gray-600 mt-1.5"
  }, "Your win rate needed to be profitable at each RR, and how many backtested trades you need before trusting a strategy. Click to expand.") : React.createElement("div", {
    className: "mt-4 space-y-5"
  }, React.createElement("div", null, React.createElement("p", {
    className: "text-xs text-gray-400 mb-2"
  }, React.createElement("span", {
    className: "text-white font-medium"
  }, "Your strategy must be fixed - never change it if it's profitable."), " A profitable strategy means a good win rate for its RR (risk/reward). Change the RR, and the win rate you need changes too:"), React.createElement("div", {
    className: "overflow-x-auto"
  }, React.createElement("table", {
    className: "w-full text-xs"
  }, React.createElement("thead", null, React.createElement("tr", {
    className: "text-gray-500 border-b border-gray-800"
  }, React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "RR"), React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "Breakeven Win Rate"), React.createElement("th", {
    className: "text-left py-1.5"
  }, "Profitable When"))), React.createElement("tbody", null, RR_BREAKEVEN_TABLE.map(function (r) {
    return React.createElement("tr", {
      key: r.rr,
      className: "border-b border-gray-900"
    }, React.createElement("td", {
      className: "py-1.5 pr-3 text-purple-300 font-medium num"
    }, r.rr), React.createElement("td", {
      className: "py-1.5 pr-3 text-gray-300 num"
    }, r.breakeven), React.createElement("td", {
      className: "py-1.5 text-green-400 num"
    }, r.profitable));
  }))))), React.createElement("div", null, React.createElement("p", {
    className: "text-xs text-gray-400 mb-2"
  }, "Minimum sample size before trusting a strategy's numbers: ", React.createElement("span", {
    className: "text-white font-medium"
  }, "100 trades"), ". Ideal: ", React.createElement("span", {
    className: "text-white font-medium"
  }, "200-500 trades"), ". By trading style:"), React.createElement("div", {
    className: "overflow-x-auto"
  }, React.createElement("table", {
    className: "w-full text-xs"
  }, React.createElement("thead", null, React.createElement("tr", {
    className: "text-gray-500 border-b border-gray-800"
  }, React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "Style"), React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "Minimum"), React.createElement("th", {
    className: "text-left py-1.5 pr-3"
  }, "Ideal"), React.createElement("th", {
    className: "text-left py-1.5"
  }, "Data Span"))), React.createElement("tbody", null, BACKTEST_REQUIREMENTS_TABLE.map(function (r) {
    return React.createElement("tr", {
      key: r.style,
      className: "border-b border-gray-900"
    }, React.createElement("td", {
      className: "py-1.5 pr-3 text-gray-300"
    }, r.style), React.createElement("td", {
      className: "py-1.5 pr-3 text-blue-300 num"
    }, r.min), React.createElement("td", {
      className: "py-1.5 pr-3 text-green-400 num"
    }, r.ideal), React.createElement("td", {
      className: "py-1.5 text-gray-400"
    }, r.data));
  }))))), React.createElement("p", {
    className: "text-xs text-gray-600"
  }, "Why 20-25 suggested trades on the Overview's General panel: across a 400-trade sample, a trader can run into 14 losses in a row - sizing around a 20-25 trade \"survival window\" is the sweet spot that accounts for that.")));
}
function ProjectionsCard(props) {
  const account = props.account;
  const accountEntries = props.accountEntries;
  const defaultRisk = props.defaultRiskPerTrade;
  const storageKey = 'mmm_projection_' + account.id;
  const [settings, setSettings] = useState(function () {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      riskPerTrade: defaultRisk || 0,
      rewardRatio: Math.max(parseFloat(account.rewardRatio) || MIN_RR, MIN_RR),
      profitTarget: parseFloat(account.profitTarget) || 0,
      riskCuttingPercent: 0,
      compoundingPercent: 0
    };
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, React.createElement(Icon, {
    name: "Target",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Target Projection")), React.createElement("p", {
    className: "text-xs text-gray-500 mb-5"
  }, "Set a risk-per-trade and a profit target, and see the day-by-day path to it. Risk cuts after a real loss and compounds after a real win, once a day is logged."), React.createElement("div", {
    className: "grid sm:grid-cols-2 gap-4 mb-5"
  }, React.createElement("div", null, React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Risk Per Trade ($)"), React.createElement("input", {
    type: "number",
    value: settings.riskPerTrade || '',
    onChange: function (e) {
      update('riskPerTrade', parseFloat(e.target.value) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white",
    placeholder: "0"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Reward:Risk Ratio"), React.createElement("input", {
    type: "number",
    step: "0.1",
    value: settings.rewardRatio || '',
    onChange: function (e) {
      update('rewardRatio', parseFloat(e.target.value) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white",
    placeholder: "2"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Profit Target ($)"), React.createElement("input", {
    type: "number",
    value: settings.profitTarget || '',
    onChange: function (e) {
      update('profitTarget', parseFloat(e.target.value) || 0);
    },
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white",
    placeholder: "0"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1"
  }, "Daily Profit / Trade"), React.createElement("div", {
    className: "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-green-400 num"
  }, fmt(dailyReward)))), React.createElement("div", {
    className: "grid sm:grid-cols-2 gap-5 mb-6"
  }, React.createElement("div", null, React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, React.createElement("label", {
    className: "text-xs text-gray-400"
  }, "Risk Cutting on a Loss"), React.createElement("span", {
    className: "text-xs text-red-400 num"
  }, settings.riskCuttingPercent, "%")), React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    step: "5",
    value: settings.riskCuttingPercent,
    onChange: function (e) {
      update('riskCuttingPercent', parseInt(e.target.value, 10));
    },
    className: "w-full accent-red-400"
  }), React.createElement("p", {
    className: "text-[11px] text-gray-600 mt-1"
  }, "Shrinks next trade's risk after a logged losing day.")), React.createElement("div", null, React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, React.createElement("label", {
    className: "text-xs text-gray-400"
  }, "Compounding on a Win"), React.createElement("span", {
    className: "text-xs text-green-400 num"
  }, settings.compoundingPercent, "%")), React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    step: "5",
    value: settings.compoundingPercent,
    onChange: function (e) {
      update('compoundingPercent', parseInt(e.target.value, 10));
    },
    className: "w-full accent-green-400"
  }), React.createElement("p", {
    className: "text-[11px] text-gray-600 mt-1"
  }, "Grows next trade's risk after a logged winning day."))), days.length === 0 ? React.createElement("p", {
    className: "text-xs text-gray-600 border border-gray-800 rounded-lg p-4 text-center"
  }, "Fill in risk per trade, reward:risk and a profit target to generate the plan.") : React.createElement(React.Fragment, null, React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5"
  }, React.createElement(MiniStat, {
    label: "Trading Days to Target",
    value: String(days.length),
    color: "text-blue-400"
  }), React.createElement(MiniStat, {
    label: "Daily Reward",
    value: fmt(dailyReward),
    color: "text-yellow-400"
  }), React.createElement(MiniStat, {
    label: "Progress (Logged Days)",
    value: progressPct.toFixed(1) + '%',
    color: "text-green-400"
  }), React.createElement(MiniStat, {
    label: "Days Logged So Far",
    value: loggedDaysInPlan + ' of ' + days.length,
    color: "text-purple-400"
  })), React.createElement("div", {
    className: "overflow-x-auto -mx-2"
  }, React.createElement("table", {
    className: "w-full text-xs min-w-[640px]"
  }, React.createElement("thead", null, React.createElement("tr", {
    className: "text-gray-500 border-b border-gray-800"
  }, React.createElement("th", {
    className: "text-left px-2 py-2 font-medium"
  }, "Day"), React.createElement("th", {
    className: "text-center px-2 py-2 font-medium"
  }, "Risk"), React.createElement("th", {
    className: "text-center px-2 py-2 font-medium"
  }, "Expected Profit"), React.createElement("th", {
    className: "text-center px-2 py-2 font-medium"
  }, "Progress to Goal"), React.createElement("th", {
    className: "text-center px-2 py-2 font-medium"
  }, "Actual Result"))), React.createElement("tbody", null, days.map(function (d) {
    const pct = target > 0 ? Math.min(100, d.targetExpectation / target * 100) : 0;
    const reached = d.targetExpectation >= target;
    return React.createElement("tr", {
      key: d.date,
      className: "border-b border-gray-900 hover:bg-white/[0.02]"
    }, React.createElement("td", {
      className: "px-2 py-2 text-gray-300"
    }, React.createElement("div", {
      className: "font-medium"
    }, d.date), React.createElement("div", {
      className: "text-[10px] text-gray-600"
    }, "Day ", d.dayNumber)), React.createElement("td", {
      className: "px-2 py-2 text-center text-blue-400 num"
    }, fmt(d.risk)), React.createElement("td", {
      className: "px-2 py-2 text-center text-green-400 num"
    }, fmt(d.reward)), React.createElement("td", {
      className: "px-2 py-2 text-center"
    }, React.createElement("div", {
      className: "num font-semibold " + (reached ? 'text-green-400' : 'text-yellow-400')
    }, fmt(d.targetExpectation)), React.createElement("div", {
      className: "h-1.5 bg-gray-800 rounded-full overflow-hidden mt-1"
    }, React.createElement("div", {
      className: "h-full rounded-full " + (reached ? 'bg-green-400' : 'bg-yellow-400'),
      style: {
        width: Math.max(2, pct) + '%'
      }
    }))), React.createElement("td", {
      className: "px-2 py-2 text-center num"
    }, d.hasActual ? React.createElement("span", {
      className: d.actualPnl > 0 ? 'text-green-400' : d.actualPnl < 0 ? 'text-red-400' : 'text-gray-400'
    }, d.actualPnl > 0 ? '+' : '', fmt(d.actualPnl)) : React.createElement("span", {
      className: "text-gray-700"
    }, "-")));
  }))))));
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-4"
  }, React.createElement(Icon, {
    name: "Receipt",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Costs")), React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2"
  }, React.createElement(MiniStat, {
    label: "Challenge Cost",
    value: fmt(account.accountCost),
    color: "text-red-400"
  }), showActivation && React.createElement(MiniStat, {
    label: "Activation Cost",
    value: fmt(account.activationCost),
    color: "text-red-400"
  }), showReset && React.createElement(MiniStat, {
    label: "Reset Cost",
    value: fmt(account.resetCost),
    color: "text-red-400"
  }), React.createElement(MiniStat, {
    label: "Total Costs",
    value: fmt(totalCosts),
    color: "text-red-400"
  }), React.createElement(MiniStat, {
    label: "Total Payouts",
    value: fmt(totalPayouts),
    color: "text-green-400"
  }), React.createElement(MiniStat, {
    label: "Net Profitability",
    value: fmt(profitability),
    color: profitability >= 0 ? 'text-green-400' : 'text-red-400'
  })));
}
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
  return React.createElement(React.Fragment, null, React.createElement(MiniStat, {
    label: "Consistency Required",
    value: account.consistencyPct ? account.consistencyPct + "%" : 'Not set',
    color: "text-purple-400"
  }), React.createElement(MiniStat, {
    label: "Max Profit Allowed / Day",
    value: account.consistencyPct ? cap !== null ? fmt(cap) : guideline !== null ? fmt(guideline) : 'Add a profit target' : '-',
    color: "text-yellow-400"
  }), React.createElement(MiniStat, {
    label: "Daily Loss Limit",
    value: dll ? fmt(dll) : 'Not set',
    color: "text-red-400"
  }), React.createElement(MiniStat, {
    label: "DLL Type",
    value: dll ? account.dllType === 'hard' ? 'Hard Breach' : 'Soft Breach' : '-',
    color: dll && account.dllType === 'hard' ? 'text-red-400' : 'text-yellow-400'
  }), minDays !== null && React.createElement(MiniStat, {
    label: "Trading Days (min)",
    value: daysTraded + " of " + minDays,
    color: daysTraded >= minDays ? 'text-green-400' : 'text-yellow-400'
  }));
}
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
  return React.createElement("div", {
    className: "mt-3 space-y-1.5"
  }, cap === null ? guideline !== null ? React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "You have no profitable days logged yet, so this is a starter number: ", fmt(guideline), " is ", account.consistencyPct, "% of your ", fmt(parseFloat(account.profitTarget) || 0), " profit target. It switches to a real cap the moment you log your first profitable day.") : React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Add a profit target on this account and we'll give you a starter max-per-day number here, before you've even logged your first profitable day.") : React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "How this number is worked out: your ", account.consistencyPct, "% rule means no single day can be more than ", account.consistencyPct, "% of your total profit. Cumulative profit before today is ", React.createElement("span", {
    className: "text-white font-medium"
  }, fmt(cumBefore)), ", so today's cap is ", React.createElement("span", {
    className: "text-yellow-400 font-medium"
  }, fmt(cap)), " - the amount that would keep today at exactly ", account.consistencyPct, "% of the new total."), todayWithin !== null && React.createElement("p", {
    className: "text-xs flex items-center gap-1.5 " + (todayWithin ? 'text-green-400' : 'text-red-400')
  }, React.createElement(Icon, {
    name: todayWithin ? "CheckCircle" : "AlertTriangle",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Today's logged P&L is ", fmt(todaysPnl), " - ", todayWithin ? 'within' : 'OVER', " the ", fmt(cap), " cap.")));
}
function PayoutTypeSelector(props) {
  const value = props.value;
  const onChange = props.onChange;
  return React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-2"
  }, PAYOUT_TYPES.map(function (t) {
    return React.createElement("button", {
      key: t.key,
      type: "button",
      onClick: function () {
        onChange(t.key);
      },
      className: "text-left p-2.5 rounded-lg border text-xs transition " + (value === t.key ? 'bg-yellow-500/15 border-yellow-500/50 text-yellow-200' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600')
    }, React.createElement("div", {
      className: "font-semibold"
    }, t.label), React.createElement("div", {
      className: "text-[10px] text-gray-500 mt-0.5"
    }, t.firms));
  }));
}
function PayoutTypeFieldset(props) {
  const type = props.type;
  const get = props.get;
  const set = props.set;
  const cls = "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400/50 outline-none";
  if (type === 'streak') {
    return React.createElement("div", {
      className: "grid grid-cols-2 gap-3"
    }, React.createElement(Field, {
      label: "Qualifying Days Needed"
    }, React.createElement("input", {
      type: "number",
      value: get('streakDays'),
      onChange: function (e) {
        set('streakDays', e.target.value);
      },
      placeholder: "e.g. 5",
      className: cls
    })), React.createElement(Field, {
      label: "Min Profit / Qualifying Day ($)"
    }, React.createElement("input", {
      type: "number",
      value: get('streakDayMin'),
      onChange: function (e) {
        set('streakDayMin', e.target.value);
      },
      placeholder: "e.g. 200",
      className: cls
    })), React.createElement(Field, {
      label: "Payout (% of Total Profit)"
    }, React.createElement("input", {
      type: "number",
      value: get('streakPctOfTotal'),
      onChange: function (e) {
        set('streakPctOfTotal', e.target.value);
      },
      placeholder: "e.g. 50",
      className: cls
    })), React.createElement(Field, {
      label: "Flat Cap ($, optional)"
    }, React.createElement("input", {
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
    return React.createElement("div", {
      className: "grid grid-cols-2 gap-3"
    }, React.createElement(Field, {
      label: "Buffer Before First Payout ($)"
    }, React.createElement("input", {
      type: "number",
      value: get('formulaBuffer'),
      onChange: function (e) {
        set('formulaBuffer', e.target.value);
      },
      placeholder: "e.g. 1000",
      className: cls
    })), React.createElement(Field, {
      label: "Cycle Profit Multiplier"
    }, React.createElement("input", {
      type: "number",
      step: "0.1",
      value: get('formulaMultiplier'),
      onChange: function (e) {
        set('formulaMultiplier', e.target.value);
      },
      placeholder: "e.g. 2",
      className: cls
    })), React.createElement(Field, {
      label: "Payout Cap ($)"
    }, React.createElement("input", {
      type: "number",
      value: get('formulaCap'),
      onChange: function (e) {
        set('formulaCap', e.target.value);
      },
      placeholder: "e.g. 1500",
      className: cls
    })), React.createElement(Field, {
      label: "Minimum Payout ($)"
    }, React.createElement("input", {
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
    return React.createElement("div", {
      className: "grid grid-cols-2 gap-3"
    }, React.createElement(Field, {
      label: "Target Per Leg ($)"
    }, React.createElement("input", {
      type: "number",
      value: get('twoLegTarget'),
      onChange: function (e) {
        set('twoLegTarget', e.target.value);
      },
      placeholder: "e.g. 3000",
      className: cls
    })), React.createElement(Field, {
      label: "Cash Payout ($)"
    }, React.createElement("input", {
      type: "number",
      value: get('twoLegCashPayout'),
      onChange: function (e) {
        set('twoLegCashPayout', e.target.value);
      },
      placeholder: "e.g. 1500",
      className: cls
    })), React.createElement(Field, {
      label: "Live Account Credit ($)"
    }, React.createElement("input", {
      type: "number",
      value: get('twoLegLiveCredit'),
      onChange: function (e) {
        set('twoLegLiveCredit', e.target.value);
      },
      placeholder: "e.g. 50000",
      className: cls
    })));
  }
  return React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, React.createElement(Field, {
    label: "First Payout Buffer ($)"
  }, React.createElement("input", {
    type: "number",
    value: get('payoutBuffer'),
    onChange: function (e) {
      set('payoutBuffer', e.target.value);
    },
    placeholder: "e.g. 1100",
    className: cls
  })), React.createElement(Field, {
    label: "Each Payout After That ($)"
  }, React.createElement("input", {
    type: "number",
    value: get('payoutThreshold'),
    onChange: function (e) {
      set('payoutThreshold', e.target.value);
    },
    placeholder: "e.g. 500",
    className: cls
  })), React.createElement(Field, {
    label: "Your Profit Split (%)"
  }, React.createElement("input", {
    type: "number",
    value: get('profitSplit'),
    onChange: function (e) {
      set('profitSplit', e.target.value);
    },
    placeholder: "e.g. 90",
    className: cls
  })), React.createElement(Field, {
    label: "Min Qualifying Days (optional)"
  }, React.createElement("input", {
    type: "number",
    value: get('minQualifyingDays'),
    onChange: function (e) {
      set('minQualifyingDays', e.target.value);
    },
    placeholder: "leave blank if none",
    className: cls
  })), React.createElement(Field, {
    label: "Payout Cap ($, optional)"
  }, React.createElement("input", {
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
  return React.createElement("div", {
    className: "space-y-3"
  }, React.createElement(PayoutTypeSelector, {
    value: type,
    onChange: setType
  }), React.createElement("p", {
    className: "text-xs text-gray-500"
  }, (PAYOUT_TYPES.find(function (t) {
    return t.key === type;
  }) || {}).desc), React.createElement(PayoutTypeFieldset, {
    type: type,
    get: get,
    set: set
  }), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("button", {
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
  }, "Save Payout Rules"), onCancel && React.createElement("button", {
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
    return React.createElement("div", {
      className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
    }, React.createElement("div", {
      className: "flex items-center gap-2 mb-1"
    }, React.createElement(Icon, {
      name: "Calendar",
      className: "h-5 w-5 text-yellow-400"
    }), React.createElement("h2", {
      className: "text-lg font-semibold text-white"
    }, "Payout Rules")), React.createElement("p", {
      className: "text-xs text-gray-500 mb-4"
    }, hasRules ? 'Update the payout rules for this account.' : "Pick how this firm actually pays out, fill in its numbers once, and we'll track exactly how close you are to your next payout - and tell you the moment it's due."), React.createElement(PayoutRulesForm, {
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-4 flex-wrap gap-2"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "Calendar",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Payout Tracker"), React.createElement("span", {
    className: "text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
  }, typeInfo.label)), React.createElement("button", {
    onClick: function () {
      setEditing(true);
    },
    className: "text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
  }, React.createElement(Icon, {
    name: "Pencil",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Edit Rules"))), status.eligible ? React.createElement("div", {
    className: "border border-green-500/40 bg-green-500/10 rounded-xl p-4 flex items-start gap-3 mb-4"
  }, React.createElement(Icon, {
    name: "CheckCircle",
    className: "h-5 w-5 text-green-400 mt-0.5 flex-shrink-0"
  }), React.createElement("div", null, React.createElement("p", {
    className: "text-green-300 font-semibold text-sm"
  }, "Payout Ready - ", fmt(status.requestable), " Available"), React.createElement("p", {
    className: "text-green-200/70 text-xs mt-1"
  }, status.note, " Log into your prop firm's own dashboard and submit the request there - this journal tracks it, it doesn't send it for you. Once it's paid, add it below in the Payout Ledger so the next cycle starts counting from today."))) : React.createElement("div", {
    className: "border border-yellow-500/30 bg-yellow-500/10 rounded-xl p-4 flex items-start gap-3 mb-4"
  }, React.createElement(Icon, {
    name: "Clock",
    className: "h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0"
  }), React.createElement("div", null, React.createElement("p", {
    className: "text-yellow-300 font-semibold text-sm"
  }, status.isFirstPayout ? 'Building Toward Your First Payout' : 'Building Toward Your Next Payout'), React.createElement("p", {
    className: "text-yellow-200/70 text-xs mt-1"
  }, status.note))), React.createElement("div", {
    className: "mb-1 flex justify-between text-xs text-gray-500"
  }, React.createElement("span", null, status.progressLabel), React.createElement("span", null, status.progressPct.toFixed(0), "%")), React.createElement("div", {
    className: "h-2.5 bg-gray-800 rounded-full overflow-hidden mb-4"
  }, React.createElement("div", {
    className: "h-full rounded-full " + (status.eligible ? 'bg-green-400' : 'bg-yellow-400'),
    style: {
      width: Math.max(2, status.progressPct) + '%'
    }
  })), React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-2"
  }, React.createElement(MiniStat, {
    label: "Requestable Now",
    value: fmt(status.requestable),
    color: status.requestable > 0 ? 'text-green-400' : 'text-gray-500'
  }), status.split ? React.createElement(MiniStat, {
    label: "Your Split",
    value: status.split + "%",
    color: "text-purple-400"
  }) : null, status.cap ? React.createElement(MiniStat, {
    label: "Payout Cap",
    value: fmt(status.cap),
    color: "text-gray-400"
  }) : null, status.liveCredit ? React.createElement(MiniStat, {
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-4"
  }, React.createElement(Icon, {
    name: "Banknote",
    className: "h-5 w-5 text-green-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Payout Ledger")), suggestedAmount > 0 && React.createElement("button", {
    onClick: function () {
      setAmount(suggestedAmount.toFixed(2));
    },
    className: "text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg mb-3"
  }, "Use tracked amount: ", fmt(suggestedAmount)), React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-2 mb-4"
  }, React.createElement("input", {
    type: "date",
    value: date,
    onChange: function (e) {
      setDate(e.target.value);
    },
    className: "bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
  }), React.createElement("input", {
    type: "number",
    placeholder: "Payout amount",
    value: amount,
    onChange: function (e) {
      setAmount(e.target.value);
    },
    className: "flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
  }), React.createElement("button", {
    onClick: function () {
      if (!amount) return;
      onAddPayout({
        amount: amount,
        date: date
      });
      setAmount('');
    },
    className: "bg-green-500/20 text-green-400 border border-green-500/40 px-4 py-2 rounded-lg text-sm font-medium"
  }, "Add Payout")), React.createElement("div", {
    className: "space-y-1.5"
  }, payouts.slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  }).map(function (p, i) {
    return React.createElement("div", {
      key: i,
      className: "flex justify-between text-sm bg-black/30 rounded-lg px-3 py-2"
    }, React.createElement("span", {
      className: "text-gray-400"
    }, p.date), React.createElement("span", {
      className: "text-green-400 font-semibold"
    }, fmt(parseFloat(p.amount))));
  }), payouts.length === 0 && React.createElement("p", {
    className: "text-xs text-gray-600"
  }, "No payouts recorded yet.")));
}
function EquityCurve(props) {
  const points = props.points;
  const floorPoints = props.floorPoints;
  const startingAmount = props.startingAmount;
  const targetAmount = props.targetAmount;
  if (!points || points.length < 2) return React.createElement("p", {
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
  return React.createElement("div", null, React.createElement("div", {
    className: "overflow-x-auto"
  }, React.createElement("svg", {
    viewBox: "0 0 " + w + " " + h,
    className: "w-full",
    style: {
      minWidth: '500px',
      height: '260px'
    }
  }, startY !== null && React.createElement(React.Fragment, null, React.createElement("line", {
    x1: padL,
    y1: startY,
    x2: w - padR,
    y2: startY,
    stroke: "#60a5fa",
    strokeDasharray: "3 3",
    strokeWidth: "1"
  }), React.createElement("text", {
    x: padL - 6,
    y: startY + 3,
    fill: "#60a5fa",
    fontSize: "9",
    textAnchor: "end"
  }, "Start")), targetY !== null && React.createElement(React.Fragment, null, React.createElement("line", {
    x1: padL,
    y1: targetY,
    x2: w - padR,
    y2: targetY,
    stroke: "#facc15",
    strokeDasharray: "3 3",
    strokeWidth: "1"
  }), React.createElement("text", {
    x: padL - 6,
    y: targetY + 3,
    fill: "#facc15",
    fontSize: "9",
    textAnchor: "end"
  }, "Target")), floorPathD && React.createElement("path", {
    d: floorPathD,
    fill: "none",
    stroke: "#f87171",
    strokeWidth: "1.5",
    strokeDasharray: "5 3"
  }), lastFloor && React.createElement("circle", {
    cx: lastFloor.x,
    cy: lastFloor.y,
    r: "3",
    fill: "#f87171"
  }), React.createElement("path", {
    d: pathD,
    fill: "none",
    stroke: lineColor,
    strokeWidth: "2.5"
  }), React.createElement("circle", {
    cx: last.x,
    cy: last.y,
    r: "4",
    fill: lineColor
  }), React.createElement("text", {
    x: padL,
    y: h - 10,
    fill: "#6b7280",
    fontSize: "10"
  }, coords[0].date), React.createElement("text", {
    x: w - padR,
    y: h - 10,
    fill: "#6b7280",
    fontSize: "10",
    textAnchor: "end"
  }, last.date), React.createElement("text", {
    x: last.x,
    y: last.y - 10,
    fill: lineColor,
    fontSize: "11",
    fontWeight: "600",
    textAnchor: "end"
  }, fmt(last.cum)))), React.createElement("div", {
    className: "flex items-center gap-4 flex-wrap mt-2 text-[11px] text-gray-500"
  }, startingAmount !== null && startingAmount !== undefined && React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, React.createElement("span", {
    className: "inline-block w-3 h-0.5",
    style: {
      borderTop: '1.5px dashed #60a5fa'
    }
  }), "Starting balance (", fmt(startingAmount), ")"), hasFloor && React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, React.createElement("span", {
    className: "inline-block w-3 h-0.5",
    style: {
      borderTop: '1.5px dashed #f87171'
    }
  }), "Trailing floor - breach if Balance touches this"), targetAmount !== null && targetAmount !== undefined && React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, React.createElement("span", {
    className: "inline-block w-3 h-0.5",
    style: {
      borderTop: '1.5px dashed #facc15'
    }
  }), "Target (", fmt(targetAmount), ")"), React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, React.createElement("span", {
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
  const accountIds = {};
  const breachedIds = {};
  accounts.forEach(function (a) {
    accountIds[a.id] = true;
    if (computeAccountStatus(a, entries) === 'breached') breachedIds[a.id] = true;
  });
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
function OverviewStats(props) {
  const accounts = props.accounts;
  const entries = props.entries;
  const d = computeOverviewData(accounts, entries);
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 space-y-4"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "LayoutDashboard",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "All Accounts, Combined")), React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-3"
  }, React.createElement(MiniStat, {
    label: "Total P&L",
    value: fmt(d.totalPnl),
    color: d.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
  }), React.createElement(MiniStat, {
    label: "Win Rate",
    value: d.totalTrades === 0 ? '-' : d.overallWinRate.toFixed(1) + '%',
    color: d.totalTrades === 0 ? 'text-gray-500' : d.overallWinRate >= 50 ? 'text-green-400' : 'text-red-400'
  }), React.createElement(MiniStat, {
    label: "Profit Factor",
    value: d.profitFactor === null ? '-' : d.profitFactor.toFixed(2),
    color: d.profitFactor === null ? 'text-gray-500' : d.profitFactor >= 1 ? 'text-green-400' : 'text-red-400'
  }), React.createElement(MiniStat, {
    label: "Day Win Rate",
    value: d.dayWinRate === null ? '-' : d.dayWinRate.toFixed(0) + '%',
    color: d.dayWinRate === null ? 'text-gray-500' : d.dayWinRate >= 50 ? 'text-green-400' : 'text-red-400'
  }), React.createElement(MiniStat, {
    label: "Avg Win",
    value: d.avgWin === null ? '-' : fmt(d.avgWin),
    color: "text-green-400"
  }), React.createElement(MiniStat, {
    label: "Avg Loss",
    value: d.avgLoss === null ? '-' : fmt(d.avgLoss),
    color: "text-red-400"
  }), React.createElement(MiniStat, {
    label: "Expectancy / Trade",
    value: d.expectancy === null ? '-' : fmt(d.expectancy),
    color: d.expectancy === null ? 'text-gray-500' : d.expectancy >= 0 ? 'text-green-400' : 'text-red-400'
  }), React.createElement(MiniStat, {
    label: "Rule Adherence",
    value: d.ruleAdherencePct === null ? '-' : d.ruleAdherencePct.toFixed(1) + '%',
    color: "text-purple-400"
  }), React.createElement(MiniStat, {
    label: "Total Trades",
    value: String(d.totalTrades),
    color: "text-white"
  }), React.createElement(MiniStat, {
    label: "Total Costs",
    value: fmt(d.totalAllCosts),
    color: "text-red-400"
  }), React.createElement(MiniStat, {
    label: "Total Payouts",
    value: fmt(d.totalAllPayouts),
    color: "text-green-400"
  })), (d.bestDay || d.worstDay) && React.createElement("div", {
    className: "grid grid-cols-2 gap-3 text-xs text-gray-400 pt-1"
  }, d.bestDay && React.createElement("div", null, "Best day: ", React.createElement("span", {
    className: "text-green-400 font-medium"
  }, d.bestDay), " (", fmt(d.byDate[d.bestDay]), ")"), d.worstDay && React.createElement("div", null, "Worst day: ", React.createElement("span", {
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "Calendar",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Trading Calendar")), React.createElement("div", {
    className: "flex items-center gap-3"
  }, React.createElement("span", {
    className: "text-xs text-gray-500"
  }, greenDays, " green - ", redDays, " red"), React.createElement("div", {
    className: "flex items-center gap-1"
  }, React.createElement("button", {
    onClick: function () {
      setMonthOffset(monthOffset - 1);
    },
    className: "text-gray-500 hover:text-white p-1"
  }, React.createElement(Icon, {
    name: "ChevronLeft",
    className: "h-4 w-4"
  })), React.createElement("span", {
    className: "text-sm text-white font-medium w-32 text-center num"
  }, monthLabel), React.createElement("button", {
    onClick: function () {
      setMonthOffset(Math.min(monthOffset + 1, 0));
    },
    disabled: monthOffset >= 0,
    className: "text-gray-500 hover:text-white disabled:opacity-20 p-1"
  }, React.createElement(Icon, {
    name: "ChevronRight",
    className: "h-4 w-4"
  }))))), React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, React.createElement("span", {
    className: "num text-sm font-semibold " + (monthTotal >= 0 ? 'text-green-400' : 'text-red-400')
  }, viewMode === 'privacy' ? '••••' : (monthTotal >= 0 ? '+' : '') + fmt(monthTotal), " this month")), React.createElement("div", {
    className: "grid grid-cols-7 gap-1.5 text-center text-[10px] text-gray-600 mb-1.5"
  }, ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(function (lbl, i) {
    return React.createElement("div", {
      key: i
    }, lbl);
  })), React.createElement("div", {
    className: "grid grid-cols-7 gap-1.5"
  }, cells.map(function (day, i) {
    if (!day) return React.createElement("div", {
      key: i
    });
    const key = dateKey(day);
    const pnl = d.byDate[key];
    const hasData = pnl !== undefined;
    const intensity = hasData ? Math.min(Math.abs(pnl) / maxAbs, 1) : 0;
    const bg = !hasData ? '#111827' : pnl > 0 ? 'rgba(74, 222, 128, ' + (0.18 + intensity * 0.62) + ')' : pnl < 0 ? 'rgba(248, 113, 113, ' + (0.18 + intensity * 0.62) + ')' : '#374151';
    return React.createElement("div", {
      key: i,
      className: "aspect-square rounded-md flex flex-col items-center justify-center border border-gray-800/60 px-0.5",
      style: {
        backgroundColor: bg
      }
    }, React.createElement("span", {
      className: "text-[10px] text-gray-400 leading-none"
    }, day), hasData && React.createElement("span", {
      className: "num text-[9px] font-semibold text-white leading-tight mt-0.5"
    }, viewMode === 'privacy' ? '••' : fmtView(pnl, viewMode, viewContext).replace('.00', '')));
  })));
}
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden"
  }, React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between p-6 text-left"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "ListOrdered",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Closed Trades"), React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "(", rows.length, ")")), React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-gray-500 flex-shrink-0"
  })), open && React.createElement("div", {
    className: "px-6 pb-6 overflow-x-auto"
  }, React.createElement("table", {
    className: "w-full text-sm whitespace-nowrap"
  }, React.createElement("thead", null, React.createElement("tr", {
    className: "text-left text-gray-500 text-xs border-b border-gray-800"
  }, React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Symbol"), React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Volume"), React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Open Time"), React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Avg Entry"), React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Bias"), React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Duration"), React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Close Time"), React.createElement("th", {
    className: "pb-2 pr-4"
  }, "Avg Close"), React.createElement("th", {
    className: "pb-2 text-right"
  }, "Profit"))), React.createElement("tbody", null, rows.map(function (t, i) {
    const pnlVal = tradeSignedPnl(t);
    return React.createElement("tr", {
      key: i,
      className: "border-b border-gray-800/50 last:border-0"
    }, React.createElement("td", {
      className: "py-2 pr-4 text-white font-medium"
    }, t.symbol || '-'), React.createElement("td", {
      className: "py-2 pr-4 text-gray-300"
    }, t.positionSize || '-'), React.createElement("td", {
      className: "py-2 pr-4 text-gray-400"
    }, fmtTime(t.openTime)), React.createElement("td", {
      className: "py-2 pr-4 num text-gray-300"
    }, t.entryPrice ? t.entryPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2
    }) : '-'), React.createElement("td", {
      className: "py-2 pr-4"
    }, React.createElement("span", {
      className: "text-[10px] px-1.5 py-0.5 rounded font-semibold " + (t.direction === 'long' ? 'bg-blue-500/15 text-blue-300' : 'bg-red-500/15 text-red-300')
    }, t.direction === 'long' ? 'LONG' : 'SHORT')), React.createElement("td", {
      className: "py-2 pr-4 text-gray-400"
    }, fmtDuration(t.closeTime - t.openTime)), React.createElement("td", {
      className: "py-2 pr-4 text-gray-400"
    }, fmtTime(t.closeTime)), React.createElement("td", {
      className: "py-2 pr-4 num text-gray-300"
    }, t.exitPrice ? t.exitPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2
    }) : '-'), React.createElement("td", {
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden"
  }, React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between p-6 text-left"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "BarChart3",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("div", null, React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Reports"), React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Win rate and P&L broken down by weekday, bias, market, and strategy"))), React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-gray-500 flex-shrink-0"
  })), open && React.createElement("div", {
    className: "px-6 pb-6"
  }, React.createElement("div", {
    className: "flex gap-2 mb-3 flex-wrap"
  }, Object.keys(reports).map(function (key) {
    return React.createElement("button", {
      key: key,
      onClick: function () {
        setActiveReport(key);
      },
      className: "px-3 py-1.5 rounded-lg text-xs font-medium border transition " + (activeReport === key ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700')
    }, reports[key].label);
  })), keys.length === 0 ? React.createElement("p", {
    className: "text-xs text-gray-600"
  }, "Not enough logged trades for this report yet.") : React.createElement("div", {
    className: "space-y-1.5"
  }, keys.map(function (key) {
    const g = current.groups[key];
    const total = g.wins + g.losses;
    const wr = total > 0 ? g.wins / total * 100 : 0;
    return React.createElement("div", {
      key: key,
      className: "flex items-center justify-between text-sm bg-black/30 rounded-lg px-3 py-2"
    }, React.createElement("span", {
      className: "text-gray-300"
    }, key), React.createElement("div", {
      className: "flex items-center gap-4"
    }, React.createElement("span", {
      className: "text-xs text-gray-500"
    }, total, " trade", total !== 1 ? 's' : ''), React.createElement("span", {
      className: "num text-xs " + (wr >= 50 ? 'text-green-400' : 'text-red-400')
    }, wr.toFixed(0), "% WR"), React.createElement("span", {
      className: "num font-semibold " + (g.pnl >= 0 ? 'text-green-400' : 'text-red-400')
    }, fmt(g.pnl))));
  }))));
}
function EquityCurveBlock(props) {
  const accounts = props.accounts;
  const entries = props.entries;
  const d = computeOverviewData(accounts, entries);
  const singleAccount = accounts.length === 1 ? accounts[0] : null;
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-4"
  }, React.createElement(Icon, {
    name: "LineChart",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Equity Curve", singleAccount ? ' - ' + singleAccount.name : accounts.length > 0 ? ' - ' + accounts.length + ' Accounts Combined' : '')), React.createElement(EquityCurve, {
    points: equityPointsForChart,
    floorPoints: floorPoints,
    startingAmount: startingAmount,
    targetAmount: targetAmount
  }), !singleAccount && accounts.length > 1 && React.createElement("p", {
    className: "text-xs text-gray-600 mt-2"
  }, "The starting/floor/target lines only show for a single selected account, since each account's buffer and target are different numbers - select just one above to see them."));
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden"
  }, React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between p-6 text-left"
  }, React.createElement("div", {
    className: "flex items-center gap-3"
  }, React.createElement("div", {
    className: "relative w-12 h-12 flex-shrink-0"
  }, React.createElement("svg", {
    viewBox: "0 0 36 36",
    className: "w-12 h-12 -rotate-90"
  }, React.createElement("circle", {
    cx: "18",
    cy: "18",
    r: "15.5",
    fill: "none",
    stroke: "#1f2937",
    strokeWidth: "3"
  }), React.createElement("circle", {
    cx: "18",
    cy: "18",
    r: "15.5",
    fill: "none",
    stroke: scoreColor,
    strokeWidth: "3",
    strokeDasharray: ringDash + " " + ringCirc,
    strokeLinecap: "round"
  })), React.createElement("span", {
    className: "num absolute inset-0 flex items-center justify-center text-xs font-bold " + scoreTextCls
  }, disc.score.toFixed(0))), React.createElement("div", null, React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Your Discipline Checklist"), React.createElement("p", {
    className: "text-xs text-gray-500"
  }, passing.length, " of ", withData.length, " tracked questions above 70%"))), React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-gray-500 flex-shrink-0"
  })), open && React.createElement("div", {
    className: "px-6 pb-6 space-y-3"
  }, React.createElement("p", {
    className: "text-xs text-gray-500 -mt-1 mb-1"
  }, "Each question only counts once you have data for it, so one you haven't triggered yet won't drag your score down."), questions.map(function (q, i) {
    const hasData = q.value !== null && q.value !== undefined;
    const barColor = !hasData ? 'bg-gray-700' : q.value >= 70 ? 'bg-green-400' : q.value >= 40 ? 'bg-yellow-400' : 'bg-red-400';
    const textColor = !hasData ? 'text-gray-600' : q.value >= 70 ? 'text-green-400' : q.value >= 40 ? 'text-yellow-400' : 'text-red-400';
    return React.createElement("div", {
      key: i
    }, React.createElement("div", {
      className: "flex items-center justify-between text-xs mb-1"
    }, React.createElement("span", {
      className: "text-gray-300"
    }, q.label, q.sub && React.createElement("span", {
      className: "text-gray-600 ml-1"
    }, "(", q.sub, ")")), React.createElement("span", {
      className: textColor + " font-semibold flex-shrink-0 ml-2"
    }, hasData ? q.value.toFixed(0) + '%' : 'No data yet')), React.createElement("div", {
      className: "w-full bg-gray-800 rounded-full h-1.5 overflow-hidden"
    }, React.createElement("div", {
      className: "h-full rounded-full transition-all " + barColor,
      style: {
        width: (hasData ? q.value : 0) + '%'
      }
    })));
  })));
}
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden"
  }, React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between p-6 text-left"
  }, React.createElement("div", {
    className: "flex items-center gap-3"
  }, React.createElement(Icon, {
    name: "BookOpen",
    className: "h-5 w-5 text-purple-400 flex-shrink-0"
  }), React.createElement("div", null, React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Discipline & Psychology Log"), React.createElement("p", {
    className: "text-xs text-gray-500"
  }, withReflection.length, " reflection", withReflection.length !== 1 ? 's' : '', " logged", avgMental !== null && React.createElement("span", null, " - avg mental check ", React.createElement("span", {
    className: avgColor
  }, avgMental.toFixed(0), "/40"))))), React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-gray-500 flex-shrink-0"
  })), open && React.createElement("div", {
    className: "px-6 pb-6 space-y-3"
  }, withReflection.length === 0 ? React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "No written reflections yet - fill in the \"Discipline & Psychology Reflection\" section next time you log a day to start the log.") : withReflection.map(function (e) {
    const r = e.reflection;
    return React.createElement("div", {
      key: e.id,
      className: "bg-black/30 border border-gray-800 rounded-lg p-3 space-y-1.5"
    }, React.createElement("div", {
      className: "flex items-center justify-between text-[11px] text-gray-500"
    }, React.createElement("span", {
      className: "num"
    }, e.date), r.emotionalState && React.createElement("span", {
      className: "capitalize px-2 py-0.5 rounded-full bg-gray-800 text-gray-400"
    }, r.emotionalState)), r.wentRight && React.createElement("p", {
      className: "text-xs text-gray-300"
    }, React.createElement("span", {
      className: "text-green-400 font-medium"
    }, "Right: "), r.wentRight), r.wentWrong && React.createElement("p", {
      className: "text-xs text-gray-300"
    }, React.createElement("span", {
      className: "text-red-400 font-medium"
    }, "Wrong: "), r.wentWrong), r.lessonsLearned && React.createElement("p", {
      className: "text-xs text-gray-300"
    }, React.createElement("span", {
      className: "text-blue-400 font-medium"
    }, "Lesson: "), r.lessonsLearned), r.improvementPlan && React.createElement("p", {
      className: "text-xs text-gray-300"
    }, React.createElement("span", {
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
    async function loadAll() {
      try {
        const [namesSnap, accountsSnap, entriesSnap] = await Promise.all([db.collection('leaderboard').get(), db.collectionGroup('accounts').get(), db.collectionGroup('entries').get()]);
        const namesByUid = {};
        namesSnap.forEach(function (d) {
          const data = d.data();
          if (data.displayName) namesByUid[d.id] = data.displayName;
        });
        const accountsByUid = {};
        accountsSnap.forEach(function (d) {
          const uid = d.ref.parent.parent ? d.ref.parent.parent.id : null;
          if (!uid) return;
          if (!accountsByUid[uid]) accountsByUid[uid] = [];
          accountsByUid[uid].push(Object.assign({
            id: d.id
          }, d.data()));
        });
        const entriesByUid = {};
        entriesSnap.forEach(function (d) {
          const uid = d.ref.parent.parent ? d.ref.parent.parent.id : null;
          if (!uid) return;
          if (!entriesByUid[uid]) entriesByUid[uid] = [];
          entriesByUid[uid].push(Object.assign({
            id: d.id
          }, d.data()));
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
          return r !== null;
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
      return React.createElement("div", {
        className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
      }, React.createElement("div", {
        className: "flex items-center gap-2 mb-2"
      }, React.createElement(Icon, {
        name: "Award",
        className: "h-5 w-5 text-yellow-400"
      }), React.createElement("h2", {
        className: "text-lg font-semibold text-white"
      }, "Discipline Leaderboard")), React.createElement("p", {
        className: "text-xs text-red-400"
      }, "Couldn't load everyone's data - this needs a Firestore rules update to allow reading across users. Check the browser console for the exact error."));
    }
    return null;
  }
  const myIndex = rows.findIndex(function (r) {
    return r.uid === currentUid;
  });
  const myPercentile = myIndex >= 0 ? Math.max(1, Math.round((myIndex + 1) / rows.length * 100)) : null;
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden"
  }, React.createElement("button", {
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between p-6 text-left"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "Award",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Discipline Leaderboard"), React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "(", rows.length, " trader", rows.length !== 1 ? 's' : '', ")")), React.createElement("div", {
    className: "flex items-center gap-3"
  }, myPercentile !== null && React.createElement("span", {
    className: "text-xs text-yellow-400 font-medium hidden sm:inline"
  }, "Rank ", myIndex + 1, " of ", rows.length, " - top ", myPercentile, "%"), React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-4 w-4 text-gray-500"
  }))), open && React.createElement("div", {
    className: "px-6 pb-6"
  }, myPercentile !== null && React.createElement("div", {
    className: "mb-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm"
  }, React.createElement("span", {
    className: "text-yellow-400 font-semibold"
  }, "You are in the top ", myPercentile, "%"), React.createElement("span", {
    className: "text-gray-400"
  }, " - rank ", myIndex + 1, " of ", rows.length, " - score ", rows[myIndex].disciplineScore.toFixed(1))), React.createElement("div", {
    className: "space-y-1.5 max-h-96 overflow-y-auto pr-1"
  }, rows.map(function (r, i) {
    const isMe = r.uid === currentUid;
    const scoreOk = typeof r.disciplineScore === 'number' && isFinite(r.disciplineScore);
    return React.createElement("div", {
      key: r.uid,
      className: "grid items-center gap-3 text-sm rounded-lg px-3 py-2 " + (isMe ? 'bg-yellow-500/15 border border-yellow-500/30' : 'bg-black/30'),
      style: {
        gridTemplateColumns: '2.25rem 1fr auto'
      }
    }, React.createElement("span", {
      className: "text-gray-500 num"
    }, "#", i + 1), React.createElement("span", {
      className: "truncate min-w-0 " + (isMe ? 'text-yellow-300 font-semibold' : 'text-white')
    }, r.displayName || 'Trader', isMe ? ' (you)' : ''), React.createElement("span", {
      className: "num text-green-400 font-semibold bg-green-500/10 border border-green-500/20 rounded-md px-2 py-0.5 flex-shrink-0"
    }, scoreOk ? r.disciplineScore.toFixed(1) : '-'));
  }))));
}
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
  const parseMoney = function (s) {
    if (!s) return null;
    const negative = s.indexOf('(') >= 0;
    const num = parseFloat(s.replace(/[\$,()]/g, ''));
    if (isNaN(num)) return null;
    return negative ? -Math.abs(num) : num;
  };
  const toLocalDate = function (timestampStr) {
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
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
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
  return React.createElement(Modal, {
    onClose: onClose,
    title: "Clean Up Duplicate Days",
    size: "lg"
  }, React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Days with more than one entry - usually from re-importing the same broker file before the overwrite fix. Pick which copy to keep for each day; the others get deleted. Nothing is removed automatically."), dupeDates.length === 0 ? React.createElement("p", {
    className: "text-sm text-green-400 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "CheckCircle",
    className: "h-4 w-4"
  }), React.createElement("span", null, "No duplicate days found on this account.")) : React.createElement("div", {
    className: "space-y-4 max-h-96 overflow-y-auto"
  }, dupeDates.map(function (date) {
    const group = byDate[date];
    return React.createElement("div", {
      key: date,
      className: "border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3"
    }, React.createElement("p", {
      className: "text-sm text-white font-medium mb-2"
    }, date, " - ", group.length, " copies found"), React.createElement("div", {
      className: "space-y-1.5"
    }, group.map(function (entry) {
      const total = (entry.trades || []).reduce(function (s, t) {
        return s + tradeSignedPnl(t);
      }, 0);
      return React.createElement("div", {
        key: entry.id,
        className: "flex items-center justify-between bg-black/30 rounded-lg px-3 py-2 text-xs"
      }, React.createElement("span", {
        className: "text-gray-400"
      }, (entry.trades || []).length, " trade", (entry.trades || []).length !== 1 ? 's' : ''), React.createElement("span", {
        className: "num font-semibold " + (total >= 0 ? 'text-green-400' : 'text-red-400')
      }, fmt(total)), React.createElement("button", {
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
  return React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Import a CSV of trades for ", account.name, " instead of entering them one by one. Expects the same column format as an exported file - export a day first if you need a template."), React.createElement("button", {
    onClick: function () {
      fileRef.current.click();
    },
    className: "w-full flex items-center justify-center gap-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 px-4 py-2.5 rounded-lg text-sm font-medium"
  }, React.createElement(Icon, {
    name: "Upload",
    className: "h-4 w-4"
  }), React.createElement("span", null, "Choose CSV File")), React.createElement("input", {
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
  }), status && React.createElement("p", {
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
function MentalCheckSection(props) {
  const value = props.value;
  const onChange = props.onChange;
  const [open, setOpen] = useState(false);
  const total = mentalCheckTotal(value);
  const scoreColor = total >= 32 ? 'text-green-400' : total >= 20 ? 'text-yellow-400' : 'text-red-400';
  return React.createElement("div", {
    className: "border border-gray-800 rounded-lg overflow-hidden"
  }, React.createElement("button", {
    type: "button",
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between px-3 py-2.5 bg-gray-900/60 text-left"
  }, React.createElement("span", {
    className: "text-sm text-gray-300 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "Brain",
    className: "h-3.5 w-3.5 text-teal-400"
  }), React.createElement("span", null, "Pre-Session Mental Check")), React.createElement("span", {
    className: "flex items-center gap-2"
  }, React.createElement("span", {
    className: "text-xs num font-semibold " + scoreColor
  }, total, "/40"), React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-3.5 w-3.5 text-gray-500"
  }))), open && React.createElement("div", {
    className: "p-3 space-y-3 bg-black/20"
  }, MENTAL_CHECK_SLIDERS.map(function (s) {
    return React.createElement("div", {
      key: s.key
    }, React.createElement("div", {
      className: "flex items-center justify-between mb-0.5"
    }, React.createElement("label", {
      className: "text-xs text-gray-400"
    }, s.label), React.createElement("span", {
      className: "text-xs text-yellow-400 num"
    }, value[s.key], "/10")), React.createElement("input", {
      type: "range",
      min: "1",
      max: "10",
      value: value[s.key],
      onChange: function (e) {
        onChange(s.key, parseInt(e.target.value, 10));
      },
      className: "w-full accent-teal-400"
    }), React.createElement("p", {
      className: "text-[11px] text-gray-600"
    }, s.sub));
  })));
}
function DailyPlanSection(props) {
  const value = props.value;
  const onChange = props.onChange;
  const [open, setOpen] = useState(false);
  const hasPlan = value.riskAmount || value.targetProfit;
  return React.createElement("div", {
    className: "border border-gray-800 rounded-lg overflow-hidden"
  }, React.createElement("button", {
    type: "button",
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between px-3 py-2.5 bg-gray-900/60 text-left"
  }, React.createElement("span", {
    className: "text-sm text-gray-300 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "Calendar",
    className: "h-3.5 w-3.5 text-yellow-400"
  }), React.createElement("span", null, "Daily Plan")), React.createElement("span", {
    className: "flex items-center gap-2"
  }, hasPlan && React.createElement("span", {
    className: "text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300"
  }, "Set"), React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-3.5 w-3.5 text-gray-500"
  }))), open && React.createElement("div", {
    className: "p-3 space-y-3 bg-black/20"
  }, React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Risk Per Trade ($)"), React.createElement("input", {
    type: "number",
    value: value.riskAmount,
    onChange: function (e) {
      onChange('riskAmount', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Target Profit Today ($)"), React.createElement("input", {
    type: "number",
    value: value.targetProfit,
    onChange: function (e) {
      onChange('targetProfit', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Planned Trades"), React.createElement("input", {
    type: "number",
    min: "0",
    max: "3",
    value: value.plannedTrades,
    onChange: function (e) {
      onChange('plannedTrades', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Reward:Risk Ratio"), React.createElement("input", {
    type: "number",
    step: "0.1",
    value: value.riskRewardRatio,
    onChange: function (e) {
      onChange('riskRewardRatio', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Session Start"), React.createElement("input", {
    type: "time",
    value: value.startTime,
    onChange: function (e) {
      onChange('startTime', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Session End"), React.createElement("input", {
    type: "time",
    value: value.endTime,
    onChange: function (e) {
      onChange('endTime', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  }))), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Setups you're allowed to take today"), React.createElement("textarea", {
    value: value.notes,
    onChange: function (e) {
      onChange('notes', e.target.value);
    },
    placeholder: "e.g. only the A+ pullback setup, no counter-trend trades before 10am...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm h-14 focus:border-yellow-400/50 outline-none resize-none"
  }))));
}
function MentalCheckFields(props) {
  const value = props.value;
  const onChange = props.onChange;
  const total = mentalCheckTotal(value);
  const scoreColor = total >= 32 ? 'text-green-400' : total >= 20 ? 'text-yellow-400' : 'text-red-400';
  return React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("div", {
    className: "flex items-center justify-between"
  }, React.createElement("span", {
    className: "text-sm text-gray-400"
  }, "Total"), React.createElement("span", {
    className: "text-sm num font-semibold " + scoreColor
  }, total, "/40")), MENTAL_CHECK_SLIDERS.map(function (s) {
    return React.createElement("div", {
      key: s.key
    }, React.createElement("div", {
      className: "flex items-center justify-between mb-0.5"
    }, React.createElement("label", {
      className: "text-xs text-gray-400"
    }, s.label), React.createElement("span", {
      className: "text-xs text-yellow-400 num"
    }, value[s.key], "/10")), React.createElement("input", {
      type: "range",
      min: "1",
      max: "10",
      value: value[s.key],
      onChange: function (e) {
        onChange(s.key, parseInt(e.target.value, 10));
      },
      className: "w-full accent-teal-400"
    }), React.createElement("p", {
      className: "text-[11px] text-gray-600"
    }, s.sub));
  }));
}
function PlanFieldsGrid(props) {
  const value = props.value;
  const onChange = props.onChange;
  return React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Target Profit Today ($)"), React.createElement("input", {
    type: "number",
    value: value.targetProfit,
    onChange: function (e) {
      onChange('targetProfit', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Planned Trades"), React.createElement("input", {
    type: "number",
    min: "0",
    max: "3",
    value: value.plannedTrades,
    onChange: function (e) {
      onChange('plannedTrades', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Reward:Risk Ratio"), React.createElement("input", {
    type: "number",
    step: "0.1",
    value: value.riskRewardRatio,
    onChange: function (e) {
      onChange('riskRewardRatio', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Max Loss / Day ($)"), React.createElement("input", {
    type: "number",
    value: value.maxLossPerDay,
    onChange: function (e) {
      onChange('maxLossPerDay', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Session Start"), React.createElement("input", {
    type: "time",
    value: value.startTime,
    onChange: function (e) {
      onChange('startTime', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Session End"), React.createElement("input", {
    type: "time",
    value: value.endTime,
    onChange: function (e) {
      onChange('endTime', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
  }))), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Setups you're allowed to take today"), React.createElement("textarea", {
    value: value.notes,
    onChange: function (e) {
      onChange('notes', e.target.value);
    },
    placeholder: "e.g. only the A+ pullback setup, no counter-trend trades before 10am...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm h-14 focus:border-yellow-400/50 outline-none resize-none"
  })));
}
const EMOTIONAL_STATES = ['neutral', 'confident', 'anxious', 'frustrated', 'excited', 'fatigued'];
function ReflectionSection(props) {
  const value = props.value;
  const onChange = props.onChange;
  const [open, setOpen] = useState(false);
  const hasReflection = value.wentWrong || value.wentRight || value.improvementPlan;
  return React.createElement("div", {
    className: "border border-gray-800 rounded-lg overflow-hidden"
  }, React.createElement("button", {
    type: "button",
    onClick: function () {
      setOpen(!open);
    },
    className: "w-full flex items-center justify-between px-3 py-2.5 bg-gray-900/60 text-left"
  }, React.createElement("span", {
    className: "text-sm text-gray-300 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "ListChecks",
    className: "h-3.5 w-3.5 text-purple-400"
  }), React.createElement("span", null, "Discipline & Psychology Reflection")), React.createElement("span", {
    className: "flex items-center gap-2"
  }, hasReflection && React.createElement("span", {
    className: "text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300"
  }, "Filled"), React.createElement(Icon, {
    name: open ? "ChevronUp" : "ChevronDown",
    className: "h-3.5 w-3.5 text-gray-500"
  }))), open && React.createElement("div", {
    className: "p-3 space-y-3 bg-black/20"
  }, React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-red-400 mb-1"
  }, "What went wrong?"), React.createElement("textarea", {
    value: value.wentWrong,
    onChange: function (e) {
      onChange('wentWrong', e.target.value);
    },
    placeholder: "Mistakes, emotional decisions, rule breaks...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm h-14 focus:border-red-400/50 outline-none resize-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-green-400 mb-1"
  }, "What went right?"), React.createElement("textarea", {
    value: value.wentRight,
    onChange: function (e) {
      onChange('wentRight', e.target.value);
    },
    placeholder: "Disciplined decisions, setups you're proud of...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm h-14 focus:border-green-400/50 outline-none resize-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-400 mb-1"
  }, "Lessons learned"), React.createElement("textarea", {
    value: value.lessonsLearned,
    onChange: function (e) {
      onChange('lessonsLearned', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm h-12 focus:border-yellow-400/50 outline-none resize-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-yellow-400 mb-1"
  }, "Tomorrow's improvement plan"), React.createElement("textarea", {
    value: value.improvementPlan,
    onChange: function (e) {
      onChange('improvementPlan', e.target.value);
    },
    placeholder: "One concrete thing to do differently tomorrow...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm h-14 focus:border-yellow-400/50 outline-none resize-none"
  })), React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Emotional state"), React.createElement("select", {
    value: value.emotionalState,
    onChange: function (e) {
      onChange('emotionalState', e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-2.5 py-1.5 text-sm capitalize focus:border-yellow-400/50 outline-none"
  }, EMOTIONAL_STATES.map(function (s) {
    return React.createElement("option", {
      key: s,
      value: s
    }, s);
  }))), React.createElement("div", null, React.createElement("label", {
    className: "block text-[11px] text-gray-500 mb-1"
  }, "Market conditions"), React.createElement("input", {
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
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-4"
  }, React.createElement(Icon, {
    name: "Layers",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Per-Account Breakdown")), React.createElement("div", {
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
    return React.createElement("div", {
      key: acc.id,
      className: "flex items-center justify-between text-sm bg-black/30 rounded-lg px-4 py-3 flex-wrap gap-2"
    }, React.createElement("div", {
      className: "flex items-center gap-2"
    }, React.createElement("span", {
      className: "text-white font-medium"
    }, acc.name, " #", acc.accountNumber), React.createElement("span", {
      className: "px-1.5 py-0.5 rounded text-[10px] " + (ACCOUNT_BADGE_CLS[acc.accountType] || ACCOUNT_BADGE_CLS.challenge)
    }, function () {
      const f = ACCOUNT_TYPES.find(function (t) {
        return t.key === acc.accountType;
      });
      return f ? f.label : '';
    }())), React.createElement("div", {
      className: "flex items-center gap-4"
    }, React.createElement("span", {
      className: "text-gray-500"
    }, accTrades.length, " trades"), React.createElement("span", {
      className: "num " + (accWinRate >= 50 ? 'text-green-400' : 'text-red-400')
    }, accWinRate.toFixed(0), "% WR"), React.createElement("span", {
      className: "num font-semibold " + (accPnl >= 0 ? 'text-green-400' : 'text-red-400')
    }, fmt(accPnl))));
  }), accounts.length === 0 && React.createElement("p", {
    className: "text-sm text-gray-500 text-center py-4"
  }, props.accounts.length > 0 ? 'All accounts are breached - check the Breached tab.' : 'No accounts yet.')));
}
function MMMJournal(props) {
  const user = props.user;
  const language = props.language;
  const setLanguage = props.setLanguage;
  const [accountFilter, setAccountFilter] = useState('active');
  const [viewMode, setViewMode] = useState('dollars');
  const [activePage, setActivePage] = useState('overview');
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
  useEffect(function () {
    if (hasManualSelection) return;
    if (accounts.length === 0) return;
    const nonBreached = accounts.find(function (a) {
      return computeAccountStatus(a, entries) !== 'breached';
    });
    setViewingBreached(false);
    setActiveAccountId(nonBreached ? nonBreached.id : null);
  }, [accounts, entries, hasManualSelection]);
  useEffect(function () {
    if (hasInitializedSelection) return;
    if (accounts.length === 0) return;
    const nonBreached = accounts.filter(function (a) {
      return computeAccountStatus(a, entries) !== 'breached';
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
    const disc = computeDisciplineScore(accounts, entries);
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
  useEffect(function () {
    setRiskToleranceDraft(activeAccount && activeAccount.riskTolerance ? String(activeAccount.riskTolerance) : '');
    setConfirmedTolerance(undefined);
    setRiskToleranceStatus(null);
    const tpl = activeAccount && activeAccount.dailyPlanTemplate;
    setDailyPlanTemplateDraft(tpl ? Object.assign({}, emptyDailyPlan(riskPerTrade, activeRR), tpl) : emptyDailyPlan(riskPerTrade, activeRR));
    setDailyPlanCadence(tpl && tpl.cadence ? tpl.cadence : 'daily');
    setDailyPlanTemplateStatus(null);
  }, [activeAccountId]);
  useEffect(function () {
    setMentalCheckDraft(todaysMentalCheckSource ? Object.assign({}, emptyMentalCheck(), todaysMentalCheckSource) : emptyMentalCheck());
    setMentalCheckStatus(null);
  }, [activeAccountId, activePage, todaysEntryForAccount && todaysEntryForAccount.id]);
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
    setSelectedAccountIds(function (prev) {
      const next = new Set(prev);
      next.add(doc.id);
      return next;
    });
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
      const wasOverMax = num > riskPerTrade;
      const clamped = Math.min(num, riskPerTrade);
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
  const handleSaveDailyPlanTemplate = async function () {
    setDailyPlanTemplateStatus(null);
    try {
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
        chartUrl: ''
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
  return React.createElement("div", {
    className: "min-h-screen bg-black text-white p-4 md:p-8"
  }, entrySavedToast && React.createElement("div", {
    className: "fixed top-4 right-4 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 max-w-xs"
  }, React.createElement(Icon, {
    name: "CheckCircle2",
    className: "h-4 w-4 flex-shrink-0"
  }), React.createElement("span", null, entrySavedToast)), React.createElement("div", {
    className: "max-w-6xl mx-auto space-y-6"
  }, React.createElement("div", {
    className: "flex flex-col gap-4 pb-5 border-b border-gray-900"
  }, React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3"
  }, React.createElement("div", null, React.createElement("h1", {
    className: "text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent tracking-tight"
  }, "MMM Pro Journal"), React.createElement("p", {
    className: "text-gray-500 text-sm mt-1 flex items-center flex-wrap"
  }, React.createElement("span", null, React.createElement(EditableName, {
    user: user
  }), " - ", React.createElement("button", {
    onClick: function () {
      auth.signOut();
    },
    className: "text-red-400 hover:underline"
  }, "Sign out")), React.createElement(UserCounters, null))), React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement("a", {
    href: "course/index.html",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "flex items-center gap-1.5 bg-gradient-to-r from-[#D6B15E] to-[#b8903f] text-black px-3 py-1.5 rounded-lg text-sm font-semibold hover:from-[#e0c074] hover:to-[#c89f4c] transition"
  }, React.createElement(Icon, {
    name: "GraduationCap",
    className: "h-4 w-4"
  }), React.createElement("span", null, "Course")), React.createElement("button", {
    onClick: function () {
      setShowInstall(true);
    },
    title: "Put MMM Pro Journal on your phone",
    className: "bg-gray-900 border border-gray-800 text-gray-400 hover:text-yellow-300 hover:border-yellow-500/40 rounded-lg p-1.5 transition"
  }, React.createElement(Icon, {
    name: "Smartphone",
    className: "h-4 w-4"
  })), React.createElement("select", {
    value: viewMode,
    onChange: function (e) {
      setViewMode(e.target.value);
    },
    className: "bg-gray-900 border border-gray-800 text-gray-300 rounded-lg px-2 py-1.5 text-xs focus:border-yellow-400/50 outline-none"
  }, VIEW_MODES.map(function (v) {
    return React.createElement("option", {
      key: v.key,
      value: v.key
    }, v.label);
  })), React.createElement(LanguageSwitcher, {
    language: language,
    setLanguage: setLanguage
  }), React.createElement("div", {
    className: "flex bg-gray-900 border border-gray-800 rounded-lg p-1"
  }, React.createElement("button", {
    onClick: function () {
      setViewingBreached(false);
      setAccountFilter('active');
    },
    className: "px-3 py-1.5 rounded-md text-xs font-medium transition " + (accountFilter === 'active' ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-500 hover:text-white')
  }, "Active Only"), React.createElement("button", {
    onClick: function () {
      setAccountFilter('all');
    },
    className: "px-3 py-1.5 rounded-md text-xs font-medium transition " + (accountFilter === 'all' ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-500 hover:text-white')
  }, "All Accounts")), React.createElement("button", {
    onClick: function () {
      setNewAccount(emptyAccountForm);
      setShowAddAccount(true);
    },
    className: "flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-black px-4 py-2 rounded-lg font-semibold hover:from-green-400 hover:to-emerald-500 transition"
  }, React.createElement(Icon, {
    name: "Plus",
    className: "h-4 w-4"
  }), React.createElement("span", null, "Add Account")))), accounts.length > 0 && React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, React.createElement(AccountGroupNav, {
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
  }), shouldShowAccountDetail && React.createElement("button", {
    onClick: function () {
      setNewEntry(emptyEntryForm(effectiveRiskPerTrade, effectiveContracts, activeRR, activeAccount && activeAccount.dailyPlanTemplate, todaysMentalCheckSource));
      setEntryMethod('manual');
      setSaveEntryError('');
      setShowAddEntry(true);
    },
    className: "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium bg-yellow-500/10 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/15 transition"
  }, React.createElement(Icon, {
    name: "CalendarPlus",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Daily Log")), shouldShowAccountDetail && React.createElement("button", {
    onClick: function () {
      setBrokerImportError('');
      setBrokerImportPreview(null);
      setBrokerCsvText(null);
      setBrokerCommission('');
      setShowImportBroker(true);
    },
    className: "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium bg-gray-900 border-gray-800 text-gray-300 hover:border-blue-500/40 hover:text-blue-300 transition"
  }, React.createElement(Icon, {
    name: "Upload",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Import Trades (CSV)")), shouldShowAccountDetail && function () {
    const seenDates = {};
    let hasDupes = false;
    accountEntries.forEach(function (e) {
      if (seenDates[e.date]) hasDupes = true;
      seenDates[e.date] = true;
    });
    if (!hasDupes) return null;
    return React.createElement("button", {
      onClick: function () {
        setShowDupeCleanup(true);
      },
      className: "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium bg-red-500/10 border-red-500/40 text-red-300 hover:bg-red-500/20 transition"
    }, React.createElement(Icon, {
      name: "AlertTriangle",
      className: "h-3.5 w-3.5"
    }), React.createElement("span", null, "Duplicate Days Found - Clean Up"));
  }()), shouldShowAccountDetail && React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900/60 to-black border border-gray-800 rounded-xl px-5 py-4"
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-3.5"
  }, React.createElement("h3", {
    className: "text-white font-semibold"
  }, activeAccount.name), React.createElement("div", {
    className: "flex items-center gap-3"
  }, activeAccount.linkedFromLabel && React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "Promoted from ", React.createElement("span", {
    className: "text-yellow-400"
  }, activeAccount.linkedFromLabel)), activeAccount.copiedAccountNumber && React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "Copy of ", React.createElement("span", {
    className: "text-yellow-400"
  }, activeAccount.copiedAccountNumber)), React.createElement("button", {
    onClick: function () {
      handleArchiveAccount(activeAccount.id, activeAccount.archived === true);
    },
    className: "text-xs text-gray-600 hover:text-yellow-400 transition"
  }, activeAccount.archived === true ? 'Unarchive account' : 'Archive account'))), React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-0.5"
  }, "Capital"), React.createElement("div", {
    className: "num text-white font-semibold"
  }, fmt(activeAccount.startingBalance))), React.createElement("div", null, React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-0.5"
  }, "Drawdown"), React.createElement("div", {
    className: "num font-semibold " + (currentBuffer - (parseFloat(activeAccount.maxDrawdown) || 0) < 0 ? 'text-red-400' : 'text-white')
  }, fmt(currentBuffer - (parseFloat(activeAccount.maxDrawdown) || 0))), React.createElement("div", {
    className: "text-[11px] text-gray-600"
  }, "from ", fmt(activeAccount.maxDrawdown))), React.createElement("div", null, React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-0.5"
  }, "Drawdown type"), React.createElement("div", {
    className: "text-white font-semibold text-sm"
  }, (DRAWDOWN_TYPES.find(function (dt) {
    return dt.key === (activeAccount.drawdownType || 'static');
  }) || {}).short)), React.createElement("div", null, React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-0.5"
  }, "Market"), React.createElement("select", {
    value: activeAccount.market || 'nasdaq100',
    onChange: function (e) {
      handleChangeMarket(e.target.value);
    },
    className: "bg-gray-900 border border-gray-700 text-white rounded-md px-2 py-1 text-sm focus:border-yellow-400/50 outline-none w-full"
  }, MARKET_OPTIONS.map(function (m) {
    return React.createElement("option", {
      key: m.key,
      value: m.key
    }, m.label);
  }))), React.createElement("div", null, React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-0.5"
  }, "Target"), React.createElement("div", {
    className: "num text-white font-semibold"
  }, fmt(activeAccount.profitTarget))))), React.createElement(SystemExplainer, null)), accounts.length === 0 ? React.createElement("div", {
    className: "text-center py-20 border border-dashed border-gray-700 rounded-2xl"
  }, React.createElement(Icon, {
    name: "Shield",
    className: "h-10 w-10 text-gray-600 mx-auto mb-3"
  }), React.createElement("p", {
    className: "text-gray-500"
  }, "No accounts yet. Add one to start tracking your buffer.")) : !shouldShowAccountDetail ? React.createElement("div", {
    className: "text-center py-20 border border-dashed border-gray-700 rounded-2xl"
  }, React.createElement(Icon, {
    name: "Shield",
    className: "h-10 w-10 text-gray-600 mx-auto mb-3"
  }), React.createElement("p", {
    className: "text-gray-500"
  }, "No active accounts right now."), React.createElement("p", {
    className: "text-gray-600 text-sm mt-1"
  }, "Add a new account to get started, or check the Breached tab to review what happened."), React.createElement("button", {
    onClick: function () {
      setNewAccount(emptyAccountForm);
      setShowAddAccount(true);
    },
    className: "mt-4 inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-black px-4 py-2 rounded-lg font-semibold hover:from-green-400 hover:to-emerald-500 transition"
  }, React.createElement(Icon, {
    name: "Plus",
    className: "h-4 w-4"
  }), React.createElement("span", null, "Add Account"))) : React.createElement(React.Fragment, null, activeAccount && React.createElement(React.Fragment, null, activeStatus === 'breached' && React.createElement("div", {
    className: "border border-red-500/40 bg-red-500/10 rounded-xl p-4 flex items-start gap-3"
  }, React.createElement(Icon, {
    name: "AlertTriangle",
    className: "h-5 w-5 text-red-400 mt-0.5"
  }), React.createElement("div", {
    className: "flex-1"
  }, React.createElement("p", {
    className: "text-red-300 font-semibold text-sm"
  }, "Account Breached"), React.createElement("p", {
    className: "text-red-200/70 text-xs mt-1"
  }, "Buffer fully consumed. This account is now archived.")), React.createElement("button", {
    onClick: handleBackToActive,
    className: "text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 flex-shrink-0"
  }, "Back to Active"), React.createElement("button", {
    onClick: function () {
      setNewAccount(emptyAccountForm);
      setShowAddAccount(true);
    },
    className: "text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg border border-red-500/40 flex-shrink-0"
  }, "Open New Account")), activeStatus === 'passed' && React.createElement("div", {
    className: "border border-green-500/40 bg-green-500/10 rounded-xl p-4 flex items-start gap-3"
  }, React.createElement(Icon, {
    name: "Trophy",
    className: "h-5 w-5 text-green-400 mt-0.5"
  }), React.createElement("div", {
    className: "flex-1"
  }, React.createElement("p", {
    className: "text-green-300 font-semibold text-sm"
  }, "Challenge Passed!"), React.createElement("p", {
    className: "text-green-200/70 text-xs mt-1"
  }, "Start tracking the funded account."), daysStillNeeded > 0 && React.createElement("p", {
    className: "text-yellow-300 text-xs mt-1 flex items-center gap-1"
  }, React.createElement(Icon, {
    name: "AlertTriangle",
    className: "h-3 w-3 flex-shrink-0"
  }), React.createElement("span", null, "Target hit, but this firm requires ", minTradingDaysNeeded, " trading days minimum - you're at ", tradingDaysCount, ". ", daysStillNeeded, " more day", daysStillNeeded !== 1 ? 's' : '', " needed before you can actually request the pass."))), React.createElement("button", {
    onClick: function () {
      handleStartFundedFromChallenge(activeAccount);
    },
    className: "text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1.5 rounded-lg border border-green-500/40 flex-shrink-0"
  }, "Start Funded Account")), activeStatus === 'target-hit' && React.createElement("div", {
    className: "border border-green-500/40 bg-green-500/10 rounded-xl p-4 flex items-start gap-3"
  }, React.createElement(Icon, {
    name: "DollarSign",
    className: "h-5 w-5 text-green-400 mt-0.5"
  }), React.createElement("div", null, React.createElement("p", {
    className: "text-green-300 font-semibold text-sm"
  }, "Target Hit"), React.createElement("p", {
    className: "text-green-200/70 text-xs mt-1"
  }, activeAccount.accountType === 'funded' ? 'Ready for payout.' : 'Profit target reached.'), daysStillNeeded > 0 && React.createElement("p", {
    className: "text-yellow-300 text-xs mt-1 flex items-center gap-1"
  }, React.createElement(Icon, {
    name: "AlertTriangle",
    className: "h-3 w-3 flex-shrink-0"
  }), React.createElement("span", null, "But this firm requires ", minTradingDaysNeeded, " trading days minimum - you're at ", tradingDaysCount, ". ", daysStillNeeded, " more day", daysStillNeeded !== 1 ? 's' : '', " needed before this actually qualifies.")))), payoutStatus && payoutStatus.eligible && React.createElement("div", {
    className: "border border-green-500/40 bg-green-500/10 rounded-xl p-4 flex items-start gap-3"
  }, React.createElement(Icon, {
    name: "Calendar",
    className: "h-5 w-5 text-green-400 mt-0.5 flex-shrink-0"
  }), React.createElement("div", {
    className: "flex-1"
  }, React.createElement("p", {
    className: "text-green-300 font-semibold text-sm"
  }, "Payout Due - ", fmt(payoutStatus.requestable), " available", payoutStatus.split ? ' at your ' + payoutStatus.split + '% split' : ''), React.createElement("p", {
    className: "text-green-200/70 text-xs mt-1"
  }, payoutStatus.note, " Head to your prop firm's dashboard to request it, then log it on the Finances tab.")), React.createElement("button", {
    onClick: function () {
      setActivePage('finances');
    },
    className: "text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1.5 rounded-lg border border-green-500/40 flex-shrink-0"
  }, "View Payout Tracker")), daysSinceLastLog !== null && daysSinceLastLog >= 1 && activeStatus === 'active' && React.createElement("div", {
    className: "border border-orange-500/30 bg-orange-500/10 rounded-xl p-3 flex items-center gap-3"
  }, React.createElement(Icon, {
    name: "Clock",
    className: "h-4 w-4 text-orange-400"
  }), React.createElement("p", {
    className: "text-xs text-orange-200/80"
  }, "Last logged ", daysSinceLastLog, " day", daysSinceLastLog !== 1 ? 's' : '', " ago. Log today's activity or mark it as no-trade.")), React.createElement("div", {
    className: "flex gap-1 border-b border-gray-900 overflow-x-auto"
  }, PAGE_TABS.map(function (tab) {
    return React.createElement("button", {
      key: tab.key,
      onClick: function () {
        setActivePage(tab.key);
      },
      className: "flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition " + (activePage === tab.key ? 'border-yellow-400 text-yellow-300' : 'border-transparent text-gray-500 hover:text-gray-300')
    }, React.createElement(Icon, {
      name: tab.icon,
      className: "h-3.5 w-3.5"
    }), React.createElement("span", null, tab.label));
  })), activePage === 'overview' && React.createElement(React.Fragment, null, selectedAccountIds.size === 0 ? React.createElement("div", {
    className: "text-center py-16 border border-dashed border-gray-700 rounded-2xl"
  }, React.createElement(Icon, {
    name: "Square",
    className: "h-10 w-10 text-gray-600 mx-auto mb-3"
  }), React.createElement("p", {
    className: "text-gray-400 font-medium"
  }, "No accounts selected"), React.createElement("p", {
    className: "text-gray-600 text-sm mt-1"
  }, "Check the boxes next to accounts in the nav above to see their numbers here - the whole Overview stays at zero until something's selected.")) : React.createElement(React.Fragment, null, React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, React.createElement(Icon, {
    name: "UserCheck",
    className: "h-5 w-5 text-blue-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Personal Trading Plan"), React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "trader's final decision")), React.createElement("div", {
    className: "grid grid-cols-2 lg:grid-cols-4 gap-4"
  }, React.createElement(StatCard, {
    label: "Current Capital (Buffer)",
    value: fmt(Math.max(currentBuffer, 0)),
    icon: "Shield",
    color: activeStatus === 'breached' ? 'text-red-400' : currentBuffer < (parseFloat(activeAccount.maxDrawdown) || 0) * 0.5 ? 'text-yellow-400' : 'text-green-400'
  }), React.createElement(StatCard, {
    label: "Risk Per Trade",
    value: fmt(effectiveRiskPerTrade),
    icon: "Target",
    color: "text-blue-400",
    sub: toleranceIsActive ? "Tolerance (system max " + fmt(riskPerTrade) + ")" : activeCfg.mode + " (" + activeCfg.riskPct * 100 + "%)"
  }), React.createElement(StatCard, {
    label: "Total P&L",
    value: fmtView(totalPnl, viewMode, {
      buffer: parseFloat(activeAccount.maxDrawdown) || 0,
      risk: effectiveRiskPerTrade,
      pointValue: activePointValue
    }),
    icon: totalPnl >= 0 ? "TrendingUp" : "TrendingDown",
    color: totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
  }), React.createElement(StatCard, {
    label: "Win Rate",
    value: totalTrades === 0 ? '-' : winRate.toFixed(1) + "%",
    icon: "DollarSign",
    color: totalTrades === 0 ? 'text-gray-500' : winRate >= 50 ? 'text-green-400' : 'text-red-400',
    sub: totalTrades === 0 ? 'No trades yet' : winTrades + "W / " + lossTrades + "L"
  })), React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, React.createElement(PersonalPlanStats, {
    account: activeAccount,
    riskPerTrade: effectiveRiskPerTrade,
    totalPnl: totalPnl
  })), React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-4 flex-wrap gap-2"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "LineChart",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Dashboard"), React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "general calculation")), React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, React.createElement("span", {
    className: "text-xs px-2.5 py-1 rounded-full font-medium border " + STATUS_STYLES[activeStatus].cls
  }, STATUS_STYLES[activeStatus].label), React.createElement("span", {
    className: "text-xs px-2.5 py-1 rounded-full font-medium " + ACCOUNT_BADGE_CLS[activeAccount.accountType] + " border border-current/30"
  }, activeCfg.label), React.createElement("span", {
    className: "text-xs px-2.5 py-1 rounded-full font-medium bg-gray-800 text-gray-400 border border-gray-700"
  }, activeCfg.mode, " - ", activeCfg.riskPct * 100, "% Risk"), React.createElement("span", {
    className: "text-xs px-2.5 py-1 rounded-full font-medium bg-gray-800 text-gray-400 border border-gray-700"
  }, (MARKET_SPECS[activeAccount.market || 'nasdaq100'] || {}).label, " - ", activeTicker))), React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-3"
  }, React.createElement(MiniStat, {
    label: "Contracts Unlocked (max)",
    value: contractPlan.label,
    color: "text-yellow-400"
  }), React.createElement(MiniStat, {
    label: "Risk / Trade (max)",
    value: fmt(riskPerTrade),
    color: "text-blue-400"
  }), React.createElement(MiniStat, {
    label: "Locked Max Stop",
    value: maxStopPoints.toFixed(0) + " pts",
    color: "text-red-400"
  }), React.createElement(MiniStat, {
    label: "Daily Target (max, 2 wins)",
    value: fmt(riskPerTrade * activeRR * 2),
    color: "text-green-400"
  }), React.createElement(MiniStat, {
    label: "Max Loss / Day (max)",
    value: fmt(riskPerTrade * 2),
    color: "text-red-400"
  }), React.createElement(PropFirmRuleStats, {
    account: activeAccount,
    entries: entries
  }), React.createElement(GeneralPlanStats, {
    account: activeAccount,
    riskPerTrade: riskPerTrade,
    totalPnl: totalPnl,
    avgTradesPerDay: avgTradesPerDay,
    maxTradesInDay: maxTradesInDay
  })), React.createElement("div", {
    className: "mt-3 bg-black/30 border border-gray-800/80 rounded-lg px-3 py-2.5"
  }, React.createElement("p", {
    className: "text-xs text-gray-400 flex items-start gap-1.5"
  }, React.createElement(Icon, {
    name: "ShieldAlert",
    className: "h-3.5 w-3.5 text-yellow-400 flex-shrink-0 mt-0.5"
  }), React.createElement("span", null, React.createElement("span", {
    className: "text-gray-300 font-medium"
  }, "General rule:"), " max ", React.createElement("span", {
    className: "text-white font-semibold"
  }, "3 trades/day"), ", max ", React.createElement("span", {
    className: "text-green-400 font-semibold"
  }, "2 wins"), ", max ", React.createElement("span", {
    className: "text-red-400 font-semibold"
  }, "2 losses"), ". Hit any of those and you're done for the day - no exceptions."))), React.createElement(PropFirmRuleNote, {
    account: activeAccount,
    entries: entries
  })), React.createElement(ConsistencyRebalanceWidget, {
    account: activeAccount,
    accountEntries: accountEntries
  }), React.createElement("button", {
    onClick: function () {
      setActivePage('dailyplan');
    },
    className: "w-full flex items-center justify-between gap-3 bg-gradient-to-br from-purple-950/40 to-black border border-purple-800/40 rounded-2xl p-4 text-left hover:border-purple-600/50 transition"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "Shield",
    className: "h-5 w-5 text-purple-400"
  }), React.createElement("div", null, React.createElement("p", {
    className: "text-sm font-semibold text-white"
  }, "Personal Risk Tolerance: ", fmt(effectiveRiskPerTrade), "/trade ", toleranceLocked && '(Locked)'), React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Set in Daily Plan - ", toleranceIsActive ? 'trading below the system max by choice.' : 'currently using the full system max.'))), React.createElement("span", {
    className: "text-xs text-purple-300 flex items-center gap-1 flex-shrink-0"
  }, "Open Daily Plan ", React.createElement(Icon, {
    name: "ArrowRight",
    className: "h-3.5 w-3.5"
  }))), React.createElement("div", null, React.createElement("h2", {
    className: "text-lg font-semibold text-white flex items-center gap-2 mb-1"
  }, React.createElement(Icon, {
    name: "LayoutDashboard",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("span", null, "Performance Overview")), React.createElement("p", {
    className: "text-xs text-gray-600 mb-3"
  }, accountsForOverview.length === 0 ? 'No accounts selected - check the boxes next to accounts above to include them here.' : accountsForOverview.length === accounts.filter(function (a) {
    return getAccountStatus(a) !== 'breached';
  }).length ? 'Showing all accounts, combined.' : 'Showing ' + accountsForOverview.length + ' selected account' + (accountsForOverview.length !== 1 ? 's' : '') + ': ' + accountsForOverview.map(function (a) {
    return a.name;
  }).join(', ')), React.createElement(OverviewStats, {
    accounts: accountsForOverview,
    entries: entries
  })), React.createElement(TradingCalendar, {
    accounts: accountsForOverview,
    entries: entries,
    viewMode: viewMode,
    viewContext: {
      buffer: parseFloat(activeAccount.maxDrawdown) || 0,
      risk: effectiveRiskPerTrade,
      pointValue: activePointValue
    }
  }), React.createElement(EquityCurveBlock, {
    accounts: accountsForOverview,
    entries: entries
  }))), activePage === 'dailyplan' && activeAccount && React.createElement("div", {
    className: "space-y-6"
  }, React.createElement("div", {
    className: "bg-gradient-to-br from-purple-950/40 to-black border border-purple-800/40 rounded-2xl p-6"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, React.createElement(Icon, {
    name: "Calendar",
    className: "h-5 w-5 text-purple-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Daily Plan"), toleranceLocked && React.createElement("span", {
    className: "text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 flex items-center gap-1"
  }, React.createElement(Icon, {
    name: "Lock",
    className: "h-3 w-3"
  }), React.createElement("span", null, "Risk Locked"))), React.createElement("p", {
    className: "text-xs text-gray-500 mb-5"
  }, "Your risk per trade and your plan for the session, in one place. Set your risk tolerance once - it's the amount you can lose per trade without it triggering revenge trading, capped at the system max (", fmt(riskPerTrade), "/trade, see General on Overview) and locked for this account until it passes or fails. Everything below it - target, planned trades, session window - can change as often as you like."), React.createElement("label", {
    className: "block text-xs text-gray-500 mb-1.5"
  }, "Your risk tolerance ($ per trade)"), React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
  }, React.createElement("div", null, React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("input", {
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
  }), React.createElement("button", {
    onClick: function () {
      if (!toleranceLocked) handleChangeRiskTolerance(riskToleranceDraft);
    },
    disabled: toleranceLocked,
    className: "bg-purple-500/20 border border-purple-500/40 text-purple-300 px-4 rounded-lg text-sm font-semibold transition flex-shrink-0 " + (toleranceLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500/30')
  }, "Confirm")), React.createElement("p", {
    className: "text-xs text-gray-600 mt-1.5"
  }, toleranceLocked ? "Locked - it'll unlock automatically once this account passes or fails." : 'Type a number and click Confirm (or press Enter). Clear the field and confirm to go back to the system max.'), riskToleranceStatus && React.createElement("p", {
    className: "text-xs mt-1.5 font-medium " + (riskToleranceStatus.type === 'error' ? 'text-red-400' : 'text-green-400')
  }, riskToleranceStatus.text), toleranceIsActive ? React.createElement("p", {
    className: "text-xs text-purple-300/80 mt-2 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "CheckCircle",
    className: "h-3.5 w-3.5 flex-shrink-0"
  }), React.createElement("span", null, "Active - trading below the system max by choice.")) : React.createElement("p", {
    className: "text-xs text-gray-600 mt-2"
  }, "Not set - currently using the full system max.")), React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, React.createElement("div", {
    className: "bg-black/30 border border-purple-800/30 rounded-lg px-3 py-2.5 text-center"
  }, React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-1"
  }, "Your risk/trade"), React.createElement("div", {
    className: "num text-lg font-bold text-purple-300"
  }, fmt(effectiveRiskPerTrade))), React.createElement("div", {
    className: "bg-black/30 border border-purple-800/30 rounded-lg px-3 py-2.5 text-center"
  }, React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-1"
  }, "Your lot size"), React.createElement("div", {
    className: "num text-lg font-bold text-purple-300"
  }, effectiveContractLabel)), React.createElement("div", {
    className: "bg-black/30 border border-purple-800/30 rounded-lg px-3 py-2.5 text-center"
  }, React.createElement("div", {
    className: "text-[11px] text-gray-500 mb-1"
  }, "Your max loss/day"), React.createElement("div", {
    className: "num text-lg font-bold text-purple-300"
  }, fmt(effectiveDailyCap))))), React.createElement("div", {
    className: "h-px bg-gray-800 my-5"
  }), React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-2 mb-1"
  }, React.createElement("label", {
    className: "block text-xs text-gray-500"
  }, "Apply this plan for:"), React.createElement("div", {
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
    return React.createElement("button", {
      key: c.key,
      onClick: function () {
        setDailyPlanCadence(c.key);
      },
      className: "px-3.5 py-1.5 rounded-lg text-xs font-medium border transition " + (dailyPlanCadence === c.key ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200')
    }, c.label);
  }))), React.createElement("p", {
    className: "text-xs text-gray-600 mb-4"
  }, "Set it once and it pre-fills every new Daily Log entry you add until you change it - so it covers one day, the whole week, the month, or the year, whichever you pick above."), React.createElement(PlanFieldsGrid, {
    value: dailyPlanTemplateDraft,
    onChange: updateDailyPlanTemplateDraft
  }), React.createElement("div", {
    className: "flex items-center gap-3 mt-4"
  }, React.createElement("button", {
    onClick: handleSaveDailyPlanTemplate,
    className: "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition"
  }, "Save Daily Plan"), dailyPlanTemplateStatus && React.createElement("p", {
    className: "text-xs font-medium " + (dailyPlanTemplateStatus.type === 'error' ? 'text-red-400' : 'text-green-400')
  }, dailyPlanTemplateStatus.text))), React.createElement(TradeBudgetReference, {
    buffer: currentBuffer,
    systemMaxRisk: riskPerTrade,
    onApply: handleChangeRiskTolerance,
    locked: toleranceLocked
  })), activePage === 'mentalcheck' && activeAccount && React.createElement("div", {
    className: "space-y-6"
  }, React.createElement("div", {
    className: "bg-gradient-to-br from-teal-950/40 to-black border border-teal-800/40 rounded-2xl p-6"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, React.createElement(Icon, {
    name: "Brain",
    className: "h-5 w-5 text-teal-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "Pre-Session Mental Check")), React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, todaysEntryForAccount ? "Today's entry is already logged - this updates its mental check directly." : "Fill this out before you start trading today. It'll carry over automatically when you log today's Daily Log entry."), React.createElement(MentalCheckFields, {
    value: mentalCheckDraft,
    onChange: updateMentalCheckDraft
  }), React.createElement("div", {
    className: "flex items-center gap-3 mt-4"
  }, React.createElement("button", {
    onClick: handleSaveMentalCheck,
    className: "bg-teal-500/20 border border-teal-500/40 text-teal-300 hover:bg-teal-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition"
  }, "Save Check-In"), mentalCheckStatus && React.createElement("p", {
    className: "text-xs font-medium " + (mentalCheckStatus.type === 'error' ? 'text-red-400' : 'text-green-400')
  }, mentalCheckStatus.text))), React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, React.createElement(Icon, {
    name: "History",
    className: "h-5 w-5 text-gray-400"
  }), React.createElement("h2", {
    className: "text-lg font-semibold text-white"
  }, "History")), React.createElement("p", {
    className: "text-xs text-gray-500 mb-4"
  }, "The trend over time: market awareness, risk respect, humility and professional mindset, each out of 10."), function () {
    const withMc = accountEntries.filter(function (e) {
      return e.mentalCheck && mentalCheckTotal(e.mentalCheck) > 0;
    }).sort(function (a, b) {
      return b.date < a.date ? -1 : 1;
    });
    if (withMc.length === 0) {
      return React.createElement("p", {
        className: "text-sm text-gray-600 py-6 text-center"
      }, "No mental check-ins logged yet for this account - fill one out next time you add a Daily Log entry.");
    }
    const avg = withMc.reduce(function (s, e) {
      return s + mentalCheckTotal(e.mentalCheck);
    }, 0) / withMc.length;
    const avgColor = avg >= 32 ? 'text-green-400' : avg >= 20 ? 'text-yellow-400' : 'text-red-400';
    return React.createElement(React.Fragment, null, React.createElement("div", {
      className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"
    }, React.createElement(MiniStat, {
      label: "Average Score",
      value: avg.toFixed(0) + "/40",
      color: avgColor
    }), React.createElement(MiniStat, {
      label: "Days Checked In",
      value: String(withMc.length),
      color: "text-blue-400"
    }), React.createElement(MiniStat, {
      label: "Last Score",
      value: mentalCheckTotal(withMc[0].mentalCheck) + "/40",
      color: "text-purple-400"
    }), React.createElement(MiniStat, {
      label: "Last Check-In",
      value: withMc[0].date,
      color: "text-gray-400"
    })), React.createElement("div", {
      className: "overflow-x-auto"
    }, React.createElement("table", {
      className: "w-full text-xs"
    }, React.createElement("thead", null, React.createElement("tr", {
      className: "text-gray-500 border-b border-gray-800"
    }, React.createElement("th", {
      className: "text-left py-1.5 pr-3"
    }, "Date"), React.createElement("th", {
      className: "text-left py-1.5 pr-3"
    }, "Market Awareness"), React.createElement("th", {
      className: "text-left py-1.5 pr-3"
    }, "Risk Respect"), React.createElement("th", {
      className: "text-left py-1.5 pr-3"
    }, "Humility"), React.createElement("th", {
      className: "text-left py-1.5 pr-3"
    }, "Mindset"), React.createElement("th", {
      className: "text-left py-1.5"
    }, "Total"))), React.createElement("tbody", null, withMc.slice(0, 30).map(function (e) {
      const t = mentalCheckTotal(e.mentalCheck);
      const tc = t >= 32 ? 'text-green-400' : t >= 20 ? 'text-yellow-400' : 'text-red-400';
      return React.createElement("tr", {
        key: e.id,
        className: "border-b border-gray-900"
      }, React.createElement("td", {
        className: "py-1.5 pr-3 text-gray-300 num"
      }, e.date), React.createElement("td", {
        className: "py-1.5 pr-3 text-gray-400 num"
      }, e.mentalCheck.marketAwareness, "/10"), React.createElement("td", {
        className: "py-1.5 pr-3 text-gray-400 num"
      }, e.mentalCheck.riskRespect, "/10"), React.createElement("td", {
        className: "py-1.5 pr-3 text-gray-400 num"
      }, e.mentalCheck.humility, "/10"), React.createElement("td", {
        className: "py-1.5 pr-3 text-gray-400 num"
      }, e.mentalCheck.mindset, "/10"), React.createElement("td", {
        className: "py-1.5 font-semibold num " + tc
      }, t, "/40"));
    })))));
  }())), activePage === 'history' && React.createElement("div", null, React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-2 mb-3"
  }, React.createElement("h2", {
    className: "text-lg font-semibold text-white flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "Calendar",
    className: "h-5 w-5 text-yellow-400"
  }), React.createElement("span", null, "Trade History")), React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement("button", {
    onClick: function () {
      downloadCSV(toCSV(accountEntries), activeAccount.name + '-trades.csv');
    },
    className: "flex items-center gap-1.5 bg-gray-900 border border-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:border-blue-500/40 hover:text-blue-300 transition"
  }, React.createElement(Icon, {
    name: "Download",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Export CSV")), React.createElement("button", {
    onClick: function () {
      setNewEntry(emptyEntryForm(effectiveRiskPerTrade, effectiveContracts, activeRR, activeAccount && activeAccount.dailyPlanTemplate, todaysMentalCheckSource));
      setEntryMethod('manual');
      setSaveEntryError('');
      setShowAddEntry(true);
    },
    className: "flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-black px-3 py-1.5 rounded-lg text-sm font-semibold hover:from-green-400 hover:to-emerald-500 transition"
  }, React.createElement(Icon, {
    name: "Plus",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Daily Log")))), React.createElement(ClosedTradesTable, {
    accountEntries: accountEntries
  }), accountEntries.length === 0 ? React.createElement("div", {
    className: "text-center py-12 border border-dashed border-gray-800 rounded-xl text-gray-500 text-sm"
  }, "No entries yet.") : React.createElement("div", {
    className: "space-y-2"
  }, accountEntries.slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  }).map(function (entry) {
    if (entry.tradedToday === 'no') {
      const reasonLabel = (NO_TRADE_REASONS.find(function (r) {
        return r.key === entry.noTradeReason;
      }) || {}).label || entry.noTradeReason;
      return React.createElement("div", {
        key: entry.id,
        className: "bg-gray-900/40 border border-gray-800 rounded-xl p-3 flex items-center justify-between"
      }, React.createElement("div", {
        className: "flex items-center gap-2"
      }, React.createElement("div", {
        className: "w-2 h-2 rounded-full bg-gray-600"
      }), React.createElement("span", {
        className: "text-white text-sm font-medium"
      }, entry.date), React.createElement("span", {
        className: "text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-300"
      }, "No Trade - ", reasonLabel)), React.createElement("button", {
        onClick: function () {
          handleDeleteEntry(entry.id);
        },
        className: "text-xs text-red-400/70 hover:text-red-400"
      }, React.createElement(Icon, {
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
    return React.createElement("div", {
      key: entry.id,
      className: "bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden"
    }, React.createElement("button", {
      onClick: function () {
        setExpandedEntry(isExpanded ? null : entry.id);
      },
      className: "w-full flex items-center justify-between p-3 hover:bg-gray-800/30 transition"
    }, React.createElement("div", {
      className: "flex items-center gap-2 flex-wrap"
    }, React.createElement("div", {
      className: "w-2 h-2 rounded-full " + (dayPnl >= 0 ? 'bg-green-400' : 'bg-red-400')
    }), React.createElement("span", {
      className: "text-white text-sm font-medium"
    }, entry.date), React.createElement("span", {
      className: "text-[10px] px-1.5 py-0.5 rounded border " + biasInfo.cls + " flex items-center gap-1"
    }, React.createElement(Icon, {
      name: biasInfo.icon,
      className: "h-3 w-3"
    }), React.createElement("span", null, biasInfo.label)), entry.exercised && React.createElement("span", {
      className: "text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 flex items-center gap-1"
    }, React.createElement(Icon, {
      name: "Dumbbell",
      className: "h-3 w-3"
    }), React.createElement("span", null, "Exercised")), entryWithinConsistency !== null && React.createElement("span", {
      className: "text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 " + (entryWithinConsistency ? 'bg-green-500/15 text-green-400 border-green-500/30' : 'bg-red-500/15 text-red-400 border-red-500/30')
    }, React.createElement(Icon, {
      name: entryWithinConsistency ? "CheckCircle" : "AlertTriangle",
      className: "h-3 w-3"
    }), React.createElement("span", null, entryWithinConsistency ? 'Within consistency' : 'Over consistency'))), React.createElement("div", {
      className: "flex items-center gap-3"
    }, React.createElement("span", {
      className: "num font-semibold text-sm " + (dayPnl >= 0 ? 'text-green-400' : 'text-red-400')
    }, dayPnl >= 0 ? '+' : '', fmt(dayPnl)), React.createElement(Icon, {
      name: isExpanded ? "ChevronUp" : "ChevronDown",
      className: "h-4 w-4 text-gray-500"
    }))), isExpanded && React.createElement("div", {
      className: "px-3 pb-3 space-y-2 border-t border-gray-800 pt-3"
    }, entry.trades.map(function (t, i) {
      const val = Math.abs(parseFloat(t.pnl) || 0);
      const aligned = biasAligns(entry.dailyBias, t.direction);
      const score = computeTradeAdherence(t, entry, activeAccount);
      const tags = computeTradeTags(t, i, entry.trades, entry, activeAccount);
      return React.createElement("div", {
        key: i,
        className: "bg-black/30 rounded-lg px-3 py-2 space-y-1"
      }, React.createElement("div", {
        className: "flex items-center justify-between text-xs flex-wrap gap-1"
      }, React.createElement("div", {
        className: "flex items-center gap-1.5 flex-wrap"
      }, React.createElement("span", {
        className: "text-gray-400"
      }, "Trade ", i + 1), React.createElement("span", {
        className: "text-[10px] px-1.5 py-0.5 rounded " + (t.direction === 'long' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400')
      }, t.direction === 'long' ? 'LONG' : 'SHORT'), aligned !== null && React.createElement("span", {
        className: "text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 " + (aligned ? 'bg-green-500/15 text-green-400' : 'bg-orange-500/15 text-orange-400')
      }, React.createElement(Icon, {
        name: aligned ? "CheckCircle" : "AlertTriangle",
        className: "h-2.5 w-2.5"
      }), React.createElement("span", null, aligned ? 'With trend' : 'Against bias')), score !== null && React.createElement("span", {
        className: "text-[10px] px-1.5 py-0.5 rounded " + (score >= 0.7 ? 'bg-green-500/15 text-green-400' : score >= 0.4 ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400')
      }, (score * 100).toFixed(0), "%")), React.createElement("div", {
        className: "flex items-center gap-2"
      }, React.createElement("span", {
        className: "font-medium px-1.5 py-0.5 rounded " + (t.result === 'win' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400')
      }, t.result === 'win' ? 'WIN' : 'LOSS'), React.createElement("span", {
        className: "font-semibold " + (t.result === 'win' ? 'text-green-400' : 'text-red-400')
      }, t.result === 'win' ? '+' : '-', fmt(val)))), (t.positionSize || t.riskAmount) && React.createElement("p", {
        className: "text-[10px] text-gray-500"
      }, "Size: ", t.positionSize || 'N/A', " - Risked: ", t.riskAmount ? fmt(parseFloat(t.riskAmount)) : 'N/A', " - HTF/LTF: ", t.htfLtf ? 'Yes' : 'No'), t.chartUrl && React.createElement("a", {
        href: t.chartUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-0.5"
      }, React.createElement(Icon, {
        name: "Link",
        className: "h-2.5 w-2.5"
      }), React.createElement("span", null, "View chart")), tags.length > 0 && React.createElement("div", {
        className: "flex items-center gap-1 flex-wrap pt-0.5"
      }, tags.map(function (tag, ti) {
        const isGood = tag === 'Rules Followed';
        return React.createElement("span", {
          key: ti,
          className: "text-[9px] px-1.5 py-0.5 rounded-full border " + (isGood ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-orange-500/10 text-orange-300 border-orange-500/30')
        }, tag);
      })));
    }), entry.notes && React.createElement("p", {
      className: "text-xs text-gray-500 italic mt-2"
    }, "\"", entry.notes, "\""), bufferAtDate && React.createElement("p", {
      className: "text-xs text-gray-600 mt-2"
    }, "Buffer after this day: ", React.createElement("span", {
      className: "text-gray-400"
    }, fmt(bufferAtDate.buffer))), entryCap !== null && React.createElement("p", {
      className: "text-xs mt-1 " + (entryWithinConsistency ? 'text-gray-500' : 'text-red-400')
    }, "Consistency check: cumulative profit before this day was ", fmt(entryCumBefore), ", so the ", activeAccount.consistencyPct, "% cap for this day was ", fmt(entryCap), " - this day made ", fmt(dayPnl), ", which is ", entryWithinConsistency ? 'within the cap' : 'OVER the cap and would need diluting by future profitable days', "."), React.createElement("button", {
      onClick: function () {
        handleDeleteEntry(entry.id);
      },
      className: "text-xs text-red-400/70 hover:text-red-400 flex items-center gap-1.5 mt-2"
    }, React.createElement(Icon, {
      name: "Trash2",
      className: "h-3.5 w-3.5"
    }), React.createElement("span", null, "Delete entry"))));
  }))), activePage === 'reports' && React.createElement(React.Fragment, null, React.createElement(ReportsCard, {
    accounts: accountsForOverview,
    entries: entries
  }), React.createElement(PerAccountBreakdown, {
    accounts: accounts,
    entries: entries
  })), activePage === 'discipline' && React.createElement(React.Fragment, null, activeStatus === 'breached' && React.createElement(BreachReviewCard, {
    account: activeAccount,
    accountEntries: accountEntries,
    bufferHistory: bufferHistory
  }), React.createElement(DisciplineChecklistCard, {
    accounts: accounts,
    entries: entries
  }), React.createElement(ReflectionLog, {
    accountEntries: accountEntries
  }), React.createElement(DisciplineLeaderboard, {
    uid: user.uid,
    currentName: user.displayName || user.email
  })), activePage === 'finances' && React.createElement(React.Fragment, null, React.createElement(CostsAndPayoutsCard, {
    account: activeAccount,
    status: activeStatus
  }), React.createElement(PayoutTrackerCard, {
    account: activeAccount,
    entries: entries,
    onSaveRules: handleSavePayoutRules
  }), React.createElement(PayoutLedger, {
    account: activeAccount,
    onAddPayout: handleAddPayout,
    suggestedAmount: payoutStatus && payoutStatus.eligible ? payoutStatus.requestable : null
  }), React.createElement(RiskOfRuinCard, {
    currentBuffer: Math.max(currentBuffer, 0),
    divisor: ruinDivisor,
    accountType: activeAccount.accountType
  })), activePage === 'projections' && React.createElement(ProjectionsCard, {
    account: activeAccount,
    accountEntries: accountEntries,
    defaultRiskPerTrade: effectiveRiskPerTrade
  }), activePage === 'strategy' && React.createElement("div", {
    className: "space-y-4"
  }, React.createElement(StrategyCard, {
    account: activeAccount,
    onManage: function () {
      setNewStrategy(emptyStrategyForm);
      setShowManageStrategies(true);
    }
  }), React.createElement(StrategyBacktestReference, null))))), showAddAccount && React.createElement(Modal, {
    onClose: function () {
      setShowAddAccount(false);
    },
    title: newAccount.linkedFromId ? "Start Funded Account" : "Add Trading Account",
    size: "lg"
  }, React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", null, React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1"
  }, "Account Type (Phase)"), React.createElement("div", {
    className: "flex gap-2"
  }, ACCOUNT_TYPES.map(function (t) {
    return React.createElement("button", {
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
  })), React.createElement("p", {
    className: "text-xs text-gray-500 mt-1"
  }, PHASE_CONFIG[newAccount.accountType].label, " - ", PHASE_CONFIG[newAccount.accountType].mode, " (", PHASE_CONFIG[newAccount.accountType].riskPct * 100, "% risk)")), (newAccount.accountType === 'funded' || newAccount.accountType === 'live') && React.createElement(Field, {
    label: "Link to existing " + (newAccount.accountType === 'funded' ? 'Challenge' : 'Funded') + " account (optional)"
  }, React.createElement("select", {
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
  }, React.createElement("option", {
    value: ""
  }, "Standalone - already passed elsewhere, just logging it here"), linkableAccounts.map(function (a) {
    return React.createElement("option", {
      key: a.id,
      value: a.id
    }, a.name, " #", a.accountNumber);
  }))), React.createElement(Field, {
    label: "Account Name"
  }, React.createElement("input", {
    value: newAccount.name,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        name: e.target.value
      }));
    },
    placeholder: "e.g. Phidias 1",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, React.createElement(Field, {
    label: "Starting Balance"
  }, React.createElement("input", {
    type: "number",
    value: newAccount.startingBalance,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        startingBalance: e.target.value
      }));
    },
    placeholder: "100000",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), React.createElement(Field, {
    label: "Capital / Buffer ($)"
  }, React.createElement("input", {
    type: "number",
    value: newAccount.maxDrawdown,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        maxDrawdown: e.target.value
      }));
    },
    placeholder: "500",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  }))), React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, React.createElement(Field, {
    label: "Drawdown Type"
  }, React.createElement("select", {
    value: newAccount.drawdownType,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        drawdownType: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  }, DRAWDOWN_TYPES.map(function (dt) {
    return React.createElement("option", {
      key: dt.key,
      value: dt.key
    }, dt.label);
  }))), React.createElement(Field, {
    label: "Market"
  }, React.createElement("select", {
    value: newAccount.market,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        market: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  }, MARKET_OPTIONS.map(function (m) {
    return React.createElement("option", {
      key: m.key,
      value: m.key
    }, m.label);
  })))), React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, React.createElement(Field, {
    label: "Profit Target ($)"
  }, React.createElement("input", {
    type: "number",
    value: newAccount.profitTarget,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        profitTarget: e.target.value
      }));
    },
    placeholder: "1500",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), React.createElement(Field, {
    label: "Reward:Risk Ratio (min " + MIN_RR + ":1)"
  }, React.createElement("input", {
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
  }), parseFloat(newAccount.rewardRatio) < MIN_RR && newAccount.rewardRatio !== '' && React.createElement("p", {
    className: "text-xs text-red-400 mt-1"
  }, "Below minimum - will be locked to ", MIN_RR, ":1 on save."))), React.createElement("div", {
    className: "mt-1 bg-black/40 border border-gray-800 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs"
  }, React.createElement("div", {
    className: "text-gray-400"
  }, "Phase: ", React.createElement("span", {
    className: "text-yellow-400 font-medium"
  }, newAccountPreviewCfg.label)), React.createElement("div", {
    className: "text-gray-400"
  }, "Mode: ", React.createElement("span", {
    className: "text-yellow-400 font-medium"
  }, newAccountPreviewCfg.mode, " (", newAccountPreviewCfg.riskPct * 100, "%)")), React.createElement("div", {
    className: "text-gray-400"
  }, "Locked Max Stop: ", React.createElement("span", {
    className: "text-red-400 font-medium"
  }, newAccountMaxStop.toFixed(0), " points")), React.createElement("div", {
    className: "text-gray-400"
  }, "RR Target: ", React.createElement("span", {
    className: "text-purple-400 font-medium"
  }, Math.max(parseFloat(newAccount.rewardRatio) || MIN_RR, MIN_RR), ":1"))), React.createElement("div", {
    className: "border-t border-gray-800 pt-4 space-y-3"
  }, React.createElement("p", {
    className: "text-sm text-yellow-400 font-medium flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "ShieldAlert",
    className: "h-4 w-4"
  }), React.createElement("span", null, "Prop Firm Rules (optional - leave blank if the firm has none)")), React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, React.createElement(Field, {
    label: "Consistency Rule (%)"
  }, React.createElement("input", {
    type: "number",
    value: newAccount.consistencyPct,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        consistencyPct: e.target.value
      }));
    },
    placeholder: "e.g. 40 - leave blank if none",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), React.createElement(Field, {
    label: "Min Trading Days"
  }, React.createElement("input", {
    type: "number",
    value: newAccount.minTradingDays,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        minTradingDays: e.target.value
      }));
    },
    placeholder: "e.g. 4 - leave blank if none",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), React.createElement(Field, {
    label: "Daily Loss Limit ($)"
  }, React.createElement("input", {
    type: "number",
    value: newAccount.dailyLossLimit,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        dailyLossLimit: e.target.value
      }));
    },
    placeholder: "e.g. 1000 - leave blank if none",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  }))), newAccount.dailyLossLimit && React.createElement(Field, {
    label: "Daily Loss Limit Type"
  }, React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("button", {
    onClick: function () {
      setNewAccount(Object.assign({}, newAccount, {
        dllType: 'hard'
      }));
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border " + (newAccount.dllType === 'hard' ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, "Hard Breach (account terminated)"), React.createElement("button", {
    onClick: function () {
      setNewAccount(Object.assign({}, newAccount, {
        dllType: 'soft'
      }));
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border " + (newAccount.dllType === 'soft' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, "Soft Breach (flatten & lock)"))), React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Consistency rule caps how much of your total profit any single day can represent - checked at payout time. Daily Loss Limit is separate from your Capital and resets every day.")), newAccount.accountType !== 'challenge' && React.createElement("div", {
    className: "border-t border-gray-800 pt-4 space-y-3"
  }, React.createElement("p", {
    className: "text-sm text-yellow-400 font-medium flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "Calendar",
    className: "h-4 w-4"
  }), React.createElement("span", null, "Payout Rules (optional - can also be set later on the Finances tab)")), React.createElement(PayoutTypeSelector, {
    value: newAccount.payoutType || 'simple',
    onChange: function (t) {
      setNewAccount(Object.assign({}, newAccount, {
        payoutType: t
      }));
    }
  }), React.createElement("p", {
    className: "text-xs text-gray-500"
  }, (PAYOUT_TYPES.find(function (t) {
    return t.key === (newAccount.payoutType || 'simple');
  }) || {}).desc), React.createElement(PayoutTypeFieldset, {
    type: newAccount.payoutType || 'simple',
    get: function (field) {
      return newAccount[field];
    },
    set: function (field, value) {
      setNewAccount(Object.assign({}, newAccount, {
        [field]: value
      }));
    }
  })), React.createElement("div", {
    className: "border-t border-gray-800 pt-4"
  }, React.createElement("p", {
    className: "text-sm text-yellow-400 font-medium mb-2 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "Receipt",
    className: "h-4 w-4"
  }), React.createElement("span", null, "Costs")), React.createElement("div", {
    className: "grid grid-cols-3 gap-3"
  }, React.createElement(Field, {
    label: "Challenge Cost ($)"
  }, React.createElement("input", {
    type: "number",
    value: newAccount.accountCost,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        accountCost: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), React.createElement(Field, {
    label: "Activation Cost ($)"
  }, React.createElement("input", {
    type: "number",
    value: newAccount.activationCost,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        activationCost: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), React.createElement(Field, {
    label: "Reset Cost ($)"
  }, React.createElement("input", {
    type: "number",
    value: newAccount.resetCost,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        resetCost: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })))), React.createElement(Field, {
    label: "Master / Copied Account Number (optional)"
  }, React.createElement("input", {
    value: newAccount.copiedAccountNumber,
    onChange: function (e) {
      setNewAccount(Object.assign({}, newAccount, {
        copiedAccountNumber: e.target.value
      }));
    },
    placeholder: "If copying a master account",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), React.createElement("button", {
    onClick: handleAddAccount,
    disabled: !newAccount.name || !newAccount.startingBalance || !newAccount.maxDrawdown,
    className: "w-full bg-gradient-to-r from-green-500 to-emerald-600 text-black py-2.5 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
  }, React.createElement(Icon, {
    name: "Save",
    className: "h-4 w-4"
  }), React.createElement("span", null, "Save Account")))), showManageStrategies && activeAccount && React.createElement(Modal, {
    onClose: function () {
      setShowManageStrategies(false);
    },
    title: "Manage Strategies",
    size: "lg"
  }, React.createElement("div", {
    className: "space-y-5"
  }, React.createElement("div", null, React.createElement("p", {
    className: "text-sm text-gray-400 mb-2"
  }, "Existing strategies"), React.createElement("div", {
    className: "space-y-2"
  }, getStrategies(activeAccount).map(function (s) {
    return React.createElement("div", {
      key: s.id,
      className: "bg-black/30 border border-gray-800 rounded-lg p-3"
    }, React.createElement("div", {
      className: "flex items-center justify-between"
    }, React.createElement("span", {
      className: "text-white font-medium text-sm"
    }, s.name), s.id !== 'default' && React.createElement("button", {
      onClick: function () {
        handleDeleteStrategy(s.id);
      },
      className: "text-red-400/70 hover:text-red-400"
    }, React.createElement(Icon, {
      name: "Trash2",
      className: "h-3.5 w-3.5"
    }))), React.createElement("p", {
      className: "text-xs text-gray-500 mt-1"
    }, (s.longRules || []).filter(function (r) {
      return r && r.trim();
    }).length, " long rule(s) - ", (s.shortRules || []).filter(function (r) {
      return r && r.trim();
    }).length, " short rule(s)"));
  }))), React.createElement("div", {
    className: "border-t border-gray-800 pt-4 space-y-4"
  }, React.createElement("p", {
    className: "text-sm text-yellow-400 font-medium"
  }, "Add a new strategy"), React.createElement(Field, {
    label: "Strategy Name"
  }, React.createElement("input", {
    value: newStrategy.name,
    onChange: function (e) {
      setNewStrategy(Object.assign({}, newStrategy, {
        name: e.target.value
      }));
    },
    placeholder: "e.g. Reversal Scalp",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, React.createElement("div", null, React.createElement("label", {
    className: "block text-sm text-green-400 mb-1.5 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "TrendingUp",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Long Setup Rules")), React.createElement("div", {
    className: "space-y-2"
  }, newStrategy.longRules.map(function (rule, idx) {
    return React.createElement("div", {
      key: idx,
      className: "flex items-center gap-1.5"
    }, React.createElement("input", {
      value: rule,
      onChange: function (e) {
        updateStrategyRuleRow('longRules', idx, e.target.value);
      },
      placeholder: "Rule " + (idx + 1),
      className: "flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
    }), newStrategy.longRules.length > 1 && React.createElement("button", {
      onClick: function () {
        removeStrategyRuleRow('longRules', idx);
      },
      className: "text-gray-500 hover:text-red-400 flex-shrink-0"
    }, React.createElement(Icon, {
      name: "X",
      className: "h-3.5 w-3.5"
    })));
  }), React.createElement("button", {
    onClick: function () {
      addStrategyRuleRow('longRules');
    },
    className: "text-xs text-green-400 hover:text-green-300 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "Plus",
    className: "h-3 w-3"
  }), React.createElement("span", null, "Add rule")))), React.createElement("div", null, React.createElement("label", {
    className: "block text-sm text-red-400 mb-1.5 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "TrendingDown",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Short Setup Rules")), React.createElement("div", {
    className: "space-y-2"
  }, newStrategy.shortRules.map(function (rule, idx) {
    return React.createElement("div", {
      key: idx,
      className: "flex items-center gap-1.5"
    }, React.createElement("input", {
      value: rule,
      onChange: function (e) {
        updateStrategyRuleRow('shortRules', idx, e.target.value);
      },
      placeholder: "Rule " + (idx + 1),
      className: "flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-sm focus:border-yellow-400/50 outline-none"
    }), newStrategy.shortRules.length > 1 && React.createElement("button", {
      onClick: function () {
        removeStrategyRuleRow('shortRules', idx);
      },
      className: "text-gray-500 hover:text-red-400 flex-shrink-0"
    }, React.createElement(Icon, {
      name: "X",
      className: "h-3.5 w-3.5"
    })));
  }), React.createElement("button", {
    onClick: function () {
      addStrategyRuleRow('shortRules');
    },
    className: "text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "Plus",
    className: "h-3 w-3"
  }), React.createElement("span", null, "Add rule"))))), React.createElement("button", {
    onClick: handleAddStrategy,
    disabled: !newStrategy.name.trim(),
    className: "w-full bg-gradient-to-r from-green-500 to-emerald-600 text-black py-2.5 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
  }, React.createElement(Icon, {
    name: "Save",
    className: "h-4 w-4"
  }), React.createElement("span", null, "Add Strategy"))))), showInstall && React.createElement(InstallAppModal, {
    onClose: function () {
      setShowInstall(false);
    }
  }), showDupeCleanup && activeAccount && React.createElement(DupeCleanupModal, {
    accountEntries: accountEntries,
    entriesRef: entriesRef,
    onClose: function () {
      setShowDupeCleanup(false);
    }
  }), showImportBroker && activeAccount && React.createElement(Modal, {
    onClose: function () {
      setShowImportBroker(false);
    },
    title: "Import Trades (CSV)",
    size: "lg"
  }, React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", {
    className: "bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-200 space-y-1"
  }, React.createElement("p", null, React.createElement("span", {
    className: "text-white font-medium"
  }, "Tradovate:"), " Reports ", '>', " Performance (recommended - already matched entry to exit) or Reports ", '>', " Orders (reconstructed from raw fills using verified CME point values for ES/MES, NQ/MNQ, RTY/M2K, YM/MYM, GC/MGC, SI/SIL, and CL/MCL). Either file is auto-detected."), React.createElement("p", {
    className: "text-blue-300/70"
  }, "Any other platform: NinjaTrader, TopstepX, ProjectX, MT4/5, ThinkOrSwim and most others export a closed-trade history CSV with a date column and a P&L column per trade - upload it as-is and it's matched by column name automatically. Whatever the exchange rate or point value already baked into that P&L figure is what gets imported as-is."), React.createElement("p", {
    className: "text-blue-300/70"
  }, "If the export doesn't include commissions, enter your round-turn rate below and it'll be subtracted per contract, so every number here reflects what you actually kept.")), React.createElement("div", null, React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Commission per contract, round-turn ($)"), React.createElement("input", {
    type: "number",
    min: "0",
    step: "0.01",
    placeholder: "e.g. 1.30 - check your broker's fee schedule",
    value: brokerCommission,
    onChange: function (e) {
      handleBrokerCommissionChange(e.target.value);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400/50 outline-none"
  }), React.createElement("p", {
    className: "text-xs text-gray-600 mt-1"
  }, "Leave blank or 0 if you're not sure, or if the P&L column is already net - you can re-enter this after uploading and the preview below updates automatically.")), !brokerImportPreview && React.createElement("div", null, React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Trade History CSV"), React.createElement("input", {
    type: "file",
    accept: ".csv",
    onChange: function (e) {
      handleBrokerFileSelect(e.target.files[0]);
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-700 file:text-gray-300"
  })), brokerImportError && React.createElement("div", {
    className: "bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-300"
  }, brokerImportError), brokerImportPreview && React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("div", {
    className: "bg-black/30 rounded-lg p-3 text-sm"
  }, React.createElement("p", {
    className: "text-white font-medium mb-1"
  }, brokerImportPreview.totalTrades, " trade", brokerImportPreview.totalTrades !== 1 ? 's' : '', " found across ", Object.keys(brokerImportPreview.byDate).length, " day", Object.keys(brokerImportPreview.byDate).length !== 1 ? 's' : ''), brokerImportPreview.skipped > 0 && React.createElement("p", {
    className: "text-xs text-yellow-400"
  }, brokerImportPreview.skipped, " trade", brokerImportPreview.skipped !== 1 ? 's' : '', " skipped - unrecognized contract, couldn't price."), React.createElement("p", {
    className: "text-xs text-gray-500 mt-1"
  }, "Added as new daily log entries with bias set to Neutral (edit any day afterward if needed). A day that already has entries for ", React.createElement("span", {
    className: "text-white"
  }, activeAccount.name), " gets fully replaced, not duplicated.")), React.createElement("div", {
    className: "max-h-48 overflow-y-auto space-y-1.5"
  }, Object.keys(brokerImportPreview.byDate).sort().map(function (date) {
    const dayTrades = brokerImportPreview.byDate[date];
    const dayPnl = dayTrades.reduce(function (s, t) {
      return s + t.pnl;
    }, 0);
    const willOverwrite = accountEntries.some(function (e) {
      return e.date === date;
    });
    return React.createElement("div", {
      key: date,
      className: "flex items-center justify-between text-xs bg-black/30 rounded-lg px-3 py-2"
    }, React.createElement("span", {
      className: "text-gray-300"
    }, date, willOverwrite && React.createElement("span", {
      className: "text-yellow-400 ml-1.5"
    }, "(overwrites existing)")), React.createElement("span", {
      className: "text-gray-500"
    }, dayTrades.length, " trade", dayTrades.length !== 1 ? 's' : ''), React.createElement("span", {
      className: "num font-semibold " + (dayPnl >= 0 ? 'text-green-400' : 'text-red-400')
    }, fmt(dayPnl)));
  })), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("button", {
    onClick: function () {
      setBrokerImportPreview(null);
    },
    className: "flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-700 transition"
  }, "Choose Different File"), React.createElement("button", {
    onClick: handleConfirmBrokerImport,
    disabled: brokerImportBusy,
    className: "flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-black py-2.5 rounded-lg font-semibold disabled:opacity-40 flex items-center justify-center gap-1.5"
  }, brokerImportBusy ? React.createElement("span", null, "Importing...") : React.createElement(React.Fragment, null, React.createElement(Icon, {
    name: "Upload",
    className: "h-4 w-4"
  }), React.createElement("span", null, "Confirm Import"))))))), showAddEntry && activeAccount && React.createElement(Modal, {
    onClose: function () {
      setShowAddEntry(false);
    },
    title: "Log Today's Trades",
    size: "lg"
  }, React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", null, React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Entry Method"), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("button", {
    onClick: function () {
      setEntryMethod('manual');
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-1.5 " + (entryMethod === 'manual' ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, React.createElement(Icon, {
    name: "PenLine",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Manual Entry")), React.createElement("button", {
    onClick: function () {
      setEntryMethod('csv');
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-1.5 " + (entryMethod === 'csv' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, React.createElement(Icon, {
    name: "Upload",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Import CSV")))), entryMethod === 'csv' ? React.createElement(CsvImportFields, {
    account: activeAccount,
    entriesRef: entriesRef,
    onDone: function () {
      setShowAddEntry(false);
    }
  }) : React.createElement(React.Fragment, null, React.createElement(Field, {
    label: "Date"
  }, React.createElement("input", {
    type: "date",
    value: newEntry.date,
    onChange: function (e) {
      setNewEntry(Object.assign({}, newEntry, {
        date: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Did you trade today?"), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("button", {
    onClick: function () {
      setNewEntry(Object.assign({}, newEntry, {
        tradedToday: 'yes'
      }));
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border " + (newEntry.tradedToday === 'yes' ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, "Yes"), React.createElement("button", {
    onClick: function () {
      setNewEntry(Object.assign({}, newEntry, {
        tradedToday: 'no'
      }));
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border " + (newEntry.tradedToday === 'no' ? 'bg-gray-500/30 text-gray-300 border-gray-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, "No"))), React.createElement("div", null, React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Physical exercise today?"), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("button", {
    onClick: function () {
      setNewEntry(Object.assign({}, newEntry, {
        exercised: true
      }));
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-1.5 " + (newEntry.exercised ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, React.createElement(Icon, {
    name: "Dumbbell",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Yes")), React.createElement("button", {
    onClick: function () {
      setNewEntry(Object.assign({}, newEntry, {
        exercised: false
      }));
    },
    className: "flex-1 py-2 rounded-lg text-sm font-medium border " + (!newEntry.exercised ? 'bg-gray-500/30 text-gray-300 border-gray-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
  }, "No"))), React.createElement("div", {
    className: "bg-black/30 border border-gray-800 rounded-lg px-3 py-2.5 flex items-start gap-2"
  }, React.createElement(Icon, {
    name: "Info",
    className: "h-3.5 w-3.5 text-gray-500 flex-shrink-0 mt-0.5"
  }), React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Your pre-session mental check ", mentalCheckTotal(newEntry.mentalCheck) > 0 ? React.createElement("span", {
    className: "text-teal-400 font-medium"
  }, "(", mentalCheckTotal(newEntry.mentalCheck), "/40, already set)") : React.createElement("span", null, "(not set yet)"), " and Daily Plan ", newEntry.dailyPlan.riskAmount || newEntry.dailyPlan.targetProfit ? React.createElement("span", {
    className: "text-yellow-400 font-medium"
  }, "(set)") : React.createElement("span", null, "(not set)"), " now live on their own pages in the menu - this entry will pick up whatever's saved there for today.")), React.createElement(ReflectionSection, {
    value: newEntry.reflection,
    onChange: updateReflection
  }), newEntry.tradedToday === 'no' ? React.createElement(React.Fragment, null, React.createElement("div", null, React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Reason"), React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, NO_TRADE_REASONS.map(function (r) {
    return React.createElement("button", {
      key: r.key,
      onClick: function () {
        setNewEntry(Object.assign({}, newEntry, {
          noTradeReason: r.key
        }));
      },
      className: "py-2 rounded-lg text-xs font-medium border " + (newEntry.noTradeReason === r.key ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' : 'bg-gray-800 text-gray-500 border-gray-700')
    }, r.label);
  }))), React.createElement(Field, {
    label: "How was your day? (thoughts, emotions, anything on your mind)"
  }, React.createElement("textarea", {
    value: newEntry.noTradeNotes,
    onChange: function (e) {
      setNewEntry(Object.assign({}, newEntry, {
        noTradeNotes: e.target.value
      }));
    },
    placeholder: "Frustrated I didn't find a setup, but glad I didn't force a trade...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 h-16 focus:border-yellow-400/50 outline-none resize-none"
  })), React.createElement("p", {
    className: "text-xs text-gray-500 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "ShieldCheck",
    className: "h-3.5 w-3.5 text-green-400 flex-shrink-0"
  }), React.createElement("span", null, "Logging today - even a no-trade day - still counts toward your discipline score.")), saveEntryError && React.createElement("p", {
    className: "text-red-400 text-xs"
  }, saveEntryError), React.createElement("button", {
    onClick: handleSaveEntry,
    disabled: !newEntry.noTradeReason,
    className: "w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
  }, React.createElement(Icon, {
    name: "Save",
    className: "h-4 w-4"
  }), React.createElement("span", null, "Save No-Trade Day"))) : React.createElement(React.Fragment, null, React.createElement(Field, {
    label: "Strategy used today"
  }, React.createElement("select", {
    value: newEntry.strategyId || 'default',
    onChange: function (e) {
      setNewEntry(Object.assign({}, newEntry, {
        strategyId: e.target.value
      }));
    },
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
  }, getStrategies(activeAccount).map(function (s) {
    return React.createElement("option", {
      key: s.id,
      value: s.id
    }, s.name);
  }))), React.createElement("div", null, React.createElement("label", {
    className: "block text-sm text-gray-400 mb-1.5"
  }, "Daily Bias (which way is the trend?)"), React.createElement("div", {
    className: "flex gap-2"
  }, BIAS_OPTIONS.map(function (b) {
    return React.createElement("button", {
      key: b.key,
      onClick: function () {
        setNewEntry(Object.assign({}, newEntry, {
          dailyBias: b.key
        }));
      },
      className: "flex-1 py-2 rounded-lg text-sm font-medium transition border flex items-center justify-center gap-1.5 " + (newEntry.dailyBias === b.key ? b.cls : 'bg-gray-800 text-gray-500 border-gray-700')
    }, React.createElement(Icon, {
      name: b.icon,
      className: "h-3.5 w-3.5"
    }), React.createElement("span", null, b.label));
  }))), React.createElement(DailyTradeMatrix, {
    riskUnit: effectiveRiskPerTrade,
    rewardRatio: activeRR
  }), React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-1"
  }, React.createElement("label", {
    className: "text-sm text-gray-400"
  }, "Trades"), React.createElement("span", {
    className: "text-xs text-gray-500"
  }, "Risk: ", React.createElement("span", {
    className: "text-blue-400 font-medium"
  }, fmt(effectiveRiskPerTrade)), " - ", effectiveContractLabel, " (", activeTicker, ") - Max stop: ", React.createElement("span", {
    className: "text-red-400 font-medium"
  }, maxStopPoints.toFixed(0), " pts"))), newEntry.trades.map(function (trade, idx) {
    const applicableRules = rulesForDirection(trade.direction);
    const aligned = biasAligns(newEntry.dailyBias, trade.direction);
    return React.createElement("div", {
      key: idx,
      className: "bg-gray-800/40 border border-gray-700 rounded-lg p-3 space-y-2"
    }, React.createElement("div", {
      className: "flex items-center gap-2 flex-wrap"
    }, React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'direction', 'long');
      },
      className: "px-2.5 py-1.5 rounded-lg text-xs font-medium transition " + (trade.direction === 'long' ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-gray-800 text-gray-500 border border-gray-700')
    }, "Long"), React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'direction', 'short');
      },
      className: "px-2.5 py-1.5 rounded-lg text-xs font-medium transition " + (trade.direction === 'short' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-gray-800 text-gray-500 border border-gray-700')
    }, "Short"), aligned !== null && React.createElement("span", {
      className: "text-[10px] px-2 py-1 rounded flex items-center gap-1 " + (aligned ? 'bg-green-500/15 text-green-400' : 'bg-orange-500/15 text-orange-400')
    }, React.createElement(Icon, {
      name: aligned ? "CheckCircle" : "AlertTriangle",
      className: "h-2.5 w-2.5"
    }), React.createElement("span", null, aligned ? 'With trend' : 'Against bias'))), React.createElement("div", {
      className: "flex items-center gap-2"
    }, React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'result', 'win');
      },
      className: "px-3 py-2 rounded-lg text-sm font-medium transition " + (trade.result === 'win' ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-gray-800 text-gray-500 border border-gray-700')
    }, "Win"), React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'result', 'loss');
      },
      className: "px-3 py-2 rounded-lg text-sm font-medium transition " + (trade.result === 'loss' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-gray-800 text-gray-500 border border-gray-700')
    }, "Loss"), React.createElement("input", {
      type: "number",
      placeholder: "P&L amount",
      value: trade.pnl,
      onChange: function (e) {
        updateTradeRow(idx, 'pnl', e.target.value);
      },
      className: "flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400/50 outline-none"
    }), newEntry.trades.length > 1 && React.createElement("button", {
      onClick: function () {
        removeTradeRow(idx);
      },
      className: "text-gray-500 hover:text-red-400 flex-shrink-0"
    }, React.createElement(Icon, {
      name: "X",
      className: "h-4 w-4"
    }))), React.createElement("div", {
      className: "grid grid-cols-2 gap-2"
    }, React.createElement("input", {
      type: "number",
      placeholder: "Contracts",
      value: trade.positionSize,
      onChange: function (e) {
        updateTradeRow(idx, 'positionSize', e.target.value);
      },
      className: "bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400/50 outline-none"
    }), React.createElement("input", {
      type: "number",
      placeholder: "$ Risked on this trade",
      value: trade.riskAmount,
      onChange: function (e) {
        updateTradeRow(idx, 'riskAmount', e.target.value);
      },
      className: "bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400/50 outline-none"
    })), React.createElement("button", {
      onClick: function () {
        updateTradeRow(idx, 'htfLtf', !trade.htfLtf);
      },
      className: "w-full flex items-center gap-2 text-left text-xs text-gray-300 hover:text-white"
    }, React.createElement(Icon, {
      name: trade.htfLtf ? "CheckSquare" : "Square",
      className: "h-4 w-4 flex-shrink-0 " + (trade.htfLtf ? 'text-green-400' : 'text-gray-600')
    }), React.createElement("span", null, "HTF to LTF analysis done before this trade?")), React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, React.createElement(Icon, {
      name: "Link",
      className: "h-3.5 w-3.5 text-gray-500 flex-shrink-0"
    }), React.createElement("input", {
      type: "url",
      placeholder: "TradingView chart link (optional)",
      value: trade.chartUrl || '',
      onChange: function (e) {
        updateTradeRow(idx, 'chartUrl', e.target.value);
      },
      className: "flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-xs focus:border-yellow-400/50 outline-none"
    })), applicableRules.length > 0 && React.createElement("div", {
      className: "bg-black/30 rounded-lg p-2.5 space-y-1.5"
    }, React.createElement("p", {
      className: "text-[11px] text-gray-500 uppercase tracking-wide"
    }, "Did you follow your ", trade.direction, " rules?"), applicableRules.map(function (rule, ri) {
      const checked = (trade.rulesChecked || []).indexOf(rule) !== -1;
      return React.createElement("button", {
        key: ri,
        onClick: function () {
          toggleRuleChecked(idx, rule);
        },
        className: "w-full flex items-center gap-2 text-left text-xs text-gray-300 hover:text-white"
      }, React.createElement(Icon, {
        name: checked ? "CheckSquare" : "Square",
        className: "h-4 w-4 flex-shrink-0 " + (checked ? 'text-green-400' : 'text-gray-600')
      }), React.createElement("span", null, rule));
    })));
  }), filledLosses >= 2 && React.createElement("p", {
    className: "text-xs text-red-400 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "AlertTriangle",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Circuit Breaker - 2 losses. Day over.")), filledWins >= 2 && React.createElement("p", {
    className: "text-xs text-green-400 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "CheckCircle",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Greed Filter - 2 wins. Day over.")), isTie && React.createElement("p", {
    className: "text-xs text-yellow-400 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "Scale",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Tie-Breaker required - Trade 3 is mandatory before you can save today's log.")), filledTrades.length >= 3 && React.createElement("p", {
    className: "text-xs text-gray-400"
  }, "Day over - Trade 3 result stands."), consistencyCap !== null && filledPnlSigned > 0 && React.createElement("p", {
    className: "text-xs flex items-center gap-1.5 " + (overConsistency ? 'text-red-400' : 'text-gray-400')
  }, React.createElement(Icon, {
    name: overConsistency ? "AlertTriangle" : "Info",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Today: ", fmt(filledPnlSigned), " of ", fmt(consistencyCap), " max allowed under your ", activeAccount.consistencyPct, "% consistency rule", overConsistency ? ' - exceeded, this day will need diluting by future profitable days' : '', ".")), dllLimit !== null && React.createElement("p", {
    className: "text-xs flex items-center gap-1.5 " + (dllBreached ? 'text-red-400' : 'text-gray-400')
  }, React.createElement(Icon, {
    name: dllBreached ? "AlertTriangle" : "Info",
    className: "h-3.5 w-3.5"
  }), React.createElement("span", null, "Daily Loss Limit: ", fmt(todaysLoss), " of ", fmt(dllLimit), dllBreached ? activeAccount.dllType === 'hard' ? ' - HARD BREACH, this would terminate the account' : ' - SOFT BREACH, firm would flatten and lock you out today' : '', ".")), React.createElement("button", {
    onClick: addTradeRow,
    disabled: newEntry.trades.length >= 3 || filledWins >= 2 || filledLosses >= 2 || dllBreached,
    className: "text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1.5 mt-1 disabled:opacity-30 disabled:cursor-not-allowed"
  }, React.createElement(Icon, {
    name: "Plus",
    className: "h-3 w-3"
  }), React.createElement("span", null, "Add another trade"))), React.createElement(Field, {
    label: "How was your day? (thoughts, emotions, anything on your mind)"
  }, React.createElement("textarea", {
    value: newEntry.notes,
    onChange: function (e) {
      setNewEntry(Object.assign({}, newEntry, {
        notes: e.target.value
      }));
    },
    placeholder: "How did it feel taking these trades? Any pressure, doubt, confidence...",
    className: "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 h-20 focus:border-yellow-400/50 outline-none resize-none"
  })), saveEntryError && React.createElement("p", {
    className: "text-red-400 text-xs"
  }, saveEntryError), React.createElement("button", {
    onClick: handleSaveEntry,
    disabled: filledTrades.length === 0 || isTie,
    className: "w-full bg-gradient-to-r from-green-500 to-emerald-600 text-black py-2.5 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
  }, React.createElement(Icon, {
    name: "Save",
    className: "h-4 w-4"
  }), React.createElement("span", null, "Save Entry")))))));
}
function StatCard(props) {
  return React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4"
  }, React.createElement("div", {
    className: "flex items-start justify-between mb-3"
  }, React.createElement("span", {
    className: "text-xs text-gray-500"
  }, props.label), React.createElement("div", {
    className: "h-7 w-7 rounded-full flex items-center justify-center bg-current/10 flex-shrink-0 " + props.color
  }, React.createElement(Icon, {
    name: props.icon,
    className: "h-3.5 w-3.5 " + props.color
  }))), React.createElement("div", {
    className: "num text-2xl font-bold " + props.color
  }, props.value), props.sub && React.createElement("div", {
    className: "text-xs text-gray-600 mt-1"
  }, props.sub));
}
function Modal(props) {
  const size = props.size || 'md';
  return React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4"
  }, React.createElement("div", {
    className: "fixed inset-0 bg-black bg-opacity-80",
    onClick: props.onClose
  }), React.createElement("div", {
    className: "relative bg-black border border-yellow-500/20 rounded-2xl p-6 w-full " + (size === 'lg' ? 'max-w-lg' : 'max-w-md') + " max-h-[90vh] overflow-y-auto shadow-2xl"
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-5"
  }, React.createElement("h3", {
    className: "text-lg font-bold text-white"
  }, props.title), React.createElement("button", {
    onClick: props.onClose,
    className: "text-gray-500 hover:text-white flex-shrink-0"
  }, React.createElement(Icon, {
    name: "X",
    className: "h-5 w-5"
  }))), props.children));
}
function Field(props) {
  return React.createElement("div", null, React.createElement("label", {
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
  if (user === undefined) return React.createElement("div", {
    className: "min-h-screen bg-black flex items-center justify-center text-yellow-400"
  }, "Loading...");
  return user ? React.createElement(MMMJournal, {
    user: user,
    language: language,
    setLanguage: setLanguage
  }) : React.createElement(AuthScreen, {
    language: language,
    setLanguage: setLanguage
  });
}
const rootEl = ReactDOM.createRoot(document.getElementById('root'));
rootEl.render(React.createElement(App, null));