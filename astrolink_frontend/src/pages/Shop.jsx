import React, { useEffect, useState, useMemo } from "react";
import { fetchProducts } from "../api";
import ProductCard from "../components/ProductCard";
import CartSidebar from "../components/CartSidebar";
import Wishlist from "../components/Wishlist";
import ProductDetailModal from "../components/ProductDetailModal";

const STORAGE_CART = "astrolink_cart_v1";
const STORAGE_WISHLIST = "astrolink_wishlist_v1";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_CART)) || []; } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_WISHLIST)) || []; } catch { return []; }
  });

  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);

  useEffect(() => {
    fetchProducts().then(res => setProducts(res.data || []));
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_CART, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(wishlist)); }, [wishlist]);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev;
      return [...prev, { ...product, qty: 1 }];
    });
    setShowCart(true);
  };

  const handleRemoveFromCart = (id) => setCart((prev) => prev.filter(p => p.id !== id));

  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const isWishlisted = (id) => wishlist.some((p) => p.id === id);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))] , [products]);

  const filtered = useMemo(() => {
    let out = products;
    if (categoryFilter && categoryFilter !== "All") out = out.filter(p => p.category === categoryFilter);
    if (query) out = out.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || (p.description || '').toLowerCase().includes(query.toLowerCase()));
    if (sortBy === 'price_asc') out = out.slice().sort((a,b)=>a.price-b.price);
    if (sortBy === 'price_desc') out = out.slice().sort((a,b)=>b.price-a.price);
    if (sortBy === 'newest') out = out.slice().sort((a,b)=> new Date(b.created_at) - new Date(a.created_at));
    return out;
  }, [products, query, categoryFilter, sortBy]);

  // Group products by category for sectioned display
  const groupedByCategory = useMemo(() => {
    const map = {};
    for (const p of products) {
      const key = p.category || 'Uncategorized';
      if (!map[key]) map[key] = [];
      map[key].push(p);
    }
    return map;
  }, [products]);

  const newest = useMemo(() => products.slice().sort((a,b)=> new Date(b.created_at)-new Date(a.created_at)).slice(0,6), [products]);

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Shop</h1>
          <p className="text-gray-400">Browse our IT products</p>
        </div>

        <div className="flex gap-3 items-center">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search products..." className="p-2 rounded bg-gray-800/60" />
          <select value={categoryFilter} onChange={(e)=>setCategoryFilter(e.target.value)} className="p-2 rounded bg-gray-800/60">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="p-2 rounded bg-gray-800/60">
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <button onClick={()=>setShowWishlist(true)} className="bg-pink-600 px-3 py-1 rounded">Wishlist ({wishlist.length})</button>
          <button onClick={()=>setShowCart(true)} className="bg-green-600 px-3 py-1 rounded">Cart ({cart.length})</button>
        </div>
      </header>

      <main>
        {/* If user is searching or filtering, show the filtered grid; otherwise show sections */}
        {(query || (categoryFilter && categoryFilter !== 'All')) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} isWishlisted={isWishlisted(p.id)} onShowDetails={(prod)=>setDetailProduct(prod)} />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Featured</h2>
                <a className="text-sm text-purple-300">See all</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newest.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} isWishlisted={isWishlisted(p.id)} onShowDetails={(prod)=>setDetailProduct(prod)} />
                ))}
              </div>
            </section>

            {/* Per-category sections */}
            {Object.keys(groupedByCategory).map((cat) => (
              <section key={cat}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{cat}</h2>
                  <a className="text-sm text-purple-300">See all</a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {groupedByCategory[cat].slice(0,8).map(p => (
                    <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} isWishlisted={isWishlisted(p.id)} onShowDetails={(prod)=>setDetailProduct(prod)} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {showCart && (
        <CartSidebar items={cart} onRemove={(id)=>handleRemoveFromCart(id)} onCheckout={()=>alert('Checkout not implemented')} onClose={()=>setShowCart(false)} />
      )}

      {showWishlist && (
        <Wishlist items={wishlist} onRemove={(id)=>setWishlist(prev=>prev.filter(p=>p.id!==id))} onClose={()=>setShowWishlist(false)} />
      )}

      {detailProduct && <ProductDetailModal product={detailProduct} onClose={()=>setDetailProduct(null)} onAddToCart={handleAddToCart} />}
    </div>
  );
}
