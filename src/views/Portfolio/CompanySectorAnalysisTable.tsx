import React from 'react'
import { startCase, lowerCase } from 'lodash'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  Paper,
  Toolbar,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'
import printPercentage from '../../utils/printPercentage'
import CircularLoader from '../../components/CircularLoader'

const useStyles = makeStyles<Theme>((theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(1),
  },
  tableHead: {
    '& > .MuiTableRow-root': {
      backgroundColor: theme.palette.background.lightGrey,
      '& > .MuiTableCell-root': {
        borderBottom: 'none',
        padding: theme.spacing(1),
        fontSize: theme.typography.pxToRem(14),
        color: theme.palette.text.tertiary,
      },
    },
  },
  tableRowWrapper: {
    '& > .MuiTableCell-root': {
      borderBottom: 'none',
      borderTop: `1px solid ${theme.palette.border.main}`,
      padding: theme.spacing(1),
      fontSize: theme.typography.pxToRem(14),
      fontWeight: 500,
      '& > :not(:first-child)': {
        fontWeight: 400,
      },
    },
  },
}))

interface SectorAnalysis {
  sector: string
  port?: number
  bench?: number
  active?: number
  absReturns?: number
}

interface CompanySectorAnalysisProps {
  loading: boolean
  sectorsAnalysis: SectorAnalysis[]
  className?: string
}

const CompanySectorAnalysis: React.FC<CompanySectorAnalysisProps> = (props) => {
  const classes = useStyles()
  const { loading, sectorsAnalysis, className } = props

  return (
    <CircularLoader loading={loading}>
      <Paper elevation={0} className={className}>
        <Toolbar disableGutters className={classes.toolbar}>
          <Typography variant="h5">Company Sector Analysis</Typography>
        </Toolbar>
        <TableContainer>
          <Table>
            {/* Header */}
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell>Company Sector</TableCell>
                <TableCell>Portfolio (%)</TableCell>
                <TableCell>Benchmark (%)</TableCell>
                <TableCell>Active (%)</TableCell>
                <TableCell>Portfolio Returns (%)</TableCell>
              </TableRow>
            </TableHead>

            {/* Body */}
            <TableBody>
              {sectorsAnalysis?.map((sectorsAnalysis) => {
                const { sector, port, bench, active, absReturns } = sectorsAnalysis

                return (
                  <TableRow className={classes.tableRowWrapper}>
                    <TableCell>{startCase(lowerCase(sector.replace('_', ' ')))}</TableCell>
                    <TableCell>{printPercentage(port)}</TableCell>
                    <TableCell>{printPercentage(bench)}</TableCell>
                    <TableCell>{printPercentage(active)}</TableCell>
                    <TableCell>{printPercentage(absReturns)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </CircularLoader>
  )
}

export default CompanySectorAnalysis
