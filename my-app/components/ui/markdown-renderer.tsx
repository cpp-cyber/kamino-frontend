import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { BundledLanguage } from "@/components/ui/kibo-ui/code-block"
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockItem,
} from "@/components/ui/kibo-ui/code-block"

interface MarkdownRendererProps {
  content: string
  className?: string
  variant?: 'default' | 'compact' | 'card'
}

export function MarkdownRenderer({ 
  content, 
  className = "", 
  variant = "default" 
}: MarkdownRendererProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'prose-sm'
      case 'card':
        return 'prose-sm prose-muted'
      default:
        return 'prose'
    }
  }

  // Helper function to render code blocks with the shadcn CodeBlock component
  const renderCodeBlock = (code: string, language?: string) => {
    const displayLanguage = language || 'text'
    const codeData = [{
      language: displayLanguage as BundledLanguage,
      filename: `code.${displayLanguage}`,
      code: code.trim()
    }]

    return (
      <div className="mb-4">
        <CodeBlock data={codeData} defaultValue={codeData[0].language}>
          <CodeBlockHeader>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium text-muted-foreground px-3 py-1">
                {displayLanguage}
              </span>
              <CodeBlockCopyButton />
            </div>
          </CodeBlockHeader>
          <CodeBlockBody>
            {(item) => (
              <CodeBlockItem key={item.language} value={item.language}>
                <CodeBlockContent language={item.language as BundledLanguage}>
                  {item.code}
                </CodeBlockContent>
              </CodeBlockItem>
            )}
          </CodeBlockBody>
        </CodeBlock>
      </div>
    )
  }

  return (
    <div className={`prose ${getVariantClasses()} max-w-none ${className} leading-relaxed`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
          h1: ({ children }) => <h1 className="text-3xl font-semibold mb-4 mt-6 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold mb-3 mt-5 first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-medium mb-3 mt-4 first:mt-0">{children}</h3>,
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-6 mb-4 space-y-1 [&_ul]:list-[circle] [&_ul]:mt-2 [&_ul]:mb-2 [&_ul_ul]:list-[square]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 mb-4 space-y-1 [&_ol]:list-[lower-alpha] [&_ol]:mt-2 [&_ol]:mb-2 [&_ol_ol]:list-[lower-roman]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1">
              {children}
            </li>
          ),
          pre: ({ children }) => {
            // ReactMarkdown wraps code blocks in pre > code structure
            const codeElement = Array.isArray(children) ? children[0] : children;
            
            if (codeElement && typeof codeElement === 'object' && 'props' in codeElement) {
              const codeProps = codeElement.props;
              const className = codeProps.className || '';
              
              // Extract language from className (e.g., "language-python3" -> "python3")
              const languageMatch = className.match(/language-([a-zA-Z0-9_+-]+)/);
              const language = languageMatch ? languageMatch[1] : undefined;
              const code = codeProps.children;
              
              return renderCodeBlock(code, language);
            }
            
            // Fallback for simple text content
            return renderCodeBlock(children?.toString() || '');
          },
          code: ({ children, ...props }) => {
            // This is for inline code only, as multiline code blocks are handled by the pre component
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-muted-foreground/30 pl-3 italic mb-4">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200 break-words" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            typeof src === 'string' && src ? (
              <Image
                src={src}
                alt={alt || ''}
                unoptimized
                className="px-4 w-full max-h-75 object-contain rounded-md mb-4"
                width={384}
                height={384}
              />
            ) : null
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-border rounded-md">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/30 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider border-r border-border last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-base border-r border-border last:border-r-0">
              {children}
            </td>
          ),
        }}
      >
        {content || 'No description available'}
      </ReactMarkdown>
    </div>
  )
}
