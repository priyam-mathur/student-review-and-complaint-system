import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useAuth } from "@/contexts/AuthContext"
import api from "@/api/axios"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  studentId: z.string().min(3, "Student ID is required"),
  department: z.string().min(1, "Please select a department"),
})

const RegisterPage = () => {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [departments, setDepartments] = React.useState([])
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", studentId: "", department: "" }
  })

  React.useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get('/departments')
        if (data.success) {
          setDepartments(data.data.map(d => ({ value: d._id, label: d.name })))
        }
      } catch (error) {
        console.error("Failed to load departments")
      }
    }
    fetchDepartments()
  }, [])

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data)
      if (res.success) {
        toast.success("Account created successfully!")
        navigate('/student')
      }
    } catch (error) {
      toast.error(error.message || "Failed to create account")
    }
  }

  return (
    <Card className="w-full border-none shadow-none bg-transparent sm:bg-card sm:shadow-sm sm:border-solid">
      <CardHeader className="space-y-1 px-0 sm:px-6">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your student account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="name">
              Full Name
            </label>
            <Input 
              id="name" 
              placeholder="John Doe"
              {...register("name")}
              error={errors.name?.message}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="studentId">
                Student ID
              </label>
              <Input 
                id="studentId" 
                placeholder="2023CS001"
                {...register("studentId")}
                error={errors.studentId?.message}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="department">
                Department
              </label>
              <Select 
                id="department"
                options={departments}
                placeholder="Select Department"
                {...register("department")}
                error={errors.department?.message}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">
              University Email
            </label>
            <Input 
              id="email" 
              type="email" 
              placeholder="j.doe@university.edu"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">
              Password
            </label>
            <Input 
              id="password" 
              type="password" 
              {...register("password")}
              error={errors.password?.message}
            />
          </div>
          
          <Button className="w-full" type="submit" isLoading={isSubmitting}>
            Create Account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="px-0 sm:px-6 flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default RegisterPage
