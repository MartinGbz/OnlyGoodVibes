# OnlyGoodVibes 🤗

## The "bad news-free" social network

This project is an **MVP** of a Social network that eliminates all the bad news from your [Lens Protocol](https://www.lens.xyz/) feed.

When you connect your wallet, OnlyGoodVibes will fetch your default feed (already created through Lens API). Then it will ask chat GPT to send a feedback of each post (true => good news, false => bad news).

All messages considered like "bad news" or "neutral news"(1) are blurred out on the UI.

You'll never be in a bad mood on the social networks again 😋

> (1) : As OnlyGooVibes is an MVP, the aim is to showcase the concept. By including neutral news I multiply my chances of there being blurred content in the feed, allowing everyone to see how it works.

## Project Usage

### Install dependencies

```bash
# install frontend / backend dependencies
yarn
```

### Set your OpenAI API key

```bash
cp .env.local.example .env.local
# set the OPENAI_API_KEY variable with your own OpenAI API key in the freshly created .env file
source .env
```

### Start the app

```bash
# this will start your Next.js app
# the frontend is available on http://localhost:3000/
# it also starts a local backend
yarn dev
```

Then, the app will be running on http://localhost:3000.
