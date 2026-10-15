export type ScanFile = {
  id: string;
  path: string;
  detail: string;
  missing?: boolean;
};

export const scanFiles: ScanFile[] = [
  { id: "pkg", path: "package.json", detail: "vite · react" },
  { id: "api", path: "src/api/summarise.ts", detail: "POST document text" },
  { id: "env", path: ".env.example", detail: "OPENAI_API_KEY" },
  { id: "routes", path: "src/routes.tsx", detail: "upload → generate" },
  { id: "auth", path: "src/middleware/auth.ts", detail: "not in the tree", missing: true },
  { id: "brief", path: "src/components/Brief.tsx", detail: "no citations" },
];

export const repoContext = {
  name: "matter-brief",
  path: "~/dev/matter-brief",
  branch: "main",
  command: "npx prototype-to-pilot",
};
