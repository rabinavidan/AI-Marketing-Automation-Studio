import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [
      totalGeneratedContent,
      pendingReview,
      approved,
      rejected,
      campaignsReady,
      tasksInProgress,
      rows,
    ] = await Promise.all([
      this.prisma.generatedContent.count(),
      this.prisma.generatedContent.count({ where: { status: 'Pending Review' } }),
      this.prisma.generatedContent.count({ where: { status: 'Approved' } }),
      this.prisma.generatedContent.count({ where: { status: 'Rejected' } }),
      this.prisma.generatedContent.count({ where: { status: 'Ready to Publish' } }),
      this.prisma.workflowTask.count({ where: { status: 'In Progress' } }),
      this.prisma.generatedContent.findMany({
        include: { productBrief: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const table = rows.map((row) => ({
      id: row.id,
      productName: row.productBrief?.productName ?? '',
      contentType: row.contentType,
      language: row.productBrief?.language ?? '',
      status: row.status,
      owner: row.owner,
      createdAt: row.createdAt,
    }));

    return {
      totalGeneratedContent,
      pendingReview,
      approved,
      rejected,
      campaignsReady,
      tasksInProgress,
      table,
    };
  }
}
