export interface TickerItem {
  tag: string
  text: string
}

export interface LeadData {
  kicker: string
  title: string
  dek: string
  author: string
  role: string
  initials: string
  readTime: string
  tag: string
  image?: string
}

export interface TabItem {
  id: string
  num: string
  label: string
}

export interface NewsItem {
  n: string
  title: string
  blurb: string
  cat: string
  time: string
  slug?: string
}

export interface ReviewItem {
  title: string
  studio: string
  platforms: string[]
  score: number
  pull: string
  author: string
  hours: string
  hot: boolean
  slug?: string
  issue?: string
  image?: string
}

export interface PollOption {
  label: string
  pct: number
}

export interface PollData {
  question: string
  options: PollOption[]
  total: string
  closes: string
}

export interface CalendarItem {
  day: string
  date: string
  title: string
  sub: string
  platform: string
}

export interface SpotlightData {
  kicker: string
  title: string
  blurb: string
  dev: string
  price: string
  platforms: string
  runtime: string
  image?: string
}

export interface ReactionItem {
  glyph: string
  label: string
  count: number
  key: string
}

export interface CommentItem {
  name: string
  handle: string
  time: string
  initials: string
  body: string
  replies: number
  likes: number
}

export interface IssueData {
  issue: {
    number: string
    date: string
    weekday: string
    volume: string
    subscribers: string
    weather: string
    location: string
    readTime: string
  }
  ticker: TickerItem[]
  lead: LeadData
  tabs: TabItem[]
  poll: PollData
  calendar: CalendarItem[]
  spotlight: SpotlightData
  reactions: ReactionItem[]
  comments: CommentItem[]
  // Loaded from markdown files, not stored in the issue JSON
  news: NewsItem[]
  reviews: ReviewItem[]
}
