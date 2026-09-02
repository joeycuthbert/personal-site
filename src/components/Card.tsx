export function Card({
  title,
  href,
  meta,
  description,
}: {
  title: string;
  href: string;
  meta?: string;
  description?: string;
}) {
  return (
    <a href={href} className="card">
      <div className="card-title">{title}</div>
      {meta ? <div className="card-meta">{meta}</div> : null}
      {description ? <div className="card-desc">{description}</div> : null}
    </a>
  );
}
