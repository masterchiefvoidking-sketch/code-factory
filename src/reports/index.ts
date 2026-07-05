import type { FactoryReport, FactoryReportMetadata, ReportFormat } from "../types/index.js";

export interface CreateFactoryReportOptions {
  tenantId: string;
  title: string;
  content: string;
  author: string;
  format?: ReportFormat;
  summary?: string;
  generatedAt?: string;
}

export function createFactoryReport(options: CreateFactoryReportOptions): FactoryReport {
  const metadata: FactoryReportMetadata = {
    tenantId: options.tenantId,
    title: options.title,
    format: options.format ?? "markdown",
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    author: options.author,
    summary: options.summary,
  };

  return { metadata, content: options.content };
}

export function parseFactoryReportMetadata(markdown: string): Partial<FactoryReportMetadata> {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const summaryMatch = markdown.match(/^#\s+.+\n\n([^#\n].+?)(?:\n\n|$)/s);

  return {
    title: titleMatch?.[1]?.trim(),
    summary: summaryMatch?.[1]?.trim(),
    format: "markdown",
  };
}
