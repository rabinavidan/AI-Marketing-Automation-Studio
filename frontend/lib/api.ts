import type {
  DashboardSummary,
  GeneratedContent,
  ImagePromptInput,
  ProductBrief,
  ProductBriefInput,
  PromptTemplate,
  Trend,
  WorkflowTask,
  ContentStatus,
  TaskStatus,
} from '@/types';

/**
 * Returns the API base URL.
 * Client-side code must read NEXT_PUBLIC_API_BASE_URL (inlined at build time).
 * Server-side code (if ever used) should prefer API_BASE_URL.
 */
export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
}

export class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBaseUrl();
  const url = `${base}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
      cache: 'no-store',
    });
  } catch (err) {
    throw new ApiError(
      `Could not reach the server at ${url}. Is the backend running? (${
        err instanceof Error ? err.message : 'network error'
      })`,
    );
  }

  let body: unknown = null;
  const text = await res.text().catch(() => '');
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    if (body && typeof body === 'object' && 'message' in body) {
      const raw = (body as { message: unknown }).message;
      message = Array.isArray(raw) ? raw.join(', ') : String(raw);
    }
    throw new ApiError(message, res.status);
  }

  return body as T;
}

// ---------- Product Briefs ----------

export function createProductBrief(brief: ProductBriefInput): Promise<ProductBrief> {
  return request<ProductBrief>('/product-briefs', {
    method: 'POST',
    body: JSON.stringify(brief),
  });
}

export function listProductBriefs(): Promise<ProductBrief[]> {
  return request<ProductBrief[]>('/product-briefs');
}

export function getProductBrief(id: string): Promise<ProductBrief> {
  return request<ProductBrief>(`/product-briefs/${id}`);
}

export function updateProductBrief(id: string, brief: Partial<ProductBriefInput>): Promise<ProductBrief> {
  return request<ProductBrief>(`/product-briefs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(brief),
  });
}

export function deleteProductBrief(id: string): Promise<void> {
  return request<void>(`/product-briefs/${id}`, { method: 'DELETE' });
}

// ---------- AI ----------

export function generateContent(payload: {
  productBriefId?: string;
  brief: ProductBriefInput;
}): Promise<GeneratedContent> {
  return request<GeneratedContent>('/ai/generate-content', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function regenerateContent(contentId: string): Promise<GeneratedContent> {
  return request<GeneratedContent>('/ai/regenerate-content', {
    method: 'POST',
    body: JSON.stringify({ contentId }),
  });
}

export function generateImagePrompt(data: ImagePromptInput): Promise<{ prompt: string }> {
  return request<{ prompt: string }>('/ai/generate-image-prompt', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---------- Generated Content ----------

export function listGeneratedContent(params?: { status?: string; search?: string }): Promise<GeneratedContent[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  const qs = query.toString();
  return request<GeneratedContent[]>(`/generated-content${qs ? `?${qs}` : ''}`);
}

export function getGeneratedContent(id: string): Promise<GeneratedContent> {
  return request<GeneratedContent>(`/generated-content/${id}`);
}

export function updateGeneratedContentStatus(id: string, status: ContentStatus): Promise<GeneratedContent> {
  return request<GeneratedContent>(`/generated-content/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export function updateGeneratedContent(
  id: string,
  fields: Partial<GeneratedContent>,
): Promise<GeneratedContent> {
  return request<GeneratedContent>(`/generated-content/${id}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
  });
}

export function deleteGeneratedContent(id: string): Promise<void> {
  return request<void>(`/generated-content/${id}`, { method: 'DELETE' });
}

// ---------- Prompt Templates ----------

export function listPromptTemplates(): Promise<PromptTemplate[]> {
  return request<PromptTemplate[]>('/prompt-templates');
}

export function getPromptTemplate(id: string): Promise<PromptTemplate> {
  return request<PromptTemplate>(`/prompt-templates/${id}`);
}

export function createPromptTemplate(
  data: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<PromptTemplate> {
  return request<PromptTemplate>('/prompt-templates', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updatePromptTemplate(
  id: string,
  data: Partial<PromptTemplate>,
): Promise<PromptTemplate> {
  return request<PromptTemplate>(`/prompt-templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deletePromptTemplate(id: string): Promise<void> {
  return request<void>(`/prompt-templates/${id}`, { method: 'DELETE' });
}

// ---------- Workflow Tasks ----------

export function listTasks(): Promise<WorkflowTask[]> {
  return request<WorkflowTask[]>('/tasks');
}

export function getTask(id: string): Promise<WorkflowTask> {
  return request<WorkflowTask>(`/tasks/${id}`);
}

export function createTask(
  data: Omit<WorkflowTask, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: TaskStatus },
): Promise<WorkflowTask> {
  return request<WorkflowTask>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTask(id: string, data: Partial<WorkflowTask>): Promise<WorkflowTask> {
  return request<WorkflowTask>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function updateTaskStatus(id: string, status: TaskStatus): Promise<WorkflowTask> {
  return request<WorkflowTask>(`/tasks/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export function deleteTask(id: string): Promise<void> {
  return request<void>(`/tasks/${id}`, { method: 'DELETE' });
}

// ---------- Trends ----------

export function listTrends(): Promise<Trend[]> {
  return request<Trend[]>('/trends');
}

export function generateTrends(): Promise<Trend[]> {
  return request<Trend[]>('/trends/generate', { method: 'POST' });
}

// ---------- Dashboard ----------

export function getDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>('/dashboard/summary');
}
