import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Search } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Pagination } from "@/components/ui/Pagination"
import { EmptyState } from "@/components/ui/EmptyState"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/Table"
import { formatDate } from "@/utils/formatters"
import api from "@/api/axios"
import { Button } from "@/components/ui/Button"

const StudentComplaintsPage = () => {
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("")

  const { data, isLoading } = useQuery({
    queryKey: ['student-complaints', page, search, statusFilter],
    queryFn: async () => {
      const { data } = await api.get('/complaints', {
        params: {
          page,
          limit: 10,
          search: search || undefined,
          status: statusFilter || undefined,
        }
      })
      return data
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Complaints</h1>
          <p className="text-muted-foreground">Track the status of your submitted complaints.</p>
        </div>
        <Link to="/student/submit">
          <Button>Submit New</Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/20">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="w-full sm:w-72 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search subject or ID..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <div className="w-full sm:w-auto">
              <Select 
                className="w-full sm:w-[180px]"
                placeholder="All Statuses"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "submitted", label: "Submitted" },
                  { value: "under_review", label: "Under Review" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "resolved", label: "Resolved" },
                  { value: "closed", label: "Closed" },
                ]}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID / Subject</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Submitted On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-48 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-6 w-20 bg-muted animate-pulse rounded-full" /></TableCell>
                    <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded-full" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <EmptyState 
                      title="No complaints found"
                      description={search || statusFilter ? "Try adjusting your filters." : "You haven't submitted any complaints yet."}
                      actionLabel={!search && !statusFilter ? "Submit Complaint" : undefined}
                      onAction={!search && !statusFilter ? () => window.location.href = '/student/submit' : undefined}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((complaint) => (
                  <TableRow key={complaint._id}>
                    <TableCell>
                      <Link to={`/student/complaints/${complaint._id}`} className="font-medium hover:underline text-primary">
                        {complaint.subject}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-1">
                        {complaint.complaintId}
                      </div>
                    </TableCell>
                    <TableCell>{complaint.department?.name || 'General'}</TableCell>
                    <TableCell><StatusBadge status={complaint.status} /></TableCell>
                    <TableCell><StatusBadge status={complaint.priority} /></TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatDate(complaint.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {data?.pagination && data.pagination.pages > 1 && (
            <div className="border-t p-4">
              <Pagination 
                currentPage={data.pagination.page}
                totalPages={data.pagination.pages}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentComplaintsPage
