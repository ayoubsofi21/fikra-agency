import { Helmet } from 'react-helmet-async'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, User, Share2, Check } from 'lucide-react'
import { Container, Section } from '@/components/ui'
import { posts } from '@/data/mock'

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [copied, setCopied] = useState(false)

  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <Container>
        <h1 className="text-2xl font-semibold">{t('common.notFound')}</h1>
      </Container>
    )
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable — ignore
    }
  }

  return (
    <>
      <Helmet>
        <title>{post.title[lang] || post.title.en} - {t('common.brandFull')}</title>
        <meta name="description" content={post.excerpt[lang] || post.excerpt.en} />
      </Helmet>

      <Section variant="light" spacing="large">
        <Container>
          <button onClick={() => navigate('/blog')} className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> {t('nav.blog')}
          </button>

          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: 'easeOut', duration: 0.5 }}>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-md font-medium text-sm">
                {post.category[lang] || post.category.en}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted">
                <Calendar className="w-4 h-4" /> {post.date}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted">
                <User className="w-4 h-4" /> {post.author[lang] || post.author.en}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted">
                <Clock className="w-4 h-4" aria-hidden="true" /> {t('blog.minRead', { value: post.readTime })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text mb-8 leading-tight">
              {post.title[lang] || post.title.en}
            </h1>

            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-12 bg-surfaceAlt">
              <img src={post.cover} alt={post.title[lang]} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-muted leading-relaxed font-medium mb-8">{post.excerpt[lang] || post.excerpt.en}</p>

              {(post.content?.[lang] || post.content?.en || []).map((block, i) => {
                if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>
                if (block.type === 'h3') return <h3 key={i}>{block.text}</h3>
                if (block.type === 'ul') {
                  return (
                    <ul key={i} className="mb-6 list-disc ps-6">
                      {block.items.map((item, j) => <li key={j} className="mb-2">{item}</li>)}
                    </ul>
                  )
                }
                if (block.type === 'ol') {
                  return (
                    <ol key={i} className="mb-6 list-decimal ps-6">
                      {block.items.map((item, j) => <li key={j} className="mb-2">{item}</li>)}
                    </ol>
                  )
                }
                return <p key={i} className="mb-6">{block.text}</p>
              })}
            </div>

            <div className="border-t border-border mt-12 pt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&q=80" alt={post.author[lang]} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-semibold text-text">{post.author[lang] || post.author.en}</div>
                    <div className="text-sm text-muted">{post.category[lang] || post.category.en}</div>
                  </div>
                </div>
                <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surfaceAlt text-text hover:bg-surfaceAlt/80 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                  <span className="text-sm">{copied ? t('common.copied') : t('common.share')}</span>
                </button>
              </div>
            </div>
          </motion.article>
        </Container>
      </Section>
    </>
  )
}

export default BlogPost
