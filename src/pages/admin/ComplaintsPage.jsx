import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Filter, Search } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Pagination } from "@/components/ui/Pagination"
import { EmptyState } from "@/components/ui/EmptyState"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/Table"
import { formatDate } from "@/utils/formatters"
import api from "@/api/axios"

const AdminComplaintsPage = () => {
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("")
  const [priorityFilter, setPriorityFilter] = React.useState("")

  const { data, isLoading } = useQuery({
    queryKey: ['admin-complaints', page, search, statusFilter, priorityFilter],
    queryFn: async () => {
      const { data } = await api.get('/complaints', {
        params: {
          page,
          limit: 15,
          search: search || undefined,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined
        }
      })
      return data
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Complaints</h1>
          <p className="text-muted-foreground">Review, assign, and resolve student complaints.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/20">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="w-full sm:w-72 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by ID, subject, or description..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <Select 
                className="w-full sm:w-[160px]"
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
                  { value: "assigned", label: "Assigned" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "resolved", label: "Resolved" },
                  { value: "rejected", label: "Rejected" },
                ]}
              />
              <Select 
                className="w-full sm:w-[160px]"
                placeholder="All Priorities"
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value)
                  setPage(1)
                }}
                options={[
                  { value: "", label: "All Priorities" },
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
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
                <TableHead>Student</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /><div className="h-3 w-24 bg-muted animate-pulse rounded mt-2" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-6 w-20 bg-muted animate-pulse rounded-full" /></TableCell>
                    <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded-full" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyState 
                      title="No complaints found"
                      description="Try adjusting your search or filters."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((complaint) => (
                  <TableRow key={complaint._id}>
                    <TableCell>
                      <Link to={`/admin/complaints/${complaint._id}`} className="font-medium hover:underline text-primary">
                        {complaint.subject}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-1">
                        {complaint.complaintId}
                      </div>
                    </TableCell>
                    <TableCell>
                      {complaint.isAnonymous ? (
                        <span className="text-muted-foreground italic">Anonymous</span>
                      ) : (
                        <div>
                          <div className="font-medium">{complaint.student?.name}</div>
                          <div className="text-xs text-muted-foreground">{complaint.student?.studentId}</div>
                        </div>
                      )}
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
          
          {data?.pagination && (
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

export default AdminComplaintsPage
