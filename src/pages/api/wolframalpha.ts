import { createErrorResponse, getPluginSettingsFromRequest, PluginErrorType } from "@lobehub/chat-plugin-sdk"

export default async function (req: Request) {
  const settings = getPluginSettingsFromRequest(req)
  const { query } = await req.json()

  if (!settings) {
    return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
      message: 'Plugin settings not found.',
    })
  }

  try {
    const response = await fetch(`http://api.wolframalpha.com/v2/query?appid=${settings.APP_ID}&includepodid=Result&format=plaintext&input=${encodeURIComponent(query)}`);
    return new Response(await response.text());
  } catch (error) {
    return createErrorResponse(PluginErrorType.PluginServerError, error as object)
  }
}
