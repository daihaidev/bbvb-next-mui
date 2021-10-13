import theme from '../../theme/palette'

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
  {
    title: 'Custom',
    value: 'custom',
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

export const MOCK_CHART_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
export const MOCK_TOP_FIVE_CHART_LABELS = ['MSB', 'SPK', 'IGLNI', 'SIA', 'MEZ']

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
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
]

export const MOCK_CHART_LABELS_FOR_MONTH = [
  'Jun 14',
  'Jun 15',
  'Jun 16',
  'Jun 17',
  'Jun 18',
  'Jun 19',
  'Jun 20',
  'Jun 21',
  'Jun 22',
  'Jun 23',
  'Jun 24',
  'Jun 25',
  'Jun 26',
  'Jun 27',
  'Jun 28',
  'Jun 29',
  'Jun 30',
  'Jun 31',
  'Jul 1',
  'Jul 2',
  'Jul 3',
  'Jul 4',
  'Jul 5',
  'Jul 6',
  'Jul 7',
  'Jul 8',
  'Jul 9',
  'Jul 10',
  'Jul 11',
  'Jul 12',
  'Jul 13',
]

export const MOCK_CHART_LABELS_FOR_WEEK = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu']

export const MOCK_CHART_DATA_FOR_TOP_FIVE = [
  { data: [60692.85, 34670.2, 22862.29, 14670.2, 22670.2], color: theme.primary.main },
]

export const MOCK_CHART_DATA_FOR_RISK_BETA_LANDSCAPE = [
  {
    label: 'IGLNI',
    color: theme.chart.red,
    data: [
      {
        x: 0.4,
        y: 25,
        r: 15,
      },
    ],
  },
  {
    label: 'MSB',
    color: theme.chart.yellow,
    data: [
      {
        x: 0.5,
        y: 40,
        r: 10,
      },
    ],
  },
  {
    label: 'YTP',
    color: theme.chart.orange,
    data: [
      {
        x: 0.1,
        y: 10,
        r: 40,
      },
    ],
  },
  {
    label: 'TIA',
    color: theme.chart.green,
    data: [
      {
        x: 0.9,
        y: 12,
        r: 20,
      },
    ],
  },
  {
    label: 'SIA',
    color: theme.text.secondary,
    data: [
      {
        x: 0.6,
        y: 30,
        r: 60,
      },
    ],
  },
  {
    label: 'SPK',
    color: theme.chart.blue,
    data: [
      {
        x: 0.8,
        y: 34,
        r: 40,
      },
    ],
  },
  {
    label: 'MEZ',
    color: theme.chart.darkGreen,
    data: [
      {
        x: 0.7,
        y: 23,
        r: 50,
      },
    ],
  },
  {
    label: 'RQK',
    color: theme.chart.lightBlue,
    data: [
      {
        x: 0.3,
        y: 15,
        r: 80,
      },
    ],
  },
]

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
