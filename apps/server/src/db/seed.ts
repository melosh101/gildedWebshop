import db from ".";
import { productTable, productVariantTable } from "./schema";


const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const gender = ["Male", "Female", "Unisex"] as const;
const categories = ["Shirt", "Pants", "Shoes", "Accessories"] as const;

// type to convert gender array to a union type
type Tgender = typeof gender[number];
type Tcategory = typeof categories[number];

// a function to take a random element from the gender array
function takeRandomGender<T extends any[]>(arr: T): Tgender {
  return arr[Math.floor(Math.random() * arr.length)];
}   
function takeRandomCategory<T extends any[]>(arr: T): Tcategory {
  return arr[Math.floor(Math.random() * arr.length)];
}   

// a function to seed the db with 1.000 clothing products each with 5 variants
async function seed() {
  await db.transaction(async (trx) => {
    for (let i = 0; i < 1000; i++) {
      const [product] = await db.insert(productTable).values({
        name: `product ${i}`,
        price: "100",
        description: `product ${i} description`,
        image: `https://placehold.co/150?text=product+${i}&font=raleway`,
        gender: takeRandomGender(["Male", "Female", "Unisex"]),
        category: takeRandomCategory(["Shirt", "Pants", "Shoes", "Accessories"]),
      }).returning();
      for (let j = 0; j < 5; j++) {
        await db.insert(productVariantTable).values({
          productId: product.id,
          price: "100",
          size: sizes[j],
          
        });
      }

      if(i % 100 === 0) {
        console.log(`inserted ${i} products
        `);
      }
    }
  });
}

seed().then(() => console.log("seeded!"));
