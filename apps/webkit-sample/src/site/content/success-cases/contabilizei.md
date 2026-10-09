## Challenge

Contabilizei has democratized accounting for self-employed people and small businesses across Brazil by offering easy-to-use and bureaucracy-free services, available online on its digital accounting platform at prices well below those charged by traditional offices.

In order to continue transforming the way companies engage with accounting services, Contabilizei has the challenge of ensuring high availability for its platform, especially on important accounting calendar dates, when requests increase significantly.

At the same time, Contabilizei sustains a culture of innovation that demands the use of modern technologies, capable of ensuring high levels of performance and security in content delivery as well as helping to reduce infrastructure costs.

## Solution

In order to achieve the essential levels of availability and latency to deliver the best user experience, infrastructure experts at Contabilizei moved their content delivery from the front end to Azion’s distributed infrastructure, which enables:

- integrating all features available on Azion Platform with Applications, such as caching, serverless functions and security;
- setting up advanced caching rules and customizable serverless functions both on the platform and on the Contabilizei website, reducing front end load and delivery latency; and
- increasing application availability and performance by delivering content across more than 100 Azion Locations.

By enabling advanced policies in Cache, infrastructure experts at Contabilizei have several options for rules and filtering. “This enabled all the resource tools that we could apply and everything worked wonderfully”, says Marcelo Pacheco, DevOps Specialist at Contabilizei.

“To reach this level of setup, we integrate with our deployment mechanisms so that objects that have changed with the new version of the software are specifically purged, preventing cache from cooling down”, adds Marcelo.

Through **Functions**, Contabilizei is also able to optimize the delivery of requests at the Edge in order to save money and infrastructure resources, while improving application loading time and, consequently, the user experience.

## Results and Impacts

Contabilizei’s architects took advantage of our platform’s facilities to define Request and Response rule sets according to their performance and security needs through Azion’s Rules Engine. Since then, 98% of requests to Contabilizei’s applications have been processed and answered directly in the distributed infrastructure.

With the use of Cache, data transferred and bandwidth usage were minimized by more than 90%, which allowed the reduction of infrastructure costs by 96% and the reduction of the accounting platform’s loading time from 29s to 8s — an 73% gain —, taking Contabilizei to an even higher level of architectural maturity with distributed infrastructure.

In terms of operational efficiency, the features of Azion’s platform allow the Contabilizei team to perform more complex tasks via API, such as creating a JavaScript function to deliver preflight requests, which generate thousands of hits in a row per request.

Before creating preflight rules in the distributed layer, Contabilizei needed to keep several instances running in the front-end cluster to serve each user. With the preflight handshake done 100% at the edge, three fewer instances are needed in a cluster with high traffic volume, as it has considerably reduced the load on the origin infrastructure and also the costs with its cloud provider.

> *“I really like the depth of cache rules that I can apply at the edge. There are things that we would not be able to do using solutions from other vendors. In terms of performance, compliance to Contabilizei’s rules and delivery standards, we are very satisfied with Azion’s performance.”*
>
> Marcelo Pacheco, DevOps Specialist at Contabilizei

> *“We at Contabilizei were able to establish a very good partnership, since we can call Azion whenever necessary, quickly, by contacting the support team directly.”*
>
> Fabrício Santos, DevSecOps Manager at Contabilizei

## About Contabilizei

Democratize, simplify, and revolutionize accounting for micro and small companies; this is the purpose that Contabilizei has been pursuing since 2013, currently having hundreds of specialist professionals working for tens of thousands of customers who access the service through a digital, secure and easy-to-use platform. With monthly plans that help many companies save money on accounting services, Contabilizei changed the industry in Brazil, which was characterized by high costs, offering small businesses the possibility to do their accounting online, with precision and assistance of professionals working remotely. In addition to making companies’ accounting life easier, the 1st online accounting office in Brazil is taking another important step for the market: advising entrepreneurs to make the best decisions for their company’s financial life. Innovation and simplification working side by side towards the success of entrepreneurship in Brazil.
