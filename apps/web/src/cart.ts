export const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
const cartContainer = document.getElementById("cart-container");

export function getCartItems() {
	return cartItems.map((item: any) => {
		return {
			id: item.id,
			name: item.name,
			price: item.price,
			image: item.image,
			quantity: item.quantity,
		};
	});
}

export function updateCartCount() {
	const cartCountSpan = document.getElementById("cart-count");
	const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
	if (cartCountSpan) {
		cartCountSpan.textContent = currentCart.length.toString();
	}
}

export function addToCart(product: any) {
	const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
	const existingItemIndex = currentCart.findIndex(
		(item: any) => item.id === product.id
	);

	if (existingItemIndex !== -1) {
		currentCart[existingItemIndex].quantity += 1;
	} else {
		currentCart.push({ ...product, quantity: 1 });
	}

	localStorage.setItem("cart", JSON.stringify(currentCart));
	updateCartCount();

	const notification = document.createElement("div");
	notification.className =
		"fixed bottom-0 left-0 w-full bg-green-500 text-white p-4";
	notification.textContent = "Produkt tilføjet til kurv";
	document.body.appendChild(notification);
	setTimeout(() => {
		notification.remove();
	}, 3000);
}

function removeCartItem(
	itemId: string,
	itemElement: HTMLElement,
	totalElement: HTMLElement
) {
	const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
	const updatedCart = currentCart.filter((item: any) => item.id !== itemId);

	localStorage.setItem("cart", JSON.stringify(updatedCart));
	updateCartCount();

	setTimeout(() => {
		itemElement.remove();

		const newTotal = updatedCart.reduce(
			(sum: number, item: any) =>
				sum + Number(item.price) * item.quantity,
			0
		);
		const totalText = totalElement.querySelector("p");
		if (totalText) {
			totalText.innerHTML = `Total: <span class="font-bold">${newTotal} DKK</span>`;
		}
	}, 300);
}

function renderCartItems() {
	if (!cartContainer) return;
	const cartItems = getCartItems();

	cartContainer.innerHTML = '';

	const wrapper = document.createElement("div");
	wrapper.className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";

	const title = document.createElement("h1");
	title.className = "text-3xl font-bold mb-8";
	title.textContent = "Din Indkøbskurv";
	wrapper.appendChild(title);

	if (cartItems.length === 0) {
		const emptyMessage = document.createElement("p");
		emptyMessage.className = "text-gray-500";
		emptyMessage.textContent = "Din indkøbskurv er tom";
		wrapper.appendChild(emptyMessage);
		cartContainer.appendChild(wrapper);
		return;
	}

	const itemsContainer = document.createElement("div");
	itemsContainer.className = "space-y-6";

	const totalElement = document.createElement("div");
	totalElement.className = "mt-8 text-right";

	cartItems.forEach((item: any) => {
		const cartItem = document.createElement("div");
		cartItem.className = "flex items-center gap-4 border-b border-gray-200 pb-6";

		const image = document.createElement("img");
		image.src = item.image;
		image.alt = item.name;
		image.className = "w-24 h-24 object-cover";

		const details = document.createElement("div");
		details.className = "flex-1";

		const name = document.createElement("h3");
		name.className = "text-lg font-medium";
		name.textContent = item.name;

		const price = document.createElement("p");
		price.className = "text-gray-600";
		price.textContent = `${item.price} DKK`;

		const quantityContainer = document.createElement("div");
		quantityContainer.className = "flex items-center gap-2";

		const quantityLabel = document.createElement("p");
		quantityLabel.className = "text-gray-600";
		quantityLabel.textContent = "Antal:";

		const quantityInput = document.createElement("input");
		quantityInput.type = "number";
		quantityInput.min = "0";
		quantityInput.className = "w-12 border border-gray-300 rounded-md p-1";
		quantityInput.value = item.quantity.toString();

		quantityInput.addEventListener("input", () => {
			const newQuantity = parseInt(quantityInput.value);
			if (newQuantity >= 0) {
				if (newQuantity === 0) {
					removeCartItem(item.id, cartItem, totalElement);
				} else {
					const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]")
						.map((cartItem: any) => {
							if (cartItem.id === item.id) {
								return { ...cartItem, quantity: newQuantity };
							}
							return cartItem;
						});
					localStorage.setItem("cart", JSON.stringify(updatedCart));
					updateCartCount();
					updateTotal(totalElement, updatedCart);
				}
			}
		});

		const removeButton = document.createElement("button");
		removeButton.className = "text-red-600 hover:text-red-800";
		removeButton.textContent = "Fjern";
		removeButton.onclick = () => {
			removeCartItem(item.id, cartItem, totalElement);
		};

		quantityContainer.append(quantityLabel, quantityInput);
		details.append(name, price, quantityContainer);
		cartItem.append(image, details, removeButton);
		itemsContainer.appendChild(cartItem);
	});

	wrapper.appendChild(itemsContainer);
	updateTotal(totalElement, cartItems);
	wrapper.appendChild(totalElement);

	cartContainer.appendChild(wrapper);
}

function updateTotal(totalElement: HTMLElement, cartItems: any[]) {
	const total = cartItems.reduce(
		(sum, item) => sum + Number(item.price) * item.quantity,
		0
	);

	totalElement.innerHTML = `
		<p class="text-lg">Total: <span class="font-bold">${total} DKK</span></p>
		<button class="mt-4 bg-black text-white px-6 py-2 hover:bg-gray-800">Gå til betaling</button>
	`;
}

renderCartItems();
updateCartCount();