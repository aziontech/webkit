export const AI_FAQ = [
  {
    value: 'q1',
    question: 'Which model types are supported?',
    answer: 'AI Inference supports LLMs, VLMs, embeddings, and rerankers.'
  },
  {
    value: 'q2',
    question: 'How do I use AI Inference in my application?',
    answer:
      'Call AI Inference from Functions with `const response = await Azion.AI.run(model, input)`, inside your existing request flow.'
  },
  {
    value: 'q3',
    question: 'Is Azion AI compatible with OpenAI APIs and SDKs?',
    answer:
      'Yes. AI Inference provides OpenAI-compatible endpoints, so most migrations only change the endpoint and credentials, not the code.'
  },
  {
    value: 'q4',
    question: 'How do I implement RAG and semantic search?',
    answer:
      'Use AI Inference with SQL Database vector search to store embeddings, retrieve relevant context, and build retrieval-augmented generation flows.'
  },
  {
    value: 'q5',
    question: 'Can I fine-tune models with proprietary data?',
    answer:
      'Yes. Apply LoRA fine-tuning to pre-trained models to adapt them and improve accuracy on domain-specific tasks.'
  },
  {
    value: 'q6',
    question: 'What if the model I need is not available?',
    answer:
      "Azion keeps adding models. If you need one that isn't available yet, open a Support ticket or send feedback through the Azion Console. Each request is reviewed for technical feasibility and demand."
  },
  {
    value: 'q7',
    question: 'What is the difference between training and inference?',
    answer:
      'Training teaches a model with data and is typically resource-intensive. Inference is running the trained model to generate predictions or responses, which is the phase AI Inference handles.'
  },
  {
    value: 'q8',
    question: 'How can I monitor AI application behavior in production?',
    answer:
      'Track requests, latency, and runtime behavior with Real-Time Metrics, Real-Time Events, and GraphQL APIs.'
  },
  {
    value: 'q9',
    question: 'Do I need to manage servers or clusters for scaling?',
    answer:
      'No. AI workloads scale automatically on Azion’s distributed infrastructure, scale to zero when idle, and are billed by usage.'
  },
  {
    value: 'q10',
    question: 'Can AI be used for autonomous security use cases?',
    answer:
      'Yes. Deploy AI agents to analyze content in real time, detect malicious patterns, and trigger automated mitigation workflows.'
  }
]
