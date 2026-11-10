const db = require('./database');
const bcrypt = require('bcryptjs');

function seedDatabase() {
  console.log('Seeding FixNear India database with expanded dummy technicians, equipment images, reviews, and bookings...');

  // Clear existing data safely
  db.exec(`
    DELETE FROM complaints;
    DELETE FROM reviews;
    DELETE FROM bookings;
    DELETE FROM technicians;
    DELETE FROM categories;
    DELETE FROM users;
  `);

  const defaultHashedPassword = bcrypt.hashSync('password123', 10);

  // 1. Insert Users (Customers, Providers, and Admin)
  // Tool/Equipment logos only for providers; zero portraits in services.
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, phone, role, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const users = [
    // Customers
    [1, 'Priya Sharma', 'priya@fixnear.in', defaultHashedPassword, '+91 98200 12345', 'customer', 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150'],
    [2, 'Rohan Gupta', 'rohan@fixnear.in', defaultHashedPassword, '+91 98200 23456', 'customer', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150'],
    [3, 'Ananya Deshmukh', 'ananya@fixnear.in', defaultHashedPassword, '+91 98200 33445', 'customer', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'],
    [4, 'Kavita Menon', 'kavita@fixnear.in', defaultHashedPassword, '+91 98200 44556', 'customer', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'],
    [5, 'Aditya Singhania', 'aditya@fixnear.in', defaultHashedPassword, '+91 98200 55667', 'customer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'],

    // Providers / Technicians (Tool / Equipment avatars)
    [6, 'Alex Vance', 'alex@apexpower.in', defaultHashedPassword, '+91 98200 34567', 'provider', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150'], // Electrical Multimeter
    [7, 'Rajesh Kumar', 'rajesh@rapidflow.in', defaultHashedPassword, '+91 98200 45678', 'provider', 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=150'], // Plumbing Wrenches
    [8, 'Amit Patel', 'amit@coolbreezeac.in', defaultHashedPassword, '+91 98200 56789', 'provider', 'https://images.unsplash.com/photo-1631545806602-53530089e0ee?w=150'], // HVAC Gauge
    [9, 'Suresh Verma', 'suresh@profix.in', defaultHashedPassword, '+91 98200 67890', 'provider', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=150'], // Appliance Test Equipment
    [10, 'Vikram Singh', 'vikram@sterlingclean.in', defaultHashedPassword, '+91 98200 78901', 'provider', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150'], // Steam Clean Machines
    [11, 'Carlos Mendez', 'carlos@mastertouch.in', defaultHashedPassword, '+91 98200 89012', 'provider', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150'], // Paint Sprayers
    [12, 'Sunil Rathi', 'sunil@safehomepest.in', defaultHashedPassword, '+91 98200 90123', 'provider', 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=150'], // Pest Control Sprayers
    [13, 'Ramesh Acharya', 'ramesh@woodcraft.in', defaultHashedPassword, '+91 98200 91234', 'provider', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=150'], // Carpentry Tools
    [14, 'Deepak Joshi', 'deepak@sparkwave.in', defaultHashedPassword, '+91 98200 92345', 'provider', 'https://images.unsplash.com/photo-1508873696983-2df5293cb44b?w=150'], // Solar & High Voltage
    [15, 'Manoj Kulkarni', 'manoj@jalseva.in', defaultHashedPassword, '+91 98200 93456', 'provider', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=150'], // Industrial Water Pump

    // Admin Superuser
    [16, 'Harsh', 'harsh@fixnear.in', defaultHashedPassword, '+91 98200 99999', 'admin', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150'] // Admin Shield
  ];

  users.forEach(u => insertUser.run(...u));

  // 2. Insert Service Categories
  const insertCategory = db.prepare(`
    INSERT INTO categories (id, name, slug, icon, description, base_price, popular)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const categories = [
    [1, 'Electrician Services', 'electrician', 'Zap', 'Inverter wiring, MCB tripping, fan fitting, switchboard repair, & EV charger setup.', 399.00, 1],
    [2, 'Plumbing Repair', 'plumber', 'Wrench', 'Pipe leak fixes, tap/faucet installation, flush tank repair, & water pump setup.', 499.00, 1],
    [3, 'AC Servicing & Repair', 'ac-refrigeration', 'Wind', 'Split/Window AC jet servicing, gas leak refill, PCB repair, & installation.', 699.00, 1],
    [4, 'Appliance Servicing', 'appliance-repair', 'Tv', 'Washing machine repair, refrigerator cooling fix, microwave & RO water purifier.', 449.00, 1],
    [5, 'Full Home Deep Cleaning', 'home-cleaning', 'Sparkles', 'Kitchen degreasing, sofa steam cleaning, bathroom sanitization, & move-in clean.', 999.00, 1],
    [6, 'Painting & Waterproofing', 'painting', 'Paintbrush', 'Interior wall touch-up, Asian Paints coating, wall dampness waterproofing.', 1499.00, 0],
    [7, 'Pest Control Services', 'pest-control', 'ShieldCheck', 'Cockroach gel treatment, bedbug eradication, & termite control.', 799.00, 0],
    [8, 'Carpentry Work', 'carpentry', 'Hammer', 'Door lock replacement, modular kitchen hinge fix, drawer repair, & custom furniture.', 549.00, 0]
  ];

  categories.forEach(c => insertCategory.run(...c));

  // 3. Insert Dummy Technicians Across Major Metros (Equipment Images Only)
  const insertTech = db.prepare(`
    INSERT INTO technicians (id, user_id, business_name, category_id, bio, experience_years, hourly_rate, rating, review_count, verified, verification_doc, address, city, skills, availability_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const techs = [
    [
      1, 6, 'Apex Electrical Solutions', 1,
      'Government licensed electrical team equipped with digital multimeters, MCB testing rigs, and smart switchboard tools in Mumbai.',
      12, 499.00, 4.9, 48, 1, 'MH_GOVT_ELECTRICAL_A_GRADE_7821.pdf', '104 Hill Road, Bandra West', 'Mumbai, MH, India',
      JSON.stringify(['Inverter Setup', 'Smart Switchboard', 'MCB Panel Repair', 'EV Charger Installation']), 'available'
    ],
    [
      2, 7, 'Rapid Flow Plumbing India', 2,
      'Equipped with heavy-duty pipe wrenches, pressure gauge kits, and hydro-jetting equipment serving Indiranagar and Koramangala.',
      9, 599.00, 4.85, 52, 1, 'KA_WATER_BOARD_PLUMBING_CERT_9901.pdf', '502 100 Feet Rd, Indiranagar', 'Bengaluru, KA, India',
      JSON.stringify(['Bathroom Fitting Fix', 'Geyser Installation', 'Drainage Unblocking', 'Water Pump Repair']), 'available'
    ],
    [
      3, 8, 'Cool Breeze AC Specialists', 3,
      'HVAC technicians with digital vacuum pumps, R32/R410 gas refill cylinders, and high-pressure jet washers in Delhi NCR.',
      8, 699.00, 4.95, 39, 1, 'DL_HVAC_REFRIGERATION_LIC_4412.pdf', '789 Connaught Place', 'Delhi, DL, India',
      JSON.stringify(['AC Jet Servicing', 'R32 Gas Refill', 'Inverter PCB Repair', 'Split AC Installation']), 'busy'
    ],
    [
      4, 9, 'Pro Fix Appliance Care', 4,
      'Appliance diagnostic meters and genuine spare part kits for top load / front load washing machines, fridges, and RO purifiers.',
      6, 449.00, 4.75, 29, 1, 'MH_CONSUMER_APPLIANCE_CERT_3321.pdf', '312 Powai Lake Rd', 'Mumbai, MH, India',
      JSON.stringify(['Washing Machine Repair', 'Refrigerator Servicing', 'RO Purifier Filter Fix', 'Microwave Repair']), 'available'
    ],
    [
      5, 10, 'Sterling Deep Clean Team', 5,
      'Industrial HEPA vacuum cleaners, single-disc floor scrubbers, and steam extraction equipment for homes and offices.',
      5, 999.00, 4.9, 64, 1, 'KA_HYGIENE_CLEANING_INSURANCE_8812.pdf', '405 Koramangala 4th Block', 'Bengaluru, KA, India',
      JSON.stringify(['Full Home Deep Clean', 'Kitchen Degreasing', 'Sofa Steam Clean', 'Bathroom Sanitization']), 'available'
    ],
    [
      6, 11, 'Master Touch Wall Painting', 6,
      'Mechanized dust-free sanding machines, high-pressure paint sprayers, and moisture detector meters for smooth walls.',
      7, 1499.00, 4.65, 24, 0, 'DOC_CARLOS_MENDEZ_PENDING_AUDIT.pdf', '888 Lokhandwala Complex', 'Mumbai, MH, India',
      JSON.stringify(['Interior Wall Painting', 'Waterproofing', 'Texture Paint', 'Drywall Touchup']), 'offline'
    ],
    [
      7, 12, 'SafeHome Herbal Pest Defense', 7,
      'Eco-friendly thermal fogging units, gel injection dispensers, and odorless sprayers certified for residential pest control.',
      6, 799.00, 4.88, 31, 1, 'DL_PEST_MANAGEMENT_BOARD_2231.pdf', '12 Vasant Kunj Sector C', 'Delhi, DL, India',
      JSON.stringify(['Cockroach Gel Treatment', 'Termite Protection', 'Bedbug Heat Eradication', 'Mosquito Control']), 'available'
    ],
    [
      8, 13, 'WoodCraft Precision Carpentry', 8,
      'Laser leveling tools, plunge routers, electric planers, and hinge jigs for modular kitchen and home furniture repair.',
      10, 549.00, 4.82, 37, 1, 'KA_FURNITURE_CRAFTS_GUILD_1109.pdf', '204 HSR Layout Sector 2', 'Bengaluru, KA, India',
      JSON.stringify(['Modular Kitchen Hinge Fix', 'Door Lock Installation', 'Custom Wardrobe Fitting', 'Drawer Slide Repair']), 'available'
    ],
    [
      9, 14, 'SparkWave High Voltage & Solar', 1,
      'Solar net-metering specialists, high voltage insulation testers, and 3-phase industrial panel certified engineers in Pune.',
      11, 649.00, 4.92, 45, 1, 'MH_SOLAR_RENEWABLE_CERT_8820.pdf', '45 FC Road, Shivaji Nagar', 'Pune, MH, India',
      JSON.stringify(['Solar Inverter Wiring', '3-Phase Panel Setup', 'Earthing Pit Testing', 'Short Circuit Detection']), 'available'
    ],
    [
      10, 15, 'JalSeva Aqua & Pressure Solutions', 2,
      'High-pressure sewer camera inspection tools, CPVC heat fusion welders, and commercial booster pump repair specialists in Hyderabad.',
      8, 549.00, 4.78, 28, 0, 'TS_HYDRO_MUNICIPAL_PENDING_DOC.pdf', '18 Jubilee Hills Road No. 36', 'Hyderabad, TS, India',
      JSON.stringify(['Underground Leak Detection', 'Booster Pump Installation', 'Overhead Tank Cleaning', 'Pipe Fusion Welding']), 'available'
    ]
  ];

  techs.forEach(t => insertTech.run(...t));

  // 4. Insert Dummy Bookings Covering All Statuses (Requested, Accepted, In Progress, Completed)
  const insertBooking = db.prepare(`
    INSERT INTO bookings (id, customer_id, technician_id, service_category_id, booking_date, time_slot, address, notes, status, total_price, payment_status, payment_id, payment_method, completion_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const bookings = [
    [
      1, 1, 1, 1, '2026-11-12', '10:00 AM - 12:00 PM', 'Flat 402, Sea Breeze Apartments, Bandra West, Mumbai, MH, India',
      'Main MCB switchboard tripping when microwave and air conditioner run simultaneously.',
      'requested', 997.00, 'pending', null, 'UPI', null
    ],
    [
      2, 1, 2, 2, '2026-11-08', '02:00 PM - 04:00 PM', 'Flat 402, Sea Breeze Apartments, Bandra West, Mumbai, MH, India',
      'Kitchen sink pipe leaking water under cabinet. Need urgent seal replacement.',
      'completed', 1197.00, 'paid', 'pay_rzp_mock_98231', 'UPI', 'Replaced faulty heavy-duty rubber seal and pressure tested all joints. Flow restored with 0 leakage.'
    ],
    [
      3, 2, 3, 3, '2026-11-11', '01:00 PM - 03:00 PM', 'House 14, Sector 15, Indiranagar, Bengaluru, KA, India',
      'Split AC blowing ambient air with very low cooling. Suspect gas refill needed.',
      'in_progress', 1497.00, 'pending', null, 'Card', null
    ],
    [
      4, 3, 5, 5, '2026-11-09', '09:00 AM - 01:00 PM', 'Tower 3, Penthouse 1802, Powai Hiranandani, Mumbai, MH, India',
      'Post-renovation deep cleaning for 3BHK flat including balcony steam wash.',
      'completed', 2097.00, 'paid', 'pay_rzp_mock_44912', 'NetBanking', 'Completed HEPA extraction on all carpets, kitchen degreasing, and chemical sanitization of 3 bathrooms.'
    ],
    [
      5, 4, 8, 8, '2026-11-13', '04:00 PM - 06:00 PM', 'Villa 22, Palm Meadows, Whitefield, Bengaluru, KA, India',
      'Modular kitchen soft-close hydraulic hinge replacement and master bedroom door lock repair.',
      'accepted', 1147.00, 'pending', null, 'UPI', null
    ],
    [
      6, 5, 7, 7, '2026-11-07', '11:00 AM - 01:00 PM', 'C-404, Defence Colony, New Delhi, DL, India',
      'Quarterly kitchen cockroach gel treatment and balcony termite spray.',
      'completed', 1697.00, 'paid', 'pay_rzp_mock_77319', 'UPI', 'Applied targeted Bayer Maxforce gel in all cabinets and sprayed perimeter defense. Safe for pets.'
    ],
    [
      7, 2, 9, 1, '2026-11-14', '03:00 PM - 05:00 PM', 'Flat 12B, Magarpatta City, Pune, MH, India',
      'Rooftop 5kW solar inverter installation and net-meter wiring setup.',
      'requested', 1747.00, 'pending', null, 'UPI', null
    ]
  ];

  bookings.forEach(b => insertBooking.run(...b));

  // 5. Insert Realistic Customer Reviews with Ratings
  const insertReview = db.prepare(`
    INSERT INTO reviews (id, booking_id, customer_id, technician_id, rating, comment)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const reviews = [
    [
      1, 2, 1, 2, 5,
      'Rajesh arrived with professional heavy pipe wrenches and pressure test gauges. Replaced the sink coupling cleanly in under 35 minutes! Transparent pricing and polite service.'
    ],
    [
      2, 4, 3, 5, 5,
      'Vikram and his cleaning crew used top-tier steam extraction machines. The sofa and tile grout look brand new! Very thorough job.'
    ],
    [
      3, 6, 5, 7, 5,
      'Sunil arrived right on time with proper protective gear and odorless gel. Completely eradicated the pest issue within 48 hours without any chemical smell.'
    ],
    [
      4, 1, 1, 1, 5,
      'Apex Electrical diagnosed our fluctuating load issue in minutes using digital multimeters. Very knowledgeable and safety-conscious technicians.'
    ]
  ];

  reviews.forEach(r => insertReview.run(...r));

  // 6. Insert Dispute & Mediation Complaints for Admin Harsh Review
  const insertComplaint = db.prepare(`
    INSERT INTO complaints (id, booking_id, user_id, subject, description, status, resolution_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const complaints = [
    [
      1, 2, 1, 'Pricing query on replacement rubber coupling washer',
      'Technician charged ₹120 for an extra heavy-duty brass coupling washer. Requested receipt validation.',
      'resolved', 'Admin Harsh reviewed invoice logs with Rajesh. The heavy-duty brass washer was authentic and justified, applied a courtesy ₹50 platform discount to customer wallet.'
    ],
    [
      2, 3, 2, 'Technician delayed arrival by 30 minutes due to traffic',
      'Technician was scheduled for 1:00 PM slot but arrived at 1:35 PM due to heavy rain in Indiranagar.',
      'resolved', 'Admin Harsh mediated: Provider notified customer in advance. Job completed with highest quality; ₹100 credit voucher issued for next service.'
    ],
    [
      3, 5, 4, 'Inquiry on spare part warranty for soft-close hydraulic hinges',
      'Customer wants official confirmation on whether the newly fitted Hettich hinges carry a 1-year manufacturer warranty.',
      'open', null
    ]
  ];

  complaints.forEach(c => insertComplaint.run(...c));

  console.log('FixNear India database successfully populated with rich dummy data across all categories and metros!');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
