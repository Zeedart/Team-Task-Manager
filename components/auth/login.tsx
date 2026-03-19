"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

import client from "@/api/client"

import {toast} from "sonner"

export default function Login() {
    const handleLogin = async (e: any) => {
        e.preventDefault();
        const email = e.target[0]?.value
        const password = e.target[1]?.value
        console.log(email, password)

        if (!email || !password) {
            toast.error("Please enter email and password")
            return;
        }

        const {data, error} = await client.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            toast.error('Unable to Login. Please try again.')
        }
    }
  return (
    <Card className="w-[400px]">
      
      <CardHeader>
        <CardTitle className="text-[#172b4d] text-xl font-bold">
          Login
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-5">

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[1rem]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[1rem]" htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1868db] hover:bg-[#1557b0]"
          >
            Login
          </Button>

        </form>
      </CardContent>

    </Card>
  )
}