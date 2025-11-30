export { getPaginatedProductsWithImage } from "./products/product-pagination";
export { getProductBySlug } from "./products/get-product-by-slug";
export { getStockBySlug } from "./products/get-stock-by-slug";

export { authenticate } from "./auth/login";
export { logout } from "./auth/logout";

export { getCountries } from "./country/get-countries";

export { setUserAddress } from "./address/set-user-address";
export { getUserAddress } from "./address/get-user-address";

export { placeOrder } from "./order/place-order";
export { getOrderById } from "./order/get-order-by-id";
export { getOrdersByUser } from "./order/get-orders-by-user";
export { getPaginatedOrders } from "./order/get-paginated-orders";

export { updateOrderTransactionId } from "./payments/update-order";

export { createOrder } from "./paypal/createOrder";
export { captureOrder } from "./paypal/onAprobe";
export { getAccessToken } from "./paypal/get-acces-token";
export { paypalGetOrderDetails } from "./paypal/paypal-payment";

export { getUsers } from "./user/get-users";
export { changeUserRole } from "./user/change-user-role";

export { getCategory } from "./category/get-category";
export { createProduct } from "./products/create-product";
export { deleteProductImage } from "./products/delete-product-image";
