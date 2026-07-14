const Quote = require('../models/Quote');
const { sendEmail } = require('../services/emailService');

exports.createQuote = async (req, res, next) => {
  try {
    const { name, email, phone, quantity, pcbType, serviceRequired, description } = req.body;

    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
        });
      });
    }

    const quote = await Quote.create({
      name,
      email,
      phone,
      quantity,
      pcbType,
      serviceRequired,
      description,
      attachments,
      userId: req.user?.id || null,
    });

    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'nexviapcbdesign@gmail.com',
        subject: `New Quote Request from ${name}`,
        html: `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>PCB Type:</strong> ${pcbType}</p>
          <p><strong>Service:</strong> ${serviceRequired}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Attachments:</strong> ${attachments.length} file(s)</p>
        `,
      });

      await sendEmail({
        to: email,
        subject: 'Nexvia - Quote Request Received',
        html: `
          <h2>Thank you, ${name}!</h2>
          <p>We have received your quote request for a <strong>${pcbType}</strong> PCB (<strong>${serviceRequired}</strong>).</p>
          <p>Our team will review your requirements and get back to you within 24-48 hours.</p>
          <br/>
          <p>Best regards,<br/><strong>Nexvia PCB Design & Manufacturing</strong></p>
        `,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({ message: 'Quote request submitted successfully', quote });
  } catch (error) {
    next(error);
  }
};

exports.getQuotes = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const quotes = await Quote.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Quote.countDocuments(query);
    res.json({ quotes, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

exports.getQuoteById = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    res.json({ quote });
  } catch (error) {
    next(error);
  }
};

exports.updateQuote = async (req, res, next) => {
  try {
    const { status, adminNotes, quotedPrice } = req.body;
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, quotedPrice },
      { new: true }
    );
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    res.json({ quote });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    res.json({ message: 'Quote deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getMyQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ quotes });
  } catch (error) {
    next(error);
  }
};
