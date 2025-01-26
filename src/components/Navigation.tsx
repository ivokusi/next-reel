"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Home, LogOut, Plus, Send, User } from "lucide-react";
import Link from "next/link";

export default function Navigation() {

    const { user } = useUser();

    return (

        <div className="w-full h-[65px] flex-none">
            <div className="w-[99%] mx-auto h-full flex items-center justify-between px-4">
                <Link href="/feed">
                    <Home className="hover:text-[#fd3e3e]" />
                </Link>
                <Input type="text" placeholder="Search..." className="h-[30px] w-[350px]" />
                <div className="flex items-center justify-center gap-4">
                    <Button variant="magenta_outline" className="h-[30px]" >
                        <div className="flex items-center justify-center gap-2">
                            <Plus />
                            CREATE
                        </div>
                    </Button>
                    <Button variant="cyan_outline" className="h-[30px]">
                        <Send />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="h-[30px] w-[30px]">
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