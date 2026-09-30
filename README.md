# Velocity.Shop

A modern full-stack eCommerce platform built with React, TypeScript, ASP.NET Core, Entity Framework Core, and PostgreSQL.

Velocity.Shop provides a complete online shopping experience with product browsing, cart management, order processing, user authentication, and an administrative dashboard for managing products, categories, users, and orders.
edited readme
---

## Features

### Customer Features

* User registration and login
* JWT-based authentication
* Product catalog browsing
* Product search and filtering
* Product details page
* Shopping cart management
* Order creation and checkout
* Order history tracking
* Responsive design
* Dark mode support

### Admin Features

* Admin dashboard
* Product management
* Category management
* User management
* Order management
* Order status updates
* Order details view
* Protected admin routes

---

## Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* React Router
* Tailwind CSS v4
* Axios
* React Hot Toast
* Framer Motion
* React Icons

### Backend

* ASP.NET Core
* Entity Framework Core
* PostgreSQL
* JWT Authentication
* FluentValidation
* AutoMapper

---

## Project Structure

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── routes/
│   ├── types/
│   └── api/

backend/
├── ECommerce.API/
│   ├── Controllers/
│   ├── Services/
│   ├── Models/
│   ├── DTOs/
│   ├── Data/
│   └── Authentication/
```

---

## Screenshots


### Home Page

![Home Page](screenshots/home.png)

### Products Page

![Products](screenshots/products.png)

### Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/velocity-shop.git

cd velocity-shop
```

---

### Backend Setup

Navigate to backend:

```bash
cd backend/ECommerce.API
```

Restore dependencies:

```bash
dotnet restore
```

Update database connection string inside:

```text
appsettings.json
```

Run migrations:

```bash
dotnet ef database update
```

Start the API:

```bash
dotnet run
```

The API will be available at:

```text
http://localhost:5134
```

---

### Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

## Environment Variables

### Frontend

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5134/api
```

### Backend

Update:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_DATABASE_CONNECTION"
  }
}
```

---

## Authentication

Velocity.Shop uses JWT authentication.

After successful login:

* JWT token is stored in localStorage
* Protected routes require authentication
* Admin routes require the Admin role

---

## Future Improvements

* Product reviews and ratings
* Wishlist functionality
* Product image uploads
* Payment gateway integration
* Inventory tracking
* Sales analytics
* Admin charts and reports
* Email notifications
* Global search
* Advanced filtering and sorting

---

---

## Author

Built by Niyas S.

---

## License

This project is licensed under the MIT License.
