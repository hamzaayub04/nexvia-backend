const Message = require('../models/Message');

exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const msg = await Message.create({ name, email, subject, message, userId: req.user?.id || null });
    res.status(201).json({ message: 'Message sent successfully', data: msg });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message });
  } catch (error) {
    next(error);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};
