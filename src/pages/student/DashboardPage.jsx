import * as React from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Skeleton } from "@/components/ui/Skeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { formatDate } from "@/utils/formatters"
import api from "@/api/axios"

const fetchDashboardData = async () => {
  const { data } = await api.get('/complaints', { params: { limit: 5 } })
  return data.data
}

const StudentDashboard = () => {
  const { data: recentComplaints, isLoading, error } = useQuery({
    queryKey: ['student-recent-complaints'],
    queryFn: fetchDashboardData
  })

  // Calculate stats (in a real app, backend should provide this)
  const stats = React.useMemo(() => {
    if (!recentComplaints) return { total: 0, pending: 0, resolved: 0 }
    
    return {
      total: recentComplaints.length, // Mock data, would be actual total
      pending: recentComplaints.filter(c => ['submitted', 'under_review', 'assigned'].includes(c.status)).length,
      resolved: recentComplaints.filter(c => c.status === 'resolved' || c.status === 'closed').length
    }
  }, [recentComplaints])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your activity.</p>
        </div>
        <Link to="/student/submit">
          <Button>Submit New Complaint</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <Link to="/student/complaints">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8 text-destructive">
              <AlertCircle className="h-6 w-6 mr-2" />
              Failed to load recent activity
            </div>
          ) : recentComplaints?.length === 0 ? (
            <EmptyState 
              title="No complaints yet" 
              description="You haven't submitted any complaints. Click the button above to get started."
              actionLabel="Submit Complaint"
              onAction={() => window.location.href = '/student/submit'}
            />
          ) : (
            <div className="space-y-8">
              {recentComplaints?.map(complaint => (
                <div key={complaint._id} className="flex items-center">
                  <div className="ml-4 space-y-1 w-full flex justify-between items-center">
                    <div>
                      <Link 
                        to={`/student/complaints/${complaint._id}`}
                        className="text-sm font-medium leading-none hover:underline"
                      >
                        {complaint.subject}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {complaint.complaintId} • {formatDate(complaint.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block text-sm text-muted-foreground">
                        {complaint.department?.name || 'General'}
                      </div>
                      <StatusBadge status={complaint.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentDashboard
