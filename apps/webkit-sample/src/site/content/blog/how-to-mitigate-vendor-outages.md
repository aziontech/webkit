On June 12, developers worldwide faced a frustrating reality: their applications went dark. Cloudflare Workers stopped responding. Google Cloud customers experienced issues with their compute engine instances becoming unreachable and cloud functions timing out. If you were affected, you weren’t alone, and it wasn’t your fault.

This incident revealed a fundamental aspect of modern infrastructure: the hidden dependencies that can bring down entire applications when a single provider has a service outage. As engineers, we understand this pain—we’ve all been there when infrastructure fails. So why did so many platforms go down while others with end-to-end infrastructure remained operational? The difference lies in High Availability (HA) architecture and the elimination of single points of failure.

## What Happened: The Cascade Effect

On June 12, Google Cloud’s Service Control system encountered a critical failure. What started as a single point of failure quickly demonstrated how interconnected modern infrastructure has become.

The outage began with Google Cloud’s core services failing - Compute Engine, Cloud Functions, App Engine, and Cloud Storage all became unavailable. But the impact didn’t stop there. Services that relied on Google Cloud infrastructure also failed, creating a cascading effect that affected millions of end users worldwide.

The business impact was significant: e-commerce platforms experienced dramatic drops in successful transactions, development teams lost entire days of work, and financial services reported millions in missed trades. The incident lasted over six hours, affecting not only Google’s direct customers but also anyone whose applications depended on services that, in turn, relied on Google Cloud infrastructure.

## Understanding the Architecture Challenge

This incident highlighted a fundamental challenge in modern infrastructure: the complexity of dependency chains. Many platforms, built with the best engineering intentions, found themselves vulnerable to cascade failures.

The reality is that building global-scale infrastructure is a complex endeavor. When cloud providers offer mature, battle-tested services, it makes perfect engineering sense to leverage them. The challenge comes when these dependencies create single points of failure that aren’t immediately obvious.

What we witnessed was a classic cascade failure scenario. When Google Cloud’s Service Control system failed, it didn’t just affect direct Google Cloud customers. The failure propagated through every platform that depended on their infrastructure, creating a domino effect that reached millions of end users.

This isn’t about pointing fingers at specific platforms—it’s about understanding a systemic challenge. Many services that appear distributed and resilient actually depend on centralized cloud infrastructure for critical functionality. When that infrastructure fails, even the most well-engineered applications can become unavailable through no fault of their developers.

## The High Availability Approach That Worked

While many platforms worked to restore services affected by the Google Cloud outage, some infrastructure remained completely operational throughout the incident. This wasn’t luck—it was the result of High Availability (HA) architecture principles applied at scale.

Azion Web Platform maintained service continuity because our team had made a fundamental architectural choice: owning the end-to-end infrastructure. This approach eliminates external dependencies that can become single points of failure.

This architectural philosophy requires significant investment in physical infrastructure across hundreds of data centers worldwide, as well as direct relationships with Tier 1 network providers, and building software stacks from the ground up. It means creating DNS, CDN, compute, storage, and AI capabilities without depending on external cloud providers’ control plane.

When implemented correctly, this approach creates true redundancy. Instead of depending on external services that might share the same underlying infrastructure, every component is designed with multiple fallback layers. When Google’s Service Control failed on June 12, Azion and some other platforms didn’t experience cascade failures because they weren’t part of anyone else’s dependency chain.

This time it was Cloudflare that affected thousands of its customers in consequence of a third-party failure; however, this raises an important question: how many platforms would survive if AWS, for example, were to experience similar issues? The answer reveals a deeper architectural challenge about vendor dependencies.

The trade-off is complexity and investment, but the result is infrastructure that can maintain service continuity even when major cloud providers experience significant outages.

## The Vendor Lock-in Nobody Discusses

Cloud dependency creates a subtle but significant form of vendor lock-in that extends beyond traditional API concerns. When, for example, your functions can only deploy through Vercel’s system, you’re not just locked into a vendor’s APIs. You’re locked into their architectural choices, their dependency chains, and their failure modes—including complete dependence on AWS infrastructure.

This creates a new kind of vendor lock-in that goes beyond traditional concerns about proprietary formats or API compatibility. You inherit not just your chosen vendor’s limitations, but all the limitations of their underlying dependencies. Applications become transitively dependent on cloud infrastructure reliability, despite never making a conscious decision to rely on that infrastructure.

The alternative approach focuses on open standards that provide genuine portability. WinterTC APIs ensure that application code remains portable across different infrastructure providers. OpenAI-compatible APIs ensure that AI inference code can run anywhere that supports the standard interface. Standard JavaScript runtimes mean that application code isn’t tied to proprietary execution environments. HTTP/3 and QUIC provide modern performance without vendor-specific protocol dependencies.

When platforms are built on open standards, migration becomes a technical exercise rather than an architectural overhaul. Applications can be moved between providers without requiring code rewrites. Development teams retain leverage in vendor negotiations because switching costs remain manageable. Most importantly, you avoid inheriting someone else’s architectural dependencies and single points of failure.

## Understanding Your Architecture Dependencies

Understanding your infrastructure’s resilience requires more than reading architectural diagrams. It demands analysis of the actual dependency chains that determine your application’s availability. Most organizations discover that their “multi-cloud” contains hidden single points of failure that would have caused outages.

To evaluate your infrastructure’s true resilience, consider these critical questions:

- Who controls your domain’s nameservers?
- Does your provider have true DNS redundancy?
- Does your platform run on its own infrastructure or run over cloud providers?
- Are you using open standard runtimes?
- Are you using open standard APIs?

Most organizations discover that their infrastructure contains far more single points of failure than their architecture diagrams suggest. The cascade failures revealed how these hidden dependencies can bring down entire applications, even when the primary infrastructure appears healthy.

## Multi-Cloud Isn’t Always Resilient

The cloud industry has successfully built multi-cloud architectures as a solution to vendor lock-in and single points of failure. The reality is more complex and often counterproductive. Using AWS for compute, Google Cloud for data analytics, and Azure for AI services doesn’t create resilience—it creates complexity with multiple single points of failure.

True architectural resilience requires a fundamentally different approach. Instead of accumulating dependencies on multiple cloud providers, it means reducing dependencies on external providers entirely. This requires platforms that own their infrastructure end-to-end, from the physical servers in data centers to the software stack that runs your applications.

When platforms control their entire infrastructure stack, they can provide genuine redundancy and failover capabilities. They’re not constrained by the architectural decisions or operational practices of cloud providers. They can implement custom networking protocols, design specialized hardware configurations, and create software systems optimized for their specific use cases rather than generic cloud workloads.

The business implications extend beyond availability and reliability. Cloud providers charge significant markups over the underlying infrastructure costs, particularly for premium services like serverless functions and managed databases. When platforms own their infrastructure, they can provide these capabilities at dramatically lower costs while maintaining higher performance characteristics.

## The Open Standards Advantage in Practice

Modern web applications should be built on standards that provide genuine portability between platforms. This isn’t just about avoiding vendor lock-in—it’s about ensuring that your applications can evolve as the technology landscape changes.

WinterTC provides a perfect example of how open standards enable innovation without platform dependency. Applications built using WinterTC primitives can be deployed on any platform that supports the standard, from traditional cloud providers to modern web platforms.

Similarly, platforms that provide OpenAI-compatible APIs for AI inference enable applications to use any model that supports the standard interface. Your code doesn’t need to change when you switch between different AI providers or deploy on different infrastructure. The abstraction layer provided by the standard API ensures that infrastructure decisions remain separate from application logic.

Standard JavaScript runtimes offer another crucial advantage. When your functions use standard JavaScript APIs and npm packages, they can run on any platform that provides a compliant runtime environment. You’re not locked into proprietary function formats or vendor-specific APIs that require code rewrites for migration.

## What June 12 Validated About Infrastructure Ownership

This outage provided real-world validation of architectural principles that have been debated in engineering circles for years. When cloud providers experience control plane failures, every service that depends on their infrastructure inherits those failures. The cascade effects can reach far beyond the cloud provider’s direct customers, affecting millions of end users who never made a conscious decision to depend on the provider’s reliability.

Platforms with end-to-end infrastructure ownership demonstrated a fundamentally different failure profile. They experienced no outages because they weren’t part of anyone else’s dependency chain. Their infrastructure ownership extends from physical servers deployed in hundreds of data centers worldwide to direct relationships with Tier 1 network providers and extensive last-mile connectivity partnerships.

This infrastructure ownership enables capabilities that composite architectures struggle to match. Applications can run with zero cold starts because the infrastructure is “always on” rather than provisioned “on demand”. Performance becomes predictable because there are no external APIs or services that can introduce latency spikes. Costs become transparent because there are no cloud provider markups or surprise billing from usage spikes.

The decision to own infrastructure end-to-end seemed expensive and complex when cloud providers offered seemingly infinite resources with straightforward pricing models. The events of June 12 demonstrated that the complexity was always there—it was just hidden in dependency chains that users never fully understood until they failed.

## Understanding Your Path Forward

Whether you’re evaluating alternatives to cloud providers or looking to reduce infrastructure dependencies, the path forward requires an honest assessment of your current architecture and a clear understanding of your options.

Begin by mapping your actual dependencies, not just the ones documented in your architecture diagrams. Most applications depend on dozens of external services for everything from authentication to analytics. Each one represents a potential failure point that could affect your application’s availability.

Consider the true costs of your current architecture, including not just the monthly bills from cloud providers but the operational overhead of managing multiple vendor relationships, the engineering time spent on integration and troubleshooting, and the opportunity costs of vendor lock-in that prevents you from adopting better solutions as they become available.

Evaluate platforms that prioritize infrastructure independence and open standards. Deploy test applications to understand the performance characteristics, development experience, and operational requirements of alternative approaches. Many organizations discover that platforms with infrastructure ownership provide better performance at lower costs while reducing architectural complexity.

The next major cloud outage is inevitable. Control plane failures will cascade through dependent services. Applications will fail in ways that surprise their operators and frustrate their users. The question is whether you’ll be prepared with architecture that can survive these failures or whether you’ll be explaining downtime to users and stakeholders.

## Ready to Build Resilient Architecture?

Don’t wait for the next June 12 to expose your architecture’s vulnerabilities.

**Talk to our experts** to build applications that can withstand cloud provider outages. We’ll help you assess your current dependencies and design systems with genuine resilience.

[Schedule a consultation](https://azion.com/en/contact/) or [create your free Azion account](https://console.azion.com/signup) to start building infrastructure-independent applications today.

---

*What would happen to your applications during the next June 12? How many dependencies does your architecture really have? What would it take to achieve genuine infrastructure independence? These aren’t hypothetical questions—they are planning exercises for the outages that will certainly come.*
