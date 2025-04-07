import { openai } from '@ai-sdk/openai';
import { streamText, appendResponseMessages } from 'ai';
import { getTools } from '../../lib/get-tools';
import { callTool } from '../../lib/call-tool';


export async function POST(request: Request) {
const { messages } = await request.json();

const toolsDescription = await getTools();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You are a helpful assistant. You're doing things step by step. First you explain what you're going to do. Then you do it and conclude.

    Available tools: ${String(toolsDescription)}.`,
    tools: {
      callTool
    },
    messages,
    maxSteps: 25,
    experimental_toolCallStreaming: true,
  });

return result.toDataStreamResponse();
}