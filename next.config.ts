import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
  ],
},
output:"standalone",

 typescript:{
  ignoreBuildErrors: true
 },
experimental:{
    proxyClientMaxBodySize: "20mb",
     serverActions: {
      bodySizeLimit: '20mb',
    },
    
},

};

export default nextConfig;
