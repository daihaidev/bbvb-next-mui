import theme from '../../theme/palette'

export const PERFORMANCE_STATS = [
  {
    title: 'Net Asset Value',
    value: 46670,
    isPercentage: false,
    performance: 'positive',
  },
  {
    title: 'Benchmark Price',
    value: 32670,
    isPercentage: false,
    performance: 'positive',
  },
  {
    title: 'Daily Performance in $',
    value: 2670,
    isPercentage: false,
    performance: 'positive',
  },
  {
    title: 'Daily Performance by %',
    value: 38,
    isPercentage: true,
    performance: 'positive',
  },
  {
    title: 'Daily Active vs Benchmark by %',
    value: 2.58,
    isPercentage: true,
    performance: 'positive',
  },
]

export const TIME_PERIOD_TOGGLE_OPTIONS = [
  {
    title: 'YTD',
    value: 'yearToDate',
  },
  {
    title: 'MTD',
    value: 'monthToDate',
  },
  {
    title: '1Y',
    value: 'yearly',
  },
  {
    title: '1M',
    value: 'monthly',
  },
  {
    title: '1W',
    value: 'weekly',
  },
]

export const VALUE_TOGGLE_OPTIONS = [
  {
    title: '$',
    value: 'dollar',
  },
  {
    title: '%',
    value: 'percentage',
  },
]

export const MOCK_CHART_LABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
export const MOCK_STRATEGY_CHART_LABELS = ['Cash', 'Fixed Income', 'Growth', 'Shooting Star', 'Undervalued']
export const MOCK_COMPANY_CHART_LABELS = [
  'Consumer Disc.',
  'Consumer Staples',
  'Energy',
  'Financials',
  'Healthcare',
  'Industrials',
  'Materials',
  'Comms',
  'Utilities',
  'Technology',
  'Real Estate',
  'Cash',
  'Others',
]

export const MOCK_CHART_DATA_FOR_PORTFOLIO = [
  260,
  298,
  163,
  47,
  123,
  181,
  225,
  18,
  66,
  160,
  141,
  162,
  93,
  209,
  83,
  38,
  243,
  52,
  95,
  199,
  14,
  130,
  12,
  144,
  114,
  161,
  104,
  169,
  241,
  127,
  203,
  145,
]

export const MOCK_CHART_DATA_FOR_BENCHMARK = [
  106,
  59,
  200,
  207,
  288,
  275,
  126,
  82,
  282,
  267,
  79,
  88,
  226,
  178,
  291,
  63,
  138,
  137,
  74,
  132,
  117,
  139,
  122,
  65,
  198,
  37,
  28,
  256,
  168,
  176,
  26,
]

export const MOCK_CHART_DATA_FOR_ACTIVE = [
  184,
  185,
  24,
  89,
  263,
  172,
  23,
  100,
  281,
  13,
  149,
  269,
  71,
  223,
  216,
  213,
  296,
  265,
  280,
  258,
  262,
  239,
  120,
  107,
  112,
  155,
  249,
  287,
  157,
  236,
  197,
]

export const CHART_COLOR = {
  negative: theme.error.main,
}

export const CHART_TYPE_TABS = [
  {
    title: 'Overview',
    color: '',
    chartData: [],
  },
  {
    title: 'Portfolio',
    color: theme.secondary.main,
    chartData: MOCK_CHART_DATA_FOR_PORTFOLIO,
  },

  {
    title: 'Benchmark',
    color: theme.text.primary,
    chartData: MOCK_CHART_DATA_FOR_BENCHMARK,
  },

  {
    title: 'Active',
    color: theme.primary.main,
    chartData: MOCK_CHART_DATA_FOR_ACTIVE,
  },
]

export const MOCK_CHART_LABELS_FOR_MTD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']

export const MOCK_CHART_LABELS_FOR_YEAR = [
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
]

export const MOCK_CHART_LABELS_FOR_MONTH = [
  'June 14',
  'June 15',
  'June 16',
  'June 17',
  'June 18',
  'June 19',
  'June 20',
  'June 21',
  'June 22',
  'June 23',
  'June 24',
  'June 25',
  'June 26',
  'June 27',
  'June 28',
  'June 29',
  'June 30',
  'June 31',
  'July 1',
  'July 2',
  'July 3',
  'July 4',
  'July 5',
  'July 6',
  'July 7',
  'July 8',
  'July 9',
  'July 10',
  'July 11',
  'July 12',
  'July 13',
]

export const MOCK_CHART_LABELS_FOR_WEEK = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']

export const MOCK_CHART_DATA_FOR_STRATEGY = {
  color: theme.primary.main,
  YTD: [184, 185, 24, 89, 263],
  MTD: [23, 100, 281, 13, 149],
  TY: [216, 213, 296, 265, 280],
  TM: [262, 239, 120, 107, 112],
  TW: [198, 37, 28, 256, 168],
}

export const MOCK_CHART_DATA_FOR_COMPANY_PORTFOLIO = {
  color: theme.primary.main,
  YTD: [184, 185, -24, 89, 263, -23, 100, -281, 13, 149, 37, 28, 256],
  MTD: [262, -239, -120, 107, -112, 23, 100, 281, 13, 149, 280, -198, 37],
  TY: [216, -213, -296, 265, 280, -198, 37, 28, 256, 168, -112, 107, 112],
  TM: [262, 239, -120, -107, -112, 107, 112, 23, 100, 281, -24, 89, 263],
  TW: [198, 37, 28, 256, 168, 24, 89, 263, -23, -100, -120, 107, -112],
}

export const MOCK_CHART_DATA_FOR_COMPANY_BENCHMARK = {
  color: theme.primary.main,
  YTD: [198, 37, 28, 256, 168, 24, 89, 263, -23, -100, -120, 107, -112],
  MTD: [184, 185, -24, 89, 263, -23, 100, -281, 13, 149, 37, 28, 256],
  TY: [262, -239, -120, 107, -112, 23, 100, 281, 13, 149, 280, -198, 37],
  TM: [216, -213, -296, 265, 280, -198, 37, 28, 256, 168, -112, 107, 112],
  TW: [262, 239, -120, -107, -112, 107, 112, 23, 100, 281, -24, 89, 263],
}

export const CHART_TYPE = {
  bar: 'BAR',
  line: 'LINE',
}

export const CHART_TYPE_TABS_FOR_COMPANY = [
  {
    title: 'Portfolio',
    color: theme.primary.main,
    chartData: MOCK_CHART_DATA_FOR_COMPANY_PORTFOLIO,
  },
  {
    title: 'Benchmark',
    color: theme.primary.main,
    chartData: MOCK_CHART_DATA_FOR_COMPANY_BENCHMARK,
  },
]

export const MONTHS_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const ModeEnum = {
  LAST_WEEK: 'LastWeek',
  LAST_MONTH: 'LastMonth',
  LAST_6_MONTHS: 'Last6Months',
  VIEW_ALL: 'ViewAll',
}

export enum DateFormatEnum {
  BY_DATE = 'YYYY-MM-DD',
  BY_MONTH = 'YYYY-MM',
  BY_WEEK = 'YYYY-WW',
}

export enum IntervalTypeEnum {
  YEARS = 'years',
  MONTHS = 'months',
  WEEKS = 'weeks',
  DAYS = 'days',
}

export const DEFAULT_TOTALS_AND_AVERAGES = {
  avgBeta: 0,
  totalDivYld: 0,
  totalTradedValue: 0,
  totalMarketValue: 0,
  nav: 0,
  totalGainLoss: 0,
  totalCashValue: 0,
  totalCashValuePercent: 0,
  totalWeightedBeta: 0,
  totalWeightedDivYld: 0,
  totalGainLossPercent: 0,
  totalWeight: 0,
}
