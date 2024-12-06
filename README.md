# LLM Chat

## What is this?

Open source full-stack LLM chat application. Run it locally, host it at your house, or in the cloud.

## Can I access the API for free without even using an API key?

Sure! The service is running in an apartment in San Francisco. 

Just hit https://www.exactchange.network/llm/chat with the following payload:

```
{
  sessionId: string;
  input: string;
}
```

## Is there a hosted version online?

Yes at [chat.zdifferentiator.com](https://chat.zdifferentiator.com).

## How can I run this on my own computer?

1. Clone the repo

2. Install [Ollama](https://ollama.com/).

3. Pull the LLM you want to use (in this case: Mistral)

`ollama pull mistral`

4. Start Ollama

`ollama start`

5. Install Node (Install [nvm](https://github.com/nvm-sh/nvm) to manage Node versions)

From project root: `nvm use`

6. Start the server

From project root: `cd ./server`

`npm i`

`npm start`

7. Start the client

From project root: `cd ./client`

`npm i`

`npm start`

8. Visit http://localhost:3000 to use the UI

9. Coming soon: Setup SSL, domain name, and port forwards for others to access your AI chat!

-----

This repo includes a complete deploy-ready Node server and unbuilt React client.

The backend relies on [Ollama](https://ollama.com/) - self-host popular models like Mistral, Llama, and Gemma!

The front-end is a [create-react-app](https://www.npmjs.com/package/create-react-app) - easily host on PaaS like Vercel, or build and deploy with your server!

-----

Questions? hello@bennyschmidt.com 
