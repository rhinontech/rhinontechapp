import { Router, Response } from "express";
import { Task, User } from "../models";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const router = Router();
router.use(authenticate);

const taskIncludes = [
  { model: User, as: "assignee", attributes: ["id", "fullName", "companyEmail"] },
  { model: User, as: "creator", attributes: ["id", "fullName"] },
];

// GET /tasks?scope=my|team|all&status=Pending
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { scope = "my", status } = req.query;
    const where: Record<string, unknown> = {};

    if (scope === "my") {
      where.assigneeId = req.user!.userId;
    }
    // scope=team and scope=all both return all tasks (no assignee filter)

    if (status && typeof status === "string") {
      where.status = status;
    }

    const tasks = await Task.findAll({
      where,
      include: taskIncludes,
      order: [["createdAt", "DESC"]],
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// POST /tasks
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, assigneeId, team, dueDate, status } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      res.status(400).json({ message: "title is required" });
      return;
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || undefined,
      assigneeId: assigneeId || req.user!.userId,
      createdById: req.user!.userId,
      team: team || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: status || "Pending",
    });

    const full = await Task.findByPk(task.id, { include: taskIncludes });
    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
});

// PUT /tasks/:id
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) { res.status(404).json({ message: "Task not found" }); return; }

    const { title, description, assigneeId, team, dueDate, status } = req.body;
    await task.update({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(assigneeId !== undefined && { assigneeId }),
      ...(team !== undefined && { team }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : (undefined as unknown as Date) }),
      ...(status !== undefined && { status }),
    });

    const full = await Task.findByPk(task.id, { include: taskIncludes });
    res.json(full);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

// DELETE /tasks/:id
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) { res.status(404).json({ message: "Task not found" }); return; }
    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;
