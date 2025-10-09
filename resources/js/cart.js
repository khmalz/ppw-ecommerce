document.addEventListener('DOMContentLoaded', () => {
  initializeAddToCartForms()
  initializeCartPage()
})

function initializeAddToCartForms() {
  document.querySelectorAll('.add-to-cart-form').forEach((form) => {
    form.addEventListener('submit', handleFormSubmit)
  })
}

function initializeCartPage() {
  const cartPageContainer = document.querySelector('.container')
  if (!cartPageContainer) return
  cartPageContainer.addEventListener('click', handleQuantityChange)
  cartPageContainer.addEventListener('submit', handleFormSubmit)
}

/**
 * A single handler for all form submissions (Add, Remove, Clear, Update)
 */
async function handleFormSubmit(event) {
  const form = event.target
  const isCartForm = form.matches(
    '.add-to-cart-form, .remove-item-form, .clear-cart-form, .quantity-update-form'
  )
  if (!isCartForm) return

  event.preventDefault()

  if (form.matches('.clear-cart-form')) {
    const isConfirmed = confirm('Are you sure you want to clear the entire cart?')

    if (!isConfirmed) return
  }

  const formData = new FormData(form)
  const response = await sendCartRequest(form.action, formData)

  if (response) {
    updateCartBadge(response.cartCount)
    if (form.matches('.add-to-cart-form')) {
      alert('Product added to cart!')
    } else if (form.matches('.remove-item-form') || form.matches('.clear-cart-form')) {
      handleRemoveOrClearUI(form, response)
    }
  }
}

/**
 * Handles clicks for quantity +/- buttons
 */
async function handleQuantityChange(event) {
  if (event.target.matches('.quantity-change')) {
    const button = event.target
    const form = button.closest('.quantity-update-form')
    const quantityInput = form.querySelector('input[name="quantity"]')
    const currentQuantity = parseInt(quantityInput.value, 10)
    const change = parseInt(button.dataset.change, 10)

    if (currentQuantity === 1 && change === -1) {
      const itemContainer = form.closest('[id^="cart-item-"]')
      const removeForm = itemContainer.querySelector('.remove-item-form')

      removeForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

      return
    }

    let newQuantity = currentQuantity + change
    if (newQuantity < 1) newQuantity = 1
    quantityInput.value = newQuantity

    const formData = new FormData(form)
    formData.set('quantity', newQuantity)

    const response = await sendCartRequest(form.action, formData)
    if (response) {
      updateCartBadge(response.cartCount)
      updateAllPrices(form, newQuantity, response.totalPrice)
    }
  }
}

/**
 * Central function for sending fetch requests
 */
async function sendCartRequest(actionUrl, formData) {
  const csrfToken = formData.get('_csrf')
  if (formData.has('_csrf')) formData.delete('_csrf')

  try {
    const response = await fetch(actionUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
    })

    if (!response.ok) {
      if (response.status === 401) window.location.href = '/login'
      else console.error('Server Error:', await response.text())
      throw new Error(`Request failed with status ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json()
    } else {
      return { success: true }
    }
  } catch (error) {
    console.error('Error sending cart request:', error)
    return null
  }
}

/**
 * Handles UI updates after removing an item or clearing the cart
 */
function handleRemoveOrClearUI(form, data) {
  const container = document.querySelector('.container')
  if (!container) return

  if (data.cartCount === 0) {
    container.innerHTML = `
      <div class="w-full text-center bg-white p-12 rounded-lg shadow-md">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
        <p class="text-xl text-gray-600">Your cart is empty.</p>
        <a href="/products" class="mt-6 inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700">
          Continue Shopping
        </a>
      </div>`
  } else {
    updateTotalPrice(data.totalPrice)
    if (form.matches('.remove-item-form')) {
      const productId = new URL(form.action).pathname.split('/').pop()
      document.getElementById(`cart-item-${productId}`)?.remove()
    }
  }
}

function updateCartBadge(count) {
  const badge = document.getElementById('cart-count-badge')
  if (badge) {
    badge.innerText = count
    badge.classList.toggle('hidden', count === 0)
    if (count > 0) {
      badge.classList.add('animate-pop')
      setTimeout(() => badge.classList.remove('animate-pop'), 300)
    }
  }
}

function updateTotalPrice(price) {
  const summarySubtotal = document.getElementById('summary-subtotal')
  const summaryTotal = document.getElementById('summary-total')
  if (summarySubtotal && summaryTotal) {
    const formattedPrice = `$${price.toFixed(2)}`
    summarySubtotal.innerText = formattedPrice
    summaryTotal.innerText = formattedPrice
  }
}

function updateAllPrices(form, newQuantity, newTotalPrice) {
  const itemContainer = form.closest('[id^="cart-item-"]')
  const priceText = itemContainer
    .querySelector('.text-gray-500')
    .innerText.replace('Unit Price: $', '')
  const unitPrice = parseFloat(priceText)
  const newSubtotal = unitPrice * newQuantity
  const subtotalElement = itemContainer.querySelector('[id^="subtotal-"]')
  subtotalElement.innerText = `$${newSubtotal.toFixed(2)}`
  updateTotalPrice(newTotalPrice)
}
