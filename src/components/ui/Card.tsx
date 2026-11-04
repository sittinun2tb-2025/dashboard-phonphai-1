import type { ReactNode } from 'react'

interface Props {
  title?: string
  description?: string
  children: ReactNode
}

export function Card({ title, description, children }: Props) {
  return (
    <section className="card">
      {(title || description) && (
        <div className="card__head">
          {title && <h2 className="card__title">{title}</h2>}
          {description && <div className="card__desc">{description}</div>}
        </div>
      )}
      {children}
    </section>
  )
}
