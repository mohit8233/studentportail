import express from "express";
import {
  createTopic,
  deleteTopic,
  getTopicsBySubject,
  updateTopic
} from "../controllers/topicController.js";

const topicRouter = express.Router();

topicRouter.post("/create", createTopic);
topicRouter.get("/subject/:subjectId", getTopicsBySubject);
topicRouter.patch("/update/:id", updateTopic);
topicRouter.delete("/delete/:id", deleteTopic);

export default topicRouter;