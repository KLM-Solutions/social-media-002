## Project Overview

This project uses VeyraX for tools and AI SDK `steamText` to implmenet Agentic flow. 

### 1. Get Tools (`get-tools.ts`)

The `getTools()` function retrieves available tools from the system. This function returns a string representation of the tools that can be used by the application.

### 2. Tool Execution (`call-tool.ts`)

The `callTool()` function allows the application to execute a specific tool with provided parameters. This creates a bridge between your application and external functionality.


### 3. SteamText (`route.ts`)
Function managed by AI SDK Library that allows to implmenet agentic flows. 

These components work together to provide a flexible and extensible system for incorporating external functionality into the application.


### 4. Dynamic Component Rendering (`dynamic-render.tsx`)

The `DynamicComponentRender` component enables the application to dynamically render UI components that are returned from backend tool calls. This powerful feature allows the system to generate and display UI elements on-the-fly based on data received from tools.

The system supports rendering both single components and arrays of components, making it flexible for various use cases. This creates a seamless bridge between backend tool functionality and frontend UI representation, enabling truly dynamic and interactive experiences.

This dynamic rendering capability is particularly powerful when combined with the tools system, as it allows tools to not only return data but also define how that data should be presented to the user.


## Installation 
## Installation 

To get started with this project, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/VeyraX/quick-start-aisdk.git
cd quick-start-aisdk
```

2. Create a `.env.local` file in the root directory with the following environment variables:
```
OPENAI_API_KEY=
VEYRAX_API_KEY=
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

Note: Make sure to replace the API keys with your own if needed. You can obtain a VeyraX API key by registering at [VeyraX platform](https://veyrax.com).