import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react'

export default function SalesPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-blue-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
            <DollarSign className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱5,200</div>
            <p className="text-xs opacity-80">+8.2% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱2,150</div>
            <p className="text-xs text-muted-foreground">Net profit today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales Today</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>RS-X3 Puzzle</TableCell>
                <TableCell>Juan Dela Cruz</TableCell>
                <TableCell>₱2,200</TableCell>
                <TableCell className="text-green-600">₱850</TableCell>
                <TableCell>Feb 7, 2026 · 10:32 AM</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700">Paid</Badge>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Air Max 90</TableCell>
                <TableCell>Maria Santos</TableCell>
                <TableCell>₱3,000</TableCell>
                <TableCell className="text-green-600">₱1,300</TableCell>
                <TableCell>Feb 7, 2026 · 1:10 PM</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700">Paid</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Optional Insights Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱72.22</div>
            <p className="text-xs text-muted-foreground">Based on today’s sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Product Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">RS-X3 Puzzle</div>
            <p className="text-xs text-muted-foreground">Highest revenue & profit</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
