import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useAuth } from "@/contexts/AuthContext"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || "/"

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  })

  const onSubmit = async (data) => {
    try {
      const res = await login(data)
      if (res.success) {
        toast.success("Welcome back!")
        // The AppRouter and ProtectedRoute will automatically handle redirecting based on role,
        // but we can also forcefully navigate if they were trying to access a specific page.
        navigate(from === "/" ? (res.data.user.role === 'student' ? '/student' : '/admin') : from, { replace: true })
      }
    } catch (error) {
      toast.error(error.message || "Failed to log in")
    }
  }

  return (
    <Card className="w-full border-none shadow-none bg-transparent sm:bg-card sm:shadow-sm sm:border-solid">
      <CardHeader className="space-y-1 px-0 sm:px-6">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">
              Email
            </label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m.student@university.edu"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              {...register("password")}
              error={errors.password?.message}
            />
          </div>
          <Button className="w-full" type="submit" isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="px-0 sm:px-6 flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Register here
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default LoginPage
