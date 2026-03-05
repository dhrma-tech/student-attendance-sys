#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

const createIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance');
    console.log('🔗 Connected to MongoDB');

    const db = mongoose.connection.db;

    // Collections and their indexes
    const indexes = [
      {
        collection: 'students',
        indexes: [
          { email: 1 },
          { prnNumber: 1 },
          { role: 1 },
          { branch: 1, year: 1 },
          { registeredDeviceId: 1 },
          { enrolledClasses: 1 }
        ]
      },
      {
        collection: 'teachers',
        indexes: [
          { email: 1 },
          { role: 1 },
          { department: 1 },
          { assignedClasses: 1 }
        ]
      },
      {
        collection: 'admins',
        indexes: [
          { email: 1 },
          { role: 1 }
        ]
      },
      {
        collection: 'classes',
        indexes: [
          { courseCode: 1 },
          { teacherId: 1 },
          { branch: 1, semester: 1 },
          { students: 1 }
        ]
      },
      {
        collection: 'sessions',
        indexes: [
          { classId: 1, startTime: -1 },
          { teacherId: 1 },
          { isActive: 1 },
          { startTime: -1 },
          { 'attendees.studentId': 1, 'attendees.timestamp': -1 },
          { 'attendees.deviceId': 1 }
        ]
      }
    ];

    // Create indexes
    for (const { collection, indexes: indexList } of indexes) {
      console.log(`📊 Creating indexes for ${collection}...`);
      
      for (const index of indexList) {
        try {
          await db.collection(collection).createIndex(index, { 
            name: Object.keys(index).join('_'),
            background: true 
          });
          console.log(`  ✅ Created index: ${JSON.stringify(index)}`);
        } catch (error) {
          if (error.code === 85) {
            console.log(`  ⚠️  Index already exists: ${JSON.stringify(index)}`);
          } else {
            console.error(`  ❌ Error creating index: ${error.message}`);
          }
        }
      }
    }

    // List all indexes
    console.log('\n📋 Current indexes:');
    for (const { collection } of indexes) {
      const existingIndexes = await db.collection(collection).listIndexes();
      console.log(`\n${collection}:`);
      existingIndexes.forEach(index => {
        console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Database indexes created successfully!');

  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  createIndexes();
}

module.exports = createIndexes;
