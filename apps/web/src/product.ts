import type { TProductWithVariants as Product } from "@gildedwebshop/server"


async function fetchProduct(id: string): Promise<Product> {

    // TODO: MILAS! LAV SÅ JEG KAN FÅ DATA UDFRA ET ID
    // BRUH: forket url
    const response = await fetch(`https://gildedwebshop.milasholsting.dk/api/products?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }

    return response.json();
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

function displayProduct(product: Product) {
    const container = document.getElementById('product-container');
    if (!container) throw new Error('Product container not found');
    
    container.innerHTML = '';

    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-8 py-8';

    const imageSection = document.createElement('div');
    imageSection.className = 'aspect-h-1 aspect-w-1 w-full overflow-hidden';
    
    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.name;
    productImage.className = 'h-full w-full object-cover';
    imageSection.appendChild(productImage);

    const infoSection = document.createElement('div');
    infoSection.className = 'flex flex-col';

    const nameHeading = document.createElement('h1');
    nameHeading.className = 'text-2xl font-medium text-gray-900 mb-4';
    nameHeading.textContent = product.name;

    const priceText = document.createElement('p');
    priceText.className = 'text-xl font-bold text-gray-900 mb-6';
    priceText.textContent = `${product.price} DKK`;

    const description = document.createElement('p');
    description.className = 'text-gray-600 mb-8';
    description.textContent = product.description;

    const sizeSection = document.createElement('div');
    sizeSection.className = 'mb-8';

    const sizeHeading = document.createElement('h2');
    sizeHeading.className = 'text-lg font-medium text-gray-900 mb-4';
    sizeHeading.textContent = 'Vælg størrelse';

    const sizeGrid = document.createElement('div');
    sizeGrid.className = 'grid grid-cols-4 gap-2';

    product.productVariant.forEach(variant => {
        const sizeButton = document.createElement('button');
        sizeButton.className = 'border border-gray-300 rounded-md py-2 px-4 text-sm hover:border-black transition-colors';
        sizeButton.textContent = variant.size;
        sizeGrid.appendChild(sizeButton);
    });

    sizeSection.appendChild(sizeHeading);
    sizeSection.appendChild(sizeGrid);

    const addToCartButton = document.createElement('button');
    addToCartButton.className = 'bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors';
    addToCartButton.textContent = 'Tilføj til kurv';

    infoSection.appendChild(nameHeading);
    infoSection.appendChild(priceText);
    infoSection.appendChild(description);
    infoSection.appendChild(sizeSection);
    infoSection.appendChild(addToCartButton);

    gridContainer.appendChild(imageSection);
    gridContainer.appendChild(infoSection);

    container.appendChild(gridContainer);
}

async function initializeProductPage() {
    try {
        console.log('Initializing product page');
        console.log('Current path:', window.location.pathname);
        showLoading();
        const productId = new URLSearchParams(window.location.search).get('id');
        console.log('Product ID:', productId);
        
        if (!productId) {
            throw new Error('No product ID provided');
        }

        const product = await fetchProduct(productId);
        console.log('Fetched product:', product);
        displayProduct(product);
    } catch (error) {
        console.error('Error loading product:', error);
        const container = document.getElementById('product-container');
        console.log('Product container found:', !!container);
        if (container) {
            container.innerHTML = '';

            const errorContainer = document.createElement('div');
            errorContainer.className = 'text-center py-12';

            const errorHeading = document.createElement('h2');
            errorHeading.className = 'text-2xl font-medium text-gray-900 mb-4';
            errorHeading.textContent = 'Der opstod en fejl';

            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-gray-600 mb-4';
            errorMessage.textContent = 'Kunne ikke indlæse produktet. Prøv venligst igen senere.';

            const backLink = document.createElement('a');
            backLink.href = '/shop';
            backLink.className = 'text-black hover:underline';
            backLink.textContent = 'Tilbage til butikken';

            errorContainer.appendChild(errorHeading);
            errorContainer.appendChild(errorMessage);
            errorContainer.appendChild(backLink);
            container.appendChild(errorContainer);
        }
    } finally {
        hideLoading();
    }
}

if (window.location.pathname.includes('/product/index.html')) {
    initializeProductPage();
} 