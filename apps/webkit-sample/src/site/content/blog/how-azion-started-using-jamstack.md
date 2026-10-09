## Introduction

Around 2017, a web page development revolution began. After the market adopted Static Site Generators (SSG) in engineering teams and huge savings on infrastructure budget were made, there came the question of taking this revolution to less technical teams, like Marketing, Copywriters, Demand Generation, Product Marketing, and etc.

## Motivation

What motivated this was a desire to scale creation, editing and maintaining content without having to go through a developer. With the exponential growth of Azion, we had to find a way to make these web content processes easier and make the monitoring of this scale possible.

To have a quick idea of this growth, we went from one developer in a third-party agency that took care of the blog to:

- A team of copywriters handling the Product Documentation area with more than 15 editors;
- A content team handling Success Cases, with more than 10 editors; and
- A Product Marketing team with more than 15 content creating editors.

We practically went from one or two people, responsible for everything, to three or more teams of around 14 people, including the people who don’t write (such as editores, leaders, etc), but who also have certain responsibilities regarding our web presence.

## Why go towards JAMStack and not a regular CMS?

<Frame src="https://www.azion.com/assets/content/blog/uploads/jamstack.png" alt="" />

LAMP Stack (Linux, Apache, MySQL, PHP/Perl/Python) is the most common possible example when we talk about web services. On the other hand, JAMStack (JavaScript, APIs and markup) is a growing stack, since it abuses all Front-End power. APIs connect Front-End to the necessary services (like content databases and payment gateways, for example) and the pages are served as static files.

The most important difference between JAMStack and traditional LAMP Stack is that it doesn’t need to be pulled from a server with database-generated content. Everything is generated at build time and sent to a CDN (Content Delivery Network). The server-type functionalities are managed by third-party services, connected by APIs.

To make creating a JAMStack website easier, static site generators also appeared. With a SSG like Gatsby or Hugo, a developer can quickly create a basic website.

## Advantages of JAMStack over LAMP Stack

**Performance:** Since the pages are generated at build time, the time to generate content or server cache is eliminated, as well as the need for a database.

**Cost:** Using a CDN, scaling is a lot easier since you don’t have to worry about scaling a server, database, etc. The cost will be on demand, which also solves the availability issue.

**Security:** Pre-built websites don’t have dynamic interaction with the server, so you don’t have to worry about database security or DDoS attacks. With LAMP stack, you need to constantly pay attention to security updates, among other problems.

**Better developer experience:** It is simpler to develop web Front-End focused on the core, without all a pipeline between client-side and server-side stacks with endless contracts. This way, everything is connected through APIs with single responsibilities, using Github/Gitlab for integrations, making deployment easier.

## Conclusion

JAMStack is one of the best parts of the JavaScript ecosystem. If your team can access technical people with Front-End knowledge or a limited budget to develop large web projects, this is a great way out. It also makes all the management easier, from infrastructure, deployment, and even performance.
