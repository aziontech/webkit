In our last article, we spoke of how we introduced JAMStack into Azion’s website. Here, we will talk about the results of small actions in the optimization of the number of used resources, leading to an expressively better load time of more than 900 pages under our domain.

Our main domain receives requests from four main systems, each with their own [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) support configured in 3 languages: portuguese, english and spanish. They are:

- our [blog](https://www.azion.com/pt-br/blog/);
- our [success stories](https://www.azion.com/pt-br/resource-hub/);
- our [documentation](https://www.azion.com/pt-br/documentacao/); and
- our temporary Landing Pages created for our marketing campaigns.

Though each project is separate, all of them use the same resources.

## How do Static Websites relate to LCP?

Adopting [SSG](https://jamstack.org/generators/) (static site generators) on Front End also helps to diminish page load time. SSGs enable a large part of the content to be assembled during build time, avoiding excess processing time for each and every request.

To understand why, we must first take a look at what is LCP (Largest Contentful Paint), a metric that measures user [perception of load speed](https://web.dev/user-centric-performance-metrics/#types-of-metrics) on each page. LCP calculates how long it takes to show most of the content (like images and videos) on screen since the page began to load.

An ideal LCP time is as follows:

- Good: up to 2.5 seconds;
- Needs Improvement: between 2.5 and 4 seconds;
- Bad: more than 4 seconds.

Many times, though, the user perception can be different than what we actually measure, so it’s important to remember that “user perception is performance”, as was said by [Guilherme Moser](https://www.linkedin.com/in/guilhermems/) of Terra Networks.

## What we did

According to Network and Coverage tools at Google Chrome Dev Tools, we could see that something was wrong:

<Frame src="https://www.azion.com/assets/content/blog/uploads/jamstack-lcp-1.png" alt="" />

- On the blue strip, we saw that CSS was 2.0mb;
- And on the red strip, we see that 98,8% of the CSS processing was used for unnecessary traffic.

Even though there is caching capacity at the browser level, it would be irresponsible to rely on this process. As well as diminishing the LCP, it brings other problems like TTFB, TBT and TTI. Due to this terrible performance, we were sure that we had to update our [JAMStack](https://www.azion.com/en/learning/jamstack/why-use-jamstack/) based website structure urgently. So our job was to break up the CSS.

### Breaking up the CSS

Our website ‘s previous version had 3 pages of compiled CSS for all of its pages, so our first step was to transform everything that was under ./pages/_files.scss to ./pages/_page.scss. This way, neither the destiny nor the code needed to be altered when they were compiled by Jekyll. So all the files that didn’t have an _ (default on Sass) when used as import instead of output would generate 1 file for each compiled output.

What used to be an enormous 200mb bundle.css became several smaller files of around 100k, even before gzipping.

What about the compiled files? We tested each file to check out what was really necessary, and got to the following compiling for all of the pages:

<Frame src="https://www.azion.com/assets/content/blog/uploads/jamstack-lcp-2.png" alt="" />

<Frame src="https://www.azion.com/assets/content/blog/uploads/jamstack-lcp-3.png" alt="" />

The final – and much smaller – result was something like this:

<Frame src="https://www.azion.com/assets/content/blog/uploads/jamstack-lcp-4.png" alt="" />

This was a page with a smaller number of components that turned out to be about 90k in size after being compiled.

### Integrating with HTML

For those who use SSG tools and are used to setting up Front-Matters, these tools have this kind of marking at the top of the file to show how they must be compiled. Because of this, we only made slight changes on our pages.

We went from a page with an HTML header that had everything, like shown below:

to:

<Frame src="https://www.azion.com/assets/content/blog/uploads/jamstack-lcp-5.png" alt="" />

Now, this style will come from the Front-Matter setup updated during the build. Something like:

<Frame src="https://www.azion.com/assets/content/blog/uploads/jamstack-lcp-6.png" alt="" />

<Frame src="https://www.azion.com/assets/content/blog/uploads/jamstack-lcp-7.png" alt="" />

We can see that we used most of our existing resources with slight alterations, giving us enormous advantages.

## Our results

At the end of this processes, we observed that we had reached a 70% improvement:

- LCP: from 2.1s to 1.3s;
- First Byte: 0.256s to 0.18s;
- Start Render: from 1.9s to 0.6s;
- First Contentful Paint: from 1.8s to 0.63s;
- Speed Index: from 2s to 0.7s;

All in all, the importance of JAMStack architecture grows more obvious every day.
