import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  verified: boolean;
}

const EcommercePage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [sortReviews, setSortReviews] = useState('helpful');
  const [filterRating, setFilterRating] = useState(0);
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const product = {
    name: 'Premium Wireless Headphones Pro Max',
    brand: 'AudioTech',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.5,
    reviewCount: 1284,
    sku: 'ATHP-001-WH',
    inStock: true,
    stockCount: 15,
    images: [
      '/api/placeholder/600/600',
      '/api/placeholder/600/601',
      '/api/placeholder/600/602',
      '/api/placeholder/600/603',
    ],
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
    colors: ['Black', 'White', 'Blue', 'Red'],
    features: [
      'Active Noise Cancellation',
      '40-hour battery life',
      'Premium sound quality',
      'Comfortable over-ear design',
      'Bluetooth 5.2 connectivity',
      'Built-in microphone',
    ],
  };

  const reviews: Review[] = [
    {
      id: 1,
      author: 'John D.',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excellent sound quality and comfort. The noise cancellation is amazing!',
      helpful: 42,
      verified: true,
    },
    {
      id: 2,
      author: 'Sarah M.',
      rating: 4,
      date: '2024-01-10',
      comment: 'Great headphones, but a bit heavy for long use. Sound is fantastic though.',
      helpful: 28,
      verified: true,
    },
    {
      id: 3,
      author: 'Mike R.',
      rating: 5,
      date: '2024-01-05',
      comment: 'Worth every penny! Best headphones I\'ve owned.',
      helpful: 15,
      verified: false,
    },
  ];

  const relatedProducts = [
    { id: 1, name: 'Wireless Earbuds Pro', price: 149.99, image: '/api/placeholder/200/200' },
    { id: 2, name: 'Portable Speaker Max', price: 199.99, image: '/api/placeholder/200/201' },
    { id: 3, name: 'Gaming Headset Ultra', price: 249.99, image: '/api/placeholder/200/202' },
    { id: 4, name: 'Studio Monitor Headphones', price: 399.99, image: '/api/placeholder/200/203' },
  ];

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }
    toast.success('Proceeding to checkout...');
    navigate('/checkout');
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE20') {
      setIsCouponApplied(true);
      toast.success('Coupon applied! 20% discount');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const calculatePrice = () => {
    const basePrice = product.price * quantity;
    if (isCouponApplied) {
      return (basePrice * 0.8).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  const calculateSavings = () => {
    const originalTotal = product.originalPrice * quantity;
    const currentTotal = parseFloat(calculatePrice());
    return (originalTotal - currentTotal).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b" data-testid="breadcrumb">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/" className="text-gray-500 hover:text-gray-700">Home</a></li>
            <li><span className="text-gray-400">/</span></li>
            <li><a href="/electronics" className="text-gray-500 hover:text-gray-700">Electronics</a></li>
            <li><span className="text-gray-400">/</span></li>
            <li><a href="/audio" className="text-gray-500 hover:text-gray-700">Audio</a></li>
            <li><span className="text-gray-400">/</span></li>
            <li className="text-gray-900">Headphones</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="main-product-image"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  data-testid={`thumbnail-${index}`}
                >
                  <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500" data-testid="product-brand">{product.brand}</span>
                <span className="text-sm text-gray-500" data-testid="product-sku">SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="product-title">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex" data-testid="product-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900" data-testid="product-price">
                  ${calculatePrice()}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through" data-testid="original-price">
                      ${(product.originalPrice * quantity).toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm" data-testid="discount-badge">
                      Save ${calculateSavings()}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-6">
                {product.inStock ? (
                  <>
                    <span className="inline-flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-600 font-medium" data-testid="stock-status">In Stock</span>
                    </span>
                    {product.stockCount <= 20 && (
                      <span className="text-orange-600 text-sm" data-testid="stock-warning">
                        Only {product.stockCount} left!
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-red-600 font-medium" data-testid="out-of-stock">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="text-sm text-blue-600 hover:underline"
                  data-testid="size-chart-toggle"
                >
                  Size Chart
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-4 border rounded-lg text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    data-testid={`size-${size.toLowerCase()}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {showSizeChart && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg" data-testid="size-chart">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Size</th>
                        <th className="text-left py-2">US</th>
                        <th className="text-left py-2">EU</th>
                        <th className="text-left py-2">CM</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Small</td><td>6-7</td><td>39-40</td><td>24-25</td></tr>
                      <tr><td>Medium</td><td>8-9</td><td>41-42</td><td>26-27</td></tr>
                      <tr><td>Large</td><td>10-11</td><td>43-44</td><td>28-29</td></tr>
                      <tr><td>X-Large</td><td>12-13</td><td>45-46</td><td>30-31</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-12 h-12 rounded-full border-2 ${
                      selectedColor === color ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    data-testid={`color-${color.toLowerCase()}`}
                    aria-label={color}
                  >
                    {selectedColor === color && (
                      <svg className="absolute inset-0 w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm text-gray-600 mt-2">Selected: {selectedColor}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  data-testid="quantity-decrease"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border border-gray-300 rounded-lg py-2"
                  data-testid="quantity-input"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  data-testid="quantity-increase"
                >
                  +
                </button>
              </div>
            </div>

            {/* Coupon Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code (try SAVE20)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  data-testid="coupon-input"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  data-testid="apply-coupon-btn"
                >
                  Apply
                </button>
              </div>
              {isCouponApplied && (
                <p className="text-sm text-green-600 mt-1" data-testid="coupon-success">
                  Coupon applied successfully!
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                data-testid="add-to-cart-btn"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                data-testid="buy-now-btn"
              >
                Buy Now
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 border rounded-lg transition-colors ${
                  isWishlisted
                    ? 'bg-red-50 border-red-300 text-red-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                data-testid="wishlist-btn"
              >
                <svg className="w-6 h-6" fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2" data-testid="product-features">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span className="text-sm">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Estimated delivery: 3-5 business days</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span className="text-sm">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Tabs */}
        <div className="mt-12 bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {['Description', 'Specifications', 'Reviews', 'Q&A'].map((tab, index) => (
                <button
                  key={tab}
                  className="py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600"
                  data-testid={`tab-${tab.toLowerCase()}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Customer Reviews</h3>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortReviews}
                    onChange={(e) => setSortReviews(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                    data-testid="sort-reviews"
                  >
                    <option value="helpful">Most Helpful</option>
                    <option value="recent">Most Recent</option>
                    <option value="rating-high">Highest Rating</option>
                    <option value="rating-low">Lowest Rating</option>
                  </select>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                    data-testid="filter-rating"
                  >
                    <option value="0">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>

              {/* Rating Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold">{product.rating}</div>
                  <div className="flex justify-center my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-6 h-6 ${
                          star <= Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">{product.reviewCount} reviews</div>
                </div>
                <div className="col-span-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center mb-2">
                      <span className="text-sm w-12">{rating} star</span>
                      <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${rating === 5 ? 60 : rating === 4 ? 30 : 10}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12">
                        {rating === 5 ? '60%' : rating === 4 ? '30%' : '10%'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6" data-testid={`review-${review.id}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 font-semibold">{review.author}</span>
                          {review.verified && (
                            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{review.date}</span>
                          <button className="hover:text-blue-600">Helpful ({review.helpful})</button>
                          <button className="hover:text-blue-600">Report</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!showMoreReviews && (
                <button
                  onClick={() => setShowMoreReviews(true)}
                  className="mt-6 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  data-testid="show-more-reviews"
                >
                  Show More Reviews
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                data-testid={`related-product-${item.id}`}
              >
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-lg font-bold text-gray-900">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommercePage;