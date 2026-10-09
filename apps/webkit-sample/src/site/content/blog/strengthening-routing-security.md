## Bringing MANRS to the Azion edge network

Our commitment to building a safer, more stable internet is a core value here at Azion. As our global dependence on a secure internet continues to increase, it becomes ever more critical that we safeguard against the many vulnerabilities that web infrastructure is riddled with. The rise of digital dependencies brought on by the pandemic has only intensified our efforts to continually improve the practices we bring to internet security. To further this mission, we’ve partnered with the Internet Society on their MANRS initiative to strengthen the security of internet routing.

## Routing Weaknesses

The internet runs on various network protocols, one of the most fundamental of which is BGP (Border Gateway Protocol). BGP is the protocol that governs all macro-level communications between networks and autonomous systems. When a data packet has to travel to a destination within a different AS, BGP uses a complex hierarchy of rules to find the most efficient path to the destination AS. Every network using BGP is able to immediately trust any BGP created route that passes through it, boosting speed, and making for an easier update process. Unfortunately, in its current form, BGP is a little too trusting, and malicious parties and even simple mistakes can redirect traffic and crash routes. In the past year, these incidents have numbered in the hundreds, costing several companies an unfortunate amount of time, money, and credibility. While many of us in the community have been aware of this glaring problem for years, proposed solutions have failed to receive the widespread adoption necessary to implement change. This is where MANRS comes in.

## Why we need to mind our MANRS

MANRS (Mutually Agreed Norms for Routing Security) is an initiative spearheaded by a really cool nonprofit called the Internet Society. Founded in 1992, The Internet Society is dedicated to supporting the development of global technical infrastructure to fulfill their vision of an internet for everyone. With MANRS, they’ve turned their focus to the threat BGP weaknesses present to routing, outlining a new set of rigorous standards and practices that every CDN, cloud provider, and edge computing company should implement immediately to secure their networks and do their part in helping to make the internet a safer and more secure global space. These standards are thoroughly explained on the [MANRS website](https://www.manrs.org/), but here’s the basics:

MANRS lays out four concrete actions that networks can take, that, if implemented on a wide-scale, could drastically improve routing security.

**Coordination:** Maintain up-to-date contact info, and ensure that it stays globally accessible.

**Filtering:** Make use of rigorous AS-path filters, applying due diligence in verifying customer announcements, as well as your own.

**Anti-Spoofing:** Validate source addresses for customer networks, end-users, and infrastructure to prevent IP address spoofing.

**Global Validation:** Make routing policy documentation publicly available on a global scale, to make it easier for other networks to verify your announcements.

Implementing these four practices is a big step towards building a more secure global routing environment. This is a new minimum routing security standard that every company should push themselves to exceed.

## The Azion Commitment

It’s our pleasure to work with the MANRS project, as well as other thought leaders in the field, including Cloudflare, AWS and Google, to drive MANRS policy implementation among companies at the CDN and cloud level.

“We’re proud to have Azion as a MANRS participant, leading the way with other CDN and cloud providers to make the global routing infrastructure more secure for everyone. CDN and cloud providers are important players in the Internet ecosystem, and the organizations in the task force, including Azion, have shown strong commitment to routing security by moving forward the baseline of security-enhancing actions they adhere to.” said Andrei Robachevsky, Senior Director of Technology Programmes at the Internet Society. “The interconnected nature of the Internet means it is only by working together that we can secure routing. We are hopeful the example of the task force will inspire many other Internet networks to join MANRS and develop the initiative further.”

We couldn’t agree more. So not only are we integrating MANRS practices on top of our already rigorous security on our Azion Edge Traffic Router, but we’re calling on our peers to do the same. As companies working on cloud and edge networks, it is our responsibility to secure not only our own systems, but the greater global internet, without which, all of our innovations could not occur. So please, join us in our dream to make MANRS as ubiquitous as the Border Gateway Protocol it protects. As with all things pertaining to this great beast we call the internet, the standards we use to secure our routing must continue to grow and change in the face of new threats and opportunities, but before we can look to the future, we first must drag BGP into the modern age.
