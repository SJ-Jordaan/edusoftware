import { connectToDatabase } from '../Mongo';
import { BadgeModel } from '../models';
import { initialBadges } from './InitialBadges';

async function seedBadges() {
  try {
    await connectToDatabase();

    // Insert badges if they don't exist
    for (const badge of initialBadges) {
      await BadgeModel.findOneAndUpdate({ name: badge.name }, badge, {
        upsert: true,
        new: true,
      });
    }

    console.log('Badges seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding badges:', error);
    process.exit(1);
  }
}

seedBadges();
