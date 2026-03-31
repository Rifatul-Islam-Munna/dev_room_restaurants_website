"use server"
import { PostRequestAxios } from "@/api-hooks/api-hooks";
import { cookies } from "next/headers";

export const loginUser = async (email: string, password: string) => {
    const [data, error] = await PostRequestAxios<Record<string, string>>("/user/login",{email,password});
    if(data){
    const cookie = await cookies();
   cookie.set("access_token", data?.access_token || "", {  httpOnly: true,secure: true,path:"/", maxAge:60*60*24*7 });
   cookie.set("user",  JSON.stringify( data?.user) || "", {  httpOnly: true,secure: true,path:"/", maxAge:60*60*24*7 });

    }
   
   return {data,error};

}