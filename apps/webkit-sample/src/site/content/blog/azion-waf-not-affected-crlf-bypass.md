Web Application Firewalls (WAFs) are a key part of the security infrastructure for any web-based application or service, protecting it from attacks that can cause monetary and reputation damage. As such, ways to bypass the filtering and blocking capabilities of a WAF are highly sought after by cybercriminals.

In December 2022, [we talked about](/site/blog/recent-waf-bypass-attack-does-not-affect-azion-web-application-firewall) one of those bypasses, discovered by Team82, the security research team from Claroty. It affected multiple web application firewalls offered by several popular vendors. Azion’s WAF, on the other hand, was immune to the attack that enabled the bypass.

Now, security researchers at Praetorian have found another bypass1, which affects Akamai’s WAF. And it may not be the only one vulnerable: the researchers say that “we also do not intend for this article to single out Akamai in particular. Rather, we suspect that attackers could use similar bypass techniques against just about every web application firewall product on the market”.

However, after internal evaluation, we can confidently ensure that Azion’s WAF is not vulnerable to this new attack.

## How the attack works

According to Praetorian, this is a “CRLF Injection Attack.” This kind of attack occurs “when an application does not perform proper filtering and returns an HTTP response header that includes attacker-controlled user input. This type of vulnerability allows an attacker to insert carriage return (abbreviated CR and often represented as ‘\r’) and line feed (abbreviated LF and often represented as ‘\n’) characters into the HTTP response body”.

With this, an attacker may “end up controlling both HTTP headers and data within the HTTP response body. This issue can lead to other vulnerabilities such as cross-site scripting and open redirection vulnerabilities”.

Going one step further, the engineers tried to exploit the vulnerability by adding a <script>alert(“XSS”)</script> payload into the HTTP response body. However, this was correctly blocked by the WAF, as its rules detected the <script> tag.

What do you do to avoid detection? You obfuscate. “We hypothesized that we could inject a header using CRLF injection to specify that the HTTP response body is compressed,” the engineers say. “In this case, we didn’t need to modify the core XSS payload as we rely on the compression to bypass the WAF rules.”

They chose the deflate compression algorithm and injected a Content-Encoding header specifying it. A Content-length header, determining the exact size of the compressed payload, was also added. The experiment worked.

According to the engineers, this technique is worth of note since “the combination of chaining a CRLF injection issue to trigger cross-site scripting and bypassing a web application firewall by injecting compressed data into the response body is a novel approach. We are not aware of another article that discusses this method.”

## Why Azion’s WAF is not affected?

After hearing about this bypass, our security team tested the proof of concept for the CRLF Injection Vulnerability, presented by Praetorian, against Azion’s Web Application Firewall.

Two tests were executed in a controlled environment using Azion’s WAF. Our security team used a security testing tool called Burp Suite Professional to carry out simulated attacks. This software allows a researcher to create different types of requests for a given system and validate its response behavior.

On the first test, we simulated an attacker trying to set a cookie (using the *Set-Cookie* statement) with a key/value pair of “crlf=injection” by adding an URL-encoded newline character (%0a) to the GET request. As you can see below in the Response field, the statement wasn’t interpreted, and the cookie was not set.

<Frame src="https://www.azion.com/assets/content/blog/uploads/screenshot-waf-marcado-01.png" alt="In a first attempt, a CRLF is inserted into a GET request to try to set a cookie. The manipulated request is ignored and the cookie is not set." />

*First attempt, using a newline character to set a cookie. Image: Azion Technologies.*

On the second test, we again injected a CRLF on the GET request (not visible on the image) to try and set fraudulent *Content-Type*, *Content-Encoding*, and *Content-Length* headers. The attempt was successfully blocked by Azion’s WAF, which returned an HTTP 400 error code (Bad Request).

<Frame src="https://www.azion.com/assets/content/blog/uploads/screenshot-waf-marcado-02.png" alt="A CRLF is used to try and set HTTP headers specifying a compressed malicious payload. The request is blocked" />

*Second attempt, trying to set fraudulent headers. The request is blocked. Image: Azion Technologies.*

## Conclusion

The results obtained in both tests prove once again the efficacy of Azion’s WAF in protecting our customers from zero-day threats. According to Marcos R. Carvalho, Security Architect at Azion: “This was all accomplished using Azion’s standard rules and proprietary scoring algorithm, without the need for additional regular expressions.”

[Sign-up](https://console.azion.com/signup/) for a free trial and see for yourself how Azion’s Web Application Firewall can help you protect your applications and services against various types of threats, or [contact our experts](https://www.azion.com/en/contact/) to find out more.

#### References

1 [Bypassing Akamai’s Web Application Firewall Using an Injected Content-Encoding Header](https://www.praetorian.com/blog/using-crlf-injection-to-bypass-akamai-web-app-firewall/)
