import { Helmet } from 'react-helmet-async'

export default function Seo({ title, description }) {
  const siteName = 'Homepage'
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Enterprise Platform`
  const desc = description || 'The all-in-one enterprise platform to accelerate your digital transformation. Secure, scalable, and built for the modern enterprise.'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  )
}
