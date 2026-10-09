In a previous post, we announced Early Access for Edge Functions, a new product for building and running event-driven serverless functions. After three months of Early Access, with dozens of use cases already implemented, the beta release of Edge Functions is now available to all our customers with JavaScript support.

Edge Functions lets you build edge-native applications or add functionality to your origin applications with event-driven functions. Using the JavaScript Runtime API, you can write custom request and response rules or choose from prebuilt functions such as A/B testing, secure tokens, or massive redirect. When a function is triggered, it executes in milliseconds on the edge node closest to its end user. Edge Functions run on our global edge network and scale automatically without the need to manage or provision resources. Instead, you pay only when your code runs, eliminating upfront costs and avoiding wasted resources from over-provisioned servers.

With Edge Functions, customers can:

- Build ultra-low latency applications
- Redirect traffic from origin servers
- Break up monolithic legacy applications
- Quickly release new features
- Add third party functionality to applications
- Personalize content delivery

## Overcoming the challenges of serverless

Despite the simplicity and cost-effectiveness of serverless functions, they are not without their challenges, from the unpredictable performance and high latency of container-based solutions to issues with security, monitoring, and vendor lock-in.

At Azion, we’ve worked hard to develop a solution that provides the benefits of serverless while still delivering on:

- **Performance**: Unlike AWS Lambda and other solutions that run in containers, Edge Functions has zero cold starts, ensuring consistent and low-latency performance.
- **Security**: Azion uses V8 Isolate to create a secure sandbox for each function, ensuring that each function is isolated while running in a multitenant environment.
- **Monitoring**: Access real-time information about usage and performance through Real Time Metrics or set up logging through the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
- **Portability**: Edge Functions are open and extensible to avoid vendor lock-in and are written in JavaScript, the most popular programming language in the world.

## Benefits

Edge Functions is built using [Azion Cells](https://www.azion.com/en/blog/the-next-generation-in-serverless-azion-cells/), our core technology designed for low-memory consumption, reliability, and speed. Azion Cells delivers superior speed by executing JavaScript without the need to spin up a node.js process. It is also written in Rust, a programming language that safeguards against memory bugs and is optimized for speed and resource use. And because it is multi-tenant and runs on top of V8, it minimizes resource use and does not require developers to specify ahead of time how much memory to allocate functions. As a result, Edge Functions is faster, more cost-effective, uses less resources than AWS Lambda and other cloud-based solutions.

## Capabilities

In addition to its other features and benefits, Edge Functions includes a number of capabilities designed to make them as easy to use and flexible as possible:

- **ECMAScript**: We implemented the JavaScript standard by ECMA, which ensures interoperability across different platforms.
- **Promises with Async/Await:** [Promises](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises) simplify the sequencing of asynchronous operations, while [async/await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await) make asynchronous code easier to read and write.
- **Fetch API:** provides a generic definition of Request and Response objects so they can be reused whenever and wherever they’re needed in the future. We implemented the Fetch API “as is” with MDN standards.

## Getting started with Edge Functions

The beta release of Edge Functions is now available to all clients. At this time, we recommend running Edge Functions with non-critical workloads. Visit our [product page](https://www.azion.com/en/products/edge-functions/) to contact sales or create a free account.
