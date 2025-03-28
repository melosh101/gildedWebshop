function initializeSearch() {
	const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
	const searchContainer = document.querySelector('.search-container') as HTMLElement;

	if (searchInput && searchContainer) {
		searchInput.addEventListener('focus', () => {
			searchContainer.classList.remove('hidden');
		});

		searchInput.addEventListener('blur', () => {
			searchContainer.classList.add('hidden');
		});
	}
}

function initializeSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;

	// Implement product search
    const products = [
        {
            id: 1,
            name: "Elegant Kjole",
            price: 899,
            image: "https://placehold.co/150x150"
        }
    ]

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'flex items-center gap-4 p-2 hover:bg-gray-50 transition-colors';
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'w-20 h-20 flex-shrink-0';
        
        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.name;
        image.className = 'w-full h-full object-cover';
        
        const details = document.createElement('div');
        details.className = 'flex-grow';
        
        const name = document.createElement('h3');
        name.className = 'text-sm font-medium';
        name.textContent = product.name;
        
        const price = document.createElement('p');
        price.className = 'text-sm text-gray-600';
        price.textContent = `${product.price} kr.`;
        
        imageContainer.appendChild(image);
        details.appendChild(name);
        details.appendChild(price);
        
        productElement.appendChild(imageContainer);
        productElement.appendChild(details);
        
        searchResults.appendChild(productElement);
    });
}

initializeSearch();
initializeSearchResults();