# Judie AI

A modern AI-powered coaching and conversation platform built with Next.js, shadcn/ui, and TypeScript.

## Features

- 🎨 **Modern Design**: Clean, responsive interface with dark/light mode support
- 💬 **Chat Interface**: Intuitive messaging system with conversation management
- 🤖 **AI Assistant**: Intelligent suggestions and coaching insights
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast**: Built with Next.js 15 and Turbopack for optimal performance
- 🎯 **Type-Safe**: Fully typed with TypeScript
- 🎭 **Component-Based**: Modular architecture with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes
- **TypeScript**: Type-safe development

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── chats/             # Chat page
│   ├── about/             # About page
│   └── page.tsx           # Home page
├── components/
│   ├── chat/              # Chat-related components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   └── ui/                # shadcn/ui components
└── lib/                   # Utilities
```

## Pages

- **Home** (`/`): Landing page with feature showcase
- **Chats** (`/chats`): Main chat interface with conversation management
- **About** (`/about`): Information about the platform

## Components

### Chat Components
- `ChatLayout`: Main chat container with responsive layout
- `ConversationSidebar`: List of conversations with search and filtering
- `ChatArea`: Message display and input area
- `AiAssistantPanel`: AI suggestions and coaching insights

### Layout Components
- `Navigation`: Responsive header with theme toggle and mobile menu

## Responsive Design

- **Mobile**: Single-column layout with slide-out sidebar
- **Tablet**: Two-column layout (conversations + chat)
- **Desktop**: Three-column layout (conversations + chat + AI panel)

## License

This project is for demonstration purposes.
