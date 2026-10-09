At Azion, every second a developer spends waiting for a build or deploy is a second away from shipping. That’s why we optimized the application publishing pipeline across both the [Azion Console](https://console.azion.com/login) and the [Azion CLI](https://www.azion.com/en/documentation/products/azion-cli/overview/), with deep changes to the static file upload step.

**The result:** this update reduces static file upload time by 90%, dropping from 1m 35s to 3.5–9s. Developers deploy faster and ship releases sooner with automatic parallel uploads that scale based on available hardware.

> Azion’s deploy pipeline is the sequence of steps that turns code into a published application — build, static file upload, and propagation. Starting with CLI 4.21 and recent Console versions, the upload step was rewritten with S3 protocol and dynamic parallelism.

## The problem: upload was the real bottleneck

In modern web applications with hundreds of assets, static file upload was the biggest time sink in the deploy pipeline — not the build. The previous process used the Storage API with 5 workers in parallel, which alone consumed around 1 minute and 30 seconds per deploy.

## How we optimized the build and deploy pipeline

The optimization was applied to Azion’s build and deploy flow, across both the CLI and the Console. Two changes drastically reduced upload time:

- Migration to S3 protocol, replacing the previous Storage API
- Dynamic worker parallelism, scaling automatically based on the execution environment

The experience differs between the two channels:

In the Azion Console, this logic is already integrated into the deploy pipeline and works automatically. No changes to the project or deploy configuration are needed. If you’ve deployed through Azion in the past few weeks, you’re already running on the new pipeline.

In CLI v4.21+, parallelism is calculated based on the CPU cores available on the execution machine:

```
cpuCores := runtime.NumCPU()
optimal := cpuCores * WorkersPerCore

if optimal > MaxWorkers {
    optimal = MaxWorkers
}
if optimal < MinWorkers {
    optimal = MinWorkers
}
return optimal
```

For users who want even more control, we’ve introduced the `--workers` flag, allowing you to manually define the number of workers for your specific environment.

## The Results: 90% Faster Uploads

The performance gains are transformative.

| **Platform** | **Performance (180 Static Files)** |
|---|---|
| Azion CLI (Previous versions) | 1m 35s - 1m 45s |
| **Azion CLI (4.21.0 onwards)** | **3.5s - 9.0s** |
| Top Competitors | 9s - 10s |

*Benchmarks run with Gatsby Ecommerce Theme on MacBook Air M1, first deploy.*

For deploys via Console template, static file upload dropped from 1m 47s to 48s — a 73% reduction in that specific scenario. Azion now significantly outperforms some of the most important players in the market, saving precious seconds on every deploy.

## A lesson about I/O performance

The first hypothesis was to increase CPU and memory in the execution environment. Doubling the CPU limit changed nothing — the bottleneck was I/O, not processing. The process was stalled waiting for bytes to transfer over the network.

Signs your pipeline has the same problem:

- **Low CPU during the slow step**: below 30–40% in `top` or `htop` points to a network bottleneck, not CPU
- **Time doesn’t improve with more threads**: when the limit is bandwidth or latency, extra threads don’t help
- **The slow step involves file transfers**: protocol and parallelism matter more than container resources

## Transparency Through Telemetry

In addition to speed, we are bringing more **transparency** to the deploy process. By using the `--debug` flag, developers can now view a **complete report of timings** for every part of the deployment, including specific **API call durations**. This level of verbosity helps teams identify exactly where time is being spent and **debug issues with greater precision**.

## Building the Future of DX

This update is part of a broader series of improvements we are making to the Azion platform to ensure we’re on the way to becoming the **fastest and most developer-friendly** web platform. We believe that by removing the friction of slow deploys, we empower you to build, test, and scale your applications at the **speed of thought**.

Deploy through the [Azion Console](https://console.azion.com/) or update your [Azion CLI](https://www.azion.com/en/documentation/products/azion-cli/overview/) to use the optimized publishing pipeline.

---

## Frequently asked questions

**What caused the 90% improvement in upload time?** Two changes: switching from the Storage API to the S3 protocol, and replacing a fixed 5-worker pool with dynamic parallelism that scales based on CPU cores.

**Do I need to change my project or deploy configuration to get the improvement?** No. Console deploys use the new pipeline automatically. CLI users need to update to version 4.21 or later.

**How does Azion calculate the number of upload workers?** The CLI multiplies available CPU cores by a constant (`WorkersPerCore`) and clamps the result between `MinWorkers` and `MaxWorkers`. You can override this with `--workers`.

**Can I set the number of workers manually in the CLI?** Yes. Use `--workers <n>` to define the exact number of upload workers for your environment.

**Why didn’t increasing CPU reduce upload time?** The bottleneck was network I/O, not processing. When the limit is transfer speed or protocol latency, more CPU has no effect. The fix is parallelism and a more efficient protocol.

**How do I see where time is spent in a deploy?** Run with `--debug`. Azion prints a timing report for each deploy step, including individual API call durations.

**How does Azion CLI 4.21+ compare to competitors on upload speed?** In benchmarks with 180 static files on a MacBook Air M1, CLI 4.21+ completed uploads in 3.5–9s. Tested competitors completed the same task in 9–10s.

**Does the Console improvement apply to all deploy types?** The benchmark covers template deploys, where upload time dropped from 1m 47s to 48s. Results vary by project size and asset count.
