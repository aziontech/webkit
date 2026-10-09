If your company does not have effective defense against zero-day attacks, it is not adequately protected on the web. One of the most crucial aspects of a Web Application Firewall (WAF) is its ability to mitigate threats that exploit new vulnerabilities, commonly referred to as “zero-day attacks”, which are often unknown even to the developers of the affected software.

Unlike many solutions—including those from global providers—Azion’s Web Application Firewall stands out for never having experienced a bypass (a term used to indicate an attack capable of circumventing the protection offered by the WAF). It also excels in safeguarding our customers against vulnerabilities and waves of critical attacks, as illustrated in the cases enumerated below.

## 1. ​​Apache HTTP Server Exploit (CVE-2021-41773)

On September 29, 2021, the Apache security team discovered a vulnerability (CVE 2021-41773) that attackers were exploiting to compromise Apache web servers and access confidential files. In practice, they exploited a change in the Apache HTTP Server 2.4.49, which facilitated a type of attack known as “path traversal”. This allowed them to gain access to files and directories stored outside the web server’s root folder.

The potential for an attacker to take full control of the server through remote code execution underscored the severity of the situation. Fortunately, our customers were already protected against this zero-day threat, as Azion’s Web Application Firewall allows the activation of specific rule sets for Remote File Intrusions (RFI) and Directory Traversal, which we highly recommend be enabled and set to the “High” sensitivity level at all times.

## 2. Claroty WAF Bypass

During the Black Hat Europe 2022 conference in London, Team82, the security research team from Claroty, unveiled a generic method to bypass WAFs offered by various global vendors. This technique relies on an SQL injection (SQLi) attack, which effectively leverages JSON syntax—an open and standardized file format for data exchange—to render SQL commands invisible to certain WAF solutions.

At the time of the discovery, many WAFs still lacked support for JSON, providing researchers with a loophole to craft new SQL injection payloads capitalizing on this vulnerability. In the tests conducted by Azion, it was found that the standard WAF protection against SQLi, set to the highest sensitivity level and without the need for additional or custom rules, proved to be sufficient in blocking these attacks.

## 3. CRLF Injection Bypass

In 2023, a new attack called CRLF injection emerged. According to security researchers at Praetorian, this occurs when “an application does not correctly perform filtering and returns an HTTP response header that includes user input controlled by the attacker.”

Our security team conducted two tests using the proof of concept presented by Praetorian, employing Azion’s WAF in a controlled environment. In both cases, the WAF successfully blocked the CRLF injection attempts, without the need for additional regular expressions.

One of the main factors for Azion’s WAF success in mitigating zero-day attacks is its blocking algorithm based on scoring, but that’s not all. The solution enables the use of pre-established rules that can be customized and also complemented by edge functions, according to the specific needs of the business.

[Contact our experts](https://www.azion.com/en/contact/?utm_source=blog&utm_medium=site&utm_campaign=blog-post&utm_term=contact-sales&utm_content=site) and learn how we can help your business take security to the next level.
