import { Router, Response } from "express";
import { Op } from "sequelize";
import { Attendance } from "../models";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const router = Router();
router.use(authenticate);

function toDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function isWeekend(date: Date) {
  return date.getDay() === 0; // Sunday only — Mon–Sat is the work week
}

function durationMinutes(clockIn: Date | null | undefined, clockOut: Date | null | undefined) {
  if (!clockIn) return 0;
  const end = clockOut ? new Date(clockOut) : new Date();
  return Math.max(0, Math.round((end.getTime() - new Date(clockIn).getTime()) / 60000));
}

// GET /attendance?month=5&year=2026
// Returns a full month view with auto-computed weekend/absent days
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month as string) || now.getMonth() + 1;
    const year = parseInt(req.query.year as string) || now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const records = await Attendance.findAll({
      where: {
        userId: req.user!.userId,
        date: { [Op.between]: [startDate, endDate] },
      },
    });

    const recordMap = new Map<string, (typeof records)[0]>();
    for (const r of records) {
      recordMap.set(toDateKey(new Date(r.date)), r);
    }

    const days = [];
    for (let d = 1; d <= endDate.getDate(); d++) {
      const date = new Date(year, month - 1, d);
      const key = toDateKey(date);
      const existing = recordMap.get(key);

      if (existing) {
        days.push({
          ...existing.toJSON(),
          durationMinutes: durationMinutes(existing.clockIn, existing.clockOut),
        });
      } else {
        const weekend = isWeekend(date);
        const isFuture = date > now;
        days.push({
          id: null,
          userId: req.user!.userId,
          date: key,
          clockIn: null,
          clockOut: null,
          status: weekend ? "weekend" : isFuture ? "upcoming" : "absent",
          note: weekend ? "Weekend" : isFuture ? "Upcoming" : null,
          durationMinutes: 0,
        });
      }
    }

    res.json(days);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
});

// GET /attendance/today
router.get("/today", async (req: AuthRequest, res: Response) => {
  try {
    const today = toDateKey(new Date());
    const record = await Attendance.findOne({
      where: { userId: req.user!.userId, date: today },
    });

    if (record) {
      res.json({ ...record.toJSON(), durationMinutes: durationMinutes(record.clockIn, record.clockOut) });
    } else {
      res.json({ date: today, status: "absent", clockIn: null, clockOut: null, durationMinutes: 0 });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch today" });
  }
});

// POST /attendance/clock-in
router.post("/clock-in", async (req: AuthRequest, res: Response) => {
  try {
    const today = toDateKey(new Date());
    const now = new Date();

    const [record, created] = await Attendance.findOrCreate({
      where: { userId: req.user!.userId, date: today },
      defaults: {
        userId: req.user!.userId,
        date: new Date(today),
        clockIn: now,
        status: "present",
      },
    });

    if (!created) {
      if (record.clockIn) {
        res.status(400).json({ message: "Already clocked in today" });
        return;
      }
      await record.update({ clockIn: now, status: "present" });
    }

    res.json({ ...record.toJSON(), durationMinutes: durationMinutes(record.clockIn, record.clockOut) });
  } catch (err) {
    res.status(500).json({ message: "Failed to clock in" });
  }
});

// POST /attendance/clock-out
router.post("/clock-out", async (req: AuthRequest, res: Response) => {
  try {
    const today = toDateKey(new Date());
    const now = new Date();

    const record = await Attendance.findOne({
      where: { userId: req.user!.userId, date: today },
    });

    if (!record || !record.clockIn) {
      res.status(400).json({ message: "You haven't clocked in today" });
      return;
    }
    if (record.clockOut) {
      res.status(400).json({ message: "Already clocked out" });
      return;
    }

    await record.update({ clockOut: now });
    res.json({ ...record.toJSON(), durationMinutes: durationMinutes(record.clockIn, record.clockOut) });
  } catch (err) {
    res.status(500).json({ message: "Failed to clock out" });
  }
});

// GET /attendance/stats?month=5&year=2026
router.get("/stats", async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month as string) || now.getMonth() + 1;
    const year = parseInt(req.query.year as string) || now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const records = await Attendance.findAll({
      where: {
        userId: req.user!.userId,
        date: { [Op.between]: [startDate, endDate] },
        status: "present",
      },
    });

    const daysPresent = records.length;
    let totalMinutes = 0;
    for (const r of records) {
      totalMinutes += durationMinutes(r.clockIn, r.clockOut);
    }

    const today = toDateKey(now);
    const todayRecord = await Attendance.findOne({
      where: { userId: req.user!.userId, date: today },
    });

    res.json({
      month,
      year,
      daysPresent,
      totalMinutes: Math.round(totalMinutes),
      today: todayRecord
        ? { ...todayRecord.toJSON(), durationMinutes: durationMinutes(todayRecord.clockIn, todayRecord.clockOut) }
        : { date: today, status: "absent", clockIn: null, clockOut: null, durationMinutes: 0 },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

export default router;
