import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { setCart, clearCart } from '../store/slices/cartSlice'

const Cart = () => {
  const { items, totalAmount } = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart', { withCredentials: true })
      dispatch(setCart(res.data.items || []))
    } catch (error) {
      toast.error('Failed to fetch cart')
    }
  }

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`/api/cart/${productId}`, { withCredentials: true })
      const res = await axios.get('/api/cart', { withCredentials: true })
      dispatch(setCart(res.data.items || []))
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handlePlaceOrder = async () => {
    try {
      const orderRes = await axios.post('/api/orders', {}, { withCredentials: true })
      const orderId = orderRes.data.order._id

      const paymentRes = await axios.post('/api/payment/create-order',
        { orderId },
        { withCredentials: true }
      )

      const { razorpayOrderId, amount, currency, keyId } = paymentRes.data

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'ShopX',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await axios.post('/api/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId,
            }, { withCredentials: true })

            await axios.delete('/api/cart', { withCredentials: true })
            dispatch(clearCart())
            toast.success('Payment successful! Order placed.')
            navigate('/orders')
          } catch (error) {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: 'ShopX User',
        },
        theme: {
          color: '#2563eb',
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      toast.error('Failed to place order')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex flex-col items-center justify-center mt-20">
          <h2 className="text-2xl font-bold text-gray-500">Your cart is empty</h2>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Shop Now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          {items.map(item => (
            <div key={item._id} className="flex justify-between items-center border-b py-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.product.title}</h3>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-blue-600 font-bold">
                  ₹{(item.product.price * item.quantity).toLocaleString()}
                </span>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <h3 className="text-xl font-bold">Total: ₹{totalAmount.toLocaleString()}</h3>
            <button
              onClick={handlePlaceOrder}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition text-lg font-semibold"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart