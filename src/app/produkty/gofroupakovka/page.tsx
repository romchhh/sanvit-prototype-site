import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { BRAND, PRODUCT_DETAILS, PRODUCTS } from '../../brand'
import styles from './page.module.css'

const ProductModelViewer = dynamic(() => import('../../components/ProductModelViewer'), {
  ssr: false,
  loading: () => <div className={styles.viewerCard}>Завантаження 3D-моделі…</div>,
})

const product = PRODUCTS.find((item) => item.id === 'corrugated-pack')!
const details = PRODUCT_DETAILS['corrugated-pack']

export const metadata: Metadata = {
  title: `${product.title} — Санвіт-Холдинг`,
  description: details.description,
}

export default function GofroupakovkaProductPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <a href="/#produkciya" className={styles.back}>
          ← До каталогу
        </a>

        <div className={styles.layout}>
          <div className={styles.viewerCard}>
            <ProductModelViewer modelUrl={details.model} />
          </div>

          <div className={styles.info}>
            <h1 className={styles.heading}>{product.title}</h1>
            <p className={styles.lead}>{details.description}</p>

            <dl className={styles.specs}>
              {details.specs.map((spec) => (
                <div key={spec.label} className={styles.spec}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>

            <ul className={styles.features}>
              {details.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <div className={styles.actions}>
              <a href="/#kontakty" className={styles.ctaPrimary}>
                Замовити прорахунок
              </a>
              <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`} className={styles.ctaSecondary}>
                Зателефонувати
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
