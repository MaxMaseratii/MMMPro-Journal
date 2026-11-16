// The fixed list of mailboxes the hub connects to.
// Gmail / Google Workspace accounts use an app password stored in an env variable.
// The Hotmail account uses Microsoft OAuth (see ms.js).

export const ACCOUNTS = [
  { id: 'dr', email: 'dr.etienne.bm@gmail.com', kind: 'gmail', secret: 'PW_DR' },
  { id: 'infotrade', email: 'infotrade@maxmaserati.com', kind: 'gmail', secret: 'PW_INFOTRADE' },
  { id: 'bmb', email: 'bmbillionsinvestments@gmail.com', kind: 'gmail', secret: 'PW_BMB' },
  { id: 'misterbme', email: 'misterbme02@gmail.com', kind: 'gmail', secret: 'PW_MISTERBME' },
  { id: 'hotmail', email: 'misterbme02@hotmail.com', kind: 'outlook' },
];

export const SERVERS = {
  gmail: {
    imap: { host: 'imap.gmail.com', port: 993, secure: true },
    smtp: { host: 'smtp.gmail.com', port: 465, secure: true },
  },
  outlook: {
    imap: { host: 'outlook.office365.com', port: 993, secure: true },
    smtp: { host: 'smtp-mail.outlook.com', port: 587, secure: false, requireTLS: true },
  },
};

export const SIGNATURES = {
  general: ['Bachelin Max Etienne, MD, MHS', 'Community and Global Health, The University of Tokyo'],
  itl: [
    'Bachelin Max Etienne, MD, MHS',
    'English–Haitian Creole Translator | Medical & Legal',
    'Community and Global Health, The University of Tokyo',
  ],
  none: [],
};

export function getAccount(id) {
  const acc = ACCOUNTS.find((a) => a.id === id || a.email.toLowerCase() === String(id).toLowerCase());
  if (!acc) throw new Error(`Unknown account "${id}". Use one of: ${ACCOUNTS.map((a) => a.id).join(', ')}`);
  return acc;
}
