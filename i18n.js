const MMM_LANGS = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'ht', label: 'Kreyòl Ayisyen' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'de', label: 'Deutsch' },
];

const MMM_TRANSLATIONS = {
  "Features": { fr: "Fonctionnalités", es: "Funciones", ht: "Karakteristik", ja: "機能", zh: "功能", de: "Funktionen" },
  "Courses": { fr: "Cours", es: "Cursos", ht: "Kou", ja: "コース", zh: "课程", de: "Kurse" },
  "Journal": { fr: "Journal", es: "Diario", ht: "Jounal", ja: "ジャーナル", zh: "交易日志", de: "Journal" },
  "Free Trading Test": { fr: "Test de trading gratuit", es: "Prueba de trading gratuita", ht: "Tès Tranzaksyon Gratis", ja: "無料トレーディングテスト", zh: "免费交易测试", de: "Kostenloser Trading-Test" },
  "Live Analysis": { fr: "Analyse en direct", es: "Análisis en vivo", ht: "Analiz an Dirèk", ja: "ライブ分析", zh: "实时分析", de: "Live-Analyse" },
  "Watch Live": { fr: "Regarder en direct", es: "Ver en vivo", ht: "Gade an Dirèk", ja: "ライブを見る", zh: "观看直播", de: "Live ansehen" },
  "Join MMM Trading": { fr: "Rejoindre MMM Trading", es: "Únete a MMM Trading", ht: "Antre nan MMM Trading", ja: "MMM Tradingに参加", zh: "加入MMM Trading", de: "MMM Trading beitreten" },
  "Max Maserati Model": { fr: "Modèle Max Maserati", es: "Modelo Max Maserati", ht: "Modèl Max Maserati", ja: "マックス・マセラティ・モデル", zh: "Max Maserati 模型", de: "Max-Maserati-Modell" },
  "Master The MMM Method": { fr: "Maîtrisez la méthode MMM", es: "Domina el método MMM", ht: "Mèt metòd MMM a", ja: "MMMメソッドをマスターする", zh: "精通MMM方法", de: "Die MMM-Methode meistern" },
  "With Precision": { fr: "Avec précision", es: "Con precisión", ht: "Avèk presizyon", ja: "精密に", zh: "精准制胜", de: "Mit Präzision" },
  "Max Maserati's order-flow system for ES and NQ futures.": { fr: "Le système d'order flow de Max Maserati pour les futures ES et NQ.", es: "El sistema de flujo de órdenes de Max Maserati para los futuros ES y NQ.", ht: "Sistèm order-flow Max Maserati pou fiti ES ak NQ.", ja: "ES・NQ先物のためのマックス・マセラティのオーダーフローシステム。", zh: "Max Maserati 为 ES 和 NQ 期货打造的订单流系统。", de: "Max Maseratis Orderflow-System für ES- und NQ-Futures." },
  "The MMM indicators": { fr: "les indicateurs MMM", es: "los indicadores MMM", ht: "endikatè MMM yo", ja: "MMMインジケーター", zh: "MMM指标", de: "die MMM-Indikatoren" },
  ", the": { fr: ", le", es: ", el", ht: ", ", ja: "、", zh: "，", de: ", der" },
  "MMM Mastery Course": { fr: "Cours de Maîtrise MMM", es: "Curso de Maestría MMM", ht: "Kou Mèt MMM", ja: "MMMマスタリーコース", zh: "MMM精通课程", de: "MMM Mastery Course" },
  ", and a full": { fr: ", et un", es: ", y un", ht: ", ak yon", ja: "、そして", zh: "，以及完整的", de: ", und ein vollständiges" },
  "prop-firm journal": { fr: "journal prop-firm complet", es: "diario completo para prop firms", ht: "jounal konplè pou prop-firm", ja: "プロップファーム・ジャーナル", zh: "资金交易商交易日志", de: "Prop-Firm-Journal" },
  "- all built to keep you funded, not just entered.": { fr: "- tout est conçu pour vous garder financé, pas seulement pour entrer en position.", es: "- todo diseñado para mantenerte financiado, no solo para entrar en una operación.", ht: "- tout bati pou kenbe w finanse, pa sèlman pou antre nan tranzaksyon.", ja: "- ただ入るだけでなく、資金を維持し続けるために作られています。", zh: "- 一切都旨在让你持续获得资金，而不仅仅是进场。", de: "- alles darauf ausgelegt, dich finanziert zu halten, nicht nur einzusteigen." },
  "Open MMM Pro Journal": { fr: "Ouvrir MMM Pro Journal", es: "Abrir MMM Pro Journal", ht: "Ouvri MMM Pro Journal", ja: "MMM Pro Journalを開く", zh: "打开MMM Pro Journal", de: "MMM Pro Journal öffnen" },
  "Not sure what's holding your trading back? Take the free 2-minute Trading Discipline Test": { fr: "Vous ne savez pas ce qui freine votre trading ? Passez le test gratuit de discipline de trading de 2 minutes", es: "¿No sabes qué está frenando tu trading? Haz la prueba gratuita de disciplina de trading de 2 minutos", ht: "Ou pa sèten sa k ap bloke tranzaksyon ou? Fè tès gratis 2 minit sou disiplin tranzaksyon an", ja: "何があなたのトレードの妨げになっているかわからない？無料の2分間トレーディング規律テストを受けましょう", zh: "不确定是什么在拖累你的交易？参加免费的2分钟交易纪律测试", de: "Nicht sicher, was dein Trading ausbremst? Mach den kostenlosen 2-Minuten-Trading-Disziplin-Test" },
  "One System, Every Piece": { fr: "Un seul système, chaque élément", es: "Un solo sistema, cada pieza", ht: "Yon sèl Sistèm, Chak Moso", ja: "ひとつのシステム、すべてのピース", zh: "一个系统，涵盖一切", de: "Ein System, jedes Teil" },
  "Built For Prop Traders": { fr: "Conçu pour les traders Prop", es: "Diseñado para traders Prop", ht: "Fèt pou Trader Prop yo", ja: "プロップトレーダーのために作られた", zh: "为专业资金交易者打造", de: "Gebaut für Prop-Trader" },
  "Everything Max teaches and everything you trade with, under one roof.": { fr: "Tout ce que Max enseigne et tout ce avec quoi vous tradez, sous un même toit.", es: "Todo lo que Max enseña y todo con lo que operas, bajo un mismo techo.", ht: "Tout sa Max anseye ak tout sa ou itilize pou fè tranzaksyon, anba yon sèl do.", ja: "マックスが教えるすべてと、あなたが取引で使うすべてが、ひとつにまとまっています。", zh: "Max 所传授的一切，以及你交易所需的一切，尽在一处。", de: "Alles, was Max lehrt, und alles, womit du handelst, unter einem Dach." },
  "The MMM Method": { fr: "La méthode MMM", es: "El método MMM", ht: "Metòd MMM la", ja: "MMMメソッド", zh: "MMM方法", de: "Die MMM-Methode" },
  "The MMM indicator suite - structure, confluence, and quality-gated entries - taught step by step inside the MMM Mastery Course.": { fr: "La suite d'indicateurs MMM - structure, confluence et entrées filtrées par qualité - enseignée étape par étape dans le Cours de Maîtrise MMM.", es: "El conjunto de indicadores MMM - estructura, confluencia y entradas filtradas por calidad - enseñado paso a paso en el Curso de Maestría MMM.", ht: "Seri endikatè MMM yo - estrikti, konfliyans, ak antre ki filtre pa kalite - anseye etap pa etap nan Kou Mèt MMM la.", ja: "MMMインジケータースイート - 構造、コンフルエンス、質で絞り込んだエントリー - をMMMマスタリーコースの中でステップごとに学べます。", zh: "MMM指标套件——结构、汇合点和质量筛选入场——在MMM精通课程中逐步讲授。", de: "Die MMM-Indikator-Suite - Struktur, Konfluenz und qualitätsgefilterte Einstiege - Schritt für Schritt im MMM Mastery Course vermittelt." },
  "Mental Check & Daily Plan": { fr: "Contrôle mental et plan quotidien", es: "Chequeo mental y plan diario", ht: "Verifikasyon Mantal ak Plan Chak Jou", ja: "メンタルチェック＆デイリープラン", zh: "心理检查与每日计划", de: "Mentaler Check & Tagesplan" },
  "A 4-question pre-session check-in and a written game plan - risk, target, max loss and the setups you're allowed to take - before you're allowed to trade.": { fr: "Un contrôle de 4 questions avant la session et un plan écrit - risque, objectif, perte maximale et les configurations autorisées - avant d'être autorisé à trader.", es: "Un chequeo de 4 preguntas antes de la sesión y un plan escrito - riesgo, objetivo, pérdida máxima y las configuraciones permitidas - antes de que se te permita operar.", ht: "Yon verifikasyon 4 kesyon anvan sesyon an ak yon plan ekri - risk, objektif, pèt maksimòm ak setup ou gen dwa pran - anvan yo kite w fè tranzaksyon.", ja: "セッション前の4つの質問チェックインと書面のゲームプラン - リスク、目標、最大損失、許可されたセットアップ - を取引が許可される前に確認します。", zh: "开盘前进行4项提问自检，并制定书面计划——风险、目标、最大亏损以及允许采用的交易设置——之后才能开始交易。", de: "Ein 4-Fragen-Check-in vor der Session und ein schriftlicher Spielplan - Risiko, Ziel, maximaler Verlust und die erlaubten Setups - bevor du handeln darfst." },
  "General vs. Personal Risk": { fr: "Risque général vs. personnel", es: "Riesgo general vs. personal", ht: "Risk Jeneral kont Risk Pèsonèl", ja: "一般リスク vs 個人リスク", zh: "系统风险与个人风险", de: "Allgemeines vs. persönliches Risiko" },
  "The system max every trader shares, and the personal risk tolerance you set and lock for yourself - never above the system, locked until the account passes or fails.": { fr: "Le maximum du système partagé par tous les traders, et la tolérance au risque personnelle que vous définissez et verrouillez vous-même - jamais au-dessus du système, verrouillée jusqu'à ce que le compte réussisse ou échoue.", es: "El máximo del sistema que comparten todos los traders, y la tolerancia al riesgo personal que tú defines y bloqueas - nunca por encima del sistema, bloqueada hasta que la cuenta pase o falle.", ht: "Maksimòm sistèm nan ke tout trader pataje, ak tolerans risk pèsonèl ou mete epi fèmen pou tèt ou - pa janm pi wo pase sistèm nan, fèmen jiskaske kont lan reyisi oswa echwe.", ja: "すべてのトレーダーが共有するシステムの上限と、自分で設定しロックする個人のリスク許容度 - システムを超えることは決してなく、口座が合格または失敗するまでロックされます。", zh: "所有交易者共享的系统最大风险，以及你自行设定并锁定的个人风险承受度——永远不会超过系统上限，锁定至账户通过或失败为止。", de: "Das Systemmaximum, das sich jeder Trader teilt, und die persönliche Risikotoleranz, die du selbst festlegst und sperrst - nie über dem System, gesperrt, bis das Konto besteht oder scheitert." },
  "Discipline Leaderboard": { fr: "Classement de la discipline", es: "Tabla de disciplina", ht: "Klasman disiplin", ja: "規律ランキング", zh: "纪律排行榜", de: "Disziplin-Rangliste" },
  "Every trader's discipline score, ranked - rule-following scored separately from P&L, so a no-trade day counts for just as much as a green one.": { fr: "Le score de discipline de chaque trader, classé - le respect des règles est noté séparément du P&L, donc une journée sans trade compte autant qu'une journée gagnante.", es: "La puntuación de disciplina de cada trader, clasificada - el cumplimiento de reglas se puntúa por separado del P&L, así que un día sin operar cuenta tanto como uno ganador.", ht: "Nòt disiplin chak trader, klase - respekte règ yo nòte apa de P&L, kidonk yon jou san tranzaksyon konte menm jan ak yon jou pozitif.", ja: "すべてのトレーダーの規律スコアをランキング化 - ルール遵守はP&Lとは別に採点されるため、取引しなかった日も黒字の日と同じだけ評価されます。", zh: "每位交易者的纪律得分排名——规则遵守情况与盈亏分开计分，因此无交易日与盈利日同样重要。", de: "Der Disziplin-Score jedes Traders, gerankt - Regeltreue wird getrennt vom P&L bewertet, sodass ein handelsfreier Tag genauso zählt wie ein grüner." },
  "Payout Tracker": { fr: "Suivi des paiements", es: "Seguimiento de pagos", ht: "Swiv Peman", ja: "ペイアウトトラッカー", zh: "提现追踪器", de: "Auszahlungs-Tracker" },
  "Threshold, streak, cycle-formula or two-leg - every prop-firm payout rule tracked and the moment a payout is actually due.": { fr: "Seuil, série, formule cyclique ou à deux volets - chaque règle de paiement des prop firms est suivie, ainsi que le moment où un paiement est réellement dû.", es: "Umbral, racha, fórmula cíclica o de dos etapas - se rastrea cada regla de pago de las prop firms y el momento exacto en que un pago realmente vence.", ht: "Papòt, seri, fòmil sik oswa de etap - chak règ peman prop-firm swiv ansanm ak moman egzak yon peman vrèman dwe fèt.", ja: "閾値、連勝、サイクル式、二段階方式 - あらゆるプロップファームの出金ルールを追跡し、出金が実際に発生する瞬間を把握します。", zh: "阈值、连胜、周期公式或两段式——追踪每一条资金交易商的提现规则，精确掌握提现到账的时刻。", de: "Schwelle, Serie, Zyklusformel oder zweistufig - jede Prop-Firm-Auszahlungsregel wird verfolgt, inklusive dem Moment, an dem eine Auszahlung tatsächlich fällig ist." },
  "CSV Trade Import": { fr: "Import CSV des transactions", es: "Importación CSV de operaciones", ht: "Enpòte Tranzaksyon CSV", ja: "CSV取引インポート", zh: "CSV交易导入", de: "CSV-Trade-Import" },
  "Pull trades straight in from Tradovate, NinjaTrader, TopstepX, ProjectX and the rest - no manual entry.": { fr: "Importez vos transactions directement depuis Tradovate, NinjaTrader, TopstepX, ProjectX et les autres - aucune saisie manuelle.", es: "Importa tus operaciones directamente desde Tradovate, NinjaTrader, TopstepX, ProjectX y el resto - sin entrada manual.", ht: "Pote tranzaksyon yo dirèkteman soti nan Tradovate, NinjaTrader, TopstepX, ProjectX ak lòt yo - pa gen antre manyèl.", ja: "Tradovate、NinjaTrader、TopstepX、ProjectXなどから直接取引を取り込めます - 手動入力は不要です。", zh: "直接从 Tradovate、NinjaTrader、TopstepX、ProjectX 等平台导入交易——无需手动录入。", de: "Trades direkt aus Tradovate, NinjaTrader, TopstepX, ProjectX und anderen importieren - keine manuelle Eingabe." },
  "Buffer-First Risk": { fr: "Risque basé sur le tampon", es: "Riesgo basado en el colchón", ht: "Risk ki Baze sou Tanpon", ja: "バッファー優先リスク管理", zh: "以缓冲资金为先的风险管理", de: "Puffer-first-Risiko" },
  "Challenge, Funded and Live accounts sized off what you can actually afford to lose - never off the account's face value.": { fr: "Les comptes Challenge, Funded et Live sont dimensionnés en fonction de ce que vous pouvez réellement vous permettre de perdre - jamais en fonction de la valeur nominale du compte.", es: "Las cuentas Challenge, Funded y Live se dimensionan según lo que realmente puedes permitirte perder - nunca según el valor nominal de la cuenta.", ht: "Kont Challenge, Funded ak Live yo kalkile dapre sa ou kapab reyèlman pèdi - jamè dapre valè nominal kont lan.", ja: "チャレンジ、ファンデッド、ライブの各口座は、実際に失ってもよい金額を基準にサイズを決定します - 口座の額面価値を基準にすることは決してありません。", zh: "挑战账户、出资账户和实盘账户的仓位大小，均以你实际可承受的亏损为依据——而非账户的账面价值。", de: "Challenge-, Funded- und Live-Konten werden danach bemessen, was du dir wirklich leisten kannst zu verlieren - nie nach dem Nennwert des Kontos." },
  "Target Projection": { fr: "Projection d'objectif", es: "Proyección de meta", ht: "Pwojeksyon Objektif", ja: "目標プロジェクション", zh: "目标预测", de: "Zielprojektion" },
  "Model the path to your target by day, by win rate, or by a set number of wins and losses - scaled across every account you copy-trade.": { fr: "Modélisez le chemin vers votre objectif par jour, par taux de réussite, ou par un nombre défini de gains et de pertes - à l'échelle de tous les comptes que vous copy-tradez.", es: "Modela el camino hacia tu meta por día, por tasa de victorias, o por un número determinado de ganancias y pérdidas - escalado a todas las cuentas que copias.", ht: "Modèlize chemen pou rive nan objektif ou pa jou, pa pousantaj viktwa, oswa pa yon kantite genyen ak pèdi fikse - eskalade sou chak kont ou kopye-trade.", ja: "日ごと、勝率ごと、または設定した勝敗数ごとに目標への道のりをモデル化 - コピートレードするすべての口座にスケールして適用されます。", zh: "按天、按胜率，或按设定的盈亏次数，规划通往目标的路径——并按比例应用到你跟单的每个账户。", de: "Modelliere den Weg zu deinem Ziel nach Tag, nach Trefferquote oder nach einer festgelegten Anzahl von Gewinnen und Verlusten - skaliert über jedes Konto, das du kopierst." },
  "Free · Interactive": { fr: "Gratuit · Interactif", es: "Gratis · Interactivo", ht: "Gratis · Entèraktif", ja: "無料・インタラクティブ", zh: "免费 · 互动式", de: "Kostenlos · Interaktiv" },
  "The MMM Mastery Course": { fr: "Le Cours de Maîtrise MMM", es: "El Curso de Maestría MMM", ht: "Kou Mèt MMM la", ja: "MMMマスタリーコース", zh: "MMM精通课程", de: "Der MMM Mastery Course" },
  "The full order-flow curriculum, free and interactive - 11 phases from reading a single candle to running the MMM Pro indicators and a full entry checklist. Every phase ends in a quiz, every section has homework, and your progress is saved to your MMM Pro Journal account as you go - sign in or create a free account to start.": { fr: "Le programme complet d'order flow, gratuit et interactif - 11 phases, de la lecture d'une seule bougie à l'utilisation des indicateurs MMM Pro et d'une checklist d'entrée complète. Chaque phase se termine par un quiz, chaque section a des devoirs, et votre progression est enregistrée sur votre compte MMM Pro Journal au fur et à mesure - connectez-vous ou créez un compte gratuit pour commencer.", es: "El plan de estudios completo de order flow, gratuito e interactivo - 11 fases, desde leer una sola vela hasta usar los indicadores MMM Pro y una lista de verificación de entrada completa. Cada fase termina con un cuestionario, cada sección tiene tareas, y tu progreso se guarda en tu cuenta de MMM Pro Journal a medida que avanzas - inicia sesión o crea una cuenta gratuita para empezar.", ht: "Kourikoulòm order-flow konplè a, gratis e entèraktif - 11 faz, depi li yon sèl bouji jiska itilize endikatè MMM Pro yo ak yon lis verifikasyon antre konplè. Chak faz fini ak yon quiz, chak seksyon gen devwa, epi pwogrè ou sove sou kont MMM Pro Journal ou pandan w ap avanse - konekte oswa kreye yon kont gratis pou kòmanse.", ja: "完全なオーダーフロー・カリキュラム、無料でインタラクティブ - 1本のローソク足の読み方からMMM Proインジケーターの運用、完全なエントリーチェックリストまで11フェーズ。各フェーズはクイズで終わり、各セクションには宿題があり、進捗はMMM Pro Journalアカウントに自動保存されます - 開始するにはサインインするか無料アカウントを作成してください。", zh: "完整的订单流课程体系，免费且互动——共11个阶段，从读懂单根K线到运用MMM Pro指标并完成完整的入场检查清单。每个阶段都以测验结束，每个章节都有作业，学习进度会实时保存到你的MMM Pro Journal账户——登录或创建免费账户即可开始。", de: "Das vollständige Orderflow-Curriculum, kostenlos und interaktiv - 11 Phasen, vom Lesen einer einzelnen Kerze bis zum Einsatz der MMM-Pro-Indikatoren und einer vollständigen Einstiegs-Checkliste. Jede Phase endet mit einem Quiz, jeder Abschnitt hat Hausaufgaben, und dein Fortschritt wird laufend in deinem MMM-Pro-Journal-Konto gespeichert - melde dich an oder erstelle ein kostenloses Konto, um zu starten." },
  "Start the Course Free": { fr: "Commencer le cours gratuitement", es: "Empezar el curso gratis", ht: "Kòmanse Kou a Gratis", ja: "無料でコースを始める", zh: "免费开始课程", de: "Kurs kostenlos starten" },
  "See the Indicators on Whop": { fr: "Voir les indicateurs sur Whop", es: "Ver los indicadores en Whop", ht: "Gade Endikatè yo sou Whop", ja: "Whopでインジケーターを見る", zh: "在Whop上查看指标", de: "Indikatoren auf Whop ansehen" },
  "Phases": { fr: "Phases", es: "Fases", ht: "Faz", ja: "フェーズ", zh: "阶段", de: "Phasen" },
  "11, candles to execution": { fr: "11, des bougies à l'exécution", es: "11, de las velas a la ejecución", ht: "11, depi bouji jiska egzekisyon", ja: "11、ローソク足から実行まで", zh: "11个，从K线到执行", de: "11, von Kerzen bis zur Ausführung" },
  "Quizzes": { fr: "Quiz", es: "Cuestionarios", ht: "Quiz", ja: "クイズ", zh: "测验", de: "Quizze" },
  "60, one per idea": { fr: "60, un par idée", es: "60, uno por idea", ht: "60, youn pou chak lide", ja: "60、アイデアごとに1つ", zh: "60个，每个知识点一个", de: "60, eines pro Idee" },
  "Homework": { fr: "Devoirs", es: "Tareas", ht: "Devwa", ja: "宿題", zh: "作业", de: "Hausaufgaben" },
  "42 chart tasks": { fr: "42 exercices sur graphique", es: "42 ejercicios de gráficos", ht: "42 egzèsis chart", ja: "42のチャート課題", zh: "42项图表任务", de: "42 Chart-Aufgaben" },
  "Cost": { fr: "Coût", es: "Costo", ht: "Pri", ja: "費用", zh: "费用", de: "Kosten" },
  "Free, account required": { fr: "Gratuit, compte requis", es: "Gratis, se requiere cuenta", ht: "Gratis, kont obligatwa", ja: "無料、アカウントが必要", zh: "免费，需要账户", de: "Kostenlos, Konto erforderlich" },
  "Risk Tolerance": { fr: "Tolérance au risque", es: "Tolerancia al riesgo", ht: "Tolerans Risk", ja: "リスク許容度", zh: "风险承受度", de: "Risikotoleranz" },
  "Set once, locked": { fr: "Défini une fois, verrouillé", es: "Definido una vez, bloqueado", ht: "Mete yon sèl fwa, fèmen", ja: "一度設定するとロック", zh: "设定一次，锁定不变", de: "Einmal festgelegt, gesperrt" },
  "Pre-Session Mental Check": { fr: "Contrôle mental avant session", es: "Chequeo mental previo a la sesión", ht: "Verifikasyon Mantal Anvan Sesyon", ja: "セッション前メンタルチェック", zh: "开盘前心理检查", de: "Mentaler Check vor der Session" },
  "Scored /40": { fr: "Noté sur 40", es: "Puntuado sobre 40", ht: "Nòte sou 40", ja: "40点満点で採点", zh: "满分40分", de: "Bewertet /40" },
  "Ranked, live": { fr: "Classé, en direct", es: "Clasificado, en vivo", ht: "Klase, an dirèk", ja: "リアルタイムランキング", zh: "实时排名", de: "Gerankt, live" },
  "Due the moment you qualify": { fr: "Dû dès que vous êtes éligible", es: "Vence en el momento en que calificas", ht: "Dwe fèt depi ou kalifye", ja: "資格を得た瞬間に発生", zh: "符合条件即刻到账", de: "Fällig, sobald du qualifiziert bist" },
  "Every prop-firm account in one dashboard, built around a buffer you set and lock once, not the account's face value. A pre-session mental check and a written daily plan gate the day before you trade. Every entry - including a no-trade day - feeds a discipline score that ranks you against every other trader on the leaderboard. CSV import pulls your fills straight from Tradovate, NinjaTrader, TopstepX and the rest, and a live payout tracker watches threshold, streak, cycle-formula and two-leg rules so you know the moment a payout is actually due.": { fr: "Tous vos comptes prop-firm dans un seul tableau de bord, construit autour d'un tampon que vous définissez et verrouillez une fois, et non de la valeur nominale du compte. Un contrôle mental avant session et un plan quotidien écrit conditionnent la journée avant que vous ne tradiez. Chaque entrée - y compris une journée sans trade - alimente un score de discipline qui vous classe par rapport à tous les autres traders du classement. L'import CSV récupère vos exécutions directement depuis Tradovate, NinjaTrader, TopstepX et les autres, et un suivi des paiements en direct surveille les règles de seuil, de série, de formule cyclique et à deux volets, afin que vous sachiez exactement quand un paiement est réellement dû.", es: "Todas tus cuentas prop-firm en un solo panel, construido alrededor de un colchón que defines y bloqueas una vez, no del valor nominal de la cuenta. Un chequeo mental previo a la sesión y un plan diario escrito condicionan el día antes de operar. Cada entrada - incluyendo un día sin operar - alimenta una puntuación de disciplina que te clasifica frente a todos los demás traders en la tabla de posiciones. La importación CSV trae tus ejecuciones directamente desde Tradovate, NinjaTrader, TopstepX y el resto, y un seguimiento de pagos en vivo vigila las reglas de umbral, racha, fórmula cíclica y de dos etapas para que sepas el momento exacto en que un pago realmente vence.", ht: "Chak kont prop-firm nan yon sèl tablo, bati otou yon tanpon ou mete epi fèmen yon sèl fwa, pa valè nominal kont lan. Yon verifikasyon mantal anvan sesyon ak yon plan chak jou ekri kontwole jounen an anvan ou fè tranzaksyon. Chak antre - menm yon jou san tranzaksyon - ogmante yon nòt disiplin ki klase w kont tout lòt trader sou klasman an. Enpòtasyon CSV pran egzekisyon ou yo dirèkteman nan Tradovate, NinjaTrader, TopstepX ak lòt yo, epi yon swiv peman an dirèk veye règ papòt, seri, fòmil sik ak de etap pou w konnen egzakteman lè yon peman vrèman dwe fèt.", ja: "すべてのプロップファーム口座を1つのダッシュボードで管理 - 口座の額面ではなく、自分で設定して一度ロックするバッファーを基準にします。セッション前のメンタルチェックと書面のデイリープランが、取引前のゲートになります。取引しなかった日を含むすべての記録が規律スコアに反映され、リーダーボード上で他のすべてのトレーダーと比較されます。CSVインポートでTradovate、NinjaTrader、TopstepXなどから約定を直接取り込み、ライブのペイアウトトラッカーが閾値・連勝・サイクル式・二段階方式のルールを監視するので、出金が実際に発生する瞬間が正確にわかります。", zh: "将每个资金交易商账户整合到一个仪表盘中，以你设定并锁定一次的缓冲资金为基准，而非账户账面价值。开盘前心理检查和书面每日计划是交易前的必经关卡。包括无交易日在内的每一笔记录都会计入纪律得分，并在排行榜上与所有其他交易者进行排名比较。CSV导入功能可直接从 Tradovate、NinjaTrader、TopstepX 等平台拉取成交记录，实时提现追踪器会监控阈值、连胜、周期公式和两段式规则，让你准确掌握提现到账的时刻。", de: "Jedes Prop-Firm-Konto in einem Dashboard, aufgebaut um einen Puffer, den du einmal festlegst und sperrst - nicht um den Nennwert des Kontos. Ein mentaler Check vor der Session und ein schriftlicher Tagesplan öffnen das Tor zum Handelstag. Jeder Eintrag - einschließlich eines handelsfreien Tages - fließt in einen Disziplin-Score ein, der dich gegen jeden anderen Trader auf der Rangliste einordnet. Der CSV-Import holt deine Fills direkt aus Tradovate, NinjaTrader, TopstepX und anderen, und ein Live-Auszahlungs-Tracker überwacht Schwellen-, Serien-, Zyklusformel- und Zweistufen-Regeln, sodass du genau weißt, wann eine Auszahlung wirklich fällig ist." },
  "Open the Journal": { fr: "Ouvrir le journal", es: "Abrir el diario", ht: "Ouvri Jounal la", ja: "ジャーナルを開く", zh: "打开交易日志", de: "Journal öffnen" },
  "Open full screen ↗": { fr: "Ouvrir en plein écran ↗", es: "Abrir en pantalla completa ↗", ht: "Louvri an plen ekran ↗", ja: "全画面で開く ↗", zh: "全屏打开 ↗", de: "Im Vollbild öffnen ↗" },
  "Live Gamma Levels": { fr: "Niveaux gamma en direct", es: "Niveles gamma en vivo", ht: "Nivo gamma an dirèk", ja: "ライブ・ガンマレベル", zh: "实时Gamma水平", de: "Live-Gamma-Levels" },
  "Free · 2 Minutes · No Signup": { fr: "Gratuit · 2 minutes · Sans inscription", es: "Gratis · 2 minutos · Sin registro", ht: "Gratis · 2 Minit · San Enskripsyon", ja: "無料・2分・登録不要", zh: "免费 · 2分钟 · 无需注册", de: "Kostenlos · 2 Minuten · Keine Anmeldung" },
  "What's Actually Costing You Money?": { fr: "Qu'est-ce qui vous coûte réellement de l'argent ?", es: "¿Qué te está costando dinero realmente?", ht: "Kisa k ap koute w lajan vrèman?", ja: "実際にあなたのお金を失わせているのは何か？", zh: "究竟是什么在让你亏钱？", de: "Was kostet dich wirklich Geld?" },
  "Most losing trades aren't a bad setup - they're a moved stop, a revenge entry, or a plan you skipped under pressure. Answer honestly and get a scored breakdown of exactly where your discipline is leaking, built on the MMM method's own standards.": { fr: "La plupart des trades perdants ne sont pas une mauvaise configuration - c'est un stop déplacé, une entrée de revanche, ou un plan que vous avez ignoré sous la pression. Répondez honnêtement et obtenez une analyse chiffrée de l'endroit exact où votre discipline fuit, basée sur les standards de la méthode MMM elle-même.", es: "La mayoría de las operaciones perdedoras no son por una mala configuración - son un stop movido, una entrada de venganza, o un plan que te saltaste bajo presión. Responde con honestidad y obtén un desglose puntuado de exactamente dónde se está filtrando tu disciplina, basado en los propios estándares del método MMM.", ht: "Pifò tranzaksyon ki pèdi se pa paske yo gen yon move setup - se yon estòp yo deplase, yon antre vanjans, oswa yon plan ou te sote anba presyon. Reponn onètman epi jwenn yon analiz nòte sou egzakteman kote disiplin ou ap fuit, ki baze sou pwòp estanda metòd MMM la.", ja: "損失トレードのほとんどは悪いセットアップが原因ではありません - それはストップを動かしたこと、リベンジエントリー、またはプレッシャーの中でスキップしたプランが原因です。正直に答えて、MMMメソッド独自の基準に基づいた、あなたの規律がどこで漏れているかを正確に示すスコア付きの分析結果を受け取りましょう。", zh: "大多数亏损交易并非因为设置不佳——而是因为移动止损、报复性进场，或是在压力下跳过了计划。诚实作答，即可获得基于MMM方法自身标准、精确指出你的纪律究竟在哪里出现漏洞的评分分析。", de: "Die meisten Verlusttrades sind kein schlechtes Setup - es ist ein verschobener Stop, ein Revanche-Einstieg oder ein Plan, den du unter Druck übersprungen hast. Antworte ehrlich und erhalte eine bewertete Aufschlüsselung, wo genau deine Disziplin leckt - basierend auf den eigenen Standards der MMM-Methode." },
  "Take the Trading Discipline Test": { fr: "Passer le test de discipline de trading", es: "Hacer la prueba de disciplina de trading", ht: "Fè Tès Disiplin Tranzaksyon an", ja: "トレーディング規律テストを受ける", zh: "参加交易纪律测试", de: "Trading-Disziplin-Test machen" },
  "Watch Max trade live": { fr: "Regardez Max trader en direct", es: "Mira a Max operar en vivo", ht: "Gade Max ap fè tranzaksyon an dirèk", ja: "マックスのライブトレードを見る", zh: "观看Max实时交易", de: "Sieh Max live traden" },
  "Live ES/NQ analysis and real-time calls, every session.": { fr: "Analyse ES/NQ en direct et appels en temps réel, à chaque session.", es: "Análisis de ES/NQ en vivo y llamadas en tiempo real, en cada sesión.", ht: "Analiz ES/NQ an dirèk ak apèl an tan reyèl, chak sesyon.", ja: "すべてのセッションでES/NQのライブ分析とリアルタイムコールを配信。", zh: "每场直播都提供ES/NQ实时分析和实时交易提示。", de: "Live-ES/NQ-Analyse und Echtzeit-Calls, in jeder Session." },
  "Course": { fr: "Cours", es: "Curso", ht: "Kou", ja: "コース", zh: "课程", de: "Kurs" },
  "Trading Test": { fr: "Test de trading", es: "Prueba de trading", ht: "Tès Tranzaksyon", ja: "トレーディングテスト", zh: "交易测试", de: "Trading-Test" },
  "Backtests": { fr: "Backtests", es: "Backtests", ht: "Backtests", ja: "バックテスト", zh: "回测", de: "Backtests" },
  "Gamma": { fr: "Gamma", es: "Gamma", ht: "Gamma", ja: "ガンマ", zh: "Gamma", de: "Gamma" },
  "News": { fr: "Actualités", es: "Noticias", ht: "Nouvèl", ja: "ニュース", zh: "新闻", de: "News" },
  "Indicators": { fr: "Indicateurs", es: "Indicadores", ht: "Endikatè", ja: "インジケーター", zh: "指标", de: "Indikatoren" },
  "Gamma Levels": { fr: "Niveaux gamma", es: "Niveles gamma", ht: "Nivo Gamma", ja: "ガンマレベル", zh: "Gamma 水平", de: "Gamma-Level" },
  "Free · Updated Daily": { fr: "Gratuit · Mis à jour chaque jour", es: "Gratis · Actualizado a diario", ht: "Gratis · Mizajou Chak Jou", ja: "無料・毎日更新", zh: "免费 · 每日更新", de: "Kostenlos · Täglich aktualisiert" },
  "Gamma Levels for ES and NQ": { fr: "Niveaux gamma pour ES et NQ", es: "Niveles gamma para ES y NQ", ht: "Nivo Gamma pou ES ak NQ", ja: "ESとNQのガンマレベル", zh: "ES 和 NQ 的 Gamma 水平", de: "Gamma-Level für ES und NQ" },
  "Daily gamma walls and flip levels for E-mini S&P 500 and Nasdaq-100 futures - call walls, put walls, zero-gamma and GEX flip - ready to copy into the MMM TradingView gamma indicator.": { fr: "Murs gamma et niveaux de bascule quotidiens pour les futures E-mini S&P 500 et Nasdaq-100 - murs call, murs put, zéro-gamma et bascule GEX - prêts à copier dans l'indicateur gamma MMM de TradingView.", es: "Muros gamma y niveles de cambio diarios para los futuros E-mini S&P 500 y Nasdaq-100 - muros call, muros put, gamma cero y flip GEX - listos para copiar en el indicador gamma MMM de TradingView.", ht: "Mi gamma ak nivo chanjman chak jou pou fiti E-mini S&P 500 ak Nasdaq-100 - mi call, mi put, zewo-gamma ak flip GEX - pare pou kopye nan endikatè gamma MMM sou TradingView.", ja: "E-mini S&P 500とNasdaq-100先物の毎日のガンマウォールとフリップレベル - コールウォール、プットウォール、ゼロガンマ、GEXフリップ - MMM TradingViewガンマインジケーターにそのままコピーできます。", zh: "E-mini 标普500 和纳斯达克100期货的每日 Gamma 墙与翻转水平——看涨墙、看跌墙、零 Gamma 和 GEX 翻转——可直接复制到 MMM TradingView Gamma 指标中。", de: "Tägliche Gamma-Walls und Flip-Level für E-mini S&P 500 und Nasdaq-100 Futures - Call-Walls, Put-Walls, Zero-Gamma und GEX-Flip - bereit zum Kopieren in den MMM-TradingView-Gamma-Indikator." },
  "Open Gamma Levels": { fr: "Ouvrir les niveaux gamma", es: "Abrir niveles gamma", ht: "Ouvri Nivo Gamma", ja: "ガンマレベルを開く", zh: "打开 Gamma 水平", de: "Gamma-Level öffnen" },
  "Educational levels only, not financial advice. Levels are modelled from open interest and can differ from other providers.": { fr: "Niveaux éducatifs uniquement, pas un conseil financier. Les niveaux sont modélisés à partir de l'open interest et peuvent différer d'autres fournisseurs.", es: "Niveles solo educativos, no es asesoramiento financiero. Los niveles se modelan a partir del interés abierto y pueden diferir de otros proveedores.", ht: "Nivo edikasyonèl sèlman, se pa konsèy finansye. Nivo yo modèlize ak open interest epi yo ka diferan de lòt founisè.", ja: "教育目的のレベルのみで、投資助言ではありません。レベルは建玉から算出したモデルであり、他のプロバイダーと異なる場合があります。", zh: "水平仅供教育用途，不构成财务建议。水平基于未平仓量建模得出，可能与其他提供商不同。", de: "Nur Bildungs-Level, keine Finanzberatung. Die Level werden aus dem Open Interest modelliert und können von anderen Anbietern abweichen." },
  "Markets": { fr: "Marchés", es: "Mercados", ht: "Mache", ja: "市場", zh: "市场", de: "Märkte" },
  "Levels": { fr: "Niveaux", es: "Niveles", ht: "Nivo", ja: "レベル", zh: "水平", de: "Level" },
  "Walls, zero-gamma, flip": { fr: "Murs, zéro-gamma, bascule", es: "Muros, gamma cero, flip", ht: "Mi, zewo-gamma, flip", ja: "ウォール、ゼロガンマ、フリップ", zh: "墙、零 Gamma、翻转", de: "Walls, Zero-Gamma, Flip" },
  "Free for everyone": { fr: "Gratuit pour tous", es: "Gratis para todos", ht: "Gratis pou tout moun", ja: "誰でも無料", zh: "人人免费", de: "Kostenlos für alle" },
  "Max Maserati Model - Highest Entry Precision. Minimal Drawdown. Absolute Risk Control.": { fr: "Modèle Max Maserati - Précision d'entrée maximale. Drawdown minimal. Contrôle absolu du risque.", es: "Modelo Max Maserati - Máxima precisión de entrada. Drawdown mínimo. Control absoluto del riesgo.", ht: "Modèl Max Maserati - Pi Gwo Presizyon Antre. Drawdown Minimal. Kontwòl Risk Absoli.", ja: "マックス・マセラティ・モデル - 最高のエントリー精度。最小限のドローダウン。絶対的なリスク管理。", zh: "Max Maserati 模型 - 极致入场精准度。最小回撤。绝对风险控制。", de: "Max-Maserati-Modell - Höchste Einstiegspräzision. Minimaler Drawdown. Absolute Risikokontrolle." },
};


/* ───────── MMM i18n engine v2 ─────────
 * Translates the WHOLE page, including content that apps draw later (tabs, tables, charts).
 *  1. "Units" = the smallest elements that hold text and only inline tags (p, li, td, h2, button…).
 *     A unit is translated as one piece (its innerHTML), so <b>, <a>, <span> stay in place.
 *  2. Numbers are placeholders: "Max 2 open" and "Max 1 open" share the key "Max {0} open".
 *  3. Loose text nodes and title / aria-label / placeholder / alt are translated too.
 *  4. Dictionaries load only when a language other than English is picked:
 *     /i18n/<lang>/common.json (menu, footer, account box) + /i18n/<lang>/<page>.json.
 *  5. A MutationObserver translates anything the page adds or changes later.
 *  Mark anything that must stay as it is with translate="no" (or class "notranslate").
 *  The old flat MMM_TRANSLATIONS list (above) still works as a fallback.
 */
var MMM_DICT = {};          // lang -> { key: translation }
var MMM_DICT_LOADED = {};   // lang -> Promise
var __mmmLang = 'en';
var __mmmBusy = false;
var __mmmObs = null;
var MMM_INLINE = { A:1, ABBR:1, B:1, BDI:1, BDO:1, BR:1, CITE:1, DATA:1, DFN:1, EM:1, I:1, KBD:1, MARK:1, Q:1, S:1, SAMP:1, SMALL:1, SPAN:1, STRONG:1, SUB:1, SUP:1, TIME:1, U:1, VAR:1, WBR:1, IMG:1, tspan:1 };
var MMM_SKIP = { SCRIPT:1, STYLE:1, NOSCRIPT:1, TEXTAREA:1, INPUT:1, CODE:1, PRE:1, TEMPLATE:1, IFRAME:1, CANVAS:1, VIDEO:1, AUDIO:1 };
var MMM_ATTRS = ['title', 'aria-label', 'placeholder', 'alt'];
var MMM_HAS_WORD = /[A-Za-zÀ-ÿ]{2}/;

function mmmGetLang() {
  try { return localStorage.getItem('mmm-language') || 'en'; } catch (e) { return 'en'; }
}
function mmmPageKey() {
  var m = document.querySelector('meta[name="mmm-page"]');
  if (m && m.content) return m.content;
  var p = location.pathname.replace(/index\.html$/, '').replace(/^\/+|\/+$/g, '');
  return p ? p.split('/')[0].replace(/\.html$/, '') : 'home';
}
// Key = text with collapsed spaces, numbers outside tags replaced by {0}, {1}…
function mmmKey(s) {
  var nums = [];
  var norm = String(s).replace(/\s+/g, ' ').trim();
  var key = norm.split(/(<[^>]*>)/).map(function (part) {
    if (part.charAt(0) === '<') return part;
    return part.replace(/\d+(?:[.,]\d+)*/g, function (m) { nums.push(m); return '{' + (nums.length - 1) + '}'; });
  }).join('');
  return { key: key, nums: nums };
}
function mmmFill(tr, nums) {
  return tr.replace(/\{(\d+)\}/g, function (m, i) { return nums[+i] !== undefined ? nums[+i] : m; });
}
function mmmLookup(raw, lang) {
  if (lang === 'en') return null;
  var k = mmmKey(raw), d = MMM_DICT[lang];
  if (d && d[k.key] !== undefined) return mmmFill(d[k.key], k.nums);
  var legacy = typeof MMM_TRANSLATIONS !== 'undefined' ? MMM_TRANSLATIONS[String(raw).trim()] : null;
  if (legacy && legacy[lang]) return legacy[lang];
  return null;
}
function mmmSkipEl(el) {
  if (!el || el.nodeType !== 1) return true;
  if (MMM_SKIP[el.tagName]) return true;
  if (el.isContentEditable) return true;
  return !!(el.closest && el.closest('[translate="no"],.notranslate'));
}
// a unit: has words, and every child is text or an inline element made of inline elements
function mmmIsUnit(el) {
  if (!el.firstChild) return false;
  var words = false;
  function ok(node) {
    for (var c = node.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 3) { if (MMM_HAS_WORD.test(c.nodeValue)) words = true; continue; }
      if (c.nodeType !== 1) continue;
      if (!MMM_INLINE[c.tagName] && !MMM_INLINE[c.localName]) return false;
      if (c.getAttribute && (c.getAttribute('translate') === 'no' || (c.classList && c.classList.contains('notranslate')))) return false;
      if (!ok(c)) return false;
    }
    return true;
  }
  if (!ok(el) || !words) return false;
  // a box of links / labels with no words of its own (a menu, a row of spans) is not one sentence:
  // translate each child on its own, so the key does not change with the active link
  var own = false, kids = 0;
  for (var d = el.firstChild; d; d = d.nextSibling) {
    if (d.nodeType === 3 && MMM_HAS_WORD.test(d.nodeValue)) own = true;
    else if (d.nodeType === 1 && d.tagName !== 'BR') kids++;
  }
  return own || kids <= 1;
}
function mmmDoUnit(el, lang) {
  // an <option> with no value uses its text as the value: pin it so translating keeps the app working
  if (el.tagName === 'OPTION' && !el.hasAttribute('value')) el.setAttribute('value', el.textContent);
  if (el.__mmmSrc === undefined) el.__mmmSrc = el.innerHTML;
  var src = el.__mmmSrc;
  var tr = mmmLookup(src, lang);
  // keep the spaces around the text (e.g. "<span> Trading</span>")
  var next = tr === null ? src : (src.match(/^\s*/)[0] + tr + src.match(/\s*$/)[0]);
  if (el.innerHTML !== next) el.innerHTML = next;
  el.__mmmShown = el.innerHTML;
}
var __mmmTextSrc = new WeakMap();
function mmmDoText(node, lang) {
  if (!__mmmTextSrc.has(node)) __mmmTextSrc.set(node, node.nodeValue);
  var src = __mmmTextSrc.get(node);
  var t = src.trim();
  if (!MMM_HAS_WORD.test(t)) return;
  var tr = mmmLookup(t, lang);
  var lead = src.slice(0, src.indexOf(t)), trail = src.slice(src.indexOf(t) + t.length);
  var next = tr === null ? src : lead + tr + trail;
  if (node.nodeValue !== next) node.nodeValue = next;
  node.__mmmShown = node.nodeValue;
}
function mmmDoAttrs(el, lang) {
  for (var i = 0; i < MMM_ATTRS.length; i++) {
    var a = MMM_ATTRS[i];
    if (!el.hasAttribute(a)) continue;
    if (!el.__mmmAttr) el.__mmmAttr = {};
    var cur = el.getAttribute(a);
    if (el.__mmmAttr[a] === undefined || (el.__mmmAttrShown && el.__mmmAttrShown[a] !== cur)) el.__mmmAttr[a] = cur;
    var src = el.__mmmAttr[a];
    if (!MMM_HAS_WORD.test(src)) continue;
    var tr = mmmLookup(src, lang);
    var next = tr === null ? src : tr;
    if (cur !== next) el.setAttribute(a, next);
    if (!el.__mmmAttrShown) el.__mmmAttrShown = {};
    el.__mmmAttrShown[a] = next;
  }
}
function mmmIsField(el) {
  return el && el.nodeType === 1 && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && !(el.closest && el.closest('[translate="no"],.notranslate'));
}
function mmmWalk(el, lang) {
  if (mmmIsField(el)) { mmmDoAttrs(el, lang); return; }   // placeholder / title only, never the typed value
  if (mmmSkipEl(el)) return;
  mmmDoAttrs(el, lang);
  // the app changed this unit's content since we last drew it → its English source is new
  if (el.__mmmSrc !== undefined && el.innerHTML !== el.__mmmShown) el.__mmmSrc = undefined;
  if (el.__mmmSrc !== undefined || mmmIsUnit(el)) {
    // keep tooltips of inline children
    var kids = el.querySelectorAll('[title],[aria-label]');
    mmmDoUnit(el, lang);
    kids = el.querySelectorAll('[title],[aria-label]');
    for (var j = 0; j < kids.length; j++) mmmDoAttrs(kids[j], lang);
    return;
  }
  for (var c = el.firstChild; c; c = c.nextSibling) {
    if (c.nodeType === 3) {
      if (__mmmTextSrc.has(c) && c.nodeValue !== c.__mmmShown) __mmmTextSrc.set(c, c.nodeValue);
      mmmDoText(c, lang);
    } else if (c.nodeType === 1) mmmWalk(c, lang);
  }
}
function mmmApplyLang(lang, root) {
  __mmmLang = lang || 'en';
  if (!document.body) return;
  __mmmBusy = true;
  try {
    mmmWalk(root || document.body, __mmmLang);
    if (!root) {
      if (document.__mmmTitle === undefined) document.__mmmTitle = document.title;
      var t = mmmLookup(document.__mmmTitle, __mmmLang);
      document.title = t === null ? document.__mmmTitle : t;
      document.documentElement.lang = __mmmLang;
    }
  } finally {
    if (__mmmObs) __mmmObs.takeRecords();
    __mmmBusy = false;
  }
}
function mmmLoadDict(lang) {
  if (lang === 'en') return Promise.resolve();
  if (MMM_DICT_LOADED[lang]) return MMM_DICT_LOADED[lang];
  MMM_DICT[lang] = MMM_DICT[lang] || {};
  function get(url) {
    return fetch(url, { cache: 'force-cache' }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; })
      .then(function (j) { for (var k in j) MMM_DICT[lang][k] = j[k]; });
  }
  MMM_DICT_LOADED[lang] = Promise.all([get('/i18n/' + lang + '/common.json'), get('/i18n/' + lang + '/' + mmmPageKey() + '.json')]);
  return MMM_DICT_LOADED[lang];
}
function mmmSyncSelects(lang) {
  var sels = document.querySelectorAll('#lang-switch, select.mmm-lang');
  for (var i = 0; i < sels.length; i++) if (sels[i].value !== lang) sels[i].value = lang;
}
function mmmSetLang(lang) {
  try { localStorage.setItem('mmm-language', lang); } catch (e) {}
  __mmmLang = lang;
  mmmSyncSelects(lang);
  mmmLoadDict(lang).then(function () { if (__mmmLang === lang) mmmApplyLang(lang); });
}
function mmmFillSelect(sel) {
  if (!sel || sel.__mmmFilled) return;
  sel.__mmmFilled = true;
  sel.setAttribute('translate', 'no');
  if (!sel.options.length) MMM_LANGS.forEach(function (l) { var o = document.createElement('option'); o.value = l.code; o.textContent = l.label; sel.appendChild(o); });
  sel.value = __mmmLang;
  sel.addEventListener('change', function (e) { mmmSetLang(e.target.value); });
}
(function mmmInit() {
  __mmmLang = mmmGetLang();
  var ls = document.querySelectorAll('#lang-switch, select.mmm-lang');
  for (var z = 0; z < ls.length; z++) ls[z].setAttribute('translate', 'no');
  var sels = document.querySelectorAll('#lang-switch, select.mmm-lang');
  for (var i = 0; i < sels.length; i++) mmmFillSelect(sels[i]);
  // anything added or changed later (tabs, tables, menus) is translated too
  if (window.MutationObserver && document.body) {
    __mmmObs = new MutationObserver(function (recs) {
      if (__mmmBusy) return;
      var roots = [];
      for (var i = 0; i < recs.length; i++) {
        var r = recs[i], el = r.type === 'characterData' ? r.target.parentElement : r.target;
        if (!el || el.nodeType !== 1) continue;
        if (r.type === 'childList') for (var j = 0; j < r.addedNodes.length; j++) {
          var n = r.addedNodes[j];
          if (n.nodeType === 1 && n.matches && n.matches('select.mmm-lang,#lang-switch')) mmmFillSelect(n);
          if (n.nodeType === 1 && n.querySelectorAll) { var ss = n.querySelectorAll('select.mmm-lang,#lang-switch'); for (var q = 0; q < ss.length; q++) mmmFillSelect(ss[q]); }
        }
        // climb to the unit that holds this change, if any
        var u = el, unit = null;
        while (u && u !== document.body) { if (u.__mmmSrc !== undefined) { unit = u; } u = u.parentElement; }
        roots.push(unit || el);
      }
      if (__mmmLang === 'en' && !roots.length) return;
      __mmmBusy = true;
      try {
        for (var k = 0; k < roots.length; k++) if (document.body.contains(roots[k])) mmmWalk(roots[k], __mmmLang);
      } finally { __mmmObs.takeRecords(); __mmmBusy = false; }
    });
    __mmmObs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: MMM_ATTRS });
  }
  if (__mmmLang === 'en') mmmApplyLang('en');
  else mmmLoadDict(__mmmLang).then(function () { mmmApplyLang(__mmmLang); });
})();

/* For the translation build: list every key on the page right now. */
window.mmmI18nCollect = function () {
  var out = {}, COMMON = '#mmm-tb,#mmm-tb-tab,#mmm-auth,header,footer';
  function add(raw, el) {
    var t = String(raw).replace(/\s+/g, ' ').trim();
    if (!MMM_HAS_WORD.test(t.replace(/<[^>]*>/g, ''))) return;
    var k = mmmKey(t).key, common = !!(el && el.closest && el.closest(COMMON));
    if (!out[k]) out[k] = { common: common }; else if (!common) out[k].common = false;
  }
  function walk(el) {
    if (mmmIsField(el)) { for (var f = 0; f < MMM_ATTRS.length; f++) if (el.hasAttribute(MMM_ATTRS[f])) add(el.__mmmAttr && el.__mmmAttr[MMM_ATTRS[f]] !== undefined ? el.__mmmAttr[MMM_ATTRS[f]] : el.getAttribute(MMM_ATTRS[f]), el); return; }
    if (mmmSkipEl(el)) return;
    for (var i = 0; i < MMM_ATTRS.length; i++) if (el.hasAttribute(MMM_ATTRS[i])) add(el.__mmmAttr && el.__mmmAttr[MMM_ATTRS[i]] !== undefined ? el.__mmmAttr[MMM_ATTRS[i]] : el.getAttribute(MMM_ATTRS[i]), el);
    if (el.__mmmSrc !== undefined || mmmIsUnit(el)) {
      add(el.__mmmSrc !== undefined ? el.__mmmSrc : el.innerHTML, el);
      var kids = el.querySelectorAll('[title],[aria-label]');
      for (var j = 0; j < kids.length; j++) for (var a = 0; a < 2; a++) if (kids[j].hasAttribute(MMM_ATTRS[a])) add(kids[j].getAttribute(MMM_ATTRS[a]), el);
      return;
    }
    for (var c = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 3) add(__mmmTextSrc.has(c) ? __mmmTextSrc.get(c) : c.nodeValue, el);
      else if (c.nodeType === 1) walk(c);
    }
  }
  walk(document.body);
  add(document.__mmmTitle !== undefined ? document.__mmmTitle : document.title, null);
  return out;
};
