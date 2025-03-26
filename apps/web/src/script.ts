'use strict';
import type { TProduct as Product } from "@gildedwebshop/server"

let currentPage = Number(new URLSearchParams(window.location.search).get('page')) || 1;
const productsPerPage = 20;
let allProducts: Product[] = [];
let totalProducts = 0;

function paginateProducts(products: Product[], page: number, perPage: number) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return products.slice(start, end);
}

function createLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-80 z-50';
    
    const spinnerInner = document.createElement('div');
    spinnerInner.className = 'animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black';
    
    spinner.appendChild(spinnerInner);
    return spinner;
}

function showLoading() {
    const existingSpinner = document.getElementById('loading-spinner');
    if (!existingSpinner) {
        document.body.appendChild(createLoadingSpinner());
    }
}

function hideLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

async function retrieveProducts() {
    try {
        showLoading();
        const searchParams = new URLSearchParams(window.location.search);
        const gender = searchParams.get('gender')?.toLowerCase();
        const category = searchParams.get('category')?.toLowerCase();
        
        console.log('Fetching products with params:', { gender, category });
        
        if (window.location.pathname !== '/shop') {
            const newUrl = new URL('/shop', window.location.origin);
            if (gender) newUrl.searchParams.set('gender', gender);
            if (category) newUrl.searchParams.set('category', category);
            if (currentPage > 1) newUrl.searchParams.set('page', currentPage.toString());
            window.history.pushState({}, '', newUrl.toString());
        }

        let firstPageUrl = `https://gildedwebshop.milasholsting.dk/api/products/list?page=1`;
        if (gender) {
            firstPageUrl += `&gender=${gender}`;
        }
        if (category) {
            firstPageUrl += `&category=${category}`;
        }

        console.log('Fetching first page:', firstPageUrl);

        const firstPageData = await fetch(firstPageUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        });

        if (!firstPageData.ok) {
            throw new Error('Failed to fetch products');
        }

        const firstPageResponse = await firstPageData.json();
        console.log('First page response:', firstPageResponse);
        
        const maxPages = firstPageResponse.maxPages;
        console.log('Max pages:', maxPages);

        let apiUrl = `https://gildedwebshop.milasholsting.dk/api/products/list?page=${currentPage}`;
        if (gender) {
            apiUrl += `&gender=${gender}`;
        }
        if (category) {
            apiUrl += `&category=${category}`;
        }

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        const products = data.data;

        allProducts = products;
        totalProducts = products.length;

        const currentParams = new URLSearchParams(window.location.search);
        if (!currentParams.has('page')) {
            currentParams.set('page', '1');
            const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
            window.history.pushState({}, '', newUrl);
        }

        const paginatedProducts = paginateProducts(products, currentPage, productsPerPage);
        
        displayProducts(paginatedProducts);
        renderPagination();
        
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products: Product[]) {
    const productContainer = document.createElement('div');
    productContainer.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid grid-cols-4 gap-1';

    products.forEach(product => {
        const productLink = document.createElement('a');
        productLink.href = `/product/index.html?id=${product.id}`;
        productLink.className = 'group relative cursor-pointer';
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'aspect-h-1 aspect-w-1 w-full overflow-hidden';
        
        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.name;
        image.className = 'h-full w-full object-cover';
        
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
        imageContainer.appendChild(image);
        productLink.append(imageContainer, infoContainer);
        gridContainer.appendChild(productLink);
    });

    const container = document.getElementById('products-container');
    if (!container) throw new Error('Products container element not found');
    
    container.innerHTML = '';
    productContainer.appendChild(gridContainer);
    container.appendChild(productContainer);
}

function renderPagination() {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'flex justify-center items-center gap-4 py-8';
    
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Forrige';
    prevButton.className = `px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`;
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set('page', currentPage.toString());
            window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);

            const paginatedProducts = paginateProducts(allProducts, currentPage, productsPerPage);
            displayProducts(paginatedProducts);
            renderPagination();
        }
    });
    
    const pageIndicator = document.createElement('span');
    pageIndicator.textContent = `Side ${currentPage} af ${totalPages}`;
    pageIndicator.className = 'text-lg font-medium';
    
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Næste';
    nextButton.className = `px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`;
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set('page', currentPage.toString());
            window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);

            const paginatedProducts = paginateProducts(allProducts, currentPage, productsPerPage);
            displayProducts(paginatedProducts);
            renderPagination();
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

window.addEventListener('popstate', () => {
    currentPage = Number(new URLSearchParams(window.location.search).get('page')) || 1;
    if (allProducts.length > 0) {
        const paginatedProducts = paginateProducts(allProducts, currentPage, productsPerPage);
        displayProducts(paginatedProducts);
        renderPagination();
    } else {
        retrieveProducts();
    }
});

if (window.location.pathname === '/shop') {
    let productsContainer = document.getElementById('products-container');
    if (!productsContainer) {
        productsContainer = document.createElement('div');
        productsContainer.id = 'products-container';
        const mainElement = document.querySelector('main');
        if (!mainElement) {
            console.error('Main element not found');
        } else {
            mainElement.appendChild(productsContainer);
        }
    }
    retrieveProducts();
}