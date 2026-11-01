const db = require('./database');
const bcrypt = require('bcryptjs');

function seedDatabase() {
  console.log('Seeding FixNear India database with equipment/tool images, hashed passwords, and credentials...');

  // Clear existing data
  db.exec(`
    DELETE FROM complaints;
    DELETE FROM reviews;
    DELETE FROM bookings;
    DELETE FROM technicians;
    DELETE FROM categories;
    DELETE FROM users;
  `);

  const defaultHashedPassword = bcrypt.hashSync('password123', 10);

  // Insert Users with Tool/Equipment logos and hashed password
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, phone, role, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const users = [
    [1, 'Priya Sharma', 'priya@fixnear.in', defaultHashedPassword, '+91 98200 12345', 'customer', 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150'],
    [2, 'Rohan Gupta', 'rohan@fixnear.in', defaultHashedPassword, '+91 98200 23456', 'customer', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150'],
    [3, 'Alex Vance', 'alex@apexpower.in', defaultHashedPassword, '+91 98200 34567', 'provider', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150'], // Electrician equipment
    [4, 'Rajesh Kumar', 'rajesh@rapidflow.in', defaultHashedPassword, '+91 98200 45678', 'provider', 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=150'], // Plumbing equipment
    [5, 'Amit Patel', 'amit@coolbreezeac.in', defaultHashedPassword, '+91 98200 56789', 'provider', 'https://images.unsplash.com/photo-1631545806602-53530089e0ee?w=150'], // AC equipment
    [6, 'Suresh Verma', 'suresh@profix.in', defaultHashedPassword, '+91 98200 67890', 'provider', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=150'], // Appliance tools
    [7, 'Vikram Singh', 'vikram@sterlingclean.in', defaultHashedPassword, '+91 98200 78901', 'provider', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150'], // Cleaning tools
    [8, 'Carlos Mendez', 'carlos@mastertouch.in', defaultHashedPassword, '+91 98200 89012', 'provider', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150'], // Painting tools
    [9, 'Harsh', 'harsh@fixnear.in', defaultHashedPassword, '+91 98200 99999', 'admin', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150'] // Admin shield badge
  ];

  users.forEach(u => insertUser.run(...u));

  // Insert Categories
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

  // Insert Technicians with Equipment Images
  const insertTech = db.prepare(`
    INSERT INTO technicians (id, user_id, business_name, category_id, bio, experience_years, hourly_rate, rating, review_count, verified, verification_doc, address, city, skills, availability_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const techs = [
    [
      1, 3, 'Apex Electrical Solutions', 1,
      'Government licensed electrical team equipped with digital multimeters, MCB testing rigs, and smart switchboard tools in Mumbai.',
      12, 499.00, 4.9, 38, 1, 'DOC_ALEX_VANCE_GOVT_ELEC_LIC_IN.pdf', '104 Hill Road, Bandra West', 'Mumbai, MH, India',
      JSON.stringify(['Inverter Setup', 'Smart Switchboard', 'MCB Panel Repair', 'EV Charger Installation']), 'available'
    ],
    [
      2, 4, 'Rapid Flow Plumbing India', 2,
      'Equipped with heavy-duty pipe wrenches, pressure gauge kits, and hydro-jetting equipment serving Bengaluru.',
      9, 599.00, 4.8, 42, 1, 'DOC_RAJESH_KUMAR_PLUMBING_CERT_IN.pdf', '502 100 Feet Rd, Indiranagar', 'Bengaluru, KA, India',
      JSON.stringify(['Bathroom Fitting Fix', 'Geyser Installation', 'Drainage Unblocking', 'Water Pump Repair']), 'available'
    ],
    [
      3, 5, 'Cool Breeze AC Repair', 3,
      'HVAC specialists equipped with pressure vacuum pumps, R32/R410 gas refill cylinders, and high-pressure jet washers in Delhi NCR.',
      8, 699.00, 4.95, 29, 1, 'DOC_AMIT_PATEL_HVAC_CERT_IN.pdf', '789 Connaught Place', 'Delhi, DL, India',
      JSON.stringify(['AC Jet Servicing', 'R32 Gas Refill', 'Inverter PCB Repair', 'Split AC Installation']), 'busy'
    ],
    [
      4, 6, 'Pro Fix Appliance Care', 4,
      'Full suite of appliance diagnostic meters and genuine spare part kits for washing machines, fridges, and RO purifiers.',
      6, 449.00, 4.7, 19, 0, 'DOC_SURESH_VERMA_CERT_PENDING.pdf', '312 Powai Lake Rd', 'Mumbai, MH, India',
      JSON.stringify(['Washing Machine Repair', 'Refrigerator Servicing', 'RO Purifier Filter Fix', 'Microwave Repair']), 'available'
    ],
    [
      5, 7, 'Sterling Deep Clean Team', 5,
      'Industrial HEPA vacuum cleaners, single-disc floor scrubbers, and steam extraction equipment for homes and offices.',
      5, 999.00, 4.9, 56, 1, 'DOC_VIKRAM_SINGH_INSURANCE_IN.pdf', '405 Koramangala 4th Block', 'Bengaluru, KA, India',
      JSON.stringify(['Full Home Deep Clean', 'Kitchen Degreasing', 'Sofa Steam Clean', 'Bathroom Sanitization']), 'available'
    ],
    [
      6, 8, 'Master Touch Wall Painting', 6,
      'Mechanized dust-free sanding machines, high-pressure paint sprayers, and moisture detector meters for smooth walls.',
      7, 1499.00, 4.6, 14, 0, 'DOC_CARLOS_MENDEZ_PENDING.pdf', '888 Lokhandwala Complex', 'Mumbai, MH, India',
      JSON.stringify(['Interior Wall Painting', 'Waterproofing', 'Texture Paint', 'Drywall Touchup']), 'offline'
    ]
  ];

  techs.forEach(t => insertTech.run(...t));

  // Insert Bookings
  const insertBooking = db.prepare(`
    INSERT INTO bookings (id, customer_id, technician_id, service_category_id, booking_date, time_slot, address, notes, status, total_price, payment_status, payment_id, payment_method, completion_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const bookings = [
    [
      1, 1, 1, 1, '2026-10-03', '10:00 AM - 12:00 PM', 'Flat 402, Sea Breeze Apartments, Bandra West, Mumbai, MH, India',
      'Main MCB switchboard tripping when microwave and AC run together.',
      'requested', 997.00, 'pending', null, 'UPI', null
    ],
    [
      2, 1, 2, 2, '2026-09-28', '02:00 PM - 04:00 PM', 'Flat 402, Sea Breeze Apartments, Bandra West, Mumbai, MH, India',
      'Kitchen sink pipe leaking water under cabinet.',
      'completed', 1197.00, 'paid', 'pay_rzp_mock_98231', 'UPI', 'Replaced faulty rubber seal and leak tested with pressure gauge. All working smoothly.'
    ],
    [
      3, 2, 3, 3, '2026-10-02', '01:00 PM - 03:00 PM', 'House 14, Sector 15, Indiranagar, Bengaluru, KA, India',
      'Split AC blowing warm air and low cooling.',
      'in_progress', 1497.00, 'pending', null, 'Card', null
    ]
  ];

  bookings.forEach(b => insertBooking.run(...b));

  // Insert Reviews
  const insertReview = db.prepare(`
    INSERT INTO reviews (id, booking_id, customer_id, technician_id, rating, comment)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const reviews = [
    [
      1, 2, 1, 2, 5,
      'Rajesh arrived with professional plumbing tools & pressure gauges, fixed the leak cleanly in under 40 minutes! Highly recommended.'
    ]
  ];

  reviews.forEach(r => insertReview.run(...r));

  // Insert Complaints
  const insertComplaint = db.prepare(`
    INSERT INTO complaints (id, booking_id, user_id, subject, description, status, resolution_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const complaints = [
    [
      1, 2, 1, 'Pricing query on rubber washer fitting',
      'Technician charged ₹100 extra for heavy-duty rubber washer. Customer requested invoice review.',
      'open', null
    ]
  ];

  complaints.forEach(c => insertComplaint.run(...c));

  console.log('FixNear India database re-seeded successfully with equipment/tool images and secure passwords.');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
