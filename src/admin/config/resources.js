/**
 * Declarative admin resource definitions.
 *
 * Each entry maps a backend admin endpoint to the fields of its FormRequest
 * and the columns worth showing in the list. Field types are interpreted by
 * `admin/components/Field.jsx`; no fake data is used anywhere.
 */

const P = (key) => `admin.${key}`

const localized = (name, label, type = 'text', required = true) => ({
  name,
  label,
  type,
  localized: true,
  required,
})

export const optionSets = {
  serviceCategories: {
    options: [
      { value: 'development', label: 'Development' },
      { value: 'commerce', label: 'Commerce' },
      { value: 'platform', label: 'Platform / SaaS' },
      { value: 'design', label: 'Design' },
      { value: 'backend', label: 'Backend / API' },
      { value: 'support', label: 'Support' },
      { value: 'marketing', label: 'Marketing' },
    ],
  },
  projectCategories: {
    options: [
      { value: 'custom-website', label: 'Custom website' },
      { value: 'ecommerce', label: 'E-commerce' },
      { value: 'platform', label: 'Platform' },
      { value: 'solution', label: 'Solution' },
      { value: 'design', label: 'Design' },
      { value: 'other', label: 'Other' },
    ],
  },
  pricingModels: {
    options: [
      { value: 'one_time', label: 'One time' },
      { value: 'subscription', label: 'Subscription' },
      { value: 'custom', label: 'Custom' },
    ],
  },
  quoteStatuses: {
    options: [
      { value: 'new', label: 'admin.new' },
      { value: 'in_progress', label: 'admin.in_progress' },
      { value: 'won', label: 'admin.won' },
      { value: 'lost', label: 'admin.lost' },
    ],
  },
  roles: {
    options: [
      { value: 'admin', label: 'admin.admin' },
      { value: 'editor', label: 'admin.editor' },
    ],
  },
  postStatuses: {
    options: [
      { value: 'draft', label: 'admin.draft' },
      { value: 'published', label: 'admin.published' },
    ],
  },
  solutionCategories: {
    path: '/admin/solution-categories',
    labelKey: 'name',
    valueKey: 'id',
    localizedLabel: true,
  },
  postCategories: {
    path: '/admin/post-categories',
    labelKey: 'name',
    valueKey: 'id',
    localizedLabel: true,
  },
  users: {
    path: '/admin/users',
    labelKey: 'name',
    valueKey: 'id',
  },
}

export const resources = {
  services: {
    path: '/admin/services',
    permission: 'manage-content',
    icon: 'Wrench',
    title: P('services'),
    toggle: true,
    columns: [
      { key: 'title', label: P('title'), kind: 'localized', primary: true },
      { key: 'category', label: P('category'), kind: 'text' },
      { key: 'order', label: P('order'), kind: 'number' },
      { key: 'is_active', label: P('status'), kind: 'status' },
    ],
    fields: [
      localized('title', P('title')),
      localized('short_description', P('shortDescription'), 'textarea'),
      localized('description', P('description'), 'textarea'),
      { name: 'slug', label: P('slug'), type: 'text' },
      { name: 'icon', label: P('icon'), type: 'text' },
      { name: 'category', label: P('category'), type: 'select', optionsKey: 'serviceCategories' },
      { name: 'technologies', label: P('technologies'), type: 'tags' },
      localized('timeline', P('timelineLabel')),
      localized('deliverables', P('deliverables'), 'lines', false),
      { name: 'price_model', label: P('priceModel'), type: 'text' },
      { name: 'price_from', label: P('priceFrom'), type: 'number' },
      { name: 'price_currency', label: P('currency'), type: 'text' },
      { name: 'price_period', label: P('pricePeriod'), type: 'text' },
      { name: 'order', label: P('order'), type: 'number' },
      { name: 'is_featured', label: P('featured'), type: 'toggle' },
      { name: 'is_active', label: P('active'), type: 'toggle', defaultValue: true },
    ],
  },

  solutions: {
    path: '/admin/solutions',
    permission: 'manage-content',
    icon: 'Blocks',
    title: P('solutions'),
    toggle: true,
    softDeletes: true,
    columns: [
      { key: 'title', label: P('title'), kind: 'localized', primary: true },
      { key: 'category', label: P('category'), kind: 'relation' },
      { key: 'pricing_model', label: P('pricingModel'), kind: 'text' },
      { key: 'is_active', label: P('status'), kind: 'status' },
    ],
    fields: [
      localized('title', P('title')),
      localized('short_description', P('shortDescription'), 'textarea'),
      localized('description', P('description'), 'textarea'),
      { name: 'slug', label: P('slug'), type: 'text' },
      { name: 'category_id', label: P('category'), type: 'select', optionsKey: 'solutionCategories' },
      { name: 'technologies', label: P('technologies'), type: 'tags' },
      { name: 'demo_url', label: P('demoUrl'), type: 'url' },
      { name: 'badge', label: P('badge'), type: 'text' },
      { name: 'type', label: P('type'), type: 'text' },
      { name: 'license_type', label: P('license'), type: 'text' },
      { name: 'rating', label: P('rating'), type: 'number' },
      { name: 'image', label: P('image'), type: 'text' },
      { name: 'pricing_model', label: P('pricingModel'), type: 'select', optionsKey: 'pricingModels', required: true },
      { name: 'price', label: P('price'), type: 'number' },
      { name: 'currency', label: P('currency'), type: 'text' },
      { name: 'order', label: P('order'), type: 'number' },
      { name: 'is_featured', label: P('featured'), type: 'toggle' },
      { name: 'is_active', label: P('active'), type: 'toggle', defaultValue: true },
    ],
  },

  solutionFeatures: {
    path: '/admin/solutions/{solution}/features',
    parent: {
      key: 'solution',
      label: P('solutions'),
      path: '/admin/solutions',
      labelKey: 'title',
      localizedLabel: true,
    },
    permission: 'manage-content',
    icon: 'ListChecks',
    title: P('solutionFeatures'),
    columns: [
      { key: 'title', label: P('title'), kind: 'localized', primary: true },
      { key: 'order', label: P('order'), kind: 'number' },
    ],
    fields: [
      localized('title', P('title')),
      localized('description', P('description'), 'textarea', false),
      { name: 'order', label: P('order'), type: 'number' },
    ],
  },

  projects: {
    path: '/admin/projects',
    permission: 'manage-content',
    icon: 'FolderKanban',
    title: P('projects'),
    toggle: true,
    softDeletes: true,
    mediaTypes: ['projects'],
    columns: [
      { key: 'title', label: P('title'), kind: 'localized', primary: true },
      { key: 'client_name', label: P('client'), kind: 'text' },
      { key: 'category', label: P('category'), kind: 'text' },
      { key: 'is_active', label: P('status'), kind: 'status' },
    ],
    fields: [
      localized('title', P('title')),
      localized('summary', P('shortDescription'), 'textarea'),
      localized('problem', P('problem'), 'textarea'),
      localized('solution', P('solution'), 'textarea'),
      localized('result', P('result'), 'textarea'),
      { name: 'slug', label: P('slug'), type: 'text' },
      { name: 'client_name', label: P('client'), type: 'text', required: true },
      { name: 'category', label: P('category'), type: 'select', optionsKey: 'projectCategories', required: true },
      { name: 'technologies', label: P('technologies'), type: 'tags' },
      { name: 'live_url', label: P('liveUrl'), type: 'url' },
      { name: 'image', label: P('image'), type: 'text' },
      { name: 'cover', label: P('cover'), type: 'text' },
      { name: 'gallery', label: P('gallery'), type: 'tags' },
      { name: 'completed_at', label: P('completedAt'), type: 'date' },
      { name: 'order', label: P('order'), type: 'number' },
      { name: 'is_featured', label: P('featured'), type: 'toggle' },
      { name: 'is_active', label: P('active'), type: 'toggle', defaultValue: true },
    ],
  },

  team: {
    path: '/admin/team',
    permission: 'manage-content',
    icon: 'UsersRound',
    title: P('team'),
    toggle: true,
    mediaTypes: ['team'],
    columns: [
      { key: 'name', label: P('name'), kind: 'localized', primary: true },
      { key: 'role', label: P('role'), kind: 'localized' },
      { key: 'email', label: P('email'), kind: 'text' },
      { key: 'is_active', label: P('status'), kind: 'status' },
    ],
    fields: [
      localized('name', P('name')),
      localized('role', P('role')),
      localized('bio', P('bio'), 'textarea'),
      { name: 'skills', label: P('skills'), type: 'tags' },
      { name: 'github_url', label: 'GitHub', type: 'url' },
      { name: 'linkedin_url', label: 'LinkedIn', type: 'url' },
      { name: 'twitter', label: 'Twitter', type: 'text' },
      { name: 'email', label: P('email'), type: 'email' },
      { name: 'avatar', label: P('avatar'), type: 'text' },
      { name: 'order', label: P('order'), type: 'number' },
      { name: 'featured', label: P('featured'), type: 'toggle' },
      { name: 'is_active', label: P('active'), type: 'toggle', defaultValue: true },
    ],
  },

  testimonials: {
    path: '/admin/testimonials',
    permission: 'manage-content',
    icon: 'Quote',
    title: P('testimonials'),
    toggle: true,
    mediaTypes: ['testimonials'],
    columns: [
      { key: 'author_name', label: P('name'), kind: 'localized', primary: true },
      { key: 'company', label: P('company'), kind: 'localized' },
      { key: 'rating', label: P('rating'), kind: 'number' },
      { key: 'is_active', label: P('status'), kind: 'status' },
    ],
    fields: [
      localized('author_name', P('name')),
      localized('author_role', P('role')),
      localized('company', P('company')),
      localized('project_type', P('projectType'), 'text', false),
      localized('content', P('message'), 'textarea'),
      { name: 'avatar', label: P('avatar'), type: 'text' },
      { name: 'rating', label: P('rating'), type: 'number' },
      { name: 'order', label: P('order'), type: 'number' },
      { name: 'is_active', label: P('active'), type: 'toggle', defaultValue: true },
    ],
  },

  faqs: {
    path: '/admin/faqs',
    permission: 'manage-content',
    icon: 'CircleHelp',
    title: P('faqs'),
    toggle: true,
    columns: [
      { key: 'question', label: P('question'), kind: 'localized', primary: true },
      { key: 'group', label: P('group'), kind: 'text' },
      { key: 'order', label: P('order'), kind: 'number' },
      { key: 'is_active', label: P('status'), kind: 'status' },
    ],
    fields: [
      localized('question', P('question')),
      localized('answer', P('answer'), 'textarea'),
      { name: 'group', label: P('group'), type: 'text', required: true },
      { name: 'order', label: P('order'), type: 'number' },
      { name: 'is_active', label: P('active'), type: 'toggle', defaultValue: true },
    ],
  },

  pricing: {
    path: '/admin/pricing',
    permission: 'manage-content',
    icon: 'CreditCard',
    title: P('pricing'),
    toggle: true,
    columns: [
      { key: 'name', label: P('name'), kind: 'localized', primary: true },
      { key: 'key', label: P('key'), kind: 'text' },
      { key: 'price_monthly', label: P('monthlyPrice'), kind: 'number' },
      { key: 'is_active', label: P('status'), kind: 'status' },
    ],
    fields: [
      localized('name', P('name')),
      localized('tagline', P('tagline')),
      localized('description', P('description'), 'textarea', false),
      localized('cta', P('actions'), 'text', false),
      { name: 'key', label: P('key'), type: 'text', required: true },
      { name: 'price_monthly', label: P('monthlyPrice'), type: 'number' },
      { name: 'price_yearly', label: P('yearlyPrice'), type: 'number' },
      { name: 'price_one_time', label: P('oneTimePrice'), type: 'number' },
      { name: 'currency', label: P('currency'), type: 'text' },
      { name: 'features', label: P('features'), type: 'localizedRows' },
      { name: 'order', label: P('order'), type: 'number' },
      { name: 'is_popular', label: P('popular'), type: 'toggle' },
      { name: 'is_active', label: P('active'), type: 'toggle', defaultValue: true },
    ],
  },

  posts: {
    path: '/admin/posts',
    permission: 'manage-content',
    icon: 'Newspaper',
    title: P('posts'),
    toggle: true,
    softDeletes: true,
    mediaTypes: ['posts'],
    columns: [
      { key: 'title', label: P('title'), kind: 'localized', primary: true },
      { key: 'category', label: P('category'), kind: 'relation' },
      { key: 'status', label: P('postStatus'), kind: 'text' },
      { key: 'published_at', label: P('publishDate'), kind: 'date' },
    ],
    filters: [
      { key: 'status', label: P('postStatus'), optionsKey: 'postStatuses' },
    ],
    fields: [
      localized('title', P('title')),
      localized('excerpt', P('excerpt'), 'textarea'),
      localized('content', P('contentBlocks'), 'blocks'),
      { name: 'slug', label: P('slug'), type: 'text' },
      { name: 'category_id', label: P('category'), type: 'select', optionsKey: 'postCategories' },
      { name: 'author_id', label: P('author'), type: 'select', optionsKey: 'users' },
      { name: 'cover', label: P('cover'), type: 'text' },
      { name: 'reading_time', label: P('readingTime'), type: 'number' },
      { name: 'status', label: P('postStatus'), type: 'select', optionsKey: 'postStatuses', required: true, defaultValue: 'draft' },
      { name: 'published_at', label: P('publishDate'), type: 'date' },
      localized('seo_title', P('seoTitle'), 'text', false),
      localized('seo_description', P('seoDescription'), 'textarea', false),
    ],
  },

  solutionCategories: {
    path: '/admin/solution-categories',
    permission: 'manage-content',
    icon: 'Tags',
    title: P('solutionCategories'),
    columns: [
      { key: 'name', label: P('name'), kind: 'localized', primary: true },
      { key: 'slug', label: P('slug'), kind: 'text' },
    ],
    fields: [localized('name', P('name')), { name: 'slug', label: P('slug'), type: 'text' }],
  },

  postCategories: {
    path: '/admin/post-categories',
    permission: 'manage-content',
    icon: 'Tags',
    title: P('postCategories'),
    columns: [
      { key: 'name', label: P('name'), kind: 'localized', primary: true },
      { key: 'slug', label: P('slug'), kind: 'text' },
    ],
    fields: [localized('name', P('name')), { name: 'slug', label: P('slug'), type: 'text' }],
  },

  users: {
    path: '/admin/users',
    permission: 'manage-users',
    icon: 'ShieldCheck',
    title: P('users'),
    columns: [
      { key: 'name', label: P('name'), kind: 'text', primary: true },
      { key: 'email', label: P('email'), kind: 'text' },
      { key: 'role', label: P('role'), kind: 'text' },
      { key: 'created_at', label: P('createdAt'), kind: 'date' },
    ],
    fields: [
      { name: 'name', label: P('name'), type: 'text', required: true },
      { name: 'email', label: P('email'), type: 'email', required: true },
      { name: 'password', label: P('password'), type: 'password' },
      { name: 'role', label: P('role'), type: 'select', optionsKey: 'roles', required: true },
    ],
    prepare: (values, isEdit) => {
      if (isEdit && !values.password) delete values.password
      return values
    },
  },
}

export const contentNav = [
  { key: 'dashboard', path: '/admin', icon: 'LayoutDashboard', label: P('dashboard'), exact: true },
  { key: 'services', path: '/admin/content/services', icon: 'Wrench', label: P('services'), permission: 'manage-content' },
  { key: 'solutions', path: '/admin/content/solutions', icon: 'Blocks', label: P('solutions'), permission: 'manage-content' },
  { key: 'solutionFeatures', path: '/admin/content/solution-features', icon: 'ListChecks', label: P('solutionFeatures'), permission: 'manage-content' },
  { key: 'projects', path: '/admin/content/projects', icon: 'FolderKanban', label: P('projects'), permission: 'manage-content' },
  { key: 'posts', path: '/admin/content/posts', icon: 'Newspaper', label: P('posts'), permission: 'manage-content' },
  { key: 'solutionCategories', path: '/admin/content/solution-categories', icon: 'Tags', label: P('solutionCategories'), permission: 'manage-content' },
  { key: 'postCategories', path: '/admin/content/post-categories', icon: 'Tags', label: P('postCategories'), permission: 'manage-content' },
  { key: 'team', path: '/admin/content/team', icon: 'UsersRound', label: P('team'), permission: 'manage-content' },
  { key: 'testimonials', path: '/admin/content/testimonials', icon: 'Quote', label: P('testimonials'), permission: 'manage-content' },
  { key: 'faqs', path: '/admin/content/faqs', icon: 'CircleHelp', label: P('faqs'), permission: 'manage-content' },
  { key: 'pricing', path: '/admin/content/pricing', icon: 'CreditCard', label: P('pricing'), permission: 'manage-content' },
]

export const inboxNav = [
  { key: 'quotes', path: '/admin/inbox/quotes', icon: 'FileText', label: P('quotes'), permission: 'manage-inbox' },
  { key: 'contactMessages', path: '/admin/inbox/messages', icon: 'Mail', label: P('messages'), permission: 'manage-inbox' },
  { key: 'newsletter', path: '/admin/inbox/newsletter', icon: 'Send', label: P('subscribers'), permission: 'manage-inbox' },
]

export default resources
