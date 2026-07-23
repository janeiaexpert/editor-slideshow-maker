import cron from "node-cron";
import { prisma } from "./prisma";
import { getAllAgents } from "@/agents";

let isRunning = false;

export function startScheduler() {
  cron.schedule("*/30 * * * *", async () => {
    if (isRunning) return;
    isRunning = true;

    try {
      const students = await prisma.student.findMany({ take: 20 });

      for (const student of students) {
        const metrics = await prisma.metric.findMany({
          where: { studentId: student.id },
          orderBy: { recordedAt: "desc" },
          take: 10,
        });

        const formattedMetrics = metrics.map((m) => ({
          name: m.name,
          value: m.value,
        }));

        for (const agent of getAllAgents()) {
          try {
            await agent.processStudent(student.id, formattedMetrics, student.stage);
            console.log(`[Scheduler] ${agent.name} processed ${student.name}`);
          } catch (error) {
            console.error(`[Scheduler] Error: ${agent.name} on ${student.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.error("[Scheduler] Error:", error);
    } finally {
      isRunning = false;
    }
  });

  console.log("[Scheduler] Started — running every 30 minutes");
}
