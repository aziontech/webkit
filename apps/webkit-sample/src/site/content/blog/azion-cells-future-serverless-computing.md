At Azion, our mission is to make it easier for you to build and run applications at the Edge. We focus on speeding up your software development cycle and innovation, while delivering high-performance, secure and global-scale applications.

We believe that open standards are the future of computing. It must be simple and secure to run edge-native applications in any environment, and our architecture, software and products are designed to deliver it to you. Every time we make a choice, our aim is to make it easier to build and run edge-native applications in open standards, using any hardware (x86, ARM, etc.) on any infrastructure (on-premises, public or private clouds or Telco’s’ edge service), and in any language (JavaScript, Lua, C, C++, Go, Rust etc.), software-defined and 5G ready!

An important part of this work has led to what we call Azion Cells, a framework and runtime for [Turing-complete](https://en.wikipedia.org/wiki/Turing_completeness) languages for serverless applications, purposely built for edge-native and ultra-low latency applications and for analyzing data in real time. It is designed to run event-driven and user-built applications with zero Cold Start. It is resilient, low memory consumption and have advanced security, such as request isolation and protection against side-channel attacks. With Azion Cells, we can build origin-less applications that run entirely at the Edge, or functions that replace or add features to your origin application, as it can also act as a proxy.

Azion Cells is used in all of our Edge products and has enabled us to build high performance and ultra-low latency applications that are flexible and scalable. It provides huge gains in efficiency and innovation at a low cost and with fast time to market. Take a look at some of the main Azion Cells features that we are bringing to our products:

## Efficiency

- With Azion Cells you can implement a serverless computational model on servers controlled by you (software license) or by using our global server network (edge as a service). This makes it dramatically easier to develop, scale and migrate applications, including between cloud providers, without worrying about the low-level infrastructure.
- Low impact and low memory consumption, especially when compared to Containers and services such as AWS Lambda, Google Functions and Azure Functions, which gives you significant improvements in performance, flexibility and cost.

## High Performing and scalable

- It is written in Rust which provides a number of really interesting benefits ([see here](https://stackoverflow.blog/2020/01/20/what-is-rust-and-why-is-it-so-popular/). This has enabled us to create a fundamentally superior runtime, with the core and its dependencies compiled in native code, as well as a userland TCP stack.
- It is optimized for modern hardware (for example, multi-core and NVME), which enables the infrastructure to reach its true potential and carry out workloads that have a high throughput and ultra-low latency (for example, +200 Gbps per rack unit). When running on our infrastructure, Azion Cells makes use hardware chosen to the smallest detail to ensure it performs at an incomparable level and to an unbeatable degree of scale. From disk access, entirely NVME-based, to a 96-thread CPU.
- Azion Cells was created for those who believe that you can never have enough performance. The Cold Start time is zero, which makes it ideal to use in ultra-low latency applications, including AI, such as facial and object recognition, and NFV, such as carrier-grade NAT, vRAN and vEPC in Edge infrastructures, as well as web applications, static content and so on.
- When compared to the various solutions on the market - especially those that use Containers - its response time is less than the network latency.

## Open, flexible and powerful

- Azion Cells simplifies the way you build, run, scale and develop at the Edge using serverless and edge-native applications. It adopts and supports open standards such as IETF, ISO, IEC, ETSI, Open Caching, ECMA and [WebAssembly](https://webassembly.org/) in a way that is flexible and programmable and with a highly scalable software structure and runtime.
  - We have implemented the Top-Level Await feature in ECMAScript, which enables the use of [AWAIT calls without using Async](https://v8.dev/features/top-level-await), ending **Callback Hell!** once and for all! It is a useful advantage over solutions that use Node.js (like Google Functions) and are based on CommonJS, ExpressJS and callbacks.
  - We keep JavaScript code as compatible as possible with code supported by browsers, as well as ECMA, to ensure it remains compatible with Web APIs. Therefore, you can use “fetch” as if the application was developed for the browser.
  - We designed wrappers that can integrate Azion Cells into any serverless framework, which enables you to use code written in different services and formats (for example, AWS Lambda, Cloudflare Workers, OpenWhisk, etc) in Azion Cells and, of course, in Azion Edge Functions, which helps to put an end to vendor lock-in.
  - We enable the use of Azion or third-party libraries implemented in JavaScript and WebAssembly for building or extending client applications.
  - We allow third party modules to be dynamically loaded in Azion Cells.
  - We made it easier for you to use Azion Cells code in popular runtimes, such as Node.Js, as well as other services similar to Azion, so that you do not become dependent on us.
  - We have adopted frameworks such as Terraform and Serverless.com so that you can easily abstract everything you need to use your serverless applications at Azion.
- It is incredibly flexible. It supports multiple architectures (x86, arm, etc) and is purposefully built to work on any type of device, including your workstation, minicomputers like Raspberry Pi or NVidia Jetson, SD-WAN routers or network equipment, VMs and Containers (including cloud providers) and, of course, bare metal servers.
- It is easy to support and manage in real time and can be used with zero-touch using the control panel or API via Azion Edge Orchestrator.

## Secure

- It keeps each function isolated using [V8](https://v8.dev/) Isolate, a high performance, open source JavaScript and WebAssembly interpreter, written in C ++.
- It creates a *sandbox* to run the Edge Functions in, replacing cloud-native solutions such as VMs and Containers.
- It protects against side-channel attacks and, when used within Azion’s infrastructure, it works in conjunction with other Azion security tools, such as Edge Firewall to protect the network layers 3 to 7.
