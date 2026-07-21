import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

type MockPrisma = {
  generatedContent: {
    count: jest.Mock;
    findMany: jest.Mock;
  };
  workflowTask: {
    count: jest.Mock;
  };
};

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: MockPrisma;

  const rows = [
    {
      id: 'gc-1',
      contentType: 'Full Campaign',
      status: 'Pending Review',
      owner: 'Dana Cohen',
      createdAt: new Date('2026-01-01'),
      productBrief: { productName: 'Lumina Vitamin C Serum', language: 'English' },
    },
    {
      id: 'gc-2',
      contentType: 'Full Campaign',
      status: 'Approved',
      owner: 'Noa Levi',
      createdAt: new Date('2026-01-02'),
      productBrief: { productName: 'Velora Midnight Repair Cream', language: 'English' },
    },
    {
      id: 'gc-3',
      contentType: 'Full Campaign',
      status: 'Rejected',
      owner: 'Yael Mizrahi',
      createdAt: new Date('2026-01-03'),
      productBrief: { productName: 'Adama Purifying Clay Mask', language: 'Hebrew' },
    },
    {
      id: 'gc-4',
      contentType: 'Full Campaign',
      status: 'Ready to Publish',
      owner: 'Itai Barak',
      createdAt: new Date('2026-01-04'),
      productBrief: { productName: 'Titan Grooming Co. Beard & Face Kit', language: 'English' },
    },
  ];

  beforeEach(() => {
    prisma = {
      generatedContent: {
        count: jest.fn(),
        findMany: jest.fn().mockResolvedValue(rows),
      },
      workflowTask: {
        count: jest.fn(),
      },
    };

    // Return distinct counts depending on the `where` filter passed in, mirroring
    // what a real Prisma count() would return for the seeded rows above.
    prisma.generatedContent.count.mockImplementation((args?: { where?: { status?: string } }) => {
      if (!args || !args.where) return Promise.resolve(rows.length);
      const status = args.where.status;
      return Promise.resolve(rows.filter((r) => r.status === status).length);
    });
    prisma.workflowTask.count.mockResolvedValue(2);

    service = new DashboardService(prisma as unknown as PrismaService);
  });

  it('aggregates counts per status correctly', async () => {
    const summary = await service.getSummary();

    expect(summary.totalGeneratedContent).toBe(4);
    expect(summary.pendingReview).toBe(1);
    expect(summary.approved).toBe(1);
    expect(summary.rejected).toBe(1);
    expect(summary.campaignsReady).toBe(1);
    expect(summary.tasksInProgress).toBe(2);
  });

  it('maps generated content rows into the dashboard table shape', async () => {
    const summary = await service.getSummary();

    expect(summary.table).toHaveLength(4);
    expect(summary.table[0]).toEqual({
      id: 'gc-1',
      productName: 'Lumina Vitamin C Serum',
      contentType: 'Full Campaign',
      language: 'English',
      status: 'Pending Review',
      owner: 'Dana Cohen',
      createdAt: rows[0].createdAt,
    });
  });

  it('queries workflowTask.count filtered to In Progress status', async () => {
    await service.getSummary();

    expect(prisma.workflowTask.count).toHaveBeenCalledWith({ where: { status: 'In Progress' } });
  });
});
