'use strict';

async function retrieveProducts() {
    try {
        const data = await fetch('https://gildedwebshop.milasholsting.dk/api/products/list', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        });

        if (!data.ok) {
            throw new Error('Failed to fetch products');
        }

        const products = await data.json();
        
        const productContainer = document.createElement('div');
        productContainer.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid grid-cols-4 gap-1';

        products.forEach(product => {
            const productLink = document.createElement('a');
            productLink.className = 'group relative cursor-pointer';
            
            const imageContainer = document.createElement('div');
            imageContainer.className = 'aspect-h-1 aspect-w-1 w-full overflow-hidden';
            
            const image = document.createElement('img');
            image.src = product.image;
            image.alt = product.name;
            image.className = 'h-full w-full object-cover';
            
            imageContainer.appendChild(image);

            const infoContainer = document.createElement('div');
            infoContainer.className = 'mt-2';

            const name = document.createElement('h3');
            name.className = 'text-xs text-gray-900';
            name.textContent = product.name;

            const price = document.createElement('p');
            price.className = 'text-xs font-bold text-gray-900';
            price.textContent = `${product.price} DKK`;

            infoContainer.appendChild(name);
            infoContainer.appendChild(price);

            productLink.appendChild(imageContainer);
            productLink.appendChild(infoContainer);
            
            gridContainer.appendChild(productLink);
        });

        productContainer.appendChild(gridContainer);

        const container = document.getElementById('products-container');
        if (!container) {
            throw new Error('Products container element not found');
        }
        container.appendChild(productContainer);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

retrieveProducts();