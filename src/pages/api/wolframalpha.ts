import { createErrorResponse, PluginErrorType } from "@lobehub/chat-plugin-sdk"
import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

export const config = {
  api: {
    bodyParser: {
      json: true,
    },
  },
  runtime: 'nodejs',
};

// Initialize the cors middleware
const cors = Cors({
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: '*',
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: (req: NextApiRequest, res: NextApiResponse, next: (result: any) => void) => void) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log headers for debugging
    console.log('Headers:', JSON.stringify(req.headers, undefined, 2));

    // Parse request body
    let body;
    try {
      // For raw JSON body
      if (typeof req.body === 'string') {
        body = JSON.parse(req.body);
      }
      // For parsed body (when bodyParser is enabled)
      else if (req.body) {
        body = req.body;
      }
      // For streams or raw body
      else if (req.readable) {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const rawBody = Buffer.concat(chunks).toString('utf8');
        body = JSON.parse(rawBody);
      } else {
        throw new Error('Could not parse request body');
      }
    } catch (error) {
      console.error('Body parsing error:', error);
      return res.status(400).json({ error: 'Could not parse request body' });
    }

    console.log('Parsed body:', JSON.stringify(body, undefined, 2));

    // Extract settings from headers
    let settings;
    try {
      const settingsHeader = req.headers['x-lobe-plugin-settings'];
      settings = settingsHeader
        ? JSON.parse(decodeURIComponent(settingsHeader as string))
        : body.settings;
      console.log('Settings:', JSON.stringify(settings, undefined, 2));
    } catch (error) {
      console.error('Settings parsing error:', error);
    }

    // Extract query from body
    const query = body.query;
    console.log('Query:', query);

    if (!settings || !settings.APP_ID) {
      return res.status(400).json(
        createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
          message: 'Plugin settings not found or APP_ID missing.',
        })
      );
    }

    if (!query) {
      return res.status(400).json(
        createErrorResponse(PluginErrorType.PluginMetaInvalid, {
          message: 'Query parameter is required.',
        })
      );
    }

    try {
      const apiUrl = `http://api.wolframalpha.com/v2/query?appid=${settings.APP_ID}&includepodid=Result&format=plaintext&input=${encodeURIComponent(query)}`;
      console.log('API URL:', apiUrl);

      const response = await fetch(apiUrl);
      const result = await response.text();
      console.log('API Response:', result);

      return res.status(200).send(result);
    } catch (error) {
      console.error('Wolfram API error:', error);
      return res.status(500).json(
        createErrorResponse(PluginErrorType.PluginServerError, error as object)
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(400).json({
      details: error instanceof Error ? error.message : String(error),
      error: 'Invalid request'
    });
  }
}
