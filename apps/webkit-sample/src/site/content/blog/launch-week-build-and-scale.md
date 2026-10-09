Modern businesses demand new ways to build, secure, and scale applications. Azion is at the forefront of this compute technology with its suite of products:[Edge Functions](https://www.azion.com/en/products/edge-functions/), [Edge SQL](https://www.azion.com/en/products/edge-sql/), and [Edge Storage](https://www.azion.com/en/products/edge-storage/).

Today, we introduce key enhancements to power your web applications right at the data source, achieving the best user experiences through low latency and no cold starts.

### Edge Functions: Serverless Without Cold Start or Infrastructure Hassle

Edge Functions is Azion’s serverless product designed to build and run web applications without the hassle of managing infrastructure and paying for unused resources. Your applications run directly on Azion’s distributed infrastructure, benefiting from ultra-low latency and automatic scaling that adapts instantly to demand.

#### What’s New and Upcoming?

- **NodeJS compatibility:** we have expanded compatibility with Node.js APIs.
- **WinterTC compatibility:** committed to supporting open standards, Azion supports WinterTC APIs, promoting platform flexibility and preventing vendor lock-in.
- **Edge Functions Runtime:** enhanced execution times and sizes, now allowing up to 5 minutes of CPU execution time and a 20 MB code size.

| Metric | Azion Edge Functions | Cloudflare Workers | Akamai EdgeWorkers |
|---|---|---|---|
| Execution time | 5 minutes | 1 minute | < 1minute |
| Code size | 20 MB | 10 MB | 1 MB |
| WinterTC compatibility | 80% | 80% | -∗ |

∗ Akamai is not a member of the WinterTC open standard alliance.

Azion is continuously expanding framework support, including popular ones like Next.js, Vue, React, Angular, Gatsby, and Astro. Our vision is to support as many market frameworks and libraries as possible. Visit our documentation for more [information about supported frameworks](https://www.azion.com/en/documentation/products/devtools/azion-edge-runtime/frameworks-compatibility/).

To facilitate deployment, Azion offers a variety of templates to serve different use cases, from blogs to e-commerce shops. These templates are the quickest way to start using the Azion Web Platform.

Here are a few of our most popular templates to get you started. For more information, you can visit our documentation page on [using templates](https://www.azion.com/en/documentation/products/use-a-template-via-azion-console/).

| Template | Deploy Link |
|---|---|
| Angular Boilerplate | [Deploy](https://console.azion.com/create/angular/angular-boilerplate) |
| Next.Js Ecommerce | [Deploy](https://console.azion.com/create/azion-community/ecommerce-stationery-next) |
| React Boilerplate | [Deploy](https://console.azion.com/create/react/react-boilerplate) |
| Vue Boilerplate | [Deploy](https://console.azion.com/create/vue/vue-boilerplate) |

### Edge SQL: Powering Databases at the Edge

Edge SQL offers a serverless, fully ACID-compliant, and scalable database designed for distributed, read-intensive workloads at scale, with advanced security and a top-tier price-to-performance ratio.

It’s replicated across hundreds of Azion data centers for low latency and real-time responses. By running your SQL database closer to your stateless, serverless functions, you achieve stateful conditions, from simple key-value operations to advanced proximity searches over vector databases.

**Performance comparison**:

The results below were obtained by running a short SELECT statement, sending 100 requests to each database.

<Frame src="https://www.azion.com/assets/content/blog/uploads/lw_Database_comparassion_chart.png" alt="Performance graph comparing Azion Edge SQL and Cloudflare D1 over 100 executions. The Azion Edge SQL line maintains lower and more stable latency." />

|  | Azion Edge SQL | Cloudflare D1 |
|---|---|---|
| Minimum | 0.031 ms | 0.178 ms |
| Maximum | 0.095 ms | 0.3709 ms |
| Mean | 0.0575 ms | 0.2397 ms |
| P95 | 0.087 ms | 0.3264 ms |
| P99 | 0.091 ms | 0.3612 ms |

#### What’s New and Upcoming?

- **Enhanced product usability:** we created the [Edge SQL Shell](https://www.azion.com/en/documentation/products/store/sql/install-edge-sql-shell/) to facilitate database migrations from platforms like PostgreSQL and MySQL to Edge SQL.
- **New metrics dashboards and a Management UI:** coming soon to Azion Console.

### Edge Storage: Azion’s Scalable Object Storage Solution

Edge Storage is Azion’s scalable object storage solution, handling vast volumes of unstructured data with top performance and no egress costs when used with Edge Applications.

Azion’s Edge Storage already hosts petabytes of data for diverse use cases—from static sites, videos, and image repositories, to logs and any type of unstructured data—all accessible using the familiar S3 protocol.

#### What’s New and Upcoming?

- **Universal Data Migration program:** a customer-wide∗ program to facilitate migration of any size, free of charge∗.
- **New metrics dashboards and a Management UI:** coming soon to Azion Console.

∗ Check enrollment conditions and compatibility requirements.

### Join Product Launch Week

We are announcing a series of product launches and enhancements to our web platform. These updates will expand its capabilities in AI applications, computing, and overall developer experience.

We will also be providing new content to help you effectively utilize these features.

[Subscribe](/site/blog/product-launch-h1-2025) to stay up to date with our latest products and new features.

Ready to experience the edge advantage? [Talk with our experts today!](https://www.azion.com/en/contact/). We’re here to help you on your journey.

---
