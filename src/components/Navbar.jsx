import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { clearUser } from '../store/slices/authSlice'
import { clearCart } from '../store/slices/cartSlice'

const Navbar = () => {
  const { user } = useSelector(state => state.auth)
  const { items } = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true })
      dispatch(clearUser())
      dispatch(clearCart())
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">ShopX</Link>
      <div className="flex items-center gap-6">
        <Link to="/products" className="hover:underline">Products</Link>
        <Link to="/cart" className="hover:underline">
          Cart {items.length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
              {items.length}
            </span>
          )}
        </Link>
        <span className="text-sm">Hi, {user?.username}</span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-1 rounded-lg hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar