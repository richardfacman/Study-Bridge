const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const User = require('../models/User');
const University = require('../models/University');
const Scholarship = require('../models/Scholarship');
const VisaGuide = require('../models/VisaGuide');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    await University.deleteMany({});
    await Scholarship.deleteMany({});
    await VisaGuide.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const admin = await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@studybridge.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isEmailVerified: true,
    });
    console.log('👤 Created admin user');

    const universities = await parseCSV(path.join(__dirname, '../../sample-data/universities.csv'));
    if (universities.length > 0) {
      const universityImages = {
      'harvard-university': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1528822855840-2d5955e672c2?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1528822855840-2d5955e672c2?w=800']
      },
      'stanford-university': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1519030141951-3de6908ab21c?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1519030141951-3de6908ab21c?w=800']
      },
      'mit': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1483376154476-a4895e6d2b7b?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1483376154476-a4895e6d2b7b?w=800']
      },
      'oxford-university': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800']
      },
      'cambridge-university': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1566353076919-7332f83e5b50?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1566353076919-7332f83e5b50?w=800']
      },
      'yale-university': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1594164796808-2a97c5c53e70?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1594164796808-2a97c5c53e70?w=800']
      },
      'princeton-university': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1594104678702-4eb6c17ea652?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1594104678702-4eb6c17ea652?w=800']
      },
      'columbia-university': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1565895405138-2ddb1e19f74d?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1565895405138-2ddb1e19f74d?w=800']
      },
      'toronto-university': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1569517287805-c4ebdb6f4c9c?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1569517287805-c4ebdb6f4c9c?w=800']
      },
      'ubc': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1569253139174-af3c62d26598?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1569253139174-af3c62d26598?w=800']
      },
      'melbourne-university': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1571175447341-a51c97e1d681?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1571175447341-a51c97e1d681?w=800']
      },
      'anu': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1567828300059-3358dbbc4543?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1567828300059-3358dbbc4543?w=800']
      },
      'eth-zurich': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1567604997282-93f8b3b1c68f?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1567604997282-93f8b3b1c68f?w=800']
      },
      'nus': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1555902346-fb45547e2774?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1555902346-fb45547e2774?w=800']
      },
      'edinburgh-university': {
        logo: 'https://images.unsplash.com/photo-1569982175971-d92e01e86958?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1555212697734-a8f2f50f19b7?w=800&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1555212697734-a8f2f50f19b7?w=800']
      }
    };

    const universityDocs = universities.map((u) => {
      const images = universityImages[u.slug] || {};
      return {
        name: u.name,
        slug: u.slug,
        country: u.country,
        city: u.city,
        region: u.region,
        establishedYear: parseInt(u.establishedYear),
        universityType: u.universityType,
        logo: images.logo || '',
        coverImage: images.coverImage || '',
        images: images.images || [],
        overview: {
          description: u.description,
          mission: u.mission,
        },
        stats: {
          totalStudents: parseInt(u.totalStudents),
          internationalStudents: parseInt(u.internationalStudents),
          facultyCount: parseInt(u.facultyCount),
          acceptanceRate: parseFloat(u.acceptanceRate),
          graduationRate: parseFloat(u.graduationRate),
          employmentRate: parseFloat(u.employmentRate),
        },
        tuitionFees: {
          undergraduate: {
            international: { amount: parseInt(u.tuitionUndergraduate), currency: u.currency },
          },
          postgraduate: {
            international: { amount: parseInt(u.tuitionPostgraduate), currency: u.currency },
          },
        },
        languageOfInstruction: ['English'],
        intakePeriods: u.intakePeriods.split(',').map((ip) => ip.trim()),
        isVerified: u.isVerified === 'true',
        isFeatured: u.isFeatured === 'true',
      };
    });
      await University.insertMany(universityDocs);
      console.log(`🎓 Created ${universityDocs.length} universities from CSV`);
    }

    const scholarships = await parseCSV(path.join(__dirname, '../../sample-data/scholarships.csv'));
    if (scholarships.length > 0) {
      const scholarshipDocs = scholarships.map((s) => ({
        name: s.name,
        type: s.type,
        provider: s.provider,
        country: s.country,
        fieldOfStudy: s.fieldOfStudy.split(',').map((f) => f.trim()),
        amount: {
          value: parseInt(s.amount),
          currency: 'USD',
          type: 'Fixed Amount',
        },
        coverage: s.coverage.split(',').reduce((acc, c) => {
          acc[c.trim()] = true;
          return acc;
        }, {}),
        description: s.description,
        eligibilityCriteria: {
          minimumGPA: parseFloat(s.eligibilityCriteria.split(',')[0].split(':')[1]),
          nationality: s.eligibilityCriteria.split(',')[1].split(':')[1].trim(),
        },
        deadline: new Date(s.deadline),
        applicationStartDate: new Date('2025-01-01'),
        isActive: true,
      }));
      await Scholarship.insertMany(scholarshipDocs);
      console.log(`💰 Created ${scholarshipDocs.length} scholarships from CSV`);
    }

    const visaGuides = [
      {
        country: 'USA',
        visaTypes: [
          {
            name: 'F-1 Student Visa',
            description: 'For academic students enrolled in universities',
            duration: 'Duration of Study',
            processingTime: '3-5 weeks',
            fee: { amount: 160, currency: 'USD' },
          },
        ],
        generalRequirements: [
          'Valid passport',
          'I-20 form from university',
          'Proof of financial support',
          'SEVIS fee payment',
        ],
        requiredDocuments: [
          {
            name: 'Passport',
            description: 'Valid for at least 6 months',
            mandatory: true,
            format: 'Original',
          },
          {
            name: 'I-20 Form',
            description: 'Issued by university',
            mandatory: true,
            format: 'Original',
          },
        ],
        financialRequirements: {
          minimumBankBalance: { amount: 50000, currency: 'USD' },
          proofOfFunds: ['Bank statements', 'Scholarship letter', 'Sponsor affidavit'],
          workPermitAvailable: true,
        },
        medicalRequirements: {
          medicalExamRequired: false,
          vaccinationsRequired: ['COVID-19'],
          healthInsurance: {
            required: true,
            minimumCoverage: 100000,
            currency: 'USD',
          },
        },
        biometrics: {
          required: true,
          validityPeriod: '10 years',
          cost: { amount: 85, currency: 'USD' },
        },
        postStudyWorkVisa: {
          available: true,
          duration: '12-36 months (OPT)',
          eligibility: ['Completed degree', 'Job offer in field of study'],
        },
      },
    ];

    await VisaGuide.insertMany(visaGuides);
    console.log('✈️  Created sample visa guides');

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

seedData();