
# 🧠 RAG Scoliosis LLM

A Retrieval-Augmented Generation (RAG) application designed to provide reliable, structured information about **Adolescent Idiopathic Scoliosis (AIS)** using Large Language Models (LLMs).

This project combines a curated medical knowledge base with generative AI to produce grounded, context-aware responses.

---

## 🚀 Overview

Traditional LLMs generate responses based only on their training data.  
This project uses a **Retrieval-Augmented Generation (RAG)** architecture, meaning:

1. Relevant information is retrieved from a local knowledge base.
2. The retrieved context is sent to the LLM.
3. The model generates an answer grounded in that context.

This reduces hallucinations and improves factual consistency.

---

## 🏗 Architecture

User Question  
↓  
Knowledge Retrieval (local dataset / embeddings)  
↓  
Context Injection  
↓  
LLM Response Generation  
↓  
Grounded Answer  

---

## 📦 Tech Stack

- **TypeScript**
- **React**
- **Vite**
- **Google Gemini API** (LLM)
- Local structured medical dataset (JSON)

---

## 📂 Project Structure
RAG_Scoliosis_LLM/
│
├── App.tsx # Main UI component
├── index.tsx # App entry point
├── geminiService.ts # LLM API integration
├── knowledgeBase.ts # Retrieval logic
├── metadata.json # Structured scoliosis dataset
├── package.json # Dependencies and scripts
├── vite.config.ts # Vite configuration
└── README.md

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/gupadovezi/RAG_Scoliosis_LLM.git
cd RAG_Scoliosis_LLM

npm install

GEMINI_API_KEY=your_api_key_here

npm run dev

http://localhost:3000

💬 Example Questions

What is adolescent idiopathic scoliosis?

When is bracing indicated?

What are surgical indications?

What is the Cobb angle?

🛡 Medical Disclaimer

This tool is for educational and informational purposes only.
It does not replace professional medical advice, diagnosis, or treatment.

Always consult a qualified healthcare professional.

📈 Future Improvements

Embedding-based semantic search

Vector database integration

Source citation display

Model evaluation metrics

Clinical validation pipeline

🤝 Contributing

Pull requests are welcome.

If you’d like to contribute:

Fork the repository

Create a new branch

Submit a pull request

📜 License

MIT License

👨‍⚕️ Author

Developed by Gustavo J. P. N. Cruz
