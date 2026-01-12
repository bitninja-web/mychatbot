# ChitChat - AI Powered Chatbot 🤖

An intelligent conversational AI chatbot built with Next.js 15 and Google Gemini 2.0 Flash API, featuring PDF document analysis and a modern, responsive interface.

## 🌟 Features

- **AI-Powered Conversations**: Leverages Google Gemini 2.0 Flash API for intelligent, context-aware responses
- **PDF Document Analysis**: Upload and chat about PDF documents with AI-powered text extraction using PDF.js
- **Real-Time Chat Interface**: Smooth, responsive chat experience with typing indicators and message history
- **Dark/Light Theme**: Toggle between day and night modes for comfortable viewing
- **Modern UI/UX**: Built with Tailwind CSS, Framer Motion animations, and shadcn/ui components
- **Responsive Design**: Optimized for all devices - desktop, tablet, and mobile
- **Message Management**: Chat history with clear/delete functionality
- **Sidebar Navigation**: Easy access to new chats and settings

## 🚀 Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **AI Integration**: Google Gemini 2.0 Flash API
- **PDF Processing**: PDF.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/bitninja-web/chitchat.git
cd chitchat
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory and add your Google Gemini API key:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

### Basic Chat
1. Type your message in the input field
2. Press Enter or click Send
3. AI will respond with intelligent, context-aware answers

### PDF Chat
1. Click the "Upload PDF" button
2. Select a PDF document from your device
3. Ask questions about the document content
4. AI will analyze and provide relevant answers

### Theme Toggle
- Click the Sun/Moon icon in the sidebar to switch between light and dark modes

### New Chat
- Click the "New Chat" button to start a fresh conversation

## 🔑 API Key Setup

To use the chatbot, you need a Google Gemini API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

## 🛠️ Project Structure
```
chitchat/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main chatbot component
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   └── components/
│       └── ui/               # Reusable UI components
├── public/                   # Static assets
├── package.json
└── README.md
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

## 📝 Features in Detail

### AI Conversation Engine
- Context-aware responses using conversation history
- Natural language understanding
- Multi-turn conversations

### PDF Processing
- Client-side PDF text extraction
- No server-side storage (privacy-focused)
- Supports various PDF formats
- Efficient text parsing for AI analysis

### User Interface
- Clean, modern design
- Smooth animations and transitions
- Responsive layout for all screen sizes
- Accessibility-friendly

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Arpit Singh**
- GitHub: [@bitninja-web](https://github.com/bitninja-web)
- LinkedIn: [Arpit Singh](https://www.linkedin.com/in/arpit---singh)
- Email: arpit85bgp@gmail.com

## 🙏 Acknowledgments

- Google Gemini AI for the powerful API
- Vercel for Next.js framework
- shadcn/ui for beautiful components
- PDF.js for document processing

## 📸 Screenshots

### Light Mode
![Light Mode](screenshots/light-mode.png)

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

### PDF Chat
![PDF Chat](screenshots/pdf-chat.png)
