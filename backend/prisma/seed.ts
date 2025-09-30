import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@propertyhelper2025.com' },
    update: {},
    create: {
      email: 'admin@propertyhelper2025.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+1234567890',
      role: 'SUPER_ADMIN',
      isActive: true,
      isVerified: true
    }
  });

  // Create demo agent user
  const agentPassword = await bcrypt.hash('agent123', 12);
  const agentUser = await prisma.user.upsert({
    where: { email: 'agent@propertyhelper2025.com' },
    update: {},
    create: {
      email: 'agent@propertyhelper2025.com',
      password: agentPassword,
      firstName: 'Demo',
      lastName: 'Agent',
      phone: '+1234567891',
      role: 'AGENT',
      isActive: true,
      isVerified: true
    }
  });

  // Create demo regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@propertyhelper2025.com' },
    update: {},
    create: {
      email: 'user@propertyhelper2025.com',
      password: userPassword,
      firstName: 'Demo',
      lastName: 'User',
      phone: '+1234567892',
      role: 'USER',
      isActive: true,
      isVerified: true
    }
  });

  console.log('✅ Users created');

  // Create sample properties
  const properties = [
    {
      title: 'Modern Family Home in Sandton',
      description: 'Beautiful 4-bedroom family home with modern amenities, swimming pool, and double garage. Perfect for a growing family.',
      price: 2850000,
      propertyType: 'HOUSE',
      status: 'ACTIVE',
      address: '123 Oak Avenue',
      city: 'Sandton',
      province: 'Gauteng',
      postalCode: '2196',
      bedrooms: 4,
      bathrooms: 3,
      garages: 2,
      floorSize: 280,
      landSize: 1000,
      yearBuilt: 2018,
      features: ['Swimming Pool', 'Garden', 'Security System', 'Air Conditioning'],
      userId: agentUser.id
    },
    {
      title: 'Luxury Apartment in Cape Town CBD',
      description: 'Stunning 2-bedroom apartment with panoramic city views. High-end finishes and modern appliances included.',
      price: 3200000,
      propertyType: 'APARTMENT',
      status: 'ACTIVE',
      address: '456 Long Street',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      bedrooms: 2,
      bathrooms: 2,
      garages: 1,
      floorSize: 120,
      yearBuilt: 2020,
      features: ['City Views', 'Balcony', 'Gym Access', 'Concierge'],
      userId: agentUser.id
    },
    {
      title: 'Spacious Townhouse in Durban North',
      description: '3-bedroom townhouse with private garden and lock-up garage. Pet-friendly and close to amenities.',
      price: 1850000,
      propertyType: 'TOWNHOUSE',
      status: 'ACTIVE',
      address: '789 Beach Road',
      city: 'Durban North',
      province: 'KwaZulu-Natal',
      postalCode: '4051',
      bedrooms: 3,
      bathrooms: 2.5,
      garages: 1,
      floorSize: 180,
      landSize: 300,
      yearBuilt: 2015,
      features: ['Private Garden', 'Pet Friendly', 'Built-in Braai', 'Security Complex'],
      userId: agentUser.id
    },
    {
      title: 'Vacant Land in Pretoria East',
      description: 'Prime development land in growing area. Perfect for residential or commercial development.',
      price: 950000,
      propertyType: 'LAND',
      status: 'ACTIVE',
      address: '321 Development Drive',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0181',
      landSize: 5000,
      features: ['Development Opportunity', 'Corner Stand', 'Services Available'],
      userId: agentUser.id
    },
    {
      title: 'Commercial Office Space in Johannesburg',
      description: 'Modern office space in prime business district. Includes parking and 24/7 security.',
      price: 4500000,
      propertyType: 'COMMERCIAL',
      status: 'ACTIVE',
      address: '654 Business Park',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2001',
      bathrooms: 2,
      floorSize: 350,
      yearBuilt: 2019,
      features: ['Prime Location', 'Parking', '24/7 Security', 'Backup Generator'],
      userId: agentUser.id
    }
  ];

  for (const propertyData of properties) {
    const property = await prisma.property.upsert({
      where: {
        // Use a combination of title and address as unique identifier for upsert
        title_address: {
          title: propertyData.title,
          address: propertyData.address
        }
      },
      update: {},
      create: propertyData
    });

    // Add primary image for each property
    await prisma.propertyImage.upsert({
      where: {
        propertyId_url: {
          propertyId: property.id,
          url: `https://picsum.photos/800/600?random=${property.id}`
        }
      },
      update: { isPrimary: true },
      create: {
        url: `https://picsum.photos/800/600?random=${property.id}`,
        alt: `${propertyData.title} - Primary Image`,
        isPrimary: true,
        order: 0,
        propertyId: property.id
      }
    });
  }

  console.log('✅ Properties created');

  // Create sample templates
  const templates = [
    {
      name: 'Modern Property Flyer',
      description: 'Clean and modern property flyer template',
      category: 'Flyers',
      data: {
        elements: [
          {
            type: 'image',
            x: 0,
            y: 0,
            width: 800,
            height: 600,
            src: 'property-image-placeholder'
          },
          {
            type: 'text',
            x: 50,
            y: 500,
            width: 700,
            height: 100,
            text: 'Property Title Here',
            fontSize: 48,
            fontFamily: 'Arial',
            fill: 'white'
          }
        ]
      },
      isPublic: true,
      tags: ['modern', 'clean', 'professional'],
      userId: adminUser.id
    },
    {
      name: 'Social Media Property Post',
      description: 'Square format template for social media posts',
      category: 'Social Media',
      data: {
        elements: [
          {
            type: 'image',
            x: 0,
            y: 0,
            width: 600,
            height: 600,
            src: 'property-image-placeholder'
          },
          {
            type: 'text',
            x: 50,
            y: 450,
            width: 500,
            height: 150,
            text: 'Beautiful property for sale!\nContact us for more info',
            fontSize: 24,
            fontFamily: 'Arial',
            fill: 'white'
          }
        ]
      },
      isPublic: true,
      tags: ['social media', 'square', 'engaging'],
      userId: agentUser.id
    }
  ];

  for (const templateData of templates) {
    await prisma.template.upsert({
      where: {
        name_userId: {
          name: templateData.name,
          userId: templateData.userId
        }
      },
      update: {},
      create: templateData
    });
  }

  console.log('✅ Templates created');

  // Create sample leads
  const leads = [
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '+27831234567',
      source: 'WEBSITE',
      status: 'NEW',
      notes: 'Interested in family homes in Sandton area',
      userId: agentUser.id
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@email.com',
      phone: '+27839876543',
      source: 'WHATSAPP',
      status: 'CONTACTED',
      notes: 'Looking for apartment in Cape Town CBD',
      userId: agentUser.id
    }
  ];

  for (const leadData of leads) {
    await prisma.lead.upsert({
      where: {
        email_userId: {
          email: leadData.email,
          userId: leadData.userId
        }
      },
      update: {},
      create: leadData
    });
  }

  console.log('✅ Leads created');

  // Create sample credits
  const credits = [
    {
      amount: 1000,
      balance: 1000,
      type: 'PURCHASE',
      description: 'Initial credit purchase',
      userId: agentUser.id
    },
    {
      amount: 500,
      balance: 500,
      type: 'PURCHASE',
      description: 'Additional credits',
      userId: regularUser.id
    }
  ];

  for (const creditData of credits) {
    await prisma.credit.upsert({
      where: {
        // Use a combination to make it unique for upsert
        amount_type_userId: {
          amount: creditData.amount,
          type: creditData.type,
          userId: creditData.userId
        }
      },
      update: {},
      create: creditData
    });
  }

  console.log('✅ Credits created');

  // Create credit packages
  const creditPackages = [
    {
      name: 'Starter Pack',
      description: 'Perfect for getting started with AI photo enhancement',
      credits: 100,
      price: 1000.00,
      currency: 'ZAR',
      isPopular: false,
      sortOrder: 1
    },
    {
      name: 'Professional Pack',
      description: 'Ideal for regular property marketing needs',
      credits: 500,
      price: 4500.00,
      currency: 'ZAR',
      isPopular: true,
      sortOrder: 2
    },
    {
      name: 'Enterprise Pack',
      description: 'Best value for high-volume property marketing',
      credits: 1000,
      price: 8000.00,
      currency: 'ZAR',
      isPopular: false,
      sortOrder: 3
    }
  ];

  for (const packageData of creditPackages) {
    await prisma.creditPackage.upsert({
      where: {
        id: packageData.name.toLowerCase().replace(/\s+/g, '-')
      },
      update: {},
      create: {
        id: packageData.name.toLowerCase().replace(/\s+/g, '-'),
        ...packageData
      }
    });
  }

  console.log('✅ Credit packages created');

  // Create sample notifications
  const notifications = [
    {
      type: 'INFO',
      title: 'Welcome to Property Helper 2025',
      message: 'Your account has been successfully created. Start exploring properties!',
      userId: regularUser.id
    },
    {
      type: 'SUCCESS',
      title: 'Credits Added',
      message: '500 credits have been added to your account',
      userId: regularUser.id
    }
  ];

  for (const notificationData of notifications) {
    await prisma.notification.upsert({
      where: {
        title_userId: {
          title: notificationData.title,
          userId: notificationData.userId
        }
      },
      update: {},
      create: notificationData
    });
  }

  console.log('✅ Notifications created');

  // Create sample audit logs
  const auditLogs = [
    {
      action: 'CREATE',
      entityType: 'USER',
      entityId: regularUser.id,
      userId: adminUser.id,
      newValues: { email: regularUser.email, role: regularUser.role }
    },
    {
      action: 'PURCHASE',
      entityType: 'CREDIT',
      entityId: 'credit-1',
      userId: agentUser.id,
      newValues: { amount: 1000, type: 'PURCHASE' }
    }
  ];

  for (const logData of auditLogs) {
    await prisma.auditLog.create({
      data: logData
    });
  }

  console.log('✅ Audit logs created');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Login credentials:');
  console.log('Admin: admin@propertyhelper2025.com / admin123');
  console.log('Agent: agent@propertyhelper2025.com / agent123');
  console.log('User: user@propertyhelper2025.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });