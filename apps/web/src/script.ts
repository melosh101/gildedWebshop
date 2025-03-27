'use strict';
import type { TProduct as Product, TListResponse } from "@gildedwebshop/server"

let currentPage = Number(new URLSearchParams(window.location.search).get('page')) || 1;
let allProducts: Product[] = [];
let maxPages = 0;
let prefetchedPages: Record<number, Product[]> = {};

function createLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.className = 'w-full h-full flex items-center justify-center bg-white bg-opacity-80 z-50';
    
    const spinnerInner = document.createElement('div');
    spinnerInner.className = 'animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black';
    
    spinner.appendChild(spinnerInner);
    return spinner;
}

function showLoading() {
    const existingSpinner = document.getElementById('loading-spinner');
    if (!existingSpinner) {
        const productsContainer = document.getElementById('products-container');
        if (productsContainer) {
            productsContainer.innerHTML = '';
            productsContainer.appendChild(createLoadingSpinner());
        }
    }
}

function hideLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

async function prefetchPages(pageIdx: number) {
    if(prefetchedPages[pageIdx]) return;

    try {
        const req = new URLSearchParams();
        req.append("page", pageIdx.toString());

        const searchParams = new URLSearchParams(window.location.search);
        const gender = searchParams.get('gender');
        const category = searchParams.get('category');

        if(gender) {
            req.append("gender", gender.charAt(0).toUpperCase() + gender.slice(1));
        }

        if(category) {
            req.append("category", category.charAt(0).toUpperCase() + category.slice(1));
        }

        const url = `https://gildedwebshop.milasholsting.dk/api/products/list?${req.toString()}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        });

        if(!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const data = await response.json() as TListResponse;
        prefetchedPages[pageIdx] = data.data;
    } catch (error) {
        console.error('Error prefetching page:', error);
    }
}

async function retrieveProducts() {
    try {
        showLoading();

        if(prefetchedPages[currentPage]) {
            allProducts = prefetchedPages[currentPage];
            displayProducts(allProducts);
            delete prefetchedPages[currentPage];
        } else {
            const searchParams = new URLSearchParams(window.location.search);
            const gender = searchParams.get('gender');
            const category = searchParams.get('category');
            
            console.log('Fetching products with params:', { gender, category });
            
            if (window.location.pathname !== '/shop') {
                const newUrl = new URL('/shop', window.location.origin);
                if (gender) newUrl.searchParams.set('gender', gender);
                if (category) newUrl.searchParams.set('category', category);
                if (currentPage > 1) newUrl.searchParams.set('page', currentPage.toString());
                window.location.href = newUrl.toString();
            }

            const req = new URLSearchParams();
            req.append("page", currentPage.toString());
            if (gender) {
                req.append("gender", gender.charAt(0).toUpperCase() + gender.slice(1));
            }
            if (category) {
                req.append("category", category.charAt(0).toUpperCase() + category.slice(1));
            }

            console.log('Fetching first page:', );
            const firstPageUrl = `https://gildedwebshop.milasholsting.dk/api/products/list?${req.toString()}`;
            const response = await fetch(firstPageUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json() as TListResponse;
            allProducts = data.data;
            maxPages = data.maxPages;
        }

        displayProducts(allProducts);
        renderPagination();

        if(currentPage < maxPages) {
            await prefetchPages(currentPage + 1);
        }
        if(currentPage > 1) {
            await prefetchPages(currentPage - 1);
        }
            
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
            retrieveProducts();

        }
    });

    prevButton.addEventListener('mouseenter', () => {
        if(currentPage > 1) {
            prefetchPages(currentPage - 1);
        }
    });
    
    const pageIndicator = document.createElement('span');
    pageIndicator.textContent = `Side ${currentPage} af ${maxPages}`;
    pageIndicator.className = 'text-lg font-medium';
    
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Næste';
    nextButton.className = `px-4 py-2 rounded-md ${currentPage === maxPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`;
    nextButton.disabled = currentPage === maxPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < maxPages) {
            currentPage++;
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set('page', currentPage.toString());
            window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            retrieveProducts();
        }
    });

    nextButton.addEventListener('mouseenter', () => {
        if(currentPage < maxPages) {
            prefetchPages(currentPage + 1);
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