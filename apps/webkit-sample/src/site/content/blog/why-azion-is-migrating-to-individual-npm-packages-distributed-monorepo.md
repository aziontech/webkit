If you use Azion’s library or have worked with large-scale JavaScript libraries, you’ve probably been there: you needed a specific module, but ended up installing dependencies for several features you wouldn’t even use. That’s exactly the scenario we’re changing.

This problem, among others, led our team to rethink our library’s architecture. In this article, you’ll understand why migrating to **individual npm packages** is an important evolution for the developer experience, project performance, and the library’s long-term sustainability.

## What is Azion’s distributed monorepo architecture

Azion is evolving from a monolithic model to an architecture based on **independent packages published under the @aziontech namespace**. In practice, this means each library module now has its own lifecycle, its own version, and its own dependencies.

### How the Azion library worked in the previous model

Before, when installing the main package with:

```
npm install azion
```

You received everything: storage, SQL, AI, JWT utilities, and other modules in a single package.

While this seemed convenient at first, the model generated several side effects: larger installations, unnecessary updates, more versioning complexity, and slower build pipelines.

### What changes with individual npm packages

With the new structure, you install only the module you actually need:

```
npm install @aziontech/storage
```

And

import { createBucket } from ‘@aziontech/storage’;

This model makes the library more modular, lightweight, and predictable.

## What problems monolithic packages cause

The move to a distributed monorepo addresses real limitations of the previous model.

### Confusing versioning across independent modules

When a critical bug was fixed in a single module, like storage, the entire library needed a new version.

This meant users who only used SQL, for example, would see a library update without clearly understanding whether that change had any real impact on what they were using.

### Installation bloat and unnecessary dependencies

Anyone installing the `aziontech` package also received dependencies for features they might never use, such as:

- Webpack
- esbuild
- ajv and JSON validators
- mathjs
- and other dependencies linked to specific modules

In practice, this increased `node_modules` size, raised installation time, and created friction especially in constrained environments like serverless applications.

### Unnecessary updates for some users

If a dependency in the builder module was updated, all library users were impacted, even those who never used that module.

This created a less efficient maintenance flow and distributed the cost of updates to the entire user base, regardless of actual usage.

### Slow and inefficient CI/CD

In a monolithic package, any change to any module required full builds and tests of the entire library.

This had clear effects:

- slower pipelines
- higher resource consumption in CI/CD
- slower feedback for the development team
- higher operational cost

## How individual npm packages solve these problems

The solution was to separate each module into an independent npm package, keeping all organized under the `@aziontech` namespace.

**Before (single package)**

```
npm install azion
import { createBucket } from 'azion/storage';
```

**After (individual packages)**

```
npm install @aziontech/storage
import { createBucket } from '@aziontech/storage';
```

The change is simple from a usage perspective, but brings significant gains in maintenance, performance, and predictability.

## Key benefits of the distributed monorepo architecture

### Semantic versioning per package

Each package now has its own version:

```
@aziontech/storage@1.5.3  ← Storage changes only
@aziontech/sql@2.1.0      ← SQL changes only
@aziontech/ai@1.0.2       ← AI changes only
```

This makes versioning much clearer. When you see a new version like `@aziontech/storage@1.5.3`, you know that change is related only to the storage package.

This model better respects the purpose of semantic versioning: clearly indicating fixes, new features, and breaking changes per module.

### Lighter and more efficient installations

The practical difference can be significant:

- **Monolith:** about 50 MB with all dependencies
- **Individual package:** about 5 MB with only what’s needed

This gain matters in:

- serverless environments
- Docker containers
- projects focused on build performance
- developer experience in local installations

### Isolated dependencies and better security

If you only use storage, it doesn’t make sense to carry build dependencies or tools belonging to other modules.

With individual packages:

- the **storage** package keeps only runtime dependencies
- the **builder** package concentrates tools like webpack and esbuild
- each user installs only what they need

This reduces the attack surface, improves the relevance of security audits, and better separates runtime and build-time dependencies.

### More efficient CI/CD

In the new model, the pipeline can work only with changed packages.

**Before: full build**

```
- compile all workspaces
- test all workspaces
- release with single version
```

**After: only what changed**

```
- detect changed packages
- compile only changed
- test only changed
- release independent versions
```

The result is more speed, lower CI cost, and a more efficient feedback cycle.

### Clear documentation and changelogs

Each package can maintain its own `CHANGELOG.md:`, with specific history and no noise:

```
@aziontech/storage/CHANGELOG.md
v1.5.3: Fixed edge case in bucket creation
v1.5.2: Added support for new region

@aziontech/sql/CHANGELOG.md
v2.1.0: Added transaction support
v2.0.0: ⚠️ BREAKING: new query API
```

This makes reading, maintenance, and decision-making about upgrades easier.

### Better tree-shaking and smaller bundles

When you import only from `@aziontech/storage`, your bundler has an easier time eliminating unused code.

You don’t carry SQL, AI, or builder modules when you only need storage. The effect is a smaller, more efficient final bundle in production.

### More control over updates

In the new model, each dependency can evolve at different paces:

```
{
  "dependencies": {
    "@aziontech/storage": "1.5.3",  // Stable, rarely updated
    "@aziontech/sql": "2.1.0",      // Updated when new features arrive
    "@aziontech/ai": "1.0.2"        // Updated independently
  }
}
```

This allows:

- updating only what’s necessary
- testing breaking changes in isolation
- keeping stable versions in critical modules
- reducing risk in upgrades

### Compatibility with modern monorepo tools

The new architecture also integrates better with widely used tools in the JavaScript ecosystem:

- **npm workspaces** for native management
- **Lerna** for independent versioning and publishing
- **TurboRepo** for caching and build acceleration
- **Nx** for advanced monorepo orchestration

This brings the library closer to how modern teams already organize and scale code.

## How the Azion library migration to individual packages will work

The transition was designed to be gradual and predictable.

### Phase 1: warnings, documentation, and coexistence

In this stage, Azion maintains an adaptation period with:

- deprecation warnings in the monolithic package
- updated documentation
- migration guides
- coexistence between the old and new models

### Phase 2: complete transition to the new standard

In the next phase:

- individual packages become the standard
- the monolithic package receives only critical fixes
- migration continues gradually, without pressure for abrupt changes

## How the change works in practice: old vs. new workflow

### Previous workflow with the monolithic package

```
// Installs everything
npm install azion

// Imports from the monolith
import { createBucket } from 'azion/storage';
import { createDatabase } from 'azion/sql';

// Updates everything at once
npm update azion
```

### New workflow with individual packages

```
// Installs only what you need
npm install @aziontech/storage @aziontech/sql

// Imports from specific packages
import { createBucket } from '@aziontech/storage';
import { createDatabase } from '@aziontech/sql';

// Updates only what you need
npm update @aziontech/storage
npm update @aziontech/sql
```

The gain is direct: more control. More clarity. Less noise.

## Monolith vs. individual packages: overall comparison

| **Aspect** | **Monolith** | **Individual Packages** |
|---|---|---|
| **Versioning** | One number for all | Independent per package |
| **Installation size** | All dependencies | Only what’s needed |
| **CI/CD speed** | Full build always | Only changes |
| **Upgrade flexibility** | Everything together | Control per package |
| **Security** | All dependencies | Minimal dependencies |
| **Documentation** | One giant changelog | Changelog per package |
| **Tree-shaking** | Limited | Optimized |

## Why this change matters for Azion users

This migration starts from a simple idea: respect the developer’s choice.

Not every team needs all modules in the library. And imposing a large, coupled package on someone who only needs a specific feature isn’t sustainable at scale.

By adopting a distributed monorepo model with independent packages, Azion now operates more aligned with modern practices in the JavaScript ecosystem:

- modularity
- more precise semantic versioning
- clear responsibility per package
- better maintenance scalability

For Azion users, this means:

- smaller bundles
- more predictable updates
- more control over dependencies
- less coupling between modules
- a more efficient experience in development and deployment

The migration is already underway. And as it progresses, it will become increasingly clear why this was the natural next step for the library’s evolution.

Create your application now. Sign up at [console.azion.com](http://console.azion.com/)
