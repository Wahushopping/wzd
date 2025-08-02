const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendAdminOrderEmail(order) {
  const itemList = order.items.map(item => `
    <li>${item.name} - Size: ${item.size} - Qty: ${item.qty} - ₹${item.price}</li>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 New Order Placed - ID: ${order._id}`,
    html: `
      <h2>New Order Received</h2>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total:</strong> ₹${order.total}</p>

      <h3>Customer Info:</h3>
      <p>${order.address.name}, ${order.address.phone}<br>
      ${order.address.street}, ${order.address.fullAddress},<br>
      ${order.address.city} - ${order.address.pincode}, ${order.address.state}</p>

      <h3>Ordered Items:</h3>
      <ul>${itemList}</ul>

      <p>Check admin panel for full order details.</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendAdminOrderEmail;
