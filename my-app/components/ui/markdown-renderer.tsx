import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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

  return (
    <div className={`prose ${getVariantClasses()} max-w-none ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          h1: ({ children }) => <h1 className="text-3xl font-semibold mb-1">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold mb-1">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-medium mb-1">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>
            ) : (
              <pre className="bg-muted p-2 rounded text-sm font-mono overflow-x-auto mb-2">
                <code>{children}</code>
              </pre>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-muted-foreground/30 pl-3 italic mb-2">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ children, href }) => (
            <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            typeof src === 'string' && src ? (
              <Image
                src={src}
                alt={alt || ''}
                className="max-w-full max-h-96 object-contain rounded-md mb-2"
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
