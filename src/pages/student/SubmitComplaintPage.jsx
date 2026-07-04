import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { FileUpload } from "@/components/ui/FileUpload"
import { createComplaint } from "@/api/complaints.api"
import api from "@/api/axios"

const complaintSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters"),
  department: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  isAnonymous: z.boolean().default(false),
})

const SubmitComplaintPage = () => {
  const navigate = useNavigate()
  const [files, setFiles] = React.useState([])
  
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data } = await api.get('/departments')
      return data.data.map(d => ({ value: d._id, label: d.name }))
    }
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories')
      return data.data.map(c => ({ value: c._id, label: c.name }))
    }
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      subject: "",
      description: "",
      priority: "medium",
      isAnonymous: false,
    }
  })

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      
      // Append text data
      Object.keys(data).forEach(key => {
        if (data[key]) formData.append(key, data[key])
      })
      
      // Append files
      files.forEach(file => {
        formData.append('attachments', file)
      })

      const res = await createComplaint(formData)
      
      if (res.success) {
        toast.success("Complaint submitted successfully!")
        navigate(`/student/complaints/${res.data._id}`)
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit complaint")
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submit Complaint</h1>
        <p className="text-muted-foreground">Please provide detailed information about your issue.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject <span className="text-destructive">*</span></label>
              <Input 
                placeholder="Brief summary of the issue"
                {...register("subject")}
                error={errors.subject?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select 
                  options={departments || []}
                  placeholder="Select Department"
                  {...register("department")}
                  error={errors.department?.message}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  options={categories || []}
                  placeholder="Select Category"
                  {...register("category")}
                  error={errors.category?.message}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select 
                options={[
                  { value: 'low', label: 'Low - General inquiry' },
                  { value: 'medium', label: 'Medium - Standard issue' },
                  { value: 'high', label: 'High - Affects academics' },
                  { value: 'urgent', label: 'Urgent - Emergency' },
                ]}
                {...register("priority")}
                error={errors.priority?.message}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description <span className="text-destructive">*</span></label>
              <Textarea 
                placeholder="Please describe your complaint in detail..."
                className="min-h-[150px]"
                {...register("description")}
                error={errors.description?.message}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Attachments (Optional)</label>
              <FileUpload 
                multiple
                accept="image/jpeg,image/png,application/pdf"
                onChange={setFiles}
              />
              <p className="text-xs text-muted-foreground">Max 5 files. Allowed: JPG, PNG, PDF. Max 5MB per file.</p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="isAnonymous"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                {...register("isAnonymous")}
              />
              <label htmlFor="isAnonymous" className="text-sm font-medium">
                Submit anonymously (Your identity will be hidden from the resolving department)
              </label>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Submit Complaint
              </Button>
            </div>
            
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SubmitComplaintPage
