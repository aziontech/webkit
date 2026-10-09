Since the beginning of the COVID-19 pandemic in 2020, we have faced a progressive increase in the types, size and aggressiveness of **DDoS attacks**. Considering its diversity of forms and its wide reach (extended, basically, to any company or entity that has an online presence), this post explains how **Azion DDoS Protection** protects against the main types of attacks to avoid major financial losses and damage to the image of your company.

Azion DDoS Protection is integrated into Azion’s **edge platform** to prevent and mitigate DDoS attacks from anywhere in the world 24 hours a day, seven days a week. With DDoS Protection, our customers have the best option for protecting their content and applications, as it detects malicious requests using advanced algorithms and modern routing techniques that run on Azion’s highly distributed network. As our network is connected to several mitigation centers around the world, we are able to protect our customers against large-scale attacks, whether at the network level or at the application level, reducing downtime without impacting the performance of your services.

Next, we demonstrate the main DDoS attack mitigation techniques present in the market today and why Azion’s DDoS Protection is the best solution for your company.

## Common Strategies For DDoS Mitigation

As digital security is a priority for any company that has an online presence, and each company has its own particularities and priorities when it comes to planning the security of its infrastructure, its network and its applications, there are several solutions for mitigating DDoS attacks. What differentiates these varied solutions for blocking and preventing attacks are, among other elements, the monitoring strategies and algorithms used, the routing techniques and even the physical equipment needed. Below, we list the options with the greatest presence in the current market, as well as their advantages and disadvantages.

### Carrier-Based Mitigation

This type of solution is commonly offered by **ISPs** (Internet Service Providers). This means that when you hire an ISP, you will likely have carrier-based mitigation included. This solution performs simple traffic monitoring that, when identifying a suspicious volume of requests, can refuse access to the client’s page or application.

However, while having protection built into your internet access service can be beneficial, provider-based mitigation has several limitations that cannot be ignored. One of them is the limited bandwidth that is normally available for this service. As such, since DDoS attacks are typically volumetric, if you are attacked by a botnet large enough to congest the traffic made available for mitigation by the provider, there will be a denial of service anyway. On the other hand, the equipment used for this mitigation is normally the most basic on the market, without the necessary resources to identify and block advanced and innovative attack strategies that constantly evolve. Finally, as providers are frequent targets for massive DDoS attacks, mitigation may be unavailable when you need it most.

### CDN-Based Mitigation

One of the great advantages of solutions based on **CDN** (Content Delivery Network) is the easy scalability and available bandwidth. As CDNs manage networks of servers distributed around the world, it is usually not a big challenge to absorb large volumes of malicious requests, keeping the client’s application or website available for legitimate access.

However, CDN-based DDoS solutions are typically restricted to volumetric attacks, and are not effective against the smarter, non-volumetric ones. In addition, as attack volumes are unpredictable, this can create an unnecessarily high and unplanned cost for the customer, who pays for the excess bandwidth used to keep their content available while mitigating an attack.

### DNS-Based Mitigation

As well as CDN-based solutions, those based on **DNS** (Domain Name Server) have high bandwidth availability, easily controlling attacks based on transport and network layers (**OSI** layers 3 and 4). However, by relying exclusively on a DNS-based solution, you also expose your application layer, which is not effectively protected by this type of protection. Furthermore, DNS servers are vulnerable to intelligent attacks that use a low volume of traffic, which can go unnoticed by the volumetric detection algorithms on which they are based. Finally, you also don’t have expert support in the event of a more complex attack that might require direct human intervention.

### Hosting Provider DDoS Mitigation

As DDoS protection becomes more and more essential, companies that offer web hosting services have increasingly offered this service within their functional packages. In this way, the customer has the advantage of acquiring the hosting and protection of their website in a single contract.

Despite this, different hosts opt for different mitigation options hired from third parties, which can be CDN-based, DNS-based or even provider-based, carrying with them the vulnerabilities already discussed on these solutions. In addition, if your page uses data or functions hosted by another company, these will not be protected by the protection purchased, since it only acts on the data hosted by that specific host. Another point of attention is the fact that the host’s bandwidth is shared by all of its clients, which can limit the volume of attacks you are able to absorb.

### In-House Mitigation

As we have shown, among the different strategies and techniques used to mitigate DDoS attacks, all have their points of attention that must be considered. Precisely for this reason, some companies and providers have adopted a strategy that has the great advantage of offering robust, reliable and stable protection: in-house mitigation. By acquiring specific hardware for local mitigation of DDoS attacks, which is now distributed by several companies around the world, you also acquire the possibility of complete control of the entire process of identification, analysis and blocking of this type of attack.

However, the cost of this type of solution is daunting, and it may take a few hundred thousand dollars to acquire the basic equipment. In addition, when transforming DDoS protection into a local activity, you will necessarily need to invest time and resources in training professionals capable of dealing with these attacks that, it is worth remembering, transform and innovate every day. Considering these elements, in-house protection can also bring complications that are not ideal for the dynamic and competitive environment that is a company’s online presence.

## How Does Azion DDoS Protection work?

In this scenario, the mitigation of attacks at the edge offered by Azion emerges with unquestionable advantages over the options currently available on the market. To begin with, before discussing in more detail the algorithms and techniques used by our DDoS Protection, it is important to highlight that the mitigation of any type of volumetric attack is intrinsic to the structure of our network. In this section, we’ll show you why.

### A Highly Redundant Backbone

As you can see [in this article](https://www.azion.com/en/learning/cdn/edge-computing-evolution-of-cdn/), one of the great advantages of an edge computing platform is its highly distributed backbone. This means that, unlike solutions offered in the cloud, our platform and processing are decentralized, with a network distributed in more than 100 edge locations worldwide.

For this reason, the very structure of our network makes it impossible to consolidate a DDoS attack. As the foundation of this type of attack is the concentration of large volumes of requests on a single server, a DDoS attack cannot be fully effective on Azion’s platform.

Think of it this way: when accessing an application or content available on Azion Platform, the user will be sent, through our intelligent routing, to an edge location that is geographically close and able to deliver this content with the best experience in regards to speed and quality of connection. When this edge location identifies a suspicious volume or behavior of requests, all traffic concentrated there immediately passes through our advanced mitigation process (described in more detail below, in the “Advanced **Packet Scrubbing** and Routing Techniques” section), which makes it possible for legitimate traffic to keep being served while malicious requests are automatically blocked. In addition, our intelligent routing system continues to work so that all legitimate requests are always directed to the edge location that can deliver the content with the best quality and the highest speed, without any service degradation caused by the ongoing attack.

In the illustration below, you can see a visual representation of how this process occurs:

<Frame src="https://www.azion.com/assets/content/blog/uploads/03-ddos-protection-blog-post-en.png" alt="The image shows how DDoS Protection separates legitimate traffic from malicious traffic." />

### Advanced Packet Scrubbing and Routing Techniques

In addition to offering an infrastructure that protects your content against DDoS attacks based on volumetry by default, Azion also invests in the most modern techniques of packet scrubbing and intelligent routing to ensure that our customers will not be affected by these attacks, whether they are targeted to the transport and network layers, whether they are aiming directly to the application layer. To identify an attack and maintain legitimate traffic, our DDoS Protection performs the following steps:

1. First, our network performs a border filtering that identifies suspicious IPs, known bots and hosts that may have been infected based on Access Control Lists;
2. Using the **DPI (Deep Packet Inspection)** technique and progressive **challenge-response** algorithms, a protocol verification is performed to ensure that all requests meet the standards established within our network;
3. If the requests have passed the first two stages of verification, they undergo a new, adaptive filtering, which combines a statistical analysis (to find unusual numbers of packets or high rates of traffic from zombie-clients) with anomaly verification (through auto-learning flows that verify protocols and networks of origin incoming data and compare it with legitimate traffic and suspicious traffic identified in the past). At this stage, a significant sample of received packets undergoes detailed analysis to see if they pose any threat to the application layer;
4. The fourth step also consists of filtering the application layer, verifying that the requests made correspond to the behavior normally expected by the application in question.
5. Then there’s also a content scan, which detects patterns to identify unusual behavior from incoming traffic.
6. At the end of all these procedures, a traffic rate limit is also applied, which monitors and adapts how the bandwidth will be used during the event of an attack.

With these six automatic and highly redundant procedures, DDoS Protection implements a defense-in-depth policy that, on the one hand, protects application operation and content delivery in all its instances, while also decreasing the number of false positives, preventing legitimate traffic from being blocked, which is common in several DDoS mitigation techniques and can also damage your company’s image and income.

## Access to DDoS Protection

When using Azion’s platform, you automatically benefit from our DDoS Protection at no additional cost. Thus, you get always-on mitigation that continuously monitors network flow to detect and block malicious traffic in real-time, with no impact on your applications.

Besides that, you also have advanced detection inspecting network flows, as well as monitoring each application layer for your resources delivered by Azion that use Azion’s WAF and Edge Firewall. This way, you protect yourself against attacks such as [HTTP floods, HTTP Slow Reads, DNS query floods, SYN/ACK Flood and many others](https://www.azion.com/en/learning/ddos/what-is-ddos-attack/), in addition to having complete visibility of application attacks through our **Real-Time Manager** or APIs to monitor the frequency and the volume of attacks.

## Protection, High Performance and Flexibility at the Edge

As you can see in this article, protection against DDoS attacks is critical to maintaining a good image for your company, as well as avoiding unnecessary loss of revenue — but Azion offers you much more than that.

Our high-performance platform provides all the infrastructure and expertise needed to create, secure, deliver and observe at the edge, with a very low latency network only made possible by delivering content as close to the customer as possible. With Azion, you have the freedom and support to build your applications faster using our extensive library of functions in **Edge Functions**; the security of protecting all layers of your systems with products like **Edge Firewall**, **WAF** and DDoS Protection; and the necessary insights offered by real-time observation through data collected and processed by **Data Stream**, **Edge Pulse** and **Real-Time Metrics**, for example. In addition, Azion guarantees 100% availability for your applications and services, backed by our SLA (Service Level Agreement).

## DDoS Protection Provides The Best Solution Against DDoS Attacks of All Kinds

In this article, we demonstrated the importance of being effectively protected against DDoS attacks, as well as the main techniques used to mitigate them. Azion uses state-of-the-art resources only available at the edge to perform advanced and fast packet scrubbing algorithms associated with intelligent routing techniques in order to offer its customers the highest security and reliability for their applications.

Would you like to learn a little more about our protection services? Read more about our [DDoS Protection](https://www.azion.com/en/documentation/products/secure/edge-firewall/ddos-protection/), [WAF](https://www.azion.com/en/documentation/products/secure/edge-firewall/web-application-firewall/) and [Edge Firewall](https://www.azion.com/pt-br/documentacao/produtos/secure/edge-firewall/), which keep your entire network safe from the latest and more advanced attacks (including those not yet created). In our success stories, you can see how our protection stack brought great benefits to major clients such as [Magalu](https://www.azion.com/en/success-case/magalu/) and [Dafiti](https://www.azion.com/en/success-case/dafiti/dafiti-azion-edge-firewall/). Finally, you can also talk to an expert to learn more about our products and understand why you should start using DDoS Protection today!
