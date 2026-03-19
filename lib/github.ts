const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const REPO_OWNER = process.env.GITHUB_REPO_OWNER!;
const REPO_NAME = process.env.GITHUB_REPO_NAME!;
const CONTENT_BRANCH = process.env.GITHUB_CONTENT_BRANCH || "main";

const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

export class GitHubApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

function headers() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

async function ghFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...options, headers: headers() });
  if (!res.ok) {
    const body = await res.text();
    throw new GitHubApiError(res.status, `GitHub API ${res.status}: ${body}`);
  }
  return res.json();
}

// ─── Branch operations ────────────────────────────────────────────────────────

export async function getMainBranchSha(): Promise<string> {
  const data = await ghFetch<{ object: { sha: string } }>(
    `${API_BASE}/git/ref/heads/${CONTENT_BRANCH}`
  );
  return data.object.sha;
}

export async function createBranch(branchName: string, sha: string): Promise<void> {
  await ghFetch(`${API_BASE}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha }),
  });
}

export async function deleteBranch(branchName: string): Promise<void> {
  await ghFetch(`${API_BASE}/git/refs/heads/${branchName}`, {
    method: "DELETE",
  });
}

// ─── File operations ──────────────────────────────────────────────────────────

export interface FileContent {
  content: string;
  sha: string;
  encoding: string;
}

export async function getFileContent(path: string, branch?: string): Promise<FileContent> {
  const ref = branch || CONTENT_BRANCH;
  return ghFetch<FileContent>(`${API_BASE}/contents/${path}?ref=${ref}`);
}

export async function getFileSha(path: string, branch?: string): Promise<string> {
  const file = await getFileContent(path, branch);
  return file.sha;
}

export async function createOrUpdateFile(
  path: string,
  content: string,
  message: string,
  branch: string,
  existingSha?: string
): Promise<{ content: { sha: string } }> {
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString("base64"),
    branch,
  };
  if (existingSha) body.sha = existingSha;

  return ghFetch(`${API_BASE}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteFile(
  path: string,
  message: string,
  branch: string,
  sha: string
): Promise<void> {
  await ghFetch(`${API_BASE}/contents/${path}`, {
    method: "DELETE",
    body: JSON.stringify({ message, sha, branch }),
  });
}

// ─── Pull request operations ──────────────────────────────────────────────────

export interface PullRequest {
  number: number;
  title: string;
  body: string;
  html_url: string;
  state: string;
  user: { login: string; avatar_url: string };
  head: { ref: string };
  created_at: string;
  updated_at: string;
}

export async function createPullRequest(
  title: string,
  body: string,
  headBranch: string
): Promise<PullRequest> {
  return ghFetch<PullRequest>(`${API_BASE}/pulls`, {
    method: "POST",
    body: JSON.stringify({
      title,
      body,
      head: headBranch,
      base: CONTENT_BRANCH,
    }),
  });
}

export async function listOpenPRs(): Promise<PullRequest[]> {
  return ghFetch<PullRequest[]>(
    `${API_BASE}/pulls?state=open&sort=created&direction=desc`
  );
}

export async function getPR(prNumber: number): Promise<PullRequest> {
  return ghFetch<PullRequest>(`${API_BASE}/pulls/${prNumber}`);
}

export interface PRFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

export async function getPRFiles(prNumber: number): Promise<PRFile[]> {
  return ghFetch<PRFile[]>(`${API_BASE}/pulls/${prNumber}/files`);
}

export async function mergePR(prNumber: number): Promise<void> {
  await ghFetch(`${API_BASE}/pulls/${prNumber}/merge`, {
    method: "PUT",
    body: JSON.stringify({ merge_method: "squash" }),
  });
}

export async function closePR(prNumber: number, comment?: string): Promise<void> {
  if (comment) {
    await ghFetch(`${API_BASE}/issues/${prNumber}/comments`, {
      method: "POST",
      body: JSON.stringify({ body: comment }),
    });
  }
  await ghFetch(`${API_BASE}/pulls/${prNumber}`, {
    method: "PATCH",
    body: JSON.stringify({ state: "closed" }),
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getContentBranch(): string {
  return CONTENT_BRANCH;
}

export function generateBranchName(action: string, slug: string): string {
  return `content/${action}/${slug}-${Date.now()}`;
}
