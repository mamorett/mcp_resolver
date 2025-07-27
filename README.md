# MCP DNS Resolver

This is a server for the Model Context Protocol that provides a tool to resolve the IPv4 address of a fully-qualified domain name.

## Installation

To install the dependencies, run:

```bash
npm install
```

## Running the server

To run the server, execute the following command:

```bash
node index.js
```

The server will start and listen for requests on stdin.

## Protocol

The server communicates using the Model Context Protocol over standard I/O.

### List Tools

To list the available tools, send the following JSON object to the server's standard input, followed by a newline:

```json
{
  "type": "request",
  "id": "1",
  "request": "listTools",
  "params": {}
}
```

The server will respond with a JSON object similar to this:

```json
{
  "type": "response",
  "id": "1",
  "response": "listTools",
  "result": {
    "tools": [
      {
        "name": "resolve",
        "description": "Return the IPv4 address for a fully-qualified domain name",
        "inputSchema": {
          "type": "object",
          "properties": {
            "host": {
              "type": "string",
              "description": "The FQDN to resolve"
            }
          },
          "required": [
            "host"
          ]
        }
      }
    ]
  }
}
```

### Call Tool

To call the `resolve` tool, send the following JSON object to the server's standard input, followed by a newline:

```json
{
  "type": "request",
  "id": "2",
  "request": "callTool",
  "params": {
    "name": "resolve",
    "arguments": {
      "host": "google.com"
    }
  }
}
```

The server will respond with the resolved IP address:

```json
{
  "type": "response",
  "id": "2",
  "response": "callTool",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "142.250.191.142"
      }
    ]
  }
}
```

## Example: Using with Claude Desktop or Any MCP Client

To use this resolver with Claude Desktop or another MCP-compatible client, add the following server configuration to your client’s MCP server list:

```json
{
  "name": "MCP DNS Resolver",
  "description": "Resolve IPv4 addresses for fully-qualified domain names via the Model Context Protocol.",
  "command": [
    "node",
    "/path/to/your/project/index.js"
  ],
  "workingDirectory": "/path/to/your/project",
  "env": {
    "NODE_ENV": "production"
  },
  "protocol": "stdio"
}
```

- Replace `/path/to/your/project` with the actual path to your `mcp_resolver` directory.
- This configuration tells the client to launch your resolver using Node.js and communicate over standard input/output.

...existing content...