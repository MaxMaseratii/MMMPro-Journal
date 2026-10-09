// MMM Trader Profile Assessment - question bank, scoring config, profile content.
// All user-facing strings here are English; translations live in i18n-diagnostic.js (keyed by the English text).
var DX = {};

DX.CATS = [
  { key: 'EC', name: 'Mindset & Emotions' },
  { key: 'RR', name: 'Revenge Trading' },
  { key: 'RM', name: 'Risk Management' },
  { key: 'SE', name: 'Stop-Loss Discipline' },
  { key: 'PP', name: 'Planning & Process' },
  { key: 'EX', name: 'Execution & Discipline' },
  { key: 'EG', name: 'Ego & Overconfidence' },
  { key: 'RL', name: 'Readiness & Lifestyle' },
  { key: 'AC', name: 'Accountability & Review' }
];

DX.SCALE = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];

// ---- Part 1: trader profile (context only, not scored) ----
DX.PROFILE = [
  { id: 'exp', text: 'How long have you been trading live markets?', opts: ['Less than 6 months', '6 months to 2 years', '2 to 5 years', 'More than 5 years'] },
  { id: 'acct', text: 'What do you mainly trade with?', opts: ['A prop firm challenge or funded account', 'My own live account', 'A demo or simulated account', 'A mix of these'] },
  { id: 'mkt', text: 'Which market do you trade most?', opts: ['Futures (indices, commodities)', 'Forex', 'Stocks or options', 'Crypto'] },
  { id: 'freq', text: 'How many trades do you usually take on an active day?', opts: ['1 to 2', '3 to 5', '6 to 10', 'More than 10'] },
  { id: 'res', text: 'Be honest: how would you describe your results over the last 3 months?', opts: ['Consistently profitable', 'Around break-even', 'Slowly losing', 'Losing big or blowing accounts'] },
  { id: 'goal', text: 'What is your main goal right now?', opts: ['Pass and keep a prop firm account', 'Build steady income from trading', 'Grow my personal account', 'Learn and become consistent'] },
  { id: 'self', text: 'In your own view, what is your single biggest problem as a trader?', opts: [
    'Controlling fear, greed and FOMO',
    'Trading to win my losses back',
    'Position size and risk',
    'Moving or ignoring my stops',
    'Having and following a plan',
    'Taking only my real setups',
    'Overconfidence after wins',
    'Being tired, stressed or distracted',
    'Learning from my mistakes'
  ], cats: ['EC', 'RR', 'RM', 'SE', 'PP', 'EX', 'EG', 'RL', 'AC'] }
];

// ---- Part 2: behavior items (frequency scale). pos:true = "Always" is the healthy answer. ----
DX.ITEMS = [
  // Mindset & Emotions
  { id: 'ec1', cat: 'EC', pos: false, text: 'I take trades because I am afraid of missing a move.' },
  { id: 'ec2', cat: 'EC', pos: false, text: 'A few losses leave me anxious, angry or frustrated enough to affect my next decision.' },
  { id: 'ec3', cat: 'EC', pos: false, text: 'Watching my live P&L changes when I exit, before my plan says to.' },
  { id: 'ec4', cat: 'EC', pos: true, text: 'I can sit through a normal pullback in a trade without touching it.' },
  { id: 'ec5', cat: 'EC', pos: false, text: 'After missing a big move, I chase price to get in late.' },
  // Revenge Trading
  { id: 'rr1', cat: 'RR', pos: false, text: 'After a loss I feel an urge to trade again immediately to win it back.' },
  { id: 'rr2', cat: 'RR', pos: false, text: 'I increase my position size after a losing trade.' },
  { id: 'rr3', cat: 'RR', pos: false, text: 'I re-enter the same instrument within minutes of a stop-out without a new setup.' },
  { id: 'rr4', cat: 'RR', pos: true, text: 'After a stop-out I step away or pause before I consider another trade.' },
  { id: 'rr5', cat: 'RR', pos: false, text: 'I trade more often on days when I am down.' },
  // Risk Management
  { id: 'rm1', cat: 'RM', pos: true, text: 'I size every position from my stop distance and know my exact dollar risk before I enter.' },
  { id: 'rm2', cat: 'RM', pos: true, text: 'I have a daily maximum loss and I stop trading when it is hit.' },
  { id: 'rm3', cat: 'RM', pos: false, text: 'I risk more than my plan allows when I feel very sure about a trade.' },
  { id: 'rm4', cat: 'RM', pos: false, text: 'A single trade has cost me far more than my normal planned loss.' },
  { id: 'rm5', cat: 'RM', pos: true, text: 'I only take trades where the potential reward is at least as big as the risk.' },
  // Stop-Loss Discipline
  { id: 'se1', cat: 'SE', pos: true, text: 'I place my stop-loss at the moment I enter, on every trade.' },
  { id: 'se2', cat: 'SE', pos: false, text: 'I move my stop further away after a trade is already open.' },
  { id: 'se3', cat: 'SE', pos: false, text: 'I remove my stop-loss completely in the middle of a trade.' },
  { id: 'se4', cat: 'SE', pos: false, text: 'I close winners early out of fear of giving profit back, even when my plan says to hold.' },
  { id: 'se5', cat: 'SE', pos: false, text: 'I hold losing trades longer than planned, hoping they come back.' },
  // Planning & Process
  { id: 'pp1', cat: 'PP', pos: true, text: 'I write a daily plan (risk, target, allowed setups) before the session starts.' },
  { id: 'pp2', cat: 'PP', pos: true, text: 'I run a checklist before I enter a trade.' },
  { id: 'pp3', cat: 'PP', pos: true, text: 'I log every trade, and I log the days I did not trade.' },
  { id: 'pp4', cat: 'PP', pos: false, text: 'I change my strategy after a few losing trades in a row.' },
  { id: 'pp5', cat: 'PP', pos: false, text: 'I make up the rules as the session goes.' },
  // Execution & Discipline
  { id: 'ex1', cat: 'EX', pos: true, text: 'I only take setups that match my written criteria.' },
  { id: 'ex2', cat: 'EX', pos: false, text: 'I take more trades in a day than my plan allows.' },
  { id: 'ex3', cat: 'EX', pos: false, text: 'I trade at times or in conditions my plan says to avoid.' },
  { id: 'ex4', cat: 'EX', pos: true, text: 'I wait patiently for A+ setups, even when the market is slow.' },
  { id: 'ex5', cat: 'EX', pos: false, text: 'I enter before my confirmation appears because I do not want to wait.' },
  // Ego & Overconfidence
  { id: 'eg1', cat: 'EG', pos: false, text: 'After a big win or a winning streak I increase my risk or loosen my rules.' },
  { id: 'eg2', cat: 'EG', pos: false, text: 'I find it hard to admit a trade was wrong and exit it.' },
  { id: 'eg3', cat: 'EG', pos: false, text: 'I believe I read the market well enough to override my own system.' },
  { id: 'eg4', cat: 'EG', pos: true, text: 'I treat each trade as one of many, not as a verdict on my skill.' },
  { id: 'eg5', cat: 'EG', pos: false, text: 'After a good day I keep trading past my plan because I feel in the zone.' },
  // Readiness & Lifestyle
  { id: 'rl1', cat: 'RL', pos: false, text: 'I trade when I am tired or after poor sleep.' },
  { id: 'rl2', cat: 'RL', pos: false, text: 'I trade while distracted or stressed by something outside the market.' },
  { id: 'rl3', cat: 'RL', pos: true, text: 'I follow a consistent pre-market routine before I trade.' },
  { id: 'rl4', cat: 'RL', pos: false, text: 'I trade because I am bored or want action, not because there is a setup.' },
  { id: 'rl5', cat: 'RL', pos: false, text: 'I feel I need to make money today (bills, passing a challenge) and it affects my trades.' },
  // Accountability & Review
  { id: 'ac1', cat: 'AC', pos: true, text: 'I review my trades and journal at least once a week.' },
  { id: 'ac2', cat: 'AC', pos: false, text: 'I blame the market, the broker or bad luck for most of my losses.' },
  { id: 'ac3', cat: 'AC', pos: false, text: 'I repeat mistakes that I already know I make.' },
  { id: 'ac4', cat: 'AC', pos: true, text: 'I can name my top three recurring mistakes right now.' },
  { id: 'ac5', cat: 'AC', pos: true, text: 'After each review I set one specific improvement goal.' }
];

// ---- Part 3: scenarios (g = quality of the choice, 0 worst to 4 best) ----
DX.SCENARIOS = [
  { id: 's1', cat: 'EC', text: 'Price rips higher without you. Your setup never appeared and you are watching a move you would have loved to catch. What do you do?', opts: [
    { t: 'Jump in now with a tight stop so I do not miss the rest of it', g: 0 },
    { t: 'Let it go and wait for a pullback that matches my criteria, or skip it', g: 4 },
    { t: 'Take a half-size position just to be in the move', g: 1 },
    { t: 'Switch to another market that is moving and trade that instead', g: 2 } ] },
  { id: 's2', cat: 'RR', text: 'You have taken two stop-losses in a row and are down 1.5R on the day, with a 3R daily limit. A decent-looking setup appears ten minutes later. What do you do?', opts: [
    { t: 'Step away for a cooling-off period, then trade only if it passes my full checklist at normal size', g: 4 },
    { t: 'Take it at normal size straight away, since it looks valid', g: 2 },
    { t: 'Take it and use a wider stop to give it room', g: 1 },
    { t: 'Take it at a bigger size to get back to even faster', g: 0 } ] },
  { id: 's3', cat: 'RM', text: 'Your A+ setup finally appears and you feel certain it will work. Your plan says to risk $200 on this trade. What do you do?', opts: [
    { t: 'Risk $400, because conviction like this deserves more size', g: 0 },
    { t: 'Risk $300 as a compromise', g: 1 },
    { t: 'Risk $200 as planned, with the stop exactly where the plan says', g: 4 },
    { t: 'Risk $200 but skip the stop so I do not get shaken out', g: 1 } ] },
  { id: 's4', cat: 'SE', text: 'Your trade is at -0.8R and moving toward your stop at -1R. There is a support level just below your stop. What do you do?', opts: [
    { t: 'Move the stop wider to give the trade room to work', g: 1 },
    { t: 'Add to the position to improve my average price', g: 0 },
    { t: 'Close it by hand now to avoid the full loss', g: 2 },
    { t: 'Let the stop do its job and accept the loss if it is hit', g: 4 } ] },
  { id: 's5', cat: 'PP', text: 'It is 15 minutes before the open and you have not written your plan. A friend messages you a hot stock tip. What do you do?', opts: [
    { t: 'Take the tip at the open, it sounds like a great trade', g: 0 },
    { t: 'Finish my plan first, and only trade the tip if it fits my written criteria', g: 4 },
    { t: 'Skip the plan today and just trade what looks good', g: 1 },
    { t: 'Write a quick plan that includes the tip as a setup', g: 2 } ] },
  { id: 's6', cat: 'EX', text: 'Two hours into the session nothing has met your entry criteria. The market is slow and you feel restless. What do you do?', opts: [
    { t: 'Loosen my criteria a little so I can get a trade on', g: 0 },
    { t: 'Take a small trade just to stay engaged', g: 1 },
    { t: 'Keep waiting. No trade is a valid outcome', g: 4 },
    { t: 'Try a different strategy I have not tested yet', g: 1 } ] },
  { id: 's7', cat: 'EG', text: 'You have won five trades in a row and are up 3R by 10am. Your daily target was 2R. What do you do?', opts: [
    { t: 'Stop for the day, log it and review', g: 4 },
    { t: 'Keep trading at the same size, the market is going my way', g: 1 },
    { t: 'Increase size, because I am clearly in sync with the market', g: 0 },
    { t: 'Keep going, but only with A+ setups at reduced size', g: 3 } ] },
  { id: 's8', cat: 'RL', text: 'You slept four hours, you are stressed about a bill due this week, and the market is active. What do you do?', opts: [
    { t: 'Trade normally, I will be fine once I get going', g: 1 },
    { t: 'Trade normally and make up for lost time with extra trades', g: 0 },
    { t: 'Trade at reduced size, but take every setup I see', g: 2 },
    { t: 'Sit out, or trade minimum size on A+ setups only', g: 4 } ] },
  { id: 's9', cat: 'AC', text: 'You lost money today by breaking your own rules. What happens at the end of the day?', opts: [
    { t: 'I close the platform and try to forget about it', g: 1 },
    { t: 'I put it down to bad market conditions, it was a tough day', g: 0 },
    { t: 'I log it, name the exact rule I broke and what triggered it, and write one fix for tomorrow', g: 4 },
    { t: 'I log the P&L number and move on', g: 2 } ] }
];

// Pairs of items that should agree. If they do not, the trader's self-report contradicts itself.
DX.PAIRS = [
  ['se1', 'se2'], ['se1', 'se3'], ['pp1', 'pp5'], ['rm1', 'rm3'], ['rm2', 'rr5'], ['rr4', 'rr1'],
  ['ec4', 'ec3'], ['ac1', 'ac3'], ['ex1', 'ex5'], ['eg1', 's7'], ['s1', 'ec5'], ['s2', 'rr2'],
  ['s3', 'rm3'], ['s4', 'se2'], ['s6', 'ex2'], ['s7', 'eg5'], ['s9', 'ac5'], ['s8', 'rl1']
];

DX.ARCHETYPES = {
  EC: { label: 'The Emotional Executor', note: "Your plan is probably fine - it's being overridden live, in the moment, by what the chart is doing to your nerves." },
  RR: { label: 'The Revenge Trader', note: "Losses are triggering trades, not patience. The 30-minute rule (close the app after any loss) is built for exactly this." },
  RM: { label: 'The Risk Gambler', note: "Risk size moves with confidence and mood, not with a plan. One oversized trade can erase weeks of good discipline." },
  SE: { label: 'The Stop Mover', note: "Your stops aren't the problem - what happens to them after entry is. This is usually the single fastest fix available to you." },
  PP: { label: 'The Improviser', note: "Decisions are being made live, under pressure, instead of in advance. A written plan and a journal turn guesses into a process." },
  EX: { label: 'The Rule Bender', note: "The plan exists - it's just not always the thing actually being executed, especially under pressure." },
  EG: { label: 'The Overconfident Operator', note: "Wins loosen your rules and losses are hard to accept. Ego is quietly sizing your trades." },
  RL: { label: 'The Depleted Trader', note: "Your condition (sleep, stress, money pressure) is the hidden driver of your mistakes. Fix the state and the behavior follows." },
  AC: { label: 'The Blind-Spot Trader', note: "You repeat mistakes you cannot clearly name. Without honest review, the same leaks keep reopening." },
  disciplined: { label: 'The Disciplined Operator', note: "Your rules hold under pressure and your answers agree with each other. Protect the routine and scale only when the numbers say so." },
  inconsistent: { label: 'The Inconsistent Trader', note: "What you say you do and what you actually do don't match. Your first job is honest data: journal every trade and let the record, not memory, tell you where you leak." }
};

DX.FIXES = {
  EC: { title: 'Build an emotional circuit-breaker', steps: [
    'Rate your emotion from 1 to 10 before every entry. If it is above 6, you do not trade.',
    'Hide live P&L and track trades in R-multiples, so price ticks stop driving your exits.',
    'The moment you feel fear or FOMO, write down the trigger before you touch the order.' ] },
  RR: { title: 'Install a hard cool-down after every loss', steps: [
    'After any stop-out, step away for 30 minutes. Close the platform, no exceptions.',
    'Never change size after a loss. Size is set by the plan, not by the last trade.',
    'Two losses in a row, or your daily limit, means the session is over.' ] },
  RM: { title: 'Make risk a fixed number, not a feeling', steps: [
    'Set a fixed dollar risk per trade and write it in your plan before the open.',
    'Set a daily maximum loss and stop at it. It ends the session, it is not a suggestion.',
    'Size every position from the stop distance, so risk is identical on every trade.' ] },
  SE: { title: 'Make the stop non-negotiable', steps: [
    'Enter the stop together with the order. If you cannot place it, you cannot enter.',
    'A stop may move in one direction only: toward profit, never away from it.',
    'Review every trade where you moved a stop and calculate exactly what it cost you.' ] },
  PP: { title: 'Turn your process into a written routine', steps: [
    'Write a daily plan before the open: risk, max trades, allowed setups and a stop time.',
    'Use a pre-trade checklist. If one box is unchecked, you pass.',
    'Log every trade and every no-trade day, and only change strategy after 30 or more trades.' ] },
  EX: { title: 'Trade only what your rules define', steps: [
    'Write your exact entry criteria on one page. If you cannot tick every line, it is not a setup.',
    'Cap your trades per day and treat the last allowed trade as final.',
    'Define the hours and conditions you avoid, and block them in your calendar.' ] },
  EG: { title: 'Keep ego out of the equation', steps: [
    'Risk and rules never change after a win. Same risk on every trade, win or lose.',
    'When the daily target is hit, stop, log it and leave the screen.',
    'Judge yourself on rule-following, not on P&L. Score every trade for execution.' ] },
  RL: { title: 'Protect the state you trade in', steps: [
    'Do not trade after poor sleep or high stress. Sit out, or trade minimum size.',
    'Build a 10-minute pre-market routine: review the plan, breathe, check your readiness.',
    'Keep trading money separate from bills, and never trade to cover a deadline.' ] },
  AC: { title: 'Close the loop with a weekly review', steps: [
    'Review your journal every week and name your top three recurring mistakes.',
    'For each mistake, write the trigger and one specific rule that prevents it.',
    'Pick one improvement goal per week, and retake this test in 30 days to measure it.' ] }
};

DX.LEVELS = ['Critical', 'Weak', 'Developing', 'Strong'];
DX.RISK = ['Critical', 'High', 'Moderate', 'Low'];
