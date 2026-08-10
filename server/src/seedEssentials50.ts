import { Pool } from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const CLOUD_NAME = 'dex3v19sz';
const UPLOAD_PRESET = 'gift_item_preset';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const products = [
  // Kitchen & Dining (20 items)
  {
    category: "Kitchen & Dining",
    name: "Prestige 7-Piece Non-Stick Cookware Set",
    description: "Essential non-stick pots and pans with heat-resistant handles and tempered glass lids.",
    price: 75000,
    url: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Stoneware 16-Piece Dinnerware Set",
    description: "Complete dinner set for four, featuring dinner plates, salad plates, bowls, and mugs.",
    price: 58900,
    url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Stainless Steel 24-Piece Flatware Set",
    description: "Elegant, mirror-polished cutlery set with service for 6 people.",
    price: 18500,
    url: "https://images.unsplash.com/photo-1543510473-ac2c35329a28?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Chef Knife Block Set (15-Piece)",
    description: "High-carbon stainless steel kitchen knives in a beautiful hardwood block.",
    price: 48000,
    url: "https://images.unsplash.com/photo-1593113598332-cd59c5ad3f90?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Preseasoned Cast Iron Skillet (12-inch)",
    description: "Heavy-duty cast iron pan perfect for searing, baking, and frying.",
    price: 22000,
    url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Glass Mixing Bowls Set (Set of 5)",
    description: "Multi-size prep and mixing bowls with airtight lids for storage.",
    price: 15500,
    url: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Professional Baking Sheet Pans (Set of 3)",
    description: "Heavy-gauge steel rimmed cookie sheets for even roasting and baking.",
    price: 14000,
    url: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Glass Food Storage Containers (18-Piece)",
    description: "Leakproof, BPA-free meal prep and storage containers with snap locking lids.",
    price: 26500,
    url: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Stainless Steel Measuring Cups & Spoons",
    description: "Heavy-duty nesting measuring tools for precise cooking and baking.",
    price: 8500,
    url: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Digital Kitchen Food Scale",
    description: "High-precision electronic scale for baking and diet portion control.",
    price: 9800,
    url: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Premium Bamboo Cutting Boards (Set of 3)",
    description: "Thick cutting blocks with juice grooves, friendly to knife blades.",
    price: 16000,
    url: "https://images.unsplash.com/photo-1594385208974-2e75f9d8ab48?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Revolving Spice Tower Organizer",
    description: "Rotating spice rack equipped with 20 pre-labeled glass jars.",
    price: 24500,
    url: "https://images.unsplash.com/photo-1533630988607-cc8f5cf038ab?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Programmable Drip Coffee Maker",
    description: "12-cup electric coffee maker with auto-start settings and thermal carafe.",
    price: 32000,
    url: "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "High-Speed Countertop Blender (1.5L)",
    description: "High-performance blender for making smoothies, soups, and crushing ice.",
    price: 35000,
    url: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Compact 8-in-1 Food Processor",
    description: "Multifunctional processor for chopping, slicing, grating, and kneading.",
    price: 42000,
    url: "https://images.unsplash.com/photo-1626806787426-5910811b6325?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Double-Wall Electric Kettle (1.7L)",
    description: "Rapid-boil stainless steel water kettle with auto shut-off safety.",
    price: 19500,
    url: "https://images.unsplash.com/photo-1594179924453-da4a19a9a3f2?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Digital Air Fryer (8L Capacity)",
    description: "Oil-free cooking presets with rapid air circulation technology.",
    price: 58000,
    url: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Digital Microwave Oven (20L)",
    description: "Analog-digital microwave with multi-stage cooking and defrost settings.",
    price: 85000,
    url: "https://images.unsplash.com/photo-1609187321589-9eb12ff5130b?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Retro Style 2-Slice Toaster",
    description: "Extra-wide slot toaster with self-centering and browning controls.",
    price: 26000,
    url: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=600"
  },
  {
    category: "Kitchen & Dining",
    name: "Professional Stand Mixer (5L)",
    description: "Heavy-duty electric mixer with flat beater, dough hook, and wire whip.",
    price: 95000,
    url: "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?q=80&w=600"
  },

  // Bedding & Bath (10 items)
  {
    category: "Bedding & Bath",
    name: "Egyptian Cotton Bed Sheets Set",
    description: "Luxury 600 thread-count deep pocket sheets with matching pillowcases.",
    price: 45000,
    url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600"
  },
  {
    category: "Bedding & Bath",
    name: "All-Season Down Comforter Duvet",
    description: "Premium hypoallergenic micro-fiber fill comforter for ultimate comfort.",
    price: 55000,
    url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600"
  },
  {
    category: "Bedding & Bath",
    name: "Shredded Memory Foam Pillows (Set of 2)",
    description: "Orthopedic neck support pillows with cooling bamboo covers.",
    price: 28000,
    url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600"
  },
  {
    category: "Bedding & Bath",
    name: "Organic Turkish Cotton Towels (Set of 4)",
    description: "Plush, heavy-weight bath towels that get softer with every wash.",
    price: 24000,
    url: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=600"
  },
  {
    category: "Bedding & Bath",
    name: "Waffle Weave Fabric Shower Curtain",
    description: "Water-repellent hotel luxury shower curtain with rustproof metal hooks.",
    price: 13500,
    url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600"
  },
  {
    category: "Bedding & Bath",
    name: "Non-Slip Memory Foam Bath Mats (Set of 2)",
    description: "Soft, highly absorbent floor mats with durable rubber backing.",
    price: 16500,
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600"
  },
  {
    category: "Bedding & Bath",
    name: "Divided Laundry Hamper with Liners",
    description: "Dual-compartment sorting hamper with removable wash bags.",
    price: 18500,
    url: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?q=80&w=600"
  },
  {
    category: "Bedding & Bath",
    name: "Foldable Drying Rack for Clothes",
    description: "Heavy-duty stainless steel clothes airer with wings.",
    price: 21000,
    url: "https://images.unsplash.com/photo-1610557892470-76d74cd1228d?q=80&w=600"
  },
  {
    category: "Bedding & Bath",
    name: "Digital Steam Iron (2400W)",
    description: "Smart temperature control iron with scratch-resistant ceramic soleplate.",
    price: 27000,
    url: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=600"
  },
  {
    category: "Bedding & Bath",
    name: "Sturdy Folding Ironing Board",
    description: "Extra wide ironing board with heat-resistant cotton padding cover.",
    price: 19800,
    url: "https://images.unsplash.com/photo-1603796846097-bee99e4a60c9?q=80&w=600"
  },

  // Living Room & Decor (10 items)
  {
    category: "Living Room",
    name: "Modern Center Coffee Table",
    description: "Sleek wooden coffee table with secondary storage shelves.",
    price: 53000,
    url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600"
  },
  {
    category: "Living Room",
    name: "Minimalist Arc Floor Lamp",
    description: "Stunning overhead lounge light with heavy marble support base.",
    price: 36000,
    url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600"
  },
  {
    category: "Living Room",
    name: "Wooden Floating Wall Shelves",
    description: "Set of 3 rustic display shelves for organizing ornaments and frames.",
    price: 14500,
    url: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=600"
  },
  {
    category: "Living Room",
    name: "Chunky Cable Knit Throw Blanket",
    description: "Cozy, warm knit blanket for sofas, beds, or chairs.",
    price: 22000,
    url: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=600"
  },
  {
    category: "Living Room",
    name: "Velvet Decorative Cushions (Set of 4)",
    description: "Premium velvet pillow inserts and covers in neutral modern tones.",
    price: 17500,
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600"
  },
  {
    category: "Living Room",
    name: "Geometric Luxury Area Rug",
    description: "Low-pile, stain-resistant modern rug for living rooms or bedrooms.",
    price: 48000,
    url: "https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=600"
  },
  {
    category: "Living Room",
    name: "Silent Wall Clock (12-inch)",
    description: "Quartz movement clock with non-ticking sweep hands.",
    price: 11000,
    url: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=600"
  },
  {
    category: "Living Room",
    name: "Smart Speaker Voice Assistant",
    description: "Compact smart speaker with virtual assistant control and music stream.",
    price: 34000,
    url: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=600"
  },
  {
    category: "Living Room",
    name: "Ultrasonic Diffuser & Humidifier",
    description: "Sleek wood-grain oil diffuser with customizable color ambient light.",
    price: 15800,
    url: "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=600"
  },
  {
    category: "Living Room",
    name: "Entryway Wooden Shoe Rack",
    description: "3-tier shoe organizer bench with padded seating cushion.",
    price: 32500,
    url: "https://images.unsplash.com/photo-1595425964071-2c11481b3796?q=80&w=600"
  },

  // Electronics & Appliances (10 items)
  {
    category: "Electronics",
    name: "Smart TV (43-Inches)",
    description: "4K smart TV pre-installed with streaming services and voice controls.",
    price: 218000,
    url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600"
  },
  {
    category: "Electronics",
    name: "Robot Vacuum Cleaner",
    description: "Automated, self-docking home vacuum with sensors for pet hair and hardwood floors.",
    price: 150000,
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=600"
  },
  {
    category: "Electronics",
    name: "Cordless Stick Handheld Vacuum",
    description: "Lightweight, rechargeable vacuum with cyclonic suction and accessories.",
    price: 64000,
    url: "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=600"
  },
  {
    category: "Electronics",
    name: "HEPA Room Air Purifier",
    description: "Quiet room air cleaner capturing 99% of dust, smoke, and allergens.",
    price: 49000,
    url: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?q=80&w=600"
  },
  {
    category: "Electronics",
    name: "Touch Control Bedside Lamps (Set of 2)",
    description: "Dimmable table lamps equipped with built-in USB charging ports.",
    price: 35000,
    url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600"
  },
  {
    category: "Electronics",
    name: "Smart Plug Set (4-Pack)",
    description: "Wi-Fi enabled home sockets compatible with smart voice controllers.",
    price: 16800,
    url: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=600"
  },
  {
    category: "Electronics",
    name: "Non-Stick Sandwich Maker",
    description: "Press grill plates toaster with indicator power lights.",
    price: 18500,
    url: "https://images.unsplash.com/photo-1530062848359-ee34a13d0c4a?q=80&w=600"
  },
  {
    category: "Electronics",
    name: "Smart Body Weight Scale",
    description: "Digital weight scales with Bluetooth phone companion integrations.",
    price: 14200,
    url: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600"
  },
  {
    category: "Electronics",
    name: "Smart Indoor Thermometer",
    description: "Digital hygrometer displaying home room temperature humidity indexes.",
    price: 7800,
    url: "https://images.unsplash.com/photo-1592861956120-e524fc739696?q=80&w=600"
  },
  {
    category: "Electronics",
    name: "Compact Double-Door Refrigerator (90L)",
    description: "Energy-efficient tabletop double-door fridge with small top freezer.",
    price: 165000,
    url: "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?q=80&w=600"
  }
];

async function uploadToCloudinary(imageUrl: string): Promise<string> {
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        file: imageUrl,
        upload_preset: UPLOAD_PRESET
      }
    );
    return response.data.secure_url;
  } catch (error: any) {
    console.error(`Failed to upload to Cloudinary for URL: ${imageUrl}`, error.response?.data || error.message);
    throw error;
  }
}

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Connected to database. Truncating old products catalog...");
    await client.query("TRUNCATE TABLE products CASCADE;");

    console.log(`Starting migration of ${products.length} essential products...`);
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`[${i+1}/${products.length}] Uploading image for: ${product.name}...`);
      let imageUrl = "";
      try {
        imageUrl = await uploadToCloudinary(product.url);
        console.log(`   Cloudinary URL: ${imageUrl}`);
      } catch (err) {
        console.log(`   Fallback to original URL due to upload error`);
        imageUrl = product.url;
      }

      await client.query(
        `INSERT INTO products (name, category, description, price, image_url, suggested_amount)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          product.name,
          product.category,
          product.description,
          product.price,
          imageUrl,
          product.price
        ]
      );
      console.log(`   Saved in DB: ${product.name}`);
    }

    console.log("Database seeded successfully with 50 essential items!");
  } catch (err) {
    console.error("Failed to seed database:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
