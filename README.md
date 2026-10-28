# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Demo login

Demo login accounts:

| Username | Password | Access |
| --- | --- | --- |
| `admin` | `admin123456Aa@` | Workspace |

Only this demo account can sign in with a username and password. This browser-side
demo is not server authorization; a production app needs server-side account
storage and authentication on protected loaders and APIs.

### Google login prototype

The login page also offers **Tiếp tục với Google**. Google OAuth is a real server-side
authorization-code flow. Dashboard content and the current client-side route guard
remain prototype behavior, so this is not production authorization.

To enable Google login locally:

1. Create or select a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Configure the OAuth consent screen and add a test user if the app is in testing mode.
3. Under **APIs & Services → Credentials**, create an OAuth client with application
   type **Web application**. Add this exact authorized redirect URI:
   `http://localhost:5173/auth/google/callback`.
4. Copy `.env.example` to `.env` and fill in the client ID and client secret. Generate
   `AUTH_SESSION_SECRET` with `openssl rand -base64 32`.
5. Run `pnpm dev` and select **Tiếp tục với Google** on `/login`.

The redirect URI in `GOOGLE_REDIRECT_URI` must exactly match the URI registered in
Google Cloud, including scheme and path. Register the corresponding HTTPS callback
for each deployed hostname. This prototype requests only `openid email profile` and
does not request Google API access. Keep `.env` and client secrets out of source
control and configure production values in the deployment's server environment.
OAuth setup and redirect URI requirements are described in [Google's web server OAuth guide](https://developers.google.com/identity/protocols/oauth2/web-server).

### Business chatbot demo

Use the bottom-right chatbot button on any workspace page. The drawer uses a
quarter of the desktop viewport (minimum 360px) and the full width on mobile.
Choose a suggested question or type a message about revenue, orders, or returning
customers. Replies use the existing dashboard fixtures and are explicitly simulated.

Enter sends a message; Shift+Enter adds a new line. Attachments can be selected,
removed, and sent, but only their names and sizes are retained locally: no files
are uploaded or analyzed. Conversation and draft state survive closing/reopening
and workspace navigation; reload or logout clears them.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.

Login UI adapts the official [shadcn login-04 block](https://ui.shadcn.com/blocks/login), with Button, Input, Label and Card from the [new-york registry](https://ui.shadcn.com/r/styles/new-york/button.json). Imports use the existing `~/` alias and Tailwind 4 theme.
# react-template
