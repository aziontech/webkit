export const AI_FAQ = [
  {
    value: 'q1',
    question: 'Which model types are supported?',
    answer:
      'Azion AI Inference supports model categories including LLMs, VLMs, embeddings, and rerankers.'
  },
  {
    value: 'q2',
    question: 'How do I use AI Inference in my application?',
    answer:
      'You can call AI Inference directly from Functions with the API pattern `const response = await Azion.AI.run(model, input)` and integrate it into your existing request flow.'
  },
  {
    value: 'q3',
    question: 'Is Azion AI compatible with OpenAI APIs and SDKs?',
    answer:
      'Yes. Azion AI Inference provides OpenAI-compatible endpoints, so migration typically requires endpoint and credential updates instead of full rewrites.'
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
      'Yes. You can apply LoRA fine-tuning to pre-trained models to adapt them and improve task accuracy for domain-specific workloads.'
  },
  {
    value: 'q6',
    question: 'What if the model I need is not available?',
    answer:
      "Azion is constantly expanding model support. If you need a specific model that's not yet available, open a Support ticket or submit feedback through the Azion Console. Each request is evaluated based on technical feasibility and demand."
  },
  {
    value: 'q7',
    question: 'What is the difference between training and inference?',
    answer:
      'Training teaches a model with data and is typically resource-intensive. Inference is running the trained model to generate predictions or responses, which is the phase handled by Azion AI Inference.'
  },
  {
    value: 'q8',
    question: 'How can I monitor AI application behavior in production?',
    answer:
      'You can monitor requests, latency, and runtime behavior with Real-Time Metrics, Real-Time Events, and GraphQL APIs for operational visibility.'
  },
  {
    value: 'q9',
    question: 'Do I need to manage servers or clusters for scaling?',
    answer:
      'No. AI workloads scale automatically on Azion infrastructure, including scale-to-zero behavior and usage-based pricing.'
  },
  {
    value: 'q10',
    question: 'Can AI be used for autonomous security use cases?',
    answer:
      'Yes. You can deploy AI agents to analyze content in real time, detect malicious patterns, and trigger automated mitigation workflows.'
  }
]
