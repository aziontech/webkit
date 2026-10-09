Edge computing is a key component for modernizing web applications and accelerating digital transformation. However, those who are not familiar with this technology often have doubts about how much it can contribute to businesses. Even managers who have small IT teams and budgets sometimes do not know if its implementation is financially viable.

Answering the first question: is it worth migrating to edge computing considering business needs and rules? The answer is yes. In the digital context, edge migration is essential to meet current and future demands, maintain competitive advantage, and accelerate innovation.

We are aware that wanting to do something just isn’t enough. But as we will see below, companies that [use edge computing reduce costs](/site/blog/cloud-computing-or-edge-computing-cost) and improve application performance. In addition, they can improve the developer experience (DX) by simplifying processes and providing the tools to build the best and most secure solutions.

These factors contribute to revenue generation in a variety of ways by enabling:

- unique [user experiences (UX)](https://www.azion.com/en/learning/cdn/edge-computing-evolution-of-cdn/) in terms of personalization and performance;
- building resilient, reliable, and always-on applications;
- intelligent decision-making and operational efficiency based on data analysis;
- agility to respond to constant changes in the market and customer needs.

Want to know how the benefits of edge computing translate into practice? Check out these five success stories that show how technology can be applied for many objectives and use cases.

## 1. Dafiti

Dafiti is a fashion e-commerce platform that aims to transform the way people buy clothes and accessories online.

With operations in Latin America (Argentina, Brazil, Chile, and Colombia), one of its biggest challenges is to offer a fashion ecosystem that provides great experiences to customers, regardless of their geolocation or cybersecurity context.

To achieve this, Dafiti has used edge computing to enhance personalization, compliance, and content delivery.

### Personalized User Experience

One of Dafiti’s main purposes is to combine art and science in its projects. Art is fashion itself, which Dafiti seeks to spread to people of all styles; while science is related to the use of technology. When you have such a diverse audience, it is essential to provide a personalized experience, and intelligence is the only means to achieve success.

A/B testing and [content targeting](https://www.azion.com/en/documentation/products/guides/content-targeting-integration/) are some of the major user personalization procedures, and executing them at the edge brings many advantages compared to traditional methods because the process takes place on servers close to the end device, providing low latency and more effective traffic control and routing.

In the Azion Marketplace you can find a range of free edge functions available to all customers, including [A/B Testing](https://www.azion.com/en/documentation/products/guides/ab-testing-marketplace/) and Content Targeting. With just a few clicks, Dafiti implemented them in Edge Functions to complement its tests efficiently and with a fast response to the user.

### Delivery of Static and Dynamic Content with High Performance

Building edge applications on the Azion platform resulted in a **page load that was 86% faster** than the legacy [CDN](https://www.azion.com/en/learning/cdn/edge-computing-evolution-of-cdn/) (Content Delivery Network) solution. The main reason for this is that, unlike a CDN, the edge delivers computational power instead of just storing and transferring cached content.

One of the other significant differences between edge computing and CDNs at this point is its ability to deliver dynamic content. This enables Dafiti to provide consumers with fully personalized sites that align with their user segmentation and personalization strategies.

Another determining factor for this speed increase has been the use of Azion’s Image Processor to **reduce the size of image files by an average of 76%** without a noticeable loss of quality in the photographs that fill the Dafiti pages.

### Compliance and Observability Optimization

After an implementation process that took only three days—without any incidents or interruptions—Dafiti set up firewall rules that cover APIs, container clusters, website, mobile application, and payment systems, components whose events can be analyzed and monitored on its platforms through Data Stream.

Such flexibility to develop access control via [Edge Firewall](https://www.azion.com/en/products/edge-firewall/) helped Dafiti comply with important requirements, such as [PCI DSS](https://www.azion.com/en/documentation/compliance/pci-dss-certification/), and increase protection of credit card data and customer credentials, making the Dafiti Group’s virtual stores even safer for shopping.

> “Having an edge computing partner like Azion is one of the most important points for proper offload and a better customer experience.” Georg Buske, Webstore Director at Dafiti

## 2. Contabilizei

Contabilizei is the largest accounting firm in Brazil and Latin America. One of its biggest challenges is delivering high performance and availability on its online platform to tens of thousands of users, especially during key dates in the accounting calendar.

Using Azion’s Edge Computing Platform, Contabilizei’s DevOps experts created caching functions and policies to improve the platform in important aspects such as performance, user experience, and developer experience.

### Integration of Deployment Mechanisms with Edge Cache

By integrating deployment mechanisms with [Edge Cache](https://www.azion.com/en/products/edge-cache/), [purges](https://www.azion.com/en/documentation/products/build/edge-application/real-time-purge/) (removal of cached items before the expiration date) are now performed specifically for objects that have changes in each new version of the software—without affecting other cached elements—, avoiding cold starts.

### Optimization in Preflight Requests Processing

Preflight requests check if the “Cross-Origin Resource Sharing (CORS) protocol is understood and a server is aware using specified method and headers”[1] through a handshake process, which authenticates the client and server. By default, this type of request generates thousands of hits per request until the completion of the process.

To reduce this impact, Contabilizei built a 27-line JavaScript code on Edge Functions. Now, the preflight handshake is executed at the edge, not in the cloud infrastructure, requiring three fewer instances in a front-end cluster to serve each user, making request processing faster and cheaper.

### Implementation of a Friendly “Temporarily Unavailable” Message

As internet users, we often run into error screens that leave us hanging without any expectation of return. For a platform used by tens of thousands of people, the user experience is an extremely delicate point.

After all, as many studies explain, bad experiences tend to be more memorable for people because “they involve more thought and are processed more completely than positive experiences”[2], which can make customers unhappy and even influence churn.

To ensure the best possible user experience and reduce the number of calls due to unavailability or maintenance, Contabilizei uses an edge function to redirect the user to a friendly and informative screen, making them aware that the service will return soon.

This way, the user doesn’t need to open a support ticket neither is left wondering if the problem is on their network.

#### Contextuality

As soon as the service is restored, the traffic is redirected to the platform with the user’s contextuality unaltered. This happens due to the cache in the front-end, which collects the necessary data ([cookies](https://www.azion.com/en/documentation/products/edge-application/edge-functions/javascript-examples/cookie-value/), [session](/site/blog/protect-your-application-from-session-theft-with-azion), among others) to maintain the context.

Why is this important? Let’s suppose a client was issuing an invoice through the platform when the unavailability occurred. Instead of losing all the work and time spent, they can resume the task exactly where they left off.

The set of cache configurations and optimizations of Azion’s Edge Application led Contabilizei to a performance gain of 73%—reducing the loading time from 29s to 8s,—and also a 96% reduction in infrastructure costs.

> *“I really like the depth of cache rules that I can apply at the edge. There are things that we would not be able to do using solutions from other vendors. In terms of performance, compliance to Contabilizei’s rules and delivery standards, we are very satisfied with Azion’s performance.”* *Marcelo Pacheco, DevOps Specialist at Contabilizei*

## 3. Omelete&CO

Omelete&CO is a large ecosystem focused on experiences and market intelligence specialized in young audiences, with a know-how of more than 20 years.

In addition to the Omelete portal, the largest geek site in Brazil, Omelete&CO owns several entertainment-related projects, including Comic Con Experience (CCXP), the largest pop culture festival in the world.

In 2020, the CCXP had its first 100% digital edition, CCXP Worlds, which was a tremendous success. There were over **250** simultaneous live streams, **30 millio**n streaming views, broadcast to **139** countries, **7 terabytes of traffic volume**, and an unprecedented success story with Azion’s Edge Computing Platform.

### Content delivery with Integrated Security

Streaming an online event like CCXP Worlds is a delicate mission; a successful attack could ruin the experience of millions of fans and damage the brand’s reputation.

To avoid such a landscape, Omelete decided to take content delivery to Azion’s edge computing platform, which is security-centric and compliant with strict international standards such as SOC 3.

### Use of Azion’s Globally Distributed Edge Network

Azion’s edge network is composed of edge locations distributed worldwide, which allowed Omelete to deliver billions of [requests](https://www.azion.com/en/blog/what-is-a-conditional-request/) that came from 193 countries and transmit high-definition videos for 150 hours.

In fact, the amount of requests delivered in CCXP 2020 was approximately 100 times higher than the average volume received by Omelete servers throughout the same year—and 1000 times higher in terms of data transferred.

One of the biggest benefits of our platform is its [serverless architecture](https://www.azion.com/en/learning/serverless/what-is-serverless/). With NoOps, it offers high scalability without Omelete&CO needing to provision, manage, and secure network resources, so their technology team can focus only on applications and business.

### 15 Times Faster User Experience

Edge applications contributed to Omelete&CO **delivering a** **15 times better user experience** with content delivery for CCXP Worlds, with over 10 TB of images loaded at the edge without affecting the origin infrastructure and the costs that demand could generate.

> *“The experience with Azion’s technical support was a pleasant surprise. Before, we had the vision of Azion as a service that works very well, but the speed in meeting requests, even outside business hours, and all the monitoring effort made during CCXP showed us how much of a partner the company is.”* *Jota Russo, Technical Lead at Omelete&CO*

## 4. FourBank

FourBank is a Banking as a Service (BaaS) company that offers a banking system for creating internet banking, back office, and other types of financial services. Because it is a technology provider in the financial area, the efforts focused on data protection and service availability must be doubled.

By migrating to the edge, FourBank was able to evolve its defense posture with resources and configurations that are not available in the largest cloud computing providers in the world.

### Mitigation of DDoS Attacks that Exploit APIs

One of the reasons that led FourBank to migrate its applications to edge computing was the recurrence of [DDoS attacks](/site/blog/how-azion-ddos-protection-mitigates-the-main-types-of-ddos-attacks), whose load increased within [APIs](https://www.azion.com/en/learning/api/what-is-api-security/). Mitigating these attacks requires modern network control solutions that allow the construction of flexible rules according to the business needs.

By implementing Azion’s Edge Firewall, the FourBank team created firewall rules that limit simultaneous access to their APIs and also filter them, so that traffic has to fit into the contexts predefined by FourBank; otherwise, it is blocked at the edge, closer to the potential attack source.

### Traffic management aligned with business needs

It does not make sense for FourBank’s business to receive traffic from countries where the company does not have operations and which are still susceptible to jeopardizing application security. In the Azion edge computing platform, it is possible to do this in a simplified way, configuring [Network Lists](https://www.azion.com/en/documentation/products/secure/edge-firewall/network-layer-protection/network-lists/) that automatically detect and block locations that may probably harbor attacks.

### Real-Time Security Event Monitoring

One of FourBank’s needs was to be able to visualize everything happening in its applications. By default, both edge applications and Azion’s WAF record all received events, which can be consulted in the platform’s interface itself or via APIs, including a [GraphicQL API for aggregated data](https://www.azion.com/pt-br/documentacao/devtools/graphql-api/visao-geral/).

> *“Azion’s team was essential in the implementation process and was always willing to make a call to solve our problems. Once, we noticed something wrong with the application, I called the Azion people and, in a few minutes call, engineers detected what was missing in the settings and everything was fixed.”* *Wellington Terrão, DevOps Engineer at FourBank*

## 5. GetNinjas

GetNinjas is a service contracting platform that operates in more than 3,000 cities in Brazil and has been expanding in Mexico.

With its web applications previously executed from an infrastructure installed in the United States, GetNinjas saw a significant increase in access volume and, to meet new demands—both from UX and DX—,the use of modern technology such as edge computing was essential.

### Ultra-low Latency Request Processing

The migration from its legacy infrastructure to an edge computing architecture allowed GetNinjas to improve its presence in Brazil, especially in regions with low connectivity, by optimizing protocols for dynamic content and network and transmission layers performed in [Azion’s Application Acceleration](https://www.azion.com/en/products/application-accelerator/).

Even with its infrastructure located in the United States, GetNinjas’ website loads quickly for all users in Brazil and Mexico and has excellent performance on Core Web Vitals metrics.

### Resilience to Handle Large Access Spikes

The scalability power of the edge network contributed to successful GetNinjas campaigns on television. In 2020, for example, when advertising on Brazil’s largest free-to-air TV station, the site received millions of simultaneous accesses over hours and remained available and reliable at all times.

During this access boom, GetNinjas delivered more than 90% of requests at the edge, which, in addition to performance and availability, brought significant infrastructure cost reduction and customer acquisition costs (CAC).

### Reliable and Secure A/B Testing

GetNinjas makes extensive use of A/B testing to optimize and personalize UX. However, the front-end team was unable to run tests involving significant design and UI changes due to a conflict between the backend and the multiple cache layers that make up the framework.

This situation forced GetNinja’s team to upload entirely new pages to production without A/B testing. Therefore, there was no way to know if the update would perform better compared to the legacy version, putting conversions and organic traffic at risk.

Azion’s platform allows storing more than one cache object based on a cookie. The developers started splitting the versions of the page displayed to the user at the edge, before the request reaches the backend. This ensures that the origin server knows exactly which version should be loaded.

This solution gave GetNinjas the freedom to test functionalities and significant design changes safely, without overwriting the legacy version—which may perform better—or the user encountering common front-end testing issues such as FOOC (Flash of Original Content).

### Extended Observability for A/B Testing and SEO

Through event data collected in real-time from GetNinjas’ edge applications via Data Stream, analysts measure the performance of their [A/B tests](https://www.azion.com/en/documentation/products/guides/ab-testing-marketplace/) from a range of [Data Sources](https://www.azion.com/pt-br/documentacao/produtos/observe/data-stream/#SelecionaroDataSource). Thus, the new version of a page can be optimized as many times as necessary in the testing phase until it goes into production.

The same applies to SEO strategies; when crossed with Google Analytics, event data from edge applications collected on [Data Stream](https://www.azion.com/en/products/data-stream/) gave rise to unique discoveries, such as a 403 error (Forbidden) that was affecting the indexing of a page on search engines and broken links.

> *“Our relationship with Azion is one of partnership. We are very satisfied with the work that has been done and we consider Azion to be a very important component of our platform. About 70% of the hit rate we have is served at the edge, which is a valuable scale factor for us, since most of our infrastructure is in the United States and the vast majority of our users are in Brazil.”* *Marcelo Pattacini Martins, CTO at GetNinjas*

As we’ve seen throughout this content, there are many ways to modernize web applications and make them increasingly compliant with business rules and needs.

From delivering content with superior performance compared to what traditional CDN networks have to offer and ultra-low latency to the ability to build code with integrated security, Azion’s edge computing platform simplifies and streamlines the way you create applications.

Check out our [list of success stories](https://www.azion.com/en/resource-hub/) to discover other cases that certainly apply to your business.

#### References

- [1] [Preflight requests (Mozilla)](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request) | [2] [Praise Is Fleeting, but Brickbats We Recall (New York Times)](https://www.nytimes.com/2012/03/24/your-money/why-people-remember-negative-events-more-than-positive-ones.html)
