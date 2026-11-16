// MCP tools that Claude sees when the hub is added as a custom connector.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ACCOUNTS } from './accounts.js';
import * as mail from './mail.js';

const ids = ACCOUNTS.map((a) => `${a.id} = ${a.email}`).join('; ');
const accountArg = z.string().describe(`Account id or address. Accounts: ${ids}`);
const folderArg = z
  .string()
  .optional()
  .describe('Folder path from a search result, or a shortcut: inbox, all, sent, trash, spam, archive. Default: inbox (all mail for Gmail searches).');
const uidsArg = z.array(z.number().int().positive()).min(1).max(500).describe('IMAP uids from search_emails results (same account and folder).');

function ok(data) {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 1) }] };
}

function wrap(fn) {
  return async (args) => {
    try {
      return ok(await fn(args));
    } catch (e) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${mail.cleanError(e)}` }] };
    }
  };
}

export function buildServer() {
  const server = new McpServer({ name: 'max-mail-hub', version: '1.0.0' });
  const ro = { readOnlyHint: true, openWorldHint: true };
  const change = { readOnlyHint: false, destructiveHint: false, openWorldHint: true };
  const danger = { readOnlyHint: false, destructiveHint: true, openWorldHint: true };

  server.registerTool(
    'list_accounts',
    {
      title: 'List email accounts',
      description: 'Shows every connected mailbox, whether it works, and its Inbox unread count.',
      inputSchema: {},
      annotations: ro,
    },
    wrap(() => mail.listAccounts()),
  );

  server.registerTool(
    'list_folders',
    {
      title: 'List folders',
      description: 'Lists the folders (and Gmail labels) of one mailbox.',
      inputSchema: { account: accountArg },
      annotations: ro,
    },
    wrap(({ account }) => mail.listFolders(account)),
  );

  server.registerTool(
    'search_emails',
    {
      title: 'Search emails',
      description:
        'Searches one mailbox or all of them (account "all"), newest first. For Gmail accounts, "query" uses normal Gmail search syntax ' +
        '(e.g. "from:itl is:unread newer_than:7d", "in:inbox category:promotions", "in:sent"). For Hotmail, "query" matches subject or body text. ' +
        'Each result has account, folder and uid, which the other tools need.',
      inputSchema: {
        account: z.string().optional().describe(`"all" (default) or one account. Accounts: ${ids}`),
        query: z.string().optional().describe('Search text. Gmail search syntax for Gmail accounts.'),
        folder: folderArg,
        unread_only: z.boolean().optional(),
        from: z.string().optional().describe('Sender address or name'),
        since: z.string().optional().describe('Only mail on or after this date, YYYY-MM-DD'),
        limit: z.number().int().min(1).max(50).optional().describe('Max results per account (default 20, max 50)'),
      },
      annotations: ro,
    },
    wrap((args) => mail.searchEmails(args)),
  );

  server.registerTool(
    'read_email',
    {
      title: 'Read an email',
      description: 'Reads one email: headers, plain-text body, attachment list and unsubscribe headers. Does not mark it as read.',
      inputSchema: { account: accountArg, folder: folderArg, uid: z.number().int().positive() },
      annotations: ro,
    },
    wrap((args) => mail.readEmail(args)),
  );

  server.registerTool(
    'mark_read',
    {
      title: 'Mark read or unread',
      description: 'Marks emails as read (read=true, default) or unread (read=false).',
      inputSchema: { account: accountArg, folder: folderArg, uids: uidsArg, read: z.boolean().optional() },
      annotations: change,
    },
    wrap((args) => mail.markRead(args)),
  );

  server.registerTool(
    'archive_emails',
    {
      title: 'Archive emails',
      description: 'Takes emails out of the Inbox without deleting them.',
      inputSchema: { account: accountArg, folder: folderArg, uids: uidsArg },
      annotations: change,
    },
    wrap((args) => mail.archiveEmails(args)),
  );

  server.registerTool(
    'trash_emails',
    {
      title: 'Move emails to Trash',
      description: 'Moves emails to Trash (recoverable, Gmail keeps them 30 days). Never deletes for good.',
      inputSchema: { account: accountArg, folder: folderArg, uids: uidsArg },
      annotations: danger,
    },
    wrap((args) => mail.trashEmails(args)),
  );

  server.registerTool(
    'mark_spam',
    {
      title: 'Mark as spam',
      description: 'Moves emails to the Spam / Junk folder.',
      inputSchema: { account: accountArg, folder: folderArg, uids: uidsArg },
      annotations: danger,
    },
    wrap((args) => mail.markSpam(args)),
  );

  server.registerTool(
    'unsubscribe',
    {
      title: 'Unsubscribe from a mailing list',
      description:
        "Uses the email's List-Unsubscribe header: one-click unsubscribe when offered, otherwise sends the unsubscribe email. " +
        'If only a website link exists, returns the link instead of opening it.',
      inputSchema: { account: accountArg, folder: folderArg, uid: z.number().int().positive() },
      annotations: danger,
    },
    wrap((args) => mail.unsubscribe(args)),
  );

  server.registerTool(
    'send_email',
    {
      title: 'Send an email',
      description:
        'Only call this after the user has approved the exact recipients, subject and text in the chat. ' +
        'Sends from the chosen account and adds a signature: "general" (default), "itl" (for ITL / translation work) or "none". ' +
        'To reply in a thread, pass reply_to with the folder and uid of the email being answered (subject then defaults to "Re: ...").',
      inputSchema: {
        account: accountArg,
        to: z.array(z.string()).min(1),
        cc: z.array(z.string()).optional(),
        bcc: z.array(z.string()).optional(),
        subject: z.string().optional().describe('Required unless reply_to is given'),
        body: z.string().describe('Plain text body, without signature'),
        signature: z.enum(['general', 'itl', 'none']).optional(),
        reply_to: z.object({ folder: z.string().optional(), uid: z.number().int().positive() }).optional(),
      },
      annotations: danger,
    },
    wrap((args) => mail.sendEmail(args)),
  );

  return server;
}
