import * as React from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { ArrowLeft, Paperclip, Send, Clock, User, Building, FileText } from "lucide-react"
import { toast } from "react-hot-toast"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Skeleton } from "@/components/ui/Skeleton"
import { Textarea } from "@/components/ui/Textarea"
import { Avatar } from "@/components/ui/Avatar"
import { formatDate, formatDateTime } from "@/utils/formatters"
import api from "@/api/axios"
import { useAuth } from "@/contexts/AuthContext"

const ComplaintDetailPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, reset } = useForm()

  const { data: complaintData, isLoading } = useQuery({
    queryKey: ['complaint', id],
    queryFn: async () => {
      const { data } = await api.get(`/complaints/${id}`)
      return data.data
    }
  })

  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['complaint-messages', id],
    queryFn: async () => {
      const { data } = await api.get(`/messages/complaint/${id}`)
      return data.data
    },
    refetchInterval: 10000 // Simple polling every 10s
  })

  const sendMessage = useMutation({
    mutationFn: async (data) => {
      const payload = {
        complaint: id,
        receiver: complaintData?.assignedTo?._id || complaintData?.student?._id, // Simplification for demo
        content: data.content
      }
      return api.post('/messages', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['complaint-messages', id])
      reset()
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message")
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  const complaint = complaintData
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={isAdmin ? "/admin/complaints" : "/student/complaints"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{complaint.subject}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            {complaint.complaintId} <span className="opacity-50">•</span> {formatDate(complaint.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details & Messages */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b bg-muted/20 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Description</CardTitle>
                <div className="flex gap-2">
                  <StatusBadge status={complaint.status} />
                  <StatusBadge status={complaint.priority} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {complaint.description}
              </p>
              
              {complaint.attachments && complaint.attachments.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Paperclip className="h-4 w-4" /> Attachments
                  </h4>
                  <div className="flex gap-4 flex-wrap">
                    {complaint.attachments.map((file, i) => (
                      <a 
                        key={i} 
                        href={`http://localhost:5000${file.url}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 p-2 rounded border hover:bg-muted transition-colors text-sm"
                      >
                        <FileText className="h-4 w-4 text-primary" />
                        {file.originalName}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communicate securely regarding this issue.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto p-2">
                {messagesLoading ? (
                  <div className="text-center text-sm text-muted-foreground py-4">Loading messages...</div>
                ) : messagesData?.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-8">No messages yet. Start the conversation!</div>
                ) : (
                  messagesData?.map(msg => {
                    const isMine = msg.sender._id === user._id
                    return (
                      <div key={msg._id} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : ''}`}>
                        <Avatar src={msg.sender.avatar} alt={msg.sender.name} size="sm" />
                        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[70%]`}>
                          <div className={`px-4 py-2 rounded-2xl text-sm ${isMine ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-muted-foreground mt-1">
                            {formatDateTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <form 
                onSubmit={handleSubmit(d => sendMessage.mutate(d))}
                className="flex items-end gap-2 pt-4 border-t"
              >
                <div className="flex-1">
                  <Textarea 
                    placeholder="Type a message..."
                    className="min-h-[60px] resize-none"
                    {...register("content", { required: true })}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-10 w-10 shrink-0 rounded-full"
                  isLoading={sendMessage.isPending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Meta & Timeline */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Reporter</p>
                  <p className="text-sm text-muted-foreground">
                    {complaint.isAnonymous ? 'Anonymous' : complaint.student?.name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Department</p>
                  <p className="text-sm text-muted-foreground">
                    {complaint.department?.name || 'Unassigned'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Assigned Admin</p>
                  <p className="text-sm text-muted-foreground">
                    {complaint.assignedTo?.name || 'Pending Assignment'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-muted ml-3 space-y-6">
                {complaint.timeline?.map((event, index) => (
                  <div key={index} className="relative pl-6">
                    <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        Status changed to <span className="capitalize">{event.status.replace('_', ' ')}</span>
                      </span>
                      <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatDateTime(event.createdAt)}
                      </span>
                      {event.note && (
                        <span className="text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded-md">
                          {event.note}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ComplaintDetailPage
