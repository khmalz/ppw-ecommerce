import './cart'

function initializeProductSearch() {
  const searchInput = document.getElementById('product-search-input')
  const productContainer = document.getElementById('product-grid-container')

  if (!searchInput || !productContainer) {
    return
  }

  const debounce = (func, delay) => {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), delay)
    }
  }

  const handleSearch = async (event) => {
    const query = event.target.value

    productContainer.style.opacity = '0.5'

    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Accept: 'text/html',
        },
      })

      if (!response.ok) throw new Error('Search request failed')

      const html = await response.text()

      productContainer.innerHTML = html
    } catch (error) {
      console.error('Error during search:', error)
      productContainer.innerHTML =
        '<p class="text-center text-red-500">Failed to load products.</p>'
    } finally {
      productContainer.style.opacity = '1'
    }
  }

  searchInput.addEventListener('input', debounce(handleSearch, 500))
}

document.addEventListener('DOMContentLoaded', () => {
  initializeProductSearch()
})
