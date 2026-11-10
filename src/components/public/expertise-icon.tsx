import type { ExpertiseIcon as IconName } from "@/types/cms";

const paths: Record<IconName, React.ReactNode> = {
  infrastructure: <><rect x="6" y="6" width="36" height="12" rx="2" /><rect x="6" y="30" width="36" height="12" rx="2" /><path d="M12 12h2M12 36h2M24 18v12" /></>,
  enterprise: <><rect x="6" y="8" width="36" height="32" rx="2" /><path d="M6 17h36M17 17v23M23 25h13M23 32h9" /></>,
  ai: <><rect x="13" y="13" width="22" height="22" rx="3" /><path d="M19 6v7M29 6v7M19 35v7M29 35v7M6 19h7M6 29h7M35 19h7M35 29h7" /><path d="M19 29l4-10 4 10M20.5 25.5h5M31 19v10" /></>,
  web: <><rect x="4" y="9" width="30" height="22" rx="2" /><path d="M4 15h30M13 37h12M19 31v6" /><rect x="34" y="17" width="10" height="22" rx="2" /><path d="M38 35h2" /></>,
  security: <><path d="M24 5l16 6v11c0 10-7 18-16 21C15 40 8 32 8 22V11z" /><rect x="17" y="21" width="14" height="10" rx="1.5" /><path d="M20 21v-3a4 4 0 0 1 8 0v3" /></>,
  creative: <><path d="M8 40l6-2 22-22-4-4-22 22z" /><path d="M28 16l4 4M34 8l6 6" /><circle cx="36" cy="36" r="5" /></>
};

export function ExpertiseIcon({ name }: { name: IconName }) {
  return <svg className="expertise-icon" viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}
