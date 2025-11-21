import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const groqApiKey = process.env.GROQ_API_KEY;
const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL or VITE_SUPABASE_URL Must be defined in .env');
}
if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY ( or VITE_SUPABASE_ANON_KEY) Must be defined in .env');
}
if (!groqApiKey) {
  throw new Error('GROQ_API_KEY Must be defined in .env');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const groq = new Groq({ apiKey: groqApiKey });
function summarizeRows(rows, maxFields = 6) {
  if (!rows || rows.length === 0) return 'No rows found.';

  return rows
    .map((row, index) => {
      const entries = Object.entries(row || {})
        .filter(([key, value]) => {
          if (value === null || value === '' || typeof value === 'undefined') return false;
          const ignore = [
            'id',
            'created_at',
            'updated_at',
            'restaurant_id',
            'profile_id',
            'user_id',
          ];
          return !ignore.includes(key);
        })
        .slice(0, maxFields)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}: [${value
              .slice(0, 5)
              .map((v) => JSON.stringify(v))
              .join(', ')}${value.length > 5 ? ', ...' : ''}]`;
          }
          return `${key}: ${JSON.stringify(value)}`;
        });

      return `${index + 1}. ${entries.join(' | ')}`;
    })
    .join('\n');
}

async function buildSectionContext(section) {
  try {
    switch (section) {
      case 'menu': {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .limit(20);

        if (error) {
          console.error('Supabase error (menu_items):', error);
          return 'Database snapshot (menu): error while loading menu_items.';
        }

        const summary = summarizeRows(data);
        return `DATABASE SNAPSHOT - MENU ITEMS\nUse only this data when asked about the menu.\n${summary}`;
      }

      case 'orders': {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Supabase error (orders):', error);
          return 'Database snapshot (orders): error while loading orders.';
        }

        const summary = summarizeRows(data);
        return `DATABASE SNAPSHOT - ORDERS\nThese are the most recent orders.\n${summary}`;
      }

      case 'inventory': {
        const { data, error } = await supabase
          .from('inventory')
          .select('*')
          .limit(20);

        if (error) {
          console.error('Supabase error (inventory):', error);
          return 'Database snapshot (inventory): error while loading inventory.';
        }

        const summary = summarizeRows(data);
        return `DATABASE SNAPSHOT - INVENTORY\nCurrent stock items:\n${summary}`;
      }

      case 'customers': {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .limit(20);

        if (error) {
          console.error('Supabase error (customers):', error);
          return 'Database snapshot (customers): error while loading customers.';
        }

        const summary = summarizeRows(data);
        return `DATABASE SNAPSHOT - CUSTOMERS\nKnown customers:\n${summary}`;
      }

      case 'staff': {
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .limit(20);

        if (error) {
          console.error('Supabase error (staff):', error);
          return 'Database snapshot (staff): error while loading staff.';
        }

        const summary = summarizeRows(data);
        return `DATABASE SNAPSHOT - STAFF\nStaff members:\n${summary}`;
      }

      case 'reservations': {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .order('reservation_time', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Supabase error (reservations):', error);
          return 'Database snapshot (reservations): error while loading reservations.';
        }

        const summary = summarizeRows(data);
        return `DATABASE SNAPSHOT - RESERVATIONS\nRecent reservations:\n${summary}`;
      }

      case 'pos': {
        const [ordersRes, tablesRes] = await Promise.all([
          supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
          supabase.from('tables').select('*').limit(20),
        ]);

        let snapshot = 'DATABASE SNAPSHOT - POS\n';

        if (!ordersRes.error) {
          snapshot += '\nOpen / recent orders:\n' + summarizeRows(ordersRes.data);
        } else {
          console.error('Supabase error (pos/orders):', ordersRes.error);
          snapshot += '\nError loading orders for POS.\n';
        }

        if (!tablesRes.error) {
          snapshot += '\nTables:\n' + summarizeRows(tablesRes.data);
        } else {
          console.error('Supabase error (pos/tables):', tablesRes.error);
          snapshot += '\nError loading tables for POS.\n';
        }

        return snapshot;
      }

      case 'dashboard': {
        const tables = ['orders', 'menu_items', 'customers', 'staff', 'reservations'];

        const counts = await Promise.all(
          tables.map(async (table) => {
            const { count, error } = await supabase
              .from(table)
              .select('id', { head: true, count: 'exact' });

            if (error) {
              console.error(`Supabase count error (${table}):`, error);
              return `${table}: error`;
            }
            return `${table}: ${count ?? 0}`;
          })
        );

        return `DATABASE SNAPSHOT - DASHBOARD COUNTS\nApproximate row counts:\n${counts.join('\n')}`;
      }

      default: {
        const { count: orderCount } = await supabase
          .from('orders')
          .select('id', { head: true, count: 'exact' });
        const { count: menuCount } = await supabase
          .from('menu_items')
          .select('id', { head: true, count: 'exact' });
        const { count: inventoryCount } = await supabase
          .from('inventory')
          .select('id', { head: true, count: 'exact' });

        return `DATABASE SNAPSHOT - OVERVIEW
Orders: ${orderCount ?? 0}
Menu items: ${menuCount ?? 0}
Inventory items: ${inventoryCount ?? 0}

Use these numbers to answer high-level questions. For detailed questions, ask the user which area (menu, orders, inventory, etc.) they care about.`;
      }
    }
  } catch (err) {
    console.error('Unexpected error while building section context:', err);
    return 'Database snapshot: an unexpected error occurred while loading data.';
  }
}

app.post('/chat', async (req, res) => {
  const { message, section = 'general', context: uiContext = '' } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message field (string) is required' });
  }

  try {
    const dbContext = await buildSectionContext(section);

    const systemPrompt = `
You are an AI assistant for a restaurant POS and management system.

The application has these main areas: dashboard, menu, orders, staff, inventory, customers, POS, reservations and general administration.

You MUST follow these rules:
- Use ONLY the database snapshot and the user question to answer.
- DO NOT invent menu items, orders, reservations or customers that are not in the snapshot.
- If the snapshot does not contain the requested information, say clearly what is missing and what the user can do in the app (e.g., "you can add new menu items on the Menu Items page").
- Be concise, practical and business-oriented.
- When talking about money, just echo the values you see in the snapshot (do not recalculate historical revenue unless the snapshot includes it).
`;

    const userContent =
      uiContext && uiContext.trim().length > 0
        ? `${message}\n\nAdditional UI context: ${uiContext}`
        : message;

    const completion = await groq.chat.completions.create({
      model: groqModel,
      temperature: 0.2,
      max_tokens: 700,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'system', content: dbContext },
        { role: 'user', content: userContent },
      ],
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() ||
      'I could not generate a response.';

    return res.json({ response: text });
  } catch (err) {
    console.error('❌ API ERROR:', err);
    return res.status(500).json({
      error: 'AI_ERROR',
      message: 'Something went wrong while talking to the AI.',
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`AI server running on port ${PORT}`);
});
