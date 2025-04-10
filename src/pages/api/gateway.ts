import { NextApiRequest, NextApiResponse } from 'next';
import { createGatewayOnNodeRuntime } from '@lobehub/chat-plugins-gateway';
import Cors from 'cors';

// The gateway plugin can't run in Edge runtime due to dynamic code evaluation
// Switching to Node.js runtime
export const config = {
  api: {
    // Enable body parsing for JSON
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
  console.log('Gateway request received:', req.method, req.url);
  
  // Run the middleware
  await runMiddleware(req, res, cors);

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).end();
  }

  try {
    console.log('Creating gateway handler');
    const gateway = createGatewayOnNodeRuntime({
      // You can customize the plugins index URL if needed
      // pluginsIndexUrl: 'https://example.com/plugins.json'
    });
    
    console.log('Calling gateway handler');
    return gateway(req, res);
  } catch (error) {
    console.error('Gateway error:', error);
    return res.status(500).json({ 
      details: error instanceof Error ? error.message : String(error),
      error: 'Gateway error'
    });
  }
}
