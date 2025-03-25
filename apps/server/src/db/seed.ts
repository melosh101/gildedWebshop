import db from ".";
import { productTable, productVariantTable } from "./schema";

function generateClothingProducts(totalProducts: number): any[] {
    const genders = ['Female', 'Male', 'Unisex'];
    const femaleCategories = ['Kjoler', 'Toppe', 'Bukser', "Accessories"];
    const maleCategories = ['Skjorter', 'Jakker', 'Bukser', "Accessories"];
    const unisexCategories = ['T-shirts', 'Sweatere', 'Jakker',"Accessories"];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const products = [];

    for (let i = 0; i < totalProducts; i++) {
      const gender = genders[Math.floor(Math.random() * genders.length)];
      let category: string;
  
      if (gender === 'female') {
        category = femaleCategories[Math.floor(Math.random() * femaleCategories.length)];
      } else if (gender === 'male') {
        category = maleCategories[Math.floor(Math.random() * maleCategories.length)];
      } else {
        category = unisexCategories[Math.floor(Math.random() * unisexCategories.length)];
      }
  
      const productName = `${gender} ${category} ${i + 1}`;
      const numVariants = Math.floor(Math.random() * 3) + 3; // 3 to 5 variants
      const productPrice = Math.floor(Math.random() * 1000) + 50; // Random price between 50 and 1050
      const productDescription = `A stylish ${productName} for ${gender}s.`;
      const imageUrl = `https://placehold.co/150?text=${encodeURIComponent(productName)}&font=raleway`;
      const variants = [];
      for (let j = 0; j < numVariants; j++) {
        const price = Math.floor(Math.random() * 1000) + 50; // Random price between 50 and 1050
        const size = sizes[Math.floor(Math.random() * sizes.length)];
  
        variants.push({
          price,
          size,
        });
      }
  
  
      products.push({
        name: productName,
        gender,
        category,
        variants,
        imageUrl,
        price: productPrice,
        description: productDescription,
      });
    }
  
    return products;
  }

const clothingProducts = generateClothingProducts(2000);

clothingProducts.forEach(async (product, i) => {

    const [prod] = await db.insert(productTable).values({
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        image: product.imageUrl,
        gender: product.gender
    }).returning();
    
    const variants = product.variants.map((variant: any) => {
        return {
            productId: prod.id,
            price: variant.price,
            size: variant.size
        }
    });

    await db.insert(productVariantTable).values(variants);

    if(i % 100) {
        console.log(`inserted ${i} products`);
    }
});
console.log("products inserted");