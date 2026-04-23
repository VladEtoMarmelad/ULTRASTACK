import Link from 'next/link';
import { AnchorHTMLAttributes } from 'react';

// Props definition using standard HTML anchor attributes to support both Next.js Link and native <a>
export const CustomLink = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const href = props.href;
  // Checks if the destination is a relative path or an anchor on the current page
  const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));

  if (isInternalLink) {
    // For internal links used by Next.js Link
    return (
      <Link 
        href={href} 
        {...props} 
        className="font-medium text-zinc-950 dark:text-zinc-50 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-800 transition-colors"
      >
        {props.children}
      </Link>
    );
  }

  // For external links (http...) we use the usual <a>, opening in a new tab
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className="font-medium text-blue-600 dark:text-blue-400 underline underline-offset-4"
    />
  );
};