import type { SVGProps } from 'react';

export function SurakshaJalLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-3.5-6V2" />
      <path d="M12 22a7 7 0 0 1-7-7c0-2 1-3.9 3-5.5s3.5-4 3.5-6V2" />
      <path d="M16 12h2" />
      <path d="M6 12H4" />
      <path d="m14.5 16.5-1-1" />
      <path d="m9.5 16.5 1-1" />
      <path d="M12 20v-4" />
      <path d="M12 6V2" />
    </svg>
  );
}
