'use strict';

interface Product {
    image: string;
    name: string;
    price: number;
}

let currentPage = Number(new URLSearchParams(window.location.search).get('page')) || 1;
const productsPerPage = 20;
let allProducts: Product[] = []; 
let totalProducts = 0;

async function retrieveProducts() {
    try {
        const data = await fetch(`https://gildedwebshop.milasholsting.dk/api/products/list?page=${currentPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        });

        if (!data.ok) {
            throw new Error('Failed to fetch products');
        }

        const response = await data.json();
        allProducts = response.data;
        totalProducts = response.total || allProducts.length;
        
        displayProducts(currentPage);
        renderPagination();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(page: number) {
    const products = allProducts;
    
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
    container.innerHTML = '';
    container.appendChild(productContainer);
}

function renderPagination() {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'flex justify-center items-center gap-4 py-8';
    
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.className = `px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`;
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set('page', currentPage.toString());
            window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);
            retrieveProducts();
        }
    });
    
    const pageIndicator = document.createElement('span');
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    pageIndicator.className = 'text-lg font-medium';
    
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.className = `px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`;
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set('page', currentPage.toString());
            window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);
            retrieveProducts();
        }
    });
    
    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageIndicator);
    paginationContainer.appendChild(nextButton);
    
    const existingPagination = document.getElementById('pagination');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    paginationContainer.id = 'pagination';
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        productsContainer.after(paginationContainer);
    }
}

retrieveProducts();