import type { ReactNode } from 'react'

interface Props {
  title?: string
  description?: string
  className?: string
  children: ReactNode
}

/** กล่องเนื้อหา — ส่วน body ยืดเต็มพื้นที่ที่เหลือของ grid */
export function Card({ title, description, className, children }: Props) {
  return (
    <section className={className ? `card ${className}` : 'card'}>
      {(title || description) && (
        <div className="card__head">
          {title && <h2 className="card__title">{title}</h2>}
          {description && <div className="card__desc">{description}</div>}
        </div>
      )}
      <div className="card__body">{children}</div>
    </section>
  )
}
