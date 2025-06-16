# **App Name**: OmniMeet AI

## Core Features:

- Screen and Audio Capture: Independent Screen and Audio Recording: Capture meetings with user-permissioned screen and audio recording, leveraging Flutter WebRTC and platform-native APIs, thus eliminating third-party SDK dependencies. This feature supports real-time capture, segmentation into manageable chunks (e.g., 30s intervals), and secure storage, enabling continuous training of AI models during the meeting.
- Live Transcription: Real-time AI Transcription: Utilize Whisper.cpp for live audio transcription during meetings, updating the transcription and making the training more incremental as the meeting progresses. By minimizing reliance on external SDKs or cloud based processing you can save on compute.
- AI Summarization: Intelligent Summarization & Action Items: Implement an AI-driven summarization tool using the Groq API to distill key points, decisions, and action items from meeting transcripts. Train with live streams and pre-process information and respond faster than ever by using Mixtral-8x7b model tool to extract meaningful insights for quick review and follow-up.
- Chatbot Assistant: Interactive Chatbot with RAG: Integrate a RAG chatbot powered by Supabase with pgvector, enabling users to ask questions and receive answers based on meeting content, it incorporates external context for a deeper, more context-aware information base.
- Unified Interface: Cross-Platform UI with Flutter: Develop a consistent, visually appealing UI across web, iOS, Android, macOS, Windows, and Linux platforms using Flutter, which enables glassmorphism and animated cards for displaying summaries and other meeting details.
- Workspace Integration: Productivity Integration: Facilitate exports of summaries and action items to other common tools, making key learnings shareable throughout your organization.

## Style Guidelines:

- Primary color: Deep indigo (#6366f1) with gradient variations for a futuristic, premium feel.
- Secondary color: Emerald green (#10b981) for success states and positive confirmations.
- Accent color: Amber (#f59e0b) for highlighting important CTAs and interactive elements.
- Background color: Deep slate (#0f172a) with subtle gradients for an immersive dark theme experience.
- Body and headline font: 'Inter' (sans-serif) for a modern, neutral, and highly readable interface. This font will be used for both headlines and body text, lending a contemporary feel suitable for extensive reading.
- Use modern, minimalist icons to represent meeting functions and features.
- Incorporate smooth, subtle animations and transitions for a premium and engaging user experience, particularly focusing on micro-interactions for buttons and page transitions.