Serverless computing has changed how developers build and deploy applications, prioritizing scalability and ease of use. However, the ever-increasing demand for faster performance, robust security, and optimized resource utilization calls for innovative approaches to runtime environments. These environments must handle workloads with precision and ensure seamless integration with the requirements of edge computing.

By combining [Rust’s](https://www.rust-lang.org/) safety features with the versatility of the [V8 engine](http://v8.dev/), modern runtime architectures are creating efficient and secure execution environments suitable for edge computing.

## Core runtime environment

The core runtime environment serves as the backbone of the serverless platform, managing code execution within secure, contained contexts. The V8 engine’s Isolate feature creates independent instances, each providing a separate environment for executing JavaScript code. Each instance offers a sandboxed context with its own global variables and functions. This design ensures that functions run in strictly separated environments, preventing unintended interactions between different executions.

## V8 engine integration

V8 engine integration in Rust-based serverless runtimes enhances performance and flexibility. Google’s V8 engine employs just-in-time (JIT) compilation to transform JavaScript into optimized machine code, achieving native-like execution speeds. Through Rust bindings like Rusty V8, developers can execute JavaScript within Rust environments, enabling custom runtimes that combine both technologies’ strengths for efficient, scalable serverless platforms.

## Why choose Rust for runtime development

Rust is the ideal choice for building a modern runtime environment due to its combination of safety and performance. Its design principles and strict compiler enforcement enable developers to create runtime environments that remain secure, fast, and reliable at scale. These foundational characteristics make Rust uniquely suited for runtime development:

- Memory safety guarantees without runtime overhead.
- Zero-cost abstractions for optimal performance.
- Predictable performance characteristics.
- Thread safety by design.
- Compile-time error checking.

## Memory management

The runtime leverages Rust’s ownership model for enhanced memory efficiency in its core components. While Rust ensures single ownership and prevents data races in the native code, the V8 JavaScript runtime employs its proven garbage collection system for managing JavaScript objects. A well-structured interaction between Rust and V8 combines the best of both worlds: Rust’s memory safety guarantees with V8’s memory management.

The combination of Rust’s compile-time checks and V8’s garbage collection system delivers robust and efficient memory management. When properly implemented, the Rust-V8 interface provides optimal memory handling in production environments, offering significant advantages over traditional approaches.

## Security layer

The security layer is crucial in maintaining the integrity and safety of the serverless environment. It employs several mechanisms to ensure that code execution remains secure and isolated:

- **Process-level isolation through V8 isolates**: V8 isolates provide lightweight isolation by running code in separate instances, enabling rapid context switching and efficient handling of concurrent functions.
- **Memory space separation between executions**: each V8 isolate maintains its own memory space, preventing functions from accessing each other’s memory and maintaining data privacy in multi-tenant environments.

By integrating these features, the runtime architecture balances performance and security, providing a solid foundation for [executing serverless functions at the edge](https://www.azion.com/en/documentation/architectures/edge-application/serverless-applications/).

## Performance benefits

The performance improvements are striking when comparing traditional serverless platforms to modern edge runtimes. These advancements stem from architectural innovations prioritizing lightweight execution and resource efficiency. The table below highlights key metrics showcasing the differences between traditional serverless solutions and edge runtimes built with Rust and V8. Each metric reflects improvements in speed, memory consumption, and operational efficiency, which are critical for high-performance applications at scale.

| Metric | Traditional serverless | Modern edge runtime |
|---|---|---|
| Cold start | 100ms - 1+s | ~5-20ms |
| Memory usage | 128MB+ | ~10MB |
| Initialization | Container spin-up | Sandbox activation |

Edge runtime’s superior performance stems from V8 isolates, which separate just the runtime context instead of entire containers, enabling quick startup times and high performance. This architecture, combined with Rust’s efficiency, delivers consistently lower latency and better resource utilization than traditional serverless approaches.

## Why not Node.js

By using v8 and Rust, it’s possible to address some of the inherent flaws in Node.js since its inception. Ryan Dahl, the original creator of Node.js, [has discussed these issues extensively](https://www.youtube.com/watch?v=M3BM9TB-8yA), citing module management as one of its design flaws. However, the most prominent drawback of Node.js is its lack of built-in support for multi-tenancy, which can only be achieved through containerization, leading to cold starts. Additionally, Node.js was built with C++, a language that lacks memory safety and is generally less stable than Rust. You get a more stable and secure application by building a solution with Rust and V8 isolates.

Multi-tenancy is essential for serverless computing because it allows multiple users or functions to share the same infrastructure efficiently, reducing costs and resource waste. Since Node.js wasn’t designed with multi-tenancy in mind, each function execution requires isolation to prevent conflicts or security risks between different workloads. Containerization provides this isolation by encapsulating each function in a separate environment with its own dependencies and runtime. While this approach effectively enforces multi-tenancy, it comes with a trade-off: the overhead of initializing and running containers contributes to slow startup times, commonly known as cold starts.

The process of containerization involves multiple steps that accumulate significant latency. First, the container runtime must pull the required image, which may include an entire operating system, libraries, and dependencies. Then, the container must be instantiated, requiring resource allocation, filesystem setup, and sometimes even network configuration. Finally, the runtime loads the application code and executes it. These sequential steps introduce unavoidable delays.

In contrast, V8 isolates offer a much lighter approach. Instead of spinning up separate containers, V8 isolates create lightweight execution contexts within the same process, providing rapid function execution without the need for system-level virtualization. This drastically reduces cold start time, making V8-based solutions ideal for high-performance serverless environments.

## Real-world impact

[Azion Cells](https://www.azion.com/en/documentation/runtime/overview/) is a runtime that demonstrates the benefits of modern edge runtime environments built with Rust. Unlike AWS Lambda’s centralized container-based approach, Azion Cells eliminates container initialization overhead, significantly reducing cold starts, memory consumption, and costs. [Running in the best edge location to the user](https://www.azion.com/pt-br/live-map/) and executing functions from NVMe storage ensures minimal latency for modern applications.

### Key features of Azion’s runtime architecture

- Secure multi-tenant isolation: Azion Cells isolate functions in sandboxed environments, ensuring secure execution without the overhead of full containers. This approach enhances both performance and security, making it ideal for multi-tenant applications.
- Rapid startup times: [edge functions](https://www.azion.com/en/products/edge-functions/) execute significantly faster due to their lightweight runtime architecture. This effectively minimizes cold starts and ensures reliable performance even during sudden traffic surges.
- Efficient resource utilization: by leveraging Rust’s memory safety and low-overhead abstractions, Azion optimizes resource use, reducing costs and improving scalability.
- Latency reduction: Azion Cells operate directly at the [network’s edge](https://www.azion.com/en/products/our-network/), which means processing the request at the best available edge location closer to the end user.

This approach challenges the traditional serverless model, making edge computing a more viable and cost-effective solution for modern applications. By combining the efficiency of Rust and the native-like execution speeds of V8 integration, edge computing can achieve the performance and scalability required for modern serverless applications. To simplify the adoption process, Azion created a [bundler](https://www.azion.com/en/documentation/products/devtools/azion-edge-runtime/frameworks-compatibility/) that automates [polyfills](/site/blog/polyfills-for-edge-compatibility).
