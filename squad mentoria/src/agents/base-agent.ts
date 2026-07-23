import { z } from "zod";
import { callGroq } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
import type { AgentArea, AgentOutput } from "@/types";

const outputSchema = z.object({
  bottlenecks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    severity: z.number().min(1).max(10),
    suggestedActions: z.array(z.string()),
  })),
  actions: z.array(z.object({
    type: z.string(),
    description: z.string(),
  })),
});

type ParsedOutput = z.infer<typeof outputSchema>;

export abstract class BaseAgent {
  constructor(
    public name: string,
    public area: AgentArea,
    public systemPrompt: string
  ) {}

  async analyze(input: {
    studentName: string;
    area: string;
    stage: string;
    metrics: { name: string; value: number }[];
  }): Promise<ParsedOutput> {
    const userPrompt = `
Aluno: ${input.studentName}
Área: ${input.area}
Estágio: ${input.stage}

Métricas atuais:
${input.metrics.map((m) => `- ${m.name}: ${m.value}`).join("\n")}

Analise gargalos e sugira ações. Retorne JSON no formato:
{
  "bottlenecks": [{ "title": "...", "description": "...", "severity": 1-10, "suggestedActions": ["..."] }],
  "actions": [{ "type": "notify|task|escalate|suggest", "description": "..." }]
}`;

    const raw = await callGroq(this.systemPrompt, userPrompt);
    const jsonStr = raw.replace(/```json\s*|\s*```/g, "").trim();
    const parsed = outputSchema.parse(JSON.parse(jsonStr));
    return parsed;
  }

  async processStudent(studentId: string, metrics: { name: string; value: number }[], stage: string): Promise<AgentOutput> {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new Error("Student not found");

    const output = await this.analyze({
      studentName: student.name,
      area: student.area,
      stage,
      metrics,
    });

    const bottleneckIds: string[] = [];

    for (const b of output.bottlenecks) {
      const bottleneck = await prisma.bottleneck.create({
        data: {
          title: b.title,
          description: b.description,
          area: this.area,
          severity: b.severity,
          status: "open",
          studentId,
        },
      });
      bottleneckIds.push(bottleneck.id);

      for (const suggestion of b.suggestedActions) {
        await prisma.agentAction.create({
          data: {
            agentName: this.name,
            actionType: "suggest",
            description: suggestion,
            status: "pending",
            bottleneckId: bottleneck.id,
          },
        });
      }
    }

    for (const a of output.actions) {
      const bid = bottleneckIds[0] || "";
      if (bid) {
        await prisma.agentAction.create({
          data: {
            agentName: this.name,
            actionType: a.type,
            description: a.description,
            status: "pending",
            bottleneckId: bid,
          },
        });
      }
    }

    await prisma.agentLog.create({
      data: {
        agentName: this.name,
        area: this.area,
        action: `Analyzed student ${student.name} — found ${output.bottlenecks.length} bottlenecks`,
        details: JSON.stringify(output.bottlenecks),
      },
    });

    return {
      bottlenecks: output.bottlenecks.map((b) => ({
        title: b.title,
        description: b.description,
        severity: b.severity,
        suggestedActions: b.suggestedActions,
      })),
      actions: output.actions.map((a) => ({
        type: a.type,
        description: a.description,
      })),
    };
  }
}
