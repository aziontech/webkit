You double the runner’s CPU. The deploy still takes the same time. You add memory, and nothing changes.

That was exactly the scenario we encountered during a recent optimization of Azion’s deploy pipeline. The first instinct might have been to keep adding resources, but we decided to answer a simple question first: where was the time actually being spent?

The answer completely changed the direction of the optimization. Instead of a processing problem, we discovered that much of the time was spent waiting for I/O operations to finish.

Keep reading to understand how to identify this type of bottleneck, why more CPU doesn’t always solve the problem, and which metrics actually help you find the root cause of slowness.

---

## How to identify whether the bottleneck is I/O

A process can be slow because it’s doing a lot of processing work, or because it’s waiting for data to arrive. In the first case, more CPU helps. In the second, the processor is already idle. Adding cores doesn’t speed up a network queue.

One of the first signals is CPU usage during the slow step. If CPU stays low while execution time grows, the process is probably spending most of its time waiting for I/O operations.

Tools like top and htop are usually enough to observe this. But low CPU alone isn’t a definitive diagnosis: lock contention, API rate limiting, and processes waiting for an external response produce the same signal.

It’s also worth looking at what the slow step is actually doing. Artifact uploads, dependency pulls, and repository clones are network operations. Their time depends on protocol and parallelism, not CPU.

When you suspect network I/O, increasing parallelism is a useful test — but the result needs to be interpreted carefully. There are two scenarios with opposite behaviors:

- Latency-bound (many small requests, high RTT): increasing workers helps, because you overlap the wait times of each request.
- Bandwidth-bound (saturated link): increasing workers doesn’t help. The bandwidth is already at its limit, and more concurrent requests compete for the same pipe.

If increasing workers reduced the time proportionally, that indicates the bottleneck was latency. If it didn’t move the needle, the link was probably already saturated.

Measure each step separately. Most CI platforms have per-step timestamped logs. If they don’t, time works:

```
time ./your-upload-script.sh
```

The command reports wall-clock time and CPU time. For I/O work, you’ll see high wall-clock with low CPU — which confirms the process was waiting, not computing.

*Want to investigate further? strace -c -p <PID> collects system call statistics and prints a summary at the end, useful for identifying whether read, write, and sendto are dominating the time. On macOS, the equivalent is dtruss, but recent versions require disabling System Integrity Protection (SIP) to work.*

## What to do once you confirm it’s I/O

Switch the protocol. S3 supports parallel uploads of multiple objects simultaneously, with SDKs that implement parallelism and retry natively. For pipelines with hundreds of small files, this difference shows up directly in total upload time.

Adjust parallelism. A reasonable starting point is between 2x and 4x the number of cores — not because cores and I/O have a causal relationship, but because it’s a useful proxy when no better data is available. Increase gradually and observe whether time keeps falling. When it stops, you’ve found the link ceiling.

Reduce the volume transferred. Artifact caching between deploys, incremental transfer, and compression of text assets (JS, CSS, HTML) work well. Compression doesn’t help with already-compressed files such as images and fonts.

More CPU and more memory won’t move the needle if the process is blocked waiting for the network.

## How we applied this at Azion

Static file upload was taking between 1 minute 35 seconds and 1 minute 45 seconds. With hundreds of assets, that step alone delayed every release. The first hypothesis was to increase the CPU and memory of the execution environment. The result was zero.

Measurements indicated that the step was bottlenecked primarily by the cost of multiple sequential network operations and the low parallelism of the upload process.

The solution came on two fronts: migration to Azion Object Storage via the S3 protocol, which supports parallel uploads of multiple files simultaneously, and increasing CLI parallelism from a fixed value of 5 workers to up to 20 simultaneous workers, calculated dynamically based on CPU cores as a starting heuristic. Both changes together brought upload time down to between 3.5 and 9 seconds — a 90% reduction.

The engineering team documented the full process, including the architecture decisions, the dynamic worker allocation code, and the benchmarks. [Read the full post here](/site/blog/azion-cli-static-uploads-90-percent-faster).

## The impact on the development cycle

A slow upload fragments the flow. You kick off the process, open another tab, and lose context. With upload dropping from nearly two minutes to under ten seconds, the cycle between writing code and seeing the result live becomes short enough to test, adjust, and redeploy before losing the thread.

For teams that deploy multiple times a day, this difference accumulates in the amount of work you can do without interruption.

These improvements are already in the Azion Console pipeline. If you’ve deployed through Azion in the last few weeks, you’re already running on the new pipeline — no changes needed in your project.

*CLI v4.21.0 or higher to run with the upload improvements. If you don’t use Azion yet, create your account at* [azion.com](https://www.azion.com/en/)*and make your first deploy today.*

---

## Frequently asked questions

**How do I know if my CI/CD pipeline has an I/O bottleneck rather than a CPU bottleneck?** Monitor CPU usage during the slowest pipeline step with top or htop. If CPU stays below 30–40% while execution time grows, the process is probably waiting on network or disk operations, not performing processing work. To confirm, compare the wall-clock time against the CPU time reported by the time command — high wall-clock with low CPU is the typical signature of an I/O bottleneck.

**Why does increasing parallel workers solve I/O bottlenecks in some cases but not others?** It depends on the type of bottleneck. If the problem is latency — many small requests waiting for individual responses — increasing workers helps because you overlap wait times, reducing total time. If the problem is saturated bandwidth, more workers don’t help because the link is already at its limit and additional requests compete for the same pipe. The practical test: if doubling the number of workers reduces time proportionally, the bottleneck was latency. If it doesn’t move the needle, the limit is available bandwidth.

**What is the difference between a CPU bottleneck, a disk I/O bottleneck, and a network I/O bottleneck in CI/CD pipelines?** A CPU bottleneck occurs when the process is actively using available cores — heavy compilation, transpilation, minification. Adding CPU or thread parallelism helps directly. A disk I/O bottleneck happens during file read and write operations — dependency installation on slow disks, generation of many small files. SSDs and artifact caching are the main mitigations. A network I/O bottleneck is the most common in upload and download steps — artifact transfers, Docker image pulls, repository cloning. Time depends on protocol, parallelism, and latency to the destination, not runner resources.
