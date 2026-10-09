A new API goes into production. The team has reviewed the code and tested the functionality, but are the protection rules active? Has the WAF been associated with the application? Have request limits been configured for sensitive routes? These checks help prevent a gap between deployment and traffic protection.

Applications, APIs, and AI agent endpoints need this protection from the first request. SAST and SCA help identify risks in code and dependencies before deployment; WAF, Firewall rules, and controls against abusive automation act on production traffic. Connecting these stages means defining the necessary protection, applying it at deployment, and verifying that it works.

## The cost of configuring protection after deployment

Applications increasingly combine microservices, internal APIs, external integrations, and serverless components. This architecture can accelerate delivery, but it also expands the number of points receiving traffic that need protection.

When security is configured after deployment through tickets or manual changes in separate consoles, a window of exposure can emerge. As the number of applications grows, reviews may struggle to keep pace with releases, and new applications can enter production with less protection than those already reviewed.

This fragmentation also affects operations:

| **Area** | **Operational impact** | **Observable sign** |
|---|---|---|
| Cost | Repeated configurations and potential duplication of events in SIEM and Analytics. | The team consults multiple consoles to explain a block and reconciles conflicting evidence. |
| Efficiency and investigation | Maintaining policies across different tools increases operational work. | Finding the cause of a false positive and adjusting the rule takes hours. |
| Security and availability | New applications may receive less protection than those already reviewed. | An application appears in the inventory without the expected policy. |

A reusable protection baseline helps reduce this effort. The security team defines and approves shared controls; engineering associates them with applications during deployment. Specific rules and exceptions are still assessed according to the risk of each case.

## An approved baseline for every new application

The starting point is to define the minimum set of Firewall rules, WAF, Network Lists, and rate limiting the organization considers appropriate. This baseline can be shared across applications and adjusted to their routes, exposure, and expected traffic behavior.

The same approach applies to applications developed with AI and public agent endpoints. The tool used to write code does not replace security review, and an agent endpoint also needs the controls applied to other APIs. A coding agent has a different role: it can help the team prepare configurations, subject to the organization’s permissions and approvals.

Reusing a policy avoids recreating the same controls for every release. A Network List, for example, can be updated once, with the change reflected in the rules that use it. The team maintains a shared baseline and reviews the adjustments needed for each application.

## How to integrate protection into deployment

### 1. Map traffic entry points

Identify domains, routes, APIs, agent endpoints, and integrations. The inventory needs to show where traffic enters and which services it can reach. This mapping guides the selection of controls and exceptions.

### 2. Define and associate controls

Start with the approved baseline and adjust protection to the application’s risk. WAF can protect public routes, while rate limiting helps control access frequency to endpoints such as /login. Configure the rules in Azion Firewall and associate protection with the application.

For teams using infrastructure as code, the configuration can be versioned alongside the application. This makes it possible to track proposed controls and the history of changes.

### 3. Review changes and exceptions

The security team evaluates rules, limits, and sensitive changes before deployment. Routes such as /login and /checkout may require additional controls and specific approval.

Reviews follow the organization’s established process. In workflows with versioned configurations, pull requests and repository history help identify who proposed and approved a change.

### 4. Apply the configuration through the team’s workflow

Controls can be configured in Azion through the Console, API, CLI, or Terraform. Execution can also be integrated into a CI/CD pipeline or performed by an authorized developer.

Coding agents can help prepare configurations with support from Azion MCP Server and operate tools according to their granted permissions. Sensitive changes remain subject to approvals and environment separation.

### 5. Validate protection after deployment

Confirm the application’s association with the Firewall and inspect events in Real-Time Events to verify WAF activity. Test requests help validate blocks, limits, and exceptions before an incident reveals a configuration error.

The expected outcome provides three pieces of evidence: the application entered production with the intended rules, a test request was blocked as expected, and the team found the record of that event.

## From configuration to the outcome of a request

In Azion, protection acts before allowed traffic proceeds to the origin. The data center receiving the request executes Firewall rules, with WAF and Bot Manager triggered according to the criteria defined in Rules Engine. DDoS Protection remains active across the platform’s distributed network of more than 100 data centers.

When a case requires specific logic, Functions can execute custom code or code from Marketplace solutions in the request flow. This logic can also call AI Inference to support an analysis. The ebook details this architecture and its components.

To validate the applied policy, the team inspects event fields in Real-Time Events through the interface or API:

- **Waf Match** indicates violations detected in the request.
- **Waf Score** shows the score by threat type. The[WAF Score documentation](https://www.azion.com/en/documentation/products/guides/how-to-find-waf-score/) explains how to read this field.
- **Stack Trace** identifies the rules executed when Debug Rules is active.

Events become available in an average of 20 to 40 seconds, with 7-day retention on the platform. For longer retention and correlation with other signals, Data Stream can send them to the organization’s analytics and SIEM tools.

## Who defines, applies, and verifies protection

Protection requires clear responsibilities throughout this process. The ebook presents an example of how these responsibilities can be divided and adapted to the organization:

| **Responsible team** | **Role in the process** | **Evidence** |
|---|---|---|
| Security | Defines minimum protection and approves exceptions and retention requirements. | Reviews, policy versions, and blocking criteria. |
| Engineering | Associates the policy with the application during deployment. | Versioned configuration, pipeline, and tests. |
| Infrastructure | Maintains origins, automation, and observability. | Resource state, events, and delivery to SIEM. |
| Audit and risk | Confirms that approved controls were applied. | Approvals and per-request records. |

The configuration and its history help identify the intended policy. Traffic events show what happened to a request. The platform also records who defined or modified a configuration and when, supporting traceability.

This information supports investigations and the collection of audit evidence. Approval and retention requirements follow each organization’s standards and processes. A coding agent’s participation preserves this division of responsibilities.

## Example of a new public API

A team launches an API for partners. It needs to accept the expected legitimate volume while also receiving protection against automated enumeration and exploitation attempts.

The team starts with the approved production baseline and adds limits appropriate for the API. The configuration is reviewed before release, and the application is associated with Firewall and WAF at deployment.

After deployment, controlled requests validate protection. The team inspects events in Real-Time Events to confirm the rules executed and sends records to SIEM through Data Stream. A later update to the shared baseline can benefit other applications that reference it, without recreating the same rules for every domain.

This example connects the stages: define controls, review the configuration, apply it, and verify the outcome in traffic.

## Start with one application and expand the model

Choose a public application, an API with known traffic volume, or an AI agent’s public endpoint. Once protection is in place and testing confirms the expected behavior, extend the baseline to other applications, adjusting the controls to each context.

Azion brings Firewall, WAF, Bot Manager, DDoS Protection, and observability together on one platform. Talk to an expert about defining a protection baseline and integrating it into your deployment process.

[Talk to an expert →](https://www.azion.com/en/contact/)
