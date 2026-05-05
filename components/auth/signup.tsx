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

export default function Signup() {
    const handleSignup = async (e: any) => {
        e.preventDefault();
        const name = e.target[0]?.value
        const email = e.target[1]?.value
        const password = e.target[2]?.value
        console.log(email, password)

        if (!email || !password || !name) {
            toast.error("Please enter all Fields")
            return;
        }

        const {data, error} = await client.auth.signUp({
            email,
            password,
            options: {
              data: {
                name
              }
            }
        });

        if (data) {
            toast.success('success. Please confirm your Email then login')
            
        }

        if (error) {
            toast.error('Unable to sign up. Please try again.')
        }
    }
  return (
    <Card className="w-full max-w-[400px]">
      
      <CardHeader>
        <CardTitle className="text-[#172b4d] text-xl font-bold">
          Signup
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignup} className="space-y-5">


          <div className="space-y-2">
            <Label className="text-[1rem]" htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John wo"
            />
          </div>

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
            Signup
          </Button>

        </form>
      </CardContent>

    </Card>
  )
}