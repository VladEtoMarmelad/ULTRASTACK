import Link from 'next/link';

export const CustomLink = (props: any) => {
  const href = props.href;
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