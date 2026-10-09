## Introduction

In an exponentially growing company, we need to ensure deliveries that are increasingly relevant in an ever shorter amount of time. By running [Edge Functions](https://www.azion.com/en/products/edge-functions/) we can easily write pieces of code that are crucial to your business, without needing to set up a whole server, security, and all those things we all are familiar with.

Today, Azion’s Marketing team is responsible for all the company’s web pages. There are engineers working together with the team performing the orchestration of the pages. In this post we will look at two important problems solved using [serverless](https://www.azion.com/en/documentation/products/guides/serverless-functions/) JavaScript functions for large scale delivery.

## Solved Problems

- [Careers](https://www.azion.com/en/careers/jobs/) Portal;
- Sitemap of different projects under the same domain;

### Careers Portal

We previously worked with a third party company that generated the data and pages for the career portal, but decided it was time to sharpen the usability and add our own unique style to the design. However, to run it all we required a comprehensive understanding of all the existing structures in place, including:

- Server;
- Scalability;
- Availability;
- Security;
- Updates;

With Azion Cells (JavaScript Functions) we have everything configured by default, besides natively running JavaScript code directly at the Edge. Because we have hundreds of servers spread across all Brazilian states we can guarantee scalability. Besides, our function runs as close as possible to the user.

As Azion has a [CDN](https://en.wikipedia.org/wiki/Content_delivery_network)(Content Delivery Network) in its product catalog, we have an obligation to be always available. This automatically solves scalability problems. Because this architecture exists automatically, we have a secure environment against cracker attacks (if you don’t know the difference between hacker and cracker, [learn more here](https://www.educamaisbrasil.com.br/educacao/dicas/diferenca-entre-hacker-e-cracker)), such as [DDoS](https://owasp.org/www-community/attacks/Denial_of_Service), [Path Traverse](https://owasp.org/www-community/attacks/Path_Traversal), and other known attacks.

Have a look at the code below to see an example of JavaScript running at the edge:

```js
var conf = {}
conf.baseurl = 'https://api.resumatorapi.com/v1'
conf.apikey = 'cSontUfz4kb1098351lo904leJuWGoadl'
conf.setURL = function (path) {
  return conf.baseurl + String(path) + '?apikey=' + conf.apikey
}

///////////////////////////////////////
// ROUTE AND FILTER RESPONSE METHODS //
///////////////////////////////////////

var route = {
  _get: {
    categories: function () {
      return conf.setURL('categories/status/1')
    },

    jobs: function (req) {
      var p = convertToRestPath(
        req.url.split('get/jobs/'),
        {
          confidencial: 'false',
          private: 'false',
          status: 'open'
        },
        ['title', 'city', 'department']
      )

      return conf.setURL(`/jobs${p}`)
    },

    jobslen: function (req) {
      var p = convertToRestPath(
        req.url.split('get/jobslen/'),
        {
          confidencial: 'false',
          private: 'false',
          status: 'open'
        },
        ['department']
      )

      return conf.setURL(`/jobs${p}`)
    },

    job: function (req) {
      var urlSplited = req.url.split('get/job/')
      var p = convertToRestPath(urlSplited, { jobs: urlSplited[1] }, ['jobs'])

      return conf.setURL(p)
    }
  },
  _options: {
    categories: function () {
      return conf.setURL('categories/status/1')
    },

    jobs: function (req) {
      var p = convertToRestPath(
        req.url.split('get/jobs/'),
        {
          confidencial: 'false',
          private: 'false',
          status: 'open'
        },
        ['title', 'city', 'department']
      )

      return conf.setURL(`/jobs${p}`)
    },

    jobslen: function (req) {
      var p = convertToRestPath(
        req.url.split('get/jobslen/'),
        {
          confidencial: 'false',
          private: 'false',
          status: 'open'
        },
        [
          //'title',
          //'city',
          'department'
          //'team_id'
        ]
      )

      return conf.setURL(`/jobs${p}`)
    },

    job: function (req) {
      var urlSplited = req.url.split('get/job/')
      var p = convertToRestPath(urlSplited, { jobs: urlSplited[1] }, ['jobs'])

      return conf.setURL(p)
    }
  }
}

var filter = {
  //  Each route item should have the own filter
  // is the step used to filter the reponse of the Jazz API Request
  _helper: {
    filter: {
      job: function (data) {
        var job = {}

        if (data.id) {
          job['id'] = data.id
        }
        if (data.title) {
          job['title'] = data.title
        }
        if (data.country_id) {
          job['country_id'] = data.country_id
        }
        if (data.city) {
          job['city'] = data.city
        }
        if (data.state) {
          job['state'] = data.state
        }
        if (data.department) {
          job['department'] = data.department
        }
        if (data.team_id) {
          job['team_id'] = data.team_id
        }
        if (data.description) {
          job['description'] = data.description
        }
        if (data.internal_code) {
          job['internal_code'] = data.internal_code
        }
        if (data.type) {
          job['type'] = data.type
        }

        return job
      }
    }
  },

  _get: {
    categories: function (data) {
      var listCategories = []

      if (!Array.isArray(data)) {
        return listCategories
      }

      data.map(function (item) {
        var name = item.name
        if (name) {
          listCategories.push(name)
        }
      })

      return listCategories
    },

    jobs: function (data) {
      var listJobs = []

      if (!Array.isArray(data)) {
        if (Object.keys(data).length) {
          data = [data]
        } else {
          return listJobs
        }
      }

      data.map(function (item) {
        listJobs.push(filter._helper.filter.job(item))
      })

      return listJobs
    },

    jobslen: function (data) {
      var listJobs = []

      if (!Array.isArray(data)) {
        if (Object.keys(data).length) {
          data = [data]
        } else {
          return { length: listJobs.length }
        }
      }

      data.map(function (item) {
        listJobs.push(filter._helper.filter.job(item))
      })

      return { length: listJobs.length }
    },

    job: function (data) {
      return filter._helper.filter.job(data)
    }
  },

  _options: {
    categories: function () {
      return []
    },

    jobs: function () {
      return {}
    },

    jobslen: function () {
      return {}
    },

    job: function (data) {
      return {}
    }
  }
}

///////////////////////
// HELPERS FUNCTIONS //
///////////////////////

function path(url) {
  // Example: Using a url path like foo/bar
  // the first / will be a empty string in a first value
  var splitedUrl = url.split('/')
  var lenSplitedUrl = splitedUrl.length
  var hasPath = (lenSplitedUrl && lenSplitedUrl) >= 6

  return hasPath ? splitedUrl[6] : undefined
}

function convertToRestPath(path, filter, extract) {
  // Convert JavaScript Object to
  // Restful URL
  //
  // Example:
  // Data = {
  //     confidencial: 'false',
  //     department  : 'Products',
  //     status      : 'open'
  // };
  //
  // Converted to >> confidencial/false/department/Products/status/open

  if (!path) {
    path = []
  }

  if (!filter) {
    filter = {}
  }

  if (!extract) {
    extract = []
  }

  var u = ''
  var pathList = (path[1] || '').split('/')
  var dataPath = {}
  var data = {}

  for (var i = 0; i <= pathList.length; i++) {
    if (pathList[i] && pathList[i + 1]) {
      dataPath[pathList[i]] = pathList[i + 1]
      i = i + 1
    }
  }

  for (var i = 0; i <= extract.length; i++) {
    data[extract[i]] = dataPath[extract[i]] || undefined
  }

  for (var attr in data) {
    var strValue = data[attr]

    if (typeof strValue === 'string') {
      u += `/${attr}/${strValue}`.trim()
    }
  }

  for (var attr in filter) {
    var strValue = filter[attr]

    if (typeof strValue === 'string') {
      u += `/${attr}/${strValue}`.trim()
    }
  }

  return decodeURI(u)
}

/////////////////////
// REQUEST HANDLER //
/////////////////////

async function handleRequest(request) {
  var response

  var method
  var routePath
  var routeRequest
  var responseFilter

  var fetchURL
  var fetchResponse
  var fetchResponseJSON
  var filteredResponse

  try {
    method = '_' + request.method.toLowerCase()
    routePath = path(request.url)
    routeRequest = route[method][routePath]
    responseFilter = filter[method][routePath]

    fetchURL
    fetchResponse
    fetchResponseJSON
    filteredResponse

    fetchURL = encodeURI(typeof routeRequest === 'function' ? routeRequest(request) : '/')
    fetchResponse = await fetch(fetchURL).catch((error) => {
      throw error
    })

    if (fetchResponse.ok) {
      fetchResponseJSON = await fetchResponse.json().catch((error) => {
        throw error
      })
      filteredResponse = responseFilter(fetchResponseJSON)

      response = new Response(`\n${JSON.stringify(filteredResponse)}\n\n`)
    } else {
      response = new Response(`\n${JSON.stringify({})}\n\n`, {
        type: fetchResponse.type,
        status: fetchResponse.status,
        status_name: fetchResponse.statusText
      })
    }

    response.headers.set('Content-Type', 'application/json')
    response.headers.set('Server', 'Azion Edge Server')
  } catch (error) {
    response = new Response(`\n${JSON.stringify({})}\n\n`, {
      status: 500
    })

    response.headers.set('X-Error', error)
    response.headers.set('X-Error-Message', error.message)
  }

  return response
}

///////////////////
// REQUEST LISTENER //
/////////////////////

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
```

<Frame src="https://www.azion.com/assets/content/blog/uploads/serverless-javascript-functions.png" alt="" />

A small piece of code that fetches data from anywhere, used to build our [Career Portal.](https://www.azion.com/en/)

**NOTE:** The API Key is merely illustrative.

Incredible, right? But it’s not over yet, I’ll tell you right away how we put together our sitemap from different repositories in a single delivery.

### Azion.com Sitemap

We could write another post about this part, but I want to show how easy and important it is to use JavaScript on the edge. We are currently using [Jekyll](https://jekyllrb.com/) to work with [SSG](https://www.azion.com/en/learning/performance/when-to-use-ssr-or-ssg/) in some parts of Azion website, such as:

- [Documentation](https://www.azion.com/en/documentation/)
- [Blog](https://www.azion.com/en/blog/)
- [Success cases](https://www.azion.com/en/resource-hub/)

The domain is the same but the projects are separate, they are separate Jekyll, deploy independently and each one uses a bucket, so we can clean without fear.

To get this all together, each project generates a sitemap.json file. During build the existing urls are written to this json.

The input is something like:

```
{% raw %}
---
# Automated Sitemap
---
{%- for page in site.html_pages -%}
    {%- assign index = index | push: page | uniq -%}
{%- endfor -%}
{%- for post in site.posts -%}
    {%- assign index = index | push: post | uniq -%}
{%- endfor -%}
{
    "pt-br": [
    {%- for document in index -%}
        {% if document.permalink_pt-br.size &amp;amp;gt; 0 %}"https://www.azion.com/pt-br{{ document.permalink_pt-br }}"{% if forloop.last != true %},{% endif %}{% endif %}
    {%- endfor -%}
    ],
    "en": [
    {%- for document in index -%}
        {% if document.permalink.size &amp;amp;gt; 0 %}"https://www.azion.com/en/{{ document.permalink }}"{% if forloop.last != true %},{% endif %}{% endif %}
    {%- endfor -%}
    ],
    "es": [
    {%- for document in index -%}
        {% if document.permalink_es.size &amp;amp;gt; 0 %}"https://www.azion.com/es{{ document.permalink_es }}"{% if forloop.last != true %},{% endif %}{% endif %}
    {%- endfor -%}
    ],
    "all": [
        {%- for document in index -%}
        {
            {% if document.permalink_pt-br.size  &amp;amp;gt; 0 %}"pt-br": "https://www.azion.com/pt-br{{ document.permalink_pt-br }}"{% if document.permalink.size &amp;amp;gt; 0 or document.permalink_es.size &amp;amp;gt; 0 %},{% endif %}{% endif %}
            {% if document.permalink.size &amp;amp;gt; 0 %}"en": "https://www.azion.com/en/{{ document.permalink }}"{% if document.permalink_es.size &amp;amp;gt; 0 %},{% endif %}{%- endif -%}
            {% if document.permalink_es.size &amp;amp;gt; 0 %}"es": "https://www.azion.com/es{{ document.permalink_es }}"{% endif %}
        }{% if forloop.last != true %},{% endif %}
        {%- endfor -%}
    ]
}
{% endraw %}
```

And the output is:

```json
"pt-br": [
         "https://www.azion.com/pt-br/casos-de-sucesso/unicesumar/",
         "https://www.azion.com/pt-br/casos-de-sucesso/renner/",
         "https://www.azion.com/pt-br/casos-de-sucesso/getninjas/",
         "https://www.azion.com/pt-br/casos-de-sucesso/agibank/",
         "https://www.azion.com/pt-br/casos-de-sucesso/getninjas/",
         "https://www.azion.com/pt-br/casos-de-sucesso/agibank/"
     ],
     "en": [
         "https://www.azion.com/en/success-case/omelete/",
         "https://www.azion.com/en/success-case/unicesumar/",
         "https://www.azion.com/en/success-case/renner/",
         "https://www.azion.com/en/success-case/getninjas/",
         "https://www.azion.com/en/success-case/agibank/",
         "https://www.azion.com/en/success-case/getninjas/",
         "https://www.azion.com/en/success-case/agibank/"
     ],
     "es": [
     ],
     "all": [
       {
           "en": "https://www.azion.com/en/success-case/omelete/"
       },
       {
           "pt-br":
    "https://www.azion.com/pt-br/casos-de-sucesso/unicesumar/",
           "en": "https://www.azion.com/en/success-case/unicesumar/"
       },
       {
           "pt-br": "https://www.azion.com/pt-br/casos-de-sucesso/renner/",
           "en": "https://www.azion.com/en/success-case/renner/"
       },
       {
            "pt-br": "https://www.azion.com/pt-br/casos-de-sucesso/getninjas/",
            "en": "https://www.azion.com/en/success-case/getninjas/"
       },
       {
            "pt-br": "https://www.azion.com/pt-br/casos-de-sucesso/agibank/",
            "en": "https://www.azion.com/en/success-case/agibank/"
       },
       {
          "pt-br": "https://www.azion.com/pt-br/casos-de-sucesso/getninjas/",
           "en": "https://www.azion.com/en/success-case/getninjas/"
       },
       {
          "pt-br": "https://www.azion.com/pt-br/casos-de-sucesso/agibank/",
        "en": "https://www.azion.com/en/success-case/agibank/"
       }
     ]
    }
```

There are 2 more json files from the blog and website (documentation is generated through the website). With these files published we can start using JavaScript Edge Functions to generate the final content.

This sitemap.xml is not a file, it is generated without caching every time it is requested, so there is no danger of a new URL being created and not going into the sitemap.

The flow is quite simple:

- Receive request which identifies that sitemap.xml is being requested;
- Fetch the json files;
- Read content;
- Build content;
- Deliver content.

```js
async function pullSitemap() {
  // to configure another sitemap
  // just add the new fetch function in the list

  return Promise.all([
    fetch('https://www.urldositemapsite.com/sitemap.json', { mode: 'no-cors' }), // site
    fetch('https://www.urldositemapblog.com/sitemap.json', { mode: 'no-cors' }), // blog
    fetch('https://www.urldositemapcases.com/sitemap.json', { mode: 'no-cors' }) // cases
  ])
}
async function extractSitemap(rlist) {
  if (!rlist) rlist = []

  var list = []
  for (var i = 0; i < rlist.length; i++) {
    list.push(rlist[i].json())
  }
  return Promise.all(list)
}
/////////////////////
// REQUEST HANDLER //
/////////////////////
async function handleRequest(request) {
  var response = []

  try {
    var xml = ''

    var headerXML =
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.w3.org/1999/xhtml http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
    var contentXML = ''
    var footerXML = '</urlset> '

    var pullsitemap = await pullSitemap()
    var extracted = await extractSitemap(pullsitemap)

    extracted.forEach(function (item) {
      var all = item.all ? item.all : []

      all.forEach(function (linkdata) {
        var defaulturl = ''
        var ptbr = linkdata['pt-br']
        var en = linkdata['en']
        var es = linkdata['es']

        var loc = ''
        var xhtmlLink = ''

        if (ptbr) {
          loc = '<loc>' + ptbr + '</loc>'
          defaulturl = ptbr
        } else if (en) {
          loc = '<loc>' + en + '</loc>'
          defaulturl = en
        } else if (es) {
          loc = '<loc>' + es + '</loc>'
          defaulturl = es
        }

        if (ptbr) {
          xhtmlLink += '\t\t<xhtml:link rel="alternate" hreflang="pt-br" href="' + ptbr + '" />\n'
        }
        if (en) {
          xhtmlLink += '\t\t<xhtml:link rel="alternate" hreflang="en" href="' + en + '" />\n'
        }
        if (es) {
          xhtmlLink += '\t\t<xhtml:link rel="alternate" hreflang="es" href="' + es + '" />\n'
        }

        xhtmlLink +=
          '\t\t<xhtml:link rel="alternate" hreflang="x-default" href="' + defaulturl + '" />\n'

        contentXML += '\t<url>\n\t\t' + loc + '\n' + xhtmlLink + '\t</url>\n'
      })
    })

    xml += headerXML
    xml += contentXML
    xml += footerXML

    response = new Response(xml.trim())
    response.headers.set('Content-Type', 'application/xml')
  } catch (error) {
    response = new Response(`\n${JSON.stringify({ error: error })}\n\n`)
    response.headers.set('Content-Type', 'application/json')
  }

  return response
}
///////////////////
// REQUEST LISTENER //
/////////////////////
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
```

That’s it, a little 80-line code builds an automatic sitemap for multiple languages without worrying about regenerating. For each new project, just add in the first lines where the list is executed by a Promise.all([]) .

It’s much simpler when you see it in practice, isn’t it?

## Considerations

The fact that we don’t have all those concerns pointed out at the beginning of the post frees us up to be able to spend development time actually developing and delivering valuable features. This reduces the infrastructure cost and changes are made on demand. And we don’t have to worry about security issues, because all of this is already built into the package when using Azion Edge Functions.
