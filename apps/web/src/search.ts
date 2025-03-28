import { MeiliSearch } from "meilisearch";
import {SEARCH_KEY} from "../env"
import { TProduct } from "@gildedwebshop/server";

const searchController = new AbortController();

const searchCLient = new MeiliSearch({
    host: "https://meilisearch.milasholsting.dk",
    apiKey: SEARCH_KEY
})
const searchIndex = searchCLient.index("products");

searchController.signal.addEventListener("abort", () => {
    console.log("Search aborted")
});

var searchResults: TProduct[];

function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
  
    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
  
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }
  

async function searchProducts(query: string) {
    const res = await searchIndex.search(query, {
        limit: 5,
        attributesToRetrieve: ["name", "price", "image", "id"]
    }, );

    return res.hits as TProduct[];
}


function initializeSearch() {
	const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
	const searchContainer = document.querySelector('.search-container') as HTMLElement;

	if (searchInput && searchContainer) {
		searchInput.addEventListener('focus', () => {
			searchContainer.classList.remove('hidden');
		});

		searchInput.addEventListener('blur', () => {
			setTimeout(() => {
                searchContainer.classList.add('hidden');
            }, 100);
        
		});
        searchInput.addEventListener('input', async () => {
            debounce(async () => {
                if (!searchInput.value) {
                    searchResults = [];
                    return;
                }
                searchResults = await searchProducts(searchInput.value);
                initializeSearchResults(searchResults);
            }, 500)();

            searchController.abort();
        });
	}
}

function initializeSearchResults(products: TProduct[]) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    searchResults.innerHTML = '';


    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'flex items-center gap-4 p-2 hover:bg-stone-300 duration-200 transition-colors hover:bg-opacity-50';
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'w-20 h-20 flex-shrink-0';

        const linkThing = document.createElement('a');
        linkThing.href = `/product/index.html?id=${product.id}`;
        
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
        linkThing.appendChild(productElement);

        searchResults.appendChild(linkThing);
    });
}


initializeSearch();

