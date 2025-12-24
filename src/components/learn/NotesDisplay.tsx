import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface NotesDisplayProps {
  notes: string;
}

const NotesDisplay = ({ notes }: NotesDisplayProps) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 overflow-hidden">
      <div className="prose prose-invert prose-lg max-w-none 
        prose-headings:text-foreground prose-headings:font-bold
        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-gradient
        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
        prose-p:text-muted-foreground prose-p:leading-relaxed
        prose-li:text-muted-foreground
        prose-strong:text-foreground
        prose-code:text-accent prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-muted/30 prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      ">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre: ({ children, ...props }) => {
              const codeContent = (children as any)?.props?.children || '';
              return (
                <div className="relative group">
                  <pre {...props} className="overflow-x-auto p-4 rounded-xl bg-muted/30 border border-border/50">
                    {children}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => copyToClipboard(String(codeContent))}
                  >
                    {copiedCode === String(codeContent) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              );
            },
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code className="text-accent bg-muted/50 px-1.5 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                );
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {notes}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default NotesDisplay;
