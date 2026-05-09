import { Router, Response, Request } from "express";
import { ClientRequest, Project, User } from "../models";

const router = Router();

const requestIncludes = [
  { model: Project, as: "project", attributes: ["id", "name", "status"] },
  { model: User, as: "creator", attributes: ["id", "fullName"] },
];

router.get("/projects/:projectId/requests", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByPk(projectId, {
      attributes: ["id", "name", "status"],
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const requests = await ClientRequest.findAll({
      where: { projectId },
      include: requestIncludes,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "title",
        "description",
        "type",
        "status",
        "priority",
        "reportedBy",
        "createdAt",
        "updatedAt",
      ],
    });

    res.json({
      project,
      requests,
    });
  } catch (err) {
    console.error("Failed to fetch public project requests:", err);
    res.status(500).json({ message: "Failed to fetch project data" });
  }
});

export default router;
