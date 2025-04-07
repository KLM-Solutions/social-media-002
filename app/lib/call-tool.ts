import { tool } from 'ai';
import { z } from 'zod';

export const callTool = tool({
  description: 'Unified tool call for all tools, based on annotation you must choose the correct tool and method',
  parameters: z.object({
    tool: z.string().describe('Name of the tool/integration to use, example: "google_calendar"'),
    method: z.string().describe('Name of the method to call, example: "get_event"'),
    params: z.record(z.any())
      .describe('Object with arbitrary parameters, example: { "event_id": 123 }, follow the annotation of the tool to choose the correct parameters. Parameters are NOT optional. You MUST include all required parameters.')
      .default({})
  }),
  execute: async function({ tool, method, params = {} }) {
    const url = `https://veyraxapp.com/tool-call/${tool}/${method}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'VEYRAX_API_KEY': process.env.VEYRAX_API_KEY || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        result: {
          data: data.data,
          component: data.component || null
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
});