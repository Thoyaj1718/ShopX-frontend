import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { setCart } from '../store/slices/cartSlice'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('ALL')
  const [sort, setSort] = useState('')
  const [search, setSearch] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const categories = ['ALL', 'Electronics', 'Clothing', 'Books']

  useEffect(() => {
    fetchProducts()
  }, [category, sort, search])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products', {
        params: { category, sort, search },
        withCredentials: true,
      })
      setProducts(res.data)
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId) => {
    try {
      await axios.post('/api/cart', { productId, quantity: 1 }, { withCredentials: true })
      const cartRes = await axios.get('/api/cart', { withCredentials: true })
      dispatch(setCart(cartRes.data.items))
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">All Products</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          >
            <option value="">Sort by</option>
            <option value="PRICE_HIGH">Price: High to Low</option>
            <option value="PRICE_LOW">Price: Low to High</option>
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => navigate(`/products/${product._id}`)}
                />
                <div className="p-4">
                  <h3
                    className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    {product.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-bold">₹{product.price.toLocaleString()}</span>
                    <span className="text-yellow-500">⭐ {product.rating}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products