
const Course = require('../models/Course');
const User = require('../models/User');

// 1. Get courses and dashboard data
const getCourses = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required.'
      });
    }

    const { studentCategory, role } = req.user;
    let responseData;

    if (role === 'Admin') {
      const [students, tutors, courses] = await Promise.all([
        User.find({ role: 'Student' })
          .select('-password -__v'),
        User.find({ role: 'Tutor' })
          .select('-password -__v'),
        Course.find()
      ]);

      responseData = {
        message: 'Admin Dashboard Data',
        students,
        tutors,
        courses
      };
    } else if (role === 'Tutor') {
      const courses = await Course.find();

      responseData = {
        message: 'Tutor Dashboard Data',
        courses
      };
    } else if (role === 'Student') {
      if (!studentCategory) {
        return res.status(400).json({
          message: 'Student category is missing.'
        });
      }

      const courses = await Course.find({
        $or: [
          { category: studentCategory },
          { category: 'All' }
        ]
      });

      responseData = {
        message: 'Student Dashboard Data',
        courses
      };
    } else {
      return res.status(403).json({
        message: 'You do not have permission to access this dashboard.'
      });
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Dashboard error:', error);

    return res.status(500).json({
      message: 'Server error fetching dashboard data.'
    });
  }
};

// 2. Seed courses without deleting existing courses
const seedCourses = async (req, res) => {
  const courses = [
    {
        title: 'Certificate in Computer Operations (CCO)',
        description: 'Computer fundamentals, Windows operating system, Microsoft Word, Excel, PowerPoint, and Internet usage.',
        category: 'Normal Basic Computer',
        tutor: 'Mr. David'
      },
      {
        title: 'Professional Training in Computer Operations (PTCO)',
        description: 'Advanced MS Office, Google Workspace tools, CorelDRAW, and using AI assistants like ChatGPT for productivity.',
        category: 'Normal Basic Computer',
        tutor: 'Mrs. Grace'
      },
      {
        title: 'Professional Training in Computer Technology (PTCT)',
        description: 'System settings, application installation/uninstallation, Google Forms, and professional LinkedIn branding.',
        category: 'Normal Basic Computer',
        tutor: 'Mr. David'
      },

      // IT Courses
      {
        title: 'Full-Stack Web Development',
        description: 'Frontend and backend development using HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
        category: 'IT',
        tutor: 'Engr. Sarah'
      },
      {
        title: 'Python Programming for Web & Data',
        description: 'Core Python language, object-oriented concepts, web frameworks, and scripting.',
        category: 'IT',
        tutor: 'Kosiso'
      },
      {
        title: 'Professional Data Analytics',
        description: 'Data cleaning, visualization, statistical analysis, and dashboard generation with Excel and Python.',
        category: 'IT',
        tutor: 'Dr. Alex'
      },
      {
        title: 'Graphic Design & Digital Marketing',
        description: 'Logo design and media production with CorelDRAW, Photoshop, Canva, plus SEO and online ads.',
        category: 'IT',
        tutor: 'Mr. John'
      },

      // IOTS Courses
      {
        title: 'Introduction to Internet of Things (IoT)',
        description: 'Embedded systems, microcontrollers (Arduino/Raspberry Pi), sensors, and IoT network protocols.',
        category: 'IOTS',
        tutor: 'Dr. Alex'
      },
      {
        title: 'Hardware & Software Maintenance',
        description: 'PC maintenance, hardware diagnostics, system troubleshooting, and software recovery.',
        category: 'IOTS',
        tutor: 'Engr. Felix'
      },
      {
        title: 'Computer Networking & Cybersecurity',
        description: 'IP addressing, network configurations, ethical hacking basics, and system security.',
        category: 'IOTS',
        tutor: 'Engr. Michael'
      }
  ];

  try {
    const results = await Promise.all(
      courses.map(course =>
        Course.updateOne(
          { title: course.title },
          { $setOnInsert: course },
          { upsert: true }
        )
      )
    );

    const inserted = results.filter(
      result => result.upsertedCount > 0
    ).length;

    return res.status(200).json({
      message: 'Course seeding completed successfully.',
      inserted,
      totalSeedCourses: courses.length
    });
  } catch (error) {
     return res.status(500).json({
      message: 'Error seeding courses.'
    });
  }
};
module.exports = {
  getCourses,
  seedCourses
};