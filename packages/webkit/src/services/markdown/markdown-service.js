import { generateCodeBlock, generateTabbedCodeBlock } from './code-block.js'

export const parseMarkdown = (markdown) => {
  if (!markdown) return ''

  let text = markdown

  // Extract CodeBlockTabs content FIRST to protect it from processing
  const codeBlockTabsContents = []
  text = text.replace(/<CodeBlockTabs>([\s\S]*?)<\/CodeBlockTabs>/gi, (match) => {
    codeBlockTabsContents.push(match)
    return `@@CODEBLOCKTABS_EARLY${codeBlockTabsContents.length - 1}@@`
  })

  // Extract CodeBlock content to protect it from italic/bold processing
  const codeBlockContents = []
  text = text.replace(/<CodeBlock\s+[^>]*>([\s\S]*?)<\/CodeBlock>/gi, (match) => {
    codeBlockContents.push(match)
    return `@@CODEBLOCK_EARLY${codeBlockContents.length - 1}@@`
  })

  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')

  text = text
    .replace(/\\#/g, '#')
    .replace(/\\\*/g, '*')
    .replace(/\\_/g, '_')
    .replace(/\\-/g, '-')
    .replace(/\\\[/g, '[')
    .replace(/\\\]/g, ']')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')

  text = text
    .replace(/^######\s+(.*$)/gim, '<h6 class="font-sora display-6 display-6-mobile mb-2">$1</h6>')
    .replace(/^#####\s+(.*$)/gim, '<h5 class="font-sora display-5 display-5-mobile mb-3">$1</h5>')
    .replace(/^####\s+(.*$)/gim, '<h4 class="font-sora display-4 display-4-mobile mb-4">$1</h4>')
    .replace(/^###\s+(.*$)/gim, '<h3 class="font-sora display-3 display-3-mobile mb-5">$1</h3>')
    .replace(/^##\s+(.*$)/gim, '<h2 class="font-sora display-2 display-2-mobile mb-6">$1</h2>')
    .replace(/^#\s+(.*$)/gim, '<h1 class="font-sora display-1 display-1-mobile mb-8">$1</h1>')

  text = text.replace(/^\s*[-*+]\s+(.+$)/gim, '<li class="font-sora">$1</li>')

  text = text.replace(/^\s*\d+\.\s+(.+$)/gim, '<li class="font-sora">$1</li>')

  const htmlTags = []
  text = text.replace(/<[^>]+>/g, (match) => {
    htmlTags.push(match)
    return `@@HTMLTAG${htmlTags.length - 1}@@`
  })

  text = text
    .replace(
      /\*\*\*([^*\n]+(?:\n[^*\n]*)*?)\*\*\*/gs,
      '<strong class="font-sora text-white"><em class="font-sora text-white">$1</em></strong>'
    )
    .replace(
      /___([^_\n]+(?:\n[^_\n]*)*?)___/gs,
      '<strong class="font-sora text-white"><em class="font-sora text-white">$1</em></strong>'
    )
    .replace(
      /\*\*([^*\n]+(?:\n[^*\n]*)*?)\*\*/gs,
      '<strong class="font-sora text-white">$1</strong>'
    )
    .replace(/__([^_\n]+(?:\n[^_\n]*)*?)__/gs, '<strong class="font-sora text-white">$1</strong>')
    .replace(/\*([^*\n]+(?:\n[^*\n]*)*?)\*/gs, '<em class="font-sora">$1</em>')
    .replace(/_([^_\n]+(?:\n[^_\n]*)*?)_/gs, '<em class="font-sora">$1</em>')

  text = text.replace(/@@HTMLTAG(\d+)@@/g, (match, index) => {
    return htmlTags[Number(index)] ?? match
  })

  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a class="font-sora underline transition-colors text-neutral-200 hover:text-orange-600 cursor-pointer" href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  )

  text = text.replace(/(<li.*?<\/li>(?:\s*<li.*?<\/li>)*)/gs, (match) => {
    return '<ul class="font-sora mb-4 list-disc pl-6">' + match + '</ul>'
  })

  text = text.replace(
    /<Button\s+href="([^"]*)"[^>]*type="primary"[^>]*>([^<]+)<\/Button>/gi,
    (match, href, text) => {
      const targetMatch = match.match(/target="([^"]*)"/i)
      const target = targetMatch ? targetMatch[1] : '_self'
      return `<a href="${href}" target="${target}" class="group flex w-fit items-center font-proto-mono uppercase border-none active:bg-orange-700 bg-neutral-100 text-neutral-900 duration-300 transition px-5 md:px-6  rounded-md hover:bg-orange-500 hover:text-neutral-900 h-[42px] min-h-[42px] py-3 font-proto-mono text-sm leading-[2rem] whitespace-nowrap  cursor-pointer mt-5">${text}</a>`
    }
  )

  text = text.replace(/<Button.*?type="link".*?>([^<]+)<\/Button>/gi, (match, buttonText) => {
    const hrefMatch = match.match(/href="([^"]*)"/i)
    const href = hrefMatch ? hrefMatch[1] : '#'
    const targetMatch = match.match(/target="([^"]*)"/i)
    const target = targetMatch ? targetMatch[1] : '_self'
    const svg =
      target === '_blank'
        ? `<svg width="10" height="10" class="group-hover:translate-x-[.1rem] -translate-x-[.1rem]  transition-transform relative translate-y-0 group-hover:translate-y-[-50%] top-[20%]" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.32201 8.20812L7.31425 4.45914C7.31425 4.39704 7.29873 4.35047 7.26768 4.31943C7.22111 4.27285 7.15642 4.29096 7.07363 4.37376L3.40226 8.04512C3.20046 8.24693 2.96243 8.35043 2.68817 8.3556C2.41392 8.35043 2.17071 8.24176 1.95856 8.0296C1.76192 7.83297 1.6636 7.59494 1.6636 7.31551C1.6636 7.03608 1.76192 6.79805 1.95856 6.60142L5.58335 2.97662C5.66614 2.89383 5.68684 2.83173 5.64545 2.79034C5.6144 2.75929 5.56783 2.74376 5.50573 2.74376L1.78003 2.74376C1.51095 2.74376 1.2781 2.64545 1.08146 2.44881C0.88483 2.25218 0.7891 2.00639 0.794275 1.71144C0.804624 1.41131 0.910703 1.16034 1.11251 0.958533C1.30397 0.767074 1.53941 0.671344 1.81884 0.671344L8.16806 0.671344C8.49923 0.619598 8.79677 0.725677 9.06067 0.989581C9.27283 1.20174 9.37891 1.44753 9.37891 1.72696L9.38667 8.20812C9.38667 8.4772 9.278 8.72041 9.06067 8.93774C8.84851 9.1499 8.6079 9.25598 8.33882 9.25598C8.06974 9.24563 7.82912 9.13437 7.61696 8.92222C7.42033 8.72558 7.32201 8.48755 7.32201 8.20812Z" fill="#FE601F"></path></svg>`
        : `<svg width="10" height="10" class="group-hover:translate-x-[.1rem] -translate-x-[.1rem] transition-transform relative top-1/2 rotate-45" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.32201 8.20812L7.31425 4.45914C7.31425 4.39704 7.29873 4.35047 7.26768 4.31943C7.22111 4.27285 7.15642 4.29096 7.07363 4.37376L3.40226 8.04512C3.20046 8.24693 2.96243 8.35043 2.68817 8.3556C2.41392 8.35043 2.17071 8.24176 1.95856 8.0296C1.76192 7.83297 1.6636 7.59494 1.6636 7.31551C1.6636 7.03608 1.76192 6.79805 1.95856 6.60142L5.58335 2.97662C5.66614 2.89383 5.68684 2.83173 5.64545 2.79034C5.6144 2.75929 5.56783 2.74376 5.50573 2.74376L1.78003 2.74376C1.51095 2.74376 1.2781 2.64545 1.08146 2.44881C0.88483 2.25218 0.7891 2.00639 0.794275 1.71144C0.804624 1.41131 0.910703 1.16034 1.11251 0.958533C1.30397 0.767074 1.53941 0.671344 1.81884 0.671344L8.16806 0.671344C8.49923 0.619598 8.79677 0.725677 9.06067 0.989581C9.27283 1.20174 9.37891 1.44753 9.37891 1.72696L9.38667 8.20812C9.38667 8.4772 9.278 8.72041 9.06067 8.93774C8.84851 9.1499 8.6079 9.25598 8.33882 9.25598C8.06974 9.24563 7.82912 9.13437 7.61696 8.92222C7.42033 8.72558 7.32201 8.48755 7.32201 8.20812Z" fill="#FE601F"/></svg>`
    return `<a href="${href}" target="${target}" class="font-proto-mono text-base !leading-[.75rem] bg-transparent border-none text-neutral-100 pb-1 whitespace-nowrap relative after:duration-150 hover:after:w-full after:bg-neutral-200 after:left-0 after:w-0 after:h-[1px] after:transition-all after:content-[\'\'] after:absolute after:-bottom-[.1rem] w-fit items-center  flex gap-3 cursor-pointer group pt-5">${buttonText} ${svg}</a>`
  })

  text = text.replace(
    /<Button\s+href="([^"]*)"[^>]*type="secondary"[^>]*>([^<]+)<\/Button>/gi,
    (match, href, text) => {
      const targetMatch = match.match(/target="([^"]*)"/i)
      const target = targetMatch ? targetMatch[1] : '_self'
      return `<a href="${href}" target="${target}" class="group flex w-fit items-center bg-neutral-950 h-[2.5rem] text-neutral-100 duration-300 transition rounded-md active:bg-neutral-900 border-1 border-[#353040] hover:bg-neutral-900 hover:text-orange-500 px-5 md:px-6 font-proto-mono text-sm leading-[2.5rem] whitespace-nowrap cursor-pointer mt-5">${text}</a>`
    }
  )

  text = text.replace(/<Divider\s*\/?>/gi, '<div class="w-full h-[2px] bg-neutral-900 my-4"></div>')

  // Restore early-extracted CodeBlockTabs content and process them
  text = text.replace(/@@CODEBLOCKTABS_EARLY(\d+)@@/g, (match, index) => {
    const content = codeBlockTabsContents[Number(index)]
    if (!content) return match

    const tabs = []
    const codeBlockRegex = /<CodeBlock\s+[^>]*>([\s\S]*?)<\/CodeBlock>/gi
    let codeBlockMatch

    while ((codeBlockMatch = codeBlockRegex.exec(content)) !== null) {
      const fullMatch = codeBlockMatch[0]
      const code = codeBlockMatch[1]

      const filenameMatch = fullMatch.match(/filename="([^"]*)"/i)
      const languageMatch = fullMatch.match(/language="([^"]*)"/i)

      const filename = filenameMatch ? filenameMatch[1] : 'code'
      const language = languageMatch ? languageMatch[1] : 'text'
      const normalizedCode = (code || '').trimEnd().replace(/^\n+/, '')

      tabs.push({ filename, language, code: normalizedCode })
    }

    return generateTabbedCodeBlock(tabs)
  })

  // Restore early-extracted CodeBlock content before processing
  text = text.replace(/@@CODEBLOCK_EARLY(\d+)@@/g, (match, index) => {
    return codeBlockContents[Number(index)] ?? match
  })

  text = text.replace(/<CodeBlock\s+[^>]*code="([^"]*)"[^>]*\/>/gi, (match, codeAttr) => {
    const filenameMatch = match.match(/filename="([^"]*)"/i)
    const languageMatch = match.match(/language="([^"]*)"/i)

    const filename = filenameMatch ? filenameMatch[1] : 'code'
    const language = languageMatch ? languageMatch[1] : 'text'
    const code = codeAttr ? codeAttr.replace(/\\n/g, '\n') : ''

    return generateCodeBlock(filename, language, code)
  })

  text = text.replace(/<CodeBlock\s+[^>]*>([\s\S]*?)<\/CodeBlock>/gi, (match, code) => {
    const filenameMatch = match.match(/filename="([^"]*)"/i)
    const languageMatch = match.match(/language="([^"]*)"/i)

    const filename = filenameMatch ? filenameMatch[1] : 'code'
    const language = languageMatch ? languageMatch[1] : 'text'
    const normalizedCode = (code || '').trimEnd().replace(/^\n+/, '')

    return generateCodeBlock(filename, language, normalizedCode)
  })

  const blocks = text.split(/\n\s*\n/)

  const processedBlocks = blocks.map((block) => {
    if (!block.trim()) return ''

    if (block.match(/^<(h[1-6]|ul|ol|li|aside|pre)/)) {
      return block.replace(/\n/g, ' ').trim()
    }

    return '<p class="font-sora mb-4">' + block.replace(/\n/g, '<br>').trim() + '</p>'
  })

  const codeBlocks = []
  const withCodeBlockPlaceholders = processedBlocks
    .filter((block) => block.trim())
    .join('\n')
    .replace(/<aside class="code-block[\s\S]*?<\/aside>/g, (match) => {
      codeBlocks.push(match)
      return `@@CODEBLOCK${codeBlocks.length - 1}@@`
    })

  const normalized = withCodeBlockPlaceholders.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim()

  return normalized.replace(/@@CODEBLOCK(\d+)@@/g, (match, index) => {
    return codeBlocks[Number(index)] ?? match
  })
}
