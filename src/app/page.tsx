"use client";

const titleClassName = "text-[128px] font-bold italic p-0 m-0";
const spanClassName = "font-bold italic";

const cyan = "text-[#4de8f4]";
const magenta = "text-[#fd3e3e]";

const cyanEffect = "animate-pulse [text-shadow:_0_0_55px_#4de8f4,_0_0_65px_#4de8f4,_0_0_75px_#4de8f4]";
const magentaEffect = "animate-pulse [text-shadow:_0_0_55px_#fd3e3e,_0_0_65px_#fd3e3e,_0_0_75px_#fd3e3e]";

export default function Home() {
	
	return (

		<div className="flex flex-col items-center justify-center gap-2">
			<div className="flex">
				<h1 className={`${titleClassName} ${cyan} ${cyanEffect}`}>Next</h1>
				<h1 className={`${titleClassName} ${magenta} ${magentaEffect}`}>Reel</h1>
			</div>
			<p className="text-lg text-white"><span className={`${spanClassName} ${cyanEffect} ${cyan}`}><a href="/sign-in">Sign In</a></span> or <span className={`${spanClassName} ${magentaEffect} ${magenta}`}><a href="/sign-up">Sign Up</a></span> to get started</p>
		</div>

	)

}
