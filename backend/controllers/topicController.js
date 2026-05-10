import { Topic } from "../models/topic.js";

export const createTopic = async (req, res) => {
  try {
    const { courseId, subjectId, topicName } = req.body;

    if (!courseId || !subjectId || !topicName) {
      return res.status(400).json({
        status: false,
        message: "courseId, subjectId and topicName are required"
      });
    }

    const topic = await Topic.create(req.body);

    return res.status(201).json({
      status: true,
      message: "Topic created successfully",
      data: topic
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const getTopicsBySubject = async (req, res) => {
  try {
    const topics = await Topic.find({
      subjectId: req.params.subjectId
    }).sort({ order: 1, createdAt: 1 });

    return res.status(200).json({
      status: true,
      message: "Topics fetched successfully",
      data: topics
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Topic updated successfully",
      data: topic
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: true,
      message: "Topic deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};