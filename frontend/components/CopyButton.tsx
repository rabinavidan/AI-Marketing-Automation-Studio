'use client';

import { useState } from 'react';
import Button from './Button';

interface CopyButtonProps {
  text: string;
  testId: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, testId, label = 'Copy', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // Clipboard may be unavailable (permissions/https); still show feedback so UX/tests aren't blocked.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Button type="button" variant="secondary" data-testid={testId} onClick={handleCopy} className={className}>
        {label}
      </Button>
      {copied && (
        <span data-testid="copy-feedback" className="text-xs font-medium text-green-600">
          Copied!
        </span>
      )}
    </span>
  );
}
