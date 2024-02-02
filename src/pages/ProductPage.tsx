import { useParams } from 'react-router-dom'
import { useEffect, useState, useContext, useCallback } from 'react'
import { ProductType } from '../models/ProductType'
import { useProducts } from '../state/ProductsContext'
import arrowIcon from '../assets/arrow-icon.png'
import separator from '../assets/line-separator.svg'
import classes from './ProductPage.module.scss'
import facebookIcon from '../assets/social-media-icons/facebook.svg'
import twitterIcon from '../assets/social-media-icons/twitter.svg'
import linkedinIcon from '../assets/social-media-icons/linkedin.svg'
import ProductCard from '../components/ProductCard'
import TabButton from '../components/TabButton'
import Review from '../components/Review'
import { CartContext } from '../state/CartContext'
import { CartProductType } from '../models/CartProductType'
import Rating from '../components/Rating'

const ProductPage = () => {
  const [product, setProduct] = useState<ProductType | undefined>()
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([])
  const [showItems, setShowItems] = useState(4)
  const [quantityToAddToCart, setQuantityToAddToCart] = useState<number>(1)
  const [selectedTab, setSelectedTab] = useState('description')
  const params = useParams<{ productId: string }>()
  const { getProduct, getRelatedProducts } = useProducts()
  const { addItem } = useContext(CartContext)

  useEffect(() => {
    if (!params.productId) return
    const selectedProduct = getProduct(params.productId)
    if (selectedProduct) {
      setProduct(selectedProduct)
      const relatedProductsList = getRelatedProducts(selectedProduct.type)
      setRelatedProducts(relatedProductsList)
    }
  }, [getProduct, params.productId, getRelatedProducts])

  const addToCart = useCallback(() => {
    if (!product) return
    const cartProduct: CartProductType = {
      id: product.id,
      type: product.type,
      category: product.category,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantityToAddToCart,
      color: product.list[0].color,
      size: '',
      discount: product.discount
    }
    addItem(cartProduct)
  }, [addItem, product, quantityToAddToCart])

  const onShowMoreProducts = () => {
    setShowItems((previousState) => previousState + 4)
  }

  function handleSelect(tab: string) {
    setSelectedTab(tab)
  }

  console.log(product)
  console.log(params)

  let tabContent = null

  if (!product) {
    return <div>Product not found</div>
  }

  switch (selectedTab) {
    case 'description':
      tabContent = (
        <>
          <p className={classes['description-details']}>{product.description}</p>
          <div className={classes['description-photos']}>
            <img src={product.images[2]} alt={`${product.name} 2`} />
            <img src={product.images[3]} alt={`${product.name} 3`} />
          </div>
        </>
      )
      break
    case 'additionalInfo':
      tabContent = (
        <p className={classes['additionalInfo-details']}>
          {product.additionalInformation}
        </p>
      )
      break
    case 'reviews':
      tabContent = product?.reviews.map((review) => (
        <Review
          key={review.id}
          name={review.name}
          comment={review.comment}
          rating={review.rating}
        />
      ))
      break
  }

  return (
    <div className={classes['product-page']}>
      <div className={classes['paths-bar']}>
        <span className={classes.path}>Home</span>
        <img src={arrowIcon} />
        <span className={classes.path}>Shop</span>
        <img src={arrowIcon} />
        <img src={separator} />
        <span>{product?.name}</span>
      </div>
      <div className={classes['product-container']}>
        <img src={product?.image} alt={product?.name} />
        <div className={classes['product-main-details']}>
          <h1>{product?.name}</h1>
          <h2>$ {product?.price}</h2>
          <div className={classes['rating-container']}>
            <Rating selectedRating={product.rating} />
            <div className={classes.separator}></div>
            <span className={classes['reviews-numbers']}>
              {product?.reviews.length} Customer Reviews
            </span>
          </div>
          <p>{product?.description}</p>
          <div className={classes['size-container']}>
            <span>Size</span>
            <div className={classes['size-list']}>
              {product?.sizes.map((size) => (
                <button key={size}>{size}</button>
              ))}
            </div>
          </div>
          <div className={classes['color-container']}>
            <span>Color</span>

            <div className={classes['colors-list']}>
              {product.list.map((item) => (
                <button key={item.color} style={{ backgroundColor: item.value }}></button>
              ))}
            </div>
          </div>
          <div className={classes['product-buttons']}>
            <div className={classes['quantity-adjust']}>
              <button
                className={classes.decrement}
                onClick={() =>
                  setQuantityToAddToCart((prev) => (prev > 1 ? prev - 1 : prev))
                }
              >
                -
              </button>
              <span>{quantityToAddToCart}</span>
              <button
                className={classes.increment}
                onClick={() => setQuantityToAddToCart((prev) => prev + 1)}
              >
                +
              </button>
            </div>

            <button className={classes['add-to-cart-btn']} onClick={addToCart}>
              Add To Cart
            </button>
            <button className={classes['compare-btn']}> + Compare</button>
          </div>
          <div className={classes.tags}>
            <p className={classes['tags-title']}>
              <span>SKU</span>
              <span>Category</span>
              <span>Tags</span>
              <span>Share</span>
            </p>

            <div className={classes['tags-details']}>
              <div className={classes['tag-details']}>
                <span>:</span>
                <span>{product.id}</span>
              </div>

              <div className={classes['tag-details']}>
                <span>:</span>
                <span>{product.category}</span>
              </div>

              <div className={classes['tag-details']}>
                <span>:</span>
                <span>{product.type}</span>
              </div>

              <div className={classes['tag-details']}>
                <span>:</span>
                <div className={classes.social}>
                  <img src={facebookIcon} alt="facebook" />
                  <img src={twitterIcon} alt="twitter" />
                  <img src={linkedinIcon} alt="linkedin" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classes['description-container']}>
        <div className={classes['description-header']}>
          <TabButton
            isSelected={selectedTab === 'description'}
            onSelect={() => handleSelect('description')}
          >
            Description
          </TabButton>
          <TabButton
            isSelected={selectedTab === 'additionalInfo'}
            onSelect={() => handleSelect('additionalInfo')}
          >
            Additional Information
          </TabButton>
          <TabButton
            isSelected={selectedTab === 'reviews'}
            onSelect={() => handleSelect('reviews')}
          >
            Reviews [{product.reviews.length}]
          </TabButton>
        </div>
        {tabContent}
      </div>

      <div className={classes['related-products']}>
        <h2>Related Products</h2>
        <ul>
          {relatedProducts.slice(0, showItems).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              shortDescription={product.shortDescription}
              discount={product.discount}
            />
          ))}
        </ul>
        {showItems < relatedProducts.length && (
          <button className={classes['show-more-btn']} onClick={onShowMoreProducts}>
            Show More
          </button>
        )}
        <div>
          <img />
          <img />
        </div>
      </div>
    </div>
  )
}

export default ProductPage
