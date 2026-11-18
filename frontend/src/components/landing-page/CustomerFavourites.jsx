import './CustomerFavourites.css';

const favourites = [
  {
    name: 'Mul Chanderi Brush Paint Three Pcs Set',
    image: 'Vibrant Pink Floral Salwar Kameez.png',
    href: 'https://eveseraclothing.com/product/6af71b90220380e3f092c2c8',
    price: '₹1,750',
  },
  {
    name: 'Mul Chanderi Three Pcs Set',
    image: 'Elegant Maroon Embroidered Ethnic Ensemble.png',
    href: 'https://eveseraclothing.com/product/6af71a40220380e3f092c2aa',
    price: '₹2,350',
  },
  {
    name: 'Aari Emblished Three Pcs Set',
    image: 'Elegant Lavender Anarkali Portrait.png',
    href: 'https://eveseraclothing.com/product/6af719f2220380e3f092c29e',
    price: '₹1,450',
  },
  {
    name: 'Mul Chanderi Three Pcs Set',
    image: 'mul-chanderi-brown-three-pcs-set.png',
    href: 'https://eveseraclothing.com/product/6af71b43220380e3f092c2bc',
    price: '₹2,150',
  },
];

const moreFavourites = [
  {
    name: 'Mul Chanderi Three Pcs Set',
    image: 'Vibrant Pink Indian Traditional Ensemble.png',
    href: 'https://eveseraclothing.com/product/6af719c1220380e3f092c298',
    price: '₹1,200',
  },
  {
    name: 'Mul Chanderi Three Pcs Set',
    image: 'Embroidered Kurta with Patterned Dupatta.png',
    href: 'https://eveseraclothing.com/product/6af71996220380e3f092c292',
    price: '₹1,200',
  },
  {
    name: 'Mul Chanderi Three Pcs Set',
    image: 'Elegant Pink Kurti Portrait.png',
    href: 'https://eveseraclothing.com/product/6af71af6220380e3f092c2b0',
    price: '₹1,200',
  },
  {
    name: 'Mul Chanderi Three Pcs Set',
    image: 'Teal Embroidered Salwar Kameez Portrait.png',
    href: 'https://eveseraclothing.com/product/6af71b1c220380e3f092c2b6',
    price: '₹1,200',
  },
];

function ProductGrid({ products, label }) {
  return (
    <div className="favourite-products" aria-label={label}>
      {products.map((product) => (
        <article className="favourite-product" key={product.name}>
          <div className="product-image-wrap">
            {product.href ? (
              <a href={product.href} aria-label={`View ${product.name}`}>
                <img src={`/assets/${encodeURIComponent(product.image)}`} alt={product.name} loading="lazy" />
              </a>
            ) : (
              <img src={`/assets/${encodeURIComponent(product.image)}`} alt={product.name} loading="lazy" />
            )}
          </div>
          <h3>{product.name}</h3>
          <div className="product-rating" aria-label="Rated 5 out of 5 stars">★★★★★</div>
          <p className="product-price"><strong>{product.price}</strong></p>
        </article>
      ))}
    </div>
  );
}

export default function CustomerFavourites() {
  return (
    <section className="favourites" id="favourites" aria-labelledby="favourites-title">
      <header className="favourites-heading">
        <p className="favourites-kicker">Customer Favourites</p>
        <h2 id="favourites-title">Styles You’ll Love to Wear</h2>
        <p className="favourites-intro">Explore our bestselling collection and find beautiful outfits that match your style. Your next favourite look might be waiting here!</p>
      </header>
      <ProductGrid products={favourites} label="Customer favourite products" />
      <div className="favourite-products-more">
        <ProductGrid products={moreFavourites} label="More customer favourite products" />
      </div>
    </section>
  );
}
