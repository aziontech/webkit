For years, Web Application Firewalls (WAFs) have been a key part of the security infrastructure for any web-based application or service, protecting them from malicious HTTP traffic and attacks such as SQL Injection (SQLi), Cross-Site Scripting (XSS) and more.

A successful SQLi attack can expose to criminals the content of databases with customer or business information, with untold potential for damage. As such, ways to bypass the filtering and blocking capabilities of a WAF are highly sought after by cybercriminals.

Recently, Team82, the security research team from Claroty, introduced1 a generic bypass of multiple web application firewalls sold by several popular vendors. The findings were presented during the Black Hat Europe 2022 conference in London.

## How the bypass works

The technique presented is, at its core, an SQL injection attack. WAFs are designed to protect against this, so the researchers had to find a way to obfuscate the SQL payload, rendering it invisible to certain WAFs.

The key was adding JSON syntax to the payload. Most SQL databases support JSON, a standard file and data exchange format, for basic searches, modifications, and a range of functions and operators.

Many WAFs, however, have been slow to add JSON support. This allowed the researchers to “craft new SQL injection payloads that include JSON that bypassed the security WAFs provide.”

<Frame src="https://www.azion.com/assets/content/blog/uploads/claroty_waf_bypass.png" alt="Color-coded example of a payload using the WAF bypass technique" />

**Color-coded example of a payload using the WAF bypass technique described by Team82 Image: Team82/Claroty**

“Attackers using this novel technique could access a backend database and use additional vulnerabilities and exploits to exfiltrate information via either direct access to the server or over the cloud,” says Noam Moshe, a Vulnerability Researcher at Claroty.

“This is especially important for OT and IoT platforms that have moved to cloud-based management and monitoring systems. WAFs offer a promise of additional security from the cloud; an attacker able to bypass these protections has expansive access to systems.”

## Azion’s WAF is not affected

After hearing about the bypass, Azion’s security team tested all proofs of concept presented by Team82 against its own Web Application Firewall.

All tests were performed in a controlled environment using Azion’s WAF without any additional custom rules, only the out-of-box SQL Injection protection setting set to the highest sensitivity level (which we recommend for our customers).

Azion’s security team used a security testing tool called Burp Suite Professional to carry out simulated attacks. This software allows a researcher to create different types of requests for a given system and validate its response behavior.

According to Marcos R. Carvalho, a Security Architect at Azion, when trying to replicate the scenarios proposed by Team82, Azion’s WAF successfully blocked all the attacks. This was all accomplished using Azion’s standard rules and proprietary scoring algorithm, without the need for additional regular expressions.

<Frame src="https://www.azion.com/assets/content/blog/uploads/attack_annotated_v2.png" alt="One of the attacks demonstrated by Team82 is blocked by Azion's Web Application Firewall" />

**One of the attacks demonstrated by Team82 is blocked by Azion's Web Application Firewall. Image: Azion Technologies.**

“The main feature of the WAF offered by Azion are the rules that detect the presence of special characters in specific positions of a request, including the URL,” says Carvalho. When those rules are triggered, the request is blocked and the server returns a 400 (Bad Request) response code. In the example pictured, Azion WAF detected several abnormal characters in the request, including quotes [‘], colon [:], and parenthesis [)].

In fact, when building its WAF, Azion decided to use smart rulesets rather than signatures, which constantly need to be updated and offer no protection against zero-day vulnerabilities.

## Conclusion

By conducting a thorough analysis and responsibly disclosing the issue to the affected parties, Team82 did a service to the whole industry. “We leave here our thanks and appreciation to the entire white hat community,” says Marcos. “Only by testing systems can we offer the best security features to our customers.”

[Sign up](https://console.azion.com/signup/) for a free trial and see for yourself how Azion’s Web Application Firewall can help you protect your applications and services against various types of threats, or [contact our experts](https://www.azion.com/en/contact/) to find out more.

#### References

1 [{JS-ON: Security-OFF}: Abusing JSON-Based SQL to Bypass WAF](https://claroty.com/team82/research/js-on-security-off-abusing-json-based-sql-to-bypass-waf)
