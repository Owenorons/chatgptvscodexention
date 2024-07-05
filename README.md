# chatgptcodenizer README

Usage Instructions: How to Use the ChatGPT VSCode Extension
Setting the API Key
Open Visual Studio Code.

Open the Command Palette:

Press Ctrl+Shift+P (or Cmd+Shift+P on macOS) to open the Command Palette.
Set the API Key:

Type ChatGPT: Set API Key in the Command Palette and select the command.
Enter your OpenAI API key in the input box and press Enter.
You should see a notification confirming that the API key has been set successfully.
Using the Commands
Ask ChatGPT a Question:

Open the Command Palette by pressing Ctrl+Shift+P (or Cmd+Shift+P on macOS).
Type ChatGPT: Ask and select the command.
Enter your question or prompt in the input box and press Enter.
The response from ChatGPT will be displayed in a new text editor tab.
Open the Webview Panel:

Open the Command Palette by pressing Ctrl+Shift+P (or Cmd+Shift+P on macOS).
Type ChatGPT: Open Webview and select the command.
A webview panel will open where you can interact with ChatGPT.
Interacting with the Webview
Open the Webview Panel:

Open the Command Palette by pressing Ctrl+Shift+P (or Cmd+Shift+P on macOS).
Type ChatGPT: Open Webview and select the command.
The webview panel will open.
Using the Webview Interface:

Enter Your Prompt: Type your question or prompt in the text area provided.
Submit Your Prompt: Click the "Ask" button to submit your prompt to ChatGPT.
View the Response: The response from ChatGPT will be displayed in the panel below the text area.
Configuring Extension Settings
Open Settings:

Open the settings by pressing Ctrl+, (or Cmd+, on macOS).
Search for ChatGPT Settings:

In the settings search bar, type ChatGPT to find the extension settings.
Configure Settings:

API Key: Ensure your API key is set.
Max Tokens: Set the maximum number of tokens for ChatGPT responses.
Temperature: Set the temperature for the responses (controls the randomness of the output).
Engine: Set the OpenAI engine to use (e.g., davinci-codex).
Example Usage
Set the API Key:

Press Ctrl+Shift+P (or Cmd+Shift+P on macOS).
Type ChatGPT: Set API Key and enter your API key.
Ask a Question:

Press Ctrl+Shift+P (or Cmd+Shift+P on macOS).
Type ChatGPT: Ask and enter your prompt, such as "Explain the concept of polymorphism in object-oriented programming."
View the Response:

The response will be displayed in a new text editor tab with the explanation provided by ChatGPT.
Interact with the Webview:

Press Ctrl+Shift+P (or Cmd+Shift+P on macOS).
Type ChatGPT: Open Webview to open the webview panel.
Type a prompt in the text area, such as "What is the capital of France?" and click "Ask."
The response will be displayed in the webview panel.

Configuration Settings
API Key

Description: Your OpenAI API key used to authenticate requests to the OpenAI API.
Setting: chatgpt.apiKey
How to Set:
Press Ctrl+Shift+P (or Cmd+Shift+P on macOS) to open the Command Palette.
Type ChatGPT: Set API Key and enter your API key.
Max Tokens

Description: The maximum number of tokens to generate in the ChatGPT response. Tokens can be as short as one character or as long as one word (e.g., "chatbot").
Setting: chatgpt.maxTokens
Default: 100
How to Set:
Open the settings by pressing Ctrl+, (or Cmd+, on macOS).
Search for ChatGPT and set the Max Tokens value.
Temperature

Description: Controls the randomness of the response. Values range from 0 to 1, where lower values make the output more focused and deterministic.
Setting: chatgpt.temperature
Default: 0.5
How to Set:
Open the settings by pressing Ctrl+, (or Cmd+, on macOS).
Search for ChatGPT and set the Temperature value.
Engine

Description: Specifies which OpenAI engine to use for generating responses (e.g., davinci-codex, curie, etc.).
Setting: chatgpt.engine
Default: davinci-codex
How to Set:
Open the settings by pressing Ctrl+, (or Cmd+, on macOS).
Search for ChatGPT and set the Engine value.
