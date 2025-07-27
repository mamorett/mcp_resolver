#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dns from 'node:dns/promises';

const server = new Server(
  {
    name: 'mcp-dns-resolver',
    version: '1.0.0',
  },
  { capabilities: { tools: {} } }
);

// -------------------------------------------------
// Register one tool: resolve
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'resolve',
      description: 'Return the IPv4 address for a fully-qualified domain name',
      inputSchema: {
        type: 'object',
        properties: {
          host: {
            type: 'string',
            description: 'The FQDN to resolve',
          },
        },
        required: ['host'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  if (req.params.name !== 'resolve') {
    throw new Error(`Unknown tool: ${req.params.name}`);
  }

  const { host } = req.params.arguments;
  try {
    const records = await dns.resolve4(host);
    const address = records[0];
    if (!address) throw new Error(`No A record found for ${host}`);

    return {
      content: [{ type: 'text', text: address }],
    };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: 'text', text: err.message }],
    };
  }
});

// Start listening on stdio (MCP transport)
const transport = new StdioServerTransport();
await server.connect(transport);
