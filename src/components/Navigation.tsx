"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Home, LogOut, Plus, Send, Settings, User } from "lucide-react";
import Link from "next/link";

const size = "30px";

export default function Navigation() {

    const { user } = useUser();

    return (

        <div className="w-screen h-[65px] flex flex-col items-center justify-between">
            <div className="w-[99%] h-full flex items-center justify-between px-4">
                <Link href="/feed">
                    <Home className="hover:text-[#4de8f4]" />
                </Link>
                <Input type="text" placeholder="Search..." className={`h-[${size}] w-[350px]`} />
                <div className="flex items-center justify-center gap-4">
                    <Button variant="magenta_outline" className={`h-[${size}]`} >
                        <Plus />
                        CREATE
                    </Button>
                    <Button variant="cyan" className={`h-[${size}]`}>
                        <Send />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className={`h-[${size}] w-[${size}]`}>
                                <AvatarImage src={user?.imageUrl} />
                                <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" >
                            <DropdownMenuItem className="hover:text-[#4de8f4]">
                                <Link href="/profile">
                                    <div className="flex items-center justify-center gap-2">
                                        <User className="size-5" />
                                        Profile
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:text-[#4de8f4]">
                                <SignOutButton>
                                    <div className="flex items-center justify-center gap-2">
                                        <LogOut className="size-5" />
                                        Sign Out
                                    </div>
                                </SignOutButton>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <Separator className="w-[99%]"/>
        </div>

    )

}