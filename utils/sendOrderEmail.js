const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendOrderEmail(toEmail, order) {
  const itemList = order.items.map(item => `
    <li>${item.name} - Size: ${item.size} - Qty: ${item.qty} - ₹${item.price}</li>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `Order Confirmation - Order ID: ${order._id}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <ul>${itemList}</ul>
      <h3>Delivery Address:</h3>
      <p>${order.address.name}, ${order.address.phone},<br>
      ${order.address.street}, ${order.address.fullAddress},<br>
      ${order.address.city} - ${order.address.pincode}, ${order.address.state}</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendOrderEmail;
