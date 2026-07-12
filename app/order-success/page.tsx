'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useReactToPrint } from 'react-to-print'
import { Download, Printer, Package, Calendar, MapPin, CreditCard, CheckCircle } from 'lucide-react'

interface OrderItem {
  id: number
  product_name: string
  product_image: string
  price: number
  quantity: number
  size?: string
  color?: string
}

interface Order {
  id: string
  order_number: string
  created_at: string
  total_amount: number
  shipping_cost: number
  tax_amount: number
  status: string
  payment_status: string
  customer_email: string
  shipping_address: string
  items: OrderItem[]
}

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const receiptRef = useRef<HTMLDivElement>(null)

  const orderId = searchParams.get('order_id')
  const orderNumber = searchParams.get('order_number')

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId)
    } else if (orderNumber) {
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [orderId, orderNumber])

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (response.ok) {
        const orderData = await response.json()
        setOrder(orderData)
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error)
    } finally {
      setLoading(false)
    }
  }
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt-${order?.order_number || orderNumber}`,
  })

  const downloadPDF = async () => {
    if (!receiptRef.current) return

    try {
      const jsPDF = (await import('jspdf')).default
      const html2canvas = (await import('html2canvas')).default

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`receipt-${order?.order_number || orderNumber}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          {(order?.order_number || orderNumber) && (
            <p className="text-sm text-muted-foreground mt-2">
              Order Number: <span className="font-semibold">{order?.order_number || orderNumber}</span>
            </p>
          )}
        </div>
        {order && (
          <div className="bg-card border border-foreground/10 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-foreground">Order Details</h2>
              <div className="flex gap-2">
                <Button onClick={handlePrint} variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
                <Button onClick={downloadPDF} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold text-foreground capitalize">{order.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-semibold text-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p className="font-semibold text-foreground capitalize">{order.payment_status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-semibold text-foreground">₦{order.total_amount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-background rounded-lg">
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{item.product_name}</h4>
                      <div className="text-sm text-muted-foreground">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> • </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₦{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">₦{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="max-w-md ml-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₦{(order.total_amount - order.shipping_cost - order.tax_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">₦{order.shipping_cost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">₦{order.tax_amount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₦{order.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'none' }}>
          <div ref={receiptRef} className="max-w-2xl mx-auto p-8 bg-white text-black">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">THE IMPETUS</h1>
              <p className="text-gray-600">Premium Sneakers & Streetwear</p>
              <div className="border-b-2 border-gray-300 my-4"></div>
              <h2 className="text-xl font-semibold">ORDER RECEIPT</h2>
            </div>

            {order && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p><strong>Order Number:</strong> {order.order_number}</p>
                    <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                  </div>
                  <div>
                    <p><strong>Customer Email:</strong> {order.customer_email}</p>
                    <p><strong>Payment Status:</strong> {order.payment_status}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <p><strong>Shipping Address:</strong></p>
                  <p className="text-gray-700">{order.shipping_address}</p>
                </div>

                <table className="w-full mb-6 border-collapse">
                  <thead>
                    <tr className="border-b-2">
                      <th className="text-left py-2">Item</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Price</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            {(item.size || item.color) && (
                              <p className="text-sm text-gray-600">
                                {item.size && `Size: ${item.size}`}
                                {item.size && item.color && ' • '}
                                {item.color && `Color: ${item.color}`}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">₦{item.price.toLocaleString()}</td>
                        <td className="text-right py-2">₦{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t-2 pt-4">
                  <div className="text-right space-y-1">
                    <p>Subtotal: ₦{(order.total_amount - order.shipping_cost - order.tax_amount).toLocaleString()}</p>
                    <p>Shipping: ₦{order.shipping_cost.toLocaleString()}</p>
                    <p>Tax: ₦{order.tax_amount.toLocaleString()}</p>
                    <p className="text-xl font-bold border-t pt-2">Total: ₦{order.total_amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="text-center mt-8 text-sm text-gray-600">
                  <p>Thank you for shopping with The Impetus!</p>
                  <p>For support, contact us at support@theimpetus.com</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="text-center space-y-4">
          <div className="bg-card border border-foreground/10 rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              A confirmation email has been sent to your email address with your receipt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/orders">
                <Button size="lg" className="w-full sm:w-auto">
                  <Package className="w-4 h-4 mr-2" />
                  Track Your Order
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}