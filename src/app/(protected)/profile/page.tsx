"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Edit, Heart, MessageCircle, Plus, Share, Trash } from "lucide-react";
import Link from "next/link";

const videoAspectRatio = "w-[225px] h-[400px]"

type IconProps = {
    icon: React.ReactNode;
    count: number;
}

function Icon({ icon, count }: IconProps) {
    return (
        <div className="flex items-center justify-center gap-2 invisible group-hover:visible">
            <h1 className="text-lg font-bold text-gray-300">{count}</h1>
            {icon}
        </div>
    )
}

function VideoCard() {

    return (
        <div className={`${videoAspectRatio} bg-gray-800 rounded-lg flex flex-col items-center justify-center`}>
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 group">
                <div className="flex items-center justify-center gap-4">
                    <Icon icon={<Heart className="size-5" />} count={0} />
                    <Icon icon={<MessageCircle className="size-5" />} count={0} />
                    <Icon icon={<Share className="size-5" />} count={0} />
                </div>
                <Button variant="destructive" className="w-[150px] invisible group-hover:visible">
                    <div className="flex items-center justify-center gap-2">
                        <Trash className="size-5" />
                        Delete
                    </div>
                </Button>
            </div>
        </div>
    )
}

export default function ProfilePage() {

    const { user } = useUser();

    return (

        <div className="w-[50%] flex flex-col items-center justify-center gap-8">
            <div className="pt-[20px] w-full flex flex-col items-center justify-center gap-4">
                <Avatar className="h-[150px] w-[150px]">
                    <AvatarImage src={user?.imageUrl} />
                </Avatar>
                <h1 className="text-lg font-bold text-gray-300">@{user?.username}</h1>
                <p className="text-sm text-gray-300 text-center">I am a software engineer</p>
                <div className="flex items-center justify-center gap-4">
                    <div className="w-[100px] flex flex-col items-center justify-center gap-2">
                        <h1 className="text-lg font-bold text-gray-300">0</h1>
                        <h1 className="text-lg font-bold text-gray-300">Following</h1>
                    </div>
                    <div className="w-[100px] flex flex-col items-center justify-center gap-2">
                        <h1 className="text-lg font-bold text-gray-300">0</h1>
                        <h1 className="text-lg font-bold text-gray-300">Followers</h1>
                    </div>
                    <div className="w-[100px] flex flex-col items-center justify-center gap-2">
                        <h1 className="text-lg font-bold text-gray-300">0</h1>
                        <h1 className="text-lg font-bold text-gray-300">Likes</h1>
                    </div>
                </div>
            </div>
            <div className="w-[50%] flex flex-col items-center justify-center gap-4">
                <div className="flex items-center justify-center gap-4">
                    <Button variant="magenta_outline" className="w-[150px]">
                        <Link href="/account">
                            <div className="flex items-center justify-center gap-2">
                                <Edit className="size-5" />
                                Edit Account
                            </div>
                        </Link>
                    </Button>
                    <Button variant="cyan_outline" className="w-[150px]">
                        <div className="flex items-center justify-center gap-2">
                            <Edit className="size-5" />
                            Edit Profile
                        </div>
                    </Button>
                </div>
            </div>
            <div className="w-full h-[500px]">
                <h1 className="text-lg font-bold text-gray-300 mb-4">My Videos</h1>
                <div className="grid grid-cols-3 gap-10 pb-10">
                    <div className={`flex items-center justify-center ${videoAspectRatio} bg-gray-800 rounded-lg border border-white`}>
                        <Plus className="size-5" />
                    </div>
                </div>
                <VideoCard />
            </div>
        </div>

    )

}