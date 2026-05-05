import Login from "./login";
import Signup from "./signup"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"


const Auth = () => {
    return (
        <Tabs defaultValue="login" className="flex flex-col items-center justify-center">
            <TabsList className="bg-[#e8e9ec] w-full">
                <TabsTrigger className="font-semibold" value="login">Login</TabsTrigger>
                <TabsTrigger className="font-semibold" value="signup">Signup</TabsTrigger>
            </TabsList>
            <TabsContent className="min-w-[200px] md:min-w-[350px]" value="login">
                <Login />
            </TabsContent>
            <TabsContent className="min-w-[200px] md:min-w-[350px]" value="signup">
                <Signup />
            </TabsContent>
        </Tabs>
    );
};

export default Auth;