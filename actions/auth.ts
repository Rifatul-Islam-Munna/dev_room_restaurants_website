"use server"
import { PostRequestAxios } from "@/api-hooks/api-hooks";
import { cookies } from "next/headers";

export const loginUser = async (email: string, password: string) => {
    console.log("Form submitted:", email,password);
    const [data, error] = await PostRequestAxios<Record<string, string>>("/user/login",{email,password});
    if(data){
    const cookie = await cookies();
   cookie.set("access_token", data?.access_token || "", {  httpOnly: true,secure: true,path:"/", maxAge:60*60*24*7 });
   cookie.set("user",  JSON.stringify( data?.user) || "", {  httpOnly: true,secure: true,path:"/", maxAge:60*60*24*7 });

    }

    console.log("login-data", data,"login-error",error);
   
   return {data,error};

}

export const getUser = async () => {
    const cookie = await cookies();
    const user = cookie.get("user")?.value;
    return user ? JSON.parse(user) : null;
}

export const logoutUser = async () => {
    const cookie = await cookies();
    cookie.delete("access_token");
    cookie.delete("user");
}

export const isHaveAccessToken = async () => {
    const cookie = await cookies();
    const access_token = cookie.get("access_token")?.value;
    return access_token ? true : false;
}