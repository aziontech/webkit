## Challenge

EXAME is among the three biggest journalistic websites in Brazil, according to data from IVC, an organization that certifies audience data from print and online media in the country. However, even used to a high volume of simultaneous accesses on their webpages, in 2022 EXAME faced one of the biggest challenges in its digital history: to carry out its first complete and real-time coverage of the vote counting for the state and national elections.

This project’s complexity demanded offering the best digital experience possible to millions of readers, distributed through the 27 federative units in Brazil on the most important day for our democracy. All of this with real-time information, reliable, highly detailed instant updates, and high-quality images and content—characteristics upon which the reputation of the EXAME brand was built.

A project of this magnitude is only possible with sophisticated technologies that are becoming increasingly available and accessible to media and communication companies and that allow their IT departments to meet essential requirements for success, including

- Delivering high-definition video streams without delay (low latency) to millions of viewers all over Brazil.
- Ensuring the website’s availability at every moment, especially during the vote counting, with instant updates.
- Supplying the readers with a high-performance website, aiming for the most significant viewer retention percentage possible, regardless of where and from which device EXAME is accessed.

## Solution

Offering the best user experience is crucial for the success of an ambitious project like the coverage of presidential elections. After all, it prevents readers from becoming frustrated with long loading times or loading failures, which would usually lead to them abandoning the website and a drop in revenue.

For a better experience, EXAME’s IT team had the task of preparing their infrastructure for an unheard-of volume of hits, and the first step was to migrate the applications to Azion.

Azion’s Web Platform puts computational power closer to the user, enabling data transfer and response to requests in a distributed way, meeting EXAME’s needs by making it possible to

- Deliver content with high performance in Core Web Vitals;
- Have high availability when facing complex scenarios, like increased traffic spikes and cybersecurity issues;
- Build reliable applications in a fast and simplified way.

The CTO Izabela Anholett’s team included Head of IT Infrastructure Célio Rodrigues, one of the project leaders. Several edge-native Azion solutions, such as Applications and Firewall, were implemented in a few weeks. These enable everything from cache settings to the protection of the network and application layers, essential items for achieving coverage.

As soon as the first Applications were built, EXAME’s team ran load tests using a Tribunal Superior Eleitoral (TSE, Superior Electoral Court) simulator, with data transfers up to 10 times what EXAME was used to get, a surprisingly positive result. “We carried out the first load tests with the TSE simulator, configuring a data transfer 10 times greater than what we usually receive, and the results were positively surprising”, explains Rodrigues.

EXAME also used Azion to display the candidate picture the TSE provides. According to Célio Rodrigues, bringing these and other critical elements to Azion was the best solution, as it allowed the team to

- Optimize the file format, size, and dimensions of the pictures;
- Implement personalized caching rules to accelerate image loading;
- Allow high availability for all the files and data delivered to the user.

Since the migration process, EXAME’s experts have had the backing of Azion’s Mission Critical Support team to extract the most from the platform and ensure the success of the projects.

> Azion’s Critical Mission Support is a great asset and makes our team more confident in critical projects. In addition to conventional channels, via ticket and telephone, an exclusive real-time channel was opened to monitor everything that happened to our technicians during the coverage of the first round of the elections. That was fundamental.
>
> Célio Rodrigues, Head of Infrastructure at EXAME

## Results and Impact

EXAME registered its most extensive daily audience record, with 6 million viewers following the elections on all digital channels, equivalent to half the volume of access it gets in a month[1].

EXAME’s coverage also included a four-hour long live stream, without interruptions, delivering vote counts first-hand and in real time to more than 250 thousand viewers all over Brazil[2].

Another important initiative for a good user experience was loading candidate pictures from Azion’s platform, unlike most competitors who got them directly from the overloaded TSE’s servers, compromising the data transfer.

> EXAME’s website supported 40 times more simultaneous users. Before migrating to Azion’s platform, the average was around 5,000 users. During the event, 200,000 users per minute were reached, and Azion was able to support the excessive load surprisingly and played a decisive role in our success.
>
> Célio Rodrigues, Head de Infraestrutura na EXAME

EXAME also significantly enhanced its metrics on Core Web Vitals compared with the legacy solution, reaching a First Input Delay of 6 ms, Time to First Byte of 0.6 ms, First Contentful Paint of 1.2 s, and Interaction to Next Paint of 101 ms.

<Frame src="https://www.azion.com/assets/content/cases/uploads/successstory-exame-1-1.png" alt="" />

Using Edge DNS, Firewall and its modules (Web Application Firewall, Network Shield e DDoS Protection), EXAME’s DevOps team established programmable protection against various web threats, like DDoS and injections, and limits on simultaneous accesses to URLs.

With Azion’s Load Balancer, EXAME managed to reduce the source infrastructure overload, with a 40% decrease after creating rules for dynamic content and traffic migration to Azion.

The electoral coverage had an average of 86% of the content delivered by the web applications, reaching a peak of 96%, a moment when almost no traffic went through the source.

Another impact was the flexibility in creating customizable rules on Cache. From these cache settings, EXAME reacted to events or instabilities promptly and assertively and sped up the troubleshooting.

## About EXAME

With a focus on topics related to business, economics, careers, politics, technology, and global trends, EXAME is one of the most traditional magazines and a reference in analysis and reporting on these segments in Brazil. Founded by the Civita family in 1967, in 2019 it became part of the BTG Pactual Group. Today, it also bets heavily on its digital presence and makes most of its content available online entirely free of charge.

#### References

- [1] [2] [EXAME tem audiência recorde na cobertura das eleições 2022 (EXAME)](https://exame.com/brasil/exame-tem-audiencia-recorde-na-cobertura-das-eleicoes-2022/)
