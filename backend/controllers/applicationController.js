const Application = require('../models/Application');
const University = require('../models/University');
const Notification = require('../models/Notification');
const { emitToUser } = require('../config/socket');

// @desc    Create application
// @route   POST /api/applications
// @access  Private
exports.createApplication = async (req, res, next) => {
  try {
    const university = await University.findById(req.body.universityId);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found',
      });
    }

    // Find program
    const program = university.programs.id(req.body.programId);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }

    const application = await Application.create({
      ...req.body,
      userId: req.user.id,
      programName: program.name,
      timeline: {
        started: Date.now(),
      },
    });

    // Increment university application count
    university.applicationCount += 1;
    await university.save();

    // Create notification
    await Notification.create({
      userId: req.user.id,
      type: 'application',
      title: 'Application Created',
      message: `Your application to ${university.name} has been created successfully`,
      relatedModel: 'Application',
      relatedId: application._id,
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
exports.getAllApplications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = { userId: req.user.id };

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.isArchived !== undefined) {
      query.isArchived = req.query.isArchived === 'true';
    }

    const applications = await Application.find(query)
      .populate('universityId', 'name city country logo')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate('universityId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
exports.updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const allowedFields = [
      'intake',
      'intakeYear',
      'testScores',
      'academicDetails',
      'personalStatement',
      'recommendationLetters',
      'financialInfo',
    ];

    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        application[key] = req.body[key];
      }
    });

    await application.save();

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const oldStatus = application.status;
    application.status = req.body.status;

    // Update timeline
    const now = Date.now();
    switch (req.body.status) {
      case 'Submitted':
        application.timeline.submitted = now;
        break;
      case 'Under Review':
        application.timeline.underReview = now;
        break;
      case 'Accepted':
      case 'Rejected':
      case 'Waitlisted':
        application.timeline.decision = now;
        if (req.body.decisionDetails) {
          application.decisionDetails = req.body.decisionDetails;
        }
        break;
    }

    // Add to status history
    application.statusHistory.push({
      status: req.body.status,
      changedAt: now,
      changedBy: 'User',
      notes: req.body.notes || '',
    });

    await application.save();

    // Create notification
    await Notification.create({
      userId: req.user.id,
      type: 'application',
      title: 'Application Status Updated',
      message: `Your application status changed from ${oldStatus} to ${req.body.status}`,
      relatedModel: 'Application',
      relatedId: application._id,
    });

    // Emit real-time notification
    emitToUser(req.user.id, 'application_update', {
      applicationId: application._id,
      status: req.body.status,
    });

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload document
// @route   POST /api/applications/:id/documents
// @access  Private
exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.documents.push({
      name: req.body.name || req.file.originalname,
      type: req.body.type,
      url: `/uploads/documents/${req.file.filename}`,
      uploadedAt: Date.now(),
      status: 'Uploaded',
    });

    await application.save();

    res.status(200).json({
      success: true,
      data: application.documents[application.documents.length - 1],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/applications/:id/documents/:documentId
// @access  Private
exports.deleteDocument = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const document = application.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Delete file
    const { deleteFile } = require('../utils/helpers');
    await deleteFile(document.url);

    document.remove();
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add note
// @route   POST /api/applications/:id/notes
// @access  Private
exports.addNote = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.notes.push({
      content: req.body.content,
      isPrivate: req.body.isPrivate !== false,
    });

    await application.save();

    res.status(200).json({
      success: true,
      data: application.notes[application.notes.length - 1],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application timeline
// @route   GET /api/applications/:id/timeline
// @access  Private
exports.getApplicationTimeline = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).select('timeline statusHistory');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        timeline: application.timeline,
        statusHistory: application.statusHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check eligibility
// @route   POST /api/applications/check-eligibility
// @access  Private
exports.checkEligibility = async (req, res, next) => {
  try {
    const { universityId, programId, userProfile } = req.body;

    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found',
      });
    }

    const program = university.programs.id(programId);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }

    const eligibilityChecks = {
      gpa: false,
      languageTest: false,
      standardizedTest: false,
      eligible: false,
      requirements: [],
    };

    // Check GPA
    if (program.entryRequirements?.minimumGPA) {
      eligibilityChecks.gpa =
        userProfile.gpa >= program.entryRequirements.minimumGPA;
      if (!eligibilityChecks.gpa) {
        eligibilityChecks.requirements.push(
          `Minimum GPA of ${program.entryRequirements.minimumGPA} required`
        );
      }
    }

    // Check language test
    if (program.entryRequirements?.languageTest) {
      const userLanguageScore = userProfile.languageTestScore || 0;
      eligibilityChecks.languageTest =
        userLanguageScore >= program.entryRequirements.languageTest.minimumScore;
      if (!eligibilityChecks.languageTest) {
        eligibilityChecks.requirements.push(
          `${program.entryRequirements.languageTest.type} score of ${program.entryRequirements.languageTest.minimumScore} required`
        );
      }
    }

    eligibilityChecks.eligible =
      eligibilityChecks.gpa && eligibilityChecks.languageTest;

    res.status(200).json({
      success: true,
      data: eligibilityChecks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate document checklist
// @route   POST /api/applications/document-checklist
// @access  Private
exports.generateDocumentChecklist = async (req, res, next) => {
  try {
    const { universityId, programId } = req.body;

    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found',
      });
    }

    const checklist = [
      { name: 'Academic Transcripts', required: true, uploaded: false },
      { name: 'Statement of Purpose (SOP)', required: true, uploaded: false },
      { name: 'Letters of Recommendation (LOR)', required: true, uploaded: false },
      { name: 'Resume/CV', required: true, uploaded: false },
      { name: 'Passport Copy', required: true, uploaded: false },
      { name: 'Language Test Score', required: true, uploaded: false },
      { name: 'Financial Documents', required: true, uploaded: false },
    ];

    // Add university-specific documents
    if (university.admissions?.requiredDocuments) {
      university.admissions.requiredDocuments.forEach((doc) => {
        if (!checklist.find((item) => item.name === doc)) {
          checklist.push({ name: doc, required: true, uploaded: false });
        }
      });
    }

    res.status(200).json({
      success: true,
      data: checklist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application stats
// @route   GET /api/applications/stats
// @access  Private
exports.getApplicationStats = async (req, res, next) => {
  try {
    const stats = {
      total: 0,
      byStatus: [],
      inProgress: 0,
      submitted: 0,
      accepted: 0,
      rejected: 0,
    };

    const applications = await Application.find({ userId: req.user.id });

    stats.total = applications.length;

    // Group by status
    const statusGroups = {};
    applications.forEach((app) => {
      statusGroups[app.status] = (statusGroups[app.status] || 0) + 1;

      if (app.status === 'In Progress') stats.inProgress++;
      if (app.status === 'Submitted') stats.submitted++;
      if (app.status === 'Accepted') stats.accepted++;
      if (app.status === 'Rejected') stats.rejected++;
    });

    stats.byStatus = Object.entries(statusGroups).map(([status, count]) => ({
      status,
      count,
    }));

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming deadlines
// @route   GET /api/applications/upcoming-deadlines
// @access  Private
exports.getUpcomingDeadlines = async (req, res, next) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const applications = await Application.find({
      userId: req.user.id,
      deadline: { $gte: today, $lte: thirtyDaysFromNow },
      status: { $in: ['Not Started', 'In Progress'] },
    })
      .populate('universityId', 'name logo')
      .sort('deadline')
      .limit(10);

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};