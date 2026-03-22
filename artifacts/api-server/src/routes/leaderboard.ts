import { Router, type IRouter } from "express";
import { SubmitScoreBody, GetLeaderboardResponseItem } from "@workspace/api-zod";
import { db, leaderboardTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/leaderboard", async (req, res) => {
  try {
    const entries = await db
      .select()
      .from(leaderboardTable)
      .orderBy(desc(leaderboardTable.score))
      .limit(20);

    const result = entries.map(e => ({
      id: e.id,
      playerName: e.playerName,
      score: e.score,
      levelsCompleted: e.levelsCompleted,
      createdAt: e.createdAt.toISOString(),
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch leaderboard");
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

router.post("/leaderboard", async (req, res) => {
  try {
    const parsed = SubmitScoreBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid input" });
      return;
    }

    const { playerName, score, levelsCompleted } = parsed.data;

    const [entry] = await db
      .insert(leaderboardTable)
      .values({ playerName, score, levelsCompleted })
      .returning();

    res.status(201).json({
      id: entry.id,
      playerName: entry.playerName,
      score: entry.score,
      levelsCompleted: entry.levelsCompleted,
      createdAt: entry.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit score");
    res.status(500).json({ message: "Failed to submit score" });
  }
});

export default router;
