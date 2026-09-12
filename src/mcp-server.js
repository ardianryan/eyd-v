#!/usr/bin/env node

const readline = require('readline');
const { searchRules, getRuleById, checkEyd, getLeksikon } = require('./index');

const SERVER_NAME = 'eyd-v-mcp-server';
const SERVER_VERSION = '1.0.0';

const TOOLS = [
  {
    name: 'search_eyd',
    description: 'Mencari aturan resmi Ejaan Bahasa Indonesia yang Disempurnakan (EYD V) milik Kemendikdasmen berdasarkan kata kunci atau topik (misal: "huruf kapital nama jabatan", "tanda koma", "partikel pun", "bentuk terikat").',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Kata kunci pencarian aturan EYD V'
        },
        limit: {
          type: 'number',
          description: 'Jumlah maksimal hasil pencarian (default: 5)'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_rule',
    description: 'Mengambil teks lengkap aturan, contoh resmi, dan catatan berdasarkan ID aturan (misal: "tanda-titik#1", "huruf-kapital#10").',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID aturan EYD V'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'check_spelling',
    description: 'Memeriksa teks bahasa Indonesia terhadap kaidah resmi EYD V (kata depan di/ke, bentuk terikat, partikel pun, peluluhan KTSP, tanda baca koma, kata baku vs nonbaku).',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'Teks kalimat atau paragraf bahasa Indonesia yang akan diperiksa'
        }
      },
      required: ['text']
    }
  },
  {
    name: 'lookup_word',
    description: 'Memeriksa apakah suatu kata merupakan bentuk baku menurut KBBI & EYD V dan memberikan bentuk bakunya jika tidak baku.',
    inputSchema: {
      type: 'object',
      properties: {
        word: {
          type: 'string',
          description: 'Kata yang ingin diperiksa'
        }
      },
      required: ['word']
    }
  }
];

function handleToolCall(name, args) {
  switch (name) {
    case 'search_eyd': {
      const results = searchRules(args.query, { limit: args.limit || 5 });
      return {
        query: args.query,
        count: results.length,
        results: results.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category,
          content: r.content,
          url: r.url
        }))
      };
    }
    case 'get_rule': {
      const rule = getRuleById(args.id);
      if (!rule) {
        return { error: `Aturan dengan ID '${args.id}' tidak ditemukan.` };
      }
      return rule;
    }
    case 'check_spelling': {
      return checkEyd(args.text);
    }
    case 'lookup_word': {
      const w = (args.word || '').toLowerCase().trim();
      const leksikon = getLeksikon();
      if (leksikon.kata_baku_map && leksikon.kata_baku_map[w]) {
        return {
          word: w,
          isStandard: true,
          standardForm: w,
          variants: leksikon.kata_baku_map[w]
        };
      }
      // Periksa apakah kata ini ada di daftar bentuk tidak baku
      for (const [baku, nonbakuList] of Object.entries(leksikon.kata_baku_map || {})) {
        if (nonbakuList.includes(w)) {
          return {
            word: w,
            isStandard: false,
            standardForm: baku,
            note: `'${w}' tidak baku, bentuk bakunya adalah '${baku}'.`
          };
        }
      }
      return {
        word: w,
        isStandard: true,
        note: `Kata '${w}' tidak tercatat sebagai bentuk keliru umum.`
      };
    }
    default:
      throw new Error(`Tool tidak dikenal: ${name}`);
  }
}

function sendResponse(id, result, error = null) {
  const response = {
    jsonrpc: '2.0',
    id: id
  };
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  process.stdout.write(JSON.stringify(response) + '\n');
}

function startMcpServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', (line) => {
    if (!line.trim()) return;
    try {
      const req = JSON.parse(line);
      const { id, method, params } = req;

      switch (method) {
        case 'initialize':
          sendResponse(id, {
            protocolVersion: '2024-11-05',
            serverInfo: {
              name: SERVER_NAME,
              version: SERVER_VERSION
            },
            capabilities: {
              tools: {}
            }
          });
          break;

        case 'notifications/initialized':
          // Notification, do not respond
          break;

        case 'tools/list':
          sendResponse(id, {
            tools: TOOLS
          });
          break;

        case 'tools/call': {
          try {
            const toolResult = handleToolCall(params.name, params.arguments || {});
            sendResponse(id, {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(toolResult, null, 2)
                }
              ]
            });
          } catch (err) {
            sendResponse(id, null, {
              code: -32603,
              message: err.message
            });
          }
          break;
        }

        default:
          if (id !== undefined) {
            sendResponse(id, null, {
              code: -32601,
              message: `Metode '${method}' tidak didukung`
            });
          }
          break;
      }
    } catch (err) {
      // JSON parse error
    }
  });
}

if (require.main === module) {
  startMcpServer();
}

module.exports = {
  startMcpServer,
  handleToolCall,
  TOOLS
};
