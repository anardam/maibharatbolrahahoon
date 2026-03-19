const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const REPO_OWNER = process.env.GITHUB_REPO_OWNER!;
const REPO_NAME = process.env.GITHUB_REPO_NAME!;
const CONTENT_BRANCH = process.env.GITHUB_CONTENT_BRANCH || "main";

const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

function headers() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

export async function getMainBranchSha(): Promise<string> {
  const res = await fetch(`${API_BASE}/git/ref/heads/${CONTENT_BRANCH}`, {
    headers: headers(),
  });
  const data = await res.json();
  return data.object.sha;
}

export async function createBranch(
  branchName: string,
  sha: string
): Promise<void> {
  await fetch(`${API_BASE}/git/refs`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha }),
  });
}

export async function createOrUpdateFile(
  path: string,
  content: string,
  message: string,
  branch: string,
  existingSha?: string
): Promise<void> {
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString("base64"),
    branch,
  };
  if (existingSha) body.sha = existingSha;

  await fetch(`${API_BASE}/contents/${path}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });
}

export async function createPullRequest(
  title: string,
  body: string,
  headBranch: string
): Promise<{ number: number; html_url: string }> {
  const res = await fetch(`${API_BASE}/pulls`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      title,
      body,
      head: headBranch,
      base: CONTENT_BRANCH,
    }),
  });
  return res.json();
}

export async function listOpenPRs(): Promise<
  Array<{ number: number; title: string; html_url: string; user: { login: string }; created_at: string }>
> {
  const res = await fetch(
    `${API_BASE}/pulls?state=open&sort=created&direction=desc`,
    { headers: headers() }
  );
  return res.json();
}

export async function mergePR(prNumber: number): Promise<void> {
  await fetch(`${API_BASE}/pulls/${prNumber}/merge`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ merge_method: "squash" }),
  });
}

export async function closePR(
  prNumber: number,
  comment?: string
): Promise<void> {
  if (comment) {
    await fetch(`${API_BASE}/issues/${prNumber}/comments`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ body: comment }),
    });
  }
  await fetch(`${API_BASE}/pulls/${prNumber}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ state: "closed" }),
  });
}
