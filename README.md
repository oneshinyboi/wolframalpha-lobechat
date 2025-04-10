# Wolfram Alpha Plugin for LobeChat

A plugin for LobeChat that integrates Wolfram Alpha computational knowledge engine functionality.

## Features

- Query Wolfram Alpha directly from LobeChat
- Get computational answers to questions about math, science, statistics, and more
- Simple integration with LobeChat plugin ecosystem

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Wolfram Alpha API key (AppID) - [Get one here](https://developer.wolframalpha.com/portal/myapps/)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/oneshinyboi/wolframalpha-lobechat.git
   cd wolframalpha-lobechat
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to verify the server is running.

## Deployment

### Production Build

1. Build the project:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm run start
   # or
   yarn start
   ```

### Docker Deployment

A Dockerfile is included for containerized deployment:

```bash
# Build the Docker image
docker build -t wolfram-lobechat .

# Run the container
docker run -p 3000:3000 wolfram-lobechat
```

### Vercel Deployment

This plugin is compatible with Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Configure the build settings as needed
3. Deploy

## Configuration

### Plugin Settings

When adding the plugin to LobeChat, you'll need to configure:

- **APP_ID**: Your Wolfram Alpha API key

### Plugin Gateway

The plugin uses LobeChat's plugin gateway for communication. The gateway endpoint is:

```
/api/gateway
```

## Usage

1. Install the plugin in your LobeChat instance
2. Enter your Wolfram Alpha APP_ID in the plugin settings
3. Start querying Wolfram Alpha directly from your chat!

Example queries:
- "Solve x^2 + 3x - 4 = 0"
- "What is the distance from Earth to Mars?"
- "Population of Germany vs France"

## Acknowledgments

- [LobeChat](https://github.com/lobehub/lobe-chat) for the plugin ecosystem
- [Wolfram Alpha](https://www.wolframalpha.com/) for their computational knowledge engine
