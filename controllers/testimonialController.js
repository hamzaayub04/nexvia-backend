const Testimonial = require('../models/Testimonial');

exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ published: true }).sort({ createdAt: -1 });
    res.json({ testimonials });
  } catch (error) {
    next(error);
  }
};

exports.createTestimonial = async (req, res, next) => {
  try {
    const { name, role, content, rating, avatar } = req.body;
    const testimonial = await Testimonial.create({
      name, role, content, rating, avatar,
      userId: req.user?.id || null,
      published: false,
    });
    res.status(201).json({ testimonial });
  } catch (error) {
    next(error);
  }
};

exports.updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ testimonial });
  } catch (error) {
    next(error);
  }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
};
