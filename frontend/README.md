# Kindred storefront

A responsive single-page React storefront backed by the Express API in `../backend`. It includes a rotating home-page hero carousel, SPA navigation between collection categories, product details, account registration and sign-in, and a cart. GSAP and ScrollTrigger provide subtle product-card hover and scroll-reveal animations; reduced-motion preferences disable the motion effects.

## Run locally

1. Configure the backend environment (`MONGO_URI`, `JWT_SECRET`, and the storage credentials used for product image uploads).
2. Start the API from the repository root with `npm --prefix backend start`. The API listens on port `3000`.
3. Start the storefront with `npm --prefix frontend run dev`. Vite serves the app and proxies `/api` requests to the backend.

The storefront reads products and PKR prices from `GET /api/product`, uses `/api/auth` for account access, and uses `/api/cart` for signed-in shoppers. Admin accounts can manage their own products from `/admin/products`; the backend requires an authenticated admin role and scopes listing, updates, and deletes to the product owner. Public registration always creates a regular customer account.

## Add the demo catalog

After creating an admin account and configuring the backend environment, run `npm --prefix backend run seed:products` from the workspace root. This adds eight sample home-goods products with demo PKR prices. It also adds demo prices to the existing `flags`, `card`, and `random` items only if those exact products are present and currently have no price. Existing prices are not overwritten. The script is safe to rerun.

Products can also be added through the admin-only `POST /api/product/createProduct` endpoint with `name`, `des`, `price`, and `image` fields.

The backend does not provide checkout, so the cart shows item prices and subtotal but cannot process purchases.
