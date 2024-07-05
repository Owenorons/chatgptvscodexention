import * as vscode from 'vscode';
import axios from 'axios';

async function askChatGPT(
  context: vscode.ExtensionContext,
  prompt: string
): Promise<string> {
  const apiKey =
    (await context.secrets.get('openaiApiKey')) ||
    vscode.workspace.getConfiguration().get('chatgpt.apiKey');
  if (!apiKey || undefined) {
    vscode.window.showErrorMessage(
      'API Key not set. Please set it using the command "ChatGPT: Set API Key".'
    );
    return 'API Key not set';
  }

  const apiUrl = 'https://api.openai.com/v1/engines';
  const engine =
    vscode.workspace.getConfiguration().get('chatgpt.engine') ||
    'davinci-codex';
  const maxTokens =
    vscode.workspace.getConfiguration().get('chatgpt.maxTokens') || 100;
  const temperature =
    vscode.workspace.getConfiguration().get('chatgpt.temperature') || 0.5;

  try {
    const response = await axios.post(
      `${apiUrl}/${engine}/completions`,
      {
        prompt: prompt,
        max_tokens: maxTokens,
        n: 1,
        stop: null,
        temperature: temperature,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const choices = response.data.choices;
    if (choices && choices.length > 0) {
      return choices[0].text.trim();
    } else {
      return 'No response from ChatGPT';
    }
  } catch (error) {
    console.error('Error contacting ChatGPT:', error);
    return `Error: ${error}`;
    // if (error.response) {
    //   return `Error: ${error.response.status} - ${error.response.statusText}`;
    // } else if (error.request) {
    //   return 'Error: No response from ChatGPT server.';
    // } else {
    // return `Error: ${error.message}`;
    // }
  }
}

async function handleCodeAction(
  action: string,
  context: vscode.ExtensionContext
) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);
  if (!selectedText) {
    vscode.window.showErrorMessage('No code selected');
    return;
  }

  let prompt = '';
  switch (action) {
    case 'fix':
      prompt = `Please fix the following code:\n\n${selectedText}`;
      break;
    case 'analyze':
      prompt = `Please analyze the following code and provide feedback:\n\n${selectedText}`;
      break;
    case 'improve':
      prompt = `Please improve the following code:\n\n${selectedText}`;
      break;
    case 'debug':
      prompt = `Please debug the following code and identify any issues:\n\n${selectedText}`;
      break;
    default:
      vscode.window.showErrorMessage('Unknown action');
      return;
  }

  const response = await askChatGPT(context, prompt);
  editor.edit((editBuilder) => {
    editBuilder.replace(selection, response);
  });
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('chatgpt.fixCode', () =>
      handleCodeAction('fix', context)
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('chatgpt.analyzeCode', () =>
      handleCodeAction('analyze', context)
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('chatgpt.improveCode', () =>
      handleCodeAction('improve', context)
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('chatgpt.debugCode', () =>
      handleCodeAction('debug', context)
    )
  );

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = 'chatgpt.ask';
  statusBarItem.text = 'Ask ChatGPT';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  let askDisposable = vscode.commands.registerCommand(
    'chatgpt.ask',
    async () => {
      const prompt = await vscode.window.showInputBox({
        prompt: 'Ask ChatGPT',
      });
      if (prompt) {
        const response = await askChatGPT(context, prompt);
        const document = await vscode.workspace.openTextDocument({
          content: response,
          language: 'markdown',
        });
        vscode.window.showTextDocument(document);
      }
    }
  );

  let setApiKeyDisposable = vscode.commands.registerCommand(
    'chatgpt.setApiKey',
    async () => {
      const apiKey = await vscode.window.showInputBox({
        prompt: 'Enter your OpenAI API Key',
        ignoreFocusOut: true,
        password: true,
      });
      if (apiKey) {
        await context.secrets.store('openaiApiKey', apiKey);
        vscode.window.showInformationMessage('API Key set successfully!');
      }
    }
  );

  // let openWebviewDisposable = vscode.commands.registerCommand('chatgpt.openWebview', () => {
  //     const panel = vscode.window.createWebviewPanel(
  //         'chatgptWebview',
  //         'ChatGPT Webview',
  //         vscode.ViewColumn.One,
  //         { enableScripts: true }
  //     );

  //     panel.webview.html = getWebviewContent();
  // });
  let openWebviewDisposable = vscode.commands.registerCommand(
    'chatgpt.openWebview',
    () => {
      const panel = vscode.window.createWebviewPanel(
        'chatgptWebview',
        'ChatGPT Webview',
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(
        async (message) => {
          switch (message.command) {
            case 'ask':
              const response = await askChatGPT(context, message.prompt);
              panel.webview.postMessage({
                command: 'response',
                response: response,
              });
              break;
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(openWebviewDisposable);

  context.subscriptions.push(askDisposable);
  context.subscriptions.push(setApiKeyDisposable);
  context.subscriptions.push(openWebviewDisposable);
}

function getWebviewContent(): string {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ChatGPT Webview</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            h1 {
                color: #444;
            }
            textarea {
                width: 100%;
                height: 100px;
                margin-bottom: 10px;
                padding: 10px;
                font-size: 14px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            button {
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 5px;
            }
            button:hover {
                background-color: #45a049;
            }
            pre {
                background: #f4f4f4;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <h1>Chat with ChatGPT</h1>
        <textarea id="prompt" placeholder="Type your question here..."></textarea><br>
        <button onclick="askChatGPT('ask')">Ask</button>
        <button onclick="askChatGPT('fix')">Fix Code</button>
        <button onclick="askChatGPT('analyze')">Analyze Code</button>
        <button onclick="askChatGPT('improve')">Improve Code</button>
        <button onclick="askChatGPT('debug')">Debug Code</button>
        <pre id="response"></pre>
        <script>
            const vscode = acquireVsCodeApi();

            function askChatGPT(action) {
                const prompt = document.getElementById('prompt').value;
                let fullPrompt = prompt;
                switch (action) {
                    case 'fix':
                        fullPrompt = \`Please fix the following code:\n\n\${prompt}\`;
                        break;
                    case 'analyze':
                        fullPrompt = \`Please analyze the following code and provide feedback:\n\n\${prompt}\`;
                        break;
                    case 'improve':
                        fullPrompt = \`Please improve the following code:\n\n\${prompt}\`;
                        break;
                    case 'debug':
                        fullPrompt = \`Please debug the following code and identify any issues:\n\n\${prompt}\`;
                        break;
                }
                vscode.postMessage({ command: 'ask', prompt: fullPrompt });
            }

            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === 'response') {
                    document.getElementById('response').textContent = message.response;
                }
            });
        </script>
    </body>
    </html>`;
}

export function deactivate() {}
