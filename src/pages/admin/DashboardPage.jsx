import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { FileText, Clock, CheckCircle2, TrendingUp, Users } from "lucide-react"
import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { formatDate } from "@/utils/formatters"
import api from "@/api/axios"

const AdminDashboard = () => {
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/overview')
      return data.data
    }
  })

  const { data: recentComplaints, isLoading: complaintsLoading } = useQuery({
    queryKey: ['admin-recent-complaints'],
    queryFn: async () => {
      const { data } = await api.get('/complaints', { params: { limit: 5 } })
      return data.data
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground">Monitor system-wide complaints and metrics.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewLoading ? <Skeleton className="h-8 w-12" /> : overview?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewLoading ? <Skeleton className="h-8 w-12" /> : overview?.pending || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires assignment/review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewLoading ? <Skeleton className="h-8 w-12" /> : overview?.inProgress || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently being handled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewLoading ? <Skeleton className="h-8 w-12" /> : overview?.resolved || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully closed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 lg:col-span-5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Complaints</CardTitle>
            <Link to="/admin/complaints">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {complaintsLoading ? (
               <div className="space-y-4">
                 {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
               </div>
            ) : (
              <div className="space-y-4">
                {recentComplaints?.map(complaint => (
                  <div key={complaint._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <Link 
                        to={`/admin/complaints/${complaint._id}`}
                        className="font-medium hover:underline"
                      >
                        {complaint.subject}
                      </Link>
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <span>{complaint.complaintId}</span>
                        <span>•</span>
                        <span>{formatDate(complaint.createdAt)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {complaint.isAnonymous ? 'Anonymous' : complaint.student?.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={complaint.status} />
                      <StatusBadge status={complaint.priority} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Placeholder for future Quick Actions / Tasks component */}
        <Card className="md:col-span-3 lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/admin/complaints'}>
              Review Pending Complaints
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/admin/departments'}>
              Manage Departments
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/admin/students'}>
              View Student Directory
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
