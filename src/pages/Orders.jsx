import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders', { withCredentials: true })
      setOrders(res.data)
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders yet</p>
        ) : (
          orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Order ID: {order._id}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>
              {order.items.map(item => (
                <div key={item._id} className="flex justify-between items-center border-b py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.product.title}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-blue-600 font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-end mt-4">
                <p className="font-bold text-lg">Total: ₹{order.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders