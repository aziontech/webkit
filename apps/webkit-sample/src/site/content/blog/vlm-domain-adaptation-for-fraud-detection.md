VLMs (Vision-Language Models) are artificial intelligence models that simultaneously process images and text for visual and linguistic analysis. When combined with LoRA (Low-Rank Adaptation), they enable fraud detection in documents with high accuracy in low-latency pipelines, without full retraining of the base model.

## What is LoRA and how does it work for VLMs

LoRA (Low-Rank Adaptation) is a fine-tuning technique that inserts low-rank adaptation matrices into specific layers of a pre-trained model. Instead of updating all model parameters — which can require billions of operations — LoRA adjusts only 0.1% to 1% of total parameters, focusing adaptation on the components most critical to the target domain.

For VLMs like Qwen2.5-VL, the process happens in three steps:

- Target module selection — identify attention layers relevant to visual document analysis
- Low-rank decomposition — add small adaptation matrices without modifying original weights
- Domain-specific training — adjust only the adapters using fraud data

```
from peft import get_peft_model, LoraConfig

lora_config = LoraConfig(
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    bias="none"
)

financial_fraud_vlm = get_peft_model(qwen_vl_model, lora_config)
```

The LoRA adapter is saved separately from the base model weights and loaded on top of the base model before serving inference — via PeftModel.from_pretrained() locally or deployed as a model variant in the inference service. In Azion AI Inference, the registered model already incorporates the adapter: the Edge Function calls the resulting endpoint without managing adapter loading directly.

## How distributed architecture amplifies VLMs

VLM models with LoRA fine-tuning require an execution layer that delivers real-time inference. Centralized architectures introduce network latency from round-trips that makes detection during a transaction impractical.

Execution on a distributed architecture eliminates that round-trip by processing inference at global points of presence, close to the source of the request.

## Comparison: fraud detection approaches

| Aspect | Generic centralized model | VLM + LoRA on distributed architecture |
|---|---|---|
| Network latency | Round-trip to central data center | Processing at nearest point of presence |
| Accuracy on specific documents | Low–medium | High (with per-document-type fine-tuning) |
| Adaptation cost | High (full retraining) | Low (0.1–1% of parameters with LoRA) |
| Data privacy | Data travels to external data center | Processing close to origin |
| Scalability | Centralized | Distributed across points of presence |
| Detection during transaction | Limited by network latency | Viable |
| Best for | Retrospective batch analysis | Real-time prevention |

## Fraud detection pipeline

The workflow adapts analysis depth based on the suspicion level identified in the initial triage:

Stage 1 — Initial triage

- Lightweight model evaluates basic fraud signals
- Output: suspicion score (0–1)

Stage 2 — Deep analysis (conditional)

- Triggered when score > 0.3
- VLM analyzes document-specific visual anomalies
- Vector search for similar patterns in confirmed prior cases

Stage 3 — Contextual verification

- Account history and behavioral patterns
- Risk-based authentication escalation

This structure applies intensive analysis only where needed, keeping processing fast for documents that show no fraud signals.

## Implementation with Azion AI Inference

VectorRetriever and FRAUD_DETECTION_PROMPT are local abstractions that need to be implemented. VectorRetriever encapsulates the connection to the vector database and the search method; FRAUD_DETECTION_PROMPT is a string with the system instructions for the model. The minimum expected contract for each is described in the configuration section below.

startTime is declared before the try block to ensure availability throughout the entire execution:

```
import { VectorRetriever } from './vectorRetriever'
import { FRAUD_DETECTION_PROMPT } from './config'

export async function handleRequest(request) {
  const startTime = Date.now()

  try {
    const formData = await request.formData()
    const documentFile = formData.get('document')
    const documentUrl = formData.get('documentUrl')

    const imageUrl = documentUrl || (await uploadToStorage(documentFile))

    const modelResponse = await Azion.AI.run('qwen-qwen25-vl-7b-instruct-awq', {
      stream: false,
      messages: [
        {
          role: 'system',
          content: FRAUD_DETECTION_PROMPT
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this document to identify possible fraud signals. Return JSON with fraudProbability (0-1), detectedAnomalies (array), and confidence (0-1).'
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl }
            }
          ]
        }
      ]
    })

    const analysisResult = JSON.parse(modelResponse.choices[0].message.content)

    let similarCases = []
    if (analysisResult.fraudProbability > 0.3) {
      const retriever = new VectorRetriever({
        dbName: process.env.VECTOR_STORE_DB_NAME || 'fraud_patterns',
        threshold: 0.8
      })
      similarCases = await retriever.search({
        query: analysisResult.detectedAnomalies.join(' '),
        limit: 5
      })
    }

    return new Response(
      JSON.stringify({
        fraudProbability: analysisResult.fraudProbability,
        anomalies: analysisResult.detectedAnomalies,
        confidence: analysisResult.confidence,
        similarCases,
        processingTimeMs: Date.now() - startTime
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error processing document', details: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

async function uploadToStorage(file) {
  return `https://storage.example.com/temp/${Date.now()}_${file.name}`
}
```

## When to use VLMs with LoRA for fraud detection

Use this approach when you need:

- Detection during the transaction, not after its completion
- Image analysis of documents: checks, invoices, identity documents, contracts
- Fast adaptation to new fraud patterns without full model retraining
- Processing that cannot send sensitive data to external data centers
- Low-latency decisions in credit approval or onboarding pipelines

Do not use this approach when:

- Analysis is purely textual, with no visual component
- Transaction volume is low enough for retrospective batch analysis
- Distributed infrastructure is not available in the environment

## Metrics and benchmarks

- Fine-tuning parameter reduction: 99–99.9% fewer adjusted parameters with LoRA vs. full fine-tuning (Hu et al., ICLR 2022)
- Recommended suspicion threshold: 0.3 as a starting point; calibrate based on false positive rate observed in production
- Vector similarity for known patterns: threshold of 0.8 for matching confirmed prior cases
- Network latency: eliminated the need for a round-trip to a central data center by processing at Azion Web Platform’s global points of presence

## Common mistakes and fixes

Mistake: Using the generic model without fine-tuning for specific document types Fix: Apply LoRA with labeled data from the target document type (checks, invoices, IDs)

Mistake: Setting the suspicion threshold too low (< 0.1), generating excessive unnecessary deep analyses Fix: Calibrate the threshold based on the acceptable false positive rate; 0.3 is a starting point, not a universal value

Mistake: Not populating the vector store with confirmed fraud cases Fix: Populate the fraud_patterns database with anomaly vectors from confirmed fraud cases to enable similarity search

Mistake: Running the entire analysis in a single stage regardless of suspicion level Fix: Implement an adaptive pipeline with lightweight triage before triggering the full VLM

Mistake: Declaring startTime inside the try block, making it inaccessible for the processingTimeMs calculation Fix: Declare startTime before try, as shown in the code example above

## Use cases by sector

Financial services

- Check and payment slip validation at clearing time
- Income verification document analysis in credit approval
- Altered invoice detection in reimbursement processes

Digital onboarding

- Identity document verification (national ID, driver’s license, passport)
- Detection of AI-generated or digitally edited documents
- Selfie-with-document validation in KYC flows

Insurance

- Claim photo analysis to detect tampering
- Invoice verification in reimbursements

E-commerce and marketplace

- Payment receipt validation
- Fake invoice detection in chargeback disputes

## How to implement on Azion

1. Select the model: Use qwen-qwen25-vl-7b-instruct-awq in Azion Web Platform’s AI Inference
2. Configure the vector store: Create the fraud_patterns database with confirmed fraud pattern vectors
3. Implement the Edge Function: Use the code example above as a base
4. Define the system prompt: Configure FRAUD_DETECTION_PROMPT with instructions specific to the document type
5. Calibrate thresholds: Adjust fraudProbability > 0.3 and threshold: 0.8 with real production data
6. Configure observability: Add logging of processingTimeMs and scores for continuous monitoring

See the Azion AI Inference documentation for configuration details.

## Frequently asked questions

**What is a VLM (Vision-Language Model)?** A VLM is an artificial intelligence model that simultaneously processes visual (image) and textual inputs. Models like Qwen2.5-VL can analyze the visual content of a document and answer questions about it in natural language.

**What is LoRA (Low-Rank Adaptation)?** LoRA is an efficient fine-tuning technique that adds low-rank adaptation matrices to specific layers of a pre-trained model. It enables specializing the model for a domain by adjusting only 0.1% to 1% of total parameters, drastically reducing computational adaptation cost.

**What is the difference between full fine-tuning and LoRA?** Full fine-tuning updates all model parameters, requiring large data volumes and computational power. LoRA inserts lightweight adapters into selected layers, keeping original weights frozen. Results on domain-specific tasks are comparable at a fraction of the cost.

**Why process fraud detection on a distributed architecture instead of centralized?** Centralized architectures introduce network latency from round-trips that can make detection impractical during a transaction. Processing at global points of presence — close to the source of the request — eliminates that round-trip and enables real-time decisions.

**Can Qwen2.5-VL analyze any type of document?** The base Qwen2.5-VL has general visual analysis capability. For specific document types (bank checks, driver’s licenses, invoices), accuracy improves significantly with LoRA fine-tuning using representative data from that document type.

**How does vector search for fraud patterns work?** Documents with a suspicion score above 0.3 have their detected anomalies converted to vectors and compared against the known patterns database. Similarity above 0.8 indicates a match with previously confirmed fraud cases.

**How long does it take to adapt a VLM with LoRA to a new fraud type?** Training LoRA adapters takes hours, not days, depending on data volume and available hardware. This enables fast response to new fraud patterns without waiting for full model retraining.

**Is it possible to use this approach without a GPU?** Quantized models like Qwen2.5-VL AWQ reduce hardware requirements. Inference can run on less specialized hardware, though GPU significantly accelerates throughput at high volumes.

**How do I calibrate the fraudProbability threshold?** Start with 0.3 and adjust based on the false positive rate observed in production. Thresholds too low increase manual review volume; too high allow fraud through without deep analysis. The appropriate threshold depends on the relative cost between false positive and false negative for the business.

**What happens if the model returns malformed JSON?** The try/catch block captures parsing errors and returns HTTP 500 with the error message. In production, implement fallback to manual review and logging of the raw model response for debugging.

Does Azion support running VLMs on its platform? Yes. Azion AI Inference allows running models like Qwen2.5-VL AWQ at the global points of presence of Azion Web Platform. The Azion.AI.run(‘qwen-qwen25-vl-7b-instruct-awq’, {…}) call executes inference without a round-trip to a centralized data center.

How do I ensure privacy of sensitive documents in this pipeline? Processing at global points of presence keeps data close to its origin, reducing the transit of sensitive documents to central data centers. For more stringent privacy requirements, combine with zero-retention policies and ephemeral processing.
