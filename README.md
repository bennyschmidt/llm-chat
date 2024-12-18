# LLM Chat

## What is this?

Open source full-stack LLM chat application. Run it locally, host it at your house, or in the cloud.

## Is there a hosted version online?

Yes at [chat.fasterhorses.xyz](https://chat.fasterhorses.xyz).

```
{
  sessionId: string;
  input: string;
}
```

## How can I run this on my own computer?

#### 1. Clone the repo

#### 2. Install [Ollama](https://ollama.com/).

#### 3. Pull the LLM you want to use (in this case: Mistral)

`ollama pull mistral`

#### 4. Start Ollama

`ollama start`

#### 5. Install Node (Install [nvm](https://github.com/nvm-sh/nvm) to manage Node versions)

From project root: `nvm use`

#### 6. Start the server

From project root: `cd ./server`

`npm i`

`npm start`

#### 7. Start the client

From project root: `cd ./client`

`npm i`

`npm start`

#### 8. Visit http://localhost:3000 to use the UI

#### 9. Set up port forwards for others to access your AI chat:

Ports: 

- `sysctl net.ipv4.ip_forward = 1`

- You may need to additionally add devices & ports in your ISP's router configuration (e.g. the Xfinity mobile app)

Connections:

`iptables -I INPUT -p TCP -j ACCEPT`

HTTPS:

`sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-ports 8443`

`sudo iptables -t nat -A OUTPUT -p tcp --dport 443 -o to -j REDIRECT --to-port 8443`

#### 10. Setup SSL so that your HTTPS works:

`sudo certbot certonly --standalone -d your_domain` (follow CLI wizard)

Update SSL paths [here](https://github.com/bennyschmidt/llm-chat/blob/main/server/index.js#L40) to reference your newly created certificate and key.

-----

This repo includes a complete deploy-ready Node server and unbuilt React client.

The backend relies on [Ollama](https://ollama.com/) - self-host popular models like Mistral, Llama, and Gemma!

The front-end is a [create-react-app](https://www.npmjs.com/package/create-react-app) - easily host on PaaS like Vercel or Heroku, or build it and deploy with your server!
