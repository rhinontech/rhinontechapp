import { Router, Response } from "express";
import { Op } from "sequelize";
import { ClientRequest, Project, Task, User } from "../models";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const taskStatusToRequestStatus: Record<string, string> = {
  Pending: "In review",
  "In progress": "In progress",
  Done: "Done",
};

const router = Router();
router.use(authenticate);

const taskIncludes: any[] = [
  { model: User, as: "assignee", attributes: ["id", "fullName", "companyEmail"] },
  { model: User, as: "creator", attributes: ["id", "fullName"] },
  { model: Project, as: "project", attributes: ["id", "name", "status"] },
];

// GET /tasks?scope=my|team|all&status=Pending
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { scope = "my", status, projectId } = req.query;
    const where: Record<string, unknown> = {};
    const include = [...taskIncludes];

    if (scope === "my") {
      where.assigneeId = req.user!.userId;
    } else if (scope === "team") {
      where.assigneeId = { [Op.ne]: req.user!.userId };
      if (!["superadmin", "hr"].includes(req.user!.roleSlug)) {
        const currentUser = await User.findByPk(req.user!.userId, { attributes: ["department"] });
        include[0] = {
          model: User,
          as: "assignee",
          attributes: ["id", "fullName", "companyEmail"],
          where: { department: currentUser?.department ?? "" },
        };
      }
    }

    if (status && typeof status === "string") {
      where.status = status;
    }
    if (projectId && typeof projectId === "string") {
      where.projectId = projectId;
    }

    const tasks = await Task.findAll({
      where,
      include,
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
    const { title, description, assigneeId, projectId, team, dueDate, status } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      res.status(400).json({ message: "title is required" });
      return;
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || undefined,
      assigneeId: assigneeId || req.user!.userId,
      createdById: req.user!.userId,
      projectId: projectId || undefined,
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

    const { title, description, assigneeId, projectId, team, dueDate, status } = req.body;
    await task.update({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(assigneeId !== undefined && { assigneeId }),
      ...(projectId !== undefined && { projectId: projectId || null }),
      ...(team !== undefined && { team }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : (undefined as unknown as Date) }),
      ...(status !== undefined && { status }),
    });

    const full = await Task.findByPk(task.id, { include: taskIncludes });

    if (status !== undefined) {
      const mappedStatus = taskStatusToRequestStatus[status];
      if (mappedStatus) {
        await ClientRequest.update(
          { status: mappedStatus as any },
          { where: { convertedTaskId: task.id } }
        );
      }
    }

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
    await ClientRequest.update(
      { convertedTaskId: undefined, status: "Open" } as any,
      { where: { convertedTaskId: task.id } }
    );
    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;
