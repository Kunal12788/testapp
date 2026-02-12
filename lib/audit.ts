import { prisma } from './prisma';

export async function addAuditLog(actionType: string, performedBy: string, detailsJson: object) {
  return prisma.auditLog.create({
    data: { actionType, performedBy, detailsJson }
  });
}
