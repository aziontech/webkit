At Azion, we’re always looking for better (and more scalable) ways to increase our customers’ observability and access to platform statistics and analytics. In this spirit, we’re happy to announce the availability of our GraphQL API, giving our customers access to the same datasets we use internally to power our Real-Time Metrics.

## What Is GraphQL and Why Is It better Than Your “Typical” APIs?

Graphic Query Language (GraphQL) is a language created by Facebook and open-sourced for use with APIs and works as an alternative to REST APIs, giving you the ability to work with data in a more structured and object-oriented way, and receive results in a convenient JSON format.

GraphQL fetches information differently from traditional APIs, and gives you the ability to filter data without overfetching, giving it better performance compared to REST APIs. Additionally, a GraphQL API can retrieve information from different datasets all in one endpoint, making them easier to manage and use than REST APIs.

## What Can I Do With GraphQL? What Types of Data Can I Retrieve?

The GraphQL API provides access to a range of product usage, security, request/response, and user data. It can provide aggregated data in JSON format, human readable in its raw form, or connected with an analysis tool like Grafana, for example, where developers and analysts can customize their own views. Aggregated metrics can be retrieved for different time periods — by minutes, hours, or days.

For those new to GraphQL, but with some background with SQL, you will find some similarities in the ability to filter, sort, page by, or limit results. Our documentation will provide you with all the basics you need to get up and exploring! (see [GraphQL API overview](https://www.azion.com/en/documentation/devtools/graphql-api/) and [Aggregated Data with GraphQL](https://www.azion.com/en/documentation/products/how-to/configurations/graphql-aggregated-data)),

[We encourage those using the GraphQL API to explore all data available by querying its metadata as described here](https://www.azion.com/en/documentation/products/guides/graphql-metadata/). This will bring back schema information on the datasets available (e.g. idnsQueriesMetrics, edgeFunctionsMetrics, etc.) including dimensions and metrics available and their data types (e.g. int, string, datetime, etc.).

### Just a couple of questions our GraphQL API can answer include:

**Security:** What are my top attacked IPs and ports over time? What types of attacks are we seeing and where are they coming from?

*This type of information can be used to hone security policy. e.g. our Network Layer Protection module can be programmatically updated with this information to rate limit or block requests by IP, geolocation, ASN, and more.*

**Performance and Cost Savings**: What percentage of requests are hitting cache and what’s the cache hit bandwidth? What is the origin response time?

*This type of information can tell you how much bandwidth (=money) you’re saving with caching and also give you insights into performance and user behavior for requests that must travel to the origin. This can help developers optimize applications in terms of performance, cost savings, and user experience.*

There are many more use cases and possibilities available and we encourage our customers to connect with their Customer Success Representative (CSR) to learn more.

## How to Use GraphQL?

Using Azion’s GraphQL API is simple. Simply log into our console (Real-Time Manager) to generate a secure token to authenticate your API requests. From there, you’re free to query rich information using popular API platforms such as Postman and Insomnia.

In the following example, we’re querying the amount of harmful requests to a sample application over the course of 1 hour:

```
query HttpCalculatedWAFThreatsAndRequests {
  httpMetrics(
    limit: 1000
    filter: {
        tsRange: {begin:"2023-03-06T12:00:00" end:"2023-03-06T13:00:00"}
    }
    groupBy: [ts]
    orderBy: [ts_ASC]
  )
  {
    ts
    wafRequestsThreat
  }
}
```

And here’s an example of what the JSON response for that query might look like:

```
{
  "data": {
    "httpMetrics": [
      {
        "ts": "2023-09-29T12:00:00Z",
        "wafRequestsThreat": 94
      },
      {
        "ts": "2023-09-29T12:01:00Z",
        "wafRequestsThreat": 93
      },
      {
        "ts": "2023-09-29T12:02:00Z",
        "wafRequestsThreat": 124
      },
      {
        "ts": "2023-09-29T12:03:00Z",
        "wafRequestsThreat": 69
      }
      ]
      }
}
```

The response show the amount of requests considered harmful, minute by minute.

## What’s Next in Azion Observability

At Azion, we’re focused on our customers and are constantly seeking their feedback to improve our Observability products. Moving forward, we’re planning to provide access to raw event data (not just aggregates) and also plan to add new visualizations to our in-console Real-time Metrics, with a focus on security insights.

Got any feedback or questions? Please post them below in the comments section.
