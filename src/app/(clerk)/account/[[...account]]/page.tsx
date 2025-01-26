import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function AccountPage() {
    return <UserProfile appearance={{ baseTheme: dark }}/>;
}