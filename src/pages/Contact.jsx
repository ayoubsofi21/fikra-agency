import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Cloud, Monitor, Package, Palette, Shapes, ShoppingCart, Upload } from 'lucide-react'
import { Container, Input, Textarea, Label, Button, Card, SectionTitle } from '@/components/ui'
import { PageTransition } from '@/components/layout'
import { sendQuote } from '@/services/api'
import { cn } from '@/utils/helpers'

const steps = [
  { key: 'type', title: 'contact.form.step1', desc: 'contact.form.step1Desc' },
  { key: 'budget', title: 'contact.form.step2', desc: 'contact.form.step2Desc' },
  { key: 'details', title: 'contact.form.step3', desc: 'contact.form.step3Desc' },
  { key: 'contact', title: 'contact.form.step4', desc: 'contact.form.step4Desc' },
]

const projectTypes = [
  { value: 'custom-website', label: 'contact.form.projectType.customWebsite', icon: Monitor },
  { value: 'ecommerce', label: 'contact.form.projectType.ecommerce', icon: ShoppingCart },
  { value: 'platform', label: 'contact.form.projectType.platform', icon: Cloud },
  { value: 'solution', label: 'contact.form.projectType.solution', icon: Package },
  { value: 'design', label: 'contact.form.projectType.design', icon: Palette },
  { value: 'other', label: 'contact.form.projectType.other', icon: Shapes },
]

const budgets = [
  { value: 'under-2k', label: 'contact.form.budget.lessThan2k' },
  { value: '2k-5k', label: 'contact.form.budget.2k-5k' },
  { value: '5k-10k', label: 'contact.form.budget.5k-10k' },
  { value: '10k-20k', label: 'contact.form.budget.10k-20k' },
  { value: 'over-20k', label: 'contact.form.budget.moreThan20k' },
]

const timelines = [
  { value: 'asap', label: 'contact.form.timeline.asap' },
  { value: '1-month', label: 'contact.form.timeline.withinMonth' },
  { value: '3-months', label: 'contact.form.timeline.within3Months' },
  { value: 'flexible', label: 'contact.form.timeline.flexible' },
]

const ContactPage = () => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    type: '',
    budget: '',
    timeline: '',
    description: '',
    files: [],
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    honeypot: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef(null)

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Guard: only the final step may submit (prevents spurious submits when
    // the Next button node is reconciled into the submit button)
    if (currentStep !== steps.length - 1) return
    if (formData.honeypot) return
    setLoading(true)
    setError('')
    try {
      await sendQuote(formData)
      setSuccess(true)
    } catch (err) {
      setError(err?.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div ref={scrollRef}>
      <Helmet>
        <title>{t('nav.contact')} - {t('common.brandFull')}</title>
        <meta name="description" content={t('contact.subheadline')} />
      </Helmet>

      <PageTransition>
        <div className="pt-32 pb-16 bg-surface">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-semibold text-text mb-4">{t('contact.headline')}</h1>
              <p className="text-xl text-muted">{t('contact.subheadline')}</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={steps.length}
                  aria-valuenow={currentStep + 1}
                  aria-label={t('common.progress')}
                  className="h-2 bg-surfaceAlt rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ ease: 'easeOut', duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between mt-4">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2" aria-current={i === currentStep ? 'step' : undefined}>
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                        i <= currentStep ? 'bg-primary text-white' : 'bg-surfaceAlt text-muted'
                      )}>
                        {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={cn('text-sm font-medium hidden sm:block', i === currentStep ? 'text-text' : 'text-muted')}>
                        {t(step.title)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {success ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                  <div className="w-20 h-20 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-3xl font-semibold text-text mb-4">{t('common.success')}</h2>
                  <p className="text-xl text-muted mb-8">{t('contact.success')}</p>
                  <Button size="lg" onClick={() => { setSuccess(false); setCurrentStep(0); setFormData({ ...formData, type: '', budget: '', timeline: '', description: '', name: '', email: '' }) }}>
                    {t('common.submit')}
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ ease: 'easeOut', duration: 0.3 }}>
                        <SectionTitle title={t(steps[0].title)} subtitle={t(steps[0].desc)} size="lg" align="left" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="radiogroup" aria-label={t(steps[0].title)}>
                          {projectTypes.map((item) => (
                            <Card
                              key={item.value}
                              role="radio"
                              aria-checked={formData.type === item.value}
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('type', item.value) } }}
                              className={cn(
                                'p-4 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-primary/40',
                                formData.type === item.value ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                              )}
                              onClick={() => updateField('type', item.value)}
                            >
                              <div className="mb-3 text-muted"><item.icon className="w-5 h-5" aria-hidden="true" /></div>
                              <div className="font-semibold text-text">{t(item.label)}</div>
                            </Card>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 1 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ ease: 'easeOut', duration: 0.3 }}>
                        <SectionTitle title={t(steps[1].title)} subtitle={t(steps[1].desc)} size="lg" align="left" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" role="radiogroup" aria-label={t(steps[1].title)}>
                          {budgets.map((item) => (
                            <Card
                              key={item.value}
                              role="radio"
                              aria-checked={formData.budget === item.value}
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('budget', item.value) } }}
                              className={cn(
                                'p-4 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-primary/40',
                                formData.budget === item.value ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                              )}
                              onClick={() => updateField('budget', item.value)}
                            >
                              <div className="font-semibold text-text">{t(item.label)}</div>
                            </Card>
                          ))}
                        </div>
                        <SectionTitle title={t('contact.form.timelineLabel')} subtitle={t('contact.form.step2Desc')} size="lg" align="left" />
                        <div className="space-y-3" role="radiogroup" aria-label={t('contact.form.timelineLabel')}>
                          {timelines.map((item) => (
                            <div
                              key={item.value}
                              role="radio"
                              aria-checked={formData.timeline === item.value}
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateField('timeline', item.value) } }}
                              className={cn(
                                'flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-primary/40',
                                formData.timeline === item.value ? 'bg-primary/10 border border-primary' : 'bg-surface border border-border hover:border-primary/50'
                              )}
                              onClick={() => updateField('timeline', item.value)}
                            >
                              <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center', formData.timeline === item.value ? 'border-primary' : 'border-muted')} />
                              <span className="font-medium text-text">{t(item.label)}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ ease: 'easeOut', duration: 0.3 }}>
                        <SectionTitle title={t(steps[2].title)} subtitle={t(steps[2].desc)} size="lg" align="left" />
                        <div className="space-y-6">
                          <div>
                            <Label htmlFor="description">{t('contact.form.step3Desc')}</Label>
                            <Textarea
                              id="description"
                              rows={6}
                              placeholder={t('contact.form.step3Desc')}
                              value={formData.description}
                              onChange={(e) => updateField('description', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>{t('common.attach')}</Label>
                            <div className="mt-2">
                              <label className="flex items-center gap-3 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                                <input type="file" className="sr-only" multiple onChange={(e) => updateField('files', Array.from(e.target.files))} />
                                <Upload className="w-6 h-6 text-muted" />
                                <div>
                                  <div className="font-medium text-text">{t('common.attach')}</div>
                                  <div className="text-sm text-muted">{t('contact.form.dragDrop')}</div>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ ease: 'easeOut', duration: 0.3 }}>
                        <SectionTitle title={t(steps[3].title)} subtitle={t(steps[3].desc)} size="lg" align="left" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="name" required>{t('contact.form.contactInfo.name')}</Label>
                            <Input id="name" required autoComplete="name" placeholder={t('contact.form.contactInfo.name')} value={formData.name} onChange={(e) => updateField('name', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor="email" required>{t('contact.form.contactInfo.email')}</Label>
                            <Input id="email" type="email" required autoComplete="email" placeholder={t('contact.form.contactInfo.email')} value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor="phone">{t('contact.form.contactInfo.phone')}</Label>
                            <Input id="phone" type="tel" autoComplete="tel" placeholder={t('contact.form.contactInfo.phone')} value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor="company">{t('contact.form.contactInfo.company')}</Label>
                            <Input id="company" autoComplete="organization" placeholder={t('contact.form.contactInfo.company')} value={formData.company} onChange={(e) => updateField('company', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor="website">{t('contact.form.contactInfo.website')}</Label>
                            <Input id="website" type="url" placeholder={t('contact.form.contactInfo.website')} value={formData.website} onChange={(e) => updateField('website', e.target.value)} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Honeypot: hidden from humans, catches spam bots */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="contact-honeypot">Leave this field empty</label>
                    <input
                      id="contact-honeypot"
                      type="text"
                      name="honeypot"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.honeypot}
                      onChange={(e) => updateField('honeypot', e.target.value)}
                    />
                  </div>

                  {error && (
                    <p className="mt-6 text-sm text-danger" role="alert">{error}</p>
                  )}

                  <div className="flex justify-between mt-8 pt-8 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setCurrentStep((s) => s - 1)}
                      disabled={currentStep === 0}
                      icon={ArrowLeft}
                    >
                      {t('common.back')}
                    </Button>
                    {currentStep < steps.length - 1 ? (
                      <Button key="step-next" type="button" size="lg" onClick={() => setCurrentStep((s) => s + 1)} icon={ArrowRight}>
                        {t('common.next')}
                      </Button>
                    ) : (
                      <Button key="step-submit" type="submit" size="lg" isLoading={loading}>
                        {t('nav.getQuote')}
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </Container>
        </div>
      </PageTransition>
    </div>
  )
}

export default ContactPage
