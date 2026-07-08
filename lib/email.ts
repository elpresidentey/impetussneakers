import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    const msg = {
      to: data.to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@theimpetus.com',
      subject: data.subject,
      html: data.html,
      text: data.text,
    }

    await sgMail.send(msg)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  totalAmount: number
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-number { font-size: 24px; font-weight: bold; color: #000; }
        .total { font-size: 20px; font-weight: bold; color: #000; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>The Impetus</h1>
        </div>
        <div class="content">
          <h2>Order Confirmation</h2>
          <p>Thank you for your order!</p>
          <p class="order-number">Order #: ${orderNumber}</p>
          <p class="total">Total: ₦${totalAmount.toLocaleString()}</p>
          <p>We'll send you another email when your order ships.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 The Impetus. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html,
    text: `Thank you for your order! Order #: ${orderNumber}. Total: ₦${totalAmount.toLocaleString()}`,
  })
}

export async function sendShippingNotificationEmail(
  email: string,
  orderNumber: string,
  trackingNumber?: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-number { font-size: 24px; font-weight: bold; color: #000; }
        .tracking { font-size: 18px; font-weight: bold; color: #000; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>The Impetus</h1>
        </div>
        <div class="content">
          <h2>Your Order Has Shipped!</h2>
          <p>Great news! Your order is on its way.</p>
          <p class="order-number">Order #: ${orderNumber}</p>
          ${trackingNumber ? `<p class="tracking">Tracking #: ${trackingNumber}</p>` : ''}
          <p>You can track your package using the tracking number above.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 The Impetus. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Order Shipped - ${orderNumber}`,
    html,
    text: `Your order has shipped! Order #: ${orderNumber}${trackingNumber ? `. Tracking #: ${trackingNumber}` : ''}`,
  })
}

export async function sendNewsletterConfirmationEmail(email: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>The Impetus</h1>
        </div>
        <div class="content">
          <h2>Welcome to The Impetus!</h2>
          <p>Thank you for subscribing to our newsletter.</p>
          <p>You'll be the first to know about new releases, exclusive drops, and special offers.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 The Impetus. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Welcome to The Impetus!',
    html,
    text: 'Thank you for subscribing to our newsletter!',
  })
}
