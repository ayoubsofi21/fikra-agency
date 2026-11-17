import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Calendar, Clock, User } from 'lucide-react'
import { PageTransition } from '@/components/layout'
import { Container, Input, Tabs, Card } from '@/components/ui'
import { usePosts } from '@/hooks/useContent'

const BLOG_CATEGORIES = [
  { value: 'all', label: 'blog.categories.all' },
  { value: 'Engineering', label: 'blog.categories.engineering' },
  { value: 'Design', label: 'blog.categories.design' },
  { value: 'E-commerce', label: 'blog.categories.ecommerce' },
  { value: 'UX', label: 'blog.categories.ux' },
]

const BlogPostCard = ({ post, lang }) => {
  const { t } = useTranslation()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ease: 'easeOut', duration: 0.4 }}>
      <Card className="h-full overflow-hidden group">
        <div className="relative h-48 overflow-hidden">
          <img src={post.cover} alt={post.title[lang] || post.title.en} className="w-full h-full object-cover" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-center gap-4 text-xs text-muted mb-3">
            <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md font-medium">{post.category[lang] || post.category.en}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" aria-hidden="true" />{post.date}</span>
          </div>
          <h2 className="text-xl font-semibold text-text mb-2 group-hover:text-primary transition-colors">{post.title[lang] || post.title.en}</h2>
          <p className="text-muted text-sm mb-4 line-clamp-2">{post.excerpt[lang] || post.excerpt.en}</p>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm text-muted"><User className="w-4 h-4" aria-hidden="true" />{post.author[lang] || post.author.en}</span>
            <div className="flex items-center gap-1 text-sm text-muted">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>{t('blog.minRead', { value: post.readTime })}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

const BlogPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const posts = usePosts()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = posts.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || (p.category.en || '').toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch = !searchQuery ||
      (p.title[lang] || p.title.en).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.excerpt[lang] || p.excerpt.en).toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div>
      <Helmet>
        <title>{t('nav.blog')} - {t('common.brandFull')}</title>
        <meta name="description" content={t('blog.subtitle')} />
      </Helmet>

      <PageTransition>
        <div className="pt-32 pb-16 bg-surface">
          <Container>
            <div className="max-w-3xl mb-8">
              <h1 className="text-4xl md:text-5xl font-semibold text-text mb-4">{t('nav.blog')}</h1>
              <p className="text-xl text-muted leading-relaxed">{t('blog.subtitle')}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Input
                  aria-label={t('common.search')}
                  placeholder={t('common.search')}
                  icon={Search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Tabs
                  tabs={BLOG_CATEGORIES.map((c) => ({ ...c, label: t(c.label) }))}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted text-lg">{t('blog.empty')}</p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}
                    className="mt-4 text-primary hover:underline"
                  >
                    {t('common.clear')}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl">
                    <BlogPostCard post={post} lang={lang} />
                  </Link>
                ))}
              </div>
            )}
          </Container>
        </div>
      </PageTransition>
    </div>
  )
}

export default BlogPage
