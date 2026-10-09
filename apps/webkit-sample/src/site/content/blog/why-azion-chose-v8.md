One of the key advantages of serverless is that much of the complexity of development is abstracted away, enabling developers to focus on what matters most: crafting the best possible functionality and user experience. However, from time to time, we at Azion like to share with our readers some of the techniques we use under the hood to deliver the best possible performance, security, cost-efficiency, and resource use. Foremost among these tools is Google’s V8 Engine. The V8 Engine is embedded in our core technology, Azion Cells, and used under the hood of our new serverless computing product, Edge Functions, which is now available with JavaScript support.

This post will explain what V8 is, how it works, the features that enable its speed, security, and efficiency, and how V8 enables Azion’s Edge Functions to bring serverless computing to the edge of the network.

## What is the V8 JavaScript Engine?

V8 is Google’s open-source engine for JavaScript and WebAssembly. According to the V8 [specification](https://v8.dev/docs) “V8 compiles and executes JavaScript source code, handles memory allocation for objects, and garbage collects objects it no longer needs.” What this means is that V8 translates high-level JavaScript code into low-level machine code, then executes that code. Part of compiling and executing code involves other tasks like handling the call stack, managing the memory heap, caching and garbage collection, providing data types, objects and the event loop. The orchestration of these internal runtime I/O activities ensures memory and code run efficiently.

### How Does V8 Work?

The V8 Engine follows several steps to compile and execute JavaScript code. Source code is downloaded from the network, cache, or service workers. It is then parsed into a representation of its component parts called an Abstract Syntax Tree (AST) and fed into the interpreter, which both generates and optimizes bytecode. Bytecode is lower level than human-friendly languages like JavaScript, making it executable by the V8 Engine, but not quite as low-level (or as fast) as machine code.

To execute code with both speed and precision, the V8 Engine must determine whether bytecode should be run as is or further optimized into machine code. This evaluation is performed by the profiler, which checks bytecode to see if it can be further optimized into machine code by the compiler. The compiler performs optimizations on the fly, making assumptions based on available profiling data. If any assumptions prove to be incorrect, code is deoptimized into bytecode before being executed. A visual representation of this process is included below.

<Frame src="https://www.azion.com/assets/content/blog/uploads/desktop-v8-eng-784px.png" alt="" />

### What Makes V8 Fast, Efficient, and Secure?

Four features that contribute to V8’s performance, efficiency, and security are:

1. efficient garbage collection;
2. use of hidden classes;
3. inline caching; and
4. fine-grained sandboxing.

### Efficient Garbage Collection

Garbage collection is a process that reclaims memory by eliminating objects that are no longer needed. Although this optimizes memory use, it can slow down processing, as processes must pause while garbage collection is taking place. However, as [explained](https://chromium.googlesource.com/external/github.com/v8/v8.wiki/+/60dc23b22b18adc6a8902bd9693e386a3748040a/Design-Elements.md#efficient-garbage-collection) on the Chromium Project’s GitHub page, V8’s garbage collector “minimizes the impact of stopping the application” by processing “only part of the object heap in most garbage collection cycles.” In addition, the garbage collector “always knows where all objects and pointers are in memory. This avoids falsely identifying objects as pointers which can result in memory leaks.” The result is fast object allocation, short garbage collection pauses, and no memory fragmentation.

### Hidden Classes and Inline Caching

Hidden classes and inline caching add to V8’s speed and resource efficiency. Because JavaScript is a dynamic language, it is difficult to understand how much memory and space to allocate objects, since their properties can be changed during execution time. As a result, most JavaScript engines use dictionary-like storage for object properties, with each property access requiring dynamic look-up to resolve the property’s location. However, this process is both slow and memory-intensive. V8 makes property access much more efficient by dynamically creating hidden classes of objects that can be reused. This not only speeds up property access by eliminating the need for dictionary lookups, but enables inline caching.

Inline caching, as noted in a [2016 GitHub post](https://github.com/sq/JSIL/wiki/Optimizing-dynamic-JavaScript-with-inline-caches), inline caching “takes an operation that typically requires a bunch of important checks and generates specialized code for specific, known scenarios, where the specialized code doesn’t contain those checks.” As a result, V8 is able to generate machine code quickly and efficiently.

### Sandboxing

Perhaps the most important feature of V8, as it is used in Edge Function, is its use of sandboxing. Sandboxing is a security mechanism that isolates programs into different environments to avoid data leakage and mitigate the impact of systems failures and software vulnerabilities. The V8 embedder’s API includes a class called isolates, which each represent a single JavaScript execution environment. By using V8 as our JavaScript engine for Edge Functions, Azion is able to keep each function secure and isolated from each other without running each function in a separate VM or container, thus dramatically reducing resource use and—as a result—reducing the cost and time needed to run each function.

## How Does V8 Enable Azion’s Edge Functions?

### How Does Serverless Computing Work?

Edge Functions is a product that lets developers easily build and run event-driven serverless functions at the edge of the network. When functions are requested, they execute on the Edge Node closest to end users and scale automatically, without the need to provision or manage resources. As a result, users are able to pay only for the resources used and dramatically reduce the time spent on configuration and rote management tasks.

However, combining the ease of use and cost efficiency of serverless with the speed of edge computing presents many challenges behind the scenes. Serverless computing makes automatic scaling possible by atomizing applications into discrete tasks that are small, independent, and stateless. Because state is not preserved between invocations, functions can be run when they are needed and stop running during periods of inactivity. But this process of stopping and starting takes time and computing resources, particularly when functions are run inside of containers, as is the case with AWS Lambda and cloud providers’ serverless solutions.

### How Does V8 Enhance Serverless Computing?

By choosing V8 as Edge Functions’ JavaScript engine, Azion is able to run functions in a multitenant environment, resulting in more speed and resource efficiency than AWS Lambda and traditional serverless computing products. Multitenancy significantly reduces resource consumption in two ways. First, with no need to partition resources like CPU, disk I/O, OS, and memory into separate containers, there is far less overhead needed to run each function. Furthermore, each function does not require its own separate runtime; as a result, runtimes do not need to be stopped and started between each invocation of a function, necessitating far less computing power.

Efficient resource use is not only good for the planet, it’s good for businesses who choose to build with Azion. Eliminating the need to run functions in containers means less configuration, since container-based solutions require developers to allocate a certain amount of memory to each function ahead of time. In addition, less computing power means less operational costs.

Finally, and most crucially for edge computing, running functions in a multitenant environment results in lower latency. Functions that are run in containers are spun down during periods of inactivity; when a function is called again, its container must be spun back up, resulting in a half-second delay known as a cold start. By using V8 to isolate each function, rather than containers, Azion eliminates cold starts, thus reducing latency and making performance more reliable and predictable.

Running thousands of containers in distributed edge locations all over the world would be cost-prohibitive; that’s why cloud solutions like AWS Lambda are delivered from centralized data centers. Because multitenancy enables much more efficient resource use, Azion is able to run event-driven functions in distributed edge locations all over the world, executing them when and where they’re needed at the PoP closest to the end user. In addition, less time transmitting data back and forth means less time spent executing each function, resulting in lower costs for compute time each time a function is called.

## Advantages of Edge Functions

With Edge Functions, developers can build and run edge-native applications that combine the power of edge computing with the benefits of serverless. Our choice to use V8 as the JavaScript engine for Edge Functions means that businesses reap the advantages of the best possible:

- security;
- speed;
- resource efficiency;
- cost efficiency; and
- ease of use.

As a result, Edge Functions is an ideal solution for a variety of use cases, such as:

- easily modernizing monolithic applications;
- building ultra-low latency applications;
- event-driven programming;
- reducing costs;
- adding third-party functionality to applications; and
- increasing agility and expediting time to market.

Edge Functions is now available with JavaScript support to all Azion users. To read more about Edge Functions, visit our [product page](https://www.azion.com/en/products/edge-functions/#overview), or create a [free account](https://console.azion.com/signup/) by registering as a new Azion user today.
