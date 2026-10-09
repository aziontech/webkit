## What is WebAssembly?

**WebAssembly** (also known as **WASM**) is an assembly-like language that allows code written in **compiled languages**—such as C, C++, Go, Rust, and many others—to run at near-native speed on the Web. WebAssembly provides some key features for web development:

- It’s fast and efficient, since it’s designed to be decoded and run in binary format;
- It’s secure, as it runs in sandboxes;
- It’s open and debuggable, since it’s available in text format;
- It’s part of the **Open Web Platform**.[1]

Historically, **JavaScript** has been the language of choice for standard web development. However, it’s insufficient to implement newer compute-intensive use cases, such as AR/VR and 3D gaming. WebAssembly is a perfect solution to enable these use cases to run on the Web. It’s important to note that WASM is not a replacement for JavaScript, but a complement to it. Developers can now innovate faster by writing sophisticated applications that can take advantage of both languages’ strong points, all without sacrificing speed and security.

## Modernize Your Applications Using WebAssembly

Today’s **hyper-connected economy** demands superior digital experiences and faster innovation. Running applications on a modern, distributed edge computing platform is a perfect path to realize that vision. However, most sophisticated applications are written in compiled languages to run on legacy infrastructures like the cloud or on-prem. These applications can’t run on the edge, which typically supports interpreted languages.

So the question developers face is: how can they quickly [modernize legacy applications](https://www.azion.com/en/blog/app-modernization) to run on edge computing platforms?

One option is to rewrite all applications in JavaScript. But this approach is risky, since it will incur significant resource costs in terms of time, money, and developer productivity. Further, as noted above, it may not even be possible to write some of these applications in JavaScript without sacrificing speed and security.

WebAssembly provides a much better, simpler, and faster alternative to application modernization. With WASM, existing code only needs to be recompiled for the edge without any need to rewrite code in a new, unfamiliar language. This modernization process can be further accelerated by deploying these applications on the high-performance and secure NoOps [Azion Web Platform](https://www.azion.com/en/blog/the-benefits-of-edge-platform-in-practice-retail).

## How to Use WebAssembly on the Azion Platform

Let’s use a practical example to demonstrate how easily a legacy application can be modernized using WASM on the Azion Web Platform.

Image transformation is a critical component of e-commerce applications. It requires serious processing power to deliver proper quality images that preserve user experience while simultaneously improving performance and reducing bandwidth costs.

Consider an image resizing code that was written in C to run on legacy infrastructures like a data center. This code, which was designed to run in a few locations, will invariably face performance and scalability issues. To solve those problems, you need to run the code on a hyper-distributed edge platform, where the images get processed closer to the user. But instead of rewriting that code in JavaScript, which could take months, you can use WASM to modernize this code in minutes so that it can run at the edge.

To run the example code on the Azion Web Platform, you first need to compile your original code into WASM format and then convert the obtained code into bytes. For this purpose, you can use a Shell script like this:

od -An -v -t uC <YOUR_WASM_CODE>.wasm   | sed -e “s/^[[:blank:]]//g;s/[[:blank:]]$//g”   -e “s/[[:blank:]][[:blank:]]*/\n/g”   | tr ‘\n’ ’,’   | sed -e “s/,*$//g” > <BYTES_RESULT>.txt

This step generates a byte code output that looks like this:

<Frame src="https://www.azion.com/assets/content/blog/uploads/bytes.png" alt="" />

The WASM code can now be directly invoked from an edge function, as shown below (you can follow the detailed instructions in our [documentation](https://www.azion.com/en/documentation/products/build/edge-application/edge-functions)).

<Frame src="https://www.azion.com/assets/content/blog/uploads/functions.png" alt="" />

The edge function can now be instantiated and executed at every edge location on the Azion platform. And that’s it! In just a few minutes, you’ve brought your complete application from the centralized data center to the Azion edge, without compromising speed while simultaneously improving your application’s scalability, availability, and security.

## Moving to the Edge Has Never Been Easier

In this blog post, we demonstrated how adopting WebAssembly can transform the way you build and run your applications faster and more effectively at the edge. But that’s just a small taste of what you can do with WASM on the Azion Web Platform.

You can keep learning about all WASM possibilities for developing edge functions by checking our [documentation](https://www.azion.com/en/documentation/use-cases/webassembly-on-azion-platform). You can also [sign up for free](https://console.azion.com/signup/) to test these and all the other features we offer to power your business and help you build future-proof serverless applications.

All new accounts include:

- Full access to all products and features
- Deploying your first edge application, which takes less than five seconds
- Free onboarding session

And if you still have any questions, don’t hesitate to [talk to our experts](https://www.azion.com/en/contact/). And be sure to follow us on [LinkedIn](https://www.linkedin.com/company/aziontech/mycompany/), [Instagram](https://www.instagram.com/aziontech/), and [YouTube](https://www.youtube.com/aziontech) for more insights into edge computing and our products.

#### References

[1] [WebAssembly official website](https://webassembly.org/)
