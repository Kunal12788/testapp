import { prisma } from './prisma';

export async function logAudit(actionType: string, performedBy: string, details: Record<string, unknown>) {
  await prisma.auditLog.create({
    data: {
      actionType,
      performedBy,
      detailsJson: details
    }
  });
}
