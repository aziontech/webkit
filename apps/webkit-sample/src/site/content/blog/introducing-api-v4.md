We are launching our three core innovations: **Workloads**, **Edge Connector**, and **Custom Pages**, delivering enhanced performance, security, and streamlined resource management.

Together with them, we also release **API v4**, a major platform evolution that redefines how developers build, protect, and scale applications. This update is more than an API change - it introduces new core concepts and products that transform the entire Azion platform, bringing significant enhancements to both the API and Azion Console.

These changes fundamentally improve how you interact with and manage your edge infrastructure.

## Three Important Innovations

### 1. Workloads: Centralized Application Management

Workloads replace the domain-centric approach with application-focused resource management. This Kubernetes-inspired model enables you to:

- Group related components (domains, protocols, security policies) into logical units.
- Associate multiple domains with a single edge application.
- Maintain consistent configurations across environments.
- Simplify deployment, scaling, and maintenance operations.

[Learn more about Workloads](https://www.azion.com/en/documentation/products/secure/workloads/).

### 2. Edge Connector: Optimized and Secure Backend Integration

Edge Connector centralizes backend connectivity, consolidating origin management into reusable configurations that multiple applications can share. Key features include:

- Support for HTTP, Edge Storage, and Live Ingest connections.
- Advanced load balancing with multiple algorithms.
- Configurable timeouts and retry mechanisms.

Edge Connector now holds HMAC and Origin Shield security.

[Learn more about Edge Connector](https://www.azion.com/en/documentation/products/secure/edge-connector/).

### 3. Custom Pages: Advanced Error Response Management

Custom Pages transforms error handling from application-specific configurations into centralized, reusable response systems. Benefits include:

- Comprehensive status code coverage beyond basic 404 and 500 errors.
- Per-status code Edge Connector assignment.
- Granular control over caching behavior.
- Consistent branding across distributed applications.

[Learn more about Custom Pages](https://www.azion.com/en/documentation/products/secure/custom-pages/).

## What’s New in API v4

### Event-Driven Architecture

API v4 features a new asynchronous, event-driven architecture that eliminates traditional synchronous bottlenecks. The platform now confirms requests immediately while orchestrating execution through optimized background processes, resulting in faster deployment cycles and reduced operational overhead.

API v4 represents a strategic platform evolution, providing the foundation for future innovations while delivering immediate benefits in performance, security, and operational efficiency.

### Enhanced Security

- **JWT and OAuth 2.0** authentication for enterprise-grade security.
- **GraphQL-accessible activity history** for complete operational traceability.
- **Granular access controls** with role-based permissions.
- **Comprehensive audit logs** for compliance and security monitoring.

## Rollout Information

Starting **August 5, 2025**, new developer accounts will default to API v4. Existing accounts will be updated in scheduled waves and the migration process will occur over the next six months.

The API v3 discontinuation deadline will be defined and communicated after the initial rollout phases, giving all users adequate time to transition.

### How to test new features

New Developer accounts will have access to the updated features. To evaluate them, you can create a personal account independently of your organization’s account to test the new functionality.

## Action Required

Most users won’t need to take any action, as the migration process is automatic and preserves existing configurations, but if you use custom automations, scripts, or CI/CD pipelines with Azion’s API, plan to update them to use v4 endpoints.  Please review your integrations to ensure compatibility after migration.

If you need help or more information, please contact our [support team](https://www.azion.com/en/documentation/services/support/) or ask [Azion Copilot](https://console.azion.com/copilot).
