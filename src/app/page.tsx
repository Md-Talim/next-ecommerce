import Product from '@/components/Product';
import Stripe from 'stripe';

const getProducts = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-08-16',
  });

  const products = await stripe.products.list();

  const productsWithPrice = await Promise.all(
    products.data.map(async (product) => {
      const prices = await stripe.prices.list({
        product: product.id,
      });

      return {
        id: product.id,
        name: product.name,
        image: product.images[0],
        price: prices.data[0].unit_amount,
        currency: prices.data[0].currency,
      };
    }),
  );

  return productsWithPrice;
};

const Home = async () => {
  const products = await getProducts();

  return (
    <main className="p-24">
      <h1>Products</h1>

      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}
    </main>
  );
};

export default Home;
