Border Gateway Protocol (BGP) was created to offer a more efficient internal and external communication management between different Autonomous Systems (ASes). In the past, technological developments brought the Transmission Control Protocol and the Internet Protocol (TCP/IP) to overcome the NCP limitations, significantly increasing the number of connected devices.

This approach increased the network connections, the topology, and the formation of large ASes with their own set of rules and routing policies, interconnected through virtual links and managed by an entity or organization.

Nowadays, the Internet through its constant growth, as an open technology, has become a complex and dynamic network. Consequently, organizations from different industries demand specialized infrastructures that overcome the challenges of BGP to deploy their applications with personalized delivery, automatic scalability, security, data localization, intelligent routing, mobility, and low latency services.

In this blog we will present the main challenges of BGP, including some of its key threats and vulnerabilities, and how Azion overcomes these challenges to deliver secure edge routing.

## How Does BGP Work?

BGP was designed to exchange routes and IP addresses and make routing decisions based on a set of rules configured by an administrator. When communication is performed between routers in a single AS, it is called Internal Border Gateway Protocol (iBGP), and when it is performed between different ASes, it is called External Border Gateway Protocol (eBGP). BGP is a dynamic protocol that guarantees the stability of the network (e.g., avoiding loops) and the availability of new routes in case of possible failures. However, BGP isn’t an intelligent route vector, like a programmable link-state protocol where it automatically does everything by itself. With BGP, you have to give the instructions in advance and do the same process to another peer to go into operation. In the following sections we will extend this information by showing you the current challenges and vulnerabilities related to BGP.

<Frame src="https://www.azion.com/assets/content/blog/uploads/bgp_when-building_a_global_edge_network-01.png" alt="" />

## Challenges of Using BGP

### Routing table growth

When Autonomous Systems get a block of unique IP addresses, they must advertise it via a routing table. This announcement forces all ASes worldwide to discover the new prefixes that are now active. From its beginning, the addition of new prefixes has shown exponential growth due to the expansion of the Internet. A report presented by [CIDR](https://bgp.potaroo.net/index-cidr.html) in November 2021, showed that IPv4 and IPv6 prefixes reached 900,000 and 150,000 entries respectively, with an approximate 5% of increase over the previous year. The figure below indicates that we are reaching the limit for IPv4 (4E+9 addresses), showing that part of it is no longer available. In this way, routing table growth affects the “path exploration” phenomenon, yielding a slow convergence in the Internet.

<Frame src="https://www.azion.com/assets/content/blog/uploads/bgp_when-building_a_global_edge_network-02.png" alt="" />

### Efficiency

Reachability and routing among ASes are becoming more problematic as the number of IP addresses grows. It is no longer the case that you must lead users to content but rather deliver it to users. Therefore, BGP was not created to get control of these conditions and procedures, which define it as inappropriate or inefficient to take advantage of the best performance of a distributed network platform and its correct operation.

For example, modern business markets require high storage capacity, personalized content delivery, 100% availability, real-time data processing, observability, and the endorsement of an intelligent infrastructure to build and deploy Apps. The lack of one of these pillars can cause companies to lose control of their services, stop work processes, or offer an unsatisfactory user experience, among some cited concerns.

### Management of BGP peers memory

BGP is synchronous; it means that, is necessary to reserve a certain amount a priori of BGP peer memory to process specific tasks. If a certain level threshold is reached, BGP will tear down an EBGP session to liberate memory resources until its capacity is exempt from that threshold. With the session down, BGP will send your request through another path without your previous knowledge.

### Programmability

When we talk about knowledge and decision-making, BGP does not consider this. It doesn’t know about network attributes like packet loss, performance, latency, and user experience. As BGP ignores these and other parameters, it simply sends your request to a place that is not necessarily the best. Lack of programmability is an issue since it cannot implement smart rules for real-time decision-making. So researchers worldwide are looking for additional tools that help BGP satisfy this need.

### Route Propagation

Route propagation is a form of advertising routes between neighboring domains one hop at a time. BGP is usually a relatively slow protocol because route propagation convergence is slow. The primary limiting aspects of BGP convergence are table size, advertisement delay, Minimum Route Advertisement Interval (MRAI), transport-level settings, and processing overhead of BGP updates. It means, processing a large number of inputs could cause a significant workload on routers, which directly affects routing latency (the time it takes for routers to converge). Therefore, administrators must allocate a priori computational resources to satisfy the routing table size growth and new techniques for reducing these workloads. In the absence of any policies, BGP uses metrics based on the length of the AS_PATH attribute, which is not adequate for highly distributed networks.

## Threats and Vulnerabilities

Azion is a founding member of the [Internet Society’s MANRS Content Delivery Network (CDN) and Cloud program](https://www.internetsociety.org/news/press-releases/2020/leading-cdn-and-cloud-providers-join-manrs-to-improve-routing-security/), which aims to educate and mitigate the most common threats of the routing system. Azion, as well as its other members, seek to improve the routing infrastructure through the following specific actions:

- Prevent propagation of false routes;
- Prevent traffic from unauthorized sources;
- Facilitate communication and coordination;
- Facilitate validation of routing data, and;
- Encourage the adoption of the MANRS initiative.

Regarding the threats that affect the routing system, they can emerge from misconfiguration, malicious attacks, or technological challenges that are still present in BGP. For example, BGP’s dependence on the transmission control protocol makes it vulnerable to TCP-based attacks. Also, due to the complexity of its configuration, BGP is sensitive to any errors during maintenance processes. Therefore, implementing malicious information or a simple routing error can cause companies to experience prolonged outages and leave them susceptible to security attacks. The main threats related to BGP are:

- **Wrong Peering Setup/Changes:** a BGP vulnerability caused by an incorrect peering configuration between ASes. It can happen for various reasons, such as hacker attacks, equipment failure, or poor maintenance practices, which affects the BGP operation and therefore the entire network.
- **Route Flapping:** an event in the network generated by a high update rate in the status of a route (e.g., available and not available). Route Flapping produces an unstable state, resulting in a loss of data packets and a decrease in the traffic circulating in the network.
- **BGP Manipulation:** an attack in which a hacker modifies the content of the routing table in order to send data to other destinations without the sender’s knowledge.
- **BGP Denial-of-Service (DoS):** a type of aggression in which hackers send a large amount of data or requests to a machine or network device in order to reduce the computational resources for processing legitimate BGP traffic.
- **BGP Route Hijacking:** a type of attack in which hackers redirect Internet traffic to unwanted sites. To achieve this, hackers use BGP to falsely advertise ownership of a victim’s IP address groups and redirect some or all of the victim’s traffic to a fake or nonexistent domain.

## How Azion Offers a Reliable Edge Routing

As consumers, workers, and businesses increasingly change their lifestyles, companies have been forced to shift their efforts to offer more digitized services. This gave rise to a large number of devices connected to the Internet and a highly distributed network with its services offered closer to end-users. For businesses, the complexity of managing this large number of devices has been tackled with **automation** in the operational infrastructure. **For Azion, automation is an essential pillar in our business but not our only goal.**

**Our main focus is to find efficient network abstractions** that allow the building and deployment of reliable applications, offering our clients a high level of security and observability, and that means treating the BGP protocol in an abstract way.

As we know, the Internet backbone was built on top of BGP in conjunction with DNS. Research on network development proposes different approaches to automate the addressing process and reduce its latency. However, Azion goes further, not only do we automate processes but we also think about simplifying and optimizing. With Azion Edge Traffic Router, we take advantage of its network programmability, enabling a new approach to configuring network routes and implementing advanced rules.

Thus, Azion drives a new approach to offer an edge routing service that enables intelligent data routing monitoring and management. This means that Azion Edge Traffic Router dynamically chooses paths based on real-time measurements of how network connections perform, ensuring the packets are always delivered through the best network path, improving the performance and reliability of the infrastructure, reducing latency of the content transfer, and enabling the monitor of the network status.

Its routing decisions are based on latency, throughput and availability data collected from millions of netflows every second and Real User Monitoring (Azion Edge Pulse), as well as connectivity issues such as packet retransmission and network congestion, along other parameters such as BGP, user location, edge node conditions (e.g. CPU, disk IO, etc.) and more.

Azion’s software-defined routing enables real-time response to failures and congestion within our network and on the public Internet. Our Azion Edge Traffic Router is a software concept based on a disaggregated control plane that allows the easy addition of new functionality, scale to handle large networks, offer fault isolation, and other benefits.

Furthermore, to build a more secure and reliable Internet, we must protect against the many vulnerabilities that web infrastructure is riddled with. For this reason, Azion is a founding member of the [Internet Society’s MANRS](https://www.internetsociety.org/news/press-releases/2020/leading-cdn-and-cloud-providers-join-manrs-to-improve-routing-security/) initiative to strengthen Internet routing security. In this way and through several security procedures, we seek to prevent the spread of incorrect routing information, traffic of illegitimate source IP addresses through specific actions, and other common outages resulting from human error.

Azion is a full-stack edge platform that simplifies how you build better applications, faster. We have built a multi-layered solution that keeps websites up and running and is able to load balance and optimize traffic in order to ensure availability. Take advantage of our 100+ global edge locations and use Azion to orchestrate your multi-cloud, on-premise, or remote-device deployment.

Do you want to test out our full suite of Products? You can [create a free account](https://console.azion.com/signup/) or contact [our experts](https://www.azion.com/en/contact/) to start your digital transformation and move to the edge!

At Azion, we are hiring now! If you want to work with these technologies and build the future of computing with us, check all the vacant positions in our [Careers section](https://www.azion.com/en/careers/).

## References

1. Butler, K., Farley, T. R., McDaniel, P., & Rexford, J. (2009). A survey of BGP security issues and solutions. *Proceedings of the IEEE*, *98*(1), 100-122.
2. [CIDR Report](https://www.cidr-report.org/)
3. Comer, D., & Rastegarnia, A. (2019). Toward Disaggregating the SDN Control Plane. *IEEE Communications Magazine*, *57*(10), 70-75.
