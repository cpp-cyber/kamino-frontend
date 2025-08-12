"use client"

import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  
  return (
    <div className="grid min-h-svh lg:grid-cols-2 overflow-hidden">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 text-lg font-bold">
            <Image src="/kaminoLogo.svg" alt="Logo" width={40} height={40} className="size-10" />
            Kamino
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block overflow-hidden">
        <Image
          src="/kaminoLogo.svg"
          alt="Image"
          width={500}
          height={500}
          className="absolute inset-0 w-[115%] h-[115%] object-cover opacity-15 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 0 }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-8 overflow-hidden">
          <div className="w-full max-w-md">
              <h1 className="text-5xl md:text-6xl font-bold mb-12">Kamino</h1>
            <p className="text-lg text-foreground/60">
              This application empowers you to rapidly spin up and delete Pods of virtual machines hosted on the
              <Button variant="link" className="p-0 text-lg text-foreground/60">
              <Link
                href="https://www.cpp.edu/cba/digital-innovation/about-us.shtml"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mitchell C. Hill Student Data Center (SDC)
              </Link>
              </Button>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
